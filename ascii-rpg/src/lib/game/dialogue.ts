import type { DialogueTree, DialogueNode, Rumor } from './types';

function node(id: string, npcText: string, options: DialogueNode['options'], language?: string): DialogueNode {
	return { id, npcText, options, language };
}

function opt(text: string, nextNode: string, color?: string, extras?: { onSelect?: DialogueNode['options'][0]['onSelect']; once?: boolean }): DialogueNode['options'][0] {
	return { text, nextNode, color, ...extras };
}

function rumor(id: string, text: string, source: string, accuracy: Rumor['accuracy']): Rumor {
	return { id, text, source, accuracy };
}

// ─── RUMOR CATALOGUE ───
// TRUE: real gameplay hints
// EXAGGERATED: partially true, misleading
// FALSE: total nonsense (funny)

const RUMORS = {
	// True rumors — actual gameplay hints
	secret_walls: rumor('secret_walls', 'Some dungeon walls hide secret passages. Search near dead ends.', 'The Barkeep', 'true'),
	mimics: rumor('mimics', 'Gold chests can be Mimics in disguise. Approach with caution.', 'The Barkeep', 'true'),
	boss_every_five: rumor('boss_every_five', 'A powerful boss lurks every five levels. Prepare before descending.', 'The Barkeep', 'true'),
	traps_near_treasure: rumor('traps_near_treasure', 'Traps cluster near treasure rooms. Rogues detect them more easily.', 'Hooded Stranger', 'true'),
	potions_matter: rumor('potions_matter', 'Healing potions become scarce in deeper levels. Never pass one up.', 'Hooded Stranger', 'true'),
	corridor_chokepoint: rumor('corridor_chokepoint', 'Narrow corridors are your friend — fight enemies one at a time.', 'Hooded Stranger', 'true'),

	// Exaggerated rumors — partially true, misleading scale
	level_ten_horror: rumor('level_ten_horror', 'Below level ten, the monsters grow as large as houses. HOUSES!', 'Garvus (drunk)', 'exaggerated'),
	treasure_room: rumor('treasure_room', 'There is a room made entirely of gold on level seven. Entirely!', 'Garvus (drunk)', 'exaggerated'),
	singing_walls: rumor('singing_walls', 'The walls sing on the deeper levels. Beautiful, haunting melodies.', 'Garvus (drunk)', 'exaggerated'),
	merchant_everywhere: rumor('merchant_everywhere', 'A merchant appears on every single dungeon level. Never misses one!', 'Morrigan', 'exaggerated'),

	// False rumors — entertaining nonsense
	skeleton_king: rumor('skeleton_king', 'The Skeleton King on level three will spare you if you bow.', 'Morrigan', 'false'),
	backwards_walking: rumor('backwards_walking', 'Walking backwards makes you invisible to all monsters.', 'Garvus (drunk)', 'false'),
	lava_potion: rumor('lava_potion', 'Lava is actually a healing bath if you have fire resistance potions.', 'Morrigan', 'false'),
	friendly_mimics: rumor('friendly_mimics', 'If you compliment a Mimic on its woodwork, it becomes your ally.', 'The Barkeep', 'false'),
	dungeon_password: rumor('dungeon_password', 'Shouting "PARSLEY" at any locked door will open it instantly.', 'Hooded Stranger', 'false'),
} as const;

// ─── VILLAGE: MOTHER ───

export const MOTHER_DIALOGUE: DialogueTree = {
	startNode: 'start',
	returnNode: 'return',
	nodes: {
		start: node('start',
			'Oh, my dear child. You look so determined today. I always knew this day would come... the day you\'d leave Willowmere.',
			[
				opt('What can you tell me about the dungeon?', 'dungeon_info', '#ff4'),
				opt('I\'ll be fine, Mother. Don\'t worry.', 'reassure', '#4f4', { onSelect: { mood: 'sad' } }),
				opt('Do you have anything that might help me?', 'give_item', '#ff4'),
				opt('Tell me about Willowmere.', 'village_lore', '#8cf'),
				opt('Goodbye, Mother.', 'farewell', '#0ff'),
			]
		),
		return: node('return',
			'Back again? A mother always worries, but I\'m glad to see your face.',
			[
				opt('What can you tell me about the dungeon?', 'dungeon_info', '#ff4'),
				opt('Tell me about Willowmere.', 'village_lore', '#8cf'),
				opt('Just checking in.', 'checkin', '#4f4', { onSelect: { mood: 'friendly' } }),
				opt('Goodbye, Mother.', 'farewell', '#0ff'),
			]
		),
		dungeon_info: node('dungeon_info',
			'The Dungeon of Shadows... it appeared thirty years ago, the night the sky turned red. Your father explored the first few levels back then. He said the walls themselves seemed alive, shifting when you weren\'t looking. Whatever you do, watch your step. The deeper floors have traps that would make a seasoned adventurer weep.',
			[
				opt('What happened the night the sky turned red?', 'red_sky', '#8cf'),
				opt('Father explored the dungeon?', 'father_past', '#ff4'),
				opt('I\'ll be careful. Thank you.', 'farewell', '#0ff'),
			]
		),
		red_sky: node('red_sky',
			'Nobody speaks of it openly, but I remember. A sound like a god clearing its throat, then the horizon bled crimson for three days. When it stopped, the dungeon was just... there. Growing out of the earth like a wound that refuses to heal. Old Maren the scholar said it was a "planar convergence." I say it was trouble wearing a fancy hat.',
			[
				opt('That\'s... unsettling.', 'dungeon_info', '#fff'),
				opt('Who is Old Maren?', 'maren', '#8cf'),
				opt('I should get going.', 'farewell', '#0ff'),
			]
		),
		maren: node('maren',
			'Maren was Willowmere\'s scholar. Brilliant woman, terrible cook. She spent years studying the dungeon from the outside. Mapped the energy patterns, catalogued the creatures that wandered out at night. One morning she walked in and never came back. Some say she\'s still down there, on the deepest floor, still taking notes.',
			[
				opt('Maybe I\'ll find her.', 'find_maren', '#4f4'),
				opt('Let\'s talk about something else.', 'start', '#fff'),
			]
		),
		find_maren: node('find_maren',
			'If you do... tell her she still owes me a pie recipe. *She wipes her eye.* But really, dear, be careful. The dungeon changes people. Some come back stronger. Some come back... different.',
			[
				opt('I won\'t change. I promise.', 'farewell', '#4f4'),
				opt('Different how?', 'different', '#ff4'),
			]
		),
		different: node('different',
			'Your father has nightmares sometimes. He calls out names I don\'t recognize. Says things in languages that shouldn\'t exist. He only went to level three. *She looks at the floor.* But he came back. That\'s what matters.',
			[
				opt('I\'ll come back too. I promise.', 'farewell', '#4f4'),
			]
		),
		father_past: node('father_past',
			'Your father was quite the adventurer before you were born. Fastest sword in three counties, they said. He cleared the first three floors of the dungeon single-handedly. Would have gone deeper, but then I told him I was expecting you, and he hung up his sword that same evening. Said no treasure was worth missing your first steps.',
			[
				opt('That\'s... really sweet actually.', 'sweet', '#4f4'),
				opt('He must have been strong.', 'father_strength', '#ff4'),
				opt('Let\'s talk about something else.', 'start', '#fff'),
			]
		),
		sweet: node('sweet',
			'Don\'t tell him I told you. He likes to pretend he\'s all stoic and gruff. *She smiles.* But between you and me, he cried for an hour straight when you said your first word. It was "sword." He was so proud.',
			[
				opt('Ha! That sounds about right.', 'farewell', '#4f4'),
			]
		),
		father_strength: node('father_strength',
			'Strong as an ox and twice as stubborn. His old sword still has nicks from dungeon creatures. He\'ll give it to you if you ask \u2014 I can see it in his eyes. He\'s been polishing it every night for a week.',
			[
				opt('I\'ll talk to him about it.', 'farewell', '#4f4'),
			]
		),
		reassure: node('reassure',
			'*She cups your face in her hands.* I know you will. You have your father\'s courage and my good sense. Well... most of my good sense. You ARE voluntarily walking into a monster-infested dungeon.',
			[
				opt('Fair point.', 'start', '#fff'),
				opt('I should go prepare.', 'farewell', '#0ff'),
			]
		),
		give_item: node('give_item',
			'I\'ve been saving this healing salve. Made it from moonpetal flowers \u2014 they only bloom during thunderstorms, so it took me three months to gather enough. Use it wisely, dear.',
			[
				opt('Thank you, Mother. [Take healing salve]', 'after_gift', '#4f4', { onSelect: { hp: 5, message: 'Mother gave you a healing salve! +5 HP' } }),
				opt('Keep it. You might need it.', 'keep_it', '#fff'),
			]
		),
		after_gift: node('after_gift',
			'Now you be careful with that. And eat something before you go! You\'re too thin. All adventurers are too thin.',
			[
				opt('Yes, Mother.', 'farewell', '#4f4'),
				opt('Can we talk about something else?', 'return', '#fff'),
			]
		),
		keep_it: node('keep_it',
			'Nonsense! What am I going to do with it, heal a pie? Take it! *She shoves the salve into your hands.*',
			[
				opt('Okay, okay! [Take healing salve]', 'after_gift', '#4f4', { onSelect: { hp: 5, message: 'Mother gave you a healing salve! +5 HP' } }),
			]
		),
		village_lore: node('village_lore',
			'Willowmere has been here for two hundred years. Founded by a merchant named Aldric Willowmere who got spectacularly lost on the way to the capital and decided "this is fine." We\'re a farming village mostly, though ever since the dungeon appeared, we get the occasional adventurer passing through.',
			[
				opt('Any adventurers I should know about?', 'adventurers', '#ff4'),
				opt('What do the villagers think of the dungeon?', 'villager_opinion', '#8cf'),
				opt('Let\'s talk about something else.', 'start', '#fff'),
			]
		),
		adventurers: node('adventurers',
			'Most don\'t stay long. Either the dungeon takes them or they leave for easier pickings. But there was one \u2014 a mage called Thessaly. She reached level ten and came back raving about "the eye that watches from below." We thought she\'d gone mad. Then she went back in and the dungeon... it GREW. Added two more levels overnight, like it was hungry for her.',
			[
				opt('The dungeon can grow?!', 'dungeon_grows', '#f44'),
				opt('That\'s terrifying. I should prepare.', 'farewell', '#0ff'),
			]
		),
		dungeon_grows: node('dungeon_grows',
			'Some say it feeds on the souls of adventurers. Others say it\'s a living thing, sleeping underground, and each floor is a dream it\'s having. Old Maren had a theory it was a prison for something ancient, and the floors are locks. The deeper you go, the more locks you open. I try not to think about what\'s at the bottom.',
			[
				opt('Well, now I HAVE to find out.', 'farewell', '#4f4'),
				opt('Maybe I should reconsider this whole thing.', 'reconsider', '#f44'),
			]
		),
		reconsider: node('reconsider',
			'*Her eyes light up.* Really?! You\'ll stay?! We can bake pies and tend the garden and \u2014 *She sees your face.* ...you\'re joking, aren\'t you.',
			[
				opt('Sorry, Mom. Adventure calls.', 'farewell', '#4f4'),
			]
		),
		villager_opinion: node('villager_opinion',
			'Mixed feelings. The dungeon brought trade \u2014 adventurers buy supplies, sell strange trinkets. But it also brought monsters. We lose a chicken coop about once a month to wandering slimes. And every full moon, something HOWLS from the entrance. The village council voted to seal it up three times. The entrance was back by morning each time.',
			[
				opt('It can\'t be sealed?', 'unsealable', '#f44'),
				opt('Let\'s talk about something else.', 'start', '#fff'),
			]
		),
		unsealable: node('unsealable',
			'Nope. Your father tried dynamite once. DYNAMITE. The rubble rearranged itself into a neat little archway by dawn. The dungeon even added a welcome mat. Well, it was a flat rock with scratch marks, but your father swears it said "WELCOME."',
			[
				opt('That\'s actually hilarious.', 'farewell', '#4f4'),
			]
		),
		checkin: node('checkin',
			'*She hugs you tightly.* I\'m glad. Don\'t forget to eat. And watch out for slimes \u2014 they ruin EVERYTHING. Do you know how hard it is to get slime residue out of armor? Three days of scrubbing. THREE DAYS.',
			[
				opt('I\'ll avoid the slimes, Mother.', 'farewell', '#4f4'),
			]
		),
		farewell: node('farewell',
			'Be safe out there, my dear. The light of Willowmere will always guide you home.',
			[
				opt('[Leave conversation]', '__exit__', '#0ff'),
			]
		),
	}
};

// ─── VILLAGE: FATHER ───

export const FATHER_DIALOGUE: DialogueTree = {
	startNode: 'start',
	returnNode: 'return',
	nodes: {
		start: node('start',
			'*He looks up from polishing a worn blade.* So. Today\'s the day, is it? I can see it in your eyes. Same look I had at your age. Foolish. Brave. Mostly foolish.',
			[
				opt('I\'m ready, Father.', 'ready', '#4f4'),
				opt('Tell me about the dungeon.', 'dungeon_tips', '#ff4'),
				opt('I heard you were an adventurer.', 'his_past', '#8cf'),
				opt('Do you have any gear for me?', 'give_sword', '#ff4'),
				opt('Goodbye, Father.', 'farewell', '#0ff'),
			]
		),
		return: node('return',
			'*He nods.* Still alive. Good. Your mother would have killed ME if you\'d died.',
			[
				opt('Any combat advice?', 'combat_tips', '#ff4'),
				opt('Tell me about your adventuring days.', 'his_past', '#8cf'),
				opt('Just saying hello.', 'hello', '#4f4'),
				opt('Goodbye, Father.', 'farewell', '#0ff'),
			]
		),
		ready: node('ready',
			'No one\'s ever truly ready. But you\'re closer than most. You\'ve got good instincts \u2014 you get that from me. And common sense \u2014 you get that from your mother. Together, those might keep you alive past level two.',
			[
				opt('Only level two?', 'level_two', '#ff4'),
				opt('I\'ll take those odds.', 'farewell', '#4f4'),
			]
		),
		level_two: node('level_two',
			'*He grins.* I\'m being generous. Level one has rats and bats. Easy. Level two has goblins. Annoying but manageable. Level three... *His smile fades.* Level three has things that hunt in the dark. Things that learn your patterns. Don\'t fall into a rhythm down there. Predictability gets you killed.',
			[
				opt('That\'s actually useful advice.', 'more_tips', '#ff4'),
				opt('What happened to you on level three?', 'level_three_story', '#8cf'),
			]
		),
		dungeon_tips: node('dungeon_tips',
			'First rule: the dungeon cheats. Walls move when you\'re not looking. Floors drop out. Treasure chests bite. Second rule: everything is trying to kill you, even the things that look friendly. ESPECIALLY the things that look friendly. Third rule: always check for traps. ALWAYS.',
			[
				opt('Tell me about the traps.', 'traps_info', '#ff4'),
				opt('Treasure chests... bite?', 'mimics', '#f44'),
				opt('Any specific combat advice?', 'combat_tips', '#ff4'),
				opt('Thanks for the tips.', 'farewell', '#0ff'),
			]
		),
		traps_info: node('traps_info',
			'Spike traps, poison darts, alarm bells that summon every creature on the floor, and teleportation plates that drop you into the middle of a monster convention. I lost my favorite hat to a teleport trap. Ended up on a different level entirely. Never found the hat. Still bitter about it.',
			[
				opt('Sorry about your hat.', 'hat', '#4f4', { onSelect: { mood: 'amused' } }),
				opt('How do I spot them?', 'spot_traps', '#ff4'),
			]
		),
		hat: node('hat',
			'It was a REALLY good hat. Brown leather, wide brim, had a feather from a phoenix hawk. If you find it down there \u2014 level three, probably \u2014 you bring it back. That\'s more important than any treasure.',
			[
				opt('I\'ll keep an eye out.', 'farewell', '#4f4'),
			]
		),
		spot_traps: node('spot_traps',
			'Look for irregularities in the floor. Discolored stones, slight depressions, suspiciously clean areas in an otherwise filthy dungeon. Use the Search action when you suspect traps nearby. Rogues are naturally better at it, but anyone with patience can spot them.',
			[
				opt('Good to know. Thanks.', 'farewell', '#4f4'),
				opt('Any other tips?', 'combat_tips', '#ff4'),
			]
		),
		mimics: node('mimics',
			'*He shudders.* Mimics. Living treasure chests with teeth. They sit perfectly still until you reach for the loot, then CHOMP. Lost a good pair of gloves to one. And three fingers. *He holds up his left hand. All fingers present.* ...they grew back. Healing potions are miraculous. But the EMOTIONAL damage was permanent.',
			[
				opt('How do I tell a mimic from a real chest?', 'mimic_tell', '#ff4'),
				opt('Your fingers grew back from a potion?!', 'fingers', '#8cf'),
			]
		),
		mimic_tell: node('mimic_tell',
			'You don\'t. That\'s the fun part. Just open every chest and be ready to fight. Or be a rogue \u2014 they can sense them somehow. Thieves\' intuition, they call it. I call it "being annoyingly perceptive."',
			[
				opt('Noted. Be ready to fight chests.', 'farewell', '#4f4'),
			]
		),
		fingers: node('fingers',
			'Don\'t get too excited. High-quality potions only. The cheap ones just stop the bleeding. The REALLY cheap ones are just colored water. I once bought a "Potion of Greater Healing" from a traveling merchant that turned out to be beet juice. Tasted terrible. Did nothing. The merchant, however, was mysteriously found dangling from a tree the next morning. Unrelated, I\'m sure.',
			[
				opt('Father, did you...?', 'deny', '#f44'),
			]
		),
		deny: node('deny',
			'*He polishes his sword very intently.* I have no idea what you\'re implying. Anyway! The dungeon! Very dangerous! You should prepare!',
			[
				opt('Right. The dungeon. Of course.', 'farewell', '#4f4'),
			]
		),
		combat_tips: node('combat_tips',
			'Rule one: don\'t get surrounded. Fight in corridors where they can only come at you one at a time. Rule two: know when to run. Dead heroes are just corpses with good PR. Rule three: sleeping enemies are a gift. Sneak up and hit them for double damage. Rule four: bosses appear every five levels. They don\'t play fair, so neither should you.',
			[
				opt('Double damage on sleeping enemies?', 'sneak_attacks', '#ff4'),
				opt('Tell me about the bosses.', 'bosses', '#f44'),
				opt('What about using abilities?', 'abilities_tip', '#ff4'),
				opt('Solid advice. Thanks.', 'farewell', '#0ff'),
			]
		),
		sneak_attacks: node('sneak_attacks',
			'If a creature is sleeping and you strike first, you hit with twice the force. The element of surprise is the most powerful weapon in any dungeon. But be careful \u2014 moving adjacent to a sleeping enemy wakes them up. You need to approach from the attack angle. No fumbling around.',
			[
				opt('I\'ll be stealthy.', 'farewell', '#4f4'),
				opt('Any other combat tips?', 'more_tips', '#ff4'),
			]
		),
		bosses: node('bosses',
			'Every fifth floor has a boss. Nastier, tougher, meaner than anything else on that level. The first one I faced was a Troll Berserker. Took me forty minutes and every potion I had. They also block fleeing \u2014 once you\'re in, you\'re committed. Make sure you\'re fully healed before you enter a boss floor.',
			[
				opt('Forty minutes?!', 'forty_min', '#f44'),
				opt('Can\'t flee from bosses. Got it.', 'farewell', '#4f4'),
			]
		),
		forty_min: node('forty_min',
			'It FELT like forty minutes. Might have been four. Time gets weird when something twice your size is trying to eat your head. The point is: bosses are serious business. Don\'t be a hero. Well, DO be a hero, but be a SMART hero.',
			[
				opt('A smart hero. Got it.', 'farewell', '#4f4'),
			]
		),
		more_tips: node('more_tips',
			'Use the environment. Lava pools and poison gas hurt enemies too. Lead them through hazards. Defend when you\'re outnumbered \u2014 it doubles your block and dodge. And for the love of all that\'s holy, use your class ability. I\'ve seen adventurers forget they have special powers and just flail around with their sword.',
			[
				opt('I won\'t forget.', 'farewell', '#4f4'),
			]
		),
		abilities_tip: node('abilities_tip',
			'Every class has a unique talent. Warriors can whirlwind attack everything nearby. Mages can blink to safety. Rogues can go invisible. Use them. They have cooldowns, so timing matters. Don\'t blow your whirlwind on one rat and then get swarmed by five goblins.',
			[
				opt('I\'ll use them wisely.', 'farewell', '#4f4'),
			]
		),
		his_past: node('his_past',
			'*He leans back.* Aye, I was. Twenty years ago. Before the belly and the bad knee. I cleared the first three floors of the Dungeon of Shadows when it first appeared. Was going to go deeper, but then your mother told me you were on the way and... well. Some treasures are worth more than gold.',
			[
				opt('What was the scariest thing you faced?', 'scary', '#f44'),
				opt('Why only three floors?', 'three_floors', '#ff4'),
				opt('That\'s sweet, Father.', 'sweet_dad', '#4f4'),
				opt('Let\'s talk about something else.', 'start', '#fff'),
			]
		),
		scary: node('scary',
			'*His eyes go distant.* On the third floor, there\'s a room. Just a room. No monsters, no traps. Just a chair facing a mirror. I sat in that chair and the mirror showed me... things. Possible futures. Most of them bad. One showed me dying alone in the dark on level thirteen. Another showed me growing old with your mother, watching you grow up. I chose the second one. Walked out and never went back.',
			[
				opt('...that\'s intense.', 'intense', '#fff'),
				opt('The dungeon shows you visions?', 'visions', '#8cf'),
			]
		),
		intense: node('intense',
			'The dungeon isn\'t just a place. It\'s... aware. It tests you. Not just your sword arm, but your resolve. Remember that when you\'re down there. It will try to break you in ways that have nothing to do with combat.',
			[
				opt('I\'ll stay strong.', 'farewell', '#4f4'),
			]
		),
		visions: node('visions',
			'Some kind of ancient magic. Maren called it a "psychic resonance field." I call it "deeply upsetting." The deeper you go, the more the dungeon gets inside your head. Keep your wits about you.',
			[
				opt('I will. Thank you, Father.', 'farewell', '#4f4'),
			]
		),
		three_floors: node('three_floors',
			'Because level three nearly killed me. Twice. And then your mother told me about you, and suddenly the dungeon didn\'t seem so important. *He pauses.* I sometimes wonder what I missed. What\'s on level four, level five, the deeper floors. But then I look at you and I don\'t wonder anymore.',
			[
				opt('I\'ll see what\'s down there for both of us.', 'farewell', '#4f4'),
			]
		),
		sweet_dad: node('sweet_dad',
			'*He coughs gruffly.* Don\'t tell anyone I said that. I have a reputation to maintain. I\'m supposed to be the tough, silent type. Your mother has already ruined that by telling everyone about the time I cried at a sunset.',
			[
				opt('Your secret is safe with me.', 'farewell', '#4f4'),
			]
		),
		level_three_story: node('level_three_story',
			'I encountered something on level three that I\'ve never been able to explain. A shadow that moved independently of anything casting it. It didn\'t attack. It just... watched. Followed me through three rooms. When I turned to face it, it spoke. One word. My name. Then it vanished. I left the dungeon that night and didn\'t sleep for a week.',
			[
				opt('What do you think it was?', 'shadow_theory', '#8cf'),
				opt('I should be prepared for anything.', 'farewell', '#4f4'),
			]
		),
		shadow_theory: node('shadow_theory',
			'Maren had a theory that the dungeon creates echoes of everyone who enters. Ghost copies that linger in the walls. If that\'s true, there\'s a shadow of me still wandering level three. And soon there will be one of you. Try not to think about it too hard. I certainly don\'t. *He clearly thinks about it very hard.*',
			[
				opt('...let\'s change the subject.', 'start', '#fff'),
				opt('I should get going.', 'farewell', '#0ff'),
			]
		),
		give_sword: node('give_sword',
			'*He holds out a battered but well-maintained sword.* This blade has seen things you wouldn\'t believe. Goblin blood, spider ichor, and that one time I used it to slice cheese at a picnic. Your mother was NOT impressed. But it\'s sturdy and sharp, and it\'ll serve you well.',
			[
				opt('Thank you, Father. [Take the sword]', 'after_sword', '#4f4', { onSelect: { atk: 1, message: 'Father gave you his old sword! +1 ATK' } }),
				opt('Are you sure? It means a lot to you.', 'sure_sword', '#fff'),
			]
		),
		sure_sword: node('sure_sword',
			'It\'s a SWORD, not a family pet. It\'s meant to be used, not mounted on a wall. Take it before I change my mind and use it to cut more cheese.',
			[
				opt('Alright, alright. [Take the sword]', 'after_sword', '#4f4', { onSelect: { atk: 1, message: 'Father gave you his old sword! +1 ATK' } }),
			]
		),
		after_sword: node('after_sword',
			'*He watches you take it, something unreadable in his eyes.* That sword saved my life eleven times. I counted. May it save yours just as many. ...maybe more. Twelve would be nice. A round dozen.',
			[
				opt('Twelve lives. I\'ll aim for that.', 'farewell', '#4f4'),
				opt('Can we talk more?', 'return', '#fff'),
			]
		),
		hello: node('hello',
			'*He grunts.* You don\'t need to check on me. I\'m fine. Just sitting here. Definitely not worrying. Warriors don\'t worry. *He glances anxiously at the dungeon entrance.*',
			[
				opt('You\'re totally worrying.', 'worry_admit', '#4f4'),
				opt('Right. I\'ll be going then.', 'farewell', '#0ff'),
			]
		),
		worry_admit: node('worry_admit',
			'...maybe a LITTLE. But only because the dungeon is extremely dangerous and you\'re my only child and I love you and \u2014 *He coughs.* I mean. Be careful. Or whatever.',
			[
				opt('Love you too, Dad.', 'farewell', '#4f4'),
			]
		),
		farewell: node('farewell',
			'Give \'em hell, kid. And come back in one piece. Preferably with all your fingers.',
			[
				opt('[Leave conversation]', '__exit__', '#0ff'),
			]
		),
	}
};

// ─── TAVERN: BARKEEP ───

export const BARKEEP_DIALOGUE: DialogueTree = {
	startNode: 'start',
	returnNode: 'return',
	nodes: {
		start: node('start',
			'Welcome to The Rusty Flagon! Best ale in Willowmere. Admittedly, also the ONLY ale in Willowmere. But still! What can I get ya?',
			[
				opt('I\'ll take a drink. [Accept heal]', 'drink', '#4f4', { onSelect: { hp: 3, message: 'The Barkeep pours you a drink! +3 HP' } }),
				opt('Tell me about the dungeon below.', 'dungeon', '#ff4'),
				opt('Heard any good rumors lately?', 'rumors_menu', '#ff4'),
				opt('Who are the other patrons?', 'patrons', '#8cf'),
				opt('Nice place you\'ve got here.', 'tavern_story', '#8cf'),
				opt('Just passing through.', 'farewell', '#0ff'),
			]
		),
		return: node('return',
			'Back for another round? You look like you could use it. The dungeon tends to do that to people.',
			[
				opt('Any news while I was gone?', 'news', '#ff4'),
				opt('Heard any rumors?', 'rumors_menu', '#ff4'),
				opt('Tell me about the dungeon.', 'dungeon', '#ff4'),
				opt('Just need a moment to rest.', 'rest', '#4f4'),
				opt('See you later, Barkeep.', 'farewell', '#0ff'),
			]
		),
		drink: node('drink',
			'*He pours a dark amber liquid.* House special. Made with hops from the fields south of here and a secret ingredient I\'ll take to my grave. *He leans in.* It\'s cinnamon. Please don\'t tell anyone. It would ruin my mystique.',
			[
				opt('Your secret is safe. What\'s the dungeon like?', 'dungeon', '#ff4'),
				opt('Who\'s that hooded figure in the corner?', 'about_stranger', '#8cf'),
				opt('Thanks for the drink.', 'farewell', '#0ff'),
			]
		),
		dungeon: node('dungeon',
			'Ah, the dungeon. My best customer and worst enemy. It brings adventurers through my door, which is great for business. It also occasionally spawns creatures that eat my customers, which is terrible for business. Lost three regular patrons last month. Well, two. One of them just stopped paying his tab and I ASSUME a monster got him.',
			[
				opt('Any tips for surviving down there?', 'dungeon_tips', '#ff4'),
				opt('Has anyone gone deep and returned?', 'deep_explorers', '#8cf'),
				opt('That\'s... troubling. Let\'s change topics.', 'start', '#fff'),
			]
		),
		dungeon_tips: node('dungeon_tips',
			'Keep your HP up. Sounds obvious, but you\'d be amazed how many adventurers think "I\'ll heal AFTER the next fight." There is no "after" if you\'re dead. Grab every potion you see. Check every chest. And if something looks too good to be true, it\'s a mimic. Or a trap. Or both, on the really bad floors.',
			[
				opt('Sound advice.', 'farewell', '#4f4'),
				opt('What about the bosses?', 'boss_info', '#f44'),
			]
		),
		boss_info: node('boss_info',
			'Every five floors, there\'s a nasty piece of work guarding the stairs. Can\'t flee from \'em. Can\'t sneak past \'em. You just have to hit them until they stop moving, and pray they stop before you do. Stock up on potions before those floors. Every adventurer who listens to that advice comes back. Well. Most of them.',
			[
				opt('How encouraging.', 'farewell', '#4f4'),
			]
		),
		deep_explorers: node('deep_explorers',
			'There was a group of five adventurers about ten years ago. Called themselves the Silver Delvers. Professional outfit. Matching cloaks. A TEAM NAME. They made it to level fifteen. Four came back. The fifth \u2014 their mage, Thessaly \u2014 she stayed behind. Said she\'d found "the truth." The other four never spoke about what happened down there. One of them drinks here every night. *He glances at the drunk patron.*',
			[
				opt('That drunk was a Silver Delver?!', 'drunk_past', '#f44'),
				opt('What truth did Thessaly find?', 'thessaly', '#8cf'),
				opt('Heavy stuff. Let\'s talk about something lighter.', 'start', '#fff'),
			]
		),
		drunk_past: node('drunk_past',
			'Garvus. Best swordsman I ever saw, once upon a time. Now the best drinker. Whatever he saw on level fifteen broke something in him. He won\'t talk about it sober. Sometimes when he\'s REALLY deep in his cups, he mutters about "the eye" and "the dreaming thing below." Then he falls asleep and snores like a bear with allergies.',
			[
				opt('The eye... sounds like something I should know about.', 'the_eye', '#f44'),
				opt('Poor Garvus.', 'farewell', '#4f4'),
			]
		),
		the_eye: node('the_eye',
			'*The Barkeep lowers his voice.* Look, I don\'t pretend to understand any of this arcane nonsense. But every adventurer who goes past level ten mentions it. An eye. Watching from the dark. Not a creature\'s eye. Something bigger. Something that\'s been there since before the dungeon existed. Some folk say the dungeon grew AROUND it. Like a pearl around a grain of sand. Except the grain of sand wants to consume all of reality.',
			[
				opt('...and I\'m going DOWN there?', 'going_down', '#f44'),
				opt('I need another drink.', 'farewell', '#4f4'),
			]
		),
		going_down: node('going_down',
			'*He shrugs.* Everyone has their reasons. Glory, gold, curiosity, a death wish. Sometimes all four. I just serve the drinks and try not to think about what\'s under my floorboards. Now, can I interest you in some food? I make a mean stew. Secret ingredient is \u2014 actually, I\'ll keep this one to myself.',
			[
				opt('I should go prepare.', 'farewell', '#0ff'),
			]
		),
		thessaly: node('thessaly',
			'Nobody knows for sure. Thessaly was brilliant \u2014 could read languages that had been dead for a thousand years. Some say she found an ancient library on level fifteen. Others say she found something that SPOKE to her. All I know is, the night she stayed behind, the dungeon grew three additional floors. Like it was... celebrating.',
			[
				opt('Celebrating? That\'s horrifying.', 'farewell', '#4f4'),
			]
		),
		about_stranger: node('about_stranger',
			'The hooded one? Been coming here for... actually, I can\'t remember when they started. Feels like they\'ve always been here. Pays in gold that\'s warm to the touch. Never eats. Never removes the hood. Knows things about the dungeon that nobody should know. I stopped asking questions after they predicted \u2014 correctly \u2014 that my cat would knock over the ale barrel on a Tuesday. Specific Tuesday. Specific barrel.',
			[
				opt('That\'s... oddly specific.', 'stranger_more', '#8cf'),
				opt('I should talk to them directly.', 'farewell', '#0ff'),
			]
		),
		stranger_more: node('stranger_more',
			'Between you and me, I think they\'re not entirely human. The gold they pay with has symbols I\'ve never seen. And once, late at night, when they thought no one was looking, I saw their eyes glow. Not metaphorically. ACTUALLY GLOW. Blue. Like dungeon fire. I charged them double for drinks after that.',
			[
				opt('Brave of you.', 'farewell', '#4f4'),
			]
		),
		patrons: node('patrons',
			'We\'ve got the usual crowd. Garvus \u2014 the drunk at the table, nursing his seventeenth ale. The hooded stranger in the corner who\'s been here since before I bought the place. And occasionally we get adventurers like yourself, looking for liquid courage before the descent.',
			[
				opt('Tell me about Garvus.', 'drunk_past', '#8cf'),
				opt('Tell me about the hooded stranger.', 'about_stranger', '#8cf'),
				opt('Interesting crowd.', 'farewell', '#4f4'),
			]
		),
		tavern_story: node('tavern_story',
			'Built this place with my own hands! Well, I bought it from old Merton who built it with HIS hands. But I repainted! The name "Rusty Flagon" came from the first mug I found behind the bar when I moved in. It was rusty. It was a flagon. I\'m not a creative man, but I am an honest one.',
			[
				opt('I appreciate the honesty.', 'farewell', '#4f4'),
				opt('How\'s business?', 'business', '#8cf'),
			]
		),
		business: node('business',
			'Dungeon-adjacent tavern? Business is either feast or famine. Literally. When a big adventuring party comes through, I\'m rolling in gold. When the dungeon has a "surge" and monsters wander up, I\'m boarding windows and praying. Last surge, a slime dissolved my front door. Do you know how much doors cost? MORE THAN YOU\'D THINK.',
			[
				opt('I\'ll try to keep the monsters in the dungeon.', 'farewell', '#4f4'),
			]
		),
		news: node('news',
			'Word is the dungeon\'s been more active lately. More creatures on the upper floors. Stronger ones too. Something\'s stirring down in the deep. The hooded stranger has been muttering about "the alignment" and "the convergence." Whatever that means. Probably nothing good for my door.',
			[
				opt('I\'ll investigate.', 'farewell', '#4f4'),
			]
		),
		rest: node('rest',
			'Take all the time you need. The dungeon isn\'t going anywhere. Unfortunately.',
			[
				opt('[Leave conversation]', '__exit__', '#0ff'),
			]
		),
		farewell: node('farewell',
			'Good luck down there. And if you find any rare ingredients, bring \'em back! I\'m always looking to improve the menu.',
			[
				opt('[Leave conversation]', '__exit__', '#0ff'),
			]
		),
		rumors_menu: node('rumors_menu',
			'*He leans on the bar conspiratorially.* Rumors? This tavern runs on rumors. They\'re eighty percent of my business — people come in to gossip, stay for the ale, and leave their coin purses. What do you want to hear about?',
			[
				opt('What about secret passages?', 'rumor_secrets', '#ff4', { once: true }),
				opt('Anything about treasure chests?', 'rumor_mimics', '#ff4', { once: true }),
				opt('Tell me about the bosses.', 'rumor_bosses', '#ff4', { once: true }),
				opt('Give me the wildest rumor you\'ve got.', 'rumor_wild', '#ff4', { once: true }),
				opt('That\'s enough gossip.', 'start', '#0ff'),
			]
		),
		rumor_secrets: node('rumor_secrets',
			'*He drops his voice.* You didn\'t hear this from me, but... the dungeon has secret rooms. Hidden behind walls that look solid. Old Maren \u2014 rest her soul \u2014 used to say you can feel the draft near the hidden passages. Stay alert near dead ends. Press your hand against the stone. Sometimes it gives. *He taps his nose.* That one\'s free. Next rumor costs a drink.',
			[
				opt('Good to know. [Rumor learned]', 'rumors_menu', '#4f4', { onSelect: { rumor: RUMORS.secret_walls } }),
			]
		),
		rumor_mimics: node('rumor_mimics',
			'Oh, the chests. Yes. Not all chests are... chests. Some of them are alive. Mimics, they call them. Nasty things. They look exactly like a treasure chest until you open them, and then suddenly you\'re fighting furniture. Gold chests are the worst \u2014 they\'re the most convincing disguise. Lost a customer to one last week. He said "Ooh, shiny!" and it was the last thing he ever said.',
			[
				opt('I\'ll watch out for that. [Rumor learned]', 'rumors_menu', '#4f4', { onSelect: { rumor: RUMORS.mimics } }),
			]
		),
		rumor_bosses: node('rumor_bosses',
			'Every five levels, something BIG shows up. Something that doesn\'t just wander the halls \u2014 something that OWNS the floor. I\'ve heard adventurers call them floor bosses. They\'re tougher, meaner, and they don\'t let you run. A warrior came back from level five missing an arm and said the boss "politely requested" he leave. By throwing him through a wall.',
			[
				opt('Every five levels. Got it. [Rumor learned]', 'rumors_menu', '#4f4', { onSelect: { rumor: RUMORS.boss_every_five } }),
			]
		),
		rumor_wild: node('rumor_wild',
			'*He grins.* Alright, here\'s one from the drunk in the corner \u2014 he swears that if you compliment a Mimic on the quality of its woodwork, it\'ll stop attacking and become your friend. Says he "tamed" one on level four. Named it Chester. *The Barkeep rolls his eyes.* Chester ate two people last week. I don\'t think the compliments are working.',
			[
				opt('I\'ll... keep that in mind. [Rumor learned]', 'rumors_menu', '#ff4', { onSelect: { rumor: RUMORS.friendly_mimics } }),
			]
		),
	}
};

// ─── TAVERN: HOODED STRANGER ───

export const STRANGER_DIALOGUE: DialogueTree = {
	startNode: 'start',
	returnNode: 'return',
	nodes: {
		start: node('start',
			'*The figure\'s face is hidden in shadow, but you sense eyes studying you.* Ah. Another seeker. The dungeon has been expecting you. Yes... you specifically.',
			[
				opt('Expecting me? What do you mean?', 'expecting', '#ff4'),
				opt('What do you know about the dungeon?', 'dungeon_knowledge', '#ff4'),
				opt('Do you know any secrets?', 'stranger_rumors', '#ff4'),
				opt('Who are you?', 'identity', '#8cf'),
				opt('You\'re a little creepy, you know that?', 'creepy', '#f44'),
				opt('Nevermind.', 'farewell', '#0ff'),
			]
		),
		return: node('return',
			'*The stranger tilts their head.* You return. The dungeon\'s mark is stronger on you now. I can smell the shadow on you.',
			[
				opt('What do you mean, the dungeon\'s mark?', 'mark', '#f44'),
				opt('Tell me about the deeper levels.', 'deep_levels', '#ff4'),
				opt('Know any useful secrets?', 'stranger_rumors', '#ff4'),
				opt('Any new insights?', 'insights', '#8cf'),
				opt('I need to go.', 'farewell', '#0ff'),
			]
		),
		expecting: node('expecting',
			'The dungeon is not merely a place. It is a living thing. A dreaming thing. And it dreams of those who will enter. I have seen your face in the patterns of the walls. Your name is written in the arrangement of its corridors. This is not coincidence. This is invitation.',
			[
				opt('That\'s deeply unsettling.', 'unsettling', '#f44'),
				opt('If it invited me, maybe it\'ll go easy on me?', 'go_easy', '#4f4'),
				opt('How do you know all this?', 'identity', '#8cf'),
			]
		),
		unsettling: node('unsettling',
			'Truth often is. The dungeon does not deceive \u2014 it merely reveals what has always been true. You were always going to come here. You were always going to descend. The only question is how far you go before you understand why.',
			[
				opt('Why? Why am I supposed to go?', 'the_why', '#ff4'),
				opt('I need to think about this.', 'farewell', '#0ff'),
			]
		),
		the_why: node('the_why',
			'*Their eyes flash blue beneath the hood.* That is a question the dungeon itself will answer. Not I. I am merely... a signpost. A finger pointing at the moon. Do not stare at the finger. *They wiggle a finger demonstratively.* Stare at the dungeon.',
			[
				opt('Did you just quote philosophy at me?', 'philosophy', '#4f4'),
				opt('Right. Into the dungeon, then.', 'farewell', '#0ff'),
			]
		),
		philosophy: node('philosophy',
			'I am very old and have read many books. It was inevitable. You should try the dungeon\'s library on level fifteen. Excellent collection. Terrible late fees, though. *Is that a joke? It\'s hard to tell under the hood.*',
			[
				opt('There\'s a LIBRARY in the dungeon?!', 'library', '#8cf'),
				opt('I think you might be insane.', 'insane', '#f44'),
			]
		),
		library: node('library',
			'Of sorts. The dungeon collects knowledge as it collects souls. Every adventurer who enters adds to its understanding. Every secret whispered in its halls is recorded. By level fifteen, the walls are covered in text. The history of every person who ever set foot inside. Some adventurers go there specifically to read about themselves. Most do not enjoy what they find.',
			[
				opt('That\'s terrifying and fascinating.', 'farewell', '#4f4'),
			]
		),
		insane: node('insane',
			'*A soft laugh from under the hood.* Perhaps. Sanity is a luxury the dungeon does not afford. But my madness is useful madness. I know things. Secret walls that hide treasure rooms. Boss creatures and their weaknesses. The rhythm of the dungeon\'s heartbeat. Would you like to know these things, or would you prefer to question my mental health?',
			[
				opt('Tell me about secret walls.', 'secrets', '#ff4'),
				opt('Tell me about bosses.', 'boss_info', '#f44'),
				opt('Fair point. I\'m listening.', 'dungeon_knowledge', '#ff4'),
			]
		),
		go_easy: node('go_easy',
			'*An unsettling chuckle.* The dungeon does not "go easy." It does not show mercy or kindness. It shows truth. And truth has teeth.',
			[
				opt('Good talk. Very comforting.', 'farewell', '#4f4'),
			]
		),
		dungeon_knowledge: node('dungeon_knowledge',
			'What would you like to know? I have spent... a long time... studying its patterns.',
			[
				opt('Tell me about the boss creatures.', 'boss_info', '#f44'),
				opt('Tell me about secret walls.', 'secrets', '#ff4'),
				opt('Tell me about the deepest levels.', 'deep_levels', '#8cf'),
				opt('I think I know enough.', 'farewell', '#0ff'),
			]
		),
		boss_info: node('boss_info',
			'Every fifth floor, a guardian. They are not random creatures \u2014 they are CHOSEN by the dungeon. Shaped and empowered to test those who descend. The first is merely strong. The second, cunning. By the third... the bosses become strange. Altered. They speak. They bargain. Some adventurers have been offered power in exchange for... well. Best not to accept offers from dungeon bosses.',
			[
				opt('Bosses that talk? And bargain?', 'talking_bosses', '#f44'),
				opt('Good to know. What else?', 'dungeon_knowledge', '#ff4'),
			]
		),
		talking_bosses: node('talking_bosses',
			'The dungeon learns from every adventurer. By the deep levels, it knows how to tempt. How to threaten. How to offer exactly what you want in exchange for exactly what you shouldn\'t give. The price is always the same: go deeper. Always deeper. It wants you at the bottom. What awaits there... *They trail off.* I have said too much.',
			[
				opt('What\'s at the bottom?!', 'bottom', '#f44'),
				opt('I understand. Thank you.', 'farewell', '#0ff'),
			]
		),
		bottom: node('bottom',
			'*Their voice drops to barely a whisper.* Something that has been sleeping since before this world had a name. Something that dreams the dungeon into existence. If it wakes... *They grip the table.* It must not wake. That is all I will say. Go. Descend. But descend with purpose, not with recklessness.',
			[
				opt('I\'ll be purposeful.', 'farewell', '#4f4'),
			]
		),
		secrets: node('secrets',
			'The dungeon hides rooms behind false walls. Walk near them and you may sense a draft, a whisper, the faintest shimmer. These secret rooms contain treasures the dungeon has hoarded. It does not hide them to keep them safe. It hides them as gifts for those perceptive enough to find them. The dungeon REWARDS cleverness.',
			[
				opt('It rewards cleverness but also tries to kill me?', 'paradox', '#ff4'),
				opt('I\'ll keep my eyes open.', 'farewell', '#4f4'),
			]
		),
		paradox: node('paradox',
			'A good teacher both challenges and rewards. The dungeon is the greatest teacher that has ever existed. It teaches survival. Courage. Sacrifice. And for some... it teaches truths about themselves they never wanted to know. *A pause.* Also, there are rats. Many rats. The educational metaphor breaks down somewhat with the rats.',
			[
				opt('The rats are a nice touch.', 'farewell', '#4f4'),
			]
		),
		identity: node('identity',
			'Who am I? *They lean back.* I am someone who has been to the bottom. Who has seen what sleeps below and chosen to return. Who waits here, in this tavern, drinking ale that I do not taste, to warn those who are about to make the same journey.',
			[
				opt('You\'ve been to the BOTTOM?', 'been_bottom', '#f44'),
				opt('You don\'t taste the ale?', 'no_taste', '#8cf'),
			]
		),
		been_bottom: node('been_bottom',
			'Once. Long ago. Or perhaps recently. Time is... complicated, where the dungeon is concerned. I was not the same when I returned. Parts of me stayed below. Parts of the below came back with me. The Barkeep charges me double because my gold glows. I think that\'s fair.',
			[
				opt('What\'s at the bottom?', 'bottom', '#f44'),
				opt('Are you even human?', 'human', '#8cf'),
			]
		),
		human: node('human',
			'*A long pause.* I was. I believe I still am. Mostly. The dungeon changes you, adventurer. Every floor you descend, you leave a piece of yourself behind. And the dungeon fills the gap with... something else. I\'ve descended too many times. The gaps are larger than what remains.',
			[
				opt('That\'s the saddest thing I\'ve ever heard.', 'sad', '#4f4'),
				opt('I should go.', 'farewell', '#0ff'),
			]
		),
		sad: node('sad',
			'*Something shifts under the hood. It might be a smile.* Sad? Perhaps. But I am still here. Still watching. Still warning. That counts for something. Now go, adventurer. The dungeon is patient, but it does not wait forever.',
			[
				opt('[Leave conversation]', '__exit__', '#0ff'),
			]
		),
		no_taste: node('no_taste',
			'One of many things I left in the dungeon. Taste. The ability to sleep. The specific memory of my mother\'s face. *A beat.* But I retained my sense of dramatic timing, which I consider a fair trade.',
			[
				opt('You are definitely the strangest person I\'ve met.', 'farewell', '#4f4'),
			]
		),
		creepy: node('creepy',
			'*Another soft laugh.* I have been told. Many times. By many adventurers. Most of whom are now dead. Not BECAUSE they called me creepy. That would be petty. The dungeon killed them. I merely watched.',
			[
				opt('That doesn\'t make it less creepy!', 'less_creepy', '#f44'),
				opt('Okay, I\'ll be nicer. What do you know?', 'dungeon_knowledge', '#ff4'),
			]
		),
		less_creepy: node('less_creepy',
			'I am aware. I have been working on my social skills for approximately three hundred years. Progress is slow.',
			[
				opt('THREE HUNDRED YEARS?!', 'identity', '#f44'),
				opt('I\'m going to go now.', 'farewell', '#0ff'),
			]
		),
		mark: node('mark',
			'Everyone who enters the dungeon carries a trace of it when they leave. Like perfume, but existential. The deeper you go, the stronger the scent. At your level, it is merely a whisper. By level ten, it will be a shout. By level twenty... the dungeon will know you better than you know yourself.',
			[
				opt('Can I get rid of it?', 'rid_mark', '#ff4'),
				opt('What happens then?', 'deep_levels', '#8cf'),
			]
		),
		rid_mark: node('rid_mark',
			'No. It is permanent. The dungeon does not give back what it takes. But it is not entirely a burden. The mark lets you sense things. Secret passages. Approaching danger. The rhythm of the dungeon\'s moods. Listen to it. It will serve you well.',
			[
				opt('I\'ll try to use it.', 'farewell', '#4f4'),
			]
		),
		deep_levels: node('deep_levels',
			'Below level ten, the dungeon stops pretending to be a place built by mortal hands. The architecture becomes... organic. Walls that pulse. Floors that breathe. Corridors that rearrange when you blink. Below level twenty, I am told that gravity becomes optional and time flows in circles. I would not know. I try not to go below level fifteen anymore. The library is enough for me.',
			[
				opt('You go BACK into the dungeon?', 'goes_back', '#f44'),
				opt('That sounds absolutely terrifying.', 'farewell', '#4f4'),
			]
		),
		goes_back: node('goes_back',
			'Where else would I go? I am a creature of the dungeon now, more than I am a creature of this world. The tavern is... a rest stop. A reminder of what "normal" feels like. But the dungeon calls. It always calls. You will learn this yourself, in time.',
			[
				opt('I should get moving.', 'farewell', '#0ff'),
			]
		),
		insights: node('insights',
			'The dungeon shifted last night. I felt it from here. Three new rooms on level seven. A collapse on level four. And something... woke up on level twelve. Something that has been sleeping for a very long time. Be cautious on the middle floors.',
			[
				opt('What woke up?', 'woke_up', '#f44'),
				opt('Thanks for the warning.', 'farewell', '#4f4'),
			]
		),
		woke_up: node('woke_up',
			'I do not know. And that frightens me. I know everything about this dungeon. Every creature, every trap, every secret. But this is new. The dungeon is creating something it has never created before. For you, perhaps. Or because of you. I am not certain which is worse.',
			[
				opt('Wonderful. Just wonderful.', 'farewell', '#4f4'),
			]
		),
		farewell: node('farewell',
			'*The stranger raises their untouched ale.* May you find what you seek. Or may it find you. In the dungeon, there is little difference.',
			[
				opt('[Leave conversation]', '__exit__', '#0ff'),
			]
		),
		stranger_rumors: node('stranger_rumors',
			'*The stranger steeples their fingers.* Secrets? I traffic in secrets. They are the only currency that appreciates in value. What would you like to know?',
			[
				opt('How do I survive the traps?', 'rumor_traps', '#ff4', { once: true }),
				opt('Tell me about potions in the dungeon.', 'rumor_potions', '#ff4', { once: true }),
				opt('Any combat tactics I should know?', 'rumor_corridors', '#ff4', { once: true }),
				opt('Tell me something... strange.', 'rumor_strange', '#ff4', { once: true }),
				opt('That\'s enough secrets for now.', 'start', '#0ff'),
			]
		),
		rumor_traps: node('rumor_traps',
			'*They lean forward, voice barely above a whisper.* The dungeon places traps with purpose, not randomness. Treasure attracts the greedy. Traps punish them. You will find the densest trap clusters near the most valuable rooms. Rogues have a sixth sense for them \u2014 their training attunes them to the subtle changes in air pressure and floor texture. If you are not a rogue... step carefully.',
			[
				opt('Traps near treasure. Noted. [Rumor learned]', 'stranger_rumors', '#4f4', { onSelect: { rumor: RUMORS.traps_near_treasure } }),
			]
		),
		rumor_potions: node('rumor_potions',
			'*They produce a small vial from within their cloak, hold it to the light, then make it vanish.* Healing potions are the difference between life and death below. The dungeon provides them generously on the upper levels \u2014 a kindness, or perhaps a strategy. It wants you comfortable. Dependent. Because on the deeper levels, the potions thin out. And by then, you need them more than ever. Never walk past one.',
			[
				opt('Never pass up a potion. Got it. [Rumor learned]', 'stranger_rumors', '#4f4', { onSelect: { rumor: RUMORS.potions_matter } }),
			]
		),
		rumor_corridors: node('rumor_corridors',
			'*They trace a narrow rectangle on the bar with one finger.* The dungeon\'s corridors are your greatest ally. A single-file passage negates numerical superiority. Ten goblins in a corridor? You fight them one at a time. Ten goblins in an open room? You die. Geometry is the adventurer\'s most underappreciated weapon. Learn to love narrow spaces.',
			[
				opt('Use chokepoints. Smart. [Rumor learned]', 'stranger_rumors', '#4f4', { onSelect: { rumor: RUMORS.corridor_chokepoint } }),
			]
		),
		rumor_strange: node('rumor_strange',
			'*Their voice takes on an odd quality \u2014 distant, as if remembering something from very far away.* There is a word. An old word, from before the dungeon was built. Some say it was the Architects\' master key \u2014 a command word that could open any sealed passage. *They pause dramatically.* The word is "parsley." *A long silence.* I am joking, of course. Or am I? Try it on the next locked door you find. What\'s the worst that could happen?',
			[
				opt('...You\'re messing with me. [Rumor learned]', 'stranger_rumors', '#ff4', { onSelect: { rumor: RUMORS.dungeon_password } }),
			]
		),
	}
};

// ─── TAVERN: DRUNK PATRON (GARVUS) ───

export const DRUNK_DIALOGUE: DialogueTree = {
	startNode: 'start',
	returnNode: 'return',
	nodes: {
		start: node('start',
			'*He squints at you through bleary eyes.* Whaddya want? Can\'t you shee I\'m busy? *He gestures vaguely at seventeen empty mugs.*',
			[
				opt('I heard you used to be an adventurer.', 'adventurer', '#ff4'),
				opt('Tell me about the dungeon.', 'dungeon_drunk', '#ff4'),
				opt('Know any dungeon rumors?', 'drunk_rumors', '#ff4'),
				opt('Are you okay?', 'okay', '#4f4'),
				opt('Sorry to bother you.', 'farewell', '#0ff'),
			]
		),
		return: node('return',
			'*He blinks.* Oh. It\'sh YOU again. You\'re shtill alive? Impressive. Mosht people I talk to end up dead. Not becaushe of me! Jusht... statistically.',
			[
				opt('What can you tell me about the deeper levels?', 'deep_drunk', '#ff4'),
				opt('How are you holding up?', 'okay', '#4f4'),
				opt('Any advice for me?', 'advice', '#ff4'),
				opt('I\'ll leave you to it.', 'farewell', '#0ff'),
			]
		),
		adventurer: node('adventurer',
			'*He straightens up, suddenly lucid for a moment.* Used to be? I WAS Garvus the Bold. Silver Delvers, class of... of... *He counts on his fingers.* A while ago. We went to level fifteen. FIFTEEN. You know how many adventurersh make it to fifteen? *He holds up zero fingers.* Thish many. And then ush.',
			[
				opt('What happened on level fifteen?', 'level_fifteen', '#f44'),
				opt('The Silver Delvers? Tell me more.', 'silver_delvers', '#8cf'),
				opt('That\'s impressive.', 'farewell', '#4f4'),
			]
		),
		level_fifteen: node('level_fifteen',
			'*His eyes go wide and he grips his mug so hard his knuckles turn white.* The... the library. Wallsh covered in writing. Every adventurer\'sh shtory. I found MY name. Read my own future. It said... *He trails off.* It shaid I\'d shpend the resht of my life in a tavern, trying to forget what I shaw next.',
			[
				opt('What did you see next?', 'the_eye_drunk', '#f44', { onSelect: { mood: 'afraid' } }),
				opt('Maybe you should stop drinking.', 'stop_drinking', '#4f4'),
			]
		),
		the_eye_drunk: node('the_eye_drunk',
			'*He leans in, suddenly terrifyingly sober.* The Eye. Below the library. Below everything. An eye the size of a cathedral, embedded in the living rock. It wasn\'t looking at nothing. It was looking at ME. And it SMILED. Eyes don\'t smile. They CAN\'T smile. But this one did. And then it blinked, and Thessaly walked toward it like she was meeting an old friend, and we ran. We RAN.',
			[
				opt('Thessaly... the mage who stayed behind?', 'thessaly_drunk', '#f44'),
				opt('That\'s enough. I\'m sorry I asked.', 'sorry', '#4f4', { onSelect: { mood: 'sad' } }),
			]
		),
		thessaly_drunk: node('thessaly_drunk',
			'*Tears stream down his face.* She shaid she understood. She shaid the Eye showed her everything \u2014 the meaning of the dungeon, the meaning of EVERYTHING. She looked so happy. Happier than I\'d ever sheen anyone. And she just... walked into it. Into the pupil. Like walking through a door. And the Eye closhed. And she was gone. And the dungeon grew three floors that night, like it was... *hic* ...celebrating.',
			[
				opt('I\'m sorry, Garvus.', 'sorry', '#4f4'),
				opt('I\'ll find out what happened to her.', 'find_thessaly', '#ff4'),
			]
		),
		find_thessaly: node('find_thessaly',
			'*He grabs your arm with surprising strength.* Don\'t. Don\'t go looking for the Eye. It WANTS you to look. It WANTS you to understand. And if you understand... you won\'t come back either. Promise me. PROMISE me you won\'t go looking for it.',
			[
				opt('I promise. [You don\'t mean it.]', 'farewell', '#f44'),
				opt('I promise. [You mean it.]', 'farewell', '#4f4'),
				opt('I can\'t promise that.', 'cant_promise', '#fff'),
			]
		),
		cant_promise: node('cant_promise',
			'*He stares at you for a long moment, then laughs bitterly.* You shound jusht like her. Exactly like her. *He drains his mug.* The dungeon doesh love the brave onesh. Go, then. But remember what I told you. When the Eye looksh at you \u2014 and it WILL \u2014 remember that you can shtill walk away.',
			[
				opt('[Leave conversation]', '__exit__', '#0ff'),
			]
		),
		sorry: node('sorry',
			'*He waves his hand dismissively.* Don\'t be shorry. Be careful. The dungeon takesh what it wantsh and it wantsh everything. *He signals the barkeep.* Another round. On hish tab. *He points at you.*',
			[
				opt('[Leave conversation]', '__exit__', '#0ff'),
			]
		),
		silver_delvers: node('silver_delvers',
			'Five of us! Garvush the Bold \u2014 that\'sh me. Thessaly the Wise \u2014 our mage. Korrin Ironfisht \u2014 dwarf, punched everything. Lila Shadowshtep \u2014 rogue, could shteal the teeth from a dragon. And Brenn the Unfortunate \u2014 our healer. We called him Unfortunate because he had the WORSHT luck. Fell into every trap. Every. Single. One.',
			[
				opt('What happened to the rest of the Delvers?', 'other_delvers', '#8cf'),
				opt('Brenn fell into EVERY trap?', 'brenn', '#4f4'),
			]
		),
		brenn: node('brenn',
			'EVERY. ONE. Spike traps, poison darts, teleport padsh, alarm bellsh. Once he triggered four trapsh simultaneously. We didn\'t even know that was possible. The dungeon seemed personally offended by his exishtence. But he was the besht healer I ever shaw. Could fix a broken leg while falling down a pit trap. Very talented man.',
			[
				opt('Where is he now?', 'brenn_now', '#8cf'),
				opt('That\'s hilarious and tragic.', 'farewell', '#4f4'),
			]
		),
		brenn_now: node('brenn_now',
			'Retired to a monastery in the mountainsh. Became a monk. Shaid he needed "a life without surprishes." Fair enough, really. He shends me letters shometimes. Very peaceful. Very boring. I\'m jealous.',
			[
				opt('Maybe you should visit him.', 'visit', '#4f4'),
				opt('Tell me about the others.', 'other_delvers', '#8cf'),
			]
		),
		visit: node('visit',
			'*He looks at his hands.* Maybe shomeday. When the nightmaresh shtop. If they shtop. *He forces a smile.* But enough about old Garvush! You\'ve got a dungeon to conquer! Go be brave and shtupid! Mosht of the besht adventurersh are!',
			[
				opt('[Leave conversation]', '__exit__', '#0ff'),
			]
		),
		other_delvers: node('other_delvers',
			'Korrin went back to the dwarf citysh under the mountainsh. Shaid he\'d had enough of "shurface nonshensh." Lila... disappeared. Rogue to the end. Left a note that shaid "Gone fishing." Nobody believesh she\'sh actually fishing. Thessaly... *His face falls.* ...Thessaly shtayed in the dungeon. And me? I\'m here. Drinking.',
			[
				opt('What happened to Thessaly?', 'thessaly_drunk', '#f44'),
				opt('That\'s quite a group.', 'farewell', '#4f4'),
			]
		),
		dungeon_drunk: node('dungeon_drunk',
			'*He leans in conspiratorially.* The dungeon. THE DUNGEON. Lemme tell you shomething about that place. The wallsh have SHECRETSH. You walk pasht \'em and they look like normal wallsh but they\'re NOT. Shome of them are hollow. Treasshure behind \'em. *He taps his nose.* Garvush knowsh.',
			[
				opt('Secret walls? How do I find them?', 'secret_walls', '#ff4'),
				opt('What else do you know?', 'more_drunk_tips', '#ff4'),
				opt('Thanks for the tip.', 'farewell', '#4f4'),
			]
		),
		secret_walls: node('secret_walls',
			'Walk near \'em! Jusht... walk near every wall. The game \u2014 I mean, the DUNGEON \u2014 will tell you when you shense one. Then you walk through it. Like magic! Becaushe it IS magic! The besht kind of magic \u2014 the kind that givesh you loot!',
			[
				opt('Did you just say "the game"?', 'fourth_wall', '#f44'),
				opt('Useful tip. Thanks!', 'farewell', '#4f4'),
			]
		),
		fourth_wall: node('fourth_wall',
			'*He blinks.* What? No. I shaid "the PAIN." The pain of the dungeon. It painsh me. In my... shoul. *He takes a long drink.* Look, are you going into that dungeon or not? Becaushe I need thish table for my drinksh.',
			[
				opt('Right. I\'ll be going.', 'farewell', '#4f4'),
			]
		),
		more_drunk_tips: node('more_drunk_tips',
			'TRAPS. Trapsh everywhere. If the floor looksh shuspicious, SEARCH. Prresh the Shearch button. Or E. Whatever. *hic* And bosshes! Every five floorsh! Big nasshty onesh! Can\'t run from a bossh! Gotta fight! Gotta be BRAVE! Like Garvush! *He flexes very unimpressively.*',
			[
				opt('You\'re surprisingly helpful when drunk.', 'helpful', '#4f4'),
				opt('I should go prepare.', 'farewell', '#0ff'),
			]
		),
		helpful: node('helpful',
			'I\'m helpful at ALL timesh! I\'m also handshome and modesht. *He tries to wink and blinks both eyes.* The shecret to shuccess in the dungeon ish shtubbornness. Don\'t die. That\'sh it. That\'sh the whole shtrategy. Don\'t. Die.',
			[
				opt('Profound wisdom.', 'farewell', '#4f4'),
			]
		),
		okay: node('okay',
			'*He looks at you with unexpected clarity.* No. I am not okay. I haven\'t been okay shince level fifteen. But I am alive. And shome daysh that\'sh enough. *He raises his mug.* To being alive. The lowesht bar. *He drinks.*',
			[
				opt('To being alive.', 'alive_toast', '#4f4'),
				opt('What happened on level fifteen?', 'level_fifteen', '#f44'),
			]
		),
		alive_toast: node('alive_toast',
			'*He smiles \u2014 a real, genuine smile.* You\'re alright, kid. You\'re alright. Now go shave the world or whatever it ish you heroesh do. And if you shee a really good hat on level three \u2014 brown leather, phoenix hawk feather \u2014 it belongsh to a man named... actually, ashk the blackshmith\'s kid. He\'ll know.',
			[
				opt('...is that Father\'s hat?', 'fathers_hat', '#8cf'),
				opt('I\'ll keep an eye out.', 'farewell', '#4f4'),
			]
		),
		fathers_hat: node('fathers_hat',
			'*He grins.* THAT\'SH the one! Your old man losht it on level three when we were both young and shtupid. He\'sh been moaning about it for twenty yearsh. Ha! Tell him Garvush shaysh hello. We ushed to delve together before the Shilver Delversh. Good timesh. Before everything got... complicated.',
			[
				opt('Wait \u2014 you and my father are friends?!', 'father_friend', '#f44'),
				opt('Small world.', 'farewell', '#4f4'),
			]
		),
		father_friend: node('father_friend',
			'WERE friendsh. We... had a falling out after I went to level fifteen. I came back different and he could tell. He tried to help but I... I pushhed everyone away. Ashk him about it shometime. Or don\'t. Shome bridgesh are better left burned. *He stares into his mug.* ...I misssh him though.',
			[
				opt('I\'ll tell him you said hi.', 'farewell', '#4f4'),
			]
		),
		deep_drunk: node('deep_drunk',
			'Below level ten, the dungeon shtopsh making shensh. Architecture goesh all wobbly. Creaturesh get WEIRD. Sheen a rat the shize of a horsh down there. Sheen a horsh the shize of a rat too, which was adorable and VERY confusing. Reality ish more of a shuggestion on the deep floorsh.',
			[
				opt('A horse-sized rat?!', 'horse_rat', '#f44'),
				opt('What about the bosses down there?', 'deep_bosses', '#ff4'),
			]
		),
		horse_rat: node('horse_rat',
			'I named him Gerald. He was actually quite friendly once you got pasht the whole "trying to eat your face" phase. Every relashionship hash ish rough patch, right? Gerald and I had an understhanding by the end. Mutual reshpect. And fear. Mosthly fear.',
			[
				opt('...you befriended a horse-sized rat.', 'farewell', '#4f4'),
			]
		),
		deep_bosses: node('deep_bosses',
			'The deep bosshesh... they TALK. The level ten bossh ashked me about my childhood. The level fifteen bossh offered me a deal. "Shtay," it shaid. "Shtay and you\'ll never feel pain again." I almosht took it. ALMOSHT. Then Thesshaly... *He trails off and drinks.*',
			[
				opt('What happened with Thessaly?', 'thessaly_drunk', '#f44'),
				opt('I\'ll be careful with the deep bosses.', 'farewell', '#4f4'),
			]
		),
		advice: node('advice',
			'*He counts on his fingers.* One: heal early, heal often. Two: shearch for shecretsh \u2014 the besht loot ish hidden. Three: don\'t trushtsh anything below level ten that talksh to you. Four: don\'t go to level fifteen. Five: if you ignore number four, DON\'T LOOK AT THE EYE. Six: ... *He loses count.* ...shix ish "drink more." Probably.',
			[
				opt('Don\'t look at the Eye. Got it.', 'farewell', '#4f4'),
				opt('What IS the Eye?', 'the_eye_drunk', '#f44'),
			]
		),
		stop_drinking: node('stop_drinking',
			'*He looks at his mug, then at you, then back at the mug.* ...no. *He drinks.* The ale keepsh the nightmaresh quiet. Without it, I hear the dungeon calling. Pulling. Whishpering my name. The ale drownsh it out. Mosthly. On bad nightsh, even the ale ishn\'t enough.',
			[
				opt('I\'m sorry, Garvus.', 'sorry', '#4f4'),
			]
		),
		farewell: node('farewell',
			'*He waves his mug vaguely.* G\'luck, kid. Don\'t die. It\'sh overrated. Dying, I mean. Very inconvenient. Lottsha paperwork. *hic*',
			[
				opt('[Leave conversation]', '__exit__', '#0ff'),
			]
		),
		drunk_rumors: node('drunk_rumors',
			'*He perks up, delighted to have an audience.* Rumorsh? I\'ve GOT rumorsh! I\'ve got the BESHT rumorsh! *He nearly falls off his stool.* What do you wanna know?',
			[
				opt('What\'s the deepest level like?', 'rumor_deep', '#ff4', { once: true }),
				opt('Any tricks to avoid monsters?', 'rumor_backwards', '#ff4', { once: true }),
				opt('Tell me about level ten.', 'rumor_level_ten', '#ff4', { once: true }),
				opt('Know anything about treasure rooms?', 'rumor_treasure', '#ff4', { once: true }),
				opt('I think you\'ve shared enough.', 'farewell', '#0ff'),
			]
		),
		rumor_deep: node('rumor_deep',
			'*He leans in, breath toxic.* The wallsh down there? They SHING, my friend. Not like a bard shingsh. Like... like the whole mountain ish humming a lullaby. A very, very shad lullaby. About wormsh. Or maybe about love. Hard to tell with the acousticsh. *He sniffles.* It wash beautiful. And horrifying. Beautifully horrifying. Horrifyingly beautiful.',
			[
				opt('Singing walls. Sure. [Rumor learned]', 'drunk_rumors', '#ff4', { onSelect: { rumor: RUMORS.singing_walls } }),
			]
		),
		rumor_backwards: node('rumor_backwards',
			'*He grabs your arm with surprising strength.* Lishten. LISHTEN. I dischovered shomething INCREDIBLE on level twelve. If you walk backwardsh — BACKWARDSH — the monstersh can\'t see you! I did it for THREE WHOLE FLOORSH! Walked backwards the entire time! *He beams proudly.* ...I alsho walked into seven wallsh, fell down two pitsh, and the monstersh definitely shaw me becaushe three of them chased me. But OTHER than that? Invisible.',
			[
				opt('Brilliant strategy, Garvus. [Rumor learned]', 'drunk_rumors', '#ff4', { onSelect: { rumor: RUMORS.backwards_walking } }),
			]
		),
		rumor_level_ten: node('rumor_level_ten',
			'*His voice drops and his eyes widen to saucers.* Level ten. LEVEL TEN. The monshtersh are as big ash HOUSHESH! I shaw a shlime the shize of a BARN! A shkleton riding a DRAGON! A goblin wearing a CROWN made of SHMALLER GOBLINS! *He pauses.* ...okay, shome of that might be the ale talking. But the monshtersh DO get bigger. That part ish true. Probably.',
			[
				opt('House-sized monsters. Got it. [Rumor learned]', 'drunk_rumors', '#ff4', { onSelect: { rumor: RUMORS.level_ten_horror } }),
			]
		),
		rumor_treasure: node('rumor_treasure',
			'*He cups his hands together reverently.* Level sheven. There ish a room. Made. Entirely. Of gold. The WALLSH are gold. The FLOOR ish gold. The AIR ish probably gold. I never actually SHAW it because I was running from a very angry troll at the time. But the troll was carrying gold, sho by exshtension, it MUSHT be real. Logic. Flawlessh logic.',
			[
				opt('Flawless indeed. [Rumor learned]', 'drunk_rumors', '#ff4', { onSelect: { rumor: RUMORS.treasure_room } }),
			]
		),
	}
};

// ─── CAVE: PRISONER ───

export const PRISONER_DIALOGUE: DialogueTree = {
	startNode: 'start',
	returnNode: 'return',
	nodes: {
		start: node('start',
			'*A gaunt figure stirs in the shadows, chains rattling.* Well, well. Another guest at the goblin resort. Welcome. The accommodations are terrible and the room service will eat you.',
			[
				opt('Who are you?', 'who', '#ff4'),
				opt('How do I get out of here?', 'escape', '#ff4'),
				opt('How long have you been here?', 'how_long', '#8cf'),
				opt('Hang tight, I\'ll get us both out.', 'rescue', '#4f4'),
				opt('[Say nothing and leave]', '__exit__', '#0ff'),
			]
		),
		return: node('return',
			'*She looks up.* Oh good, you\'re still alive. I was taking bets with the rats. They had three-to-one odds against you.',
			[
				opt('Tell me more about yourself.', 'who', '#ff4'),
				opt('Any tips for fighting goblins?', 'goblin_tips', '#ff4'),
				opt('What were you doing before you got captured?', 'research', '#8cf'),
				opt('Tell me about what lies below.', 'below', '#f44'),
				opt('[Leave conversation]', '__exit__', '#0ff'),
			]
		),
		who: node('who',
			'Thessaly. Scholar of the Athenaeum of Grey Reaches. I was researching the resonance patterns of the deep caves \u2014 the way the stone itself seems to hum on certain nights. *She rattles her chains.* The goblins were less interested in my academic credentials than in my cooking potential.',
			[
				opt('The Athenaeum? Tell me more.', 'athenaeum', '#8cf'),
				opt('Cooking potential?!', 'cooking', '#f44'),
				opt('What are resonance patterns?', 'resonance', '#8cf'),
				opt('I\'ll get you out of here.', 'rescue', '#4f4'),
			]
		),
		athenaeum: node('athenaeum',
			'The Athenaeum of Grey Reaches \u2014 the last great library of the old world. We catalogue everything the dungeon produces: its creatures, its shifting architecture, its impossible physics. Three hundred scholars dedicated to understanding something that defies understanding. *She smiles thinly.* My colleagues think I\'m dead, incidentally. It\'s been... educational.',
			[
				opt('What have you learned about the dungeon?', 'dungeon_knowledge', '#ff4'),
				opt('Three hundred scholars and none of them came to rescue you?', 'no_rescue', '#f44'),
				opt('Let\'s focus on getting out.', 'escape', '#ff4'),
			]
		),
		no_rescue: node('no_rescue',
			'*She laughs bitterly.* Scholars don\'t rescue. Scholars write papers about the circumstances of your disappearance and then argue about the citation format for three months. My research rival, Aldric, probably already took my office. He always coveted my window. It faces west. Beautiful sunsets. *Her voice catches.* I miss sunsets.',
			[
				opt('I\'m sorry.', 'sorry', '#4f4'),
				opt('What was your research about?', 'research', '#8cf'),
				opt('Let\'s make sure you see another sunset.', 'rescue', '#4f4'),
			]
		),
		sorry: node('sorry',
			'Don\'t be sorry. Be effective. There\'s a difference between sympathy and survival, and right now I need you firmly on the survival side. *She meets your eyes.* Though I appreciate the sentiment. It\'s been a while since anyone showed concern that wasn\'t goblin-food-related.',
			[
				opt('How do we escape?', 'escape', '#ff4'),
				opt('Tell me what you know about these caves.', 'dungeon_knowledge', '#ff4'),
			]
		),
		cooking: node('cooking',
			'Don\'t look so horrified. They haven\'t eaten me yet because the Jailer thinks I\'m "too stringy." His exact words. He keeps poking my arms and muttering about fattening me up. I\'ve been quietly losing weight on principle. *She pauses.* That\'s a joke. The food is just terrible.',
			[
				opt('That\'s darkly funny.', 'dark_humor', '#4f4', { onSelect: { mood: 'amused' } }),
				opt('I\'ll deal with the Jailer.', 'jailer_info', '#f44'),
				opt('How do I get us out?', 'escape', '#ff4'),
			]
		),
		dark_humor: node('dark_humor',
			'When you\'ve been chained in a goblin cave for weeks, you either develop a sense of humor or you go mad. I chose humor. The rat in the corner chose madness. We don\'t talk about Gerald. *She nods toward an empty corner.* Gerald isn\'t real, by the way. That was also a joke. Probably.',
			[
				opt('...Is Gerald real?', 'gerald', '#f44'),
				opt('Focus. How do we escape?', 'escape', '#ff4'),
				opt('Tell me about the goblins.', 'goblin_tips', '#ff4'),
			]
		),
		gerald: node('gerald',
			'*She stares at the corner for a long moment.* No. No, Gerald was a rat. A real rat. He kept me company for the first few days. Brought me crumbs. Then the goblins caught him and... well. Let\'s just say the goblins have a very literal understanding of "pet." *She looks away.* I don\'t want to talk about Gerald anymore.',
			[
				opt('I\'m sorry about Gerald.', 'rescue', '#4f4'),
				opt('Let\'s focus on getting out.', 'escape', '#ff4'),
			]
		),
		resonance: node('resonance',
			'The stone here vibrates at frequencies that shouldn\'t be possible for natural rock. My instruments \u2014 confiscated, of course \u2014 detected harmonics that match theoretical models of dimensional membranes. In plain language: the walls between worlds are thin here. Dangerously thin. Sometimes I hear things through the stone. Voices. Music. Once, I swear I heard someone typing on a keyboard.',
			[
				opt('A keyboard? That\'s... unsettling.', 'fourth_wall', '#f44'),
				opt('Dimensional membranes? Tell me more.', 'dimensions', '#8cf'),
				opt('Is that related to the Eye below?', 'the_eye', '#f44'),
			]
		),
		fourth_wall: node('fourth_wall',
			'*She shrugs.* I was delirious at the time. Probably. But the Athenaeum has records of similar phenomena \u2014 adventurers who claimed they could sense "something watching" that wasn\'t a monster. Something... outside the world entirely. The senior scholars dismiss it as dungeon psychosis. I\'m not so sure. *She lowers her voice.* Do you ever feel like your choices are being made for you?',
			[
				opt('...Let\'s change the subject.', 'escape', '#ff4'),
				opt('You\'re scaring me, Thessaly.', 'scare', '#f44', { onSelect: { mood: 'afraid' } }),
			]
		),
		scare: node('scare',
			'*She smiles.* Good. A healthy amount of fear keeps you alert. An unhealthy amount keeps you alive even longer. Now \u2014 *she rattles her chains* \u2014 are you going to help me escape this philosophical nightmare, or shall we continue debating the nature of reality while goblins sharpen their forks?',
			[
				opt('Right. Escape plan.', 'escape', '#ff4'),
				opt('Tell me about the Eye first.', 'the_eye', '#f44'),
			]
		),
		dimensions: node('dimensions',
			'The Athenaeum theorizes that the dungeon exists at a convergence point \u2014 where multiple planes of reality press against each other like pages in a book. Each level deeper brings you closer to the binding. And at the center of the binding... *She trails off.* My predecessors called it the Resonance. The goblins call it the Deep Song. The drunk in the tavern above \u2014 if he\'s still alive \u2014 calls it the Eye.',
			[
				opt('What is the Eye?', 'the_eye', '#f44'),
				opt('How do you know about the tavern drunk?', 'know_garvus', '#ff4'),
				opt('This is a lot to take in.', 'overwhelmed', '#4f4'),
			]
		),
		know_garvus: node('know_garvus',
			'Garvus? Everyone at the Athenaeum knows Garvus. He was one of us. One of the best, actually \u2014 his field work was unmatched. He went deeper than anyone and came back... different. Wouldn\'t publish his findings. Wouldn\'t even discuss them. Just started drinking and muttering about eyes in the dark. The Athenaeum struck his name from the rolls. Official story: "retired due to personal reasons." Unofficial story: he saw something that broke him.',
			[
				opt('What did he see?', 'the_eye', '#f44'),
				opt('Will the same thing happen to me?', 'warning', '#ff4'),
				opt('This place is more connected than I thought.', 'connections', '#8cf'),
			]
		),
		connections: node('connections',
			'Everything is connected down here. The goblins think they\'re independent, but they serve the dungeon whether they know it or not. The creatures, the traps, the treasure \u2014 it\'s all part of a system. An ecosystem. Some scholars think the dungeon is alive, that it grows and adapts. I think it\'s worse than that. I think it\'s intelligent. And I think it\'s bored.',
			[
				opt('A bored, intelligent dungeon. Great.', 'bored_dungeon', '#f44'),
				opt('How does that help me survive?', 'survival_tips', '#ff4'),
			]
		),
		bored_dungeon: node('bored_dungeon',
			'Think about it \u2014 a vast, ancient intelligence with nothing to do but watch adventurers stumble through its corridors. It sets traps not because it needs to, but because it wants to see what you\'ll do. It creates treasure rooms to test your greed. Monsters to test your courage. And occasionally, it puts two prisoners in the same cell to see if they\'ll cooperate or fight over the last crumb. *She eyes you.* We\'re cooperating, right?',
			[
				opt('Absolutely.', 'rescue', '#4f4'),
				opt('Depends on how many crumbs you have.', 'crumbs', '#ff4'),
			]
		),
		crumbs: node('crumbs',
			'*She actually laughs \u2014 a genuine, surprised sound.* I like you. You\'re funnier than most adventurers. The last one who came through was all "stand back, citizen!" and "I shall smite the goblins!" He lasted forty-five seconds. I counted. *She grows serious.* Don\'t be that person. Think before you fight. The goblins are stupid individually, but they coordinate better than you\'d expect.',
			[
				opt('Give me the tactical rundown.', 'goblin_tips', '#ff4'),
				opt('I\'ll be careful.', 'rescue', '#4f4'),
			]
		),
		the_eye: node('the_eye',
			'*Her voice drops to barely a whisper.* They call it many things. The Resonance. The Deep Song. The Eye Below. It\'s the thing at the bottom of everything \u2014 the reason the dungeon exists. Garvus saw it and went mad. My predecessor, Scholar Venn, went looking for it and never came back. All I know is this: the deeper you go, the more it watches. And the more it watches, the more it... adjusts. The dungeon reshapes itself around you. Personally.',
			[
				opt('How do I fight something like that?', 'fight_eye', '#f44'),
				opt('Can I avoid it?', 'avoid_eye', '#ff4'),
				opt('This is too much. Let\'s just escape.', 'escape', '#0ff'),
			]
		),
		fight_eye: node('fight_eye',
			'*She stares at you.* Fight it? I don\'t know if you can fight a geological formation that dreams. But the Athenaeum\'s oldest texts mention a "Severance" \u2014 a way to cut the connection between the Eye and the surface. No one knows what that means, exactly. My research was getting close to an answer when I got... *she gestures at the chains* ...detained. If you find my notes deeper in the caves, they might help. I dropped my satchel when the goblins grabbed me.',
			[
				opt('I\'ll look for your notes.', 'notes_quest', '#4f4'),
				opt('Let\'s get you free first.', 'rescue', '#4f4'),
			]
		),
		avoid_eye: node('avoid_eye',
			'Avoid the thing that is the dungeon? That\'s like a fish trying to avoid water. But you can minimize its attention. Don\'t linger on any floor. Don\'t hoard treasure \u2014 it notices greed. And never, NEVER stare into the darkness when you feel it staring back. That\'s how it gets a read on you. That\'s how it learns.',
			[
				opt('Practical advice. Thank you.', 'rescue', '#4f4'),
				opt('What happens when it learns?', 'learns', '#f44'),
			]
		),
		learns: node('learns',
			'It starts generating encounters tailored to your weaknesses. Afraid of spiders? Every room will have spiders. Rely on potions? Watch them become scarce. Trust your allies? It\'ll put them in impossible situations. The dungeon doesn\'t just want to kill you. It wants to understand you first. *She shivers.* That\'s what makes it different from every other death trap in the world. It\'s curious.',
			[
				opt('A curious dungeon. Wonderful.', 'escape', '#ff4'),
				opt('Thessaly, you\'re terrifying.', 'terrifying', '#4f4'),
			]
		),
		terrifying: node('terrifying',
			'I prefer "well-informed." But yes, knowledge has a cost. Ignorance is bliss; scholarship is insomnia and chains. *She rattles them for emphasis.* Now, enough philosophy. Are you going to fight your way out or stand here until the goblins come back with a larger pot?',
			[
				opt('Right. Escape plan.', 'escape', '#ff4'),
				opt('They have a pot?!', 'the_pot', '#f44'),
			]
		),
		the_pot: node('the_pot',
			'Oh yes. A very large pot. The Jailer calls it "Big Beautiful." I wish I were joking. He polishes it every evening and hums what I can only describe as a goblin lullaby. It\'s haunting. And not in the atmospheric, mysterious way. In the genuinely disturbing way. *She pauses.* Kill the Jailer first. He\'s the smart one. The guards just follow orders.',
			[
				opt('Noted. Kill the Jailer first.', 'jailer_info', '#f44'),
				opt('I have a plan.', 'escape', '#ff4'),
			]
		),
		warning: node('warning',
			'*She looks at you appraisingly.* Maybe. Depends on how deep you go. The upper levels are just monsters and loot \u2014 standard adventuring fare. But past level ten, the dungeon starts... noticing you. And once it notices, it doesn\'t forget. Garvus reached level twenty. He says he doesn\'t remember what happened there. His nightmares suggest otherwise.',
			[
				opt('I\'ll be careful.', 'rescue', '#4f4'),
				opt('What\'s on level twenty?', 'level_twenty', '#f44'),
			]
		),
		level_twenty: node('level_twenty',
			'If I knew that, I\'d have published it and made tenure. All the records agree: something changes on the twentieth level. The architecture becomes organic. The walls pulse. The floors are warm. Garvus\'s unpublished journal \u2014 which I may have read without permission \u2014 mentions "the Heartbeat." That\'s all. Two words, underlined three times, surrounded by ink stains that might have been tears.',
			[
				opt('That\'s genuinely disturbing.', 'rescue', '#4f4'),
				opt('I need to prepare. How do I survive?', 'survival_tips', '#ff4'),
			]
		),
		survival_tips: node('survival_tips',
			'Rule one: never fight what you can avoid. Rule two: potions are more valuable than gold. Rule three: if a room seems too safe, it\'s not. Rule four: the dungeon rewards the clever and punishes the greedy. And rule five \u2014 *she holds up her chained hands* \u2014 don\'t go into uncharted areas alone. Trust me on that last one.',
			[
				opt('Sound advice. Thank you, Thessaly.', 'rescue', '#4f4'),
				opt('Any combat tips specifically?', 'goblin_tips', '#ff4'),
			]
		),
		goblin_tips: node('goblin_tips',
			'Goblins are cowards one-on-one but dangerous in groups. The guards are weak \u2014 two or three hits should drop them. But the Jailer is tougher and smarter. He\'ll try to corner you. Use the corridor to fight them one at a time \u2014 the narrow space negates their numbers. And watch for the Jailer\'s keys on his belt. You\'ll need them for... well, for me. Obviously.',
			[
				opt('I\'ll take them down. Sit tight.', 'sit_tight', '#4f4'),
				opt('What\'s past the cave exit?', 'below', '#ff4'),
			]
		),
		sit_tight: node('sit_tight',
			'*She holds up her chains.* I wasn\'t planning on going anywhere. *A tired smile.* Be careful out there. And if you find a leather satchel with the Athenaeum seal \u2014 a silver owl on blue \u2014 that\'s my research. Guard it with your life. It may be more important than either of us.',
			[
				opt('[Leave conversation]', '__exit__', '#0ff'),
			]
		),
		notes_quest: node('notes_quest',
			'My satchel has a silver owl clasp \u2014 the Athenaeum seal. Inside are my field journals, resonance readings, and a partial translation of the Deepscript glyphs I found on level five. That translation... it mentions the Severance. If you can complete it, you might understand what the Eye truly is. And how to stop it. Or at least... how to not be consumed by it.',
			[
				opt('I\'ll find your notes. I promise.', 'rescue', '#4f4'),
				opt('What\'s Deepscript?', 'deepscript', '#8cf'),
			]
		),
		deepscript: node('deepscript',
			'An ancient writing system found etched into the deepest walls of the dungeon. It predates every known civilization. Some glyphs seem to shift when you\'re not looking \u2014 yes, I know how that sounds. The partial translations we have suggest it\'s not a language of communication but of instruction. Commands. As if someone \u2014 or something \u2014 was programming the dungeon itself.',
			[
				opt('Can you teach me to read Deepscript?', 'teach_deepscript', '#ff4'),
				opt('Programming the dungeon...', 'programming', '#f44'),
				opt('I need to go now. I\'ll find your notes.', 'sit_tight', '#4f4'),
			]
		),
		teach_deepscript: node('teach_deepscript',
			'*Her face lights up with genuine excitement.* You want to LEARN it? Nobody ever wants to learn it! Aldric said it was "a waste of research funding." The Academy called it "academically irrelevant." Even Garvus said "why read the menu when you can just eat the food?" Which is a terrible metaphor because the food is MONSTERS. *She takes a breath.* Yes. Yes, I can teach you the basics. The glyphs follow phonetic patterns \u2014 once you grasp the root forms, the rest is pattern matching. Here...',
			[
				opt('[Study the Deepscript basics with Thessaly]', 'learned_deepscript', '#4f4', { onSelect: { learnLanguage: 'Deepscript', message: 'Thessaly teaches you the basics of Deepscript! You can now understand Deepscript speakers.' } }),
			]
		),
		learned_deepscript: node('learned_deepscript',
			'*After what feels like an hour of tracing glyphs in the dust and repeating guttural syllables, something clicks.* There! You\'re reading! It\'s rudimentary, but you can parse the base constructs. If you encounter anything written in Deepscript \u2014 or any being that speaks it \u2014 you should be able to understand the gist. *She beams with scholarly pride.* I just taught a subject the Academy said was irrelevant. Take THAT, peer review board.',
			[
				opt('Thank you, Thessaly. This could save my life.', 'rescue', '#4f4'),
				opt('Who else speaks Deepscript?', 'who_speaks', '#ff4'),
			]
		),
		who_speaks: node('who_speaks',
			'The dungeon\'s older entities. Not the monsters \u2014 they\'re generated, they speak nothing. But the... remnants. The Architects left pieces of themselves behind \u2014 echoes, fragments of consciousness embedded in the structure. Shades, we call them. Translucent figures that flicker in the deeper levels. Most adventurers run from them. But they\'re not hostile \u2014 they\'re WARNING SIGNS. They speak Deepscript because that\'s what they were written in. They are literal footnotes in the dungeon\'s source code.',
			[
				opt('I\'ll seek them out.', 'rescue', '#4f4'),
				opt('Living footnotes. That\'s wild.', 'rescue', '#4f4'),
			]
		),
		programming: node('programming',
			'*Her eyes light up \u2014 the look of a scholar who has found someone willing to listen.* Yes! The dungeon isn\'t natural \u2014 it was BUILT. By something with intelligence far beyond ours. The Deepscript glyphs are the remnants of its source code, if you will. And the Eye... the Eye might be the developer. Still watching. Still patching. Still adding new content. *She catches herself.* Metaphorically speaking.',
			[
				opt('That\'s... a lot to process.', 'sit_tight', '#4f4'),
				opt('Who built it? And why?', 'builder', '#8cf'),
			]
		),
		builder: node('builder',
			'The Athenaeum\'s oldest texts call them the Architects. We know almost nothing about them except that they weren\'t human, they weren\'t gods, and they disappeared. The dungeon was their final work \u2014 or their final mistake. Scholar Venn believed the dungeon was a prison. Not for us. For the Eye. *She lowers her voice.* And prisons only work as long as no one opens the door from the inside.',
			[
				opt('Am I... opening the door by going deeper?', 'door', '#f44'),
				opt('I need to go. Stay safe, Thessaly.', 'sit_tight', '#4f4'),
			]
		),
		door: node('door',
			'*She meets your eyes with an expression that is equal parts fear and fascination.* Every adventurer who descends weakens the bindings a little. Kills the wardens \u2014 the creatures placed there to maintain the prison. Takes the treasures that were actually containment anchors. We\'re all unwitting accomplices. *She pauses.* But someone has to go down. Someone has to find the truth. Just... try to be the one who comes back up.',
			[
				opt('I will. I promise.', 'sit_tight', '#4f4'),
			]
		),
		below: node('below',
			'Past this cave, the true dungeon begins. The first few levels are "standard" \u2014 goblins, rats, traps, the occasional mimic chest. But don\'t let the familiarity breed contempt. Each level is generated fresh \u2014 the dungeon never repeats itself. That\'s not natural erosion. That\'s intention. Something is curating your experience down there.',
			[
				opt('How deep does it go?', 'how_deep', '#ff4'),
				opt('What should I watch for?', 'survival_tips', '#ff4'),
				opt('I should get moving.', 'sit_tight', '#0ff'),
			]
		),
		how_deep: node('how_deep',
			'The Athenaeum has confirmed expeditions to level twenty-five. Rumors speak of fifty. The Deepscript texts suggest it\'s effectively infinite \u2014 the dungeon generates new levels as needed. Like a book that writes new chapters faster than you can read. *She shudders.* Garvus told me, once, very drunk: "There is no bottom. There is only the Eye, and the Eye goes all the way down."',
			[
				opt('Infinite levels. Of course.', 'sit_tight', '#ff4'),
				opt('What\'s the deepest you\'ve been?', 'deepest', '#8cf'),
			]
		),
		deepest: node('deepest',
			'Level seven. Alone, poorly equipped, and full of scholarly hubris. I found a chamber where the walls were covered in Deepscript, floor to ceiling. My instruments went haywire. The resonance readings were off every scale I had. And then... I heard singing. Something vast and patient, singing in a language that made my teeth ache. I ran. All the way back up. Wrote my paper. Got captured by goblins on the way home. *She sighs.* Not my best week.',
			[
				opt('I\'ll go deeper. For both of us.', 'sit_tight', '#4f4'),
				opt('Your life sounds exhausting.', 'exhausting', '#ff4'),
			]
		),
		exhausting: node('exhausting',
			'*She actually grins.* It really is. But there\'s nothing else I\'d rather do. Well \u2014 *she rattles her chains* \u2014 I can think of ONE thing I\'d rather be doing right now. Specifically: not this. But the research? The discovery? Knowing things that no one else knows? That\'s worth every goblin, every chain, every missed sunset. *Her grin fades.* Mostly.',
			[
				opt('I\'ll get you back to your sunsets.', 'rescue', '#4f4'),
			]
		),
		rescue: node('rescue',
			'*Her expression softens.* You mean that, don\'t you? Most adventurers would\'ve left by now. "Every prisoner for themselves" and all that. *She straightens.* The Jailer has the key. Kill him, bring the key, and I can free myself. I\'ll make for the surface. If you survive the dungeon... look for me at the Athenaeum. I owe you a very large drink and a lecture on dimensional membrane theory.',
			[
				opt('It\'s a date.', 'date', '#4f4', { onSelect: { mood: 'amused' } }),
				opt('Stay alive, Thessaly.', 'farewell', '#4f4'),
				opt('Any last tips before I go?', 'last_tips', '#ff4'),
			]
		),
		date: node('date',
			'*She actually blushes, which is impressive given how pale she is from weeks underground.* I... was speaking academically. But yes. Fine. It\'s a date. You bring the survival stories, I\'ll bring the theoretical framework for why you should have died. It\'ll be romantic. *She clears her throat.* Now go. Before I say something even more embarrassing.',
			[
				opt('[Leave conversation]', '__exit__', '#0ff'),
			]
		),
		last_tips: node('last_tips',
			'Three things. One: the dungeon tests what you value. If you value combat, it gives you harder fights. Value treasure, it gives you more mimics. Value knowledge... well, it gave me chains and goblins. Draw your own conclusions. Two: trust the patterns. The dungeon has rules, even if they\'re strange rules. Learn them. Three: *she holds your gaze* \u2014 come back alive. The dead tell no tales, and I need someone to corroborate my research.',
			[
				opt('I won\'t let you down.', 'farewell', '#4f4'),
			]
		),
		escape: node('escape',
			'*She gestures toward the corridor to the north.* The guards patrol the main cave above. Three of them, plus the Jailer. The corridor is narrow \u2014 use it as a chokepoint. Fight them one at a time. There\'s a potion on the floor near me \u2014 take it, you\'ll need it more. The cave exit is in the northeast corner. Beyond that... the dungeon proper begins.',
			[
				opt('Three guards plus the Jailer. Got it.', 'goblin_tips', '#ff4'),
				opt('Come with me.', 'cant_come', '#4f4'),
				opt('I\'m ready. Wish me luck.', 'farewell', '#0ff'),
			]
		),
		cant_come: node('cant_come',
			'*She holds up her chained wrists.* I appreciate the chivalry, but I\'m rather permanently attached to this wall. The Jailer has the only key. Kill him, bring the key, and then we can discuss travel arrangements. Until then, I\'ll be here. Cheering you on silently. And cataloguing the acoustic properties of goblin screams for my next paper.',
			[
				opt('Right. Kill the Jailer, get the key.', 'jailer_info', '#f44'),
				opt('Stay strong, Thessaly.', 'farewell', '#4f4'),
			]
		),
		jailer_info: node('jailer_info',
			'The Jailer \u2014 the big green one with the key ring and the disturbingly affectionate relationship with his cooking pot. He\'s tougher than the guards. Smarter, too. He\'ll try to block the corridor to trap you in the cave with the guards. Don\'t let him. Draw the guards out first, then take him on one-on-one. He hits hard but he\'s slow. Patience will beat him.',
			[
				opt('I\'ll handle it.', 'farewell', '#4f4'),
				opt('What about the guards?', 'goblin_tips', '#ff4'),
			]
		),
		how_long: node('how_long',
			'*She counts on her fingers, then gives up.* Weeks? A month? Time gets strange underground. The goblins don\'t keep calendars. They measure time in meals, which is unfortunate because I\'m apparently the main course for next Tuesday. Or whatever goblins call Tuesday. Probably "Feast Day" or "Big Hungry Time."',
			[
				opt('That\'s horrifying.', 'cooking', '#f44'),
				opt('Who are you, anyway?', 'who', '#ff4'),
				opt('I\'ll get you out before Tuesday.', 'rescue', '#4f4'),
			]
		),
		research: node('research',
			'I was mapping resonance patterns in the upper caves \u2014 the way sound moves through the stone here is anomalous. My theory is that the dungeon isn\'t just underground architecture. It\'s a living acoustic instrument. The creatures, the traps, the treasure \u2014 they\'re all notes in a vast composition. And something is conducting.',
			[
				opt('What\'s conducting?', 'the_eye', '#f44'),
				opt('Tell me about the resonance patterns.', 'resonance', '#8cf'),
				opt('That\'s beautiful and terrifying.', 'overwhelmed', '#4f4'),
			]
		),
		overwhelmed: node('overwhelmed',
			'*She nods sympathetically.* Knowledge is heavy. The more you learn about this place, the heavier it gets. But ignorance will get you killed faster than truth will. Take what I\'ve told you and use it. You don\'t need to understand the dungeon completely. You just need to understand it better than it understands you.',
			[
				opt('Wise words. Thank you.', 'rescue', '#4f4'),
				opt('One more question...', 'below', '#ff4'),
			]
		),
		dungeon_knowledge: node('dungeon_knowledge',
			'More than is healthy, probably. The dungeon has at least three distinct zones: the Upper Halls, where goblins and basic creatures dwell. The Deep Reaches, where the monsters become... stranger. And the Abyss, which no confirmed survivor has returned from. Each zone has its own ecology, its own rules. The creatures on level one don\'t behave like the creatures on level ten. Because the dungeon is training them. Training you. Everything is a test.',
			[
				opt('Training for what?', 'the_eye', '#f44'),
				opt('Give me practical tips.', 'survival_tips', '#ff4'),
				opt('I should start moving.', 'escape', '#ff4'),
			]
		),
		farewell: node('farewell',
			'*She nods solemnly.* Go. And remember \u2014 the dungeon will try to make you forget why you entered. Hold onto your purpose. Hold onto your name. The ones who forget... they become part of it. Just another monster in the dark. *She rattles her chains one last time.* Don\'t forget me down there. I\'ll be waiting.',
			[
				opt('[Leave conversation]', '__exit__', '#0ff'),
			]
		),
	}
};

// ─── DUNGEON: WANDERING MERCHANT ───

export const MERCHANT_DIALOGUE: DialogueTree = {
	startNode: 'start',
	returnNode: 'return',
	nodes: {
		start: node('start',
			'*A hunched figure sits cross-legged on the floor, surrounded by a ludicrous number of pouches, satchels, and bags.* Welcome, welcome! Morrigan\'s Mobile Emporium, at your service! "We go where the customers are — even if that\'s a monster-infested death trap!"',
			[
				opt('How are you alive down here?', 'alive', '#ff4'),
				opt('Do you have anything useful?', 'wares', '#ff4'),
				opt('This seems like a terrible business model.', 'business', '#8cf'),
				opt('Goodbye.', 'farewell', '#0ff'),
			]
		),
		return: node('return',
			'*She beams at you.* My favorite customer! Well, my only living customer. The distinction matters less than you\'d think.',
			[
				opt('Got anything for me?', 'wares', '#ff4'),
				opt('Heard any trade gossip?', 'merchant_rumors', '#ff4'),
				opt('How\'s business?', 'business', '#8cf'),
				opt('Any tips about this level?', 'tips', '#ff4'),
				opt('Goodbye, Morrigan.', 'farewell', '#0ff'),
			]
		),
		alive: node('alive',
			'Trade secret! *She taps her nose.* Actually, it\'s simple: the monsters don\'t eat me because I sell them things too. That Goblin Jailer upstairs? Loyal customer. Bought his cooking pot from me. "Big Beautiful," he calls it. I suggested the name. Marketing is everything, even in a dungeon.',
			[
				opt('You sold the goblins a cooking pot?!', 'pot', '#f44'),
				opt('You trade with monsters?', 'monster_trade', '#ff4'),
				opt('What do you have for sale?', 'wares', '#ff4'),
			]
		),
		pot: node('pot',
			'A merchant doesn\'t judge her customers, dear. She judges their coin purses. Besides, Big Beautiful was just a regular cauldron before I upsold it with a "premium polish package." Three extra gold for me to spit on it and rub it with my sleeve. He was delighted. *She sighs contentedly.* Pure profit.',
			[
				opt('You\'re a terrible person.', 'terrible', '#f44', { onSelect: { mood: 'hostile' } }),
				opt('I respect the hustle.', 'hustle', '#4f4', { onSelect: { mood: 'amused' } }),
				opt('What else do you sell?', 'wares', '#ff4'),
			]
		),
		terrible: node('terrible',
			'Terrible? I\'m an entrepreneur! I found an underserved market — dungeon denizens with disposable income and no competing retailers within a three-level radius. That\'s not terrible, that\'s visionary. Harvard would give me a case study. If Harvard existed. Does it? Geography was never my strong suit.',
			[
				opt('Do you have anything for ME?', 'wares', '#ff4'),
				opt('Tell me about the deeper levels.', 'deep_levels', '#8cf'),
			]
		),
		hustle: node('hustle',
			'*She grins wide enough to show a gold tooth.* I like you. Most adventurers just try to rob me. The last one swung his sword at my head. Missed, obviously — I ducked. He hit the wall, stunned himself, and I sold him a "premium concussion remedy" before he came to. Water. It was water. He seemed better though.',
			[
				opt('Show me your wares.', 'wares', '#ff4'),
				opt('Any advice for surviving down here?', 'tips', '#ff4'),
			]
		),
		monster_trade: node('monster_trade',
			'Oh yes. Slimes love accessories — they absorb them and feel fancy. Skeletons buy joint lubricant. The Shadow Stalkers... well, they mostly just stare at my merchandise until I get uncomfortable and give them a discount. But the BEST customers are Mimics. They buy disguise kits. Little hats, fake locks, wood stain. Very image-conscious, Mimics.',
			[
				opt('Mimics buy disguise kits from you.', 'mimics', '#f44'),
				opt('This is the strangest economy I\'ve ever heard of.', 'economy', '#8cf'),
				opt('Show me what you\'ve got.', 'wares', '#ff4'),
			]
		),
		mimics: node('mimics',
			'How else do you think they look so convincing? Natural talent? Please. Those hinges don\'t oil themselves. I run a whole Mimic cosmetics line: "ChestBest — Because You\'re Worth Eating." Sales are through the roof. Well, through the floor. We\'re underground. Through the wall? Point is: business is good.',
			[
				opt('I will never trust a chest again.', 'tips', '#ff4'),
				opt('Show me your wares.', 'wares', '#ff4'),
			]
		),
		economy: node('economy',
			'Strange? This is the PUREST form of capitalism! No regulations, no taxes, no returns policy. Customer ate the product? Not my problem. Customer was eaten BY the product? Also not my problem. It\'s beautiful. Adam Smith would weep with joy. Or terror. Possibly both.',
			[
				opt('I need supplies, not economics.', 'wares', '#ff4'),
				opt('Tell me about the deeper levels.', 'deep_levels', '#8cf'),
			]
		),
		wares: node('wares',
			'*She rummages through her bags.* Hmm, let\'s see... healing salves, sharpening stones, slightly haunted compasses, one shoe — don\'t ask whose — and this lovely amulet that may or may not be cursed. *She holds up a glowing trinket.* Tell you what — take this healing salve. First customer discount. Come back alive and buy more. Dead customers are terrible for retention metrics.',
			[
				opt('Thanks, Morrigan. [Take healing salve]', 'gift', '#4f4', { onSelect: { hp: 5, message: 'Morrigan gives you a healing salve! (+5 HP)' } }),
				opt('What about the amulet?', 'amulet', '#ff4'),
				opt('Tell me about these deeper levels.', 'deep_levels', '#8cf'),
			]
		),
		gift: node('gift',
			'*She nods approvingly.* Good. Use it wisely. Or don\'t. I\'m a merchant, not a life coach. Now, if you happen to find any monster teeth, shed scales, or the occasional intact eyeball on your travels, bring them back. I can always use fresh inventory. "Ethically sourced dungeon components." That\'s my new slogan. Still workshopping it.',
			[
				opt('I\'ll keep an eye out. Pun intended.', 'farewell', '#4f4'),
				opt('Tell me about the deeper levels.', 'deep_levels', '#8cf'),
			]
		),
		amulet: node('amulet',
			'*She holds up a small stone pendant that pulses with a faint blue light.* Found it on level twelve. Previous owner didn\'t need it anymore, on account of being dead. It hums when danger is near. Also hums when you\'re trying to sleep, when it\'s bored, and occasionally it screams at 3 AM for no reason. Might be haunted. Might just need new batteries. I honestly don\'t know.',
			[
				opt('I\'ll pass on the screaming amulet.', 'tips', '#ff4'),
				opt('Is it... looking at me?', 'amulet_eye', '#f44'),
			]
		),
		amulet_eye: node('amulet_eye',
			'*She glances at the amulet, which does seem to have developed a faint iris-like pattern.* Oh, it does that. Started about level ten. I think the dungeon is... seeping into it. Some items down here absorb the ambient weirdness. The deeper you go, the weirder things get. Compasses point toward things you don\'t want to find. Weapons develop opinions. Armor gets clingy. Literally.',
			[
				opt('The dungeon changes objects?', 'deep_levels', '#8cf'),
				opt('Good to know. I should go.', 'farewell', '#0ff'),
			]
		),
		deep_levels: node('deep_levels',
			'*She lowers her voice.* I\'ve been as deep as level fifteen. That\'s my hard limit. Below that, things start to... notice you. Not the monsters — they notice you everywhere. I mean the dungeon itself. The walls shift. The air tastes like static. And my merchandise started rearranging itself when I wasn\'t looking. A healing potion ended up inside a locked chest that I KNOW was empty. The dungeon is playing shopkeeper. Badly.',
			[
				opt('The dungeon... reorganizes your stock?', 'dungeon_shops', '#8cf'),
				opt('What else have you seen down there?', 'deep_horrors', '#f44'),
				opt('I should keep moving. Thanks.', 'farewell', '#0ff'),
			]
		),
		dungeon_shops: node('dungeon_shops',
			'Reorganizes, reprices, occasionally reviews. I found one of my potions with a tiny label that said "3/5 stars — adequate viscosity, poor aftertaste." WHO wrote that?! I\'m the only literate thing on this level! Unless... *She stares at the walls.* Unless the dungeon has opinions about my pricing. That\'s the most terrifying thought I\'ve ever had. Competition from the building.',
			[
				opt('The dungeon has Yelp reviews for potions.', 'farewell', '#4f4'),
				opt('Morrigan, you are delightful.', 'farewell', '#4f4'),
			]
		),
		deep_horrors: node('deep_horrors',
			'On level thirteen, I saw a door that wasn\'t there five seconds ago. Behind it was a room full of treasure — gold, gems, weapons, the works. Beautiful. Perfect. Too perfect. I threw a shoe in. The room ate it. The whole room was a Mimic. A ROOM-SIZED Mimic. That was the day I established my depth limit. Also the day I lost my left shoe. Hence the single shoe for sale.',
			[
				opt('A room-sized Mimic. Of course.', 'farewell', '#ff4'),
				opt('How do you keep coming back?', 'secret', '#8cf'),
			]
		),
		secret: node('secret',
			'*She winks.* I know the service tunnels. Every building has them, even eldritch dungeon-prisons. Back corridors, maintenance passages, the occasional ventilation shaft that may or may not be a sleeping worm. Trade routes, dear. A merchant never reveals her supply chain. Suffice to say I can get in and out faster than any adventurer. No offense.',
			[
				opt('None taken. Stay safe, Morrigan.', 'farewell', '#4f4'),
			]
		),
		business: node('business',
			'*She pulls out a tiny ledger and squints at it.* Let\'s see... this quarter: seven adventurer sales, four monster sales, one sale to something I couldn\'t identify but it paid in teeth. Teeth! As currency! I had to accept — you can\'t discriminate in an open market. Margins are thin but overhead is low. The rent is free because my landlord is an ancient horror that doesn\'t understand property law.',
			[
				opt('Your landlord is... the dungeon?', 'deep_levels', '#8cf'),
				opt('You\'re insane and I love it.', 'hustle', '#4f4'),
				opt('I should go.', 'farewell', '#0ff'),
			]
		),
		tips: node('tips',
			'*She counts on her fingers.* One: if a chest looks too good to be true, it will eat you. I should know — I sell them their disguises. Two: potions are worth more than gold down here. Three: the dungeon changes layout between visits, but the RULES stay the same — it always puts the exit in an accessible room. Four: if you hear singing and you didn\'t bring a bard, run.',
			[
				opt('Singing?', 'singing', '#f44'),
				opt('Good advice. Thank you.', 'farewell', '#4f4'),
			]
		),
		singing: node('singing',
			'*She shivers theatrically.* Something deep, deep down sings. Not words — more like... the sound an ocean would make if it could carry a tune. My monster customers don\'t hear it. Or they pretend not to. But every adventurer I\'ve spoken to mentions it eventually. It gets louder the deeper you go. By level fifteen, I could feel it in my teeth. That\'s when I packed up and headed upward. A merchant knows when the market is hostile.',
			[
				opt('That must be the Eye.', 'the_eye_merchant', '#f44', { onSelect: { mood: 'afraid' } }),
				opt('Thanks for the warning.', 'farewell', '#4f4'),
			]
		),
		the_eye_merchant: node('the_eye_merchant',
			'*Her face goes serious — genuinely serious, for the first time.* Don\'t use that name lightly. I\'ve had customers — big, scary, well-armed customers — flinch at that word. Whatever it is, it\'s the reason the dungeon exists and the reason it keeps... producing. New monsters, new traps, new treasure. Like a factory that runs on nightmares. *She forces a grin.* But nightmares need merchants too! That\'s my niche!',
			[
				opt('You\'re braver than you let on, Morrigan.', 'farewell', '#4f4'),
			]
		),
		farewell: node('farewell',
			'*She waves cheerfully.* Happy dungeoning! Remember: if it looks like a chest, poke it first! If it looks like a wall, it might be a door! And if it looks like a merchant, it\'s probably me! Unless it\'s a Mimic. In which case — sorry, I sold it the disguise kit. Professional ethics prevent me from warning you further! Toodles!',
			[
				opt('[Leave conversation]', '__exit__', '#0ff'),
			]
		),
		merchant_rumors: node('merchant_rumors',
			'*She perks up immediately.* Trade gossip is my specialty! Information is the SECOND most valuable currency down here, right after teeth. Apparently. What do you want to know?',
			[
				opt('What do monsters buy from you?', 'rumor_skeleton', '#ff4', { once: true }),
				opt('Any merchant secrets?', 'rumor_merchant_everywhere', '#ff4', { once: true }),
				opt('Know anything about lava?', 'rumor_lava', '#ff4', { once: true }),
				opt('That\'s enough gossip.', 'return', '#0ff'),
			]
		),
		rumor_skeleton: node('rumor_skeleton',
			'*She counts on her fingers.* The skeletons buy joint lubricant. The slimes buy accessories. But the BEST customer story? There\'s a skeleton on level three who calls himself a king. Wears a crown made of rat bones. Very dignified. He told me \u2014 and I quote \u2014 "Any adventurer who bows before me shall be spared." I asked if that was true. He said "No, but it makes them hold still." Clever, in a horrible sort of way.',
			[
				opt('Don\'t bow to skeletons. Noted. [Rumor learned]', 'merchant_rumors', '#f44', { onSelect: { rumor: RUMORS.skeleton_king } }),
			]
		),
		rumor_merchant_everywhere: node('rumor_merchant_everywhere',
			'*She puffs up with pride.* You know, people say I appear on every single dungeon level. Every. Single. One. It\'s very flattering but wildly inaccurate. I appear on MOST levels. Maybe thirty percent? I have a route. Tuesdays and Thursdays are levels one through ten. Weekends are the deep floors. Mondays I take off. Even eldritch dungeon merchants need self-care days.',
			[
				opt('A merchant on every level. Sure. [Rumor learned]', 'merchant_rumors', '#ff4', { onSelect: { rumor: RUMORS.merchant_everywhere } }),
			]
		),
		rumor_lava: node('rumor_lava',
			'*She leans in with the expression of someone about to share forbidden knowledge.* Okay, I HAVE heard \u2014 from a very unreliable source, mind you, a slime wearing a monocle \u2014 that lava pools are actually therapeutic if you have fire resistance. Like a hot spring, but hotter. MUCH hotter. *She pauses.* I feel I should clarify: I have never tested this, I don\'t sell fire resistance potions, and my insurance does not cover lava-related incidents.',
			[
				opt('A healing lava bath. Right. [Rumor learned]', 'merchant_rumors', '#f44', { onSelect: { rumor: RUMORS.lava_potion } }),
			]
		),
	}
};

// ─── DUNGEON: LOST ADVENTURER ───

export const LOST_ADVENTURER_DIALOGUE: DialogueTree = {
	startNode: 'start',
	returnNode: 'return',
	nodes: {
		start: node('start',
			'*A battered figure leans against the wall, breathing heavily. Their armor is dented and stained with... various substances.* Oh thank the gods. A person. A real, living person. I\'ve been lost on this level for what feels like days. Please tell me you know the way out.',
			[
				opt('The stairs are usually in the largest room.', 'directions', '#4f4'),
				opt('How did you get lost?', 'lost_story', '#ff4'),
				opt('You look rough. Are you okay?', 'condition', '#4f4'),
				opt('Sorry, can\'t help. Good luck.', 'farewell_cold', '#f44', { onSelect: { mood: 'sad' } }),
			]
		),
		return: node('return',
			'*They look up hopefully.* Oh, it\'s you again. I\'m still lost. I tried going north. Found a wall. Tried going south. Found a different wall. I\'m starting to think the walls are following me.',
			[
				opt('The walls might actually be moving.', 'walls_move', '#f44'),
				opt('Tell me more about yourself.', 'backstory', '#8cf'),
				opt('Any dangers I should know about?', 'dangers', '#ff4'),
				opt('Good luck out there.', 'farewell', '#0ff'),
			]
		),
		directions: node('directions',
			'*Their face lights up.* The largest room! Of course! I\'ve been checking the smallest rooms because I figured the exit would be hidden. That\'s... that\'s backwards logic, isn\'t it? *They rub their temples.* The dungeon does something to your brain after a while. Makes you think in circles. Literally — I walked in a circle for three hours yesterday. Same circle. Counted.',
			[
				opt('The dungeon messes with your head?', 'dungeon_mind', '#f44'),
				opt('Who are you, anyway?', 'backstory', '#8cf'),
				opt('Be careful out there.', 'farewell', '#0ff'),
			]
		),
		lost_story: node('lost_story',
			'My party and I came down three levels ago. Five of us. Tank, healer, two DPS, and me — the cartographer. My ONE job was to map the dungeon. You know what\'s hard to map? A DUNGEON THAT REARRANGES ITSELF. My maps became fiction within minutes. Beautiful fiction, mind you. Very detailed. Completely useless.',
			[
				opt('What happened to your party?', 'party', '#ff4'),
				opt('The dungeon rearranges?', 'dungeon_mind', '#f44'),
				opt('A cartographer in a shifting dungeon. Rough.', 'rough', '#4f4'),
			]
		),
		party: node('party',
			'We got separated on this level. Something — I don\'t know what — caused a cave-in that sealed off the corridor between us. I could hear them on the other side, then... nothing. Either they found a way out, or... *They trail off.* I choose to believe they\'re fine. Talia, our healer, is smart. She\'d get them out. She has to have gotten them out.',
			[
				opt('I\'m sure they\'re fine.', 'hope', '#4f4'),
				opt('Tell me about Talia.', 'talia', '#8cf'),
				opt('I\'ll look for them if I can.', 'search_party', '#4f4'),
			]
		),
		hope: node('hope',
			'*They nod, not entirely convinced.* Yeah. Yeah, they\'re fine. Talia once healed a man who\'d been stepped on by a mountain troll. If she can fix that, she can navigate a little dungeon. *A shaky laugh.* A little dungeon that eats people. Totally fine. Everything\'s fine.',
			[
				opt('What can you tell me about this level?', 'dangers', '#ff4'),
				opt('Take this — you need it more than me. [Give advice]', 'advice_gift', '#4f4'),
			]
		),
		talia: node('talia',
			'*Their eyes soften.* Talia Windmere. Best combat medic in the Grey Reaches. She could set a broken bone during a boss fight without missing a heal. We went through the academy together. She always said I\'d get us lost one day. *A pained smile.* Guess she was right. If you see her — brown hair, green cloak, absurdly competent aura — tell her I\'m sorry about the maps.',
			[
				opt('I\'ll keep an eye out for her.', 'search_party', '#4f4'),
				opt('She sounds special.', 'special', '#8cf'),
			]
		),
		special: node('special',
			'*They look away quickly.* She\'s my best friend. Has been since we were apprentices. She used to patch me up after every training accident — and there were MANY training accidents. I once fell into a pit trap during a lecture on pit traps. The instructor was not amused. Talia laughed so hard she had to sit down. Then she healed my broken arm. Then she laughed again.',
			[
				opt('I hope you find each other.', 'farewell', '#4f4'),
				opt('Any warnings about what\'s ahead?', 'dangers', '#ff4'),
			]
		),
		search_party: node('search_party',
			'*Their eyes widen.* You\'d... you\'d really look? That\'s... *They swallow hard.* Thank you. If you find any of them — Talia the healer, Kael the tank, Jinx and Bree on damage — tell them I\'m alive. Tell them the cartographer finally admits the maps were useless. That\'ll make Kael laugh. He always said I was drawing pretty pictures.',
			[
				opt('I will. Stay alive until then.', 'farewell', '#4f4'),
				opt('Any tips for this level before I go?', 'dangers', '#ff4'),
			]
		),
		backstory: node('backstory',
			'Name\'s Corwin. Guild cartographer, third class. Which means I get third-class assignments. "Map the unmappable dungeon," they said. "Great opportunity for advancement," they said. You know what\'s a great opportunity? NOT being lost in a dungeon that actively resists being understood. I should have been a baker. Bread doesn\'t rearrange itself.',
			[
				opt('The Guild sent you here?', 'guild', '#ff4'),
				opt('What have you mapped so far?', 'maps', '#8cf'),
				opt('How long have you been down here?', 'time_lost', '#ff4'),
			]
		),
		guild: node('guild',
			'The Cartographers\' Guild of the Grey Reaches. Motto: "We Chart The Unknown." Unofficial motto: "We Lose Members Regularly." There\'s a hall of portraits back at headquarters — every cartographer who never returned. It\'s the biggest room in the building. Bigger than the trophy room. SIGNIFICANTLY bigger. I asked about that once. They said it was "motivational."',
			[
				opt('That\'s the opposite of motivational.', 'dark_guild', '#f44'),
				opt('Have other cartographers mapped this dungeon?', 'maps', '#8cf'),
			]
		),
		dark_guild: node('dark_guild',
			'Right?! But try telling that to Guild Master Aldric. *Corwin pauses.* Wait, Aldric runs the Athenaeum too... or was that a different Aldric? There are too many Aldrics in this world. The point is: the people who send you into dungeons never go INTO dungeons. Funny how that works. Very funny. I\'m laughing. On the inside. Where the despair lives.',
			[
				opt('Aldric of the Athenaeum?', 'aldric', '#8cf'),
				opt('Let\'s focus on survival.', 'dangers', '#ff4'),
			]
		),
		aldric: node('aldric',
			'You know him? Scholar Aldric, big ego, covets window offices? Yeah, he funds a lot of the expeditions down here. Officially for "scholarly research." Unofficially... I think he\'s looking for something specific. The teams he sponsors always get instructions to retrieve certain artifacts. Thessaly — one of his rivals — was investigating the same thing before she disappeared. Strange coincidence, that.',
			[
				opt('I met Thessaly. She\'s alive.', 'thessaly_alive', '#4f4'),
				opt('What artifacts is Aldric after?', 'artifacts', '#ff4'),
				opt('Interesting. I should move on.', 'farewell', '#0ff'),
			]
		),
		thessaly_alive: node('thessaly_alive',
			'*Corwin\'s eyes go wide.* Thessaly\'s ALIVE?! She — everyone thought she — *They laugh with genuine relief.* That stubborn, brilliant woman. Of course she\'s alive. The goblins probably couldn\'t shut her up about resonance patterns long enough to eat her. *Quietly.* That\'s actually wonderful news. First good thing I\'ve heard in weeks.',
			[
				opt('She\'s in the goblin caves above. Chained up.', 'thessaly_detail', '#ff4'),
				opt('What about these artifacts?', 'artifacts', '#ff4'),
			]
		),
		thessaly_detail: node('thessaly_detail',
			'Chained?! We have to — well, YOU have to. I\'m useless in a fight. I once swung a sword and hit myself. True story. But Thessaly is important. Her research on the Resonance — the thing the dungeon does to sound and stone — it might be the key to understanding this whole place. Aldric knows that. That\'s probably why he took her office window. Petty academic revenge disguised as administrative efficiency.',
			[
				opt('I\'ll help her. What about the artifacts?', 'artifacts', '#ff4'),
				opt('Time for me to go. Stay safe.', 'farewell', '#4f4'),
			]
		),
		artifacts: node('artifacts',
			'*Corwin lowers their voice.* Anchor Stones. Small, black, impossibly heavy for their size. They\'re embedded in the walls of certain dungeon levels — always in hidden rooms, always guarded by the toughest monsters on the floor. Thessaly\'s theory was that they\'re containment devices — part of whatever keeps the dungeon... contained. Aldric wants them removed. I\'m not sure that\'s wise.',
			[
				opt('Removing containment devices sounds bad.', 'bad_idea', '#f44'),
				opt('Why would Aldric want them?', 'aldric_motive', '#8cf'),
			]
		),
		bad_idea: node('bad_idea',
			'EXTREMELY bad. But Aldric is... persuasive. He told my Guild that the Anchor Stones are "merely geological curiosities." He told the Council of the Grey Reaches that they\'re "potential energy sources." He told Thessaly they were "irrelevant to her research." Three different lies to three different audiences. That\'s not incompetence. That\'s strategy.',
			[
				opt('I\'ll be careful with what I find.', 'farewell', '#4f4'),
				opt('Sounds like a conspiracy.', 'conspiracy', '#f44'),
			]
		),
		aldric_motive: node('aldric_motive',
			'Power? Knowledge? Academic glory? All three? I\'m a cartographer, not a mind reader. But I\'ve seen his private notes — accidentally, while lost in his office, which happens more often than you\'d think — and he\'s obsessed with something called the "Severance." Same word Thessaly uses. He thinks the Anchor Stones are the key to achieving it. Whatever "it" is.',
			[
				opt('The Severance... Thessaly mentioned that.', 'severance', '#f44'),
				opt('I should go. Thank you, Corwin.', 'farewell', '#4f4'),
			]
		),
		severance: node('severance',
			'*Corwin shudders.* I don\'t like that word. It sounds like surgery. Or termination. Or both. Thessaly thinks it means cutting the connection between the Eye and the surface. Aldric thinks it means... something else. Something about control. *They meet your eyes.* Be careful who you trust down here. The dungeon isn\'t the only thing with an agenda.',
			[
				opt('I\'ll remember that. Good luck, Corwin.', 'farewell', '#4f4'),
			]
		),
		conspiracy: node('conspiracy',
			'It IS a conspiracy! But nobody listens to the cartographer! "Corwin, you\'re paranoid." "Corwin, you see patterns that aren\'t there." "Corwin, that\'s a wall, not a secret door." Okay, that last one was legitimate. But the Aldric thing — I\'m RIGHT about that. Something is wrong and nobody with authority wants to admit it because the dungeon funding is too lucrative.',
			[
				opt('Follow the money. Classic.', 'farewell', '#ff4'),
				opt('I believe you, Corwin.', 'believed', '#4f4', { onSelect: { mood: 'friendly' } }),
			]
		),
		believed: node('believed',
			'*They stare at you.* You... do? Nobody ever — *They blink rapidly.* That\'s — thank you. That means more than you know. I\'ve been screaming into the void about this for months and the void just kept echoing back bureaucratic memos. *They straighten up.* Find the truth down there. For me, for Thessaly, for everyone who deserves to know what\'s really going on.',
			[
				opt('I will. Stay alive, Corwin.', 'farewell', '#4f4'),
			]
		),
		maps: node('maps',
			'*They pull out a crumpled parchment covered in scrawled lines, crossed-out passages, and tiny notes.* This. This is my masterwork. Three levels of the dungeon, painstakingly mapped over two weeks. It\'s completely wrong now — the dungeon shifted twice since I drew it — but it\'s ARTISTICALLY correct. The proportions are beautiful. The shading is exquisite. As a map, it\'s fiction. As art, it\'s a triumph.',
			[
				opt('Can I see it?', 'see_map', '#ff4'),
				opt('A beautiful, useless map. Poetic.', 'poetic', '#4f4'),
			]
		),
		see_map: node('see_map',
			'*They hand it over proudly.* Note the cross-hatching on the walls — that represents stone density. The dotted lines are suspected secret passages. The skull symbols are where I almost died. There are... a lot of skull symbols. *They point to a cluster.* That\'s where I fell into the same pit three times. In one day. The dungeon remembered I was clumsy and kept putting the pit in my path.',
			[
				opt('The dungeon targeted you specifically?', 'dungeon_mind', '#f44'),
				opt('This is impressive work, actually.', 'farewell', '#4f4'),
			]
		),
		poetic: node('poetic',
			'*They beam.* That\'s the nicest thing anyone\'s said about my work! Talia just calls them "elaborate doodles." Kael uses them as napkins. NAPKINS! Do you know how long I spent on the topographical contour lines?! Three hours! Per contour! He wiped soup off his chin with three hours of my life! *Deep breath.* I\'m fine. I\'m fine. This is fine.',
			[
				opt('You should keep moving. The stairs are northeast.', 'farewell', '#4f4'),
				opt('Any warnings about what\'s ahead?', 'dangers', '#ff4'),
			]
		),
		time_lost: node('time_lost',
			'*They check a tally scratched into the wall.* Eleven meals. But meals don\'t mean days because sometimes I eat twice when I\'m scared and sometimes I forget to eat entirely because something is trying to eat ME. So... between three and eleven days? Let\'s say a week. A long, lonely, terrifying week filled with wrong turns and questionable survival decisions.',
			[
				opt('What kind of questionable decisions?', 'bad_decisions', '#ff4'),
				opt('I can point you toward the exit.', 'directions', '#4f4'),
			]
		),
		bad_decisions: node('bad_decisions',
			'Where do I start? I tried befriending a Slime. It dissolved my backup map. I attempted to negotiate with a skeleton. It threw a bone at me — its OWN bone. I ate a glowing mushroom because I thought it might be magical food. It was not. I hallucinated that the walls were singing for six hours. Actually, the walls might have actually been singing. This dungeon makes it hard to tell.',
			[
				opt('The singing... everyone mentions the singing.', 'singing', '#f44'),
				opt('You need to get out of here.', 'farewell', '#4f4'),
			]
		),
		singing: node('singing',
			'*Their humor drains away.* You hear it too? The low, constant hum beneath everything? I thought it was tinnitus at first. Or stress. But it\'s always there, just below the edge of hearing. And it gets LOUDER in certain rooms. Rooms with those strange black stones in the walls. The Anchor Stones. It\'s like... the stones are vibrating in response to something below. Something that never stops.',
			[
				opt('The Anchor Stones. Thessaly studies those.', 'artifacts', '#8cf'),
				opt('I\'ll be careful. Good luck, Corwin.', 'farewell', '#4f4'),
			]
		),
		dungeon_mind: node('dungeon_mind',
			'I\'m convinced it learns. Not like a monster learns — not instinct, not pattern matching. Real learning. It watched me for two days, figured out my navigation habits, and then subtly rotated the entire floor layout by fifteen degrees. I didn\'t notice for hours because everything LOOKED right but was slightly wrong. Like a dream where your house has one extra door. The dungeon gaslights people. That\'s its hobby.',
			[
				opt('A gaslighting dungeon. Wonderful.', 'dangers', '#ff4'),
				opt('I need to keep moving. Stay safe.', 'farewell', '#0ff'),
			]
		),
		walls_move: node('walls_move',
			'*They stare at you.* Don\'t. Don\'t tell me that. I\'ve been telling myself the walls DON\'T move and that\'s the only thing keeping me sane. *They glance at the nearest wall.* Although... that crack WAS on the left side yesterday. I think. Maybe. *Long pause.* Great. Now I\'m going to be watching the walls. This is fine. Everything is fine. The walls are fine.',
			[
				opt('Want some survival tips?', 'dangers', '#ff4'),
				opt('You need to get to the stairs. Fast.', 'farewell', '#ff4'),
			]
		),
		rough: node('rough',
			'Rough is an understatement. "Catastrophic" is closer. "Existential nightmare" is accurate. I went to school for seven years to learn precision cartography and the dungeon treats my skills like a personal insult. Every time I finish a map, it rearranges. Like it\'s TAUNTING me. "Oh, nice map you\'ve got there. Would be a shame if someone... shifted everything three meters east."',
			[
				opt('That does sound personal.', 'dungeon_mind', '#8cf'),
				opt('Who are you, anyway?', 'backstory', '#ff4'),
			]
		),
		condition: node('condition',
			'*They gesture at themselves.* Armor dented from a skeleton ambush. Left boot dissolved by a slime — I\'m wearing a sack tied with rope. Seven bruises, two scrapes, and something that might be a curse but might also be a rash. The dungeon\'s humidity is murder on sensitive skin. I had a skincare routine before this expedition. Now I have... survival.',
			[
				opt('How did you end up here?', 'lost_story', '#ff4'),
				opt('Take care of yourself.', 'farewell', '#4f4'),
			]
		),
		dangers: node('dangers',
			'*They think hard.* This level? Watch for the trap clusters — the dungeon likes to put spike traps near treasure as a "tax." The monsters here coordinate more than the upper levels — I swear I saw goblins using hand signals. Oh, and check EVERY chest before opening it. I lost my last healing potion to a Mimic that I could have sworn was a real chest. It even had a convincing padlock.',
			[
				opt('Thanks for the tips.', 'farewell', '#4f4'),
				opt('Mimics with padlocks. Noted.', 'farewell', '#4f4'),
			]
		),
		advice_gift: node('advice_gift',
			'*They nod gratefully.* I appreciate it. More than you know. It\'s been... lonely. The darkness down here isn\'t just physical. It gets in your head. Makes you doubt yourself, your choices, whether the walls are actually there or just suggestions. *They straighten their dented armor.* But talking to you helps. Reminds me that the surface exists. That there\'s something worth climbing back to.',
			[
				opt('You\'ll make it back. I believe in you.', 'farewell', '#4f4'),
			]
		),
		farewell_cold: node('farewell_cold',
			'*Their face falls.* Right. Yeah. No, that\'s... that\'s fair. Everyone for themselves down here. I get it. *They force a smile.* I\'ll figure it out. I always do. Eventually. After several wrong turns and at least one near-death experience. It\'s my process. Very inefficient. But consistent.',
			[
				opt('[Leave conversation]', '__exit__', '#0ff'),
			]
		),
		farewell: node('farewell',
			'*They give you a grateful nod.* Thanks for stopping. Most people down here either try to eat me or run away screaming. A normal conversation is... nice. If you make it to the surface, tell the Cartographers\' Guild that Corwin says their maps are all wrong. They\'ll know it\'s me. I say it every time. *A tired smile.* Good luck down there.',
			[
				opt('[Leave conversation]', '__exit__', '#0ff'),
			]
		),
	}
};

// ─── DUNGEON: WHISPERING SHADE ───

export const SHADE_DIALOGUE: DialogueTree = {
	startNode: 'start',
	returnNode: 'return',
	nodes: {
		start: node('start',
			'*The translucent figure turns toward you. Its mouth moves but the sounds that emerge are not words you recognize — an ancient, resonant language that makes the air itself vibrate.*',
			[
				opt('[Listen carefully to the alien sounds]', 'garbled_greeting', '#8cf'),
				opt('[Back away slowly]', '__exit__', '#0ff'),
			]
		),
		return: node('return',
			'*The Shade flickers and regards you again, its ethereal form pulsing with a slow rhythm.*',
			[
				opt('[Try to communicate]', 'garbled_greeting', '#8cf'),
				opt('[Leave]', '__exit__', '#0ff'),
			]
		),
		garbled_greeting: node('garbled_greeting',
			'I have waited here since the walls were young. You are the first warm-blooded thing to approach without a sword drawn. How... refreshing. Most of your kind scream and run. The rest scream and attack. You are the rare third option: the one who listens.',
			[
				opt('[Ask who they are]', 'who', '#ff4'),
				opt('[Ask what this place is]', 'place', '#ff4'),
				opt('[Ask about the Eye]', 'eye', '#f44'),
				opt('[Leave quietly]', 'farewell', '#0ff'),
			],
			'Deepscript'
		),
		who: node('who',
			'I am a memory. A thought the dungeon had and forgot to un-think. When the Architects built this place, they left fragments of their consciousness in the stone — safety protocols, maintenance routines, warning systems. I am a warning. Specifically, I am the warning that nobody reads. You know those messages that say "Terms and Conditions Apply"? I am the terms and conditions. Of reality.',
			[
				opt('[Ask about the Architects]', 'architects', '#8cf'),
				opt('[Ask what the warning is]', 'warning', '#f44'),
				opt('[Leave]', 'farewell', '#0ff'),
			],
			'Deepscript'
		),
		architects: node('architects',
			'They had no name for themselves. Names imply an audience, and they had none. They were the first and, for a very long time, the only. They built the dungeon as one builds a cage — not for cruelty, but for containment. Something existed before them. Something that should not exist. They could not destroy it, so they buried it. Deep. The dungeon is the lock. Every level is a tumbler. And every adventurer who descends is unwittingly testing whether the lock still holds.',
			[
				opt('[Ask what is locked away]', 'eye', '#f44'),
				opt('[Ask about the levels as tumblers]', 'tumblers', '#8cf'),
				opt('[This is overwhelming. Leave.]', 'farewell', '#0ff'),
			],
			'Deepscript'
		),
		tumblers: node('tumblers',
			'Each level serves a purpose in the containment matrix. The upper levels generate threats — monsters, traps — to discourage descent. The middle levels confuse — shifting corridors, false exits — to disorient those who persist. The lower levels... persuade. They show you what you want. Gold. Power. Answers. The things that make people dig deeper. The dungeon is not trying to kill you. It is trying to make you CHOOSE to go deeper. That is far more effective.',
			[
				opt('[Ask why that matters]', 'choice', '#ff4'),
				opt('[Ask about the lowest levels]', 'lowest', '#f44'),
			],
			'Deepscript'
		),
		choice: node('choice',
			'Because the lock responds to intention. A person who falls into the depths damages nothing — the containment holds. But a person who CHOOSES to descend, who actively pushes deeper, who overrides every warning... that person becomes a key. Their will erodes the bindings. The Architects understood this. They made the dungeon unpleasant to discourage willpower. But your species has an infuriating abundance of it.',
			[
				opt('[So adventurers weaken the prison?]', 'weaken', '#f44'),
				opt('[Leave with this unsettling knowledge]', 'farewell', '#0ff'),
			],
			'Deepscript'
		),
		weaken: node('weaken',
			'Every hero who reaches a new depth loosens the bonds slightly. Every boss killed removes a warden. Every treasure taken unravels an anchor. The dungeon replenishes — it must — but each cycle weakens it. The thing below is patient. It has been patient for aeons. It can wait for one more adventurer. And one more after that. Until eventually, someone reaches the bottom and opens the door. Not because they wanted to. Because the dungeon made them want to.',
			[
				opt('[Is there any way to stop it?]', 'stop', '#4f4'),
				opt('[I need to leave. Now.]', 'farewell', '#0ff'),
			],
			'Deepscript'
		),
		stop: node('stop',
			'The Severance. The Architects built a fail-safe — a way to permanently sever the connection between the Eye and the surface world. It requires understanding the Deepscript, finding the Anchor Stones, and performing a ritual at the very bottom. The irony is exquisite: to save the world, you must do the one thing the dungeon wants — go all the way down. But you must do it with the RIGHT intention. The lock reads the heart.',
			[
				opt('[I understand. Thank you.]', 'farewell_deep', '#4f4'),
				opt('[That is terrifying.]', 'terrifying', '#f44'),
			],
			'Deepscript'
		),
		terrifying: node('terrifying',
			'Yes. The Architects thought so too. That is why they left warnings — entities like me, scattered through the levels, speaking in a language nobody bothers to learn. We are the instruction manual that humanity threw away. "Who reads the manual?" you ask. The answer is: the person who survives. I have told you more than I was designed to. The rest... you must discover for yourself.',
			[
				opt('[Thank them and leave]', 'farewell_deep', '#4f4'),
			],
			'Deepscript'
		),
		eye: node('eye',
			'*The Shade\'s form flickers violently, its edges fraying like smoke in wind.* Do not speak of it by name. Names are connections. Connections are pathways. Pathways go both ways. It is old. Older than this dungeon. Older than the Architects. It exists in a state that your language has no word for — not alive, not dead, not sleeping, not awake. It simply... persists. And it is aware. Always aware. It has been watching you since you entered. It watches everyone.',
			[
				opt('[Ask how to protect myself]', 'protection', '#ff4'),
				opt('[Ask about the Severance]', 'stop', '#8cf'),
				opt('[I\'ve heard enough]', 'farewell', '#0ff'),
			],
			'Deepscript'
		),
		protection: node('protection',
			'Speed. Do not linger on any level longer than necessary. The longer you stay, the more it learns about you. Detachment. Do not become attached to treasure, power, or progress. Attachment is a lever it can pull. And most importantly: purpose. Know WHY you are here. Hold that reason in your mind like a flame. The thing below cannot extinguish a flame it did not light. Your will is your armor. Do not let the dungeon replace it with desire.',
			[
				opt('[Wise advice. Thank you.]', 'farewell_deep', '#4f4'),
			],
			'Deepscript'
		),
		place: node('place',
			'This is the space between. The dungeon has layers — the physical corridors you walk, the metaphysical structure that maintains them, and the void beneath. I exist in the second layer. Think of me as... a comment in the code. Invisible to most. Meaningful to those who read the source. The Architects left many of us. Most have degraded. I persist because my warning is particularly important. Or because I am particularly stubborn. Perhaps both.',
			[
				opt('[What is your warning?]', 'warning', '#f44'),
				opt('[Tell me about the Architects]', 'architects', '#8cf'),
				opt('[Leave]', 'farewell', '#0ff'),
			],
			'Deepscript'
		),
		warning: node('warning',
			'Do not trust the treasure. Do not trust the power. Do not trust the feeling that you are special, that you are different, that YOU will be the one to conquer the dungeon. Every adventurer before you felt the same. That feeling is not yours. It is implanted. The dungeon cultivates heroes because heroes go deeper than cowards. And depth is all that matters to the thing below.',
			[
				opt('[I\'ll remember that]', 'farewell_deep', '#4f4'),
				opt('[How do I fight something I can\'t see?]', 'stop', '#ff4'),
			],
			'Deepscript'
		),
		lowest: node('lowest',
			'I have not seen them. My awareness extends only to the levels the Architects designated as "surface containment." But I have felt what lies below level twenty. The containment there is... thinner. The separation between the dungeon and the thing it contains becomes ambiguous. Garvus — a human who came through decades ago — reached those depths. He understood what he saw. That understanding broke him. Some truths are corrosive.',
			[
				opt('[Garvus? The drunk in the tavern?]', 'garvus_shade', '#ff4'),
				opt('[I should leave]', 'farewell', '#0ff'),
			],
			'Deepscript'
		),
		garvus_shade: node('garvus_shade',
			'You know him? Then you know what the dungeon does to those who see too much. He was strong — stronger than most. His mind survived the seeing, if not intact. He drinks to forget. I exist to remember. Between us, the truth persists. Broken, distributed, but persistent. Perhaps that is enough. Perhaps someone — perhaps you — can reassemble it.',
			[
				opt('[I\'ll try.]', 'farewell_deep', '#4f4'),
			],
			'Deepscript'
		),
		farewell: node('farewell',
			'*The Shade watches you go with hollow, luminous eyes.* You will return. They always return. The dungeon ensures it.',
			[
				opt('[Leave]', '__exit__', '#0ff'),
			],
			'Deepscript'
		),
		farewell_deep: node('farewell_deep',
			'*The Shade inclines its head — almost a bow.* You carry knowledge now. Knowledge is weight. Let it anchor you, not drag you down. And if you find more of my kind deeper in the dungeon... listen. We have been waiting a very long time to be heard.',
			[
				opt('[Leave with new understanding]', '__exit__', '#0ff'),
			],
			'Deepscript'
		),
	}
};

export const NPC_DIALOGUE_TREES: Record<string, DialogueTree> = {
	'Mother': MOTHER_DIALOGUE,
	'Father': FATHER_DIALOGUE,
	'Barkeep': BARKEEP_DIALOGUE,
	'Hooded Stranger': STRANGER_DIALOGUE,
	'Drunk Patron': DRUNK_DIALOGUE,
	'Thessaly': PRISONER_DIALOGUE,
	'Morrigan': MERCHANT_DIALOGUE,
	'Corwin': LOST_ADVENTURER_DIALOGUE,
	'Whispering Shade': SHADE_DIALOGUE,
};
