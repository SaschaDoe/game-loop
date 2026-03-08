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
	// ===================================================================
	// SIDE QUESTS — Eldergrove (dangerLevel 5)
	// ===================================================================
	side_eg_bandits: {
		id: 'side_eg_bandits',
		title: 'The Briarwood Gang',
		description:
			'A ruthless band of outlaws has fortified a hollow beneath the great roots, ambushing caravans and pilgrims on the forest roads. The Wardens want them routed.',
		objectives: [
			{ id: 'eg_bandit_kill', description: 'Defeat bandits in the Eldergrove', type: 'kill', target: 'Bandit', required: 8 },
		],
		rewards: { xp: 200, atk: 1 },
		giverNpcName: 'Ranger Thandril',
		regionId: 'eldergrove',
		isMainQuest: false,
	},

	side_eg_temple: {
		id: 'side_eg_temple',
		title: 'The Forgotten Moon',
		description:
			'Deep in the Eldergrove stands a temple that no map records. The Archivist believes it predates the Ascension — and that something still tends its altar.',
		objectives: [
			{ id: 'eg_temple_explore', description: 'Find the Temple of the Forgotten Moon', type: 'explore', target: 'temple_forgotten_moon', required: 1 },
			{ id: 'eg_temple_talk', description: 'Report your findings to Archivist Faelorn', type: 'talk', target: 'Archivist Faelorn', required: 1 },
		],
		rewards: {
			xp: 250,
			story: {
				id: 'story_forgotten_moon',
				title: 'The Temple That Remembers',
				text: 'The altar still holds offerings — fresh flowers, undecayed after centuries. The inscriptions name no Ascended god. They name the moon, the roots, and a principle of Growth that predates all seven thrones.',
				teller: 'Archivist Faelorn',
				type: 'lore',
			},
		},
		giverNpcName: 'Archivist Faelorn',
		regionId: 'eldergrove',
		isMainQuest: false,
	},

	side_eg_spiders: {
		id: 'side_eg_spiders',
		title: 'Silk and Venom',
		description:
			'Giant forest spiders have woven webs across the canopy bridges connecting the elven settlements. The weavers cannot cross. The spiders must be dealt with before the city is cut in two.',
		objectives: [
			{ id: 'eg_spider_kill', description: 'Kill spiders in the Eldergrove', type: 'kill', target: 'Spider', required: 10 },
		],
		rewards: { xp: 220, hp: 3 },
		giverNpcName: 'Warden Ithilra',
		regionId: 'eldergrove',
		isMainQuest: false,
		turnLimit: 80,
	},

	side_eg_stag: {
		id: 'side_eg_stag',
		title: 'The Crystalline Stag',
		description:
			'A Crystalline Stag has been sighted near the Worldseed Tree — the first in a generation. The Wardens believe poachers are tracking it. Find the stag before they do.',
		objectives: [
			{ id: 'eg_stag_explore', description: 'Find the Crystalline Stag', type: 'explore', target: 'crystalline_stag', required: 1 },
			{ id: 'eg_stag_kill', description: 'Defeat the poachers', type: 'kill', target: 'Poacher', required: 3 },
		],
		rewards: {
			xp: 280,
			rumor: {
				id: 'rumor_crystalline_stag',
				text: 'The Stag bowed its crystal antlers to the old altar and light poured from the earth — raw Ley Line energy, unfiltered by any god. The trees sang.',
				source: 'Ranger Thandril',
				accuracy: 'true',
			},
		},
		giverNpcName: 'Ranger Thandril',
		regionId: 'eldergrove',
		isMainQuest: false,
	},

	side_eg_corruption: {
		id: 'side_eg_corruption',
		title: 'Roots of Corruption',
		description:
			'Black veins have appeared in the bark of the Eldest Trees near the forest edge. The Archivist says it resembles descriptions of the Grey — the alchemical weapon that killed the Verdant Basin.',
		objectives: [
			{ id: 'eg_corrupt_explore', description: 'Investigate the blighted trees', type: 'explore', target: 'blighted_grove', required: 1 },
			{ id: 'eg_corrupt_collect', description: 'Collect samples of the corruption', type: 'collect', target: 'blight_sample', required: 3 },
			{ id: 'eg_corrupt_talk', description: 'Return samples to Archivist Faelorn', type: 'talk', target: 'Archivist Faelorn', required: 1 },
		],
		rewards: {
			xp: 300,
			hp: 4,
			rumor: {
				id: 'rumor_eldergrove_blight',
				text: 'The blight is not natural disease. It is alchemical — the same compound that killed the Grey Wastes. Someone is testing it again, and the Eldergrove is the target.',
				source: 'Archivist Faelorn',
				accuracy: 'true',
			},
		},
		giverNpcName: 'Archivist Faelorn',
		regionId: 'eldergrove',
		isMainQuest: false,
	},

	side_eg_herbs: {
		id: 'side_eg_herbs',
		title: 'Moonpetal Harvest',
		description:
			'The elven healers need moonpetals — rare flowers that bloom only under starlight in the deepest glades. Gather them before the next new moon, when their potency fades.',
		objectives: [
			{ id: 'eg_herbs_collect', description: 'Collect moonpetals from the deep glades', type: 'collect', target: 'moonpetal', required: 6 },
		],
		rewards: { xp: 180, hp: 3 },
		giverNpcName: 'Warden Ithilra',
		regionId: 'eldergrove',
		isMainQuest: false,
		turnLimit: 70,
	},

	side_eg_silverleaf: {
		id: 'side_eg_silverleaf',
		title: 'The Silver Harvest',
		description:
			'The Archivists need silverleaf to bind new volumes — the leaves must be harvested fresh from living silverwood, which means venturing into groves the spiders have claimed.',
		objectives: [
			{ id: 'eg_silver_collect', description: 'Gather silverleaf from the spider groves', type: 'collect', target: 'silverleaf', required: 8 },
			{ id: 'eg_silver_kill', description: 'Clear spiders guarding the groves', type: 'kill', target: 'Spider', required: 4 },
		],
		rewards: {
			xp: 200,
			rumor: {
				id: 'rumor_silverleaf_books',
				text: 'The Archivists bind their most dangerous texts in silverleaf. The leaves absorb Old Magic, making the books undetectable to the Ascended\'s Veiled Hand.',
				source: 'Archivist Faelorn',
				accuracy: 'true',
			},
		},
		giverNpcName: 'Archivist Faelorn',
		regionId: 'eldergrove',
		isMainQuest: false,
	},

	side_eg_glowcaps: {
		id: 'side_eg_glowcaps',
		title: 'The Mushroom Caves',
		description:
			'A network of caves beneath the great roots harbors glowcap mushrooms — prized by healers and alchemists. But something has moved into the caves. The mushroom gatherers won\'t go back.',
		objectives: [
			{ id: 'eg_glow_explore', description: 'Explore the Mushroom Caves', type: 'explore', target: 'mushroom_caves', required: 1 },
			{ id: 'eg_glow_collect', description: 'Collect glowcap mushrooms', type: 'collect', target: 'glowcap_mushroom', required: 5 },
			{ id: 'eg_glow_kill', description: 'Clear the cave intruders', type: 'kill', target: 'Troll', required: 2 },
		],
		rewards: { xp: 250, hp: 4, atk: 1 },
		giverNpcName: 'Ranger Thandril',
		regionId: 'eldergrove',
		isMainQuest: false,
	},

	side_eg_thorn_king: {
		id: 'side_eg_thorn_king',
		title: 'The Thorn King\'s Ransom',
		description:
			'The Briarwood Gang has captured an elven Archivist carrying irreplaceable texts. The Thorn King demands a ransom the Wardens refuse to pay. Rescue the hostage — by force or by cunning.',
		objectives: [
			{ id: 'eg_thorn_explore', description: 'Find the Bandit King\'s Hollow', type: 'explore', target: 'bandit_kings_hollow', required: 1 },
			{ id: 'eg_thorn_kill', description: 'Defeat the Thorn King\'s lieutenants', type: 'kill', target: 'Bandit', required: 6 },
			{ id: 'eg_thorn_talk', description: 'Free the captive Archivist', type: 'talk', target: 'Captive Archivist', required: 1 },
		],
		rewards: {
			xp: 350,
			atk: 2,
			story: {
				id: 'story_thorn_king',
				title: 'The Lord Who Became a Bandit',
				text: 'Lord Aldren Voss lost his ancestral lands to a Church of Solaris decree. The priests cited an "ancestor\'s debt" — a legal fiction designed to seize his family\'s holdings. Now he takes from the road what was taken from him by the altar.',
				teller: 'Captive Archivist',
				type: 'personal',
			},
		},
		giverNpcName: 'Warden Ithilra',
		regionId: 'eldergrove',
		isMainQuest: false,
	},

	side_eg_beast: {
		id: 'side_eg_beast',
		title: 'The Thornveil Beast',
		description:
			'Something ancient and immense stalks the deepest paths of the Eldergrove. Tracks larger than a wagon wheel, trees gouged by claws the length of swords. The Council has sealed the records, but the Rangers need answers before someone dies.',
		objectives: [
			{ id: 'eg_beast_explore1', description: 'Follow the Thornveil Beast\'s tracks', type: 'explore', target: 'thornveil_tracks', required: 1 },
			{ id: 'eg_beast_explore2', description: 'Find the Beast\'s lair', type: 'explore', target: 'beast_lair', required: 1 },
			{ id: 'eg_beast_talk', description: 'Report findings to Warden Ithilra', type: 'talk', target: 'Warden Ithilra', required: 1 },
		],
		rewards: {
			xp: 400,
			hp: 5,
			story: {
				id: 'story_thornveil_beast',
				title: 'The Last Guardian',
				text: 'The creature is no beast. It is a Guardian — one of the ancient wardens the Original Seven left behind to protect the Ley Line nexus points. It has been here since before the Ascension, watching over something buried deep beneath the forest. It did not attack. It watched. And then it let you leave.',
				teller: 'Warden Ithilra',
				type: 'lore',
			},
		},
		giverNpcName: 'Ranger Thandril',
		regionId: 'eldergrove',
		isMainQuest: false,
		prerequisiteQuestId: 'side_eg_stag',
	},

	side_eg_canopy: {
		id: 'side_eg_canopy',
		title: 'The High Road',
		description:
			'Canopy Stalkers have severed the vine bridges between two elven settlements. Travelers must take the dangerous ground route through spider territory. The Wardens need someone to clear the canopy and repair the bridges.',
		objectives: [
			{ id: 'eg_canopy_kill', description: 'Kill Canopy Stalkers', type: 'kill', target: 'Canopy Stalker', required: 4 },
			{ id: 'eg_canopy_collect', description: 'Gather spider silk for bridge repair', type: 'collect', target: 'spider_silk', required: 5 },
		],
		rewards: { xp: 280, hp: 3, atk: 1 },
		giverNpcName: 'Warden Ithilra',
		regionId: 'eldergrove',
		isMainQuest: false,
	},

	side_eg_poachers: {
		id: 'side_eg_poachers',
		title: 'Hunters Become Hunted',
		description:
			'Poachers from outside the forest are trapping and killing rare creatures for profit — silverwood foxes for their pelts, glowcap beetles for their shells. The Rangers want them stopped, permanently.',
		objectives: [
			{ id: 'eg_poach_kill', description: 'Defeat the poachers', type: 'kill', target: 'Poacher', required: 6 },
			{ id: 'eg_poach_explore', description: 'Destroy the poacher camp', type: 'explore', target: 'poacher_camp', required: 1 },
		],
		rewards: { xp: 220, atk: 1 },
		giverNpcName: 'Ranger Thandril',
		regionId: 'eldergrove',
		isMainQuest: false,
	},

	side_eg_lost_patrol: {
		id: 'side_eg_lost_patrol',
		title: 'The Lost Patrol',
		description:
			'A patrol of three Rangers entered the deep forest to map new spider nests and hasn\'t returned. The Thornveil camp grows anxious. Find them — or what remains.',
		objectives: [
			{ id: 'eg_patrol_explore', description: 'Search the deep forest for the lost patrol', type: 'explore', target: 'lost_patrol_site', required: 1 },
			{ id: 'eg_patrol_kill', description: 'Clear the spider nest', type: 'kill', target: 'Spider', required: 8 },
			{ id: 'eg_patrol_talk', description: 'Report back to Ranger Thandril', type: 'talk', target: 'Ranger Thandril', required: 1 },
		],
		rewards: { xp: 260, hp: 4 },
		giverNpcName: 'Ranger Thandril',
		regionId: 'eldergrove',
		isMainQuest: false,
		turnLimit: 60,
	},

	// ===================================================================
	// SIDE QUESTS — Korthaven
	// ===================================================================
	side_kort_murders: {
		id: 'side_kort_murders',
		title: 'The Gilded Mask Murders',
		description:
			'Merchants in Korthaven are turning up dead, each wearing a golden mask. Inspector Kaelen suspects a ritualistic motive. Investigate the murders, gather evidence, and uncover the truth.',
		objectives: [
			{ id: 'kort_murders_talk1', description: 'Speak with Inspector Kaelen', type: 'talk', target: 'Inspector Kaelen', required: 1 },
			{ id: 'kort_murders_talk2', description: 'Speak with Madame Vesper', type: 'talk', target: 'Madame Vesper', required: 1 },
			{ id: 'kort_murders_collect', description: 'Collect golden mask fragments', type: 'collect', target: 'golden_mask_fragment', required: 3 },
			{ id: 'kort_murders_explore', description: 'Explore the hidden ritual chamber', type: 'explore', target: 'hidden_ritual_chamber', required: 1 },
		],
		rewards: {
			xp: 400,
			hp: 5,
			rumor: {
				id: 'rumor_gilded_masks',
				text: 'The golden masks are replicas of those worn during the Ascension. Someone in Korthaven is recreating the old rites — but to what end?',
				source: 'Inspector Kaelen',
				accuracy: 'true',
			},
		},
		giverNpcName: 'Inspector Kaelen',
		regionId: 'korthaven',
		isMainQuest: false,
	},

	side_kort_thieves: {
		id: 'side_kort_thieves',
		title: 'Shadows Over Korthaven',
		description:
			'The Shadow Court controls Korthaven\'s underworld. Guildmaster Nyx offers membership — but first, you must prove your worth by recovering a stolen ledger from rival smugglers.',
		objectives: [
			{ id: 'kort_thieves_talk1', description: 'Speak with Guildmaster Nyx', type: 'talk', target: 'Guildmaster Nyx', required: 1 },
			{ id: 'kort_thieves_explore', description: 'Explore the smuggler\'s tunnels', type: 'explore', target: 'smuggler_tunnels', required: 1 },
			{ id: 'kort_thieves_collect', description: 'Recover the stolen ledger', type: 'collect', target: 'stolen_ledger', required: 1 },
			{ id: 'kort_thieves_talk2', description: 'Deliver the ledger to Sera the Fence', type: 'talk', target: 'Sera the Fence', required: 1 },
		],
		rewards: {
			xp: 300,
			atk: 2,
			rumor: {
				id: 'rumor_shadow_court',
				text: 'The Shadow Court is not merely a thieves\' guild. They guard secrets older than Korthaven itself — secrets about what lies beneath the city.',
				source: 'Guildmaster Nyx',
				accuracy: 'true',
			},
		},
		giverNpcName: 'Guildmaster Nyx',
		regionId: 'korthaven',
		isMainQuest: false,
	},

	side_kort_arena: {
		id: 'side_kort_arena',
		title: 'Blood and Glory',
		description:
			'The Crucible arena crowns a new champion each season. Arena Master Gorath challenges you to fight your way through the ranks and claim the title.',
		objectives: [
			{ id: 'kort_arena_kill1', description: 'Defeat arena fighters', type: 'kill', target: 'Arena Fighter', required: 5 },
			{ id: 'kort_arena_kill2', description: 'Defeat the Arena Champion', type: 'kill', target: 'Arena Champion', required: 1 },
		],
		rewards: {
			xp: 500,
			hp: 5,
			atk: 2,
			story: {
				id: 'story_arena_secret',
				title: 'Beneath the Crucible',
				text: 'Beneath the arena floor lies a sealed vault. The champion\'s blood — spilled in victory — trickles through the cracks and feeds something old. Gorath knows, but he will never speak of it.',
				teller: 'Arena Master Gorath',
				type: 'lore',
			},
		},
		giverNpcName: 'Arena Master Gorath',
		regionId: 'korthaven',
		isMainQuest: false,
	},

	side_kort_crown: {
		id: 'side_kort_crown',
		title: 'The Crown of Lies',
		description:
			'The murders, the thieves\' guild, the arena — they\'re all connected. Duke Arandel reveals a conspiracy called the Veiled Hand that threatens to recreate the Ascension ritual. Stop them before Korthaven burns.',
		objectives: [
			{ id: 'kort_crown_talk1', description: 'Speak with Duke Arandel', type: 'talk', target: 'Duke Arandel', required: 1 },
			{ id: 'kort_crown_explore', description: 'Infiltrate the Veiled Hand hideout', type: 'explore', target: 'veiled_hand_hideout', required: 1 },
			{ id: 'kort_crown_collect', description: 'Collect ritual components', type: 'collect', target: 'ritual_component', required: 3 },
			{ id: 'kort_crown_kill', description: 'Defeat Veiled Hand agents', type: 'kill', target: 'Veiled Hand Agent', required: 4 },
			{ id: 'kort_crown_talk2', description: 'Confront the Masked Figure', type: 'talk', target: 'The Masked Figure', required: 1 },
			{ id: 'kort_crown_talk3', description: 'Report back to Duke Arandel', type: 'talk', target: 'Duke Arandel', required: 1 },
		],
		rewards: {
			xp: 800,
			hp: 8,
			atk: 3,
			story: {
				id: 'story_veiled_hand',
				title: 'The Veiled Hand\'s Purpose',
				text: 'The Veiled Hand sought to recreate the Ascension — to steal divinity as it was stolen once before. Their leader whispered of an Eighth throne, empty and waiting. The ritual was stopped, but the throne remains.',
				teller: 'Duke Arandel',
				type: 'lore',
			},
			rumor: {
				id: 'rumor_the_eighth',
				text: 'There are seven thrones, but the Veiled Hand spoke of an Eighth — a seat of power never claimed. If the Ascension can be repeated, anyone could become a god.',
				source: 'The Masked Figure',
				accuracy: 'true',
			},
		},
		giverNpcName: 'Duke Arandel',
		regionId: 'korthaven',
		isMainQuest: false,
		prerequisiteQuestId: 'side_kort_murders',
	},

	side_kort_smuggler: {
		id: 'side_kort_smuggler',
		title: 'The Smuggler\'s Ledger',
		description:
			'Dock Foreman Bram needs someone to retrieve a shipping ledger that fell into the wrong hands. The smuggler\'s tunnels beneath the docks hold the answers — and the dangers.',
		objectives: [
			{ id: 'kort_smuggler_talk', description: 'Speak with Dock Foreman Bram', type: 'talk', target: 'Dock Foreman Bram', required: 1 },
			{ id: 'kort_smuggler_explore', description: 'Explore the dockside tunnels', type: 'explore', target: 'dockside_tunnels', required: 1 },
			{ id: 'kort_smuggler_collect', description: 'Recover the smuggler\'s ledger', type: 'collect', target: 'smuggler_ledger', required: 1 },
		],
		rewards: { xp: 200, hp: 3 },
		giverNpcName: 'Dock Foreman Bram',
		regionId: 'korthaven',
		isMainQuest: false,
		turnLimit: 80,
	},

	// ===================================================================
	// SIDE QUESTS — Arcane Conservatory (magic school)
	// ===================================================================

	// --- Enrollment ---
	side_ac_enrollment: {
		id: 'side_ac_enrollment',
		title: 'The Entrance Exam',
		description:
			'Archmage Aldric Voss studies you with cold, appraising eyes. "Every student must prove themselves in the practice vaults before they earn a place here. Clear out the slimes — and try not to embarrass yourself."',
		objectives: [
			{ id: 'ac_enroll_kill', description: 'Kill slimes in the practice vaults', type: 'kill', target: 'Slime', required: 5 },
		],
		rewards: { xp: 100, hp: 2 },
		giverNpcName: 'Archmage Aldric Voss',
		regionId: 'arcane_conservatory',
		isMainQuest: false,
	},

	// --- Semester 1: Foundations ---
	side_ac_elem101: {
		id: 'side_ac_elem101',
		title: 'Elements 101: First Spark',
		description:
			'Professor Ignis Valdren slams a tome on the lectern. "Fire is not your friend. It is a force that tolerates your attention. Collect three fire crystals from the elemental chamber — without burning down my classroom."',
		objectives: [
			{ id: 'ac_elem101_collect', description: 'Collect fire crystals', type: 'collect', target: 'fire_crystal', required: 3 },
		],
		rewards: { xp: 120, atk: 1 },
		giverNpcName: 'Professor Ignis Valdren',
		regionId: 'arcane_conservatory',
		isMainQuest: false,
	},

	side_ac_ench101: {
		id: 'side_ac_ench101',
		title: 'Enchantment 101: Ward Weaving',
		description:
			'Professor Seraphina Ashveil traces silver lines in the air. "Every doorway in this school is warded. Your assignment: study the dormitory ward and understand its weave. Touch nothing you cannot unravel."',
		objectives: [
			{ id: 'ac_ench101_explore', description: 'Study the dormitory ward', type: 'explore', target: 'dormitory_ward', required: 1 },
		],
		rewards: { xp: 120, hp: 2 },
		giverNpcName: 'Professor Seraphina Ashveil',
		regionId: 'arcane_conservatory',
		isMainQuest: false,
	},

	side_ac_alch101: {
		id: 'side_ac_alch101',
		title: 'Alchemy 101: First Brew',
		description:
			'Professor Bramwell Thornwick adjusts his soot-stained spectacles. "Your first potion will be a simple mana restorative. Gather starfern and mandrake root from the greenhouse. And for pity\'s sake, don\'t confuse them."',
		objectives: [
			{ id: 'ac_alch101_collect1', description: 'Collect starfern', type: 'collect', target: 'starfern', required: 2 },
			{ id: 'ac_alch101_collect2', description: 'Collect mandrake root', type: 'collect', target: 'mandrake_root', required: 2 },
		],
		rewards: { xp: 120, hp: 2, items: ['mana_potion'] },
		giverNpcName: 'Professor Bramwell Thornwick',
		regionId: 'arcane_conservatory',
		isMainQuest: false,
	},

	side_ac_div101: {
		id: 'side_ac_div101',
		title: 'Divination 101: The Scryer\'s Eye',
		description:
			'Professor Mirael Dawnwhisper sits beneath a sky of revolving brass instruments. "Before you can read the stars, you must learn to see. Visit the astral observatory and open your mind to what drifts between the spheres."',
		objectives: [
			{ id: 'ac_div101_explore', description: 'Visit the astral observatory', type: 'explore', target: 'astral_observatory', required: 1 },
		],
		rewards: { xp: 120, hp: 1 },
		giverNpcName: 'Professor Mirael Dawnwhisper',
		regionId: 'arcane_conservatory',
		isMainQuest: false,
	},

	side_ac_midterm: {
		id: 'side_ac_midterm',
		title: 'Midterm: Trial of the Practice Vault',
		description:
			'The practice vaults have been restocked with animated skeletons for the midterm examination. Survive the gauntlet and prove you have learned something this semester.',
		objectives: [
			{ id: 'ac_midterm_kill', description: 'Kill skeletons in the practice vaults', type: 'kill', target: 'Skeleton', required: 8 },
		],
		rewards: { xp: 200, hp: 3 },
		regionId: 'arcane_conservatory',
		isMainQuest: false,
		prerequisiteQuestId: 'side_ac_enrollment',
	},

	// --- Semester 2: Advanced ---
	side_ac_elem201: {
		id: 'side_ac_elem201',
		title: 'Elements 201: Containment',
		description:
			'Professor Ignis Valdren folds his arms. "Last semester you collected crystals. This semester you face the fire itself. Three elementals have escaped their binding circles. Contain them — permanently."',
		objectives: [
			{ id: 'ac_elem201_kill', description: 'Defeat fire elementals', type: 'kill', target: 'Fire Elemental', required: 3 },
		],
		rewards: { xp: 200, atk: 1 },
		giverNpcName: 'Professor Ignis Valdren',
		regionId: 'arcane_conservatory',
		isMainQuest: false,
		prerequisiteQuestId: 'side_ac_elem101',
	},

	side_ac_ench201: {
		id: 'side_ac_ench201',
		title: 'Enchantment 201: Breaking Curses',
		description:
			'Professor Seraphina Ashveil\'s expression is grim. "A student accessed the cursed archive without authorization. The wards triggered and the section is now sealed by hostile enchantments. Retrieve the cursed tome they disturbed — before it spreads."',
		objectives: [
			{ id: 'ac_ench201_explore', description: 'Enter the cursed archive', type: 'explore', target: 'cursed_archive', required: 1 },
			{ id: 'ac_ench201_collect', description: 'Retrieve the cursed tome', type: 'collect', target: 'cursed_tome', required: 1 },
		],
		rewards: { xp: 200, hp: 3 },
		giverNpcName: 'Professor Seraphina Ashveil',
		regionId: 'arcane_conservatory',
		isMainQuest: false,
		prerequisiteQuestId: 'side_ac_ench101',
	},

	side_ac_alch201: {
		id: 'side_ac_alch201',
		title: 'Alchemy 201: Transmutation',
		description:
			'Professor Bramwell Thornwick whispers reverently. "Transmutation is the art of convincing matter to become something greater. Phoenix ash and void salt — rare, volatile, magnificent. Gather them, and we will brew something that changes the rules."',
		objectives: [
			{ id: 'ac_alch201_collect1', description: 'Collect phoenix ash', type: 'collect', target: 'phoenix_ash', required: 2 },
			{ id: 'ac_alch201_collect2', description: 'Collect void salt', type: 'collect', target: 'void_salt', required: 2 },
		],
		rewards: { xp: 250, items: ['philosophers_draught'] },
		giverNpcName: 'Professor Bramwell Thornwick',
		regionId: 'arcane_conservatory',
		isMainQuest: false,
		prerequisiteQuestId: 'side_ac_alch101',
	},

	side_ac_div201: {
		id: 'side_ac_div201',
		title: 'Divination 201: Star Reading',
		description:
			'Professor Mirael Dawnwhisper\'s voice trembles. "The advanced observatory reveals things the basic instruments cannot. I need a student brave enough to look — and to tell me if they see what I have seen in the stars."',
		objectives: [
			{ id: 'ac_div201_explore', description: 'Visit the advanced astral observatory', type: 'explore', target: 'astral_observatory_advanced', required: 1 },
			{ id: 'ac_div201_talk', description: 'Report your visions to Professor Dawnwhisper', type: 'talk', target: 'Professor Mirael Dawnwhisper', required: 1 },
		],
		rewards: {
			xp: 200,
			hp: 2,
			rumor: {
				id: 'rumor_star_reading',
				text: 'The stars do not move as the gods decree. They follow older paths — paths that lead to seven thrones, each casting a shadow the heavens refuse to acknowledge.',
				source: 'Professor Mirael Dawnwhisper',
				accuracy: 'true',
			},
		},
		giverNpcName: 'Professor Mirael Dawnwhisper',
		regionId: 'arcane_conservatory',
		isMainQuest: false,
		prerequisiteQuestId: 'side_ac_div101',
	},

	side_ac_final: {
		id: 'side_ac_final',
		title: 'Final Exam: The Forbidden Vault',
		description:
			'The final examination takes place in the Forbidden Vault — a sealed chamber beneath the school where failed experiments and dangerous specimens are contained. Defeat the Vault Guardian and survive the depths.',
		objectives: [
			{ id: 'ac_final_kill', description: 'Defeat the Vault Guardian', type: 'kill', target: 'Vault Guardian', required: 1 },
			{ id: 'ac_final_explore', description: 'Explore the forbidden vault', type: 'explore', target: 'forbidden_vault', required: 1 },
		],
		rewards: { xp: 400, hp: 5, atk: 2 },
		regionId: 'arcane_conservatory',
		isMainQuest: false,
		prerequisiteQuestId: 'side_ac_midterm',
	},

	// --- Side Quests ---
	side_ac_library: {
		id: 'side_ac_library',
		title: 'The Restricted Section',
		description:
			'Professor Seraphina Ashveil lowers her voice. "There is a section of the library that has been sealed for decades. The wards have weakened. I need someone to inspect the restricted section before anything leaks out — and to report what books remain."',
		objectives: [
			{ id: 'ac_library_explore', description: 'Explore the restricted section', type: 'explore', target: 'restricted_section', required: 1 },
		],
		rewards: {
			xp: 150,
			rumor: {
				id: 'rumor_removed_books',
				text: 'Entire shelves have been stripped bare. The removed books all shared one subject: the mortal lives of the Ascended before they claimed their thrones.',
				source: 'Restricted section records',
				accuracy: 'true',
			},
		},
		giverNpcName: 'Professor Seraphina Ashveil',
		regionId: 'arcane_conservatory',
		isMainQuest: false,
		turnLimit: 120,
	},

	side_ac_missing: {
		id: 'side_ac_missing',
		title: 'Missing Students',
		description:
			'Three students ventured into the catacombs beneath the school on a dare and have not returned. Their journals may reveal what happened. The catacombs are infested with the restless dead.',
		objectives: [
			{ id: 'ac_missing_collect', description: 'Find student journals in the catacombs', type: 'collect', target: 'student_journal', required: 3 },
			{ id: 'ac_missing_kill', description: 'Clear skeletons from the catacombs', type: 'kill', target: 'Skeleton', required: 6 },
		],
		rewards: { xp: 200, hp: 3 },
		regionId: 'arcane_conservatory',
		isMainQuest: false,
	},

	side_ac_rival: {
		id: 'side_ac_rival',
		title: 'The Rival\'s Challenge',
		description:
			'A fellow student named Caelum Darkthorn has challenged you to a formal duel in the practice arena. He claims no outsider deserves a place at the Conservatory. Prove him wrong.',
		objectives: [
			{ id: 'ac_rival_kill', description: 'Defeat Caelum Darkthorn in a duel', type: 'kill', target: 'Caelum Darkthorn', required: 1 },
		],
		rewards: { xp: 150, atk: 1 },
		regionId: 'arcane_conservatory',
		isMainQuest: false,
	},

	side_ac_tunnels: {
		id: 'side_ac_tunnels',
		title: 'Beneath the School',
		description:
			'Strange noises echo through the walls at night. Something skitters in the service tunnels beneath the Conservatory. The groundskeeper refuses to investigate alone.',
		objectives: [
			{ id: 'ac_tunnels_explore', description: 'Explore the school tunnels', type: 'explore', target: 'school_tunnels', required: 1 },
			{ id: 'ac_tunnels_kill', description: 'Kill spiders in the tunnels', type: 'kill', target: 'Spider', required: 4 },
		],
		rewards: { xp: 180, hp: 2 },
		regionId: 'arcane_conservatory',
		isMainQuest: false,
	},

	side_ac_headmaster: {
		id: 'side_ac_headmaster',
		title: 'The Headmaster\'s Secret',
		description:
			'The restricted section hinted at something darker — a hidden vault accessible only from the headmaster\'s private chambers. What is Archmage Voss hiding behind his wards?',
		objectives: [
			{ id: 'ac_headmaster_explore', description: 'Find the headmaster\'s hidden vault', type: 'explore', target: 'headmaster_vault', required: 1 },
			{ id: 'ac_headmaster_collect', description: 'Recover Veiled Hand orders', type: 'collect', target: 'veiled_hand_orders', required: 1 },
		],
		rewards: {
			xp: 300,
			rumor: {
				id: 'rumor_voss_veiled_hand',
				text: 'Archmage Aldric Voss is a ranking member of the Veiled Hand. The Conservatory is not merely a school — it is a recruitment ground. The brightest students are quietly inducted into the order.',
				source: 'Sealed correspondence in the headmaster\'s vault',
				accuracy: 'true',
			},
		},
		regionId: 'arcane_conservatory',
		isMainQuest: false,
		prerequisiteQuestId: 'side_ac_library',
	},

	side_ac_ingredients: {
		id: 'side_ac_ingredients',
		title: 'Rare Ingredients',
		description:
			'Professor Bramwell Thornwick rubs his hands. "I am working on an experimental elixir — a draught that lets the drinker walk in dreams. I need phoenix ash and dreamleaf. The first is dangerous to gather; the second is dangerous to touch."',
		objectives: [
			{ id: 'ac_ingredients_collect1', description: 'Collect phoenix ash', type: 'collect', target: 'phoenix_ash', required: 3 },
			{ id: 'ac_ingredients_collect2', description: 'Collect dreamleaf', type: 'collect', target: 'dreamleaf', required: 2 },
		],
		rewards: { xp: 200, items: ['dreamwalker_elixir'] },
		giverNpcName: 'Professor Bramwell Thornwick',
		regionId: 'arcane_conservatory',
		isMainQuest: false,
	},

	side_ac_ghost: {
		id: 'side_ac_ghost',
		title: 'Ghost in the Library',
		description:
			'Students report a spectral figure drifting between the bookshelves after midnight, pulling volumes from the shelves and reading by ghostlight. The librarian wants it banished before it damages the collection.',
		objectives: [
			{ id: 'ac_ghost_kill', description: 'Defeat the Scholar Wraith', type: 'kill', target: 'Scholar Wraith', required: 1 },
		],
		rewards: {
			xp: 180,
			hp: 2,
			story: {
				id: 'story_scholar_wraith',
				title: 'The Scholar Who Would Not Leave',
				text: 'The wraith was once a professor who died mid-research, searching for proof that the Ascended gods had mortal identities. Death did not stop the inquiry. The ghost still turns pages, still takes notes in spectral ink, still searches for the truth.',
				teller: 'The fading whisper of the Scholar Wraith',
				type: 'personal',
			},
		},
		regionId: 'arcane_conservatory',
		isMainQuest: false,
	},

	side_ac_expelled: {
		id: 'side_ac_expelled',
		title: 'The Chronomancer\'s Journal',
		description:
			'Rumor has it a student was expelled years ago for practicing chronomancy — forbidden time magic. Their journal was confiscated but never destroyed. It may still be hidden somewhere in the school.',
		objectives: [
			{ id: 'ac_expelled_collect', description: 'Find the chronomancer\'s journal', type: 'collect', target: 'chronomancer_journal', required: 1 },
		],
		rewards: {
			xp: 200,
			rumor: {
				id: 'rumor_chronomancer',
				text: 'The expelled student claimed to have glimpsed the moment of the Ascension through a temporal rift. They saw seven figures in masks climbing steps that led to empty thrones — and something vast and luminous being dragged away in chains.',
				source: 'The chronomancer\'s journal',
				accuracy: 'true',
			},
		},
		regionId: 'arcane_conservatory',
		isMainQuest: false,
	},

	side_ac_garden: {
		id: 'side_ac_garden',
		title: 'The Poisoned Garden',
		description:
			'Professor Bramwell Thornwick rushes in, breathless. "The botanical garden has been overtaken by blighted vines — aggressive, venomous, and spreading fast. If we don\'t stop them, the entire greenhouse will be lost. I need the vines cut back and starfern gathered for an antidote."',
		objectives: [
			{ id: 'ac_garden_kill', description: 'Destroy blighted vines', type: 'kill', target: 'Blighted Vine', required: 6 },
			{ id: 'ac_garden_collect', description: 'Collect starfern for the antidote', type: 'collect', target: 'starfern', required: 3 },
		],
		rewards: { xp: 180, hp: 2, items: ['antidote'] },
		giverNpcName: 'Professor Bramwell Thornwick',
		regionId: 'arcane_conservatory',
		isMainQuest: false,
	},

	side_ac_artifact: {
		id: 'side_ac_artifact',
		title: 'The Lost Artifact',
		description:
			'An old blueprint found in the archives references a sealed chamber beneath the oldest wing of the school — the artifact chamber, built by the Conservatory\'s founders. Whatever they locked inside has been forgotten for centuries.',
		objectives: [
			{ id: 'ac_artifact_explore', description: 'Find and enter the artifact chamber', type: 'explore', target: 'artifact_chamber', required: 1 },
			{ id: 'ac_artifact_collect', description: 'Recover the Founder\'s Crystal', type: 'collect', target: 'founders_crystal', required: 1 },
		],
		rewards: { xp: 250, hp: 3, atk: 1 },
		regionId: 'arcane_conservatory',
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
