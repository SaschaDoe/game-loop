import type { GameState, Entity, Position } from './types';
import { addMessage, handlePlayerDeath, checkLevelUp, processAchievements, effectiveSightRadius } from './engine-utils';
import { moveEnemies, processKill } from './combat';
import { SPELL_CATALOG, getSpellDef, executeSpell, effectiveManaCost, FORBIDDEN_SCHOOLS, createTerrainEffects } from './spells';
import type { ArmorWeight, ForbiddenSchool } from './spells';
import { getEquippedArmorWeight, CLASS_PROFILES } from './magic';
import { addMasteryXP, checkForbiddenThreshold, getMasteryLevel, canCastTier } from './mastery';
import { RITUAL_CATALOG, getRitualDef, hasReagents, getMissingReagents, consumeReagents, rollInterruption } from './rituals';
import type { RitualDef } from './rituals';
import { hasEffect } from './status-effects';
import { getTimePhase } from './day-night';
import { updateVisibility } from './fov';

// ---------------------------------------------------------------------------
// Terrain effects (moved from engine-utils.ts)
// ---------------------------------------------------------------------------

/** Tick terrain effects: apply damage to entities standing on them, decrement durations */
export function tickTerrainEffects(state: GameState): void {
	if (!state.terrainEffects) return;

	for (const effect of state.terrainEffects) {
		if (effect.damagePerTurn > 0) {
			// Damage player if standing on it
			if (state.player.pos.x === effect.pos.x && state.player.pos.y === effect.pos.y) {
				state.player.hp -= effect.damagePerTurn;
				addMessage(state, `You take ${effect.damagePerTurn} damage from ${effect.type} ground!`, 'damage_taken');
			}
			// Damage enemies standing on it
			for (const enemy of state.enemies) {
				if (enemy.pos.x === effect.pos.x && enemy.pos.y === effect.pos.y) {
					enemy.hp -= effect.damagePerTurn;
					if (enemy.hp <= 0) {
						addMessage(state, `${enemy.name} is killed by ${effect.type} ground!`, 'magic');
					}
				}
			}
		}
		effect.duration--;
	}

	state.terrainEffects = state.terrainEffects.filter(e => e.duration > 0);
}

// ---------------------------------------------------------------------------
// Ritual interrupt check (moved from engine-utils.ts)
// ---------------------------------------------------------------------------

/** Check for ritual interrupt when player takes damage */
export function checkRitualInterrupt(state: GameState, _damageAmount: number): void {
	if (!state.ritualChanneling || state.ritualChanneling.turnsRemaining <= 0) return;

	const ritual = getRitualDef(state.ritualChanneling.ritualId);
	if (rollInterruption()) {
		// Interrupted — consume mana + reagents
		if (ritual) {
			state.player.mana = (state.player.mana ?? 0) - ritual.manaCost;
			consumeReagents(state.inventory, ritual);
		}
		state.ritualChanneling = null;
		addMessage(state, 'Your concentration shatters — the ritual fails!', 'damage_taken');
	} else {
		addMessage(state, 'You hold your focus despite the blow!', 'magic');
	}
}

// ---------------------------------------------------------------------------
// Learn spell / ritual
// ---------------------------------------------------------------------------

/** Export: teach the player a spell (costs 1 talent point) */
export function learnSpell(state: GameState, spellId: string): boolean {
	if (state.learnedSpells.includes(spellId)) return false;
	if (!SPELL_CATALOG[spellId]) return false;

	// Talent point cost
	if (state.skillPoints <= 0) {
		addMessage(state, 'You need a talent point to learn this spell!', 'warning');
		return false;
	}

	const spell = SPELL_CATALOG[spellId];
	const charClass = state.characterConfig.characterClass;

	// Paladin block: cannot learn shadow or any forbidden school
	if (charClass === 'paladin' && (spell.school === 'shadow' || (FORBIDDEN_SCHOOLS as readonly string[]).includes(spell.school))) {
		addMessage(state, `Your paladin oath forbids learning ${spell.name}!`, 'warning');
		return false;
	}

	// Forbidden learning costs
	if (spell.isForbidden) {
		switch (spell.school) {
			case 'blood':
				state.forbiddenCosts.maxHpLost += 2;
				state.player.maxHp = Math.max(1, state.player.maxHp - 2);
				if (state.player.hp > state.player.maxHp) state.player.hp = state.player.maxHp;
				addMessage(state, 'Learning blood magic costs you 2 max HP.', 'damage_taken');
				break;
			case 'necromancy':
				state.forbiddenCosts.corruption += 1;
				addMessage(state, 'Necromantic knowledge corrupts your soul. (Corruption +1)', 'warning');
				break;
			case 'void_magic':
				state.forbiddenCosts.sanityLost += 5;
				addMessage(state, 'Void knowledge erodes your sanity. (Sanity lost +5)', 'warning');
				break;
			case 'chronomancy':
				state.forbiddenCosts.paradoxBaseline += 10;
				addMessage(state, 'Temporal knowledge raises your paradox baseline. (+10)', 'warning');
				break;
			case 'soul':
				state.forbiddenCosts.soulCapLost += 1;
				addMessage(state, 'Soul magic diminishes your spiritual capacity. (Soul cap -1)', 'warning');
				break;
		}
	}

	state.skillPoints--;
	state.learnedSpells.push(spellId);
	// Auto-assign to first empty quick-cast slot
	const emptySlot = state.quickCastSlots.indexOf(null);
	if (emptySlot !== -1) {
		state.quickCastSlots[emptySlot] = spellId;
	}
	addMessage(state, `You have learned ${spell.name}!`, 'magic');

	// Check forbidden magic threshold
	if ((FORBIDDEN_SCHOOLS as readonly string[]).includes(spell.school)) {
		const threshold = checkForbiddenThreshold(state.learnedSpells, spell.school as ForbiddenSchool, SPELL_CATALOG as unknown as Record<string, { school: string }>);
		if (threshold && !state.forbiddenPassives.includes(threshold.passiveName)) {
			state.forbiddenPassives.push(threshold.passiveName);
			addMessage(state, `Dark power awakens: ${threshold.passiveName} — ${threshold.description}`, 'magic');
		}
	}

	return true;
}

/** Learn a ritual (costs 1 talent point) — moved from engine-utils.ts */
export function learnRitual(state: GameState, ritualId: string): boolean {
	if (state.learnedRituals.includes(ritualId)) return false;
	if (!RITUAL_CATALOG[ritualId]) return false;

	// Talent point cost
	if (state.skillPoints <= 0) {
		addMessage(state, 'You need a talent point to learn this ritual!', 'warning');
		return false;
	}

	state.skillPoints--;
	state.learnedRituals.push(ritualId);
	const ritual = RITUAL_CATALOG[ritualId];
	addMessage(state, `You have learned the ritual: ${ritual.name}!`, 'magic');
	return true;
}

// ---------------------------------------------------------------------------
// Spell casting helpers (moved from engine.ts)
// ---------------------------------------------------------------------------

function applyTerrainEffectsFromSpell(state: GameState, spell: { element?: string; baseDamage: number }, targetPos: Position): void {
	if (!state.terrainEffects) state.terrainEffects = [];
	const newEffects = createTerrainEffects(spell as Parameters<typeof createTerrainEffects>[0], targetPos);
	for (const effect of newEffects) {
		// Fire removes frozen terrain at same position
		if (effect.type === 'burning') {
			state.terrainEffects = state.terrainEffects.filter(
				e => !(e.type === 'frozen' && e.pos.x === effect.pos.x && e.pos.y === effect.pos.y)
			);
		}
		// Ice removes burning terrain at same position
		if (effect.type === 'frozen') {
			state.terrainEffects = state.terrainEffects.filter(
				e => !(e.type === 'burning' && e.pos.x === effect.pos.x && e.pos.y === effect.pos.y)
			);
		}
		state.terrainEffects.push(effect);
	}
}

function handleSpellKills(state: GameState, killed: Entity[]): void {
	for (const enemy of killed) {
		processKill(state, enemy);
	}
	state.enemies = state.enemies.filter(e => !killed.includes(e));
	if (killed.length > 0) {
		checkLevelUp(state);
		processAchievements(state);
	}
}

function castSpellById(state: GameState, spellId: string): GameState {
	const spell = getSpellDef(spellId);
	if (!spell) {
		addMessage(state, 'Unknown spell!', 'warning');
		return { ...state };
	}

	if (hasEffect(state.player, 'stun')) {
		addMessage(state, 'You are stunned and cannot cast!', 'damage_taken');
		moveEnemies(state);
		return { ...state };
	}

	// Dead zone check: no spells can be cast
	if (state.leyLineLevel === 0) {
		addMessage(state, 'The magic fizzles! This is a dead zone — no spells can be cast here.', 'warning');
		return { ...state };
	}

	// Check cooldown
	if (state.spellCooldowns[spellId] > 0) {
		addMessage(state, `${spell.name} on cooldown (${state.spellCooldowns[spellId]} turns).`, 'warning');
		return { ...state };
	}

	// Check mana — apply specialization bonuses to armor weight and cost
	let armorWeight = getEquippedArmorWeight(state.equipment, CLASS_PROFILES[state.characterConfig.characterClass]);
	// Battlemage: treat medium armor as light for mana cost
	if (state.specialization === 'battlemage' && armorWeight === 'medium') {
		armorWeight = 'light';
	}
	let cost = effectiveManaCost(spell, armorWeight);
	// Archmage: -20% mana cost
	if (state.specialization === 'archmage') {
		cost = Math.max(1, Math.floor(cost * 0.8));
	}
	if ((state.player.mana ?? 0) < cost) {
		addMessage(state, `Not enough mana! (need ${cost}, have ${state.player.mana ?? 0})`, 'warning');
		return { ...state };
	}

	// Tier gating check
	const schoolXP = state.schoolMastery[spell.school] ?? 0;
	const masteryLvl = getMasteryLevel(schoolXP);
	if (!canCastTier(spell.tier, masteryLvl, state.characterLevel, spell.isForbidden ?? false)) {
		addMessage(state, `Your ${spell.school} mastery is too low to cast ${spell.name} (tier ${spell.tier}).`, 'warning');
		return { ...state };
	}

	// HP cost check (blood magic)
	if (spell.hpCost && spell.hpCost > 0) {
		if (state.player.hp <= spell.hpCost) {
			addMessage(state, `Not enough HP! (need >${spell.hpCost}, have ${state.player.hp})`, 'warning');
			return { ...state };
		}
		state.player.hp -= spell.hpCost;
		addMessage(state, `You sacrifice ${spell.hpCost} HP to cast ${spell.name}.`, 'damage_taken');
	}

	const charClass = state.characterConfig.characterClass;
	const leyLevel = state.leyLineLevel ?? 2;
	const timePhase = getTimePhase(state.turnCount);
	const isOutdoor = state.locationMode === 'overworld';

	// Self-targeting spells cast immediately
	if (spell.targetType === 'self') {
		// AoE self-centered: hit all enemies in radius
		let targets: Entity[] = [];
		if (spell.aoeRadius > 0 && (spell.baseDamage > 0 || spell.statusEffect)) {
			const { x: px, y: py } = state.player.pos;
			targets = state.enemies.filter(e =>
				Math.abs(e.pos.x - px) <= spell.aoeRadius && Math.abs(e.pos.y - py) <= spell.aoeRadius
			);
		}
		const result = executeSpell(spell, state.player, targets, armorWeight, leyLevel, timePhase, isOutdoor);
		for (const msg of result.messages) addMessage(state, msg.text, msg.type);
		if (result.success) {
			state.spellCooldowns[spell.id] = spell.cooldown;
			handleSpellKills(state, result.killedEnemies);
			state.schoolMastery = addMasteryXP(state.schoolMastery as any, spell.school as any, 5, charClass) as unknown as Record<string, number>;
			// Create terrain effects at target positions (self-centered AoE)
			for (const target of targets) {
				applyTerrainEffectsFromSpell(state, spell, target.pos);
			}
			// True Sight: activate ley line vision on overworld
			if (spell.id === 'spell_true_sight') {
				state.trueSightActive = 10;
			}
			// Reveal Secrets: ping nearby ley line tiles
			if (spell.id === 'spell_reveal_secrets' && state.locationMode === 'overworld' && state.worldMap) {
				const worldMap = state.worldMap as any;
				const pos = state.overworldPos!;
				state.revealedLeyLineTiles = new Set();
				for (let dy = -5; dy <= 5; dy++) {
					for (let dx = -5; dx <= 5; dx++) {
						const tx = pos.x + dx;
						const ty = pos.y + dy;
						if (tx >= 0 && ty >= 0 && tx < worldMap.width && ty < worldMap.height) {
							if (worldMap.tiles[ty][tx].leyLine) {
								state.revealedLeyLineTiles.add(`${tx},${ty}`);
							}
						}
					}
				}
				if (state.revealedLeyLineTiles.size > 0) {
					addMessage(state, 'You sense streams of magical energy flowing through the earth!', 'magic');
				}
			}
		}
		state.spellMenuOpen = false;
		moveEnemies(state);
		return { ...state };
	}

	// Directional/targeted spells enter targeting mode
	if (spell.targetType === 'single_enemy' || spell.targetType === 'direction') {
		state.spellTargeting = { spellId: spell.id, targetType: spell.targetType };
		state.spellMenuOpen = false;
		addMessage(state, `${spell.name}: Choose a direction (WASD). Escape to cancel.`, 'magic');
		return { ...state };
	}

	// Area targeting: enter cursor mode
	if (spell.targetType === 'area') {
		state.spellTargeting = { spellId: spell.id, targetType: 'area', cursorPos: { ...state.player.pos } };
		state.spellMenuOpen = false;
		addMessage(state, `${spell.name}: Move cursor (WASD), Enter to cast, Escape to cancel.`, 'magic');
		return { ...state };
	}

	// Fallback: cast on self
	const result = executeSpell(spell, state.player, [], armorWeight, leyLevel, timePhase, isOutdoor);
	for (const msg of result.messages) addMessage(state, msg.text, msg.type);
	if (result.success) {
		state.spellCooldowns[spell.id] = spell.cooldown;
		state.schoolMastery = addMasteryXP(state.schoolMastery as any, spell.school as any, 5, charClass) as unknown as Record<string, number>;
	}
	state.spellMenuOpen = false;
	moveEnemies(state);
	return { ...state };
}

function castSpellFromMenu(state: GameState, menuIndex: number): GameState {
	if (menuIndex < 0 || menuIndex >= state.learnedSpells.length) return state;
	const spellId = state.learnedSpells[menuIndex];
	return castSpellById(state, spellId);
}

/** Export for external use (assign quick-cast slots) */
export function assignQuickCast(state: GameState, slot: number, spellId: string): GameState {
	if (slot < 0 || slot > 3) return state;
	if (!state.learnedSpells.includes(spellId)) return state;
	state.quickCastSlots[slot] = spellId;
	const spell = getSpellDef(spellId);
	addMessage(state, `${spell?.name ?? spellId} assigned to slot ${slot + 1}.`, 'info');
	return { ...state };
}

// ---------------------------------------------------------------------------
// Ritual helpers (moved from engine.ts)
// ---------------------------------------------------------------------------

/** Begin channeling a ritual */
function beginRitual(state: GameState, ritualId: string): void {
	const ritual = getRitualDef(ritualId);
	if (!ritual) {
		addMessage(state, 'Unknown ritual.', 'warning');
		return;
	}
	if (state.ritualChanneling) {
		addMessage(state, 'You are already channeling a ritual!', 'warning');
		return;
	}
	if ((state.player.mana ?? 0) < ritual.manaCost) {
		addMessage(state, `Not enough mana! (need ${ritual.manaCost}, have ${state.player.mana ?? 0})`, 'warning');
		return;
	}
	if (!hasReagents(state.inventory, ritual)) {
		const missing = getMissingReagents(state.inventory, ritual);
		const names = missing.map(m => `${m.quantity}x ${m.itemId}`).join(', ');
		addMessage(state, `Missing reagents: ${names}`, 'warning');
		return;
	}

	if (ritual.effectType === 'seal') {
		// Special state for direction picking (turnsRemaining = -1)
		state.ritualChanneling = { ritualId, turnsRemaining: -1, turnsTotal: ritual.castTurns };
		addMessage(state, 'Choose a direction to seal (WASD/arrows). Escape to cancel.', 'magic');
		return;
	}

	// Normal channeling
	state.ritualChanneling = { ritualId, turnsRemaining: ritual.castTurns, turnsTotal: ritual.castTurns };
	addMessage(state, `You begin channeling ${ritual.name}... (${ritual.castTurns} turns)`, 'magic');
	state.spellMenuOpen = false;
	moveEnemies(state);
}

/** Tick ritual channeling — called when player presses any key during channeling */
function tickRitualChanneling(state: GameState): void {
	if (!state.ritualChanneling || state.ritualChanneling.turnsRemaining <= 0) return;

	state.ritualChanneling.turnsRemaining--;

	if (state.ritualChanneling.turnsRemaining > 0) {
		const ritual = getRitualDef(state.ritualChanneling.ritualId);
		addMessage(state, `Channeling ${ritual?.name ?? 'ritual'}... (${state.ritualChanneling.turnsRemaining} turns remaining)`, 'magic');
		return;
	}

	// Channeling complete (turnsRemaining === 0)
	const ritual = getRitualDef(state.ritualChanneling.ritualId);
	if (!ritual) {
		state.ritualChanneling = null;
		return;
	}

	// Special handling for seal — converts tile to wall
	if (ritual.effectType === 'seal') {
		const sealTarget = (state.ritualChanneling as any).sealTarget;
		if (sealTarget) {
			state.map.tiles[sealTarget.y][sealTarget.x] = '#';
		}
		// Consume mana + reagents
		state.player.mana = (state.player.mana ?? 0) - ritual.manaCost;
		consumeReagents(state.inventory, ritual);
		addMessage(state, 'Ancient stone surges from the ground — the passage is sealed!', 'magic');
		state.ritualChanneling = null;
		return;
	}

	// Consume mana + reagents
	state.player.mana = (state.player.mana ?? 0) - ritual.manaCost;
	consumeReagents(state.inventory, ritual);
	addMessage(state, `${ritual.name} complete!`, 'magic');
	applyRitualEffect(state, ritual);
	state.ritualChanneling = null;
}

/** Apply the effect of a completed ritual */
function applyRitualEffect(state: GameState, ritual: RitualDef): void {
	switch (ritual.effectType) {
		case 'ward': {
			state.activeWards.push({
				center: { x: state.player.pos.x, y: state.player.pos.y },
				radius: 2,
				damage: 5,
				turnsRemaining: 50,
			});
			addMessage(state, 'A protective ward shimmers into existence around you!', 'magic');
			break;
		}
		case 'summon': {
			if (state.activeSummon) {
				addMessage(state, 'Your previous familiar fades away...', 'info');
			}
			const adjPos = findAdjacentFloor(state, state.player.pos.x, state.player.pos.y);
			if (!adjPos) {
				addMessage(state, 'There is no space to summon a familiar!', 'warning');
				break;
			}
			state.activeSummon = {
				pos: adjPos,
				char: 'f',
				color: '#c8f',
				name: 'Arcane Familiar',
				hp: 3,
				maxHp: 3,
				attack: 2,
				statusEffects: [],
			};
			addMessage(state, 'An Arcane Familiar materializes beside you!', 'magic');
			break;
		}
		case 'scry': {
			state.scriedLevel = state.level + 1;
			addMessage(state, 'Visions of the level below flood your mind. The layout will be revealed when you descend.', 'magic');
			break;
		}
		case 'purify': {
			const px = state.player.pos.x;
			const py = state.player.pos.y;
			const before = state.hazards.length;
			state.hazards = state.hazards.filter(h => {
				const dx = Math.abs(h.pos.x - px);
				const dy = Math.abs(h.pos.y - py);
				return dx > 3 || dy > 3;
			});
			const removed = before - state.hazards.length;
			if (removed > 0) {
				addMessage(state, `Purifying light washes over the area — ${removed} hazard${removed > 1 ? 's' : ''} cleansed!`, 'magic');
			} else {
				addMessage(state, 'The purification finds no hazards nearby.', 'info');
			}
			break;
		}
		case 'teleport_anchor': {
			state.teleportAnchors[state.level] = { x: state.player.pos.x, y: state.player.pos.y };
			addMessage(state, 'A glowing circle inscribes itself into the floor. You can return here at will.', 'magic');
			break;
		}
		case 'seal': {
			// Seal effect is applied during direction picking flow, not here
			break;
		}
	}
}

/** Find an adjacent floor tile that isn't occupied */
function findAdjacentFloor(state: GameState, x: number, y: number): Position | null {
	const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
	for (const [dx, dy] of dirs) {
		const nx = x + dx;
		const ny = y + dy;
		if (nx < 0 || ny < 0 || nx >= state.map.width || ny >= state.map.height) continue;
		if (state.map.tiles[ny][nx] !== '.') continue;
		if (state.enemies.some(e => e.pos.x === nx && e.pos.y === ny)) continue;
		if (state.npcs.some(n => n.pos.x === nx && n.pos.y === ny)) continue;
		return { x: nx, y: ny };
	}
	return null;
}

// ---------------------------------------------------------------------------
// Input handlers for spell/ritual modes (extracted from engine.ts handleInput)
// ---------------------------------------------------------------------------

/** Handle input when spell targeting is active */
export function handleSpellTargeting(state: GameState, key: string): GameState {
	if (key === 'Escape') {
		state.spellTargeting = null;
		addMessage(state, 'Spell cancelled.', 'info');
		return { ...state };
	}
	const targeting = state.spellTargeting!;
	const spell = getSpellDef(targeting.spellId);
	if (!spell) { state.spellTargeting = null; return { ...state }; }

	if (targeting.targetType === 'single_enemy' || targeting.targetType === 'direction') {
		let tdx = 0, tdy = 0;
		if (key === 'w' || key === 'ArrowUp') tdy = -1;
		else if (key === 's' || key === 'ArrowDown') tdy = 1;
		else if (key === 'a' || key === 'ArrowLeft') tdx = -1;
		else if (key === 'd' || key === 'ArrowRight') tdx = 1;
		else return state;

		const tx = state.player.pos.x + tdx;
		const ty = state.player.pos.y + tdy;

		if (targeting.targetType === 'single_enemy') {
			const target = state.enemies.find(e => e.pos.x === tx && e.pos.y === ty);
			if (!target) {
				addMessage(state, 'No enemy in that direction.', 'warning');
				return { ...state };
			}
			const armorWeight = getEquippedArmorWeight(state.equipment, CLASS_PROFILES[state.characterConfig.characterClass]);

			// Counter-spell check: if target is channeling, attempt to interrupt
			if (target.channeling) {
				const enemySpell = getSpellDef(target.channeling.spellId);
				let counterChance = 0.40; // base: any spell
				if (spell.school === enemySpell?.school) counterChance = 0.60;
				if (spell.id === 'spell_dispel') counterChance = 0.80;
				// Opposing elements
				if ((spell.element === 'fire' && enemySpell?.element === 'ice') ||
					(spell.element === 'ice' && enemySpell?.element === 'fire') ||
					(spell.element === 'lightning' && enemySpell?.element === 'shadow') ||
					(spell.element === 'holy' && enemySpell?.element === 'shadow')) {
					counterChance = 1.0;
				}

				if (Math.random() < counterChance) {
					target.channeling = null;
					addMessage(state, `Your ${spell.name} counters ${target.name}'s ${enemySpell?.name ?? 'spell'}! It fizzles!`, 'magic');
					// Consume mana and set cooldown
					state.player.mana = (state.player.mana ?? 0) - effectiveManaCost(spell, armorWeight);
					state.spellCooldowns[spell.id] = spell.cooldown;
					state.spellTargeting = null;
					moveEnemies(state);
					return { ...state };
				} else {
					addMessage(state, `You failed to counter ${target.name}'s ${enemySpell?.name ?? 'spell'}!`, 'warning');
					// Fall through to normal spell execution
				}
			}

			const tLeyLevel = state.leyLineLevel ?? 2;
			const tTimePhase = getTimePhase(state.turnCount);
			const tIsOutdoor = state.locationMode === 'overworld';
			const result = executeSpell(spell, state.player, [target], armorWeight, tLeyLevel, tTimePhase, tIsOutdoor);
			for (const msg of result.messages) addMessage(state, msg.text, msg.type);
			if (result.success) {
				state.spellCooldowns[spell.id] = spell.cooldown;
				handleSpellKills(state, result.killedEnemies);
				// Create terrain effects at target position
				applyTerrainEffectsFromSpell(state, spell, { x: tx, y: ty });
			}
		}

		state.spellTargeting = null;
		moveEnemies(state);
		return { ...state };
	}

	if (targeting.targetType === 'area') {
		if (key === 'Enter' || key === ' ') {
			// Cast at cursor position
			const cursorPos = targeting.cursorPos ?? state.player.pos;
			const radius = spell.aoeRadius;
			const targets = state.enemies.filter(e =>
				Math.abs(e.pos.x - cursorPos.x) <= radius && Math.abs(e.pos.y - cursorPos.y) <= radius
			);

			const armorWeight = getEquippedArmorWeight(state.equipment, CLASS_PROFILES[state.characterConfig.characterClass]);
			const charClass = state.characterConfig.characterClass;
			const result = executeSpell(spell, state.player, targets, armorWeight);
			for (const msg of result.messages) addMessage(state, msg.text, msg.type);
			if (result.success) {
				state.spellCooldowns[spell.id] = spell.cooldown;
				handleSpellKills(state, result.killedEnemies);
				state.schoolMastery = addMasteryXP(state.schoolMastery as any, spell.school as any, 5, charClass) as unknown as Record<string, number>;
			}
			state.spellTargeting = null;
			moveEnemies(state);
			return { ...state };
		}

		// Move cursor
		let cdx = 0, cdy = 0;
		if (key === 'w' || key === 'ArrowUp') cdy = -1;
		else if (key === 's' || key === 'ArrowDown') cdy = 1;
		else if (key === 'a' || key === 'ArrowLeft') cdx = -1;
		else if (key === 'd' || key === 'ArrowRight') cdx = 1;
		else return state;

		const cursor = targeting.cursorPos ?? state.player.pos;
		const newX = cursor.x + cdx;
		const newY = cursor.y + cdy;
		// Keep cursor within range (e.g., 8 tiles from player)
		const maxRange = 8;
		if (Math.abs(newX - state.player.pos.x) <= maxRange && Math.abs(newY - state.player.pos.y) <= maxRange) {
			state.spellTargeting = { ...targeting, cursorPos: { x: newX, y: newY } };
		}
		return { ...state };
	}
	return state;
}

/** Handle input when ritual channeling is active */
export function handleRitualChanneling(state: GameState, key: string): GameState {
	// Active channeling (turnsRemaining > 0) — only Escape cancels
	if (state.ritualChanneling!.turnsRemaining > 0) {
		if (key === 'Escape') {
			const ritual = getRitualDef(state.ritualChanneling!.ritualId);
			if (ritual) {
				state.player.mana = (state.player.mana ?? 0) - ritual.manaCost;
				consumeReagents(state.inventory, ritual);
			}
			state.ritualChanneling = null;
			addMessage(state, 'You break your concentration — the ritual fails!', 'damage_taken');
			return { ...state };
		}
		// Any other key continues channeling
		tickRitualChanneling(state);
		moveEnemies(state);
		return { ...state };
	}

	// Seal direction picking (turnsRemaining === -1) — WASD/arrows pick target, Escape cancels
	if (state.ritualChanneling!.turnsRemaining === -1) {
		if (key === 'Escape') {
			state.ritualChanneling = null;
			addMessage(state, 'Seal ritual cancelled.', 'info');
			return { ...state };
		}
		let sdx = 0, sdy = 0;
		if (key === 'w' || key === 'ArrowUp') sdy = -1;
		else if (key === 's' || key === 'ArrowDown') sdy = 1;
		else if (key === 'a' || key === 'ArrowLeft') sdx = -1;
		else if (key === 'd' || key === 'ArrowRight') sdx = 1;
		else return state;

		const tx = state.player.pos.x + sdx;
		const ty = state.player.pos.y + sdy;
		if (tx < 0 || ty < 0 || tx >= state.map.width || ty >= state.map.height) {
			addMessage(state, 'Cannot seal outside the map.', 'warning');
			return { ...state };
		}
		const targetTile = state.map.tiles[ty][tx];
		if (targetTile !== '.' && targetTile !== '>') {
			addMessage(state, 'You can only seal passable tiles.', 'warning');
			return { ...state };
		}
		if (state.enemies.some(e => e.pos.x === tx && e.pos.y === ty) ||
			state.npcs.some(n => n.pos.x === tx && n.pos.y === ty) ||
			(state.activeSummon && state.activeSummon.hp > 0 && state.activeSummon.pos.x === tx && state.activeSummon.pos.y === ty)) {
			addMessage(state, 'There is something in the way!', 'warning');
			return { ...state };
		}

		const ritual = getRitualDef(state.ritualChanneling!.ritualId)!;
		state.ritualChanneling = { ritualId: state.ritualChanneling!.ritualId, turnsRemaining: ritual.castTurns, turnsTotal: ritual.castTurns };
		(state.ritualChanneling as any).sealTarget = { x: tx, y: ty };
		addMessage(state, `You begin channeling ${ritual.name}... (${ritual.castTurns} turns)`, 'magic');
		state.spellMenuOpen = false;
		moveEnemies(state);
		return { ...state };
	}

	return state;
}

/** Handle input when spell menu is open */
export function handleSpellMenu(state: GameState, key: string): GameState {
	if (key === 'Escape' || key === 'm') {
		state.spellMenuOpen = false;
		return { ...state };
	}
	if (key === 'w' || key === 'ArrowUp') {
		state.spellMenuCursor = Math.max(0, state.spellMenuCursor - 1);
		return { ...state };
	}
	if (key === 's' || key === 'ArrowDown') {
		state.spellMenuCursor = Math.min(state.learnedSpells.length + state.learnedRituals.length - 1, state.spellMenuCursor + 1);
		return { ...state };
	}
	if (key === 'Enter' || key === ' ') {
		if (state.spellMenuCursor >= state.learnedSpells.length) {
			const ritualIdx = state.spellMenuCursor - state.learnedSpells.length;
			const ritualId = state.learnedRituals[ritualIdx];
			if (ritualId) {
				beginRitual(state, ritualId);
				return { ...state };
			}
			return state;
		}
		return castSpellFromMenu(state, state.spellMenuCursor);
	}
	return state;
}

// ---------------------------------------------------------------------------
// Quick-cast from handleInput (used by engine.ts)
// ---------------------------------------------------------------------------

/** Cast a spell by quick-cast slot (1-4 keys). Exported for engine.ts handleInput. */
export function quickCast(state: GameState, slotIndex: number): GameState {
	const spellId = state.quickCastSlots[slotIndex];
	if (!spellId) {
		addMessage(state, `Quick-cast slot ${slotIndex + 1} is empty. Open spell menu (M) to assign.`, 'info');
		return { ...state };
	}
	return castSpellById(state, spellId);
}
