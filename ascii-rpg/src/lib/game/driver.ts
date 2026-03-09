import { createGame, handleInput, handleDialogueChoice } from './engine';
import { parseCommand } from './driver-commands';
import { MONSTER_DEFS, createMonster } from './monsters';
import { ITEM_CATALOG, addToInventory } from './items';
import { SPELL_CATALOG } from './spells';
import { RITUAL_CATALOG } from './rituals';
import type { GameState, CharacterConfig, GameMessage, ActiveDialogue, Entity, Quest, NPCMood } from './types';
import type { Item } from './items';

export class GameDriver {
	state: GameState;
	private _messageIndex: number;

	constructor(config?: Partial<CharacterConfig>) {
		const fullConfig: CharacterConfig = {
			name: 'Hero',
			characterClass: 'warrior',
			difficulty: 'normal',
			startingLocation: 'cave',
			worldSeed: 'test-seed',
			...config,
		};
		this.state = createGame(fullConfig);
		this._messageIndex = 0;
	}

	// ==================== INPUT ====================

	key(k: string): this {
		this.state = handleInput(this.state, k);
		return this;
	}

	keys(seq: string): this {
		for (const ch of seq) {
			this.key(ch);
		}
		return this;
	}

	command(input: string): this {
		const parsed = parseCommand(input);
		switch (parsed.type) {
			case 'keys':
				for (const k of parsed.keys) this.key(k);
				break;
			case 'dialog':
				this.choose(parsed.index);
				break;
			case 'inspect':
				this._inspect(parsed.target);
				break;
			case 'unknown':
				if (input.length === 1) {
					this.key(input);
				}
				break;
		}
		return this;
	}

	choose(index: number): this {
		this.state = handleDialogueChoice(this.state, index);
		return this;
	}

	// ==================== OUTPUT ====================

	newMessages(): GameMessage[] {
		const msgs = this.state.messages.slice(this._messageIndex);
		this._messageIndex = this.state.messages.length;
		return msgs;
	}

	log(): string {
		return this.newMessages().map(m => `[${m.type}] ${m.text}`).join('\n');
	}

	get dialog(): ActiveDialogue | null {
		return this.state.activeDialogue;
	}

	get dialogOptions(): string[] {
		if (!this.state.activeDialogue) return [];
		const node = this.state.activeDialogue.tree.nodes[this.state.activeDialogue.currentNodeId];
		return node ? node.options.map(o => o.text) : [];
	}

	// ==================== STATE ACCESS ====================

	get player(): Entity { return this.state.player; }
	get enemies(): Entity[] { return this.state.enemies; }
	get quests(): Quest[] { return this.state.quests; }
	get inventory(): (Item | null)[] { return this.state.inventory; }
	get pos() { return this.state.player.pos; }
	get hp() { return this.state.player.hp; }
	get turn() { return this.state.turnCount; }

	// ==================== CHEATS ====================

	godMode(): this {
		this.state.player.hp = 99999;
		this.state.player.maxHp = 99999;
		this.state.player.attack = 9999;
		this.state.player.mana = 9999;
		this.state.player.maxMana = 9999;
		return this;
	}

	setStats(overrides: Partial<Entity>): this {
		Object.assign(this.state.player, overrides);
		return this;
	}

	killAll(): this {
		this.state.enemies = [];
		return this;
	}

	spawnEnemy(monsterName: string, x: number, y: number): this {
		const def = MONSTER_DEFS.find(m => m.name.toLowerCase() === monsterName.toLowerCase());
		if (def) {
			this.state.enemies.push(createMonster({ x, y }, this.state.level, def));
		}
		return this;
	}

	setLevel(level: number): this {
		this.state.characterLevel = level;
		return this;
	}

	giveItem(itemId: string, count = 1): this {
		const template = ITEM_CATALOG[itemId];
		if (template) {
			for (let i = 0; i < count; i++) {
				addToInventory(this.state.inventory, { ...template });
			}
		}
		return this;
	}

	clearInventory(): this {
		this.state.inventory = Array.from({ length: 12 }, () => null);
		return this;
	}

	teleport(x: number, y: number): this {
		this.state.player.pos = { x, y };
		return this;
	}

	learnSpell(spellId: string): this {
		if (!this.state.learnedSpells.includes(spellId)) {
			this.state.learnedSpells.push(spellId);
		}
		return this;
	}

	learnAllSpells(): this {
		for (const id of Object.keys(SPELL_CATALOG)) {
			if (!this.state.learnedSpells.includes(id)) {
				this.state.learnedSpells.push(id);
			}
		}
		return this;
	}

	learnRitual(ritualId: string): this {
		if (!this.state.learnedRituals.includes(ritualId)) {
			this.state.learnedRituals.push(ritualId);
		}
		return this;
	}

	learnAllRituals(): this {
		for (const id of Object.keys(RITUAL_CATALOG)) {
			if (!this.state.learnedRituals.includes(id)) {
				this.state.learnedRituals.push(id);
			}
		}
		return this;
	}

	addRumor(id: string, text: string): this {
		if (!this.state.rumors.some(r => r.id === id)) {
			this.state.rumors.push({ id, text, source: 'cheat', accuracy: 'true' });
		}
		return this;
	}

	setNpcMood(npcName: string, mood: NPCMood): this {
		const npc = this.state.npcs.find(n => n.name.toLowerCase() === npcName.toLowerCase());
		if (npc) {
			npc.mood = mood;
			npc.moodTurns = 0;
		}
		return this;
	}

	graduateAcademy(): this {
		this.state.academyState = {
			enrolled: true,
			enrolledAtTurn: 0,
			lessonsCompleted: ['lesson1', 'lesson2', 'lesson3', 'lesson4', 'lesson5', 'lesson6'],
			nextLessonIndex: 6,
			nextLessonAvailableTurn: 0,
			examTaken: true,
			examPassed: true,
			examPart1Passed: true,
			graduated: true,
			isTeaching: false,
			teachingSessions: 0,
			teachingCooldownTurn: 0,
		};
		return this;
	}

	completeQuest(questId: string): this {
		const quest = this.state.quests.find(q => q.id === questId);
		if (quest) {
			quest.status = 'completed';
			quest.objectives.forEach(o => { o.completed = true; o.current = o.required; });
			if (!this.state.completedQuestIds.includes(questId)) {
				this.state.completedQuestIds.push(questId);
			}
		}
		return this;
	}

	// ==================== DIALOGUE HELPERS ====================

	/** Close any active dialogue */
	closeDialog(): this {
		this.state.activeDialogue = null;
		return this;
	}

	/** Get the NPC text of the current dialogue node */
	get dialogText(): string {
		if (!this.state.activeDialogue) return '';
		const node = this.state.activeDialogue.tree.nodes[this.state.activeDialogue.currentNodeId];
		return node?.npcText ?? '';
	}

	/** Get current dialogue node ID */
	get dialogNodeId(): string | null {
		return this.state.activeDialogue?.currentNodeId ?? null;
	}

	/** Teleport adjacent to an NPC and walk into them to open dialogue */
	talkTo(npcName: string): this {
		this.killAll(); // clear enemies that might block dialogue
		const npc = this.state.npcs.find(n => n.name.toLowerCase() === npcName.toLowerCase());
		if (!npc) return this;
		// Teleport one tile west of NPC, then walk east into them
		this.teleport(npc.pos.x - 1, npc.pos.y);
		this.key('d');
		return this;
	}

	// ==================== TIME ====================

	/** Advance game time by n turns (fast-forward without processing each turn) */
	advanceTurns(n: number): this {
		this.state.turnCount += n;
		return this;
	}

	// ==================== INSPECT (private) ====================

	private _inspect(target: string): void {
		const s = this.state;
		let info = '';
		switch (target) {
			case 'status':
				info = `${s.player.name} (${s.characterConfig.characterClass}) Lv${s.characterLevel}\n`
					+ `HP: ${s.player.hp}/${s.player.maxHp} | ATK: ${s.player.attack}\n`
					+ `Mana: ${s.player.mana ?? 0}/${s.player.maxMana ?? 0}\n`
					+ `XP: ${s.xp} | Turn: ${s.turnCount}\n`
					+ `Pos: (${s.player.pos.x}, ${s.player.pos.y}) | Level: ${s.level}\n`
					+ `STR:${s.player.str ?? 0} INT:${s.player.int ?? 0} WIL:${s.player.wil ?? 0} AGI:${s.player.agi ?? 0} VIT:${s.player.vit ?? 0}`;
				break;
			case 'quests':
				info = s.quests.length === 0 ? 'No active quests.'
					: s.quests.map(q => `[${q.status}] ${q.title}: ${q.objectives.map(o => `${o.description} (${o.current}/${o.required})`).join(', ')}`).join('\n');
				break;
			case 'look': {
				const nearby = s.enemies.filter(e =>
					Math.abs(e.pos.x - s.player.pos.x) <= 3 && Math.abs(e.pos.y - s.player.pos.y) <= 3
				);
				const npcsNear = s.npcs.filter(n =>
					Math.abs(n.pos.x - s.player.pos.x) <= 3 && Math.abs(n.pos.y - s.player.pos.y) <= 3
				);
				info = `Location: ${s.currentLocationId ?? 'unknown'} (level ${s.level})\n`
					+ `Enemies nearby: ${nearby.length === 0 ? 'none' : nearby.map(e => `${e.name}(${e.hp}hp) at (${e.pos.x},${e.pos.y})`).join(', ')}\n`
					+ `NPCs nearby: ${npcsNear.length === 0 ? 'none' : npcsNear.map(n => `${n.name} at (${n.pos.x},${n.pos.y})`).join(', ')}`;
				break;
			}
			case 'inventory':
				info = s.inventory.map((item, i) => item ? `[${i}] ${item.name}` : null).filter(Boolean).join('\n') || 'Inventory empty.';
				break;
			case 'spells':
				info = s.learnedSpells.length === 0 ? 'No spells learned.'
					: s.learnedSpells.join(', ');
				break;
			case 'map':
				info = `Location: ${s.currentLocationId ?? 'overworld'} | Mode: ${s.locationMode} | Level: ${s.level}`;
				break;
		}
		if (info) {
			this.state.messages.push({ text: info, type: 'info' });
		}
	}
}
