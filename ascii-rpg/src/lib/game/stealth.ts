import type { Position, Entity, CharacterClass, AlertState, EnemyAwareness, StealthState, GameState } from './types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const STEALTH_BASE_DETECTION_RADIUS = 6;
export const BACKSTAB_MULTIPLIER = 3;
export const ROGUE_BACKSTAB_MULTIPLIER = 5;
export const NOISE_WALK = 2;
export const NOISE_COMBAT = 8;
export const STEALTH_SPEED_PENALTY = 0.5;
export const DETECTION_THRESHOLD = 100;
export const SUSPICION_DECAY_TURNS = 3;

// Noise radii for each action type
const NOISE_MAP: Record<string, number> = {
	walk: NOISE_WALK,
	combat: NOISE_COMBAT,
	ability: 5,
	rest: 0,
	interact: 1,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function distance(a: Position, b: Position): number {
	const dx = a.x - b.x;
	const dy = a.y - b.y;
	return Math.sqrt(dx * dx + dy * dy);
}

function isAdjacent(a: Position, b: Position): boolean {
	return Math.abs(a.x - b.x) <= 1 && Math.abs(a.y - b.y) <= 1 && !(a.x === b.x && a.y === b.y);
}

// ---------------------------------------------------------------------------
// Core stealth functions
// ---------------------------------------------------------------------------

/**
 * Attempt to enter stealth mode. Fails if any enemy is adjacent to the player.
 * Rogues receive a bonus message acknowledging their class proficiency.
 */
export function enterStealth(state: GameState): { success: boolean; message: string } {
	const playerPos = state.player.pos;

	// Cannot enter stealth if enemies are adjacent
	const adjacentEnemy = state.enemies.find(
		(e) => e.hp > 0 && isAdjacent(playerPos, e.pos)
	);
	if (adjacentEnemy) {
		return { success: false, message: 'Cannot hide — enemies are too close!' };
	}

	state.stealth.isHidden = true;
	state.stealth.backstabReady = true;
	state.stealth.noiseLevel = 0;
	state.stealth.lastNoisePos = null;

	const isRogue = state.characterConfig.characterClass === 'rogue';
	const message = isRogue
		? 'You melt into the shadows. Backstab ready.'
		: 'You attempt to hide in the shadows.';

	return { success: true, message };
}

/**
 * Break stealth and reset stealth-related state.
 */
export function exitStealth(state: GameState): void {
	state.stealth.isHidden = false;
	state.stealth.backstabReady = false;
	state.stealth.noiseLevel = 0;
	state.stealth.lastNoisePos = null;
}

/**
 * Calculate a detection score (0–100) representing how likely an enemy
 * is to detect the player on this turn.
 *
 * Factors:
 *  - Distance (closer = higher detection)
 *  - Light level (0 = dark, 1 = bright; darkness reduces detection)
 *  - Player stealth bonus from skills/equipment (reduces detection)
 *  - Current noise level (increases detection)
 *  - Enemy awareness state (suspicious / alert enemies detect better)
 *  - Hidden status (large reduction when hidden)
 */
export function calculateDetectionChance(
	enemy: Entity,
	playerPos: Position,
	isHidden: boolean,
	lightLevel: number,
	stealthBonus: number,
	noiseLevel: number
): number {
	const dist = distance(enemy.pos, playerPos);

	// Beyond base detection radius, no detection (before modifiers)
	if (dist > STEALTH_BASE_DETECTION_RADIUS * 2) return 0;

	// Base score: inverse distance — adjacent = 100, at detection radius = ~17
	const distanceFactor = Math.max(0, 1 - dist / STEALTH_BASE_DETECTION_RADIUS);
	let score = distanceFactor * 100;

	// Light level: darkness halves detection, bright light gives full
	// lightLevel is 0 (dark) to 1 (bright)
	const lightModifier = 0.5 + lightLevel * 0.5; // range 0.5–1.0
	score *= lightModifier;

	// Hiding halves the detection score
	if (isHidden) {
		score *= 0.5;
	}

	// Noise increases detection — noise of 8 adds up to 40 points
	score += noiseLevel * 5;

	// Stealth bonus from equipment/skills reduces score
	score -= stealthBonus;

	// Awareness state modifier — suspicious and alert enemies detect better
	const awareness = enemy.awareness;
	if (awareness) {
		switch (awareness.alertState) {
			case 'suspicious':
				score *= 1.25;
				break;
			case 'alert':
				score *= 1.5;
				break;
			case 'combat':
				score *= 2.0;
				break;
		}
	}

	return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Update an enemy's awareness based on the current detection score.
 * The detection meter fills over time. When it reaches the threshold
 * the enemy escalates its alert state. When the player is not detected
 * the meter decays and the enemy eventually returns to unaware.
 */
export function updateEnemyAwareness(
	enemy: Entity,
	detectionScore: number
): { stateChanged: boolean; newState: AlertState; message: string } {
	initializeAwareness(enemy);
	const awareness = enemy.awareness!;
	const prevState = awareness.alertState;

	if (detectionScore > 0) {
		// Fill the detection meter
		awareness.detectionMeter = Math.min(
			DETECTION_THRESHOLD,
			awareness.detectionMeter + detectionScore
		);
		awareness.suspicionTurns = 0;
	} else {
		// Decay — increment suspicion turns, reduce meter after grace period
		awareness.suspicionTurns++;
		if (awareness.suspicionTurns >= SUSPICION_DECAY_TURNS) {
			awareness.detectionMeter = Math.max(0, awareness.detectionMeter - 20);
		}
	}

	// Determine new alert state from meter level
	let newState: AlertState;
	if (awareness.detectionMeter >= DETECTION_THRESHOLD) {
		newState = 'combat';
	} else if (awareness.detectionMeter >= DETECTION_THRESHOLD * 0.7) {
		newState = 'alert';
	} else if (awareness.detectionMeter >= DETECTION_THRESHOLD * 0.3) {
		newState = 'suspicious';
	} else {
		newState = 'unaware';
	}

	awareness.alertState = newState;

	const stateChanged = prevState !== newState;
	let message = '';
	if (stateChanged) {
		switch (newState) {
			case 'suspicious':
				message = `${enemy.name} seems suspicious.`;
				break;
			case 'alert':
				message = `${enemy.name} is looking for you!`;
				break;
			case 'combat':
				message = `${enemy.name} spotted you!`;
				break;
			case 'unaware':
				message = `${enemy.name} lost interest.`;
				break;
		}
	}

	return { stateChanged, newState, message };
}

/**
 * Calculate backstab damage. Only applies when attacking from stealth.
 * Rogues get a 5x multiplier; all other classes get 3x.
 */
export function calculateBackstabDamage(
	baseDamage: number,
	characterClass: CharacterClass,
	isFromStealth: boolean
): { damage: number; isCritical: boolean } {
	if (!isFromStealth) {
		return { damage: baseDamage, isCritical: false };
	}

	const multiplier =
		characterClass === 'rogue' ? ROGUE_BACKSTAB_MULTIPLIER : BACKSTAB_MULTIPLIER;

	return {
		damage: baseDamage * multiplier,
		isCritical: true,
	};
}

/**
 * Generate a noise radius for a given action, reduced by equipment bonuses.
 */
export function generateNoise(
	actionType: 'walk' | 'combat' | 'ability' | 'rest' | 'interact',
	equipmentNoiseReduction: number
): number {
	const baseNoise = NOISE_MAP[actionType] ?? 0;
	return Math.max(0, baseNoise - equipmentNoiseReduction);
}

/**
 * Main per-turn stealth processing. For each living enemy, calculate
 * detection and update awareness, collecting messages about state changes.
 */
export function processStealthTurn(
	state: GameState,
	enemies: Entity[],
	lightLevel: number,
	stealthBonus: number,
	noiseReduction: number
): string[] {
	const messages: string[] = [];
	const playerPos = state.player.pos;
	const isHidden = state.stealth.isHidden;
	const noiseLevel = state.stealth.noiseLevel;

	for (const enemy of enemies) {
		if (enemy.hp <= 0) continue;

		initializeAwareness(enemy);

		const score = calculateDetectionChance(
			enemy,
			playerPos,
			isHidden,
			lightLevel,
			stealthBonus,
			noiseLevel
		);

		const result = updateEnemyAwareness(enemy, score);

		if (result.stateChanged && result.message) {
			messages.push(result.message);
		}

		// If an enemy enters combat, update last known position and break stealth
		if (result.newState === 'combat') {
			enemy.awareness!.lastKnownPlayerPos = { x: playerPos.x, y: playerPos.y };
			if (isHidden) {
				exitStealth(state);
				messages.push('You have been detected!');
			}
		}
	}

	// Reduce noise level over time (natural decay)
	state.stealth.noiseLevel = Math.max(0, state.stealth.noiseLevel - noiseReduction - 1);

	return messages;
}

// ---------------------------------------------------------------------------
// Display helpers
// ---------------------------------------------------------------------------

/**
 * Return a symbol to display above an enemy indicating their alert state.
 */
export function getAlertSymbol(state: AlertState): string {
	switch (state) {
		case 'suspicious':
			return '?';
		case 'alert':
			return '!';
		case 'combat':
			return '!!';
		case 'unaware':
		default:
			return '';
	}
}

/**
 * Return a display color for the given alert state.
 */
export function getAlertColor(state: AlertState): string {
	switch (state) {
		case 'suspicious':
			return '#ffff00'; // yellow
		case 'alert':
			return '#ff8800'; // orange
		case 'combat':
			return '#ff0000'; // red
		case 'unaware':
		default:
			return '#888888'; // grey
	}
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

/**
 * Quick check whether an enemy is currently aware of the player
 * (alert or combat state).
 */
export function isEnemyAwareOfPlayer(enemy: Entity): boolean {
	if (!enemy.awareness) return false;
	return enemy.awareness.alertState === 'alert' || enemy.awareness.alertState === 'combat';
}

/**
 * Initialise default awareness on an enemy that doesn't have one yet.
 */
export function initializeAwareness(enemy: Entity): void {
	if (enemy.awareness) return;
	enemy.awareness = {
		alertState: 'unaware',
		detectionMeter: 0,
		lastKnownPlayerPos: null,
		suspicionTurns: 0,
	};
}
