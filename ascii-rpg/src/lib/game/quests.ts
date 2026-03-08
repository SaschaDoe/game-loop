import type { GameState, Quest, QuestObjective, QuestObjectiveType, QuestReward, Rumor, Story } from './types';

// ---------------------------------------------------------------------------
// Quest definition (catalog template)
// ---------------------------------------------------------------------------

export interface QuestObjectiveDef {
	id: string;
	description: string;
	type: QuestObjectiveType;
	target?: string;
	required: number;
}

export interface QuestDef {
	id: string;
	title: string;
	description: string;
	objectives: QuestObjectiveDef[];
	rewards: QuestReward;
	giverNpcName?: string;
	regionId?: string;
	isMainQuest: boolean;
	turnLimit?: number;
	/** Id of a quest that must be completed before this one is available */
	prerequisiteQuestId?: string;
}

// ---------------------------------------------------------------------------
// Quest catalog
// ---------------------------------------------------------------------------

export const QUEST_CATALOG: Record<string, QuestDef> = {
	// ===================================================================
	// MAIN STORY QUESTS (chain of 5)
	// ===================================================================
	main_01_whispers: {
		id: 'main_01_whispers',
		title: 'Whispers Beneath the Hymns',
		description:
			'A wandering scholar claims the holy hymns sung at shrines contain older words — words that predate the gods themselves. Seek out three shrines across the land and listen carefully.',
		objectives: [
			{ id: 'main01_shrine1', description: 'Visit a shrine in the Greenweald', type: 'explore', target: 'shrine_greenweald', required: 1 },
			{ id: 'main01_shrine2', description: 'Visit a shrine in the Hearthlands', type: 'explore', target: 'shrine_hearthlands', required: 1 },
			{ id: 'main01_shrine3', description: 'Visit a shrine in the Thornlands', type: 'explore', target: 'shrine_thornlands', required: 1 },
		],
		rewards: {
			xp: 200,
			rumor: {
				id: 'rumor_old_hymns',
				text: 'The oldest hymns name the gods differently. Some verses seem to beg for mercy rather than offer praise.',
				source: 'Shrine inscriptions',
				accuracy: 'true',
			},
		},
		giverNpcName: 'Brother Edric',
		isMainQuest: true,
	},

	main_02_names_erased: {
		id: 'main_02_names_erased',
		title: 'The Names They Erased',
		description:
			'The shrine inscriptions hinted at something buried. Scholars in the Hearthlands speak of a sealed archive beneath the old cathedral — a place where names were scratched from history.',
		objectives: [
			{ id: 'main02_talk', description: 'Speak with the Archivist in the Hearthlands', type: 'talk', target: 'The Archivist', required: 1 },
			{ id: 'main02_explore', description: 'Reach level 3 of the Sealed Archive', type: 'explore', target: 'sealed_archive_3', required: 1 },
		],
		rewards: {
			xp: 350,
			story: {
				id: 'story_erased_names',
				title: 'The Unnamed Seven',
				text: 'Before the Ascension, there were seven mortals whose deeds were so monstrous that their names were forbidden. The archive holds fragments of their trials — but the final pages are missing.',
				teller: 'The Archivist',
				type: 'lore',
			},
		},
		giverNpcName: 'The Archivist',
		regionId: 'hearthlands',
		isMainQuest: true,
		prerequisiteQuestId: 'main_01_whispers',
	},

	main_03_seven_masks: {
		id: 'main_03_seven_masks',
		title: 'Seven Masks, Seven Thrones',
		description:
			'The archive spoke of seven condemned mortals and seven missing pages. A reclusive hermit in Frostpeak supposedly collects forbidden texts. Perhaps she knows what the pages contained.',
		objectives: [
			{ id: 'main03_hermit', description: 'Find the Hermit of Frostpeak', type: 'talk', target: 'Hermit Vael', required: 1 },
			{ id: 'main03_collect', description: 'Recover torn pages from dungeon depths', type: 'collect', target: 'torn_page', required: 3 },
		],
		rewards: {
			xp: 500,
			atk: 1,
			rumor: {
				id: 'rumor_masks',
				text: 'Each of the seven wore a mask during the Ascension rite. The masks hid mortal faces — faces the world would have recognized.',
				source: 'Hermit Vael',
				accuracy: 'true',
			},
		},
		giverNpcName: 'Hermit Vael',
		regionId: 'frostpeak',
		isMainQuest: true,
		prerequisiteQuestId: 'main_02_names_erased',
	},

	main_04_blood_price: {
		id: 'main_04_blood_price',
		title: 'The Blood Price of Divinity',
		description:
			'The torn pages describe a ritual — the Ascension — and hint that the original divine guardians were overthrown. Something sleeps in the Drowned Mire that remembers the old world before the theft.',
		objectives: [
			{ id: 'main04_explore', description: 'Descend into the Sunken Temple', type: 'explore', target: 'sunken_temple_5', required: 1 },
			{ id: 'main04_kill', description: 'Defeat the Bound Witness', type: 'kill', target: 'Bound Witness', required: 1 },
		],
		rewards: {
			xp: 750,
			hp: 5,
			story: {
				id: 'story_blood_price',
				title: 'A Witness Freed',
				text: 'The creature spoke before it fell: "They were the cruelest among us. Tyrants. Poisoners. Oath-breakers. And when the true guardians slept, they climbed onto empty thrones and called themselves holy."',
				teller: 'The Bound Witness',
				type: 'lore',
			},
		},
		regionId: 'drowned_mire',
		isMainQuest: true,
		prerequisiteQuestId: 'main_03_seven_masks',
	},

	main_05_unmasking: {
		id: 'main_05_unmasking',
		title: 'What Sits Upon the Throne',
		description:
			'You have gathered fragments of a truth the world has forgotten. Deep in the Sunstone Expanse lies the Tomb of the First Age — the place where the old guardians were entombed. Whatever waits there will answer the final question.',
		objectives: [
			{ id: 'main05_explore', description: 'Enter the Tomb of the First Age', type: 'explore', target: 'tomb_first_age', required: 1 },
			{ id: 'main05_kill', description: 'Defeat the Throne Guardian', type: 'kill', target: 'Throne Guardian', required: 1 },
			{ id: 'main05_talk', description: 'Hear the final truth', type: 'talk', target: 'Sleeping Warden', required: 1 },
		],
		rewards: {
			xp: 1200,
			hp: 10,
			atk: 2,
			story: {
				id: 'story_unmasking',
				title: 'The Sleeping Warden Speaks',
				text: 'A voice like glaciers grinding: "You have found what they buried. Seven thrones. Seven stolen crowns. The prayers of the faithful feed the very monsters who once preyed upon them. Now you know. What will you do with it?"',
				teller: 'The Sleeping Warden',
				type: 'lore',
			},
		},
		regionId: 'sunstone_expanse',
		isMainQuest: true,
		prerequisiteQuestId: 'main_04_blood_price',
	},

	// ===================================================================
	// SIDE QUESTS — Greenweald (dangerLevel 1)
	// ===================================================================
	side_gw_rats: {
		id: 'side_gw_rats',
		title: 'Cellar Troubles',
		description:
			'A nervous innkeeper wrings her hands. Something is gnawing through the grain stores at night. Clear out the infestation before winter supplies are ruined.',
		objectives: [
			{ id: 'gw_rats_kill', description: 'Kill rats in the Greenweald', type: 'kill', target: 'Rat', required: 6 },
		],
		rewards: { xp: 50 },
		giverNpcName: 'Marta the Innkeeper',
		regionId: 'greenweald',
		isMainQuest: false,
		turnLimit: 100,
	},

	side_gw_herbs: {
		id: 'side_gw_herbs',
		title: 'A Grandmother\'s Remedy',
		description:
			'Old Brenna needs moonpetals from the deeper forest to brew a cure for the ailing children. The woods grow dangerous after dark.',
		objectives: [
			{ id: 'gw_herbs_collect', description: 'Collect moonpetal herbs', type: 'collect', target: 'moonpetal', required: 4 },
		],
		rewards: { xp: 75, hp: 2 },
		giverNpcName: 'Old Brenna',
		regionId: 'greenweald',
		isMainQuest: false,
		turnLimit: 80,
	},

	side_gw_elder: {
		id: 'side_gw_elder',
		title: 'Words of the Elder Oak',
		description:
			'A druid claims the Elder Oak has been whispering warnings at night. Venture to the ancient tree and discover what troubles the forest.',
		objectives: [
			{ id: 'gw_elder_explore', description: 'Visit the Elder Oak', type: 'explore', target: 'ancient_tree', required: 1 },
			{ id: 'gw_elder_talk', description: 'Report back to the druid', type: 'talk', target: 'Druid Fen', required: 1 },
		],
		rewards: {
			xp: 100,
			rumor: {
				id: 'rumor_elder_oak',
				text: 'The Elder Oak remembers a time before the gods held dominion. Its roots drink from older waters.',
				source: 'Druid Fen',
				accuracy: 'exaggerated',
			},
		},
		giverNpcName: 'Druid Fen',
		regionId: 'greenweald',
		isMainQuest: false,
	},

	// ===================================================================
	// SIDE QUESTS — Hearthlands (dangerLevel 2)
	// ===================================================================
	side_hl_wolves: {
		id: 'side_hl_wolves',
		title: 'The Shepherd\'s Plea',
		description:
			'Wolves have been driven from the hills by something worse. Now they harry the flocks. A desperate shepherd offers what coin he has.',
		objectives: [
			{ id: 'hl_wolves_kill', description: 'Cull the wolf packs', type: 'kill', target: 'Wolf', required: 5 },
		],
		rewards: { xp: 100, atk: 1 },
		giverNpcName: 'Tomas the Shepherd',
		regionId: 'hearthlands',
		isMainQuest: false,
	},

	side_hl_courier: {
		id: 'side_hl_courier',
		title: 'Lost Courier',
		description:
			'A courier vanished on the road between settlements. Her last message spoke of bandits near the old watchtower. Find her — or at least her satchel.',
		objectives: [
			{ id: 'hl_courier_explore', description: 'Search the old watchtower', type: 'explore', target: 'watchtower_ruins', required: 1 },
			{ id: 'hl_courier_collect', description: 'Recover the courier\'s satchel', type: 'collect', target: 'courier_satchel', required: 1 },
		],
		rewards: { xp: 120 },
		giverNpcName: 'Postmaster Grenn',
		regionId: 'hearthlands',
		isMainQuest: false,
		turnLimit: 60,
	},

	// ===================================================================
	// SIDE QUESTS — Thornlands (dangerLevel 3)
	// ===================================================================
	side_th_goblins: {
		id: 'side_th_goblins',
		title: 'Iron and Green',
		description:
			'Goblins have seized an abandoned foundry and are hammering crude weapons day and night. The noise is the least of the problems — they are arming for a raid.',
		objectives: [
			{ id: 'th_goblins_kill', description: 'Defeat goblins in the Thornlands', type: 'kill', target: 'Goblin', required: 8 },
		],
		rewards: { xp: 130, atk: 1 },
		giverNpcName: 'Warden Kael',
		regionId: 'thornlands',
		isMainQuest: false,
	},

	side_th_smith: {
		id: 'side_th_smith',
		title: 'The Rusted Apprentice',
		description:
			'A blacksmith\'s apprentice went to salvage iron from the old tunnels and hasn\'t returned. The smith fears the worst but cannot leave the forge unattended.',
		objectives: [
			{ id: 'th_smith_explore', description: 'Search the Thornwild Tunnels', type: 'explore', target: 'thornwild_tunnels', required: 1 },
			{ id: 'th_smith_talk', description: 'Return to the blacksmith', type: 'talk', target: 'Smith Brannock', required: 1 },
		],
		rewards: { xp: 110, hp: 3 },
		giverNpcName: 'Smith Brannock',
		regionId: 'thornlands',
		isMainQuest: false,
		turnLimit: 70,
	},

	// ===================================================================
	// SIDE QUESTS — Ashlands (dangerLevel 4)
	// ===================================================================
	side_al_skeletons: {
		id: 'side_al_skeletons',
		title: 'Bones of the Restless',
		description:
			'The dead do not stay buried in the Ashlands. Skeletal soldiers march from the scorched crypts each night. Put them down before they overwhelm the outpost.',
		objectives: [
			{ id: 'al_skel_kill', description: 'Destroy skeletons', type: 'kill', target: 'Skeleton', required: 10 },
		],
		rewards: { xp: 180 },
		giverNpcName: 'Captain Dyre',
		regionId: 'ashlands',
		isMainQuest: false,
	},

	side_al_obsidian: {
		id: 'side_al_obsidian',
		title: 'Obsidian Harvest',
		description:
			'The alchemist needs shards of volcanic glass for her experiments. The obsidian fields are treacherous — lava pools and worse lurk among the stone.',
		objectives: [
			{ id: 'al_obs_collect', description: 'Collect obsidian shards', type: 'collect', target: 'obsidian_shard', required: 5 },
		],
		rewards: { xp: 150, hp: 2 },
		giverNpcName: 'Alchemist Senna',
		regionId: 'ashlands',
		isMainQuest: false,
		turnLimit: 90,
	},

	// ===================================================================
	// SIDE QUESTS — Drowned Mire (dangerLevel 5)
	// ===================================================================
	side_dm_spiders: {
		id: 'side_dm_spiders',
		title: 'Web of Hunger',
		description:
			'Giant spiders have spun webs across the only safe path through the mire. Travellers disappear. The marshfolk are trapped.',
		objectives: [
			{ id: 'dm_spider_kill', description: 'Kill spiders in the Drowned Mire', type: 'kill', target: 'Spider', required: 8 },
		],
		rewards: { xp: 200, atk: 1 },
		giverNpcName: 'Marshwarden Lira',
		regionId: 'drowned_mire',
		isMainQuest: false,
	},

	side_dm_lanterns: {
		id: 'side_dm_lanterns',
		title: 'The Drowned Lanterns',
		description:
			'Strange lights have appeared beneath the bog water — pale lanterns that lure the unwary to a watery grave. A superstitious elder wants someone to investigate their source.',
		objectives: [
			{ id: 'dm_lantern_explore', description: 'Find the source of the bog lanterns', type: 'explore', target: 'bog_lanterns', required: 1 },
			{ id: 'dm_lantern_talk', description: 'Report findings to Elder Marsh', type: 'talk', target: 'Elder Marsh', required: 1 },
		],
		rewards: {
			xp: 220,
			rumor: {
				id: 'rumor_bog_lanterns',
				text: 'The lanterns burn with the same cold light seen in old paintings of the gods before they were gods. Curious, that.',
				source: 'Elder Marsh',
				accuracy: 'true',
			},
		},
		giverNpcName: 'Elder Marsh',
		regionId: 'drowned_mire',
		isMainQuest: false,
	},

	// ===================================================================
	// SIDE QUESTS — Frostpeak (dangerLevel 6)
	// ===================================================================
	side_fp_trolls: {
		id: 'side_fp_trolls',
		title: 'Troll Country',
		description:
			'The mountain passes have become impassable. Trolls have claimed the northern route and demand tribute from anyone who would cross. The miners cannot reach their veins.',
		objectives: [
			{ id: 'fp_troll_kill', description: 'Defeat trolls in Frostpeak', type: 'kill', target: 'Troll', required: 4 },
		],
		rewards: { xp: 280, hp: 3, atk: 1 },
		giverNpcName: 'Foreman Hild',
		regionId: 'frostpeak',
		isMainQuest: false,
	},

	side_fp_runes: {
		id: 'side_fp_runes',
		title: 'The Frozen Script',
		description:
			'A runekeeper says ancient glyphs have appeared on the ice walls of a collapsed mine — writing that shouldn\'t exist, in a script older than the mountains.',
		objectives: [
			{ id: 'fp_rune_explore', description: 'Explore the collapsed mine', type: 'explore', target: 'collapsed_mine', required: 1 },
			{ id: 'fp_rune_collect', description: 'Transcribe the runic inscriptions', type: 'collect', target: 'runic_transcription', required: 3 },
		],
		rewards: {
			xp: 300,
			story: {
				id: 'story_frozen_script',
				title: 'Words Older Than Gods',
				text: 'The runes are a warning, carved by hands long turned to dust: "Do not worship what replaced us. Remember what was taken."',
				teller: 'Runekeeper Asmund',
				type: 'lore',
			},
		},
		giverNpcName: 'Runekeeper Asmund',
		regionId: 'frostpeak',
		isMainQuest: false,
	},

	// ===================================================================
	// SIDE QUESTS — Sunstone Expanse (dangerLevel 7)
	// ===================================================================
	side_se_wraiths: {
		id: 'side_se_wraiths',
		title: 'Sand-Shrouded Wraiths',
		description:
			'Wraiths stalk the dunes at twilight, dragging travellers into the sand. The nomads whisper that these are the spirits of those who displeased the gods — but something about these hauntings feels deliberate.',
		objectives: [
			{ id: 'se_wraith_kill', description: 'Banish wraiths in the expanse', type: 'kill', target: 'Wraith', required: 6 },
		],
		rewards: { xp: 350, atk: 2 },
		giverNpcName: 'Nomad Khari',
		regionId: 'sunstone_expanse',
		isMainQuest: false,
	},

	side_se_oasis: {
		id: 'side_se_oasis',
		title: 'The Dry Spring',
		description:
			'The only oasis for leagues has gone dry. The water-keeper believes something in the grotto beneath has choked the source. Without water, the settlement dies within days.',
		objectives: [
			{ id: 'se_oasis_explore', description: 'Descend into the Oasis Grotto', type: 'explore', target: 'oasis_grotto', required: 1 },
			{ id: 'se_oasis_kill', description: 'Clear the blockage', type: 'kill', target: 'Ogre', required: 2 },
		],
		rewards: { xp: 320, hp: 5 },
		giverNpcName: 'Water-Keeper Zara',
		regionId: 'sunstone_expanse',
		isMainQuest: false,
		turnLimit: 50,
	},

	side_se_tomb: {
		id: 'side_se_tomb',
		title: 'Voices in the Sand',
		description:
			'A half-mad prospector stumbled out of a buried pyramid babbling about voices that called him by name. He insists the voices begged him to "tell the world what happened here."',
		objectives: [
			{ id: 'se_tomb_explore', description: 'Enter the Buried Pyramid', type: 'explore', target: 'buried_pyramid', required: 1 },
			{ id: 'se_tomb_talk', description: 'Speak to whatever waits within', type: 'talk', target: 'Pyramid Voice', required: 1 },
		],
		rewards: {
			xp: 400,
			rumor: {
				id: 'rumor_pyramid_voice',
				text: 'The voice in the pyramid wept. It said: "We were guardians once. They locked us in the dark and took our names."',
				source: 'The Buried Pyramid',
				accuracy: 'true',
			},
		},
		giverNpcName: 'Prospector Davi',
		regionId: 'sunstone_expanse',
		isMainQuest: false,
	},
};

// ---------------------------------------------------------------------------
// Helper: instantiate a quest from a catalog definition
// ---------------------------------------------------------------------------

export function createQuestFromDef(defId: string, turnAccepted: number): Quest | null {
	const def = QUEST_CATALOG[defId];
	if (!def) return null;

	const objectives: QuestObjective[] = def.objectives.map((o) => ({
		id: o.id,
		description: o.description,
		type: o.type,
		target: o.target,
		current: 0,
		required: o.required,
		completed: false,
	}));

	return {
		id: def.id,
		title: def.title,
		description: def.description,
		status: 'active',
		objectives,
		rewards: { ...def.rewards },
		giverNpcName: def.giverNpcName,
		regionId: def.regionId,
		isMainQuest: def.isMainQuest,
		turnAccepted,
		turnLimit: def.turnLimit,
	};
}

// ---------------------------------------------------------------------------
// Accept a quest
// ---------------------------------------------------------------------------

export function acceptQuest(state: GameState, questId: string): { success: boolean; message: string } {
	// Already active?
	if (state.quests.some((q) => q.id === questId && q.status === 'active')) {
		return { success: false, message: 'You are already on this quest.' };
	}

	// Already completed?
	if (state.completedQuestIds.includes(questId)) {
		return { success: false, message: 'You have already completed this quest.' };
	}

	// Already failed — allow retry
	const def = QUEST_CATALOG[questId];
	if (!def) {
		return { success: false, message: 'Unknown quest.' };
	}

	// Check prerequisite
	if (def.prerequisiteQuestId && !state.completedQuestIds.includes(def.prerequisiteQuestId)) {
		return { success: false, message: 'You are not yet ready for this quest.' };
	}

	const quest = createQuestFromDef(questId, state.turnCount);
	if (!quest) {
		return { success: false, message: 'Could not create quest.' };
	}

	// Remove from failed list on retry
	const failedIdx = state.failedQuestIds.indexOf(questId);
	if (failedIdx !== -1) {
		state.failedQuestIds.splice(failedIdx, 1);
	}

	state.quests.push(quest);
	return { success: true, message: `Quest accepted: ${quest.title}` };
}

// ---------------------------------------------------------------------------
// Update progress on active quests
// ---------------------------------------------------------------------------

export function updateQuestProgress(
	state: GameState,
	eventType: QuestObjectiveType,
	target: string,
	amount: number = 1
): string[] {
	const messages: string[] = [];

	for (const quest of state.quests) {
		if (quest.status !== 'active') continue;

		for (const obj of quest.objectives) {
			if (obj.completed) continue;
			if (obj.type !== eventType) continue;
			if (obj.target && obj.target !== target) continue;

			obj.current = Math.min(obj.current + amount, obj.required);
			if (obj.current >= obj.required) {
				obj.completed = true;
				messages.push(`[${quest.title}] ${obj.description} — complete!`);
			}
		}
	}

	return messages;
}

// ---------------------------------------------------------------------------
// Complete a quest (all objectives must be done)
// ---------------------------------------------------------------------------

export function completeQuest(state: GameState, questId: string): { success: boolean; messages: string[] } {
	const quest = state.quests.find((q) => q.id === questId && q.status === 'active');
	if (!quest) {
		return { success: false, messages: ['Quest not found or not active.'] };
	}

	const allDone = quest.objectives.every((o) => o.completed);
	if (!allDone) {
		return { success: false, messages: ['Not all objectives are complete.'] };
	}

	quest.status = 'completed';
	state.completedQuestIds.push(questId);

	const messages: string[] = [`Quest completed: ${quest.title}!`];

	// Grant rewards
	const r = quest.rewards;
	if (r.xp) {
		state.xp += r.xp;
		messages.push(`Gained ${r.xp} XP.`);
	}
	if (r.hp) {
		state.player.maxHp += r.hp;
		state.player.hp += r.hp;
		messages.push(`Max HP increased by ${r.hp}.`);
	}
	if (r.atk) {
		state.player.attack += r.atk;
		messages.push(`Attack increased by ${r.atk}.`);
	}
	if (r.rumor) {
		state.rumors.push(r.rumor);
		messages.push('You learned a new rumor.');
	}
	if (r.story) {
		if (!state.heardStories.includes(r.story.id)) {
			state.heardStories.push(r.story.id);
			messages.push(`New story unlocked: ${r.story.title}`);
		}
	}

	state.stats.questsCompleted++;
	return { success: true, messages };
}

// ---------------------------------------------------------------------------
// Fail a quest
// ---------------------------------------------------------------------------

export function failQuest(state: GameState, questId: string): string {
	const quest = state.quests.find((q) => q.id === questId && q.status === 'active');
	if (!quest) return 'Quest not found or not active.';

	quest.status = 'failed';
	state.failedQuestIds.push(questId);
	state.stats.questsFailed++;
	return `Quest failed: ${quest.title}`;
}

// ---------------------------------------------------------------------------
// Check timed quests and fail any that expired
// ---------------------------------------------------------------------------

export function checkTimedQuests(state: GameState): string[] {
	const messages: string[] = [];

	for (const quest of state.quests) {
		if (quest.status !== 'active') continue;
		if (quest.turnLimit === undefined) continue;

		const elapsed = state.turnCount - quest.turnAccepted;
		if (elapsed >= quest.turnLimit) {
			messages.push(failQuest(state, quest.id));
		}
	}

	return messages;
}

// ---------------------------------------------------------------------------
// Query helpers
// ---------------------------------------------------------------------------

export function getActiveQuests(state: GameState): Quest[] {
	return state.quests.filter((q) => q.status === 'active');
}

export function getAvailableQuests(state: GameState, npcName?: string, regionId?: string): QuestDef[] {
	const available: QuestDef[] = [];

	for (const def of Object.values(QUEST_CATALOG)) {
		// Skip quests the player already has active, completed, or failed-and-not-retryable
		if (state.quests.some((q) => q.id === def.id && q.status === 'active')) continue;
		if (state.completedQuestIds.includes(def.id)) continue;

		// Check prerequisite
		if (def.prerequisiteQuestId && !state.completedQuestIds.includes(def.prerequisiteQuestId)) continue;

		// Filter by NPC if provided
		if (npcName && def.giverNpcName !== npcName) continue;

		// Filter by region if provided
		if (regionId && def.regionId && def.regionId !== regionId) continue;

		available.push(def);
	}

	return available;
}
