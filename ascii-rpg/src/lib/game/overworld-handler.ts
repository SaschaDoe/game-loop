import type { GameState, GameMap, Entity, Position, NPC, NPCMood, CachedLocationState, Difficulty, CharacterRace } from './types';
import type { WorldMap, OverworldTile, Settlement, DungeonEntrance, PointOfInterest, RegionId } from './overworld';
import { generateWorld, TERRAIN_DISPLAY, WORLD_W, WORLD_H, REGION_DEFS } from './overworld';
import { addMessage, effectiveSightRadius, detectAdjacentSecrets, processAchievements, checkLevelUp } from './engine-utils';
import { dimColor } from './renderer';
import { generateMap, getSpawnPositions } from './map';
import { createVisibilityGrid, updateVisibility } from './fov';
import { generateSettlementByType, generateStartingLocation } from './locations';
import { createMonster, pickMonsterDef, pickBossDef, isBossLevel, MONSTER_DEFS } from './monsters';
import { createRng, hashSeed } from './seeded-random';
import { placeTraps, detectAdjacentTraps } from './traps';
import { placeHazards } from './hazards';
import { placeChests } from './chests';
import { placeLandmarks } from './landmarks';
import { tickSurvival, MAX_SURVIVAL } from './survival';
import { tickAcademy, createAcademyState } from './academy';
import { difficultySpawnCount, applyDifficultyToEnemy } from './difficulty';
import { ITEM_CATALOG, addToInventory, createEmptyInventory, createEmptyEquipment, type WorldContainer, type Item } from './items';
import { BOOK_CATALOG, getAllBookIds } from './books';
import { updateQuestProgress, completeQuest } from './quests';
import { createDefaultStats } from './achievements';
import { createEmptyMastery } from './mastery';
import { getTimePhase, phaseName, sightModifier } from './day-night';
import { applyEffect } from './status-effects';

// ── Constants ──

const MAP_W = 50;
const MAP_H = 24;

export const OVERWORLD_SIGHT_RADIUS = 5; // default/plains
export const OVERWORLD_VIEWPORT_W = MAP_W;
export const OVERWORLD_VIEWPORT_H = MAP_H;

/** Terrain-based overworld sight radius: open terrain = 6, forest/swamp = 3, mountain-adjacent/snow = 2. */
export const TERRAIN_SIGHT_RADIUS: Partial<Record<string, number>> = {
	grass: 6,
	farmland: 6,
	sand: 7, // flat desert, good visibility
	oasis: 6,
	forest: 3,
	dead_trees: 3,
	swamp: 3,
	mud: 4,
	snow: 4,
	ice: 4,
	ash: 4,
	scorched: 5,
	rock: 3,
};

/** Flavor text shown when entering a new region. */
export const REGION_FLAVOR: Record<string, string> = {
	greenweald: 'Ancient trees tower overhead, their canopy filtering emerald light.',
	ashlands: 'The air shimmers with heat. Ash drifts like grey snow.',
	hearthlands: 'Golden fields stretch to the horizon, dotted with farmsteads and church spires.',
	frostpeak: 'A biting wind howls through ice-crusted peaks. Your breath crystallizes.',
	drowned_mire: 'The ground squelches underfoot. A sour mist clings to the dead trees.',
	sunstone_expanse: 'Endless dunes ripple under a blazing sun. Sand whispers against stone.',
	thornlands: 'Rugged highlands choked with thorny undergrowth. Rusted iron relics dot the ridgeline.',
	pale_coast: 'Salt spray stings your face. Grey waves crash against pale cliffs. The Hollow Sea stretches to the horizon.',
	glassfields: 'Shattered prisms catch the light, scattering rainbows across fields of vitrified earth. The air hums with residual magic.',
	verdant_deep: 'The canopy closes overhead like a living ceiling. Bioluminescent fungi pulse along the trunks. Something ancient watches from the green darkness.',
	mirrow_wastes: 'Dead trees claw at a grey sky. The river stones are stained rust-red despite centuries of rain. Griefmoths drift through the silence like living lanterns.',
	silence_peaks: 'The wind dies. Your footsteps make no sound. Snow falls in perfect silence, and the mountains swallow every echo. Something fundamental is broken here.',
	timeless_wastes: 'The sky flickers between noon and dusk. Your shadow moves before you do. The landscape repeats — or did you walk this path already? Time is wounded here.',
	hollow_sea: 'The water stretches beyond sight, impossibly clear. Far below, drowned spires shimmer like a mirage. Where Dro-Mahk was torn, matter itself grew thin.',
	grey_wastes: 'The trees stand like bones, grey and leafless. The ground is ashen and silent. Somewhere beneath your feet, a dead Ley Line lies like a severed nerve — and the land has never stopped grieving.',
	korthaven: 'Golden wheat fields stretch between walled farmsteads and merchant caravans. The spires of Korthaven rise in the distance — the Free Cities\' greatest market, where coin speaks louder than prayer.',
	eldergrove: 'The trees here are immense — silver-barked giants whose canopy swallows the sky. Shafts of green-gold light pierce the perpetual twilight. Somewhere above, elven bridges span the branches like spider silk, and the forest hums with a music older than prayer.',
	stormcradle: 'Lightning splits the sky every few heartbeats. The highlands are scoured bare — only scrub grass and blackened stone survive. Between the thunder, you hear something deeper: a hum from beneath the rock, as if the earth itself remembers the blow that cracked the sky.',
	luminara_ruins: 'Golden spires rise from the dust, half-collapsed and half-frozen in amber light. The air smells of old parchment and ash. In places the ruins shimmer — time pooling like water in the broken streets, preserving moments of beauty a heartbeat before their destruction.',
	duskhollow: 'The trees are wrong. Half-visible, their trunks flickering between solid wood and translucent grey. Mist clings to everything. Buildings appear and vanish at the corner of your eye — there, then not, then there again. The air tastes of two worlds, and neither one is entirely real.',
	irongate: 'Iron and stone rise from the scorched earth — massive walls half-buried under landslide rubble. The air smells of rust and old forge smoke. Somewhere beneath the mountain, gears still turn. The ruins of the Iron Republics\' last free city, buried but not forgotten.',
	arcane_conservatory: 'Towers of pale stone rise from manicured grounds, connected by covered walkways and floating bridges. The air hums with residual enchantment. Students in blue robes cross courtyards where fountain water flows upward. Somewhere a bell tolls — not with sound, but with a pulse of warm light that passes through walls.',
	gallowmere: 'Rotting farmland stretches between ruined villages. Two throne rooms still stand — one north, one south — both empty, both preserved by locals who cannot say why. The province never recovered from its civil war. Ten years of brother against brother left the land scarred and the people quiet. Weeds grow through cobblestones where market squares once thrived.',
};

export const REGION_COLORS: Record<string, string> = {
	greenweald: '#4a4',
	ashlands: '#f64',
	hearthlands: '#da4',
	frostpeak: '#8df',
	drowned_mire: '#6a6',
	sunstone_expanse: '#fa4',
	thornlands: '#a86',
	pale_coast: '#8bd',
	glassfields: '#c8f',
	verdant_deep: '#2a6',
	mirrow_wastes: '#a64',
	silence_peaks: '#bbc',
	timeless_wastes: '#da8',
	hollow_sea: '#48a',
	grey_wastes: '#898',
	korthaven: '#da6',
	eldergrove: '#6d8',
	stormcradle: '#99f',
	luminara_ruins: '#ec8',
	duskhollow: '#97a',
	irongate: '#a86',
	arcane_conservatory: '#a8f',
	gallowmere: '#a97',
	underdepths: '#a4f',
};

/** Terrain movement cost: 1 = normal, 2 = slow (costs extra turn), 0.5 = fast (road bonus). */
const TERRAIN_MOVE_COST: Partial<Record<string, number>> = {
	forest: 2,
	swamp: 2,
	snow: 2,
	mud: 2,
	ice: 2,
};

// ── Regional NPCs ──

export interface RegionalNPCDef {
	char: string;
	color: string;
	name: string;
	dialogue: string[];
	gives?: { hp?: number; atk?: number };
	mood: NPC['mood'];
	race?: NPC['race'];
	gender?: NPC['gender'];
	raceAttitude?: NPC['raceAttitude'];
}

export const REGIONAL_NPCS: Record<string, RegionalNPCDef[]> = {
	greenweald: [
		{ char: 'E', color: '#8f8', name: 'Elven Ranger', dialogue: ['The forest watches over those who respect it.', 'I patrol these woods daily. The corruption spreads from the east.', 'May the canopy shelter you.'], mood: 'friendly' },
		{ char: 'D', color: '#4a4', name: 'Druid', dialogue: ['The Elder Oak speaks of dark times ahead.', 'Nature provides, if you know where to look.', 'Have you visited the Fey Circle? The stones hum with power.'], gives: { hp: 3 }, mood: 'friendly' },
		{ char: 'H', color: '#6a4', name: 'Forest Hermit', dialogue: ['I\'ve lived among these trees for forty years. They remember things we\'ve forgotten.', 'The Prismatic Ruins glow at midnight. Crystalborn magic still lives there.', 'Old Magic doesn\'t need a god\'s permission. Remember that.'], mood: 'neutral' },
	],
	ashlands: [
		{ char: 'O', color: '#f84', name: 'Orc Blacksmith', dialogue: ['You want weapon? I forge best steel in Ashlands.', 'The goblin clans grow restless. War comes.', 'Respect the fire, outsider, and it will not burn you.'], gives: { atk: 1 }, mood: 'neutral' },
		{ char: 'G', color: '#a64', name: 'Goblin Trader', dialogue: ['Cheap goods! Good goods! Only slightly stolen!', 'The Charred Fortress has treasures... and death.', 'Boss not happy lately. Bad sign for everyone.'], mood: 'friendly' },
		{ char: 'W', color: '#f44', name: 'War Shaman', dialogue: ['Ira-Sethi burned here long ago. The land still remembers.', 'The Ashblooms grow only where divine fire once touched the earth.', 'The god of war came after — a mortal thing wearing a throne it did not earn. The Ashlands knew fire before he ever claimed it.'], mood: 'neutral' },
	],
	hearthlands: [
		{ char: 'M', color: '#da4', name: 'Merchant', dialogue: ['Trade is the lifeblood of the Hearthlands.', 'The roads have become dangerous — bandits everywhere.', 'I hear the King\'s Stones hold ancient magic.'], mood: 'friendly' },
		{ char: 'G', color: '#8a4', name: 'Guard Captain', dialogue: ['Keep your weapons sheathed within town walls.', 'We\'ve had reports of strange creatures on the roads.', 'The Old Watchtower was abandoned years ago. Haunted, they say.'], gives: { hp: 2 }, mood: 'neutral' },
		{ char: 'B', color: '#fa8', name: 'Wandering Bard', dialogue: ['Seven thrones sit in shadow deep, where stolen gods their vigil keep...', 'It\'s just a song, friend. Nobody takes it seriously. Well, almost nobody.', 'I collect stories from every region. The ones that match across borders — those are the true ones.'], mood: 'friendly' },
		{ char: 'F', color: '#a84', name: 'Farmer Edric', dialogue: ['Something is wrong with my land... the crops, the well... please, can you help?'], mood: 'afraid', race: 'human', gender: 'male', raceAttitude: { elf: -2, dwarf: 0, human: 3 } },
	],
	frostpeak: [
		{ char: 'D', color: '#8df', name: 'Dwarven Smith', dialogue: ['These mountains hold iron that sings when struck.', 'The frozen halls above... even we dare not enter.', 'Take this — you\'ll need warmth where you\'re going.'], gives: { hp: 3 }, mood: 'friendly' },
		{ char: 'R', color: '#aaf', name: 'Runekeeper', dialogue: ['The runes speak truths that words cannot.', 'Frostpeak was old when the world was young.', 'The ice holds secrets of the First Age.'], mood: 'neutral' },
		{ char: 'I', color: '#4af', name: 'Ice Fisher', dialogue: ['The lakes beneath the glaciers hold fish that glow.', 'I once pulled up an artifact from the deep ice. Sold it. Wish I hadn\'t.', 'The dwarves say there\'s a frozen throne beneath the Glacial Stones. I believe them.'], gives: { hp: 2 }, mood: 'friendly' },
	],
	drowned_mire: [
		{ char: 'W', color: '#6a6', name: 'Swamp Witch', dialogue: ['The mire gives and takes in equal measure.', 'Drink this. It tastes foul but wards off the plague.', 'The bog spirits are restless tonight...'], gives: { hp: 4 }, mood: 'friendly' },
		{ char: 'H', color: '#886', name: 'Herbalist', dialogue: ['These mushrooms cure most poisons. Most.', 'Don\'t stray from the stilts after dark.', 'The Sunken Altar holds power over the drowned dead.'], mood: 'neutral' },
		{ char: 'B', color: '#464', name: 'Bog Walker', dialogue: ['I walk the deep paths where others won\'t go.', 'The spirits here aren\'t evil — they\'re confused. They died before the Ascension and don\'t recognize the new gods.', 'Whispertongue is the language of the dead. Learn it, and they\'ll talk to you.'], mood: 'neutral' },
	],
	sunstone_expanse: [
		{ char: 'N', color: '#fa4', name: 'Nomad Guide', dialogue: ['The desert tests all who cross it.', 'Follow the stars — they never lie, unlike the sands.', 'The buried temples hold treasures of forgotten kings.'], mood: 'friendly' },
		{ char: 'S', color: '#ff8', name: 'Stargazer', dialogue: ['The constellations shifted last night. A bad omen.', 'Sandscript cannot be learned from books alone.', 'The oasis shrines were built by the Sand Mages long ago.'], gives: { hp: 2 }, mood: 'neutral' },
	],
	thornlands: [
		{ char: 'E', color: '#a86', name: 'Iron Remnant Engineer', dialogue: ['The Republic fell, but its principles endure.', 'These machines once powered an entire civilization. Now they rust.', 'Magic is a crutch. Gears and steel — that\'s real power.'], gives: { atk: 1 }, mood: 'neutral' },
		{ char: 'S', color: '#da8', name: 'Thorn Ranger', dialogue: ['The undergrowth here is alive — and not friendly.', 'The old Iron roads are still the safest path through these highlands.', 'I\'ve seen foundry smoke rising from ruins that should be dead. Unsettling.'], gives: { hp: 2 }, mood: 'friendly' },
	],
	pale_coast: [
		{ char: 'H', color: '#8bd', name: 'Harbor Master', dialogue: ['Welcome to the coast, traveler. Mind the tides — they\'re unnatural here.', 'Ships vanish in the Hollow Sea. Whole crews gone without a trace.', 'The sea gives back things it shouldn\'t have. Artifacts from before the Ascension wash ashore.'], gives: { hp: 3 }, mood: 'friendly' },
		{ char: 'F', color: '#68a', name: 'Old Fisherman', dialogue: ['Been fishing these waters fifty years. They\'ve changed.', 'Sometimes the water goes clear — perfectly clear — down to the bottom. Miles of nothing. That\'s the Hollow Sea.', 'Dro-Mahk died here, they say. The Principle of Matter itself. That\'s why things feel... thin.'], mood: 'neutral' },
		{ char: 'D', color: '#4af', name: 'Diver', dialogue: ['I dive for salvage in the shallows. The deeper wrecks are too dangerous.', 'Found a crystal last week that hummed when I held it. Crystalborn make, I reckon.', 'There\'s a sunken city out past the reef. On clear days you can see the spires beneath the waves.'], gives: { atk: 1 }, mood: 'friendly' },
	],
	glassfields: [
		{ char: 'L', color: '#c8f', name: 'Luminari Remnant', dialogue: ['We are echoes of a people who tried to outrun time itself.', 'The Crystal Citadel was our greatest work — and our undoing.', 'Prismatic is not merely language. It is light shaped into meaning.'], mood: 'neutral' },
		{ char: 'C', color: '#f8f', name: 'Chrono-Warden', dialogue: ['Time flows strangely here. You may have already spoken to me tomorrow.', 'The Temporal Rifts are scars from the Luminari\'s last experiment.', 'Do not touch the fractured prisms. They replay moments that should stay buried.'], gives: { hp: 4 }, mood: 'friendly' },
		{ char: 'S', color: '#adf', name: 'Shard Collector', dialogue: ['Each crystal fragment holds a frozen memory. Most are mundane — but some...', 'I found one that showed the Ascension itself. Seven mortals, climbing a stair of light. The horror on the faces of those they displaced.', 'The Luminari saw the truth before anyone. That\'s why the gods shattered them.'], gives: { atk: 1 }, mood: 'neutral' },
	],
	verdant_deep: [
		{ char: 'D', color: '#2a6', name: 'Elder Druid', dialogue: ['The Old Magic needs no gods. It was here before them and will outlast them.', 'The Heartwood remembers every footstep taken beneath its canopy — for ten thousand years.', 'The Verdant Reach shelters those who still practice the First Ways.'], gives: { hp: 4 }, mood: 'friendly' },
		{ char: 'P', color: '#6a4', name: 'Grey Pilgrim', dialogue: ['We walk the paths the gods forbade. Someone must.', 'Primordialists are not heretics. We simply remember what came before the theft.', 'The Ley Lines converge here. Can you feel it? The earth itself hums with power.'], mood: 'neutral' },
		{ char: 'R', color: '#4a2', name: 'Jungle Tracker', dialogue: ['Watch where you step. The Voidblooms drink more than sunlight.', 'Crystalline Stags still roam the deep paths. They\'re almost extinct now — hunted for their antlers.', 'The River Thal sings at dawn. Not a metaphor. Actual singing.'], gives: { hp: 2 }, mood: 'friendly' },
	],
	mirrow_wastes: [
		{ char: 'W', color: '#a64', name: 'Mirrow Widow', dialogue: ['One strand light, one strand dark. That\'s what we weave. That\'s what we remember.', 'The Mirrow wives still sing, if you know where to listen. The Church banned us, but grief outlasts doctrine.', 'Ash-Velk the liar, who wore truth like a borrowed coat... That\'s from the oldest verse. Page fourteen.'], mood: 'neutral' },
		{ char: 'G', color: '#88a', name: 'Ghost Whisperer', dialogue: ['The soldiers still fight here. They don\'t know the war was a lie.', 'Vestraad and Korinn were allies for three centuries. Then one man\'s forgeries turned them to slaughter.', 'The griefmoths gather thickest at Mirrow Ford. Four hundred thousand dead will do that.'], gives: { hp: 3 }, mood: 'friendly' },
		{ char: 'A', color: '#864', name: 'Ashen Circle Scholar', dialogue: ['We keep the forbidden records. The forgery workshop. The proof that the God of Truth built his throne on lies.', 'Theron Ash-Velk manufactured the entire Brother War. Fake documents, planted evidence, disguised mercenaries.', 'The complete Mirrow Widows\' song is in our library. Every verse — including the ones that name the god.'], gives: { atk: 1 }, mood: 'neutral' },
	],
	silence_peaks: [
		{ char: 'M', color: '#bbc', name: 'Blind Monk', dialogue: ['We burned our eyes to see what matters. The knotted strings hold a melody older than the gods.', 'The Undertone grows fainter each year. Seven voices singing themselves into the world\'s foundation — the Original Seven.', 'Knotweave is not language. It is vibration given form. You read it with your fingertips.'], gives: { hp: 3 }, mood: 'friendly' },
		{ char: 'A', color: '#99a', name: 'Abbot of Closed Eyes', dialogue: ['Pho-Lumen screamed here. The Principle of Spirit, wounded unto death. And sound itself shattered.', 'We have spent a thousand years transcribing what remains. A seven-voiced dirge beneath the silence.', 'The Ascended filter it. Degrade it. But they cannot silence what was woven into the world itself.'], mood: 'neutral' },
		{ char: 'P', color: '#aab', name: 'Pilgrim of Stillness', dialogue: ['I came to hear the silence. Instead I heard what hides beneath it.', 'In the deepest caves, if you press your ear to the stone, you can feel them — the Original Seven, still singing.', 'The monks say the melody is a map. Seven streams of magic converging on a point no one has found.'], gives: { hp: 2 }, mood: 'friendly' },
	],
	hollow_sea: [
		{ char: 'S', color: '#48a', name: 'Salvage Captain', dialogue: ['I\'ve pulled Dominion artifacts from the shallows for twenty years. The deep wrecks? Nobody comes back from those.', 'On calm days the water goes glass-clear. You can see the spires of Pelagathis a mile below. They still glow.', 'The Sunken Dominion didn\'t sink. It was swallowed. When Dro-Mahk was wounded here, matter stopped being reliable.'], gives: { hp: 3 }, mood: 'friendly' },
		{ char: 'L', color: '#4af', name: 'Leviathan Whisperer', dialogue: ['The great ones still remember the Dominion. They carry its memories in their songs — frequencies we can barely perceive.', 'Dominion Aquatic is not spoken. It is felt — pressure changes, current shifts, the language of deep water.', 'One of the leviathans showed me Pelagathis as it was. Crystal domes, coral highways, light that came from everywhere. Then the Principle of Matter died and it all became... thin.'], mood: 'neutral' },
		{ char: 'C', color: '#68d', name: 'Coral Archaeologist', dialogue: ['These coral formations aren\'t natural. They\'re Dominion architecture — buildings that grew rather than were built.', 'I found a crystal that plays back the last moments before the sinking. Screaming. Then silence. Then the sound of water rushing in from everywhere.', 'The Restoration wants what the Dominion knew. Magic without gods. Civilization built on principles, not prayer.'], gives: { atk: 1 }, mood: 'friendly' },
	],
	timeless_wastes: [
		{ char: 'T', color: '#da8', name: 'Temporal Scholar', dialogue: ['I have lived this conversation before. Or I will. The tenses collapse here.', 'Tho-Rienne was wounded — the Principle of Time itself. The wound never healed. It never will. It never has.', 'Orinthas — the god who calls himself lord of Time — once erased an entire day from the calendar. But Time remembers what gods forget.'], mood: 'neutral' },
		{ char: 'L', color: '#fa8', name: 'Loop-Trapped Wanderer', dialogue: ['I have been walking this path for... I don\'t know. Years? Centuries? The sun rises and sets in the wrong order.', 'There is a day that doesn\'t exist. Once a year I slip into it — burning libraries, screaming, shadows of a golden age dying.', 'If you find the Moment Tombs, don\'t touch the frozen people. They\'re not dead. They\'re caught between seconds.'], gives: { hp: 4 }, mood: 'friendly' },
		{ char: 'C', color: '#ca8', name: 'Chronoscript Cartographer', dialogue: ['Chronoscript reads backwards and forwards simultaneously. The meaning changes depending on which direction you read.', 'I\'m mapping the temporal anomalies. Some zones loop. Some skip. Some run backwards. None are stable.', 'The Fractured Hours stones predate everything. They\'re markers for where time broke — and where it might break again.'], gives: { atk: 1 }, mood: 'neutral' },
	],
	grey_wastes: [
		{ char: 'E', color: '#898', name: 'Elder Thorn', dialogue: ['We\'ve sung to the Ley Line for three centuries. It doesn\'t sing back anymore. But the stones still listen.', 'Seven monoliths stand at Grief\'s Circle — one for each of the Original gods. The Ascended want them torn down. We refuse.', 'Old Primal is the language of the land itself. You don\'t learn it. You remember it.'], gives: { hp: 4 }, mood: 'friendly' },
		{ char: 'V', color: '#686', name: 'Scar-Walker', dialogue: ['The grey gets in your bones. Changes you. Some call it corruption. I call it the land\'s grief made physical.', 'I found a journal in the Veiled Hand outpost. Someone ordered the Ley Line killed. Deliberately. The signature was burned away.', 'The scavengers strip what they can. The Pilgrims heal what they can. Nobody asks who killed it in the first place.'], gives: { atk: 1 }, mood: 'neutral' },
		{ char: 'C', color: '#7a7', name: 'Cairn-Keeper Moss', dialogue: ['The Pilgrims heal. The scavengers take. The Veiled Hand watches. And beneath it all, the dead Ley Line dreams of what it was.', 'Can you hear it? That hum beneath the silence? The Ley Line is trying to remember itself. After all these centuries.', 'The Petrified Grove was alive once. Oldest forest in the world. Now it\'s stone and memory and grief.'], gives: { hp: 2 }, mood: 'friendly' },
	],
	eldergrove: [
		{ char: 'E', color: '#8fc', name: 'Warden Ithilra', dialogue: ['You walk beneath the Eldest Trees. Step softly — the roots remember every footfall.', 'The Eldergrove sheltered our people when the Ascended burned our libraries. We will not forget.', 'Sylvan is the tongue the trees speak. Learn it, and the forest opens paths no outsider can find.'], gives: { hp: 3 }, mood: 'neutral' },
		{ char: 'A', color: '#6ea', name: 'Archivist Faelorn', dialogue: ['The Moonlit Archives hold texts the Veiled Hand believes they destroyed. We let them believe it.', 'Before the Ascension, the elves practiced magic without prayer. We still do — quietly.', 'Selvara claims she grew the World Oak. The trees laugh at that. They remember who truly planted the first seeds.'], mood: 'friendly' },
		{ char: 'R', color: '#4a6', name: 'Ranger Thandril', dialogue: ['Bandits on the south road again. The Briarwood Gang — they prey on pilgrims heading for the temples.', 'Crystalline Stags still roam the deep paths. If you see one, do not follow. They lead the unworthy to their deaths.', 'Something prowls the Thornveil at night. Larger than a bear. The tracks vanish at the treeline, as if it climbs.'], gives: { atk: 1 }, mood: 'friendly' },
	],
	korthaven: [
		{ char: 'A', color: '#da6', name: 'Aldric Fenn', dialogue: ['Have you seen anything unusual? Anything that glows? Anything that\'s warm when it shouldn\'t be?', 'Eight centuries of collecting curiosities. You\'d be amazed what washes up in markets — artifacts from before the Ascension, still humming with power.', 'The Merchants\' Guild thinks I\'m eccentric. They\'re not wrong. But I remember when this city was a crossroads camp and the gods wore different faces.'], gives: { hp: 3 }, mood: 'friendly' },
		{ char: 'G', color: '#fa8', name: 'Guild Factor', dialogue: ['Korthaven moves more coin in a day than most kingdoms see in a year. The Free Cities built that.', 'Mercatus blesses the harvest and the ledger alike. Though between you and me, gold prays louder than grain.', 'We don\'t ask where goods come from. We ask what they\'re worth. That\'s Trade Common for you.'], gives: { atk: 1 }, mood: 'neutral' },
		{ char: 'H', color: '#ca8', name: 'Caravan Master Halda', dialogue: ['Twelve years I\'ve carried this coin. Won\'t leave my pocket. Won\'t spend. Won\'t melt. My uninvited guest.', 'The roads between cities are the real kingdom. Whoever controls the caravans controls everything.', 'I\'ve seen impossible things on the trade roads. Merchants learn to accept the impossible and price it accordingly.'], gives: { hp: 2 }, mood: 'friendly' },
	],
	stormcradle: [
		{ char: 'W', color: '#aaf', name: 'Storm Warden Kael', dialogue: ['The lightning is not random. It follows the veins beneath the rock — something down there conducts it, something old. The scholars in Korthaven go quiet when I describe it.', 'We harvest fulgurite from the strike points. Each piece remembers the shape of the bolt that made it. Some of them hum.', 'The sky broke here during the Primordial War. It never healed. That is why the storms never stop.'], gives: { hp: 2 }, mood: 'neutral' },
		{ char: 'L', color: '#ccf', name: 'Lightning Harvester Yenn', dialogue: ['Storm Cant is not spoken — it is shouted between thunderclaps. You learn to say everything that matters in three syllables.', 'The Fulgurite Spire was not built. A single bolt struck the hilltop and fused the sand into a tower. Perfectly symmetrical. Perfectly hollow.', 'I sell lightning-glass to the merchants in Korthaven. They call it jewelry. I call it frozen screaming.'], gives: { atk: 1 }, mood: 'friendly' },
		{ char: 'D', color: '#88c', name: 'Tunnel Delver Mossrig', dialogue: ['The tunnels beneath the Stormcradle are older than anything on the surface. The walls pulse with a rhythm — not a heartbeat, but close.', 'Something carved these tunnels with heat, not tools. The stone is glazed smooth, like the inside of a kiln.', 'I found markings down there that match nothing in any language above ground. The scholars in Korthaven offered me gold. I kept the rubbings.'], gives: { hp: 3 }, mood: 'friendly' },
	],
	luminara_ruins: [
		{ char: 'S', color: '#ec8', name: 'Arcanist Veyla', dialogue: ['Five hundred thousand scrolls. The greatest library the world has ever known. Burned because a fool could not bear to be corrected.', 'We Arcanists trace our lineage to the scholars who survived. We preserved what fragments we could. It was not enough.', 'Many of my order pray to Lexis for the wisdom we lost. I find I cannot bring myself to pray. I don\'t know why.'], gives: { hp: 2 }, mood: 'neutral' },
		{ char: 'T', color: '#da6', name: 'Temporal Guide Essra', dialogue: ['The time pockets are beautiful and terrible. You step through and for a moment you are in the golden age — the gardens, the music, the light. Then it tears you back.', 'Do not linger in the frozen moments. Some scholars have been trapped for hours that felt like years. They came back... different.', 'The Frozen Fountain still runs, if you can call it running. The water hangs in the air, mid-splash, and has for two thousand years.'], gives: { hp: 3 }, mood: 'friendly' },
		{ char: 'M', color: '#ca8', name: 'Ruin-Keeper Daven', dialogue: ['I guard the Inscription Wall. Most visitors read it and walk away confused. A few read it and go very, very quiet.', 'The last king destroyed things that took centuries to build. Not in war. Not by accident. By decree. Read the wall and judge for yourself.', 'Someone tried to chisel the Inscription off the wall last month. Hired hands — professional. I did not ask who sent them.'], gives: { atk: 1 }, mood: 'neutral' },
	],
	duskhollow: [
		{ char: 'E', color: '#a8b', name: 'Elder Miravel', dialogue: ['We could see both worlds once. The living and the dead, walking the same streets. Now the veil thickens year by year, and we lose a little more of ourselves each time.', 'My grandmother spoke to ancestors as easily as I speak to you. My children cannot see them at all. Something is being taken from us — slowly, deliberately.', 'The Dusk Markets traded goods between worlds. Spirit-silk, dreamglass, bottled memory. Now the stalls stand empty, flickering.'], gives: { hp: 3 }, mood: 'neutral' },
		{ char: 'W', color: '#8ac', name: 'Spirit-Walker Thessyn', dialogue: ['I can still cross, but barely. The passage grows narrower each year. Like squeezing through a closing door.', 'The ghosts on the other side remember things. Old things. They try to tell me, but the veil muffles their voices. I catch fragments — names, warnings, apologies.', 'Do not trust the exorcists who come in official robes. The ones they banish are always the oldest — the ones who remember before. I do not know why. I only know they do not leave by choice.'], gives: { atk: 1 }, mood: 'friendly' },
		{ char: 'V', color: '#667', name: 'Watcher Coravel', dialogue: ['I am here to ensure the boundary remains stable. Nothing more.', 'The Division of Silence monitors thin-spots for public safety. The spirit world is dangerous to the untrained.', 'The twilight folk are a dying culture. Unfortunate, but the veil exists for a reason. Some doors should stay closed.'], mood: 'hostile' },
	],
	irongate: [
		{ char: 'R', color: '#a86', name: 'Remnant Engineer Tova', dialogue: ['The Great Forge still works. Eight hundred years buried under a mountain and the gears still turn. Iron Republic engineering — no magic, just precision.', 'The Republics proved you don\'t need gods to build a civilization. Elected senate, term limits, public debate. We had it all. Then one coward destroyed it in a single night.', 'The broken chain is our symbol. We were free once. We will be again.'], gives: { atk: 1 }, mood: 'neutral' },
		{ char: 'C', color: '#ca8', name: 'Artificer Brennik', dialogue: ['The rune system predates the Ascended. The most basic inscriptions correspond to older patterns — older than any god currently sitting on a throne. The Clockwork Creed has known this for centuries.', 'The device was destroyed before it was ever tested. They say it was sabotage — internal. But the Creed\'s records, what survive, suggest the sabotage came from outside. Someone did not want that device to exist.', 'Iron Republic engineering manuals are worth more than gold. Each one is a proof that mortals can build without prayer.'], gives: { hp: 2 }, mood: 'friendly' },
		{ char: 'S', color: '#886', name: 'Soldier Harsk', dialogue: ['I hear him sometimes. In the deep tunnels, where the collapsed gate still stands. A voice reciting names. Eight thousand names.', 'The soldiers who died here followed a general they trusted. He fled through a hidden tunnel while they fought and died. No monument. No accounting. Just the machine, still running, as if it didn\'t notice.', 'Someone buried this entire city under a mountain. That takes power beyond any mortal means. Ask yourself: who had that kind of power, and what were they trying to hide?'], gives: { hp: 3 }, mood: 'neutral' },
	],
	arcane_conservatory: [
		{ char: 'I', color: '#f84', name: 'Professor Ignis Valdren', dialogue: ['The first lesson of elemental magic is this: fire does not obey you. You negotiate with it. My hands are proof of what happens when negotiations fail.', 'Lightning is energy seeking ground. Ice is heat being stolen. Fire is matter remembering what it was before the world cooled. Understand the principle and the spell follows.', 'The Conservatory teaches three streams of elemental magic. The fourth — void manipulation — is forbidden. Officially because it is dangerous. Unofficially... I have my suspicions about who decided that.'], gives: { atk: 1 }, mood: 'neutral' },
		{ char: 'S', color: '#a8f', name: 'Professor Seraphina Ashveil', dialogue: ['Enchantment is not flashy. There are no explosions, no dramatic gestures. You weave a ward correctly and nothing happens. That is the point — nothing happens to you.', 'The Conservatory wards are layered fourteen deep. I maintain them personally. The outermost was set by the first Archmage. The innermost... the innermost I did not set. It was already here when the school was built.', 'I have noticed certain topics missing from our curriculum. Certain books removed from shelves. I say nothing. Paranoia is unbecoming of a professor. But I notice.'], gives: { hp: 2 }, mood: 'neutral' },
		{ char: 'B', color: '#8a4', name: 'Professor Bramwell Thornwick', dialogue: ['Welcome to the greenhouse! Mind the Screaming Mandrakes — they are teething. And the Venomous Ivy. And the... actually, touch nothing. Just stand there and absorb knowledge through proximity.', 'Alchemy is the most practical school. Ignis can throw fire, yes, very impressive. But can fire cure snakebite? Can lightning mend a broken bone? My potions can.', 'The rarest ingredient I have ever worked with was Phoenix Ash. Genuine Phoenix Ash. I brewed a single draught from it and the patient recovered from wounds that should have been fatal. I have been trying to source more ever since.'], gives: { hp: 3 }, mood: 'friendly' },
		{ char: 'M', color: '#ff8', name: 'Professor Mirael Dawnwhisper', dialogue: ['You have questions. I know what they are. I will not answer them yet — not because I am being mysterious, but because you are not ready to hear the answers without going quite mad.', 'Divination is not seeing the future. The future does not exist yet. Divination is seeing the patterns that make certain futures more likely than others. The distinction matters.', 'I looked through the Astral Observatory last night and saw something I have not seen in thirty years of scrying. Seven shadows where there should be none, seated on thrones that do not belong to them. I wrote it in my journal and the ink vanished.'], mood: 'neutral' },
		{ char: 'A', color: '#ec8', name: 'Archmage Aldric Voss', dialogue: ['The Conservatory has stood for four centuries. In that time we have produced some of the finest minds in the known world. Our curriculum is carefully designed — every subject balanced against every other.', 'Cross-stream mastery is a romantic idea but impractical. No mind can hold more than two or three magical disciplines without risking catastrophic instability. This is settled science.', 'I trust you are finding your studies satisfying? Good, good. Remember: the Conservatory exists to serve the greater good. And the greater good is best served by following the established curriculum.'], gives: { hp: 2 }, mood: 'friendly' },
	],
	gallowmere: [
		{ char: 'P', color: '#a97', name: 'Pol\'s Granddaughter Maren', dialogue: ['My family has lived in this cottage for five generations. Grandmother said never to dig under the hearthstone. I don\'t know why. I don\'t ask.', 'The twins\' war ended the same day it should have never started. Both kings dead by their own hand. Everyone says it was grief. Nobody says what caused the grief.', 'A rider came. Nobody knew him. He delivered letters to both throne rooms on the same morning. By evening, both kings were dead. The rider was never seen again.'], gives: { hp: 2 }, mood: 'neutral' },
		{ char: 'H', color: '#ca8', name: 'Chronicler Haleth', dialogue: ['The accounts contradict each other in almost every detail. Edric\'s men say Oswin provoked every escalation. Oswin\'s men say the same of Edric. But three witnesses — independently, decades apart — mentioned a rider neither court recognized. That detail I cannot explain away.', 'The evidence that started the war — the poisoned wife, the planted vial, the forged letters — none of it survives. Every original document has vanished. Copies of copies is all we have. That pattern does not happen by accident.', 'There were excavations under the capital during the war. Official records call them sewer maintenance. Ten years of sewer maintenance. During a siege. I have written it in my notes and I still don\'t know what to make of it.'], gives: { atk: 1 }, mood: 'friendly' },
		{ char: 'W', color: '#886', name: 'Old Soldier Corben', dialogue: ['I fought for Edric. My brother fought for Oswin. We didn\'t speak for ten years. Then both kings died and we had nothing left to fight about. We still don\'t speak. The silence is different now.', 'The farmers\' army against the professional army. We had numbers. They had training. It was perfectly matched — as if someone had designed it to last as long as possible.', 'After the war, strangers came through and bought land for nothing. Built estates where villages used to be. They didn\'t farm the land. They just... owned it. Watched it. Some of those estates are still occupied.'], gives: { hp: 3 }, mood: 'neutral' },
	],
	underdepths: [
		{ char: '?', color: '#a4f', name: 'Deep Scholar', dialogue: ['The Void Monolith predates all civilizations above.', 'Deepscript is not merely language — it reshapes thought.', 'Light is a crutch. True sight comes in darkness.'], mood: 'neutral' },
		{ char: 'F', color: '#4af', name: 'Fungal Farmer', dialogue: ['These glowing caps are safe to eat. Probably.', 'The mushroom forests stretch for miles in every direction.', 'Something stirs in the deep. Even the fungi tremble.'], gives: { hp: 3 }, mood: 'friendly' },
	],
};

// ── Overworld Random Encounters ──

/** Region-specific encounter monster names (matched from MONSTER_DEFS or custom). */
const REGION_ENCOUNTERS: Record<string, { combat: string[]; nonCombat: string[] }> = {
	greenweald:       { combat: ['Wolf', 'Spider', 'Bat'], nonCombat: ['A wandering herbalist offers you a healing potion.', 'A lost elven traveler thanks you for directions.'] },
	hearthlands:      { combat: ['Goblin', 'Rat', 'Wolf'], nonCombat: ['A merchant caravan passes by and offers to trade.', 'A farmer shares bread and cheese with you.'] },
	ashlands:         { combat: ['Goblin', 'Ogre', 'Slime'], nonCombat: ['An orc scout watches you from a distance, then nods.', 'You find a discarded war banner — the forge clans passed here.'] },
	frostpeak:        { combat: ['Wolf', 'Skeleton', 'Troll'], nonCombat: ['A dwarven prospector shares warmth by a campfire.', 'You discover a frozen shrine and warm your hands.'] },
	drowned_mire:     { combat: ['Slime', 'Spider', 'Zombie'], nonCombat: ['A swamp witch offers a bitter tonic that restores health.', 'You find dry ground and an abandoned camp with supplies.'] },
	sunstone_expanse: { combat: ['Skeleton', 'Rat', 'Ogre'], nonCombat: ['A nomadic stargazer reads your fortune.', 'A desert trader sells you water from an oasis.'] },
	thornlands:       { combat: ['Wolf', 'Goblin', 'Spider'], nonCombat: ['An Iron Remnant tinker offers to repair your gear.', 'You find a rusted automaton half-buried in thorns — its gears still turn slowly.'] },
	pale_coast:       { combat: ['Slime', 'Rat', 'Skeleton'], nonCombat: ['A fisherman shares his catch with you. "The sea provides," he says.', 'You find a washed-up chest half-buried in sand. Inside: a crystal that hums faintly.'] },
	glassfields:      { combat: ['Wraith', 'Skeleton', 'Troll'], nonCombat: ['A fractured prism replays a moment of kindness from centuries ago. You feel restored.', 'A Luminari echo offers cryptic guidance before dissolving into light.'] },
	verdant_deep:     { combat: ['Spider', 'Troll', 'Slime'], nonCombat: ['A druid offers a poultice brewed from jungle herbs. Your wounds close.', 'A Crystalline Stag watches you from the undergrowth, then vanishes in a flash of prismatic light.'] },
	mirrow_wastes:    { combat: ['Wraith', 'Zombie', 'Skeleton'], nonCombat: ['Griefmoths swirl around you, absorbing your weariness. You feel lighter.', 'The wind carries a melody — two melodies, nearly identical, almost harmonizing. The Mirrow wives\' song.'] },
	silence_peaks:    { combat: ['Wolf', 'Wraith', 'Skeleton'], nonCombat: ['A blind monk presses a knotted string into your hand. You feel vibrations travel through your fingers.', 'You press your ear to the stone and feel a deep, subsonic pulse — the Undertone, still singing.'] },
	timeless_wastes:  { combat: ['Wraith', 'Skeleton', 'Troll'], nonCombat: ['A traveler walks past you — then walks past you again, wearing different clothes. She doesn\'t notice.', 'You find a campfire still warm with yesterday\'s embers. Your journal says you lit it tomorrow.'] },
	hollow_sea:       { combat: ['Slime', 'Wraith', 'Troll'], nonCombat: ['The water goes crystal-clear. Far below, you see drowned spires glowing faintly — then the clarity passes, and there is only dark sea.', 'A coral artifact washes ashore at your feet, still warm. It hums a melody in a language you almost understand.'] },
	grey_wastes:      { combat: ['Wraith', 'Zombie', 'Spider'], nonCombat: ['A Grey Pilgrim kneels beside a dead tree, whispering in Old Primal. For a moment, a single grey leaf unfurls — then crumbles.', 'The ground hums beneath your feet. A faint warmth rises through your boots — the dead Ley Line, dreaming.'] },
	korthaven:        { combat: ['Rat', 'Goblin', 'Wolf'], nonCombat: ['A merchant caravan rumbles past, guards eyeing you warily. The factor tips his hat and tosses you a bread roll.', 'A street performer juggles coins that catch the light strangely — one of them hums. She winks and pockets it before you can look closer.'] },
	eldergrove:       { combat: ['Spider', 'Wolf', 'Troll'], nonCombat: ['A silver-barked tree shifts its branches, revealing a hidden path that was not there a moment ago.', 'An elven scout drops from the canopy, studies you in silence, then vanishes back into the leaves with a curt nod.'] },
	stormcradle:      { combat: ['Wolf', 'Troll', 'Ogre'], nonCombat: ['Lightning strikes a boulder twenty paces ahead. When the afterimage fades, a fulgurite sculpture stands where the rock was — shaped like a hand reaching upward.', 'A storm warden signals you from a ridge, pointing toward a safe path between the strike zones. She vanishes before you can shout thanks.'] },
	luminara_ruins:   { combat: ['Wraith', 'Skeleton', 'Golem'], nonCombat: ['The air shimmers and for a heartbeat you see the street as it was — golden, alive, filled with scholars in white robes. Then ash.', 'A charred scroll fragment tumbles past your feet. The visible text reads: "...and the king decreed that henceforth all books shall..." The rest is burned away.'] },
	duskhollow:       { combat: ['Wraith', 'Spider', 'Wolf'], nonCombat: ['A figure walks beside you for several paces — translucent, grey, mouthing words you cannot hear. It reaches toward you, then the veil thickens and it is gone.', 'A building appears between two trees, solid and warm with candlelight. You blink and it is a ruin, dark and overgrown. You blink again and the candles return, briefly.'] },
	irongate:              { combat: ['Golem', 'Troll', 'Skeleton'], nonCombat: ['A gear the size of a wagon wheel grinds slowly in the wall beside you, driven by some mechanism deep underground. Oil drips from its teeth — fresh oil, recently applied by someone.', 'You find a Republic-era coin half-buried in ash. One side shows a broken chain. The other side has been scratched blank — deliberately, methodically, as if someone wanted a face erased from history.'] },
	arcane_conservatory:   { combat: ['Skeleton', 'Slime', 'Spider'], nonCombat: ['A student rushes past muttering about a failed transmutation exam. Sparks trail from her fingers.', 'An enchanted broom sweeps the path ahead of you, then pauses, seems to regard you, and sweeps off in the opposite direction.'] },
	gallowmere:            { combat: ['Wolf', 'Rat', 'Goblin'], nonCombat: ['A crow lands on a broken fence post and caws twice. An old woman in a nearby field stops working and counts something on her fingers, then resumes as if nothing happened.', 'You pass a crossroads marker listing two villages in opposite directions. Both villages have the same name — scratched out, rewritten, scratched out again.'] },
	underdepths:      { combat: ['Wraith', 'Troll', 'Minotaur'], nonCombat: ['A fungal glow illuminates a small alcove with a healing spring.', 'An echo from the deep whispers ancient knowledge.'] },
};

/** Region-specific atmospheric text when entering a dungeon. */
const DUNGEON_ENTRANCE_FLAVOR: Record<string, string> = {
	greenweald:       'Roots claw through crumbling stone. The air smells of damp earth and old magic.',
	ashlands:         'Heat rises from below. The walls glow faintly orange, and the air tastes of sulfur.',
	hearthlands:      'Cobblestones give way to rough-hewn passages. Rats scatter before your torchlight.',
	frostpeak:        'Ice coats the walls in crystalline sheets. Your breath hangs in frozen clouds.',
	drowned_mire:     'Water seeps through the ceiling in a steady drip. The walls are slick with algae.',
	sunstone_expanse: 'Sand hisses through cracks in the ancient stonework. Hieroglyphs line the walls.',
	thornlands:       'Rusted pipes run along the ceiling. Somewhere deep below, gears still grind.',
	pale_coast:       'Salt crust lines the entrance. The sound of waves echoes from somewhere below.',
	glassfields:      'Crystal shards crunch underfoot. Prismatic light dances across the walls, revealing and concealing passages in turn.',
	verdant_deep:     'Vines slither aside as you descend. Bioluminescent moss bathes the tunnels in sickly green light. Roots pulse like veins.',
	mirrow_wastes:    'Bones crunch beneath your feet. The walls are scratched with tally marks — soldiers counting days they never finished.',
	silence_peaks:    'Your footsteps vanish into nothing. The tunnels swallow sound so completely that your own heartbeat is the loudest thing in the world.',
	timeless_wastes:  'The entrance flickers — there, then not, then there again. Inside, torchlight illuminates dust that falls upward.',
	hollow_sea:       'The tunnel slopes down into brackish water. Bioluminescent coral lines the walls, pulsing in rhythms that feel like breathing.',
	grey_wastes:      'The stone is veined with dull crystal — dead Ley Line fragments. The deeper you go, the more the walls seem to weep grey dust.',
	korthaven:        'Brick gives way to older stone. The smell of sewage fades into something mustier — old vaults, forgotten cellars, the bones of the city beneath the city.',
	eldergrove:       'Roots twist into a staircase descending beneath the forest floor. The walls are living wood, and sap glows faintly amber in the crevices. Something ancient breathes below.',
	stormcradle:      'The tunnel walls are fused glass — lightning-bored through solid rock. Static raises every hair on your body. The deeper you go, the louder the hum.',
	luminara_ruins:   'The stairs descend through layers of history — gilded mosaic gives way to charred stone gives way to something older. Time stutters here. Your torch flame freezes, then leaps forward.',
	duskhollow:       'The tunnel entrance flickers — solid stone one moment, translucent the next. Inside, you can see through the walls to a second tunnel overlaid on the first, like two drawings on the same page.',
	irongate:              'Iron rivets line the passage walls. The air is hot and dry — forge heat, centuries old, still radiating from the stone. Gears click in the darkness ahead. Something mechanical is still running.',
	arcane_conservatory:   'The stairs descend beneath the campus into older stone. Sigils glow along the walls — ward-work, still active after centuries. The air hums with latent enchantment, and somewhere below, something is practicing spells unsupervised.',
	gallowmere:            'The passage descends into old foundation stone — older than the war, older than the twin kingdoms. Someone has been down here recently: fresh torch marks on the walls, swept floors, and a single boot print in the dust heading deeper.',
	underdepths:           'The darkness here is absolute. Even your torch seems to shrink from the void.',
};

/** POI-type-specific reward text for grave sites. */
const GRAVE_LORE: Record<string, string> = {
	greenweald:       'An ancient elven ranger who fell defending the forest from corruption.',
	ashlands:         'An orc warlord whose dying wish was for peace between the clans.',
	hearthlands:      'A merchant prince who hid a fortune beneath the crossroads.',
	frostpeak:        'A dwarven runesmith whose final creation was never completed.',
	drowned_mire:     'A swamp witch who sacrificed herself to seal a plague beneath the waters.',
	sunstone_expanse: 'A nomadic stargazer who mapped the constellations into the desert stones.',
	thornlands:       'An Iron Republic founder who swore that gears would outlast gods.',
	pale_coast:       'A lighthouse keeper who watched the Hollow Sea swallow the old harbor.',
	glassfields:      'A Luminari chronomancer who froze herself mid-spell, hoping the future would know how to finish it.',
	verdant_deep:     'A Grey Pilgrim who walked the forbidden Ley Lines until the jungle itself grew over her, preserving her in roots and silence.',
	mirrow_wastes:    'A soldier who carried letters from both sides — and realized, too late, that the handwriting in the declarations of war was the same.',
	silence_peaks:    'A monk who transcribed the Undertone for sixty years. Her final knot-string reads: "The seventh voice is not singing. It is screaming."',
	timeless_wastes:  'A cartographer who mapped every version of this place. Her final entry: "The map is correct. The land has moved."',
	hollow_sea:       'A Dominion navigator who surfaced once to warn the land-dwellers. Her final log: "The membrane thins. Pelagathis sinks not into water but into nothing."',
	grey_wastes:      'A Grey Pilgrim who sang to the dead Ley Line every dawn for forty years. Her final words: "It answered. Once. Then went silent forever."',
	korthaven:        'A merchant prince who funded expeditions to every corner of the world. His ledger\'s last entry: "The gods trade in souls. We merely trade in coin. I wonder which currency is more honest."',
	eldergrove:       'An elven archivist who hid the last pre-Ascension texts beneath the roots. Her final note: "They burned the library at Ashfall. They will come for these next. The trees will not let them take them."',
	stormcradle:      'A storm warden who mapped the lightning patterns for thirty years. Her final chart note: "The bolts are not striking the ground. They are striking back at the sky."',
	luminara_ruins:   'A Luminari mathematician buried with her equations. Her epitaph: "The king said my proofs were sedition. I said they were truth. The ruins prove which of us was right."',
	duskhollow:       'A twilight midwife who delivered children in both worlds. Her epitaph: "Born in flesh and spirit both. Now neither world will claim her."',
	irongate:              'A Republic centurion buried standing upright, shield on arm. His epitaph is a single word scratched into the iron: "REMEMBER."',
	arcane_conservatory:   'A student who attempted to master all four schools simultaneously. Her tombstone reads: "She reached for everything and grasped the infinite. It did not let go."',
	gallowmere:            'A servant buried without a name. The headstone reads only: "He could not read, but he listened. And he never forgot."',
	underdepths:           'A Deepscript scholar who went mad deciphering the Void Monolith.',
};

// ── Helper Functions ──

/** Get overworld sight radius based on the terrain the player is standing on. */
export function getOverworldSightRadius(tile: OverworldTile, playerRace?: CharacterRace): number {
	const base = TERRAIN_SIGHT_RADIUS[tile.terrain] ?? OVERWORLD_SIGHT_RADIUS;
	// Elf racial passive: +1 sight in forest terrain
	if (playerRace === 'elf' && (tile.terrain === 'forest' || tile.terrain === 'dead_trees')) {
		return base + 1;
	}
	return base;
}

/** Get the movement turn cost for an overworld tile. Roads = 1 but allow double-step. Slow terrain = 2 turns. */
export function getOverworldMoveCost(tile: OverworldTile): number {
	if (tile.road) return 1; // roads: normal cost but will double-step
	return TERRAIN_MOVE_COST[tile.terrain] ?? 1;
}

/** Get compass direction name from dx/dy. */
export function compassDirection(dx: number, dy: number): string {
	if (dx === 0 && dy < 0) return 'North';
	if (dx === 0 && dy > 0) return 'South';
	if (dx > 0 && dy === 0) return 'East';
	if (dx < 0 && dy === 0) return 'West';
	if (dx > 0 && dy < 0) return 'NE';
	if (dx < 0 && dy < 0) return 'NW';
	if (dx > 0 && dy > 0) return 'SE';
	return 'SW';
}

/** Show signpost information: directions and distances to nearest settlements. */
export function showSignpostInfo(state: GameState, worldMap: WorldMap, pos: Position): void {
	addMessage(state, 'A signpost stands at the crossroads:', 'info');
	const nearby = worldMap.settlements
		.map(s => ({ name: s.name, dx: s.pos.x - pos.x, dy: s.pos.y - pos.y, dist: Math.abs(s.pos.x - pos.x) + Math.abs(s.pos.y - pos.y) }))
		.sort((a, b) => a.dist - b.dist)
		.slice(0, 4);
	for (const s of nearby) {
		const dir = compassDirection(s.dx, s.dy);
		addMessage(state, `  ${s.name} — ${dir}, ${s.dist} tiles`, 'info');
	}
}

/** Reveal tiles in a radius around a position on the overworld explored grid. */
export function revealOverworldArea(worldMap: WorldMap, pos: Position, radius: number): void {
	for (let dy = -radius; dy <= radius; dy++) {
		for (let dx = -radius; dx <= radius; dx++) {
			if (dx * dx + dy * dy > radius * radius) continue;
			const wx = pos.x + dx;
			const wy = pos.y + dy;
			if (wx >= 0 && wy >= 0 && wx < worldMap.width && wy < worldMap.height) {
				worldMap.explored[wy][wx] = true;
			}
		}
	}
}

/** Check if overworld terrain is passable for walking. */
export function isOverworldPassable(tile: OverworldTile): boolean {
	return tile.terrain !== 'water' && tile.terrain !== 'mountain' && tile.terrain !== 'lava';
}

/** Get the location (settlement/dungeon/poi) at an overworld position, if any. */
export function getOverworldLocation(worldMap: WorldMap, pos: Position): { type: 'settlement'; data: Settlement } | { type: 'dungeon'; data: DungeonEntrance } | { type: 'poi'; data: PointOfInterest } | null {
	const tile = worldMap.tiles[pos.y]?.[pos.x];
	if (!tile?.locationId) return null;
	const settlement = worldMap.settlements.find(s => s.id === tile.locationId);
	if (settlement) return { type: 'settlement', data: settlement };
	const dungeon = worldMap.dungeonEntrances.find(d => d.id === tile.locationId);
	if (dungeon) return { type: 'dungeon', data: dungeon };
	const poi = worldMap.pois.find(p => p.id === tile.locationId);
	if (poi) return { type: 'poi', data: poi };
	return null;
}

/** Convert numeric danger level to display label and color. */
export function dangerDisplay(dangerLevel: number): { label: string; color: string } {
	if (dangerLevel <= 1) return { label: 'Safe', color: '#4a4' };
	if (dangerLevel <= 2) return { label: 'Low', color: '#aa4' };
	if (dangerLevel <= 4) return { label: 'Medium', color: '#da4' };
	if (dangerLevel <= 6) return { label: 'High', color: '#f84' };
	if (dangerLevel <= 8) return { label: 'Very High', color: '#f44' };
	return { label: 'Extreme', color: '#f08' };
}

/** Get current overworld info for HUD display. */
export function getOverworldInfo(state: GameState): { regionName: string; regionColor: string; dangerLevel: number; dangerLabel: string; dangerColor: string } | null {
	if (state.locationMode !== 'overworld' || !state.worldMap || !state.overworldPos) return null;
	const worldMap = state.worldMap as WorldMap;
	const pos = state.overworldPos;
	const tile = worldMap.tiles[pos.y]?.[pos.x];
	if (!tile) return null;
	const region = worldMap.regions.find(r => r.id === tile.region);
	if (!region) return null;
	const danger = dangerDisplay(region.dangerLevel);
	return {
		regionName: region.name,
		regionColor: REGION_COLORS[tile.region] ?? '#aaa',
		dangerLevel: region.dangerLevel,
		dangerLabel: danger.label,
		dangerColor: danger.color,
	};
}

// ── Spawn Regional NPCs ──

/** Spawn regional NPCs in a settlement based on its region. */
export function spawnRegionalNPCs(map: GameMap, region: string, existingNPCs: NPC[]): NPC[] {
	const defs = REGIONAL_NPCS[region];
	if (!defs) return existingNPCs;

	const occupied = new Set<string>();
	for (const npc of existingNPCs) occupied.add(`${npc.pos.x},${npc.pos.y}`);

	const result = [...existingNPCs];
	for (const def of defs) {
		// Find a free floor tile for this NPC
		let placed = false;
		for (let attempt = 0; attempt < 100 && !placed; attempt++) {
			const x = 2 + Math.floor(Math.random() * (map.width - 4));
			const y = 2 + Math.floor(Math.random() * (map.height - 4));
			const key = `${x},${y}`;
			if (map.tiles[y]?.[x] === '.' && !occupied.has(key)) {
				result.push({
					pos: { x, y },
					char: def.char,
					color: def.color,
					name: def.name,
					dialogue: def.dialogue,
					dialogueIndex: 0,
					gives: def.gives,
					given: false,
					mood: def.mood,
					moodTurns: 0,
					...(def.race && { race: def.race }),
					...(def.gender && { gender: def.gender }),
					...(def.raceAttitude && { raceAttitude: def.raceAttitude }),
				});
				occupied.add(key);
				placed = true;
			}
		}
	}
	return result;
}

// ── Random Encounters ──

/** Encounter chance: ~5% off-road, ~2% on roads. Returns true if encounter triggers. */
export function rollEncounter(tile: OverworldTile, turnCount: number): boolean {
	// Use turnCount as a simple pseudo-random source to keep it deterministic-ish
	const hash = ((turnCount * 2654435761) >>> 0) / 4294967296;
	const chance = tile.road ? 0.02 : 0.05;
	return hash < chance;
}

/** Generate a random combat encounter on the overworld. */
export function triggerCombatEncounter(state: GameState, regionId: string): void {
	const worldMap = state.worldMap as WorldMap;
	const regionDef = REGION_DEFS[regionId as RegionId];
	if (!regionDef) return;

	const dangerLevel = regionDef.dangerLevel;
	const encounterLevel = Math.max(1, dangerLevel);
	const encounterDefs = REGION_ENCOUNTERS[regionId]?.combat ?? ['Rat', 'Goblin'];

	// Generate a small 15x10 arena
	const arenaW = 15;
	const arenaH = 10;
	const rng = createRng(hashSeed((state.characterConfig.worldSeed || 'enc') + ':enc:' + state.turnCount));
	const arenaMap = generateMap(arenaW, arenaH, 0, rng);
	// Remove stairs from encounter arena (no descending)
	for (let y = 0; y < arenaH; y++) {
		for (let x = 0; x < arenaW; x++) {
			if (arenaMap.tiles[y][x] === '>') {
				arenaMap.tiles[y][x] = '.';
			}
		}
	}

	const enemyCount = 1 + Math.floor(rng.next() * Math.min(3, 1 + Math.floor(dangerLevel / 3)));
	const positions = getSpawnPositions(arenaMap, 1 + enemyCount, rng);

	// Place player
	const playerPos = positions[0] ?? { x: 1, y: 1 };

	// Create enemies from region encounter table
	const enemies: Entity[] = [];
	for (let i = 1; i < positions.length && i <= enemyCount; i++) {
		const monsterName = encounterDefs[Math.floor(rng.next() * encounterDefs.length)];
		const def = MONSTER_DEFS.find(m => m.name === monsterName) ?? pickMonsterDef(encounterLevel, rng);
		const enemy = createMonster(positions[i], encounterLevel, def);
		applyDifficultyToEnemy(enemy, state.characterConfig.difficulty);
		enemies.push(enemy);
	}

	// Save overworld state and switch to encounter
	const DEFAULT_SIGHT_RADIUS = 8;
	state.map = arenaMap;
	state.player.pos = playerPos;
	state.enemies = enemies;
	state.locationMode = 'location';
	state.currentLocationId = 'encounter';
	state.level = 0; // level 0 so stairs will exit back to overworld
	state.visibility = createVisibilityGrid(arenaW, arenaH);
	state.sightRadius = DEFAULT_SIGHT_RADIUS;
	updateVisibility(state.visibility, arenaMap, playerPos, state.sightRadius);
	state.traps = [];
	state.hazards = [];
	state.chests = [];
	state.lootDrops = [];
	state.npcs = [];
	state.landmarks = [];

	const enemyNames = enemies.map(e => e.name).join(', ');
	addMessage(state, `Ambush! You are attacked by ${enemyNames}!`, 'danger');
}

/** Trigger a non-combat encounter — healing, XP, or flavor. */
export function triggerNonCombatEncounter(state: GameState, regionId: string): void {
	const encounters = REGION_ENCOUNTERS[regionId]?.nonCombat ?? ['You see something in the distance, but it vanishes.'];
	// Use turnCount for deterministic selection
	const hash = ((state.turnCount * 1664525 + 1013904223) >>> 0) / 4294967296;
	const text = encounters[Math.floor(hash * encounters.length)];
	addMessage(state, text, 'npc');

	// 50% chance: heal some HP, 50% chance: small XP reward
	if (hash < 0.5) {
		const healAmt = Math.min(5 + state.characterLevel, state.player.maxHp - state.player.hp);
		if (healAmt > 0) {
			state.player.hp += healAmt;
			addMessage(state, `You recover ${healAmt} HP.`, 'healing');
		}
	} else {
		const xpGain = 3 + state.characterLevel * 2;
		state.xp += xpGain;
		addMessage(state, `+${xpGain} XP from the encounter.`, 'level_up');
		checkLevelUp(state);
	}
}

/** Check and trigger random encounter on overworld movement. Returns true if encounter occurred. */
export function checkRandomEncounter(state: GameState): boolean {
	const worldMap = state.worldMap as WorldMap;
	const pos = state.overworldPos!;
	const tile = worldMap.tiles[pos.y]?.[pos.x];
	if (!tile) return false;
	// No encounters on settlement/dungeon/POI tiles
	if (tile.locationId) return false;

	if (!rollEncounter(tile, state.turnCount)) return false;

	// 70% combat, 30% non-combat
	const combatHash = (((state.turnCount + 7) * 2246822519) >>> 0) / 4294967296;
	if (combatHash < 0.7) {
		triggerCombatEncounter(state, tile.region);
	} else {
		triggerNonCombatEncounter(state, tile.region);
	}
	return combatHash < 0.7; // return true only if combat (blocks further movement)
}

// ── Location State Caching ──

/** Build a cache key for a location + level combination. */
export function locationCacheKey(locationId: string, level: number): string {
	return `${locationId}:${level}`;
}

/** Snapshot the current location state into the cache. */
export function cacheCurrentLocation(state: GameState): void {
	if (!state.currentLocationId || state.currentLocationId === 'encounter') return;
	const key = locationCacheKey(state.currentLocationId, state.level);
	state.locationCache[key] = {
		map: state.map,
		enemies: [...state.enemies],
		npcs: [...state.npcs],
		traps: [...state.traps],
		detectedTraps: new Set(state.detectedTraps),
		hazards: [...state.hazards],
		chests: [...state.chests],
		lootDrops: [...state.lootDrops],
		landmarks: [...state.landmarks],
		visibility: state.visibility.map(row => [...row]),
		detectedSecrets: new Set(state.detectedSecrets),
		playerPos: { ...state.player.pos },
		containers: [...state.containers],
	};
}

/** Restore a cached location state. Returns true if cache existed. */
export function restoreFromCache(state: GameState, locationId: string, level: number): boolean {
	const key = locationCacheKey(locationId, level);
	const cached = state.locationCache[key];
	if (!cached) return false;

	state.map = cached.map;
	state.enemies = cached.enemies;
	state.npcs = cached.npcs;
	state.traps = cached.traps;
	state.detectedTraps = cached.detectedTraps;
	state.hazards = cached.hazards;
	state.chests = cached.chests;
	state.lootDrops = cached.lootDrops;
	state.landmarks = cached.landmarks;
	state.visibility = cached.visibility;
	state.detectedSecrets = cached.detectedSecrets;
	state.player.pos = cached.playerPos;
	state.containers = cached.containers;
	return true;
}

// ── Settlement & Dungeon Entry ──

/** Enter a settlement from the overworld. */
export function enterSettlement(state: GameState, settlement: Settlement): void {
	state.level = 0;
	state.locationMode = 'location';
	state.currentLocationId = settlement.id;

	// Try to restore from cache
	if (restoreFromCache(state, settlement.id, 0)) {
		updateVisibility(state.visibility, state.map, state.player.pos, effectiveSightRadius(state));
		addMessage(state, `You return to ${settlement.name}.`, 'discovery');
		return;
	}

	// Generate fresh — use starting location generator for starting settlements, type-based for others
	const locResult = settlement.isStartingLocation
		? generateStartingLocation(settlement.isStartingLocation, MAP_W, MAP_H)
		: generateSettlementByType(settlement.type, MAP_W, MAP_H, settlement.name);
	state.map = locResult.map;
	state.player.pos = locResult.playerPos;
	state.enemies = locResult.enemies;
	state.npcs = spawnRegionalNPCs(locResult.map, settlement.region, locResult.npcs);
	state.visibility = createVisibilityGrid(MAP_W, MAP_H);
	state.traps = [];
	state.detectedTraps = new Set();
	state.detectedSecrets = new Set();
	state.hazards = [];
	state.chests = [];
	state.lootDrops = [];
	state.landmarks = [];
	updateVisibility(state.visibility, state.map, state.player.pos, effectiveSightRadius(state));
	// Set ley line level: academy locations get convergence, others normal
	state.leyLineLevel = settlement.id.includes('academy') ? 4 : 2;
	addMessage(state, `You enter ${settlement.name}.`, 'discovery');
}

/** Enter a dungeon from the overworld. Uses newLevel from engine.ts via the provided factory. */
export function enterDungeon(state: GameState, dungeon: DungeonEntrance, newLevelFn: (level: number, difficulty?: Difficulty, worldSeed?: string) => GameState): void {
	// Region danger level offsets the starting dungeon level
	const regionDef = REGION_DEFS[dungeon.region as RegionId];
	const dangerOffset = regionDef ? Math.max(0, regionDef.dangerLevel - 1) : 0;
	const startLevel = 1 + dangerOffset;

	state.locationMode = 'location';
	state.currentLocationId = dungeon.id;

	// Try to restore from cache
	if (restoreFromCache(state, dungeon.id, startLevel)) {
		state.level = startLevel;
		updateVisibility(state.visibility, state.map, state.player.pos, effectiveSightRadius(state));
		addMessage(state, `You return to ${dungeon.name}...`, 'discovery');
		return;
	}

	const next = newLevelFn(startLevel, state.characterConfig.difficulty, state.characterConfig.worldSeed);
	// Carry over player state
	next.player.hp = state.player.hp;
	next.player.maxHp = Math.max(state.player.maxHp, next.player.maxHp);
	next.player.attack = Math.max(state.player.attack, next.player.attack);
	next.player.name = state.player.name;
	next.player.statusEffects = [...state.player.statusEffects];
	next.xp = state.xp;
	next.characterLevel = state.characterLevel;
	next.sightRadius = state.sightRadius;
	next.characterConfig = state.characterConfig;
	next.abilityCooldown = state.abilityCooldown;
	next.skillPoints = state.skillPoints;
	next.unlockedSkills = [...state.unlockedSkills];
	next.rumors = [...state.rumors];
	next.knownLanguages = [...state.knownLanguages];
	next.heardStories = [...state.heardStories];
	next.lieCount = state.lieCount;
	next.stats = { ...state.stats };
	next.unlockedAchievements = [...state.unlockedAchievements];
	next.bestiary = { ...state.bestiary };
	next.hunger = state.hunger;
	next.thirst = state.thirst;
	next.survivalEnabled = state.survivalEnabled;
	next.turnCount = state.turnCount;
	next.worldMap = state.worldMap;
	next.overworldPos = state.overworldPos;
	next.locationMode = 'location';
	next.currentLocationId = dungeon.id;
	// Carry inventory state into dungeon
	next.inventory = [...state.inventory];
	next.equipment = { ...state.equipment };
	next.containers = [...state.containers];
	next.waypoint = state.waypoint;
	next.locationCache = state.locationCache;
	// Set ley line level based on dungeon depth
	const dungeonLevel = startLevel;
	if (dungeon.id.includes('academy')) {
		next.leyLineLevel = 4; // Convergence near academy
	} else if (dungeonLevel >= 8) {
		// Deep dungeons: varies (use level hash for pseudo-random)
		next.leyLineLevel = 1 + (dungeonLevel % 3); // 1, 2, or 3
	} else if (dungeonLevel >= 4) {
		// Mid dungeons: normal or high
		next.leyLineLevel = dungeonLevel % 2 === 0 ? 2 : 3;
	} else {
		next.leyLineLevel = 2; // Shallow: normal
	}
	// Copy into state (mutate in place since we're inside handleOverworldInput)
	Object.assign(state, next);
	addMessage(state, `You descend into ${dungeon.name}...`, 'discovery');
	// Region-specific dungeon atmosphere
	const dungeonFlavor = DUNGEON_ENTRANCE_FLAVOR[dungeon.region];
	if (dungeonFlavor) {
		addMessage(state, dungeonFlavor, 'info');
	}
	if (dangerOffset > 0) {
		const dangerLabel = dangerOffset >= 8 ? 'overwhelming' : dangerOffset >= 5 ? 'very dangerous' : dangerOffset >= 3 ? 'dangerous' : 'challenging';
		addMessage(state, `The creatures here seem ${dangerLabel}. (Level ${startLevel}+)`, 'danger');
	}
}

// ── POI Discovery ──

/** Discover a POI on the overworld — gives type-specific rewards. */
export function discoverPOI(state: GameState, poi: PointOfInterest): void {
	const worldMap = state.worldMap as WorldMap;

	if (!poi.discovered) {
		poi.discovered = true;
		addMessage(state, `Discovered: ${poi.name}!`, 'discovery');
		state.stats.secretsFound++;

		// Base XP reward for discovery
		const xpGain = 10 + (state.characterLevel * 2);
		state.xp += xpGain;
		addMessage(state, `+${xpGain} XP for exploration.`, 'level_up');

		// Type-specific first-visit rewards
		const regionDef = REGION_DEFS[poi.region];

		switch (poi.type) {
			case 'shrine':
				applyEffect(state.player, 'regeneration', 10, 2);
				addMessage(state, 'You pray at the shrine. A warm light envelops you. (Regeneration 10 turns)', 'healing');
				break;

			case 'standing_stones': {
				const lang = regionDef?.language ?? 'Common';
				if (lang !== 'Common' && !state.knownLanguages.includes(lang)) {
					state.knownLanguages = [...state.knownLanguages, lang];
					addMessage(state, `The stone inscriptions whisper in your mind. Language learned: ${lang}!`, 'discovery');
				} else {
					// Already know the language — extra XP instead
					const bonusXp = 15 + (state.characterLevel * 3);
					state.xp += bonusXp;
					addMessage(state, `The inscriptions are familiar to you. +${bonusXp} bonus XP.`, 'level_up');
				}
				break;
			}

			case 'ruins':
				state.player.attack += 1;
				addMessage(state, 'Among the rubble you find a well-preserved weapon. (+1 ATK)', 'discovery');
				break;

			case 'hidden_cave':
				state.player.hp = state.player.maxHp;
				addMessage(state, 'A sheltered cave with a clear spring. You rest and recover fully.', 'healing');
				break;

			case 'ancient_tree':
				state.player.hp = state.player.maxHp;
				applyEffect(state.player, 'regeneration', 15, 3);
				addMessage(state, 'The ancient tree radiates life energy. You feel renewed. (Full HP + Regen 15 turns)', 'healing');
				break;

			case 'hot_spring':
				state.player.hp = state.player.maxHp;
				addMessage(state, 'You soak in the warm waters. All weariness fades. (Full HP)', 'healing');
				break;

			case 'grave_site': {
				const storyId = `grave_${poi.region}`;
				if (!state.heardStories.includes(storyId)) {
					state.heardStories = [...state.heardStories, storyId];
				}
				const lore = GRAVE_LORE[poi.region] ?? 'A forgotten soul rests here.';
				addMessage(state, `The epitaph reads: "${lore}"`, 'npc');
				break;
			}

			case 'obelisk':
				revealOverworldArea(worldMap, poi.pos, 15);
				addMessage(state, 'Atop the obelisk, you survey the land. A vast area is revealed on your map!', 'discovery');
				break;
		}

		checkLevelUp(state);
		processAchievements(state);
	} else {
		// Revisit rewards for certain POI types
		switch (poi.type) {
			case 'shrine':
				state.player.hp = Math.min(state.player.maxHp, state.player.hp + 3);
				addMessage(state, `${poi.name} — you pray quietly. (+3 HP)`, 'healing');
				break;
			case 'hot_spring':
				state.player.hp = Math.min(state.player.maxHp, state.player.hp + 10);
				addMessage(state, `${poi.name} — the warm waters soothe you. (+10 HP)`, 'healing');
				break;
			default:
				addMessage(state, `${poi.name} — you've been here before.`, 'info');
				break;
		}
	}
}

// ── Ley Line Level Helper ──

/** Map an overworld tile's leyLine property to the corresponding ley line power level (0-4). */
export function getLeyLineLevelForTile(tile: OverworldTile): number {
	switch (tile.leyLine) {
		case 'convergence': return 4;
		case 'core': return 3;
		case 'aura': return 2;
		default: return 2; // Normal background level
	}
}

// ── Ley Line Quest Tracking ──

/** Track Threads of Power quest objectives based on player position and state. */
export function trackLeyLineQuestProgress(state: GameState): void {
	const quest = state.quests.find(q => q.id === 'threads_of_power' && q.status === 'active');
	if (!quest) return;

	const worldMap = state.worldMap as WorldMap;
	const pos = state.overworldPos;
	if (!pos || state.locationMode !== 'overworld') return;
	const tile = worldMap.tiles[pos.y]?.[pos.x];
	if (!tile) return;

	// Objective 1: Cast True Sight at convergence
	if (tile.leyLine === 'convergence' && state.trueSightActive > 0) {
		const obj = quest.objectives.find(o => o.id === 'tp_cast_truesight');
		if (obj && !obj.completed) {
			obj.current = 1;
			obj.completed = true;
			addMessage(state, 'The ground erupts with light. Two brilliant streams of energy cross beneath you, stretching to the horizon.', 'magic');
		}
	}

	// Objective 2: Walk the line (core tile, with True Sight active)
	if (tile.leyLine === 'core' && state.trueSightActive > 0) {
		const obj = quest.objectives.find(o => o.id === 'tp_walk_line');
		if (obj && !obj.completed) {
			obj.current = 1;
			obj.completed = true;
			addMessage(state, 'The glow dims but persists — the ley line continues, weaker but steady.', 'magic');
		}
	}

	// Objective 3: Return to convergence with full mana (after objectives 1 and 2 done)
	if (tile.leyLine === 'convergence' && (state.player.mana ?? 0) >= (state.player.maxMana ?? 1)) {
		const obj1 = quest.objectives.find(o => o.id === 'tp_cast_truesight');
		const obj2 = quest.objectives.find(o => o.id === 'tp_walk_line');
		const obj3 = quest.objectives.find(o => o.id === 'tp_return_convergence');
		if (obj3 && !obj3.completed && obj1?.completed && obj2?.completed) {
			obj3.current = 1;
			obj3.completed = true;
			addMessage(state, 'Now you understand why the Academy was built here. The convergence is the finest place to study magic.', 'magic');
		}
	}

	// Auto-complete quest if all objectives done
	if (quest.objectives.every(o => o.completed)) {
		const result = completeQuest(state, 'threads_of_power');
		if (result.success) {
			for (const msg of result.messages) {
				addMessage(state, msg, 'discovery');
			}
		}
	}
}

/** Track Blighted Harvest quest objectives based on player proximity to Thornfield Farm. */
export function trackBlightedHarvestProgress(state: GameState): void {
	const quest = state.quests.find(q => q.id === 'blighted_harvest' && q.status === 'active');
	if (!quest) return;

	const worldMap = state.worldMap as WorldMap;
	const pos = state.overworldPos;
	if (!pos || state.locationMode !== 'overworld') return;

	// Check if player is at or inside Thornfield Farm
	const farm = worldMap.settlements.find(s => s.name === 'Thornfield Farm');
	if (!farm) return;

	const nearFarm = Math.abs(pos.x - farm.pos.x) <= 2 && Math.abs(pos.y - farm.pos.y) <= 2;
	const insideFarm = state.currentLocationId === farm.id;

	if ((nearFarm || insideFarm) && (state.trueSightActive > 0 || (state.revealedLeyLineTiles?.size ?? 0) > 0)) {
		const obj = quest.objectives.find(o => o.id === 'bh_investigate');
		if (obj && !obj.completed) {
			obj.current = 1;
			obj.completed = true;
			addMessage(state, 'Through your magical sight, you see it clearly — a brilliant stream of energy runs directly through the field and under the well.', 'magic');
		}
	}
}

// ── Exit to Overworld ──

/** Return to the overworld from a location. */
export function exitToOverworld(state: GameState): GameState {
	if (!state.worldMap || !state.overworldPos) return state;
	// Block exit during exam combat
	if (state.enemies.some(e => e.name === 'Exam Golem')) {
		addMessage(state, 'You cannot leave during the combat trial!', 'danger');
		return { ...state };
	}
	// Cache current location state before leaving
	cacheCurrentLocation(state);
	state.locationMode = 'overworld';
	state.currentLocationId = null;
	state.enemies = [];
	state.npcs = [];
	state.traps = [];
	state.hazards = [];
	state.chests = [];
	state.lootDrops = [];
	state.landmarks = [];
	const worldMap = state.worldMap as WorldMap;
	const currentTile = worldMap.tiles[state.overworldPos!.y]?.[state.overworldPos!.x];
	state.leyLineLevel = currentTile ? getLeyLineLevelForTile(currentTile) : 2;
	addMessage(state, 'You return to the overworld.', 'info');
	return { ...state };
}

// ── Overworld Input Handler ──

/** Handle overworld movement and location entry. Needs createGame and newLevel from engine.ts. */
export function handleOverworldInput(
	state: GameState,
	key: string,
	createGameFn: (config?: any) => GameState,
	newLevelFn: (level: number, difficulty?: Difficulty, worldSeed?: string) => GameState,
): GameState {
	if (state.gameOver) {
		if (key === 'r') return createGameFn(state.characterConfig);
		return state;
	}

	let dx = 0, dy = 0;
	if (key === 'w' || key === 'ArrowUp') dy = -1;
	else if (key === 's' || key === 'ArrowDown') dy = 1;
	else if (key === 'a' || key === 'ArrowLeft') dx = -1;
	else if (key === 'd' || key === 'ArrowRight') dx = 1;
	else return state;

	const worldMap = state.worldMap as WorldMap;
	const pos = state.overworldPos!;
	const nx = pos.x + dx;
	const ny = pos.y + dy;

	if (nx < 0 || ny < 0 || nx >= worldMap.width || ny >= worldMap.height) return state;
	const targetTile = worldMap.tiles[ny][nx];
	if (!isOverworldPassable(targetTile)) {
		addMessage(state, `The ${targetTile.terrain} blocks your path.`, 'info');
		return { ...state };
	}

	// Detect region transition before moving
	const prevRegion = worldMap.tiles[pos.y][pos.x].region;
	const nextRegion = targetTile.region;

	// Move on overworld
	state.overworldPos = { x: nx, y: ny };
	revealOverworldArea(worldMap, state.overworldPos, getOverworldSightRadius(targetTile, state.playerRace));

	// Update ley line level based on tile
	state.leyLineLevel = getLeyLineLevelForTile(targetTile);

	// Instant mana restore at convergence points
	if (targetTile.leyLine === 'convergence' && (state.player.mana ?? 0) < (state.player.maxMana ?? 0)) {
		state.player.mana = state.player.maxMana ?? 0;
		addMessage(state, 'Power floods through you as you cross the ley line convergence. Mana fully restored!', 'magic');
	}

	// Track Threads of Power quest objectives (after mana restore, before True Sight tick-down)
	trackLeyLineQuestProgress(state);
	trackBlightedHarvestProgress(state);

	// Ley line flavor text (when visible via True Sight)
	if (state.trueSightActive > 0 && (targetTile.leyLine === 'core' || targetTile.leyLine === 'convergence')) {
		const LEY_FLAVOR: Partial<Record<string, string>> = {
			farmland: 'The crops grow unnaturally tall here, fed by unseen energy.',
			forest: 'The trees hum faintly, leaves trembling without wind.',
			grass: 'The ground pulses with faint warmth beneath your feet.',
			rock: 'Veins of light trace through the stone.',
			water: 'The surface shimmers with an inner glow.',
			sand: 'The sand grains glitter with arcane residue.',
			snow: 'The snow melts in thin lines, revealing warm earth beneath.',
			swamp: 'The murky water glows faintly from below.',
		};
		const flavor = LEY_FLAVOR[targetTile.terrain] ?? 'You sense raw magical energy flowing through this place.';
		addMessage(state, flavor, 'magic');
	}

	// Region transition announcement
	if (nextRegion !== prevRegion) {
		const regionDef = worldMap.regions.find(r => r.id === nextRegion);
		if (regionDef) {
			addMessage(state, `— You enter ${regionDef.name} —`, 'discovery');
			const flavorMsg = REGION_FLAVOR[nextRegion];
			if (flavorMsg) addMessage(state, flavorMsg, 'info');
			// Danger warning for high-danger regions
			if (regionDef.dangerLevel >= 4) {
				const danger = dangerDisplay(regionDef.dangerLevel);
				addMessage(state, `Warning: Danger level ${danger.label}. Creatures here are level ${regionDef.dangerLevel}+.`, 'danger');
			}
		}
	}

	// Terrain movement cost
	const moveCost = getOverworldMoveCost(targetTile);
	if (moveCost > 1) {
		const terrainName = targetTile.terrain === 'mud' ? 'mud' : targetTile.terrain === 'ice' ? 'ice' : targetTile.terrain;
		addMessage(state, `The ${terrainName} slows your progress.`, 'info');
	}

	// Road bonus: double-step when on a road moving onto another road tile
	const currentTile = worldMap.tiles[pos.y]?.[pos.x];
	if (targetTile.road && currentTile?.road && !targetTile.locationId) {
		const nx2 = nx + dx;
		const ny2 = ny + dy;
		if (nx2 >= 0 && ny2 >= 0 && nx2 < worldMap.width && ny2 < worldMap.height) {
			const secondTile = worldMap.tiles[ny2][nx2];
			if (isOverworldPassable(secondTile) && secondTile.road) {
				// Check region transition for second step too
				const secondRegion = secondTile.region;
				state.overworldPos = { x: nx2, y: ny2 };
				revealOverworldArea(worldMap, state.overworldPos, getOverworldSightRadius(secondTile, state.playerRace));
				if (secondRegion !== nextRegion) {
					const regionDef = worldMap.regions.find(r => r.id === secondRegion);
					if (regionDef) {
						addMessage(state, `— You enter ${regionDef.name} —`, 'discovery');
						const flavorMsg = REGION_FLAVOR[secondRegion];
						if (flavorMsg) addMessage(state, flavorMsg, 'info');
					}
				}
			}
		}
	}

	// Signpost interaction: show nearby settlement directions
	const finalTile = worldMap.tiles[state.overworldPos.y]?.[state.overworldPos.x];
	if (finalTile?.signpost) {
		showSignpostInfo(state, worldMap, state.overworldPos);
	}

	// Tick survival on overworld movement (extra tick for slow terrain)
	if (state.survivalEnabled) {
		const survivalResult = tickSurvival(state);
		for (const msg of survivalResult.messages) {
			addMessage(state, msg.text, msg.type);
		}
	}

	state.turnCount += moveCost;

	// Tick True Sight duration
	if (state.trueSightActive > 0) {
		state.trueSightActive--;
		if (state.trueSightActive === 0) {
			addMessage(state, 'Your True Sight fades.', 'info');
		}
	}
	// Clear Reveal Secrets one-shot tiles each movement
	if (state.revealedLeyLineTiles?.size > 0) {
		state.revealedLeyLineTiles = new Set();
	}

	// Tick academy notifications on overworld
	const academyOWMsgs = tickAcademy(state);
	for (const msg of academyOWMsgs) state.messages.push(msg);

	// Random encounter check (before location entry)
	if (checkRandomEncounter(state)) {
		return { ...state }; // Combat encounter — player is now in arena
	}

	// Check for location entry
	const location = getOverworldLocation(worldMap, state.overworldPos);
	if (location) {
		if (location.type === 'settlement') {
			enterSettlement(state, location.data);
		} else if (location.type === 'dungeon') {
			enterDungeon(state, location.data, newLevelFn);
		} else if (location.type === 'poi') {
			discoverPOI(state, location.data);
		}
	}

	return { ...state };
}

// ── Overworld Rendering ──

/** Render the overworld as a viewport-sized colored grid. */
export function renderOverworldColored(state: GameState): { char: string; color: string }[][] {
	const worldMap = state.worldMap as WorldMap;
	const pos = state.overworldPos!;
	const halfW = Math.floor(OVERWORLD_VIEWPORT_W / 2);
	const halfH = Math.floor(OVERWORLD_VIEWPORT_H / 2);
	const camX = Math.max(halfW, Math.min(worldMap.width - halfW - 1, pos.x));
	const camY = Math.max(halfH, Math.min(worldMap.height - halfH - 1, pos.y));
	const startX = camX - halfW;
	const startY = camY - halfH;

	const grid: { char: string; color: string }[][] = [];
	for (let vy = 0; vy < OVERWORLD_VIEWPORT_H; vy++) {
		const row: { char: string; color: string }[] = [];
		const wy = startY + vy;
		for (let vx = 0; vx < OVERWORLD_VIEWPORT_W; vx++) {
			const wx = startX + vx;

			if (wx < 0 || wy < 0 || wx >= worldMap.width || wy >= worldMap.height) {
				row.push({ char: ' ', color: '#000' });
				continue;
			}

			if (!worldMap.explored[wy][wx]) {
				row.push({ char: ' ', color: '#000' });
				continue;
			}

			// Player position
			if (wx === pos.x && wy === pos.y) {
				row.push({ char: '@', color: '#ff0' });
				continue;
			}

			const tile = worldMap.tiles[wy][wx];
			const isNearPlayer = Math.abs(wx - pos.x) <= OVERWORLD_SIGHT_RADIUS && Math.abs(wy - pos.y) <= OVERWORLD_SIGHT_RADIUS;

			// Locations
			if (tile.locationId) {
				const settlement = worldMap.settlements.find(s => s.id === tile.locationId);
				if (settlement) {
					const char = settlement.type === 'city' ? 'C' : settlement.type === 'town' ? 'T' : settlement.type === 'fortress' ? 'F' : settlement.type === 'village' ? 'v' : 'c';
					const color = isNearPlayer ? '#ff8' : '#886';
					row.push({ char, color });
					continue;
				}
				const dungeon = worldMap.dungeonEntrances.find(d => d.id === tile.locationId);
				if (dungeon) {
					row.push({ char: '>', color: isNearPlayer ? '#f88' : '#844' });
					continue;
				}
				const poi = worldMap.pois.find(p => p.id === tile.locationId);
				if (poi) {
					if (poi.hidden && !isNearPlayer) {
						// Hidden POI: render as normal terrain unless adjacent
						const display = TERRAIN_DISPLAY[tile.terrain];
						row.push({ char: display.char, color: dimColor(display.color) });
						continue;
					}
					row.push({ char: '?', color: isNearPlayer ? '#af8' : '#585' });
					continue;
				}
			}

			// Signpost
			if (tile.signpost) {
				row.push({ char: '+', color: isNearPlayer ? '#db8' : '#864' });
				continue;
			}

			// Road
			if (tile.road) {
				const roadChar = tile.road === 'main' ? '=' : '-';
				const roadColor = isNearPlayer ? '#ca8' : '#654';
				row.push({ char: roadChar, color: roadColor });
				continue;
			}

			// Ley line color overlay (True Sight, Reveal Secrets, or Elf racial sensing)
			if (tile.leyLine && isNearPlayer) {
				const elfSenseRange = state.playerRace === 'elf' ? 3 : 0;
				const elfCanSense = elfSenseRange > 0 && state.overworldPos &&
					Math.abs(wx - state.overworldPos.x) <= elfSenseRange &&
					Math.abs(wy - state.overworldPos.y) <= elfSenseRange;
				const leyVisible = (state.trueSightActive > 0 || state.revealedLeyLineTiles?.has(`${wx},${wy}`) || elfCanSense);
				if (leyVisible) {
					const display = TERRAIN_DISPLAY[tile.terrain];
					const leyColor = tile.leyLine === 'convergence' ? '#fc4' : tile.leyLine === 'core' ? '#4ff' : '#2aa';
					row.push({ char: display.char, color: leyColor });
					continue;
				}
			}

			// Terrain
			const display = TERRAIN_DISPLAY[tile.terrain];
			const color = isNearPlayer ? display.color : dimColor(display.color);
			row.push({ char: display.char, color });
		}
		grid.push(row);
	}
	return grid;
}

/** Render the zoomed-out world map (200x200 -> MAP_WxMAP_H). */
export function renderWorldMap(state: GameState): { grid: { char: string; color: string }[][]; labels: { text: string; x: number; y: number; color: string }[] } {
	const worldMap = state.worldMap as WorldMap;
	const pos = state.overworldPos;
	const scaleX = WORLD_W / MAP_W;  // 4
	const scaleY = WORLD_H / MAP_H;  // ~8.33

	const grid: { char: string; color: string }[][] = [];
	const labels: { text: string; x: number; y: number; color: string }[] = [];

	// Track which regions we've placed labels for
	const labeledRegions = new Set<string>();

	for (let vy = 0; vy < MAP_H; vy++) {
		const row: { char: string; color: string }[] = [];
		const wy = Math.min(Math.floor(vy * scaleY), WORLD_H - 1);
		for (let vx = 0; vx < MAP_W; vx++) {
			const wx = Math.min(Math.floor(vx * scaleX), WORLD_W - 1);

			// Player position (check if player falls within this cell)
			if (pos) {
				const pvx = Math.floor(pos.x / scaleX);
				const pvy = Math.floor(pos.y / scaleY);
				if (vx === pvx && vy === pvy) {
					row.push({ char: '@', color: '#ff0' });
					continue;
				}
			}

			// Waypoint
			if (state.waypoint) {
				const wpvx = Math.floor(state.waypoint.x / scaleX);
				const wpvy = Math.floor(state.waypoint.y / scaleY);
				if (vx === wpvx && vy === wpvy) {
					row.push({ char: 'X', color: '#f0f' });
					continue;
				}
			}

			// Check if any tile in this cell is explored
			let explored = false;
			for (let sy = 0; sy < Math.ceil(scaleY) && !explored; sy++) {
				for (let sx = 0; sx < scaleX && !explored; sx++) {
					const ey = Math.min(wy + sy, WORLD_H - 1);
					const ex = Math.min(wx + sx, WORLD_W - 1);
					if (worldMap.explored[ey]?.[ex]) explored = true;
				}
			}

			if (!explored) {
				row.push({ char: ' ', color: '#000' });
				continue;
			}

			const tile = worldMap.tiles[wy][wx];

			// Settlements (check all tiles in this cell)
			let foundSettlement: Settlement | undefined;
			let foundDungeon: DungeonEntrance | undefined;
			let foundPOI: PointOfInterest | undefined;
			for (let sy = 0; sy < Math.ceil(scaleY) && !foundSettlement; sy++) {
				for (let sx = 0; sx < scaleX && !foundSettlement; sx++) {
					const ey = Math.min(wy + sy, WORLD_H - 1);
					const ex = Math.min(wx + sx, WORLD_W - 1);
					const ct = worldMap.tiles[ey]?.[ex];
					if (ct?.locationId) {
						const s = worldMap.settlements.find(s => s.id === ct.locationId);
						if (s) { foundSettlement = s; break; }
						const d = worldMap.dungeonEntrances.find(d => d.id === ct.locationId);
						if (d) { foundDungeon = d; break; }
						const p = worldMap.pois.find(p => p.id === ct.locationId && p.discovered);
						if (p) { foundPOI = p; break; }
					}
				}
			}

			if (foundSettlement) {
				const char = foundSettlement.type === 'city' ? 'C' : foundSettlement.type === 'town' ? 'T' : 'v';
				row.push({ char, color: '#ff8' });
				continue;
			}
			if (foundDungeon) {
				row.push({ char: '>', color: '#f88' });
				continue;
			}
			if (foundPOI) {
				row.push({ char: '?', color: '#af8' });
				continue;
			}

			// Region label placement (first explored cell per region)
			if (!labeledRegions.has(tile.region)) {
				labeledRegions.add(tile.region);
				const region = worldMap.regions.find(r => r.id === tile.region);
				if (region) {
					const danger = dangerDisplay(region.dangerLevel);
					labels.push({ text: `${region.name} [${danger.label}]`, x: vx, y: vy, color: REGION_COLORS[tile.region] ?? '#aaa' });
				}
			}

			// Roads
			if (tile.road) {
				row.push({ char: tile.road === 'main' ? '=' : '-', color: '#a86' });
				continue;
			}

			// Terrain
			const display = TERRAIN_DISPLAY[tile.terrain];
			row.push({ char: display.char, color: dimColor(display.color) });
		}
		grid.push(row);
	}
	return { grid, labels };
}

/** Get waypoint direction indicator for HUD display. */
export function getWaypointIndicator(state: GameState): { direction: string; distance: number } | null {
	if (!state.waypoint || !state.overworldPos) return null;
	const dx = state.waypoint.x - state.overworldPos.x;
	const dy = state.waypoint.y - state.overworldPos.y;
	const dist = Math.abs(dx) + Math.abs(dy);
	if (dist < 3) return { direction: 'HERE', distance: dist };
	let dir: string;
	const adx = Math.abs(dx);
	const ady = Math.abs(dy);
	if (ady < adx * 0.4) dir = dx > 0 ? 'E' : 'W';
	else if (adx < ady * 0.4) dir = dy > 0 ? 'S' : 'N';
	else if (dx > 0) dir = dy > 0 ? 'SE' : 'NE';
	else dir = dy > 0 ? 'SW' : 'NW';
	return { direction: dir, distance: dist };
}
