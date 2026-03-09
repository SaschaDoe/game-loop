import { describe, it, expect } from 'vitest';
import { GameDriver } from './driver';

describe('GameDriver', () => {
	describe('core', () => {
		it('creates a game and provides state access', () => {
			const game = new GameDriver();
			expect(game.state).toBeDefined();
			expect(game.state.player.hp).toBeGreaterThan(0);
			expect(game.state.gameOver).toBe(false);
		});

		it('accepts raw key input and returns this for chaining', () => {
			const game = new GameDriver();
			const result = game.key('.');
			expect(result).toBe(game);
		});

		it('accepts multiple keys via keys()', () => {
			const game = new GameDriver();
			game.keys('...');
		});

		it('captures new messages', () => {
			const game = new GameDriver();
			const msgs = game.newMessages();
			expect(msgs.length).toBeGreaterThan(0);
			expect(game.newMessages().length).toBe(0);
		});

		it('log() returns formatted message text', () => {
			const game = new GameDriver();
			const text = game.log();
			expect(typeof text).toBe('string');
			expect(text.length).toBeGreaterThan(0);
		});

		it('accepts CharacterConfig overrides', () => {
			const game = new GameDriver({ characterClass: 'mage' });
			expect(game.state.characterConfig.characterClass).toBe('mage');
		});
	});

	describe('command()', () => {
		it('executes natural language commands', () => {
			const game = new GameDriver();
			const result = game.command('wait');
			expect(result).toBe(game);
		});

		it('handles dialog choices via command', () => {
			const game = new GameDriver();
			game.state.activeDialogue = {
				npcName: 'Test NPC',
				npcChar: 'T',
				npcColor: '#fff',
				currentNodeId: 'start',
				tree: {
					startNode: 'start',
					nodes: {
						start: {
							id: 'start',
							npcText: 'Hello there!',
							options: [
								{ text: 'Hi!', nextNode: 'end' },
								{ text: 'Bye!', nextNode: 'end' },
							],
						},
						end: {
							id: 'end',
							npcText: 'Farewell!',
							options: [],
						},
					},
				},
				visitedNodes: new Set(),
				givenItems: false,
				mood: 'neutral',
				context: {} as any,
			};
			expect(game.dialogOptions).toEqual(['Hi!', 'Bye!']);
			game.command('choose 1');
			expect(game.dialog?.currentNodeId).toBe('end');
		});

		it('returns this for inspect commands', () => {
			const game = new GameDriver();
			expect(game.command('status')).toBe(game);
		});
	});

	describe('cheats', () => {
		it('godMode() makes player unkillable', () => {
			const game = new GameDriver();
			game.godMode();
			expect(game.hp).toBe(99999);
			expect(game.state.player.maxHp).toBe(99999);
			expect(game.state.player.attack).toBeGreaterThanOrEqual(9999);
		});

		it('setStats() overrides player stats', () => {
			const game = new GameDriver();
			game.setStats({ hp: 42, attack: 100 });
			expect(game.hp).toBe(42);
			expect(game.state.player.attack).toBe(100);
		});

		it('killAll() removes all enemies', () => {
			const game = new GameDriver();
			game.killAll();
			expect(game.enemies.length).toBe(0);
		});

		it('giveItem() adds item to inventory', () => {
			const game = new GameDriver();
			game.giveItem('rusty_sword');
			const items = game.inventory.filter(Boolean);
			expect(items.some(i => i!.id === 'rusty_sword')).toBe(true);
		});

		it('setLevel() sets character level', () => {
			const game = new GameDriver();
			game.setLevel(10);
			expect(game.state.characterLevel).toBe(10);
		});

		it('teleport() moves player to position', () => {
			const game = new GameDriver();
			game.teleport(3, 3);
			expect(game.pos).toEqual({ x: 3, y: 3 });
		});

		it('learnSpell() adds spell', () => {
			const game = new GameDriver();
			game.learnSpell('spell_firebolt');
			expect(game.state.learnedSpells).toContain('spell_firebolt');
		});

		it('learnAllSpells() learns everything', () => {
			const game = new GameDriver();
			game.learnAllSpells();
			expect(game.state.learnedSpells.length).toBeGreaterThan(5);
		});

		it('addRumor() adds a rumor', () => {
			const game = new GameDriver();
			game.addRumor('test_rumor', 'A test rumor');
			expect(game.state.rumors.some(r => r.id === 'test_rumor')).toBe(true);
		});

		it('methods chain', () => {
			const game = new GameDriver();
			const result = game.godMode().giveItem('rusty_sword').setLevel(5);
			expect(result).toBe(game);
		});
	});
});
