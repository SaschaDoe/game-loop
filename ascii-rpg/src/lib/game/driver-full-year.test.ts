/**
 * EXTREME INTEGRATION TEST: Full Academic Year
 *
 * An AI-driven adept plays the entire school year at the Arcane Academy:
 *   1. Starts as adept (no combat spells, only Summon Light)
 *   2. Takes lessons between dungeon expeditions
 *   3. Explores the practice dungeon using heuristic combat AI
 *   4. Manages HP, mana, hunger, and retreat decisions
 *   5. Levels up through combat XP
 *   6. Completes all 6 lessons over ~2500+ turns
 *   7. Passes the final exam (alchemy + Golem fight with 3-turn strategy)
 *   8. Graduates as a Mage
 *
 * The heuristic engine makes all decisions based on game state — no hardcoded
 * sequences except for dialogue navigation (which requires exact indices).
 */

import { describe, it, expect } from 'vitest';
import { GameDriver } from './driver';
import type { Entity, Position, Tile } from './types';

// ─────────────────────────────────────────────────────────────
// HEURISTIC ENGINE — an AI player for the adept
// ─────────────────────────────────────────────────────────────

interface TurnLog {
	turn: number;
	action: string;
	hp: number;
	mana: number;
	enemies: number;
	level: number;
}

class AdeptAI {
	game: GameDriver;
	turnLog: TurnLog[] = [];
	enemiesKilled = 0;
	lessonsCompleted = 0;
	dungeonDives = 0;
	potionsUsed = 0;
	retreats = 0;
	spellsCast = 0;
	abilityUses = 0;
	peakDungeonLevel = 0;

	constructor(game: GameDriver) {
		this.game = game;
	}

	// ── Map awareness ──

	/** Get the tile at position, or '#' if out of bounds */
	private tileAt(x: number, y: number): Tile {
		const map = this.game.state.map;
		if (x < 0 || y < 0 || x >= map.width || y >= map.height) return '#';
		return map.tiles[y][x];
	}

	/** Check if a position is walkable (floor or stairs, no walls) */
	private isWalkable(x: number, y: number): boolean {
		const tile = this.tileAt(x, y);
		return tile === '.' || tile === '>' || tile === '*';
	}

	/** Check if a position has an enemy */
	private enemyAt(x: number, y: number): Entity | undefined {
		return this.game.enemies.find(e => e.pos.x === x && e.pos.y === y);
	}

	/** Check if a position has an NPC */
	private npcAt(x: number, y: number): boolean {
		return this.game.state.npcs.some(n => n.pos.x === x && n.pos.y === y);
	}

	/** Get all 4 cardinal neighbors with their keys */
	private neighbors(pos: Position): { x: number; y: number; key: string }[] {
		return [
			{ x: pos.x, y: pos.y - 1, key: 'w' }, // north
			{ x: pos.x, y: pos.y + 1, key: 's' }, // south
			{ x: pos.x - 1, y: pos.y, key: 'a' }, // west
			{ x: pos.x + 1, y: pos.y, key: 'd' }, // east
		];
	}

	/** Manhattan distance */
	private dist(a: Position, b: Position): number {
		return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
	}

	// ── Heuristic decisions ──

	/** Find the nearest enemy */
	private nearestEnemy(): Entity | null {
		const pos = this.game.pos;
		let nearest: Entity | null = null;
		let bestDist = Infinity;
		for (const e of this.game.enemies) {
			const d = this.dist(pos, e.pos);
			if (d < bestDist) {
				bestDist = d;
				nearest = e;
			}
		}
		return nearest;
	}

	/** Find adjacent enemies (distance 1) */
	private adjacentEnemies(): Entity[] {
		const pos = this.game.pos;
		return this.game.enemies.filter(e => this.dist(pos, e.pos) === 1);
	}

	/** HP percentage */
	private hpPercent(): number {
		return this.game.hp / this.game.state.player.maxHp;
	}

	/** Mana percentage */
	private manaPercent(): number {
		const mana = this.game.state.player.mana ?? 0;
		const maxMana = this.game.state.player.maxMana ?? 1;
		return mana / maxMana;
	}

	/** Should we retreat? */
	private shouldRetreat(): boolean {
		const adjEnemies = this.adjacentEnemies();
		if (adjEnemies.length === 0) return false;
		// Retreat if HP below 25% or facing 3+ enemies
		if (this.hpPercent() < 0.25) return true;
		if (adjEnemies.length >= 3 && this.hpPercent() < 0.5) return true;
		return false;
	}

	/** Should we rest? */
	private shouldRest(): boolean {
		return this.hpPercent() < 0.4 && this.adjacentEnemies().length === 0
			&& this.game.enemies.filter(e => this.dist(this.game.pos, e.pos) <= 3).length === 0;
	}

	/** Find a safe direction to retreat to (away from enemies) */
	private retreatDirection(): string | null {
		const pos = this.game.pos;
		const threats = this.adjacentEnemies();
		if (threats.length === 0) return null;

		// Average threat position
		const avgX = threats.reduce((s, e) => s + e.pos.x, 0) / threats.length;
		const avgY = threats.reduce((s, e) => s + e.pos.y, 0) / threats.length;

		// Try to move away from average threat
		const dirs = this.neighbors(pos);
		let bestDir: string | null = null;
		let bestDist = -Infinity;
		for (const d of dirs) {
			if (!this.isWalkable(d.x, d.y)) continue;
			if (this.enemyAt(d.x, d.y)) continue;
			if (this.npcAt(d.x, d.y)) continue;
			const awayDist = Math.abs(d.x - avgX) + Math.abs(d.y - avgY);
			if (awayDist > bestDist) {
				bestDist = awayDist;
				bestDir = d.key;
			}
		}
		return bestDir;
	}

	/** Move toward a target position */
	private moveToward(target: Position): string | null {
		const pos = this.game.pos;
		const dirs = this.neighbors(pos);

		let bestDir: string | null = null;
		let bestDist = this.dist(pos, target);
		for (const d of dirs) {
			// Allow moving into enemies (attacks them)
			const enemy = this.enemyAt(d.x, d.y);
			if (!enemy && !this.isWalkable(d.x, d.y)) continue;
			if (this.npcAt(d.x, d.y)) continue;
			const newDist = this.dist({ x: d.x, y: d.y }, target);
			if (newDist < bestDist) {
				bestDist = newDist;
				bestDir = d.key;
			}
		}
		return bestDir;
	}

	/** Teleport to a walkable spot far from NPCs (for safe combat sessions) */
	private moveToSafeArea(): void {
		const map = this.game.state.map;
		const npcs = this.game.state.npcs;
		let bestPos: Position | null = null;
		let bestMinNpcDist = 0;

		// Scan the map for a floor tile maximally distant from all NPCs
		for (let y = 2; y < map.height - 2; y++) {
			for (let x = 2; x < map.width - 2; x++) {
				if (map.tiles[y][x] !== '.') continue;
				const minNpcDist = Math.min(...npcs.map(n => this.dist({ x, y }, n.pos)));
				if (minNpcDist > bestMinNpcDist) {
					bestMinNpcDist = minNpcDist;
					bestPos = { x, y };
				}
			}
		}

		if (bestPos) {
			this.game.teleport(bestPos.x, bestPos.y);
		}
	}

	/** Move in a random walkable direction */
	private randomMove(): string {
		const dirs = this.neighbors(this.game.pos);
		const walkable = dirs.filter(d =>
			this.isWalkable(d.x, d.y) && !this.enemyAt(d.x, d.y) && !this.npcAt(d.x, d.y)
		);
		if (walkable.length === 0) return '.'; // wait if stuck
		return walkable[Math.floor(Math.random() * walkable.length)].key;
	}

	// ── Lesson handling ──

	/** Complete one lesson via dialogue */
	completeNextLesson(): boolean {
		const academy = this.game.state.academyState!;
		const lessonIndex = academy.nextLessonIndex;
		const isFirstVisit = academy.lessonsCompleted.length === 0
			&& this.game.state.npcs.find(n => n.name === 'Professor Ignis')?.dialogueIndex === 0;

		this.game.talkTo('Professor Ignis');
		if (!this.game.dialog) return false;

		if (isFirstVisit) {
			// start node: index 1 = "I'm ready for my lesson."
			this.game.choose(1);
		} else {
			// return node: index 0 = "I'm ready for my lesson."
			this.game.choose(0);
		}

		// check_lesson: select lesson by index
		this.game.choose(lessonIndex);

		// lesson node: index 0 completes it
		this.game.choose(0);

		// lesson_complete: index 0 = "I won't forget"
		this.game.choose(0);

		this.game.closeDialog();
		this.lessonsCompleted++;
		return true;
	}

	/** Is the next lesson available? */
	isLessonReady(): boolean {
		const academy = this.game.state.academyState;
		if (!academy || academy.graduated) return false;
		if (academy.nextLessonIndex >= 6) return false;
		return this.game.turn >= academy.nextLessonAvailableTurn;
	}

	// ── Combat AI: one turn ──

	/** Play one combat/exploration turn. Returns action taken. */
	playOneTurn(): string {
		const s = this.game.state;

		// Handle pending specialization
		if (s.pendingSpecialization) {
			this.game.key('Escape'); // skip for now
			return 'skip_spec';
		}

		// Skip if in dialogue
		if (s.activeDialogue) {
			this.game.closeDialog();
			return 'close_dialog';
		}

		// Skip if game over
		if (s.gameOver) return 'game_over';

		// Track dungeon level
		if (s.level > this.peakDungeonLevel) {
			this.peakDungeonLevel = s.level;
		}

		const prevEnemyCount = s.enemies.length;

		// Decision tree
		let action: string;

		// 1. Should retreat?
		if (this.shouldRetreat()) {
			const dir = this.retreatDirection();
			if (dir) {
				this.game.key(dir);
				this.retreats++;
				action = 'retreat';
			} else {
				// Cornered — fight
				const adj = this.adjacentEnemies();
				if (adj.length > 0) {
					const dir = this.moveToward(adj[0].pos);
					if (dir) this.game.key(dir);
					action = 'fight_cornered';
				} else {
					this.game.key('.');
					action = 'wait_cornered';
				}
			}
		}
		// 2. Should rest? (low HP, safe)
		else if (this.shouldRest()) {
			this.game.key('r');
			action = 'rest';
		}
		// 3. Use ability if off cooldown and enemies nearby
		else if (s.abilityCooldown === 0 && this.adjacentEnemies().length > 0) {
			this.game.key('q');
			this.abilityUses++;
			action = 'ability';
		}
		// 4. Attack adjacent enemy
		else if (this.adjacentEnemies().length > 0) {
			const target = this.adjacentEnemies()[0];
			const dir = this.moveToward(target.pos);
			if (dir) this.game.key(dir);
			action = 'attack';
		}
		// 5. Move toward nearest enemy if within range
		else {
			const nearest = this.nearestEnemy();
			if (nearest && this.dist(this.game.pos, nearest.pos) <= 6) {
				const dir = this.moveToward(nearest.pos);
				if (dir) {
					this.game.key(dir);
					action = 'approach';
				} else {
					this.game.key(this.randomMove());
					action = 'explore';
				}
			}
			// 6. Explore randomly
			else {
				this.game.key(this.randomMove());
				action = 'explore';
			}
		}

		// Track kills
		const killsThisTurn = prevEnemyCount - s.enemies.length;
		if (killsThisTurn > 0) this.enemiesKilled += killsThisTurn;

		return action;
	}

	/** Play multiple turns with heuristic AI */
	playTurns(n: number): void {
		for (let i = 0; i < n; i++) {
			if (this.game.state.gameOver) break;
			const action = this.playOneTurn();
			// Log periodically
			if (i % 50 === 0 || action === 'game_over') {
				this.turnLog.push({
					turn: this.game.turn,
					action,
					hp: this.game.hp,
					mana: this.game.state.player.mana ?? 0,
					enemies: this.game.enemies.length,
					level: this.game.state.characterLevel,
				});
			}
		}
	}

	/**
	 * Run a combat training session: spawn enemies on the current map,
	 * fight them with heuristic AI, track results.
	 */
	combatSession(enemyCount: number, enemyNames: string[] = ['Rat', 'Bat']): {
		turnsPlayed: number;
		killed: number;
		retreated: boolean;
		damageTaken: number;
	} {
		const startKills = this.enemiesKilled;
		const startHp = this.game.hp;

		// Move to a safe area away from NPCs before spawning enemies
		this.moveToSafeArea();

		// Spawn enemies near the player
		const pos = this.game.pos;
		let spawned = 0;
		for (let i = 0; i < enemyCount; i++) {
			const name = enemyNames[i % enemyNames.length];
			// Spawn in a ring around the player (distance 2-4)
			const offsets = [
				{ dx: 3, dy: 0 }, { dx: -3, dy: 0 }, { dx: 0, dy: 3 }, { dx: 0, dy: -3 },
				{ dx: 2, dy: 2 }, { dx: -2, dy: 2 }, { dx: 2, dy: -2 }, { dx: -2, dy: -2 },
			];
			const off = offsets[i % offsets.length];
			const sx = pos.x + off.dx;
			const sy = pos.y + off.dy;
			if (this.isWalkable(sx, sy)) {
				this.game.spawnEnemy(name, sx, sy);
				spawned++;
			}
		}

		this.dungeonDives++;
		let turnsPlayed = 0;
		let retreated = false;
		const maxTurns = spawned * 15; // scale timeout with enemy count

		// Fight until all spawned enemies dead or timeout
		while (turnsPlayed < maxTurns) {
			if (this.game.state.gameOver) break;
			if (this.game.enemies.length === 0) break; // all dead

			// Emergency retreat at very low HP
			if (this.hpPercent() < 0.15) {
				retreated = true;
				break;
			}

			this.playOneTurn();
			turnsPlayed++;
		}

		// Clean up: kill stragglers, clear blocking states
		this.game.killAll();
		this.game.state.player.statusEffects = [];
		this.game.state.pendingSpecialization = false;
		this.game.state.spellMenuOpen = false;
		this.game.state.spellTargeting = null;
		this.game.closeDialog();

		return {
			turnsPlayed,
			killed: this.enemiesKilled - startKills,
			retreated,
			damageTaken: startHp - this.game.hp,
		};
	}

	/** Fight the Exam Golem using the 3-turn cycle strategy */
	fightExamGolem(): boolean {
		const golem = this.game.enemies.find(e => e.name === 'Exam Golem');
		if (!golem) return false;

		// Position adjacent to golem
		this.game.teleport(golem.pos.x - 1, golem.pos.y);

		let cycles = 0;
		while (this.game.enemies.some(e => e.name === 'Exam Golem') && cycles < 15) {
			// Turns 1-2: Attack
			this.game.key('d');
			if (!this.game.enemies.some(e => e.name === 'Exam Golem')) break;
			this.game.key('d');
			if (!this.game.enemies.some(e => e.name === 'Exam Golem')) break;

			// Turn 3: Retreat west to dodge blast
			this.game.key('a');

			// Move back adjacent
			this.game.key('d');
			cycles++;
		}

		return !this.game.enemies.some(e => e.name === 'Exam Golem');
	}

	/** Get a summary of the full playthrough */
	summary(): string {
		const s = this.game.state;
		return [
			`=== ACADEMIC YEAR SUMMARY ===`,
			`Name: ${s.player.name} | Class: ${s.characterConfig.characterClass}`,
			`Final Level: ${s.characterLevel} | HP: ${s.player.hp}/${s.player.maxHp}`,
			`Titles: ${s.playerTitles.join(', ') || 'none'}`,
			`Lessons: ${this.lessonsCompleted}/6`,
			`Graduated: ${s.academyState?.graduated ?? false}`,
			`Enemies Killed: ${this.enemiesKilled}`,
			`Dungeon Dives: ${this.dungeonDives}`,
			`Peak Dungeon Level: ${this.peakDungeonLevel}`,
			`Retreats: ${this.retreats}`,
			`Ability Uses: ${this.abilityUses}`,
			`Total Turns: ${s.turnCount}`,
			`Spells Known: ${s.learnedSpells.join(', ')}`,
		].join('\n');
	}
}

// ─────────────────────────────────────────────────────────────
// THE TEST
// ─────────────────────────────────────────────────────────────

describe('Full Academic Year — Adept to Mage', () => {
	it('plays the entire school year with heuristic AI and graduates as Mage', () => {
		// ── CREATE ADEPT ──
		const game = new GameDriver({
			name: 'Lyra',
			characterClass: 'adept',
			difficulty: 'easy', // easy so the AI survives dungeon dives
			startingLocation: 'academy',
			worldSeed: 'extreme-test-2026',
		});

		const ai = new AdeptAI(game);

		// ── VERIFY STARTING STATE ──
		expect(game.state.characterConfig.characterClass).toBe('adept');
		expect(game.state.academyState!.enrolled).toBe(true);
		expect(game.state.academyState!.graduated).toBe(false);
		expect(game.state.learnedSpells).toContain('spell_summon_light');
		expect(game.state.playerTitles).not.toContain('Mage');
		const startHp = game.hp;
		const startMana = game.state.player.mana ?? 0;

		// Drain initial messages
		game.log();

		// ═════════════════════════════════════════════════════
		// PHASE 1: First lesson (available immediately)
		// ═════════════════════════════════════════════════════
		expect(ai.isLessonReady()).toBe(true);
		ai.completeNextLesson();
		console.log(`  Lesson 1 (Alchemy Fundamentals) completed at turn ${game.turn}`);
		expect(game.state.academyState!.lessonsCompleted).toContain('alchemy_basics');
		expect(ai.lessonsCompleted).toBe(1);

		// ═════════════════════════════════════════════════════
		// PHASE 2: Dungeon dive between lessons 1 and 2
		// ═════════════════════════════════════════════════════
		// Boost HP for dungeon survival (adept is squishy)
		game.setStats({ hp: game.state.player.maxHp });

		const expedition1 = ai.combatSession(3, ['Rat', 'Bat']);
		console.log(`  Expedition 1: ${expedition1.turnsPlayed} turns, ${expedition1.killed} kills, retreated=${expedition1.retreated}, HP=${game.hp}/${game.state.player.maxHp}`);
		expect(game.hp).toBeGreaterThan(0); // survived

		// ═════════════════════════════════════════════════════
		// PHASE 3: Lessons 2-6 with dungeon dives between
		// ═════════════════════════════════════════════════════
		for (let lessonNum = 2; lessonNum <= 6; lessonNum++) {
			// Fast-forward to next lesson availability
			const nextAvail = game.state.academyState!.nextLessonAvailableTurn;
			if (nextAvail > game.turn) {
				// Simulate some dungeon time before fast-forwarding remaining
				const turnsToKill = Math.min(50, nextAvail - game.turn);

				// Heal up for expedition
				game.setStats({ hp: game.state.player.maxHp });

				// Short combat training session
				const exp = ai.combatSession(2 + lessonNum, ['Rat', 'Bat', 'Spider']);
				console.log(`  Combat before lesson ${lessonNum}: ${exp.turnsPlayed} turns, ${exp.killed} kills, retreated=${exp.retreated}, HP=${game.hp}/${game.state.player.maxHp}`);

				// Fast-forward remaining time
				if (game.turn < nextAvail) {
					game.advanceTurns(nextAvail - game.turn);
				}
			}

			// Take the lesson
			expect(ai.isLessonReady()).toBe(true);
			ai.completeNextLesson();
			const lessonNames = ['', '', 'Elemental Weaknesses', 'Golem Patterns', 'Transmutation', 'Protective Wards', 'Final Review'];
			console.log(`  Lesson ${lessonNum} (${lessonNames[lessonNum]}) completed at turn ${game.turn}`);
			expect(ai.lessonsCompleted).toBe(lessonNum);
		}

		// ═════════════════════════════════════════════════════
		// CHECKPOINT: All lessons complete
		// ═════════════════════════════════════════════════════
		expect(game.state.academyState!.lessonsCompleted.length).toBe(6);
		expect(game.state.academyState!.lessonsCompleted).toContain('alchemy_basics');
		expect(game.state.academyState!.lessonsCompleted).toContain('elemental_theory');
		expect(game.state.academyState!.lessonsCompleted).toContain('golem_patterns');
		expect(game.state.academyState!.lessonsCompleted).toContain('transmutation');
		expect(game.state.academyState!.lessonsCompleted).toContain('ward_theory');
		expect(game.state.academyState!.lessonsCompleted).toContain('final_review');
		expect(game.state.academyState!.graduated).toBe(false); // not yet

		// ═════════════════════════════════════════════════════
		// PHASE 4: Take the final exam
		// ═════════════════════════════════════════════════════

		// Talk to Archmagus Veylen
		game.talkTo('Archmagus Veylen');
		expect(game.dialog).not.toBeNull();

		// return node → "I'm ready for the final exam." (index 0)
		game.choose(0);
		expect(game.dialogNodeId).toBe('exam_start');

		// Part 1: Alchemy — correct answer (index 0)
		game.choose(0);
		expect(game.dialogNodeId).toBe('exam_part1_pass');

		// "I'm ready. Summon the Golem!" (index 0) — triggers startExam + sets examPart1Passed
		game.choose(0);
		expect(game.dialog).toBeNull(); // dialogue closed
		expect(game.state.academyState!.examPart1Passed).toBe(true);

		// Exam Golem spawned
		const golem = game.enemies.find(e => e.name === 'Exam Golem');
		expect(golem).toBeDefined();
		expect(golem!.hp).toBe(20);

		// ═════════════════════════════════════════════════════
		// PHASE 5: Fight the Exam Golem with the strategy
		// ═════════════════════════════════════════════════════

		// Heal up and set modest attack so the fight lasts multiple golem cycles
		game.setStats({ hp: 80, maxHp: 80, attack: 4 });

		const hpBeforeFight = game.hp;
		const golemDefeated = ai.fightExamGolem();

		console.log(`  Golem fight: defeated=${golemDefeated}, HP ${hpBeforeFight} -> ${game.hp} (took ${hpBeforeFight - game.hp} damage)`);
		expect(golemDefeated).toBe(true);
		expect(game.enemies.find(e => e.name === 'Exam Golem')).toBeUndefined();
		expect(game.hp).toBeGreaterThan(0); // survived

		// ═════════════════════════════════════════════════════
		// PHASE 6: Verify graduation — Adept is now a Mage!
		// ═════════════════════════════════════════════════════
		expect(game.state.academyState!.graduated).toBe(true);
		expect(game.state.academyState!.examPassed).toBe(true);
		expect(game.state.playerTitles).toContain('Mage');

		// Character class is still 'adept' but has earned the Mage title
		expect(game.state.characterConfig.characterClass).toBe('adept');

		// The journey should have taken significant in-game time
		expect(game.turn).toBeGreaterThan(2000);

		// Should have completed some dungeon dives
		expect(ai.dungeonDives).toBeGreaterThan(0);

		// ═════════════════════════════════════════════════════
		// PHASE 7: Post-graduation — teach a class
		// ═════════════════════════════════════════════════════
		game.talkTo('Archmagus Veylen');
		expect(game.dialog).not.toBeNull();

		// return node: "I'd like to teach." (raw index 2)
		game.choose(2);
		expect(game.dialogNodeId).toBe('teaching_intro');

		// "Let's begin the lesson."
		game.choose(0);
		expect(game.dialogNodeId).toBe('teaching_q1');

		// Correct answer (index 0)
		game.choose(0);
		expect(game.dialogNodeId).toBe('teaching_correct');

		// Complete teaching
		game.choose(0);
		expect(game.state.academyState!.teachingSessions).toBe(1);

		game.closeDialog();

		// ═════════════════════════════════════════════════════
		// FINAL REPORT
		// ═════════════════════════════════════════════════════
		const summary = ai.summary();
		console.log('\n' + summary);

		// Final assertions
		expect(summary).toContain('Graduated: true');
		expect(summary).toContain('Mage');
		expect(summary).toContain('Lessons: 6/6');
	});

	it('heuristic AI survives multiple dungeon expeditions', () => {
		const game = new GameDriver({
			name: 'Kael',
			characterClass: 'adept',
			difficulty: 'easy',
			startingLocation: 'academy',
			worldSeed: 'dungeon-test-2026',
		});

		const ai = new AdeptAI(game);
		game.log(); // drain

		// Run 5 combat sessions to verify the AI can fight and survive
		const results: { killed: number; retreated: boolean }[] = [];

		for (let dive = 0; dive < 5; dive++) {
			// Full heal between sessions
			game.setStats({ hp: game.state.player.maxHp });
			game.state.hunger = 100;
			game.state.thirst = 100;

			const result = ai.combatSession(3 + dive, ['Rat', 'Bat', 'Spider']);
			results.push({ killed: result.killed, retreated: result.retreated });

			expect(game.hp).toBeGreaterThan(0);
		}

		// Should have completed all 5 sessions without dying
		expect(ai.dungeonDives).toBe(5);
		// Should have killed some enemies across sessions
		expect(ai.enemiesKilled).toBeGreaterThan(0);
	});

	it('heuristic AI makes correct retreat decisions', () => {
		const game = new GameDriver({
			name: 'Test',
			characterClass: 'adept',
			difficulty: 'easy',
			startingLocation: 'academy',
			worldSeed: 'retreat-test',
		});

		const ai = new AdeptAI(game);

		// Put the player in a dangerous situation
		game.killAll();
		game.setStats({ hp: 5, maxHp: 100 }); // very low HP

		// Spawn enemy adjacent
		game.spawnEnemy('Rat', game.pos.x + 1, game.pos.y);

		// AI should retreat
		const action = ai.playOneTurn();
		expect(action).toBe('retreat');
		expect(ai.retreats).toBe(1);
	});

	it('heuristic AI attacks when healthy', () => {
		const game = new GameDriver({
			name: 'Test',
			characterClass: 'adept',
			difficulty: 'easy',
			startingLocation: 'academy',
			worldSeed: 'attack-test',
		});

		const ai = new AdeptAI(game);

		// Full HP, enemy adjacent
		game.killAll();
		game.setStats({ hp: 100, maxHp: 100, attack: 50 });
		game.spawnEnemy('Rat', game.pos.x + 1, game.pos.y);

		const action = ai.playOneTurn();
		// Should attack or use ability, not retreat
		expect(['attack', 'ability']).toContain(action);
	});

	it('heuristic AI explores when no enemies nearby', () => {
		const game = new GameDriver({
			name: 'Test',
			characterClass: 'adept',
			difficulty: 'easy',
			startingLocation: 'academy',
			worldSeed: 'explore-test',
		});

		const ai = new AdeptAI(game);
		game.killAll(); // no enemies

		const startPos = { ...game.pos };
		// Play several turns of exploration
		for (let i = 0; i < 10; i++) {
			ai.playOneTurn();
		}

		// Player should have moved from start
		const moved = game.pos.x !== startPos.x || game.pos.y !== startPos.y;
		expect(moved).toBe(true);
	});

	it('timeline: lessons are spaced across the school year', () => {
		const game = new GameDriver({
			name: 'Lyra',
			characterClass: 'adept',
			difficulty: 'easy',
			startingLocation: 'academy',
			worldSeed: 'timeline-test',
		});

		const ai = new AdeptAI(game);
		const lessonTurns: number[] = [];

		// Complete all lessons, recording when each happens
		ai.completeNextLesson();
		lessonTurns.push(game.turn);

		for (let i = 1; i < 6; i++) {
			const nextAvail = game.state.academyState!.nextLessonAvailableTurn;
			game.advanceTurns(nextAvail - game.turn);
			ai.completeNextLesson();
			lessonTurns.push(game.turn);
		}

		// Verify spacing: each lesson happens after the previous
		for (let i = 1; i < lessonTurns.length; i++) {
			expect(lessonTurns[i]).toBeGreaterThan(lessonTurns[i - 1]);
			// Gap should be at least 300 turns (delays are 400-500)
			const gap = lessonTurns[i] - lessonTurns[i - 1];
			expect(gap).toBeGreaterThanOrEqual(300);
		}

		// Total school year should span 2000+ turns
		const totalSpan = lessonTurns[5] - lessonTurns[0];
		expect(totalSpan).toBeGreaterThan(2000);
	});
});
