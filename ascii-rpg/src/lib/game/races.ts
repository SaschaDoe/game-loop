/**
 * Race system: attribute tables, sight bonuses, exclusive classes, passives.
 */

import type { CharacterClass, CharacterRace } from './types';

// ---------------------------------------------------------------------------
// Race Attribute Definitions
// ---------------------------------------------------------------------------

export interface RaceDefinition {
	str: number;
	int: number;
	wil: number;
	agi: number;
	vit: number;
	manaModifier: number;
	description: string;
}

export const RACE_ATTRIBUTES: Record<CharacterRace, RaceDefinition> = {
	elf: {
		str: 7,
		int: 14,
		wil: 12,
		agi: 14,
		vit: 7,
		manaModifier: 1.40,
		description: 'Graceful and attuned to magic. High intelligence and agility, but fragile.',
	},
	dwarf: {
		str: 14,
		int: 8,
		wil: 11,
		agi: 7,
		vit: 14,
		manaModifier: 0.30,
		description: 'Stout and resilient. Raw physical power with minimal mana.',
	},
	human: {
		str: 10,
		int: 11,
		wil: 11,
		agi: 11,
		vit: 11,
		manaModifier: 0.80,
		description: 'Balanced and adaptable. No extreme strengths or weaknesses.',
	},
};

// ---------------------------------------------------------------------------
// Sight Bonuses
// ---------------------------------------------------------------------------

export const RACE_SIGHT_BONUS: Record<CharacterRace, number> = {
	elf: 2,
	dwarf: 0,
	human: 1,
};

// ---------------------------------------------------------------------------
// Exclusive Classes (future — not yet added to CharacterClass)
// ---------------------------------------------------------------------------

export const RACE_EXCLUSIVE_CLASSES: Record<CharacterRace, string> = {
	elf: 'primordial',
	dwarf: 'runesmith',
	human: 'spellblade',
};

// ---------------------------------------------------------------------------
// Race Passives
// ---------------------------------------------------------------------------

export interface RacePassive {
	id: string;
	description: string;
}

export const RACE_PASSIVES: Record<CharacterRace, RacePassive> = {
	elf: {
		id: 'ley_sight',
		description: 'Ley lines are always visible on the overworld.',
	},
	dwarf: {
		id: 'runic_affinity',
		description: 'Rune-enhanced equipment has a chance to gain extra bonuses.',
	},
	human: {
		id: 'second_wind',
		description: 'When HP drops below 20%, heal 25% of max HP once per level.',
	},
};

// ---------------------------------------------------------------------------
// Class Availability
// ---------------------------------------------------------------------------

/**
 * Check if a class is available for a given race.
 * Race-exclusive classes can only be played by their designated race.
 * All standard classes are available to every race.
 */
export function isClassAvailableForRace(race: CharacterRace, characterClass: CharacterClass | string): boolean {
	// Check if this is a race-exclusive class
	for (const [exclusiveRace, exclusiveClass] of Object.entries(RACE_EXCLUSIVE_CLASSES)) {
		if (characterClass === exclusiveClass) {
			return race === exclusiveRace;
		}
	}
	// All standard classes are available to every race
	return true;
}

// ---------------------------------------------------------------------------
// Mana Floor
// ---------------------------------------------------------------------------

/** Minimum maxMana for any player character, regardless of race/class combo */
export const MANA_FLOOR = 5;

// ---------------------------------------------------------------------------
// Race Flavor Lines — NPC attitude-based dialogue color
// ---------------------------------------------------------------------------

type AttitudeTier = 'hostile' | 'cold' | 'neutral' | 'warm' | 'kinship';

function getAttitudeTier(score: number): AttitudeTier {
	if (score <= -4) return 'hostile';
	if (score <= -2) return 'cold';
	if (score <= 1) return 'neutral';
	if (score <= 3) return 'warm';
	return 'kinship';
}

/**
 * Flavor line pools keyed by `${npcRace}_${playerRace}` then by attitude tier.
 * Neutral tier intentionally empty — returns null to skip flavor injection.
 */
const RACE_FLAVOR_LINES: Record<string, Partial<Record<AttitudeTier, string[]>>> = {
	// Elf NPC → Dwarf player
	elf_dwarf: {
		hostile: [
			'"Another tunnelrat crawls from the deep. How... predictable."',
			'"The stench of ore and ignorance precedes you, dwarf."',
			'"Your kind delved too greedily once. The earth remembers, even if you do not."',
		],
		cold: [
			'"You carry the soot of a hundred forges. It suits you, I suppose."',
			'"Dwarves. Always hammering, never listening."',
			'"I can smell the iron on you from here."',
		],
		warm: [
			'"There is a quiet strength in your people I have come to respect."',
			'"The dwarven smiths forged wonders once. Perhaps you carry that spark."',
			'"Your endurance is... admirable, for one so close to the stone."',
		],
		kinship: [
			'"Dwarf-friend, they would call me in the old tongue. I wear it proudly."',
			'"Your people and mine have more in common than either would admit."',
			'"The deep roads and the high boughs — both shelter those who endure."',
		],
	},
	// Elf NPC → Human player
	elf_human: {
		hostile: [
			'"Another mayfly, buzzing through a world it barely comprehends."',
			'"Your kind builds monuments to yesterday and calls it legacy."',
			'"Humans. You burn so bright and so briefly. It would be tragic if it weren\'t so tiresome."',
		],
		cold: [
			'"You are... tiresome, in the way all brief things are."',
			'"I have seen your kind come and go like seasons. You blur together."',
		],
		warm: [
			'"There is a surprising depth to you, for one with so little time."',
			'"You remind me that brevity can sharpen the spirit."',
			'"Perhaps the short-lived see more clearly. You waste nothing."',
		],
		kinship: [
			'"The Luminari once called humans \'the urgent ones.\' It was meant as praise."',
			'"In all my years, few of your kind have earned my trust. You have."',
			'"You carry a fire that outlasts your years. The world is richer for it."',
		],
	},
	// Dwarf NPC → Elf player
	dwarf_elf: {
		hostile: [
			'"An elf. All theory, no common sense. Typical."',
			'"Your kind talks in riddles and wonders why nobody listens."',
			'"Go hug a tree, knife-ear. The grown-ups are busy."',
		],
		cold: [
			'"Tree-hugger. At least you\'re not lecturing me. Yet."',
			'"Elves always think they know better. The mountain disagrees."',
		],
		warm: [
			'"You\'ve got more patience than most of your kind. I can work with that."',
			'"The elves who listen to stone instead of just wind — those are the good ones."',
			'"You carry yourself well for a leaf-lover. That\'s a compliment."',
		],
		kinship: [
			'"You\'re as sturdy as any dwarf I\'ve known. Higher praise I cannot give."',
			'"The old alliance between peak and bough — I\'d raise a mug to that."',
			'"Elf-friend. Aye, I said it. Don\'t let it go to your pointed head."',
		],
	},
	// Dwarf NPC → Human player
	dwarf_human: {
		hostile: [
			'"Sand builders. Your castles crumble before the mortar dries."',
			'"Humans rush through everything — craft, life, loyalty."',
			'"Your kind couldn\'t hold a mine for a generation if the gods themselves gave you one."',
		],
		cold: [
			'"Always in a rush, you humans. Sit down. Think. Then act."',
			'"Your people build fast and forget faster. The mountain remembers."',
		],
		warm: [
			'"There\'s a stubbornness in you I respect. Almost dwarven."',
			'"You don\'t quit easy. That counts for something down here."',
			'"Human grit — can\'t forge it, can\'t fake it. You\'ve got the real thing."',
		],
		kinship: [
			'"The Iron Republics stood because humans and dwarves built together. I remember."',
			'"You\'re kin to the mountain now, whether your blood knows it or not."',
			'"I\'d share my last ale with you. That\'s the highest honor a dwarf can give."',
		],
	},
	// Human NPC → Elf player
	human_elf: {
		hostile: [
			'"Knowledge hoarders, the lot of you. Sitting in your forests while the world burns."',
			'"An elf. Come to judge us short-lived folk again, have you?"',
			'"Your people had centuries to help. You chose to watch."',
		],
		cold: [
			'"Know-it-all, aren\'t you? Must be nice, having all the time in the world."',
			'"Elves always look at us like we\'re children. Gets old."',
		],
		warm: [
			'"Your wisdom is welcome here. We could use a longer perspective."',
			'"There\'s something calming about your kind. Like old trees in a storm."',
		],
		kinship: [
			'"They say elves have long memories. I hope you\'ll remember us kindly."',
			'"Your people see further than we ever could. I trust those eyes."',
			'"Long memory, steady hand. The world needs more of your kind."',
		],
	},
	// Human NPC → Dwarf player
	human_dwarf: {
		hostile: [
			'"A mole, surfacing to blink at the sun. Go back underground."',
			'"Dwarves. Stubborn as the rock they live under, and twice as dense."',
			'"Your kind digs holes and calls it civilization."',
		],
		cold: [
			'"Stubborn, aren\'t you? All dwarves are."',
			'"I suppose you\'ll want ale. It\'s always ale with your kind."',
		],
		warm: [
			'"Your kind outlasts empires. There\'s something to be said for that."',
			'"Dwarven work lasts forever. I wish I could say the same for ours."',
			'"Steady as stone, you are. The world needs more of that."',
		],
		kinship: [
			'"Hold the wall, the dwarves say. Aye, I\'ll hold it with you."',
			'"Dwarven loyalty runs deeper than any mine. I\'ve seen it firsthand."',
			'"You\'re the bedrock this world forgets it needs. I won\'t forget."',
		],
	},
};

/**
 * Innuendo lines for female human NPCs toward non-human players.
 * Only triggered when attitude >= 2 with a 30% chance.
 */
const INNUENDO_LINES: Record<string, string[]> = {
	elf: [
		'"They say elves are gifted in many ways... I\'d love to find out which."',
		'"Once you try elven cooking, they say, you never go back to human."',
		'"Tall in all the ways that matter, aren\'t you?"',
	],
	dwarf: [
		'"They say dwarves have a certain... girth of character."',
		'"Forgive me if I\'m walking funny — these stairs weren\'t built for my height."',
		'"Dwarven thickness and endurance... it\'s not just about the armor, is it?"',
	],
};

/**
 * Get a race flavor line for an NPC speaking to a player of a different race.
 * Returns null for same-race interactions or neutral attitude.
 */
export function getRaceFlavorLine(
	npcRace: CharacterRace,
	playerRace: CharacterRace,
	attitudeScore: number,
	npcGender?: 'male' | 'female',
): string | null {
	// No flavor for same-race interactions
	if (npcRace === playerRace) return null;

	// Innuendo check: female human NPC, attitude >= 2, 30% chance
	if (npcRace === 'human' && npcGender === 'female' && attitudeScore >= 2) {
		const innuendoPool = INNUENDO_LINES[playerRace];
		if (innuendoPool && innuendoPool.length > 0 && Math.random() < 0.3) {
			return innuendoPool[Math.floor(Math.random() * innuendoPool.length)];
		}
	}

	const tier = getAttitudeTier(attitudeScore);
	if (tier === 'neutral') return null;

	const key = `${npcRace}_${playerRace}`;
	const pool = RACE_FLAVOR_LINES[key]?.[tier];
	if (!pool || pool.length === 0) return null;

	return pool[Math.floor(Math.random() * pool.length)];
}

// ---------------------------------------------------------------------------
// NPC Attitude Shift Mechanics
// ---------------------------------------------------------------------------

/**
 * Shift a specific NPC's attitude toward a race.
 * Mutates the shifts record in place. Clamps result to [-5, 5].
 */
export function shiftNpcAttitude(
	shifts: Record<string, Record<CharacterRace, number>>,
	npcId: string,
	race: CharacterRace,
	delta: number,
): void {
	if (!shifts[npcId]) shifts[npcId] = { elf: 0, dwarf: 0, human: 0 };
	shifts[npcId][race] = Math.max(-5, Math.min(5, shifts[npcId][race] + delta));
}

/**
 * Compute the effective attitude an NPC has toward a specific race,
 * combining the NPC's base attitude with any player-driven shifts.
 * Clamps result to [-5, 5].
 */
export function getEffectiveAttitude(
	baseAttitude: Record<CharacterRace, number>,
	shifts: Record<string, Record<CharacterRace, number>>,
	npcId: string,
	race: CharacterRace,
): number {
	const base = baseAttitude[race] ?? 0;
	const shift = shifts[npcId]?.[race] ?? 0;
	return Math.max(-5, Math.min(5, base + shift));
}
