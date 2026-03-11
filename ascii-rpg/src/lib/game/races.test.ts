import { describe, it, expect } from 'vitest';
import {
	RACE_ATTRIBUTES,
	RACE_SIGHT_BONUS,
	RACE_EXCLUSIVE_CLASSES,
	RACE_PASSIVES,
	isClassAvailableForRace,
	MANA_FLOOR,
	getRaceFlavorLine,
	shiftNpcAttitude,
	getEffectiveAttitude,
	applyPermanentBuffs,
	RACIAL_QUEST_BUFFS,
} from './races';
import { racialPoisonDuration, dwarfUndergroundDefense } from './engine-utils';
import { rollSocialCheck } from './dialogue-handler';
import { getOverworldSightRadius } from './overworld-handler';
import type { CharacterRace, PermanentBuff, GameState } from './types';
import { Visibility } from './types';

describe('Race Attributes', () => {
	it('all races sum to 54 attribute points', () => {
		for (const [name, race] of Object.entries(RACE_ATTRIBUTES)) {
			const sum = race.str + race.int + race.wil + race.agi + race.vit;
			expect(sum, `${name} should sum to 54`).toBe(54);
		}
	});

	it('elf has highest int', () => {
		expect(RACE_ATTRIBUTES.elf.int).toBeGreaterThan(RACE_ATTRIBUTES.dwarf.int);
		expect(RACE_ATTRIBUTES.elf.int).toBeGreaterThan(RACE_ATTRIBUTES.human.int);
	});

	it('dwarf has highest str and vit', () => {
		expect(RACE_ATTRIBUTES.dwarf.str).toBeGreaterThan(RACE_ATTRIBUTES.elf.str);
		expect(RACE_ATTRIBUTES.dwarf.str).toBeGreaterThan(RACE_ATTRIBUTES.human.str);
		expect(RACE_ATTRIBUTES.dwarf.vit).toBeGreaterThan(RACE_ATTRIBUTES.elf.vit);
		expect(RACE_ATTRIBUTES.dwarf.vit).toBeGreaterThan(RACE_ATTRIBUTES.human.vit);
	});

	it('human has balanced attributes', () => {
		const h = RACE_ATTRIBUTES.human;
		const spread = Math.max(h.str, h.int, h.wil, h.agi, h.vit) - Math.min(h.str, h.int, h.wil, h.agi, h.vit);
		// Human spread should be small (1 point difference)
		expect(spread).toBeLessThanOrEqual(1);
	});

	it('elf has highest mana modifier', () => {
		expect(RACE_ATTRIBUTES.elf.manaModifier).toBeGreaterThan(RACE_ATTRIBUTES.human.manaModifier);
		expect(RACE_ATTRIBUTES.elf.manaModifier).toBeGreaterThan(RACE_ATTRIBUTES.dwarf.manaModifier);
	});

	it('dwarf has lowest mana modifier', () => {
		expect(RACE_ATTRIBUTES.dwarf.manaModifier).toBeLessThan(RACE_ATTRIBUTES.human.manaModifier);
		expect(RACE_ATTRIBUTES.dwarf.manaModifier).toBeLessThan(RACE_ATTRIBUTES.elf.manaModifier);
	});
});

describe('Race Sight Bonuses', () => {
	it('elf has highest sight bonus', () => {
		expect(RACE_SIGHT_BONUS.elf).toBe(2);
	});

	it('dwarf has no sight bonus', () => {
		expect(RACE_SIGHT_BONUS.dwarf).toBe(0);
	});

	it('human has moderate sight bonus', () => {
		expect(RACE_SIGHT_BONUS.human).toBe(1);
	});

	it('all races have defined sight bonuses', () => {
		const races: CharacterRace[] = ['elf', 'dwarf', 'human'];
		for (const race of races) {
			expect(RACE_SIGHT_BONUS[race]).toBeDefined();
		}
	});
});

describe('Race Exclusive Classes', () => {
	it('elf exclusive class is primordial', () => {
		expect(RACE_EXCLUSIVE_CLASSES.elf).toBe('primordial');
	});

	it('dwarf exclusive class is runesmith', () => {
		expect(RACE_EXCLUSIVE_CLASSES.dwarf).toBe('runesmith');
	});

	it('human exclusive class is spellblade', () => {
		expect(RACE_EXCLUSIVE_CLASSES.human).toBe('spellblade');
	});
});

describe('isClassAvailableForRace', () => {
	it('standard classes available to all races', () => {
		const standardClasses = ['warrior', 'mage', 'rogue', 'ranger', 'cleric', 'paladin', 'necromancer', 'bard', 'adept'] as const;
		const races: CharacterRace[] = ['elf', 'dwarf', 'human'];
		for (const race of races) {
			for (const cls of standardClasses) {
				expect(isClassAvailableForRace(race, cls), `${cls} should be available for ${race}`).toBe(true);
			}
		}
	});

	it('primordial only available to elf', () => {
		expect(isClassAvailableForRace('elf', 'primordial')).toBe(true);
		expect(isClassAvailableForRace('dwarf', 'primordial')).toBe(false);
		expect(isClassAvailableForRace('human', 'primordial')).toBe(false);
	});

	it('runesmith only available to dwarf', () => {
		expect(isClassAvailableForRace('dwarf', 'runesmith')).toBe(true);
		expect(isClassAvailableForRace('elf', 'runesmith')).toBe(false);
		expect(isClassAvailableForRace('human', 'runesmith')).toBe(false);
	});

	it('spellblade only available to human', () => {
		expect(isClassAvailableForRace('human', 'spellblade')).toBe(true);
		expect(isClassAvailableForRace('elf', 'spellblade')).toBe(false);
		expect(isClassAvailableForRace('dwarf', 'spellblade')).toBe(false);
	});
});

describe('Race Passives', () => {
	it('elf has ley_sight passive', () => {
		expect(RACE_PASSIVES.elf.id).toBe('ley_sight');
		expect(RACE_PASSIVES.elf.description).toContain('Ley lines');
	});

	it('dwarf has runic_affinity passive', () => {
		expect(RACE_PASSIVES.dwarf.id).toBe('runic_affinity');
		expect(RACE_PASSIVES.dwarf.description).toContain('Rune');
	});

	it('human has second_wind passive', () => {
		expect(RACE_PASSIVES.human.id).toBe('second_wind');
		expect(RACE_PASSIVES.human.description).toContain('HP');
	});

	it('all races have passives', () => {
		const races: CharacterRace[] = ['elf', 'dwarf', 'human'];
		for (const race of races) {
			expect(RACE_PASSIVES[race]).toBeDefined();
			expect(RACE_PASSIVES[race].id).toBeTruthy();
			expect(RACE_PASSIVES[race].description).toBeTruthy();
		}
	});
});

describe('Mana Floor', () => {
	it('MANA_FLOOR is 5', () => {
		expect(MANA_FLOOR).toBe(5);
	});
});

describe('getRaceFlavorLine', () => {
	it('returns null for same-race interactions', () => {
		expect(getRaceFlavorLine('elf', 'elf', -5)).toBeNull();
		expect(getRaceFlavorLine('dwarf', 'dwarf', 5)).toBeNull();
		expect(getRaceFlavorLine('human', 'human', 3)).toBeNull();
	});

	it('returns null for neutral attitude (-1 to +1)', () => {
		expect(getRaceFlavorLine('elf', 'dwarf', 0)).toBeNull();
		expect(getRaceFlavorLine('elf', 'dwarf', 1)).toBeNull();
		expect(getRaceFlavorLine('elf', 'dwarf', -1)).toBeNull();
	});

	it('returns a string for hostile attitude', () => {
		// Run multiple times to handle randomness
		let found = false;
		for (let i = 0; i < 20; i++) {
			const line = getRaceFlavorLine('elf', 'dwarf', -5);
			if (line !== null) {
				expect(typeof line).toBe('string');
				expect(line.length).toBeGreaterThan(0);
				found = true;
				break;
			}
		}
		expect(found).toBe(true);
	});

	it('returns a string for warm attitude (+2 to +3)', () => {
		let found = false;
		for (let i = 0; i < 20; i++) {
			const line = getRaceFlavorLine('dwarf', 'elf', 3);
			if (line !== null) {
				expect(typeof line).toBe('string');
				expect(line.length).toBeGreaterThan(0);
				found = true;
				break;
			}
		}
		expect(found).toBe(true);
	});

	it('returns a string for kinship attitude (+4 to +5)', () => {
		let found = false;
		for (let i = 0; i < 20; i++) {
			const line = getRaceFlavorLine('human', 'elf', 5);
			if (line !== null) {
				expect(typeof line).toBe('string');
				expect(line.length).toBeGreaterThan(0);
				found = true;
				break;
			}
		}
		expect(found).toBe(true);
	});

	it('returns a string for cold attitude (-2 to -3)', () => {
		let found = false;
		for (let i = 0; i < 20; i++) {
			const line = getRaceFlavorLine('human', 'dwarf', -2);
			if (line !== null) {
				expect(typeof line).toBe('string');
				expect(line.length).toBeGreaterThan(0);
				found = true;
				break;
			}
		}
		expect(found).toBe(true);
	});

	it('may return innuendo for female human NPC with attitude >= 2 toward non-human', () => {
		// Run many times — 30% chance each time
		let innuendoFound = false;
		for (let i = 0; i < 100; i++) {
			const line = getRaceFlavorLine('human', 'elf', 3, 'female');
			if (line !== null && line.includes('gifted') || line?.includes('cooking') || line?.includes('Tall')) {
				innuendoFound = true;
				break;
			}
		}
		// With 100 attempts at 30% chance, probability of never getting one is 0.7^100 ≈ 0
		expect(innuendoFound).toBe(true);
	});

	it('does not return innuendo for male human NPC', () => {
		// Male NPCs should only return regular flavor lines
		for (let i = 0; i < 50; i++) {
			const line = getRaceFlavorLine('human', 'elf', 3, 'male');
			if (line !== null) {
				// Regular warm lines for human→elf don't contain innuendo keywords
				expect(line).not.toContain('gifted');
				expect(line).not.toContain('cooking');
			}
		}
	});

	it('all race pairs have flavor lines for non-neutral tiers', () => {
		const races: CharacterRace[] = ['elf', 'dwarf', 'human'];
		for (const npcRace of races) {
			for (const playerRace of races) {
				if (npcRace === playerRace) continue;
				// Check hostile tier returns lines
				let hostileFound = false;
				for (let i = 0; i < 20; i++) {
					if (getRaceFlavorLine(npcRace, playerRace, -5) !== null) {
						hostileFound = true;
						break;
					}
				}
				expect(hostileFound, `${npcRace} → ${playerRace} hostile`).toBe(true);
			}
		}
	});
});

describe('shiftNpcAttitude', () => {
	it('creates new entry when NPC has no shifts', () => {
		const shifts: Record<string, Record<CharacterRace, number>> = {};
		shiftNpcAttitude(shifts, 'Barkeep', 'elf', 2);
		expect(shifts['Barkeep']).toEqual({ elf: 2, dwarf: 0, human: 0 });
	});

	it('accumulates shifts for the same NPC', () => {
		const shifts: Record<string, Record<CharacterRace, number>> = {};
		shiftNpcAttitude(shifts, 'Barkeep', 'elf', 2);
		shiftNpcAttitude(shifts, 'Barkeep', 'elf', 1);
		expect(shifts['Barkeep'].elf).toBe(3);
	});

	it('clamps positive shifts to 5', () => {
		const shifts: Record<string, Record<CharacterRace, number>> = {};
		shiftNpcAttitude(shifts, 'Barkeep', 'dwarf', 10);
		expect(shifts['Barkeep'].dwarf).toBe(5);
	});

	it('clamps negative shifts to -5', () => {
		const shifts: Record<string, Record<CharacterRace, number>> = {};
		shiftNpcAttitude(shifts, 'Barkeep', 'human', -10);
		expect(shifts['Barkeep'].human).toBe(-5);
	});

	it('handles negative delta', () => {
		const shifts: Record<string, Record<CharacterRace, number>> = {};
		shiftNpcAttitude(shifts, 'Mother', 'elf', 3);
		shiftNpcAttitude(shifts, 'Mother', 'elf', -2);
		expect(shifts['Mother'].elf).toBe(1);
	});
});

describe('getEffectiveAttitude', () => {
	it('returns base attitude when no shifts exist', () => {
		const base: Record<CharacterRace, number> = { elf: 2, dwarf: -1, human: 0 };
		const shifts: Record<string, Record<CharacterRace, number>> = {};
		expect(getEffectiveAttitude(base, shifts, 'Barkeep', 'elf')).toBe(2);
		expect(getEffectiveAttitude(base, shifts, 'Barkeep', 'dwarf')).toBe(-1);
	});

	it('combines base and shift', () => {
		const base: Record<CharacterRace, number> = { elf: 2, dwarf: -1, human: 0 };
		const shifts: Record<string, Record<CharacterRace, number>> = {
			'Barkeep': { elf: 1, dwarf: 2, human: -1 },
		};
		expect(getEffectiveAttitude(base, shifts, 'Barkeep', 'elf')).toBe(3);
		expect(getEffectiveAttitude(base, shifts, 'Barkeep', 'dwarf')).toBe(1);
		expect(getEffectiveAttitude(base, shifts, 'Barkeep', 'human')).toBe(-1);
	});

	it('clamps combined result to 5', () => {
		const base: Record<CharacterRace, number> = { elf: 4, dwarf: 0, human: 0 };
		const shifts: Record<string, Record<CharacterRace, number>> = {
			'NPC': { elf: 3, dwarf: 0, human: 0 },
		};
		expect(getEffectiveAttitude(base, shifts, 'NPC', 'elf')).toBe(5);
	});

	it('clamps combined result to -5', () => {
		const base: Record<CharacterRace, number> = { elf: -3, dwarf: 0, human: 0 };
		const shifts: Record<string, Record<CharacterRace, number>> = {
			'NPC': { elf: -4, dwarf: 0, human: 0 },
		};
		expect(getEffectiveAttitude(base, shifts, 'NPC', 'elf')).toBe(-5);
	});

	it('handles missing base race entry gracefully', () => {
		const base = { elf: 1, dwarf: 0, human: 0 } as Record<CharacterRace, number>;
		const shifts: Record<string, Record<CharacterRace, number>> = {};
		expect(getEffectiveAttitude(base, shifts, 'NPC', 'elf')).toBe(1);
	});
});

describe('applyPermanentBuffs', () => {
	it('returns zero result for empty buffs', () => {
		const result = applyPermanentBuffs({}, []);
		expect(result.spellPowerBonus).toBe(0);
		expect(result.physicalDefenseBonus).toBe(0);
		expect(result.socialBonus).toBe(0);
		expect(result.flags).toEqual([]);
	});

	it('accumulates stat bonuses from multiple buffs', () => {
		const buffs: PermanentBuff[] = [
			RACIAL_QUEST_BUFFS.ley_resonance,
			RACIAL_QUEST_BUFFS.runic_mastery,
		];
		const result = applyPermanentBuffs({}, buffs);
		expect(result.spellPowerBonus).toBe(3);
		expect(result.physicalDefenseBonus).toBe(2);
	});

	it('collects flags from buffs', () => {
		const result = applyPermanentBuffs({}, [RACIAL_QUEST_BUFFS.ley_resonance]);
		expect(result.flags).toContain('leyLinesAlwaysVisible');
	});

	it('accumulates social bonus from sovereigns_will', () => {
		const result = applyPermanentBuffs({}, [RACIAL_QUEST_BUFFS.sovereigns_will]);
		expect(result.socialBonus).toBe(2);
	});

	it('handles all three racial buffs together', () => {
		const buffs: PermanentBuff[] = [
			RACIAL_QUEST_BUFFS.ley_resonance,
			RACIAL_QUEST_BUFFS.runic_mastery,
			RACIAL_QUEST_BUFFS.sovereigns_will,
		];
		const result = applyPermanentBuffs({}, buffs);
		expect(result.spellPowerBonus).toBe(3);
		expect(result.physicalDefenseBonus).toBe(2);
		expect(result.socialBonus).toBe(2);
		expect(result.flags).toContain('leyLinesAlwaysVisible');
		expect(result.flags).toContain('runeEnhanceChance');
	});
});

describe('RACIAL_QUEST_BUFFS', () => {
	it('has ley_resonance buff for elves', () => {
		expect(RACIAL_QUEST_BUFFS.ley_resonance).toBeDefined();
		expect(RACIAL_QUEST_BUFFS.ley_resonance.source).toBe('elf_03_unbroken_thread');
	});

	it('has runic_mastery buff for dwarves', () => {
		expect(RACIAL_QUEST_BUFFS.runic_mastery).toBeDefined();
		expect(RACIAL_QUEST_BUFFS.runic_mastery.source).toBe('dwarf_03_stone_remembers');
	});

	it('has sovereigns_will buff for humans', () => {
		expect(RACIAL_QUEST_BUFFS.sovereigns_will).toBeDefined();
		expect(RACIAL_QUEST_BUFFS.sovereigns_will.source).toBe('human_03_crown_of_depths');
	});

	it('all buffs have at least one effect', () => {
		for (const [key, buff] of Object.entries(RACIAL_QUEST_BUFFS)) {
			expect(buff.effects.length, `${key} should have effects`).toBeGreaterThan(0);
		}
	});
});

// ---------------------------------------------------------------------------
// Racial Passive Gameplay Effects
// ---------------------------------------------------------------------------

function makeMinimalState(overrides: Partial<GameState> = {}): GameState {
	const width = 10;
	const height = 10;
	const tiles = Array.from({ length: height }, () =>
		Array.from({ length: width }, () => '.' as const)
	);
	const visibility = Array.from({ length: height }, () =>
		Array.from({ length: width }, () => Visibility.Visible)
	);
	return {
		player: { pos: { x: 5, y: 5 }, char: '@', color: '#ff0', name: 'Hero', hp: 20, maxHp: 20, attack: 10, statusEffects: [] },
		enemies: [], map: { width, height, tiles, secretWalls: new Set<string>() },
		messages: [], level: 1, gameOver: false, xp: 0, characterLevel: 1,
		visibility, sightRadius: 8, detectedSecrets: new Set<string>(),
		traps: [], detectedTraps: new Set<string>(),
		characterConfig: { name: 'Hero', characterClass: 'warrior' as const, difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' },
		abilityCooldown: 0, hazards: [], npcs: [], chests: [], lootDrops: [],
		skillPoints: 0, unlockedSkills: [], activeDialogue: null, rumors: [],
		knownLanguages: [], landmarks: [], heardStories: [],
		stats: { enemiesKilled: 0, bossesKilled: 0, secretsFound: 0, trapsDisarmed: 0, chestsOpened: 0, levelsCleared: 0, npcsSpokenTo: 0, landmarksExamined: 0, damageDealt: 0, damageTaken: 0, maxDungeonLevel: 0, stealthKills: 0, backstabs: 0, questsCompleted: 0, questsFailed: 0 },
		unlockedAchievements: [], lieCount: 0, bestiary: {},
		hunger: 100, thirst: 100, survivalEnabled: true, turnCount: 0,
		locationMode: 'location' as const, worldMap: null, overworldPos: null,
		currentLocationId: null, waypoint: null,
		inventory: Array.from({ length: 12 }, () => null),
		equipment: { head: null, body: null, trouser: null, leftHand: null, rightHand: null, back: null, leftFoot: null, rightFoot: null },
		containers: [], activeBookReading: null, inventoryOpen: false,
		activeContainer: null, inventoryCursor: 0, inventoryPanel: 'inventory' as const,
		locationCache: {}, quests: [], completedQuestIds: [], failedQuestIds: [],
		stealth: { isHidden: false, noiseLevel: 0, lastNoisePos: null, backstabReady: false },
		academyState: null, playerTitles: [],
		playerRace: 'human' as const, permanentBuffs: [], npcAttitudeShifts: {},
		learnedSpells: [], spellCooldowns: {}, quickCastSlots: [null, null, null, null],
		manaRegenBaseCounter: 0, manaRegenIntCounter: 0, spellMenuOpen: false, spellMenuCursor: 0,
		spellTargeting: null, schoolMastery: {},
		forbiddenCosts: { corruption: 0, paradoxBaseline: 0, maxHpLost: 0, sanityLost: 0, soulCapLost: 0 },
		leyLineLevel: 0, trueSightActive: 0, revealedLeyLineTiles: new Set(),
		learnedRituals: [], ritualChanneling: null, activeWards: [],
		teleportAnchors: {}, activeSummon: null, scriedLevel: null,
		terrainEffects: [], specialization: null, pendingSpecialization: false, forbiddenPassives: [],
		...overrides,
	};
}

describe('Racial Passive: Dwarf Poison Resistance', () => {
	it('halves poison duration for dwarves', () => {
		const state = makeMinimalState({ playerRace: 'dwarf' });
		expect(racialPoisonDuration(state, 'poison', 6)).toBe(3);
	});

	it('minimum poison duration is 1 for dwarves', () => {
		const state = makeMinimalState({ playerRace: 'dwarf' });
		expect(racialPoisonDuration(state, 'poison', 1)).toBe(1);
	});

	it('does not halve non-poison effects for dwarves', () => {
		const state = makeMinimalState({ playerRace: 'dwarf' });
		expect(racialPoisonDuration(state, 'burn', 6)).toBe(6);
	});

	it('does not halve poison for non-dwarves', () => {
		const state = makeMinimalState({ playerRace: 'elf' });
		expect(racialPoisonDuration(state, 'poison', 6)).toBe(6);
	});
});

describe('Racial Passive: Human Social Bonus', () => {
	it('human gets +1 social bonus in rollSocialCheck', () => {
		const humanState = makeMinimalState({ playerRace: 'human' });
		const elfState = makeMinimalState({ playerRace: 'elf' });
		const check = { skill: 'persuade' as const, difficulty: 1, successNode: 's', failNode: 'f' };
		// Roll with Math.random fixed
		const orig = Math.random;
		Math.random = () => 0.5; // roll = 11
		try {
			const humanResult = rollSocialCheck(check, humanState);
			const elfResult = rollSocialCheck(check, elfState);
			expect(humanResult.bonus).toBe(elfResult.bonus + 1);
		} finally {
			Math.random = orig;
		}
	});
});

describe('Racial Passive: Elf Forest Sight', () => {
	it('elf gets +1 overworld sight in forest terrain', () => {
		const forestTile = { terrain: 'forest', passable: true } as any;
		const elfSight = getOverworldSightRadius(forestTile, 'elf');
		const humanSight = getOverworldSightRadius(forestTile, 'human');
		expect(elfSight).toBe(humanSight + 1);
	});

	it('elf does not get bonus in non-forest terrain', () => {
		const grassTile = { terrain: 'grass', passable: true } as any;
		const elfSight = getOverworldSightRadius(grassTile, 'elf');
		const humanSight = getOverworldSightRadius(grassTile, 'human');
		expect(elfSight).toBe(humanSight);
	});
});

describe('Racial Passive: Dwarf Underground Defense', () => {
	it('dwarf gets +2 defense in dungeon', () => {
		const state = makeMinimalState({
			playerRace: 'dwarf',
			locationMode: 'location',
			currentLocationId: 'some_dungeon',
		});
		expect(dwarfUndergroundDefense(state)).toBe(2);
	});

	it('dwarf gets no bonus on overworld', () => {
		const state = makeMinimalState({
			playerRace: 'dwarf',
			locationMode: 'overworld',
			currentLocationId: null,
		});
		expect(dwarfUndergroundDefense(state)).toBe(0);
	});

	it('non-dwarf gets no bonus in dungeon', () => {
		const state = makeMinimalState({
			playerRace: 'elf',
			locationMode: 'location',
			currentLocationId: 'some_dungeon',
		});
		expect(dwarfUndergroundDefense(state)).toBe(0);
	});
});
