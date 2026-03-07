import type { DialogueTree, DialogueNode, DialogueCondition, SocialCheck, Rumor, Story } from './types';

function node(id: string, npcText: string, options: DialogueNode['options'], language?: string): DialogueNode {
	return { id, npcText, options, language };
}

function lie(id: string, npcText: string, options: DialogueNode['options']): DialogueNode {
	return { id, npcText, options, suspicious: true };
}

function opt(text: string, nextNode: string, color?: string, extras?: { onSelect?: DialogueNode['options'][0]['onSelect']; once?: boolean; showIf?: DialogueCondition; socialCheck?: SocialCheck }): DialogueNode['options'][0] {
	return { text, nextNode, color, ...extras };
}

function rumor(id: string, text: string, source: string, accuracy: Rumor['accuracy']): Rumor {
	return { id, text, source, accuracy };
}

function story(id: string, title: string, text: string, teller: string, type: Story['type']): Story {
	return { id, title, text, teller, type };
}

// ─── STORY CATALOGUE ───

export const STORIES: Record<string, Story> = {
	barkeep_merton: story('barkeep_merton', 'Old Merton\'s Last Patron', 'The previous tavern owner, Merton, served a customer who ordered "something strong enough to forget." Merton brewed a concoction so potent it erased the man\'s entire identity. He now works as a nameless farmhand outside Willowmere, perfectly content, growing turnips. Merton sold the tavern out of guilt. The recipe was lost. Probably for the best.', 'The Barkeep', 'personal'),
	barkeep_door: story('barkeep_door', 'The Slime and the Door', 'During the last dungeon surge, a gelatinous slime squeezed through the Rusty Flagon\'s cellar door, absorbed all of the Tuesday special, and then tried to pay for it. It left a gold coin in a puddle of dissolved stew. The coin was real. The Barkeep accepted it. "A paying customer is a paying customer, even if they\'re technically a liquid."', 'The Barkeep', 'personal'),
	barkeep_founders: story('barkeep_founders', 'The Founding of Willowmere', 'Two centuries ago, Aldric Willowmere set out from the capital with twelve wagons of trade goods, a hand-drawn map, and boundless optimism. He arrived at a clearing with zero wagons, no map, and the phrase "this is fine" tattooed on his increasingly limited worldview. He built a house. Others joined him, presumably also lost. Nobody has successfully navigated to or from the capital since. Willowmere exists because cartography is hard.', 'The Barkeep', 'legend'),
	stranger_first: story('stranger_first', 'The First Adventurer', 'The first person to enter the dungeon was a shepherd named Brin who chased a lost sheep through a crack in the earth. She descended forty levels, defeated the Guardian of the Threshold, befriended a colony of sentient mushrooms, and retrieved her sheep. When asked about the experience, she said: "Bit dark." She returned to shepherding and never spoke of it again. The mushrooms still ask about her.', 'Hooded Stranger', 'legend'),
	stranger_architects: story('stranger_architects', 'The Architects\' Departure', 'The beings who built the dungeon did not die. They did not leave. They were... compiled. Their consciousness was compressed into the walls, the floors, the traps, the treasure. Every room you enter is a fragment of a thought. Every corridor is a sentence in an unfinished argument. The dungeon is not a building. It is a conversation that has been happening for millennia, in a language of stone and shadow.', 'Hooded Stranger', 'lore'),
	stranger_convergence: story('stranger_convergence', 'The Convergence', 'Once every three hundred years, the dungeon aligns with something beyond this world. The walls thin. The floors become translucent. For one night, you can see through the stone to the spaces between realities — vast, dark oceans of nothing, with things moving in them. The last Convergence was two hundred and ninety-nine years ago. The next one is... soon. Very soon.', 'Hooded Stranger', 'cautionary'),
	drunk_chester: story('drunk_chester', 'Chester the Friendly Mimic', 'Garvus swears he once befriended a Mimic on level four by complimenting its grain pattern. "Beautiful oak finish," he told it, mid-attack. The Mimic was so flattered it stopped biting. They shared a meal — Garvus ate trail rations while Chester ate an adventurer\'s boot. They parted ways as friends. Garvus named it Chester. Chester has since eaten at least seven people. "But never me," Garvus insists proudly. "We have a bond."', 'Garvus', 'tall_tale'),
	drunk_delvers: story('drunk_delvers', 'The Silver Delvers\' Last Job', 'Five adventurers with matching cloaks and a team name descended to level fifteen. What they found there — a library of living text, an Eye that watched from below — split them apart more than any monster could. Four returned. One stayed. The four never spoke to each other again. Garvus drinks. Korrin disappeared. Lila took a contract in another kingdom. Brenn became a librarian, which everyone agrees is deeply ironic.', 'Garvus', 'personal'),
	drunk_recipe: story('drunk_recipe', 'Garvus\'s Secret Recipe', 'Between his sixth and ninth ale, Garvus will swear on his mother\'s grave that he invented a potion that makes you invisible to bosses. The ingredients: three mushrooms, a spider fang, and "the tears of someone who genuinely believes in you." He claims the last ingredient is the hardest to find in a dungeon. He has never successfully brewed this potion. The mushrooms were poisonous. He was hospitalized for a week. He still believes in the recipe.', 'Garvus', 'tall_tale'),
	thessaly_deepscript: story('thessaly_deepscript', 'The Language Before Language', 'Before mortal tongues shaped words, the Architects wrote Deepscript into the bones of the world. It is not a language of communication but of creation — each glyph is an instruction, a command to reality itself. The dungeon\'s walls are covered in it. The traps are sentences. The boss rooms are paragraphs. The entire dungeon is a program, still running, still executing code written by beings who no longer exist in any conventional sense.', 'Thessaly', 'lore'),
	thessaly_eye: story('thessaly_eye', 'The Eye Below', 'At the deepest point of the dungeon, embedded in living rock, there is an Eye. Not a creature\'s eye. Something older. Something that was here before the dungeon, before the Architects, before the world had a name. Thessaly believes the Architects didn\'t build the dungeon — they found the Eye and built the dungeon around it. A container. A prison. A monument. The Eye dreams, and its dreams become the dungeon\'s reality. When it blinks, floors rearrange. When it dreams deeply, new levels appear.', 'Thessaly', 'lore'),
	morrigan_slime: story('morrigan_slime', 'The Slime Fashion Industry', 'Morrigan once sold a decorative bow to a gelatinous slime. The slime absorbed it, became fashionable, and started a trend. Within a week, every slime on the level wanted accessories. Morrigan sold forty-seven tiny hats, twelve monocles, and a cravat. "Best week of my career," she recalls. "The cravat slime became their leader. President Cravat. Very dignified. Ate three adventurers with impeccable manners."', 'Morrigan', 'tall_tale'),
	morrigan_economy: story('morrigan_economy', 'The Dungeon Economy', 'According to Morrigan, the dungeon has a fully functioning economy. Goblins mine ore. Skeletons provide manual labor (cheap — they don\'t eat). Mimics run the banking sector ("very trustworthy if you don\'t try to open them"). Slimes handle waste management. The only thing the dungeon lacks is a tax authority, which Morrigan considers its greatest feature. "Pure capitalism," she says reverently. "Adam Smith would weep."', 'Morrigan', 'tall_tale'),
	corwin_circle: story('corwin_circle', 'The Perfect Circle', 'Corwin walked in a perfect circle for three hours on level six. He knows this because he counted his steps — 847 per loop — and made a tally mark on the wall each time. When he finally stopped, he found that his tally marks had been joined by someone else\'s. Smaller marks. Neater. In a different color. Someone — or something — had been walking the circle with him, keeping count. He never saw them. The marks were still there the last time he checked.', 'Corwin', 'personal'),
	corwin_map: story('corwin_map', 'The Map That Mapped Back', 'On level four, Corwin\'s map started updating itself. Lines appeared that he hadn\'t drawn — accurate lines, showing rooms he hadn\'t visited yet. At first he was thrilled. Then the map drew a room with a stick figure inside it. The stick figure was holding a map. The map in the drawing had a smaller stick figure. And so on. It was maps all the way down. He burned that map. The ashes reformed into a smaller, smugger map.', 'Corwin', 'personal'),
	mother_moonpetal: story('mother_moonpetal', 'The Moonpetal Harvest', 'Moonpetal flowers bloom only during thunderstorms, in the three seconds between lightning and thunder. You must pick them in that window or they dissolve. The player\'s mother once stayed out in a storm for six hours to gather enough for one healing salve. She was struck by lightning twice. Both times she got back up and kept picking. "The flowers don\'t pick themselves," she told her husband. He suggested she wait for the next storm. She gave him a look that made the lightning seem gentle.', 'Mother', 'personal'),
	mother_maren: story('mother_maren', 'Maren\'s Last Theory', 'Before she disappeared into the dungeon, the scholar Maren left a note on the village notice board. It read: "I believe the dungeon is a living argument between two cosmic forces who disagree about whether consciousness should exist. The monsters are counter-arguments. The treasure is bribery. The stairs going down are a rhetorical device. I am going to find out who is winning. If I don\'t come back, water my plants. The cactus is named Gerald." Gerald is still alive. He is the only being in Willowmere who has outlived every adventurer.', 'Mother', 'cautionary'),
	father_hat: story('father_hat', 'The Hat on Level Three', 'The player\'s father lost his favorite hat to a teleportation trap on level three. It was brown leather with a phoenix hawk feather. He spent four hours trying to get it back. He triggered the trap seventeen more times, sending increasingly angry notes to "whoever is in charge of this trap" through the teleportation field. The seventeenth note came back. It said "No." In his handwriting. The dungeon had learned to write by copying him. It kept the hat. He has never recovered.', 'Father', 'personal'),
	father_chair: story('father_chair', 'The Mirror Room', 'On level three, there is a room with nothing in it except a chair and a mirror. The mirror shows possible futures. The player\'s father sat in it twenty years ago and saw two paths: one where he died alone in the dungeon, and one where he grew old watching his child grow up. He chose the second path and never went back. He sometimes wonders what the mirror would show now. He does not wonder out loud. The chair, presumably, is still waiting.', 'Father', 'cautionary'),
	grikkle_rocks: story('grikkle_rocks', 'The Legend of Se\u00f1or Pebbleston', 'Se\u00f1or Pebbleston was, according to Grikkle, a rock of "extraordinary charisma and business acumen." Grikkle found him on level two and immediately recognized his potential. Se\u00f1or Pebbleston served as Grikkle\'s business partner for three months, during which time Grikkle claims the rock negotiated seventeen favorable trades, intimidated a rival goblin merchant, and once prevented a cave-in through "sheer force of geological personality." Se\u00f1or Pebbleston was tragically lost when Grikkle accidentally sold him to a Skeleton who mistook him for a premium kidney stone. Grikkle mourns daily.', 'Grikkle', 'tall_tale'),
	grikkle_bones: story('grikkle_bones', 'Mr. Bones and the Customer Service Dispute', 'Grikkle once sold a Skeleton named Mr. Bones a "Premium Reconstitution Kit" which was, in fact, a bag of random bones from the floor. Mr. Bones assembled himself with the new bones and ended up with three arms, two ribcages, and a pelvis where his head should be. He filed a formal complaint. In Morse code. By clacking his jaw. Grikkle offered a full refund (two pebbles) but Mr. Bones demanded "emotional damages." They reached a settlement: Grikkle would not sell bone-based products for one week. Grikkle lasted two days.', 'Grikkle', 'tall_tale'),
	shade_architects: story('shade_architects', 'The Architects\' Argument', 'The Whispering Shade speaks of the Architects not as builders but as debaters. They disagreed about everything — the length of corridors, the placement of traps, the philosophical implications of treasure chests. The dungeon\'s inconsistent layout is not poor design; it is the physical manifestation of an argument that has been running for millennia. Every dead end is a point conceded. Every loop is a circular argument. The boss rooms are dramatic conclusions to chapters of debate. The thing at the bottom is what they were arguing ABOUT.', 'Whispering Shade', 'lore'),
};

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
				opt('Tell me a story, Mother.', 'mother_stories', '#c8f'),
				opt('Just checking in.', 'checkin', '#4f4', { onSelect: { mood: 'friendly' } }),
				opt('Goodbye, Mother.', 'farewell', '#0ff'),
			]
		),
		mother_stories: node('mother_stories',
			'*She settles into her chair with the air of someone who has been WAITING to be asked.* Oh, you want stories? I have stories. Every mother does. We collect them like recipes \u2014 some sweet, some bitter, all worth sharing.',
			[
				opt('Tell me about the moonpetal harvest.', 'story_moonpetal', '#c8f', { once: true }),
				opt('Tell me about Maren\'s last theory.', 'story_maren_theory', '#c8f', { once: true }),
				opt('No more stories for now.', 'return', '#0ff'),
			]
		),
		story_moonpetal: node('story_moonpetal',
			'*She holds up her hands, showing faint scars.* You see these? Lightning marks. From the night I gathered moonpetal flowers for your first healing salve. They only bloom during thunderstorms \u2014 in the three seconds between lightning and thunder. Miss the window and they dissolve. I stood in that storm for six hours. Got struck twice. Got up both times. Your father begged me to come inside. I gave him a look. *She smiles.* He stopped asking after the second lightning strike. Said my expression was scarier than the storm. He wasn\'t wrong.',
			[
				opt('You got struck by lightning. TWICE. For me. [Story collected]', 'mother_stories', '#4f4', { onSelect: { story: STORIES.mother_moonpetal, message: 'You learned the story of your mother\'s impossible devotion.' } }),
			]
		),
		story_maren_theory: node('story_maren_theory',
			'*She looks wistful.* Before Maren disappeared into the dungeon, she pinned a note to the village board. It read: "I believe the dungeon is a living argument between two cosmic forces who disagree about whether consciousness should exist. The monsters are counter-arguments. The treasure is bribery. I am going to find out who is winning. If I don\'t come back, water my plants. The cactus is named Gerald." *She pauses.* I\'ve been watering Gerald ever since. Twenty years. He\'s the only being in Willowmere who has outlived every adventurer. He\'s also very prickly. I respect that.',
			[
				opt('Gerald the immortal cactus. I love it. [Story collected]', 'mother_stories', '#4f4', { onSelect: { story: STORIES.mother_maren, message: 'You learned about Maren\'s last theory and the immortal cactus Gerald.' } }),
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
		return_sad: node('return_sad',
			'*Her eyes are red. She\'s been crying.* I keep thinking about what happens if you don\'t come back. Your father tells me to stop worrying. But a mother\'s worry is infinite. It has no off switch. I tried. The switch broke.',
			[
				opt('I\'ll always come back, Mother.', 'return', '#4f4', { onSelect: { mood: 'friendly', message: 'Your mother brightens.' } }),
				opt('I need you to believe in me.', 'return', '#ff4', { onSelect: { mood: 'neutral' } }),
				opt('[Hug her silently]', 'mother_hug', '#4f4', { onSelect: { mood: 'friendly', hp: 2, message: 'Your mother\'s embrace heals more than potions. +2 HP' } }),
			]
		),
		mother_hug: node('mother_hug',
			'*She holds you for a long time. When she lets go, she\'s smiling through tears.* There. That\'s better. Now go be brave. And eat something. You look thin.',
			[
				opt('[Leave conversation]', '__exit__', '#0ff'),
			]
		),
		return_afraid: node('return_afraid',
			'*She flinches when she sees your wounds.* Oh no. Oh no, no, no. I KNEW this would happen. I told your father \u2014 I said "they\'re going to come back looking like a chewed boot" \u2014 and look at you!',
			[
				opt('It looks worse than it feels.', 'return', '#4f4', { onSelect: { mood: 'neutral' } }),
				opt('I\'m fine. Really.', 'return', '#4f4', { onSelect: { mood: 'sad', message: 'She doesn\'t believe you. Not even a little.' } }),
				opt('Can you patch me up?', 'return', '#ff4', { onSelect: { mood: 'friendly', hp: 3, message: 'Mother fusses over your wounds with practiced hands. +3 HP' } }),
			]
		),
		return_hostile: node('return_hostile',
			'*She crosses her arms. Her foot is tapping. The foot-tapping is never good.* You said something that hurt me last time. I don\'t care if you\'re a dungeon hero \u2014 you don\'t speak to your mother like that.',
			[
				opt('I\'m sorry, Mother. I didn\'t mean it.', 'return', '#4f4', { onSelect: { mood: 'neutral', message: 'She softens, but only a little.' } }),
				opt('You\'re right. I was wrong.', 'return', '#4f4', { onSelect: { mood: 'friendly', message: 'She nods firmly. Apology accepted. Motherhood is a dictatorship with mercy.' } }),
				opt('I stand by what I said.', '__exit__', '#f44', { onSelect: { mood: 'hostile', npcAction: 'break_down', message: 'She turns away. You hear quiet sobbing.' } }),
			]
		),
		return_amused: node('return_amused',
			'*She\'s actually laughing when you approach.* I was just telling Mrs. Greystone about your adventures. She doesn\'t believe the part about the goblin merchant. I told her "the goblin has a TOP HAT." She fainted.',
			[
				opt('The top hat is very real.', 'return', '#4f4', { onSelect: { mood: 'amused' } }),
				opt('Wait \u2014 you\'re telling people about this?', 'return', '#ff4', { onSelect: { mood: 'amused', message: 'She is absolutely telling everyone. The whole village knows about the top hat.' } }),
				opt('Mrs. Greystone faints at everything.', 'return', '#4f4', { onSelect: { mood: 'neutral' } }),
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
				opt('Tell me a story from the dungeon.', 'father_stories', '#c8f'),
				opt('Just saying hello.', 'hello', '#4f4'),
				opt('Goodbye, Father.', 'farewell', '#0ff'),
			]
		),
		father_stories: node('father_stories',
			'*He sets down his sword and leans forward.* Stories? From the dungeon? *He gets a faraway look.* I have a few. They\'re not bedtime stories. Then again, you\'re heading INTO a dungeon, so maybe that\'s appropriate.',
			[
				opt('Tell me about your hat.', 'story_hat', '#c8f', { once: true }),
				opt('Tell me about the mirror room.', 'story_mirror', '#c8f', { once: true }),
				opt('No stories today.', 'return', '#0ff'),
			]
		),
		story_hat: node('story_hat',
			'*His jaw tightens.* The Hat Incident. Level three. Teleportation trap. I was walking through a corridor, feeling confident \u2014 stupid word, confidence, it\'s just fear wearing a hat. Speaking of hats \u2014 MINE teleported off my head. Not me. Just the hat. I could see it on the other side of the trap, sitting on a rock, looking SMUG. I triggered the trap seventeen more times trying to retrieve it. I sent NOTES through the teleportation field. The seventeenth one came back. In my OWN HANDWRITING. It said "No." *Long pause.* The dungeon learned to write by copying me. It kept my hat. I have never forgiven it.',
			[
				opt('The dungeon WROTE BACK?! [Story collected]', 'father_stories', '#f44', { onSelect: { story: STORIES.father_hat, message: 'You learned the tragic tale of Father\'s lost hat.' } }),
			]
		),
		story_mirror: node('story_mirror',
			'*He goes very still.* Level three. There\'s a room. Nothing in it except a chair and a mirror. I sat down. I don\'t know why. Something TOLD me to sit. And the mirror... it showed me futures. Two of them, clear as day. In the first, I was on level thirteen. Alone. Fighting something I couldn\'t see. And losing. In the second... *His voice thickens.* ...I was old. Grey hair. Bad knee. Sitting in a house in Willowmere, watching a child run through the yard. MY child. *He looks at you.* I chose the second future. Walked out of the dungeon that night. Never went back. The mirror showed me you. And you were worth more than whatever is at the bottom.',
			[
				opt('...Dad. [Story collected]', 'father_stories', '#4f4', { onSelect: { story: STORIES.father_chair, message: 'You learned why your father truly left the dungeon. It was for you.' } }),
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
		return_sad: node('return_sad',
			'*He\'s sitting in the dark, holding an old adventurer\'s medallion.* I used to be fast, you know. Fastest blade in the Silver Delvers. Now I can barely open a jar. Time takes everything. Even the things you thought were permanent.',
			[
				opt('You\'re still the toughest person I know.', 'return', '#4f4', { onSelect: { mood: 'friendly', message: 'He clears his throat gruffly. Definitely not emotional.' } }),
				opt('Tell me about the Silver Delvers.', 'his_past', '#8cf', { onSelect: { mood: 'neutral' } }),
				opt('Want to arm-wrestle? Might cheer you up.', 'return', '#ff4', { onSelect: { mood: 'amused', message: 'He almost smiles. "You couldn\'t beat me with both hands and a head start."' } }),
			]
		),
		return_afraid: node('return_afraid',
			'*His hands are shaking. He\'s holding his old sword, eyes scanning the door.* The dungeon surges are getting worse. I can feel it in the ground. Same tremor as twenty years ago, right before level ten collapsed and took half the Delvers with it.',
			[
				opt('What happened on level ten?', 'his_past', '#ff4', { onSelect: { mood: 'sad' } }),
				opt('I\'ll handle whatever comes. That\'s my job now.', 'return', '#4f4', { onSelect: { mood: 'neutral', message: 'He nods slowly. "Yeah. Yeah, I suppose it is."' } }),
				opt('You don\'t have to be afraid anymore, Dad.', 'return', '#4f4', { onSelect: { mood: 'friendly' } }),
			]
		),
		return_hostile: node('return_hostile',
			'*He\'s pacing. His jaw is set in that way that means someone is about to get a lecture.* What you did down there was RECKLESS. You think I survived twenty years of dungeoneering by charging in like a drunken goat? There are RULES. There are STRATEGIES. There is a REASON old adventurers exist!',
			[
				opt('I\'m sorry, Father. I\'ll be more careful.', 'return', '#4f4', { onSelect: { mood: 'neutral', message: 'The jaw unclenches. Slightly.' } }),
				opt('Maybe YOUR strategy was being slow and cautious. Mine is different.', '__exit__', '#f44', { onSelect: { npcAction: 'storm_off', message: 'He throws his hands up and walks away. The door slams.' } }),
				opt('Teach me, then. Show me the right way.', 'combat_tips', '#ff4', { onSelect: { mood: 'friendly', message: 'He stops pacing. Teaching is what he was built for.' } }),
			]
		),
		return_amused: node('return_amused',
			'*He\'s chuckling to himself when you arrive.* Your mother just told me about the goblin with the top hat. She did an impression. The impression was... *he wipes his eyes* ...it was VERY accurate. She even did the voice. The tiny little goblin sales pitch voice.',
			[
				opt('Mother does impressions?', 'return', '#4f4', { onSelect: { mood: 'amused' } }),
				opt('The goblin\'s name is Grikkle. Show some respect.', 'return', '#ff4', { onSelect: { mood: 'amused', message: '"Grikkle. Even the NAME is funny."' } }),
				opt('I need to hear this impression.', 'return', '#4f4', { onSelect: { mood: 'amused' } }),
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
				opt('Got any good stories?', 'stories_menu', '#c8f'),
				opt('I\'m on an urgent mission. I need a drink on the house.', 'social_persuade', '#4cf', { socialCheck: { skill: 'persuade', difficulty: 10, successNode: 'persuade_drink_ok', failNode: 'persuade_drink_fail' }, once: true }),
				opt('You WILL tell me everything about this dungeon. Now.', 'social_intimidate', '#f84', { socialCheck: { skill: 'intimidate', difficulty: 12, successNode: 'intimidate_barkeep_ok', failNode: 'intimidate_barkeep_fail' }, once: true }),
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
				opt('Tell me a story.', 'stories_menu', '#c8f'),
				opt('Tell me about the dungeon.', 'dungeon', '#ff4'),
				opt('[Warrior] Any combat tips for a swordsman?', 'warrior_tips', '#f84', { showIf: { type: 'class', value: 'warrior' } }),
				opt('[Mage] Know anything about magical anomalies down there?', 'mage_tips', '#84f', { showIf: { type: 'class', value: 'mage' } }),
				opt('[Rogue] Hear about any good loot to... liberate?', 'rogue_tips', '#4f8', { showIf: { type: 'class', value: 'rogue' } }),
				opt('I barely made it back alive...', 'barely_alive', '#f44', { showIf: { type: 'hpBelow', value: 30 } }),
				opt('I\'ve been deep. Really deep.', 'veteran_talk', '#ff4', { showIf: { type: 'minLevel', value: 8 } }),
				opt('I\'ve killed a LOT of things down there.', 'barkeep_slayer', '#f84', { showIf: { type: 'minEnemiesKilled', value: 50 } }),
				opt('I found some hidden rooms...', 'barkeep_secrets', '#c8f', { showIf: { type: 'minSecretsFound', value: 3 } }),
				opt('I beat a boss!', 'barkeep_boss_kill', '#ff4', { showIf: { type: 'hasBossKills', value: 1 } }),
				opt('[Cave Escapee] Remember when I escaped those goblins?', 'barkeep_cave_origin', '#8f4', { showIf: { type: 'startingLocation', value: 'cave' } }),
				opt('Just need a moment to rest.', 'rest', '#4f4'),
				opt('Look, about all the lies...', 'liar_confession', '#fa4', { showIf: { type: 'knownLiar', value: 3 } }),
				opt('See you later, Barkeep.', 'farewell', '#0ff'),
			]
		),
		barkeep_slayer: node('barkeep_slayer',
			'*He whistles low.* Fifty kills? FIFTY? *He pulls out a tattered ledger from beneath the counter.* I keep a running tally of every adventurer who comes through here. Kill counts, survival rates, average drinks consumed before heading back in. You know what the average adventurer kills before they die? Seven. SEVEN. And most of those are rats. You\'re practically a natural disaster at this point. *He flips to a page.* Let me update your entry... "prolific," I\'ll write. No \u2014 "EXTREMELY prolific." The monsters down there must have a WANTED poster of you by now.',
			[
				opt('Do monsters actually have wanted posters?', 'barkeep_wanted', '#ff4'),
				opt('What\'s the record?', 'barkeep_record', '#8cf'),
			]
		),
		barkeep_wanted: node('barkeep_wanted',
			'*He leans in conspiratorially.* Morrigan told me she saw one. Tacked to a wall on level four. Hand-drawn, very unflattering portrait. Listed your crimes as "excessive violence," "potion theft," and "being mean to Slimes." There was a reward: two dead rats and a rusty sword. *He pauses.* The Slimes pooled their resources. I don\'t want to know how Slimes pool resources. It\'s probably dissolving.',
			[
				opt('I\'m honored and disgusted.', 'return', '#4f4'),
			]
		),
		barkeep_record: node('barkeep_record',
			'*He flips to the front of the ledger.* The all-time record belongs to Korrin the Vast \u2014 one of the Silver Delvers. Two hundred and forty-three confirmed kills. Also held the record for "most food consumed in a single sitting," "loudest burp recorded in Willowmere," and "most bones broken in one\'s own body during a fight." He was not a subtle man. He once killed a Mimic by sitting on it. Didn\'t even know it was there. Just wanted a chair.',
			[
				opt('That\'s... inspirational?', 'return', '#4f4', { onSelect: { message: 'You feel inspired by Korrin\'s legacy of indiscriminate violence.' } }),
			]
		),
		barkeep_secrets: node('barkeep_secrets',
			'*His eyes light up.* SECRET rooms?! *He grabs a quill and paper.* Tell me EVERYTHING. I\'ve been compiling a map of every secret passage and hidden chamber reported by adventurers for TWENTY YEARS. It\'s my masterwork. My magnum opus. *He unfurls a massive scroll covered in contradictory scribbles.* As you can see, it is... a work in progress. Half the passages overlap, three of the rooms apparently exist inside each other, and this entire section \u2014 *he points to a corner* \u2014 was drawn by Garvus while drunk, so it\'s just a picture of a horse.',
			[
				opt('That is the worst map I\'ve ever seen.', 'barkeep_bad_map', '#f44'),
				opt('I can help you fill it in.', 'barkeep_help_map', '#4f4'),
			]
		),
		barkeep_bad_map: node('barkeep_bad_map',
			'*He clutches the scroll to his chest, offended.* It\'s IMPRESSIONISTIC. You wouldn\'t understand. Corwin \u2014 the cartographer \u2014 took one look at it and wept. I ASSUMED those were tears of appreciation. He later clarified they were tears of professional anguish. But the SPIRIT of the map is accurate. Probably. The horse is definitely wrong, I\'ll grant you that. Unless there IS a horse on level seven. Nobody has disproven it.',
			[
				opt('Nobody can disprove a dungeon horse. Fair point.', 'return', '#4f4', { onSelect: { mood: 'amused' } }),
			]
		),
		barkeep_help_map: node('barkeep_help_map',
			'*His face lights up like a lantern.* Would you? REALLY? Oh, this is wonderful! *He hands you a charcoal stick.* Just mark the locations as best you can. And please \u2014 no horses. Unless you actually SEE a horse. *He leans in.* In which case, DEFINITELY draw the horse. I need to settle a bet with Garvus. [+5 HP from sheer gratitude]',
			[
				opt('You got it, Barkeep.', 'return', '#4f4', { onSelect: { hp: 5, message: 'The Barkeep\'s gratitude is palpable! +5 HP', mood: 'friendly' } }),
			]
		),
		barkeep_boss_kill: node('barkeep_boss_kill',
			'*He SLAMS his hand on the counter.* A BOSS?! You killed a BOSS?! *He starts rummaging behind the bar.* This calls for the good stuff! Not the "good" stuff I serve tourists \u2014 the ACTUAL good stuff! *He produces a bottle that seems to glow faintly.* Last time someone killed a boss, the Silver Delvers threw a party that lasted three days. Garvus arm-wrestled a table and LOST. The table was not enchanted. He was just that drunk. *He pours.* To you, boss-slayer!',
			[
				opt('Cheers! What can you tell me about bosses? [+6 HP]', 'barkeep_boss_lore', '#4f4', { onSelect: { hp: 6, message: 'Premium celebratory drinks! +6 HP' } }),
			]
		),
		barkeep_boss_lore: node('barkeep_boss_lore',
			'The bosses are the dungeon\'s immune system. Every five levels, there\'s a guardian \u2014 something the dungeon grew specifically to stop invaders. They\'re not just strong, they\'re PURPOSE-built. Each one learns from the adventurers who failed before you. That Shadow you fought? It studied the fighting styles of everyone it killed. You didn\'t just beat a monster \u2014 you beat the combined experience of every adventurer who DIDN\'T beat it. *He refills your glass.* That\'s why it matters. That\'s why I keep the ledger. Every victory down there is standing on a pile of defeats.',
			[
				opt('That\'s... heavy.', 'return', '#4f4', { onSelect: { rumor: rumor('boss_immune_system', 'Dungeon bosses are living immune systems that learn from previous adventurers\' failures.', 'Barkeep', 'true') } }),
			]
		),
		barkeep_cave_origin: node('barkeep_cave_origin',
			'*He chuckles.* Remember? Friend, EVERYONE remembers. You showed up at my door looking like something a goblin chewed on and spat out \u2014 because that is LITERALLY what happened. Thessaly dragged you in, you collapsed on my best table, and you bled on three menus. Do you know how hard it is to get adventurer blood out of parchment? Very. I had to rewrite the daily specials. *He shakes his head fondly.* And now look at you. From goblin prisoner to dungeon veteran. The character arc is impressive.',
			[
				opt('I still have nightmares about that cell.', 'barkeep_cave_nightmares', '#f44'),
				opt('Thessaly saved my life that day.', 'barkeep_cave_thessaly', '#8cf'),
			]
		),
		barkeep_cave_nightmares: node('barkeep_cave_nightmares',
			'Nightmares are just the dungeon\'s way of sending thank-you cards. "Dear adventurer, thank you for visiting. We hope you enjoyed the imprisonment, starvation, and psychological trauma. Please rate your experience: one skull for \'would not recommend\' to five skulls for \'actively soul-destroying.\'" *He pats your hand.* It gets easier. Or you get used to it. One of those two. I can never remember which.',
			[
				opt('Your bedside manner needs work.', 'return', '#4f4', { onSelect: { mood: 'amused' } }),
			]
		),
		barkeep_cave_thessaly: node('barkeep_cave_thessaly',
			'*His expression softens.* Aye, she did. She had that way about her \u2014 couldn\'t pass someone in trouble without helping. It\'s why she went back into the dungeon, you know. She heard there were MORE prisoners deeper down. Went to help them. *He goes quiet.* That was six months ago. Nobody knows exactly what happened. The deeper levels... they change people. Or they TAKE people. With Thessaly, I honestly don\'t know which would be worse. She\'s the strongest person I ever met. If she couldn\'t make it back...',
			[
				opt('I\'ll find out what happened to her. I promise.', 'return', '#4f4', { onSelect: { mood: 'friendly', rumor: rumor('thessaly_deep', 'Thessaly went deeper into the dungeon to rescue other prisoners six months ago and never returned.', 'Barkeep', 'true'), message: 'The Barkeep looks at you with desperate hope.' } }),
			]
		),
		liar_confession: node('liar_confession',
			'*He stops polishing and gives you a long, hard look.* Oh. So you\'ve heard. *He sets down the glass.* Word travels fast in a tavern, friend. The Hooded Stranger mentioned you have a "flexible relationship with the truth." Morrigan called you \u2014 and I quote \u2014 "a delightful little liar, almost as good as me but without the profit margin." Even Grikkle knows, and he believes ROCKS are currency. When a goblin who trades in PEBBLES questions your honesty, you\'ve hit rock bottom. Pun intended.',
			[
				opt('I had my reasons.', 'liar_reasons', '#ff4'),
				opt('Is it really that bad?', 'liar_reputation', '#8cf'),
				opt('I\'m trying to be better.', 'liar_redemption', '#4f4'),
			]
		),
		liar_reasons: node('liar_reasons',
			'*He leans on the counter.* Everybody has reasons. The guy who told me his tab was "on the house" had reasons. The woman who claimed she was "the Duchess of Somewhere" to get the VIP table had reasons. You know what they all have in common? They still owed me money. Reasons don\'t fill the honesty jar, friend. *He taps a literal jar on the counter labeled "HONESTY JAR \u2014 deposit truth here."* I put that up after the third adventurer tried to pay with counterfeit courage.',
			[
				opt('Fair point. Can I make it up to you?', 'liar_redemption', '#4f4'),
				opt('That jar is ridiculous.', 'return', '#0ff'),
			]
		),
		liar_reputation: lie('liar_reputation',
			'*He counts on his fingers.* Let me see. You lied to Morrigan \u2014 she\'s actually impressed, which is terrifying. You tried to deceive the Hooded Stranger \u2014 NOBODY fools them, they\'re literally part of the dungeon. I heard a Mimic refuse to disguise itself as a chest near you because, and I quote, "that one lies more than I do and I\'m LITERALLY a living deception." You\'ve out-lied a professional liar. That\'s almost an achievement.',
			[
				opt('...A Mimic said that about me?', 'liar_mimic', '#f44'),
				opt('I should probably stop lying.', 'liar_redemption', '#4f4'),
			]
		),
		liar_mimic: node('liar_mimic',
			'*He nods solemnly.* It was very articulate for a chest. It had feelings, apparently. You\'ve given a Mimic an existential crisis. It\'s now questioning whether it\'s REALLY a chest pretending to be a monster, or a monster pretending to be a chest pretending to be honest. Last I heard it was seeking therapy from a Gelatinous Cube. *He shakes his head.* The Cube is not a licensed therapist but it IS a good listener. Mostly because it dissolves anyone who interrupts.',
			[
				opt('That\'s the best worst thing I\'ve ever heard.', 'liar_redemption', '#4f4'),
			]
		),
		liar_redemption: node('liar_redemption',
			'*He pours you a drink \u2014 a small one.* Look, everyone deserves a second chance. Even serial liars. Even the Mimic. *He slides the glass over.* Tell you what. From now on, try being straight with people. Not because lying is wrong \u2014 it clearly works, you\'re still alive \u2014 but because down here, trust is the only currency that actually holds its value. Gold corrodes. Potions expire. But if people trust you, they\'ll watch your back when the shadows come. And the shadows ALWAYS come.',
			[
				opt('Thanks, Barkeep. I\'ll try. [+3 HP]', 'return', '#4f4', { onSelect: { hp: 3, message: 'The Barkeep\'s forgiveness warms your spirit. +3 HP', mood: 'friendly' } }),
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
		warrior_tips: node('warrior_tips',
			'*He sizes you up.* A swordsman, eh? Your father was one too, you know. Best advice I can give: narrow corridors are your best friend. Let the monsters come to you single-file. Your whirlwind attack is devastating in rooms, but don\'t blow it on one rat and then get mobbed by five goblins. Also \u2014 and this is important \u2014 blocking reduces damage significantly. Don\'t be too proud to turtle up when you\'re outnumbered. Pride gets swordsmen killed. Caution gets them another round at my bar.',
			[
				opt('Solid advice. I\'ll keep that in mind.', 'return', '#4f4'),
			]
		),
		mage_tips: node('mage_tips',
			'*He whistles through his teeth.* A mage? Down THERE? Brave. Or foolish. The line between the two is thinner than spider silk. The dungeon has... opinions about magic. Some floors amplify it. Others suppress it. Below level ten, the ambient magic gets weird \u2014 spells sometimes have unexpected side effects. Also, your blink ability? Lifesaver. Literally. When things go sideways \u2014 and they WILL go sideways \u2014 blink first, think second. Dead mages don\'t publish papers.',
			[
				opt('Blink first, think second. Got it.', 'return', '#4f4'),
			]
		),
		rogue_tips: node('rogue_tips',
			'*He leans in conspiratorially.* A rogue, hm? Good. The dungeon REWARDS the sneaky. Here\'s what the swordsmen won\'t tell you: every boss has a pattern. They telegraph their big attacks. A rogue who watches and waits can exploit the gaps between swings. Your invisibility? Perfect for repositioning. Get behind \'em. Also \u2014 you can sense traps better than anyone. That\'s not just a nice bonus, that\'s a SURVIVAL MECHANISM. The deep floors are riddled with the things.',
			[
				opt('Watch, wait, exploit. My specialty.', 'return', '#4f4'),
			]
		),
		barely_alive: node('barely_alive',
			'*His face falls as he sees the state of you.* Gods above. You look like you tried to wrestle a mimic. SIT. Sit down right now. *He pours something from a special bottle behind the bar \u2014 not the regular ale.* This is the emergency reserve. Made from moonpetal extract. Same stuff your mother uses in her salves. Drink it. All of it. And don\'t you DARE go back down there until you\'re feeling better.',
			[
				opt('Thank you, Barkeep. [Drink the emergency reserve]', 'return', '#4f4', { onSelect: { hp: 8, message: 'The Barkeep\'s emergency reserve warms you from the inside! +8 HP' } }),
			]
		),
		veteran_talk: node('veteran_talk',
			'*He stares at you with a mix of awe and concern.* Level eight? Or deeper? *He shakes his head slowly.* You\'ve gone further than most. Further than your father, further than the Silver Delvers when they were your age. You\'ve got the look now. That thousand-yard stare. Every deep delver gets it. *He refills your mug without being asked.* The dungeon is changing you, isn\'t it? You can feel it in the back of your skull. A humming. A presence. That\'s normal. Or at least, it\'s common. Whether it\'s "normal" is a philosophical question I\'m not qualified for.',
			[
				opt('The humming... yes. What does it mean?', 'humming', '#f44'),
				opt('I\'m fine. Really.', 'return', '#4f4'),
			]
		),
		humming: node('humming',
			'*He drops his voice.* The Hooded Stranger says it\'s the dungeon acknowledging you. Like a nod from a predator that respects its prey. The deeper you go, the louder it gets. Garvus said at level fifteen it was deafening. Like standing inside a bell. And the Eye... *He catches himself.* You\'ll know when you feel it. Everyone does. Just... remember who you are. The dungeon has a way of making people forget. Your name, your reasons, your way back. Hold onto those.',
			[
				opt('I will. I promise.', 'farewell', '#4f4'),
			]
		),
		persuade_drink_ok: node('persuade_drink_ok',
			'*He sizes you up, then nods slowly.* You know what? You DO look like you\'re on a mission. And I\'ve been in this business long enough to know when someone genuinely needs liquid courage. *He pours a double from the top shelf.* Here. The good stuff. Don\'t tell anyone I gave you this for free \u2014 I have a reputation as a ruthless capitalist to maintain.',
			[
				opt('You\'re a good man, Barkeep. [Take the good stuff]', 'return', '#4f4', { onSelect: { hp: 6, message: 'The Barkeep\'s top-shelf special warms your bones! +6 HP' } }),
			]
		),
		persuade_drink_fail: node('persuade_drink_fail',
			'*He raises an eyebrow.* An "urgent mission," huh? That\'s what they ALL say. Last week a man claimed he was on an "urgent mission" to find his lost cat. He drank seventeen ales and passed out under the table. The cat was on his head. *He shakes his head.* Nice try. You want a drink, you ask politely like everyone else.',
			[
				opt('Fair enough. I\'ll take a regular drink. [Accept heal]', 'drink', '#4f4', { onSelect: { hp: 3, message: 'The Barkeep pours you a drink! +3 HP' } }),
				opt('Worth a shot.', 'return', '#fff'),
			]
		),
		intimidate_barkeep_ok: node('intimidate_barkeep_ok',
			'*He takes a step back, eyes widening.* Whoa, whoa. Easy there. No need for... whatever that tone was. *He glances nervously at your weapon.* Look, I\'ll tell you what I know. The dungeon\'s getting worse. More creatures. Stranger ones. And there\'s something on level five that wasn\'t there before \u2014 something that hums. The hooded stranger won\'t shut up about it. Whatever\'s down there, it\'s WAKING UP. Happy? Please stop looking at me like that.',
			[
				opt('Thank you for your cooperation. [Rumor learned]', 'return', '#4f4', { onSelect: { mood: 'afraid', rumor: RUMORS.potions_matter, message: 'The Barkeep nervously reveals dungeon secrets.' } }),
			]
		),
		intimidate_barkeep_fail: node('intimidate_barkeep_fail',
			'*He leans forward, unfazed.* Listen, friend. I\'ve been running a bar next to a monster-infested dungeon for fifteen years. I\'ve had ACTUAL demons try to intimidate me. One of them ordered a drink, complained about the temperature, and BREATHED FIRE on my bar counter. I charged him for the damage AND the drink. You\'re going to have to try a LOT harder than that.',
			[
				opt('...I respect that.', 'return', '#4f4', { onSelect: { mood: 'amused' } }),
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
		stories_menu: node('stories_menu',
			'*He sets down the mug he\'s polishing.* Stories? Oh, I\'ve got plenty. Running a dungeon-adjacent tavern, you hear things. What kind of story do you want?',
			[
				opt('Tell me about the previous owner.', 'story_merton', '#c8f', { once: true }),
				opt('What\'s the funniest thing that happened here?', 'story_door', '#c8f', { once: true }),
				opt('How was this village founded?', 'story_founders', '#c8f', { once: true }),
				opt('That\'s enough stories.', 'start', '#0ff'),
			]
		),
		story_merton: node('story_merton',
			'*He leans on the bar.* Old Merton owned this place before me. Good man. Terrible mixologist. One night, a customer walks in and says: "Give me something strong enough to forget." Merton took it as a CHALLENGE. He brewed something from dungeon mushrooms, spider venom, and \u2014 I think \u2014 turpentine. The customer drank it, stood up, and said: "Who am I? Where am I? What is a name?" *The Barkeep shakes his head.* Complete identity erasure. The customer was delighted. He\'s now a turnip farmer outside town. Happiest man in Willowmere. Doesn\'t know his own name. Doesn\'t care. Merton sold the tavern the next day.',
			[
				opt('That\'s both tragic and hilarious. [Story collected]', 'stories_menu', '#4f4', { onSelect: { story: STORIES.barkeep_merton } }),
			]
		),
		story_door: node('story_door',
			'*He laughs before he even starts.* The Slime Incident. Last dungeon surge, right? A gelatinous slime oozes up through my cellar. Absorbs the entire Tuesday special \u2014 twelve servings of beef stew. I\'m standing there with a broom, ready to fight, and it just... stops. Sits there. Jiggles contentedly. Then it EXTRUDES A GOLD COIN. Pushes one right out of its body. Plop. On the bar. And then it slides back into the cellar like nothing happened. *He holds up a coin.* Genuine gold. A paying customer is a paying customer, even if they\'re technically a liquid.',
			[
				opt('You accepted payment from a slime?! [Story collected]', 'stories_menu', '#4f4', { onSelect: { story: STORIES.barkeep_door } }),
			]
		),
		story_founders: node('story_founders',
			'*He straightens up \u2014 this one he takes seriously.* Two hundred years ago, a merchant named Aldric Willowmere left the capital with twelve wagons and a hand-drawn map. The map was spectacularly wrong. "Ocean where there should be mountains" wrong. He got SO lost that he stood in a clearing, looked around, and said \u2014 I quote his journal \u2014 "This is fine." Built a house. Other lost travelers found him. Someone opened a shop. Someone planted crops. Eventually they had a village entirely populated by people who couldn\'t find anywhere else. We don\'t talk about it.',
			[
				opt('Founded by accident. Classic. [Story collected]', 'stories_menu', '#4f4', { onSelect: { story: STORIES.barkeep_founders } }),
			]
		),
		// ─── MOOD-SPECIFIC RETURN NODES ───
		return_hostile: node('return_hostile',
			'*He looks up with a cold expression.* Oh. It\'s YOU. *He pointedly polishes a glass and does not offer you a drink.* I remember what you said last time. I don\'t forget. This bar has a long memory and an even longer grudge. You want to talk? Start with an apology.',
			[
				opt('I\'m sorry about before. I was out of line.', 'return', '#4f4', { onSelect: { mood: 'neutral', message: 'The Barkeep\'s expression softens slightly.' } }),
				opt('Fine. I don\'t need your drinks anyway.', 'hostile_standoff', '#f44'),
				opt('[Leave]', '__exit__', '#0ff'),
			]
		),
		hostile_standoff: node('hostile_standoff',
			'*He sets down the glass with a deliberate clink.* Correct. You don\'t. Because I\'m not serving you. I\'ve refused service to DEMONS \u2014 actual fire-breathing, soul-consuming demons \u2014 for lesser offenses. One of them cried. CRIED. Demon tears, in case you\'re wondering, are acidic. Burned a hole in my counter. Still a more pleasant interaction than this one.',
			[
				opt('Okay, maybe I WAS a bit rude...', 'return', '#4f4', { onSelect: { mood: 'neutral', message: 'The Barkeep unclenches slightly.' } }),
				opt('[Leave quietly]', '__exit__', '#0ff'),
			]
		),
		return_afraid: node('return_afraid',
			'*He flinches when he sees you, then tries to hide it by wiping the counter very aggressively.* Oh! You\'re back! Great! Wonderful! I was just... cleaning. Vigorously. Not nervously at all. *His voice drops to a whisper.* Listen, I\'ve been thinking about what you said, and I pulled out some old stock from the back. Things I normally don\'t share. Want to see?',
			[
				opt('Show me what you\'ve got.', 'afraid_special', '#4f4'),
				opt('Relax, I\'m not going to hurt you.', 'return', '#4f4', { onSelect: { mood: 'neutral', message: 'The Barkeep exhales with visible relief.' } }),
				opt('[Leave]', '__exit__', '#0ff'),
			]
		),
		afraid_special: node('afraid_special',
			'*He reaches under the counter and produces a dusty bottle with no label.* This is from the Deepceller Reserve. Aged in barrels carved from dungeon heartwood \u2014 trees that grew in the caverns where no light reaches. It tastes like starlight and regret. I\'ve been saving it for a special occasion, but frankly I\'m too terrified of you to charge full price. Half off. Please take it.',
			[
				opt('Take the Deepceller Reserve. [+8 HP]', 'return', '#4f4', { onSelect: { hp: 8, message: 'The Deepceller Reserve fills you with warmth and faint cosmic nostalgia! +8 HP', mood: 'neutral' } }),
			]
		),
		return_amused: node('return_amused',
			'*He breaks into a grin the moment he sees you.* HA! There\'s my favorite customer! *He\'s already pouring.* You know, I\'ve been telling the other patrons about you. Garvus nearly fell off his stool laughing. The Hooded Stranger didn\'t react, but I think I saw one corner of the hood twitch. That\'s basically a standing ovation from them.',
			[
				opt('What can you tell me today?', 'return', '#ff4'),
				opt('I aim to entertain.', 'amused_bonus', '#4f4'),
				opt('[Leave]', '__exit__', '#0ff'),
			]
		),
		amused_bonus: node('amused_bonus',
			'*He slides you a drink with a wink.* On the house. For comedic services rendered. You know, most adventurers come in here all brooding and dramatic. "The darkness calls." "I seek vengeance." "My family was murdered by wolves." YOU walk in and make me laugh. That\'s worth more than gold in this profession. Trust me \u2014 I\'ve seen what brooding does to tip averages.',
			[
				opt('Cheers! [+4 HP]', 'return', '#4f4', { onSelect: { hp: 4, message: 'A complimentary drink from the amused Barkeep! +4 HP' } }),
			]
		),
		return_sad: node('return_sad',
			'*He\'s staring into an empty glass when you approach. He looks up with tired eyes.* Ah. You again. *He forces a smile that doesn\'t quite reach.* Sorry. Just... thinking about the old days. Before the dungeon got worse. Before Garvus stopped being Garvus. Before Thessaly disappeared. This tavern used to be full of laughter. Now it\'s full of last drinks before last journeys.',
			[
				opt('Are you alright?', 'sad_comfort', '#4f4'),
				opt('Tell me about the old days.', 'sad_memories', '#8cf'),
				opt('[Give him space]', '__exit__', '#0ff'),
			]
		),
		sad_comfort: node('sad_comfort',
			'*He takes a deep breath.* I\'m fine. I\'m always fine. That\'s what bartenders do \u2014 we\'re fine so everyone else can fall apart. *He straightens up.* But thanks for asking. Most people don\'t. They just order drinks and dump their problems on me. Nobody ever asks if the barkeep has problems of his own. *A genuine, if small, smile.* You\'re alright, you know that?',
			[
				opt('You\'re alright too, Barkeep.', 'return', '#4f4', { onSelect: { mood: 'friendly', message: 'The Barkeep seems genuinely touched.' } }),
			]
		),
		sad_memories: node('sad_memories',
			'*His eyes go distant.* Twenty years ago this place was packed every night. The Silver Delvers used to hold court at the big table \u2014 five of them, laughing, arm-wrestling, arguing about whose turn it was to buy rounds. Thessaly would be scribbling in her journal. Garvus would be challenging people to duels he always won. Korrin would be eating everything in sight. *He chuckles sadly.* Then they went to level fifteen. And when they came back... they weren\'t the same people anymore. Nobody who goes that deep ever is.',
			[
				opt('People still come here. You still matter.', 'return', '#4f4', { onSelect: { mood: 'friendly', message: 'The Barkeep\'s eyes brighten.' } }),
				opt('What happened to them?', 'drunk_past', '#8cf'),
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
				opt('Tell me a tale of the dungeon.', 'stranger_stories', '#c8f'),
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
				opt('Share a tale with me.', 'stranger_stories', '#c8f'),
				opt('[Deepscript] I can read the old writing now.', 'deepscript_talk', '#a8f', { showIf: { type: 'knowsLanguage', value: 'Deepscript' } }),
				opt('[Elvish] The old words come to me now.', 'elvish_talk', '#a8f', { showIf: { type: 'knowsLanguage', value: 'Elvish' } }),
				opt('Can you teach me Elvish?', 'stranger_teach_elvish', '#ff4'),
				opt('I\'ve collected many secrets now...', 'many_secrets', '#ff4', { showIf: { type: 'hasRumors', value: 5 } }),
				opt('Any new insights?', 'insights', '#8cf'),
				opt('I\'ve cleared many levels now.', 'stranger_veteran', '#ff4', { showIf: { type: 'minLevelsCleared', value: 5 } }),
				opt('The traps down there... I\'ve learned to disarm them.', 'stranger_traps_context', '#fa4', { showIf: { type: 'minSecretsFound', value: 2 } }),
				opt('[Village] I grew up in Willowmere, you know.', 'stranger_village_origin', '#8f4', { showIf: { type: 'startingLocation', value: 'village' } }),
				opt('[Tavern Regular] I\'ve been drinking here longer than you.', 'stranger_tavern_origin', '#fa8', { showIf: { type: 'startingLocation', value: 'tavern' } }),
				opt('I hear you\'re not quite what you seem...', 'stranger_liar', '#f44', { showIf: { type: 'minCharLevel', value: 5 } }),
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
		deepscript_talk: node('deepscript_talk',
			'*The stranger goes very still. Then, slowly, they lean forward. When they speak, there is genuine surprise in their voice \u2014 perhaps for the first time in centuries.* You... can read Deepscript? *They switch languages, speaking words that make the air vibrate.* Who taught you? No mortal has been able to parse the Architects\' tongue in living memory. This changes things. This changes MANY things. The Shades will speak to you now. The walls will whisper their secrets. And the Eye... *A pause.* ...the Eye will notice.',
			[
				opt('The Eye will notice? Is that bad?', 'eye_notice', '#f44'),
				opt('Thessaly taught me.', 'thessaly_taught', '#8cf'),
				opt('What secrets do the walls hold?', 'wall_secrets', '#ff4'),
			]
		),
		eye_notice: node('eye_notice',
			'Neither good nor bad. Inevitable. The Eye watches all who enter, but those who can read Deepscript... it watches MORE closely. You are no longer merely an adventurer. You are a potential conversant. Someone who could read its messages. Understand its purpose. *They lean back.* Perhaps even answer it. Whether you should... that is a question I have spent three centuries avoiding.',
			[
				opt('I\'ll be careful.', 'return', '#4f4'),
			]
		),
		thessaly_taught: node('thessaly_taught',
			'*A long silence.* Thessaly. Of course. *Something shifts in their voice \u2014 something almost like warmth.* She was the last scholar who truly understood. When she walked into the Eye, she didn\'t disappear. She was... translated. Into Deepscript. She IS a message now, written across level fifteen\'s walls. If you can read Deepscript, you can read HER. Her thoughts. Her discoveries. Her final, beautiful, terrible conclusion about why the dungeon exists.',
			[
				opt('I\'ll find her. On level fifteen.', 'return', '#4f4'),
				opt('What was her conclusion?', 'thessaly_conclusion', '#f44'),
			]
		),
		thessaly_conclusion: node('thessaly_conclusion',
			'*The stranger steeples their fingers.* She wrote it on the library wall, in letters three feet tall: "The dungeon does not contain the Eye. The Eye contains the dungeon. We are inside a thought. The thought is learning to think itself." *They pause.* I have spent three hundred years trying to determine if that\'s profound or merely terrifying. I have concluded it is both.',
			[
				opt('...I need a drink.', 'farewell', '#4f4'),
			]
		),
		wall_secrets: node('wall_secrets',
			'Everywhere. Deepscript is etched into every surface, but most of it is too faded or too small to see without looking. Maintenance logs. Error reports. *They chuckle.* The dungeon has bugs, adventurer. Literal software bugs in reality. The Shades are patches \u2014 debugging routines left behind by the Architects. The monsters are stress tests. And you... *They point at you.* ...you are user input.',
			[
				opt('I\'m user input. That\'s existentially horrifying.', 'return', '#4f4'),
			]
		),
		many_secrets: node('many_secrets',
			'*Their eyes flash blue beneath the hood.* You have been listening. Gathering. Piecing the puzzle together. *They lean forward with an intensity you haven\'t seen before.* Then perhaps you are ready for a truth that the rumors only hint at: the dungeon does not exist to be conquered. It exists to be UNDERSTOOD. Every monster, every trap, every secret room \u2014 it is a lesson. A curriculum. The dungeon is the world\'s oldest school, and you are very close to graduating. Whether that is a reward or a punishment depends entirely on the student.',
			[
				opt('What happens when you graduate?', 'graduation', '#f44'),
				opt('I\'ll keep learning.', 'return', '#4f4'),
			]
		),
		graduation: node('graduation',
			'*The longest pause yet.* You meet the headmaster. *They rise from their seat \u2014 the first time you\'ve ever seen them move.* I should know. I graduated. Three hundred years ago. And I have been sitting in this tavern, writing the course guide, ever since. *They sit back down.* Class dismissed.',
			[
				opt('[Leave conversation]', '__exit__', '#0ff'),
			]
		),
		stranger_stories: node('stranger_stories',
			'*The stranger settles back, their hood casting deeper shadows.* A tale? I am old, adventurer. Very old. And I have witnessed things that would make a historian weep. Which tale do you wish to hear?',
			[
				opt('Tell me about the first person to enter the dungeon.', 'story_first', '#c8f', { once: true }),
				opt('What happened to the Architects?', 'story_architects', '#c8f', { once: true }),
				opt('Tell me about the Convergence.', 'story_convergence', '#c8f', { once: true }),
				opt('That\'s enough tales.', 'start', '#0ff'),
			]
		),
		story_first: node('story_first',
			'*They lean forward.* The first soul to enter the dungeon was not an adventurer. She was a shepherd named Brin, who chased a lost sheep through a crack in the earth. She descended forty levels. FORTY. Defeated the Guardian of the Threshold \u2014 a being of living stone and starlight. Befriended a colony of sentient mushrooms who taught her their language. And retrieved her sheep. *A pause.* When the village asked about her experience, she said: "Bit dark." She returned to shepherding and never spoke of it again. The mushrooms still ask about her. Every time I descend to level twelve, they ask: "Where is the Shepherd? When will she return?" I never know what to tell them.',
			[
				opt('The mushrooms remember her? [Story collected]', 'stranger_stories', '#4f4', { onSelect: { story: STORIES.stranger_first } }),
			]
		),
		story_architects: node('story_architects',
			'*Their voice drops to something barely louder than breathing.* The Architects did not die. They did not leave. They were... compiled. Their consciousness was compressed into the walls, the floors, the traps, the treasure. Every room you enter is a fragment of a thought. Every corridor is a sentence in an unfinished argument. *They spread their hands.* The dungeon is not a building, adventurer. It is a conversation that has been happening for millennia, in a language of stone and shadow. And the Eye at the bottom? It is the one who started the conversation. Still waiting for a reply.',
			[
				opt('A conversation in stone... [Story collected]', 'stranger_stories', '#4f4', { onSelect: { story: STORIES.stranger_architects } }),
			]
		),
		story_convergence: node('story_convergence',
			'*The temperature drops perceptibly.* Once every three hundred years, the dungeon aligns with something beyond this world. The walls thin. The floors become translucent. For one night, you can see THROUGH the stone to the spaces between realities \u2014 vast, dark oceans of nothing, with things moving in them. Things with too many angles. Things that notice you noticing them. *They grip the table.* The last Convergence was two hundred and ninety-nine years ago. The next one is... *They look at you meaningfully.* ...soon. Very soon. Be deep in the dungeon when it happens, and you may see things that cannot be unseen. Be at the surface, and you\'ll merely feel a wrongness in the air. Like the world hiccuping.',
			[
				opt('The next one is SOON?! [Story collected]', 'stranger_stories', '#4f4', { onSelect: { story: STORIES.stranger_convergence } }),
			]
		),
		// ─── NPC LIES & DECEPTION DETECTION ───
		stranger_liar: node('stranger_liar',
			'*They go very still.* Not what I seem? *A sound that might be a laugh or might be a death rattle.* Nobody in this tavern is what they seem. The Barkeep pretends he\'s not terrified. Garvus pretends alcohol helps. I pretend... well. We all have our roles.',
			[
				opt('You\'re not just an observer. You\'re part of the dungeon.', 'stranger_truth', '#f44'),
				opt('What are you pretending to be?', 'stranger_pretend', '#8cf'),
			]
		),
		stranger_pretend: lie('stranger_pretend',
			'*A pause.* I pretend to be... a traveler. Someone who passed through and stayed for the drinks. *They gesture vaguely at their untouched ale.* Nothing more. Nothing less. Just a stranger in a tavern, with stories to tell and warnings to give. That is all.',
			[
				opt('[Rogue] That\'s a lie. You\'ve never touched that drink.', 'stranger_caught', '#f44', { showIf: { type: 'class', value: 'rogue' } }),
				opt('[Deepscript] Your words taste like Deepscript. You\'re not mortal.', 'stranger_caught', '#a8f', { showIf: { type: 'knowsLanguage', value: 'Deepscript' } }),
				opt('Fair enough.', 'return', '#0ff'),
			]
		),
		stranger_truth: node('stranger_truth',
			'*The shadows around them seem to deepen.* Part of it? No. But... connected. The dungeon and I share a... wavelength. I hear its thoughts. I feel when new levels grow. When the Eye blinks, I blink with it. *Their voice drops.* I did not choose this. I went too deep. I came back. But not all of me returned to THIS side. Part of me is still down there, merged with the stone. And part of the dungeon... is up here. Sitting in a tavern. Drinking ale it cannot taste. Waiting.',
			[
				opt('Waiting for what?', 'stranger_waiting', '#f44'),
				opt('That\'s... I\'m sorry.', 'return', '#4f4'),
			]
		),
		stranger_caught: node('stranger_caught',
			'*For the first time, the Stranger looks... surprised. Then something like respect crosses their hidden features.* You are perceptive. More perceptive than most who sit where you sit. *They lean forward.* You are right. I am not a traveler. I have not traveled in... a very long time. I am an anchor. Left here by the Architects \u2014 or by the dungeon itself, I am no longer certain which \u2014 to watch. To remember. To ensure that someone, somewhere, knows what lies below. Even if they think I am merely a strange patron with good stories.',
			[
				opt('An anchor. Like the Anchor Stones.', 'stranger_anchor', '#f44'),
				opt('You\'re a safety mechanism. A living warning.', 'stranger_warning_reveal', '#8cf'),
			]
		),
		stranger_anchor: node('stranger_anchor',
			'*They nod slowly.* Similar. The Anchor Stones pin the containment in place physically. I pin it in place... informationally. Stories. Warnings. Rumors. Every adventurer I speak to leaves with a little more caution, a little more awareness. That caution saves lives. Those saved lives mean fewer people reaching the Eye. And the fewer who reach the Eye, the longer the containment holds. *A long sigh.* I am a story that tells stories to prevent the final story from being told.',
			[
				opt('A story that tells stories. That\'s beautiful and terrifying.', 'return', '#4f4', { onSelect: { mood: 'friendly', rumor: RUMORS.potions_matter, message: 'The Stranger reveals their true nature as a living containment mechanism.' } }),
			]
		),
		stranger_warning_reveal: node('stranger_warning_reveal',
			'*Something like warmth enters their voice.* Yes. A warning system with a personality and opinions about ale quality. Not the most elegant solution. The Architects preferred crystalline matrices and dimensional locks. But I am more... personable. People listen to a person in a tavern. They do not listen to a glowing rock in a cave. *They tilt their head.* I have been doing this for three centuries. I am quite good at it by now. The trick is knowing which truths to share and which to... season.',
			[
				opt('"Season?" You admit you lie to people?', 'stranger_lies_admitted', '#ff4'),
				opt('Three centuries of warnings. Thank you.', 'return', '#4f4', { onSelect: { mood: 'friendly' } }),
			]
		),
		stranger_lies_admitted: lie('stranger_lies_admitted',
			'*They spread their hands.* I curate. There is a difference. A lie says "the dungeon is safe." I never say that. A curated truth says "the dungeon is dangerous but here is how to survive the first five levels." Both are incomplete. One kills. One saves. *They lean back.* You want full honesty? The full truth about the dungeon would drive you mad. It drove Garvus to drink. It drove Thessaly to stay. It drove a thousand others to fates I will not describe over ale. So yes. I "season" my truths. Like a chef seasons a meal. Too much salt kills. Too little is bland. I aim for... educational.',
			[
				opt('What would the unseasoned truth look like?', 'stranger_full_truth', '#f44'),
				opt('I understand. Some truths need preparation.', 'return', '#4f4'),
			]
		),
		stranger_full_truth: node('stranger_full_truth',
			'*They lean in very close. Their breath smells like stone.* The dungeon is alive. It is not a metaphor. It breathes. It thinks. It wants. And what it wants is YOU. Not to kill you \u2014 to KNOW you. To absorb your experiences, your memories, your fear, your hope. It feeds on stories. Every adventurer who enters becomes a chapter. The dungeon READS you as you explore it. And when it has read enough of you... it writes you INTO itself. Thessaly is not trapped below. She IS below. She is page four hundred and seventy-three. *They pull back.* Is that honest enough?',
			[
				opt('...I wish you\'d kept seasoning that one.', 'return', '#4f4', { onSelect: { mood: 'afraid' } }),
			]
		),
		stranger_waiting: node('stranger_waiting',
			'*They look down at their untouched ale.* For the right one. The one who goes deep enough to learn the truth, but wise enough to come back and SHARE it. Garvus went deep but broke. Thessaly went deep but stayed. The others... didn\'t return at all. *They look up at you.* I wait for someone who can carry the weight of what lies below and still walk in sunlight. The dungeon\'s jailer, you might say. Or its biographer. The job is open. The benefits are terrible.',
			[
				opt('What happens if nobody takes the job?', 'return', '#f44'),
				opt('I might be that person.', 'return', '#4f4', { onSelect: { mood: 'friendly' } }),
			]
		),
		stranger_veteran: node('stranger_veteran',
			'*They lean forward, and for the first time you see something resembling genuine interest.* Five floors. Five containment layers breached, re-sealed behind you by the dungeon\'s own architecture. You know what most adventurers see when they descend? Darkness. Monsters. Treasure. Simple things. But by the fifth floor, the dungeon starts to notice you. Not as prey. As a READER. Someone turning its pages. *Their voice drops.* It\'s been a long time since someone read that far. The last chapter was Thessaly. The one before that was me.',
			[
				opt('What happens when you read far enough?', 'stranger_reader_deep', '#f44'),
				opt('The dungeon notices me. I\'ve felt it.', 'stranger_felt_it', '#8cf'),
			]
		),
		stranger_reader_deep: node('stranger_reader_deep',
			'*They steeple their fingers.* The dungeon begins to write BACK. You\'ll notice it first in the corridors \u2014 they start resembling places from your memories. A room that looks like your childhood home. A corridor that smells like your mother\'s cooking. It\'s not malice. It\'s... communication. The dungeon is trying to learn your language. Not Common or Deepscript. YOUR language. The language of your fears and hopes and memories. *A pause.* When it becomes fluent, things get... interesting.',
			[
				opt('Interesting how?', 'return', '#f44', { onSelect: { rumor: rumor('dungeon_reads_back', 'After the fifth floor, the dungeon begins to shape itself around your memories. It\'s learning your language.', 'Hooded Stranger', 'true'), message: 'The Stranger reveals the dungeon\'s true nature as a reader.' } }),
			]
		),
		stranger_felt_it: node('stranger_felt_it',
			'*They nod slowly.* Yes. That prickling on the back of your neck when a room is too quiet. The feeling that the walls are breathing. The certainty that the treasure in that chest was placed there specifically FOR you. *They lean closer.* Because it WAS. The dungeon is not random. Below the fifth floor, nothing is random. Every enemy placed to test you. Every potion placed to sustain you. Every trap placed to teach you. It\'s a curriculum. You are being educated. The question is: for what?',
			[
				opt('Educated for what?', 'return', '#f44', { onSelect: { rumor: rumor('dungeon_curriculum', 'Below floor five, the dungeon tailors every encounter specifically for each adventurer. Nothing is random.', 'Hooded Stranger', 'true') } }),
			]
		),
		stranger_traps_context: node('stranger_traps_context',
			'*They go very still.* You disarm traps. *It is not a question.* You see the mechanisms. The pressure plates. The wire. The intent. *They lean forward intently.* Do you know what a trap IS, in the context of the dungeon? It is a sentence. A statement of purpose. "This corridor is important enough to protect." Every trap you disarm, you are reading the dungeon\'s priorities. Its anxieties. The places it guards most fiercely are the places closest to its heart. *A long pause.* Or whatever passes for a heart in a living labyrinth.',
			[
				opt('So the traps are a map to what the dungeon values most.', 'stranger_trap_map', '#ff4'),
				opt('That\'s a very poetic way to describe spike pits.', 'stranger_trap_poetry', '#4f4'),
			]
		),
		stranger_trap_map: node('stranger_trap_map',
			'*Something like excitement enters their voice \u2014 an emotion you didn\'t think they were capable of.* YES. Precisely. Thessaly understood this. She mapped the trap density per corridor and discovered a pattern: the most heavily trapped paths all converge on a single point. Level fifteen. Room forty-seven. We called it the Convergence. Every trap in the dungeon is a finger pointing at that room. *They lean back.* Nobody who has entered Room Forty-Seven has described what they found. Because nobody who has entered Room Forty-Seven has come back.',
			[
				opt('Room Forty-Seven. I\'ll remember that.', 'return', '#f44', { onSelect: { rumor: rumor('room_47', 'All trap-heavy corridors converge on Room 47 on level 15. Nobody who entered has returned.', 'Hooded Stranger', 'exaggerated'), message: 'The Stranger shares the location of the Convergence.' } }),
			]
		),
		stranger_trap_poetry: node('stranger_trap_poetry',
			'*Something that might be a laugh escapes them.* Spike pits are haiku. Poison darts are limericks. The really elaborate ones \u2014 the multi-stage traps with pressure plates and swinging blades and fire and THEN the pit opens \u2014 those are epic poetry. Sonnets of suffering. The dungeon fancies itself an artist. *They gesture at their untouched ale.* Between you and me, its metaphors are heavy-handed. A spike pit that says "do not enter" is not subtle. But the dungeon has never been accused of subtlety. Volume, yes. Subtlety, no.',
			[
				opt('I\'ll never look at a spike pit the same way again.', 'return', '#4f4', { onSelect: { mood: 'amused' } }),
			]
		),
		stranger_village_origin: node('stranger_village_origin',
			'*They tilt their head, studying you.* Willowmere. I remember when it was founded. Aldric Willowmere and his twelve wagons, none of which survived the journey. *You realize they said "I remember" about something two hundred years ago.* Your village sits on an intersection of ley lines \u2014 did you know that? Three lines of concentrated magical energy converging on a muddy field where a confused merchant decided to build a house. The dungeon grew here because of those ley lines. And Willowmere grew here because of the dungeon. You are not from a village near a dungeon. You are from a village that the dungeon GREW.',
			[
				opt('The dungeon grew Willowmere?!', 'stranger_village_grown', '#f44'),
				opt('My parents never mentioned ley lines.', 'stranger_village_parents', '#8cf'),
			]
		),
		stranger_village_grown: node('stranger_village_grown',
			'Not intentionally. The dungeon needs... an ecosystem. Adventurers to feed it stories. Merchants to supply adventurers. Farmers to supply merchants. Before Aldric, the dungeon attracted wanderers, hermits, the occasional cursed knight. But they were inconsistent. Unreliable. The dungeon needed a RENEWABLE source. So it nudged the ley lines. Made the area feel... welcoming. Safe. Like a good place to build. *They spread their hands.* Your mother\'s cooking? Your father\'s stories? The feeling of home you carry from Willowmere? All real. All genuine. And all part of a system designed to produce people brave enough to walk into the dark.',
			[
				opt('That is deeply unsettling and I wish you hadn\'t told me.', 'return', '#4f4', { onSelect: { rumor: rumor('willowmere_grown', 'Willowmere was not founded by choice. The dungeon manipulated ley lines to create a settlement that would produce adventurers.', 'Hooded Stranger', 'exaggerated') } }),
			]
		),
		stranger_village_parents: node('stranger_village_parents',
			'*A hint of warmth in their voice.* They wouldn\'t. The ley lines are invisible to most. Your parents gave you what mattered \u2014 kindness, courage, a reason to come back alive. The dungeon may have arranged the GEOGRAPHY of Willowmere, but it cannot arrange love. That part is real. Entirely, stubbornly, inconveniently real. *A pause.* It confuses the dungeon, I think. Love. It cannot read it. It cannot replicate it. Every time you think of home and fight harder because of it, the dungeon encounters something it cannot catalogue. You are, in a small way, illegible to it. And that is your greatest weapon.',
			[
				opt('Love as a weapon against a sentient dungeon. I\'ll take it.', 'return', '#4f4', { onSelect: { mood: 'friendly', message: 'The Stranger\'s words fill you with warmth and determination.' } }),
			]
		),
		stranger_tavern_origin: node('stranger_tavern_origin',
			'*A dry sound that might be amusement.* Longer than me? I have been sitting in this chair for three hundred years. My ale has been untouched since the reign of Empress Valthira the Adequate. *They gesture at the fossilized ring stain on their table.* This stain is a historical artifact. Archaeologists would weep. *They tilt their head at you.* But you have been here since the beginning. YOUR beginning. This tavern is where your story started. Not in a home. Not in a prison. In a place between stories, surrounded by other people\'s tales. Do you know what that makes you?',
			[
				opt('What does that make me?', 'stranger_tavern_between', '#8cf'),
				opt('Empress Valthira the Adequate?', 'stranger_valthira', '#ff4'),
			]
		),
		stranger_tavern_between: node('stranger_tavern_between',
			'A collector. You began in a tavern \u2014 a place where stories gather. The Barkeep told you his stories. Garvus told you his. I told you mine. You absorbed them all before you ever set foot in the dungeon. Most adventurers enter the dungeon as blank pages. You entered already written upon. *They lean forward.* The dungeon reads everyone who enters. But you... you entered carrying the stories of others. The dungeon didn\'t just read YOU. It read everyone whose tale you carry. You smuggled an entire library into a labyrinth. *Almost admiringly.* Clever.',
			[
				opt('I\'m basically a walking bookshelf. Got it.', 'return', '#4f4', { onSelect: { mood: 'amused', rumor: rumor('story_smuggler', 'Adventurers who carry others\' stories confuse the dungeon. It tries to read one person and finds many.', 'Hooded Stranger', 'true') } }),
			]
		),
		stranger_valthira: node('stranger_valthira',
			'*They actually pause, as if recalling.* Empress Valthira the Adequate. Ruled for forty-three years. Her reign was described as "fine." Her economic policies were "acceptable." Her military campaigns were "present." She was neither loved nor hated. She was... adequate. History remembers the great and the terrible. Valthira is remembered for being aggressively mediocre. She once gave a speech so perfectly average that three scribes fell asleep simultaneously. *A beat.* I attended that speech. I also fell asleep. It was remarkable in its unremarkability.',
			[
				opt('A three-hundred-year-old review of a mediocre empress. This is why I drink here.', 'return', '#4f4', { onSelect: { mood: 'amused' } }),
			]
		),
		stranger_teach_elvish: node('stranger_teach_elvish',
			'*They regard you for a long moment.* Elvish. You wish to learn the language of intent. *They set down their untouched ale.* Elvish is not like other languages. It does not describe the world — it describes what the world SHOULD be. Every sentence is a wish. Every verb is a prayer. The Architects used it as the emotional layer of their constructions. Deepscript is the skeleton. Orcish is the heartbeat. Elvish is the dream. *They close their eyes.* I will teach you. But understand: once you speak Elvish, you will hear the dungeon differently. The walls will sound... sad.',
			[
				opt('[Study Elvish with the Stranger]', 'stranger_elvish_learned', '#4f4', { onSelect: { learnLanguage: 'Elvish', message: 'The Hooded Stranger teaches you Elvish! The world sounds different now — more fragile, more beautiful.' } }),
				opt('I\'m not sure I want sad walls.', 'return', '#0ff'),
			]
		),
		stranger_elvish_learned: node('stranger_elvish_learned',
			'*The lesson takes the form of silence. The Stranger speaks no words — instead, they hum. A melody so old it predates music. And somehow, through the humming, you understand. Elvish pours into your mind like light through stained glass. Colors you never knew existed. Emotions that have no Common equivalent. The word for "sunset" is the same as the word for "goodbye." The word for "hello" is the same as "I am afraid this will end."* There. You speak Elvish now. Use it carefully. Every Elvish sentence changes the speaker as much as the listener.',
			[
				opt('That was the strangest language lesson of my life.', 'return', '#4f4', { onSelect: { mood: 'amused', message: '"All the best lessons are."' } }),
			]
		),
		elvish_talk: node('elvish_talk',
			'*Their posture changes entirely. The cryptic mystic act falls away, and for the first time you see something raw, something vulnerable.* You speak the tongue of intent. Then hear my intent: I am tired. Three centuries of waiting in taverns, watching adventurers descend and not return. I chose to stay above because I was afraid. Not of the dungeon — of the answer at the bottom. What if the Architects were WRONG? What if consciousness shouldn\'t persist? What if the Eye\'s dream is the correct one? *Their voice breaks.* I taught you Elvish because I cannot go down there myself. You must carry the words I cannot speak.',
			[
				opt('What words?', 'elvish_words', '#ff4'),
				opt('You\'ve been carrying this for three hundred years?', 'elvish_burden', '#8cf'),
			],
			'Elvish'
		),
		elvish_words: node('elvish_words',
			'*They speak in Elvish so pure it makes the air crystallize.* The Verse of Intention. The third component of the Severance. Deepscript tells the dungeon WHAT to do. Orcish tells it HOW to feel. Elvish tells it WHY. Without the why, the Severance is just destruction. WITH it... it is mercy. A gentle closing of an argument that has gone on too long. *They press a hand to your forehead. Something warm flows through you.* There. The Verse is yours now. Speak it at the bottom, when the time comes. And tell the Eye... tell it that three hundred years was long enough. For all of us.',
			[
				opt('I\'ll carry your words. [Rumor learned]', 'return', '#4f4', { onSelect: { mood: 'friendly', rumor: { id: 'stranger_severance', text: 'The Severance requires three Verses: Deepscript for structure, Orcish for soul, Elvish for intent. The Stranger carries the Elvish Verse of Intention.', source: 'The Hooded Stranger', accuracy: 'true' }, message: 'The Stranger entrusts you with the Elvish Verse of Intention. Their eyes shine with something that might be hope.' } }),
			],
			'Elvish'
		),
		elvish_burden: node('elvish_burden',
			'*They laugh — the first genuine laugh you\'ve heard from them. It sounds like a church bell that hasn\'t been rung in centuries.* Three hundred years of ordering ale I cannot drink. Three hundred years of cryptic warnings that nobody heeds. Three hundred years of watching Garvus lose arm-wrestling matches to furniture. *They wipe their eyes.* I was the strongest of our expedition. I went deeper than anyone. And I came back because I was a coward. The others went further. They became part of the dungeon. I became part of a tavern. I am not sure which fate is worse.',
			[
				opt('Choosing to live isn\'t cowardice.', 'return', '#4f4', { onSelect: { mood: 'friendly', message: '*A long pause.* "Perhaps. Perhaps not. But thank you for saying it."' } }),
				opt('Three hundred years of Garvus. That IS worse.', 'return', '#ff4', { onSelect: { mood: 'amused', message: '"The furniture arm-wrestling alone should qualify as cosmic suffering."' } }),
			],
			'Elvish'
		),
		return_afraid: node('return_afraid',
			'*The stranger is pressed against the wall, their composure cracked.* Something stirred below. I felt it through the stone. The Eye shifted. When the Eye shifts, the dungeon reshuffles. Corridors become dead ends. Safe rooms become trap rooms. Everything you knew about the layout... forget it.',
			[
				opt('Can you sense the Eye from here?', 'eye_sense', '#f44', { onSelect: { mood: 'afraid' } }),
				opt('Sounds like you need a drink.', 'return', '#4f4', { onSelect: { mood: 'amused', message: 'They actually laugh. "Perhaps I do."' } }),
				opt('What does the reshuffling mean for me?', 'return', '#ff4', { onSelect: { mood: 'neutral', message: '"It means trust your instincts, not your map."' } }),
			]
		),
		eye_sense: node('eye_sense',
			'*Their voice drops to a whisper.* I don\'t sense it. I HEAR it. A low hum beneath every other sound. Most people filter it out — their brains refuse to acknowledge it. But once you learn to listen... *they trail off* ...you can never stop. It\'s under the tavern music. Under the wind. Under your own heartbeat. It has always been there. And it is getting louder.',
			[
				opt('I wish you hadn\'t told me that.', 'return', '#4f4', { onSelect: { mood: 'neutral' } }),
				opt('How do I make it stop?', 'return', '#f44', { onSelect: { mood: 'sad', message: '"You don\'t."' } }),
			]
		),
		return_hostile: node('return_hostile',
			'*Their eyes burn from the shadows. The usual cryptic patience is gone.* You speak of things you do not understand. You prod at ancient wounds with the curiosity of a child poking a sleeping dragon. I have watched civilizations rise and crumble, and you dare to question MY knowledge?',
			[
				opt('I meant no disrespect.', 'return', '#4f4', { onSelect: { mood: 'neutral', message: '*They exhale slowly.* "...I know. Forgive my sharpness. Eternity makes one... brittle."' } }),
				opt('Knowledge without sharing is just hoarding.', 'return', '#ff4', { onSelect: { mood: 'amused', message: '"Hoarding. Like a dragon." *A thin smile.* "Perhaps you have a point."' } }),
				opt('Someone\'s cranky. Should I come back in a century?', '__exit__', '#f44', { onSelect: { npcAction: 'storm_off', message: 'The stranger dissolves into shadow. Their chair is empty. The shadows seem deeper now.' } }),
			]
		),
		return_sad: node('return_sad',
			'*They sit motionless. The shadows around them seem heavier, as if gravity itself is mourning.* I remember what the world looked like before the dungeon. Green fields where the entrance now gapes. Children playing where monsters spawn. Three hundred years is a long time to remember a world that no longer exists.',
			[
				opt('What was it like?', 'return', '#8cf', { onSelect: { mood: 'sad', message: '"Beautiful. And temporary. As all beautiful things are."' } }),
				opt('The world still has green fields. Just... elsewhere.', 'return', '#4f4', { onSelect: { mood: 'neutral', message: '"Elsewhere. Yes. I should visit elsewhere sometime."' } }),
				opt('You carry a heavy burden.', 'return', '#4f4', { onSelect: { mood: 'friendly', message: '"Thank you for noticing. Most people just see the mysterious hood and assume I\'m being dramatic."' } }),
			]
		),
		return_amused: node('return_amused',
			'*Is the stranger... smiling? It\'s hard to tell under the hood, but there\'s a definite upturn.* Your Garvus just attempted to arm-wrestle a table leg. He lost. The table leg won by submission. The Barkeep is keeping score. Garvus is currently zero for seven against furniture.',
			[
				opt('Classic Garvus.', 'return', '#4f4', { onSelect: { mood: 'amused' } }),
				opt('I need to see these arm-wrestling records.', 'return', '#ff4', { onSelect: { mood: 'amused', message: '"The Barkeep carves them into the bar. There is an entire section dedicated to Garvus vs. inanimate objects."' } }),
				opt('Does anything actually amuse a three-hundred-year-old being?', 'return', '#8cf', { onSelect: { mood: 'friendly', message: '"Drunken mortals fighting furniture. Consistently. For centuries."' } }),
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
				opt('Got any stories for me?', 'drunk_stories', '#c8f'),
				opt('Are you okay?', 'okay', '#4f4'),
				opt('Garvus, you need to sober up. People need what you know.', 'social_persuade_garvus', '#4cf', { socialCheck: { skill: 'persuade', difficulty: 14, successNode: 'persuade_garvus_ok', failNode: 'persuade_garvus_fail' }, once: true }),
				opt('TELL ME ABOUT THE EYE. NOW.', 'social_intimidate_garvus', '#f84', { socialCheck: { skill: 'intimidate', difficulty: 8, successNode: 'intimidate_garvus_ok', failNode: 'intimidate_garvus_fail' }, once: true }),
				opt('Sorry to bother you.', 'farewell', '#0ff'),
			]
		),
		return: node('return',
			'*He blinks.* Oh. It\'sh YOU again. You\'re shtill alive? Impressive. Mosht people I talk to end up dead. Not becaushe of me! Jusht... statistically.',
			[
				opt('What can you tell me about the deeper levels?', 'deep_drunk', '#ff4'),
				opt('Tell me a story, Garvus.', 'drunk_stories', '#c8f'),
				opt('[Mage] You remind me of someone...', 'mage_thessaly', '#84f', { showIf: { type: 'class', value: 'mage' } }),
				opt('[Deepscript] I can read the old writing, Garvus.', 'deepscript_shock', '#a8f', { showIf: { type: 'knowsLanguage', value: 'Deepscript' } }),
				opt('How are you holding up?', 'okay', '#4f4'),
				opt('Any advice for me?', 'advice', '#ff4'),
				opt('Garvus, you need to sober up. People need what you know.', 'social_persuade_garvus', '#4cf', { socialCheck: { skill: 'persuade', difficulty: 14, successNode: 'persuade_garvus_ok', failNode: 'persuade_garvus_fail' }, once: true }),
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
		drunk_stories: node('drunk_stories',
			'*He perks up slightly, sloshing ale.* Shtories? Oh, I\'ve got SHTOREES. *He holds up a finger.* The BESHT shtories. Mosht of them are even TRUE. ...Probably. What d\'you wanna hear?',
			[
				opt('Tell me about Chester the Mimic.', 'story_chester', '#c8f', { once: true }),
				opt('Tell me about the Silver Delvers.', 'story_delvers', '#c8f', { once: true }),
				opt('Tell me about your secret recipe.', 'story_recipe', '#c8f', { once: true }),
				opt('That\'s enough stories.', 'start', '#0ff'),
			]
		),
		story_chester: node('story_chester',
			'*His eyes light up.* CHESHTER! My besht friend! Level four, right? I open a chesht, and TEETH. Big teeth. It bitesh my arm. And I \u2014 genius that I am \u2014 inshtead of fighting, I shay: "Beautiful oak finish you\'ve got there." And it SHTOPS. Just shtops biting. Looksh at me. And I shwear on my mother\'sh grave, it BLUSHES. A chesht. Blushing. From a compliment. We shared a meal \u2014 I ate trail rationsh, Chester ate someone\'sh boot. We parted ash friends. *He sniffles.* He\'sh eaten sheven people shince then. But never me. We have a bond.',
			[
				opt('That\'s... oddly touching. [Story collected]', 'drunk_stories', '#4f4', { onSelect: { story: STORIES.drunk_chester } }),
			]
		),
		story_delvers: node('story_delvers',
			'*His face goes through about seven emotions in two seconds.* The Shilver Delversh. Five of ush. Matching cloaksh. A TEAM NAME. *He stares into his mug.* Garvush the Bold \u2014 me. Thesshaly the Wishe. Korrin Ironfisht \u2014 dwarf, punched EVERYTHING. Lila Shadowshtep \u2014 could shteal your teeth while you\'re talking. And Brenn the Unfortunate \u2014 our healer. Fell into every trap. EVERY. SHINGLE. ONE. *A long pause.* We made it to level fifteen. Found the library. Found... other things. Four came back. Thesshaly didn\'t. Korrin vanished. Lila went far away. Brenn became a librarian. And I... *He gestures around.* ...became thish.',
			[
				opt('I\'m sorry, Garvus. [Story collected]', 'drunk_stories', '#4f4', { onSelect: { story: STORIES.drunk_delvers, mood: 'sad' } }),
			]
		),
		story_recipe: node('story_recipe',
			'*He leans in with the intensity of someone sharing nuclear launch codes.* I have invented... a potion... that makesh you invisible to bossesh. INVISHIBLE. The recipe: three mushrooms \u2014 the purple onesh, not the green, NEVER the green \u2014 a shpider fang, and... *He drops his voice.* ...the tearsh of shomeone who genuinely believesh in you. *He sits back triumphantly.* The lasht ingredient ish the hardesht to find in a dungeon. I tried using my OWN tears but apparently "believing in yourshelf" doesh\'nt count. Also the mushrooms were poishonoush. I was in bed for a week. *He raises his mug.* But the THEORY is sound!',
			[
				opt('I believe in you, Garvus. [Story collected]', 'drunk_stories', '#4f4', { onSelect: { story: STORIES.drunk_recipe, mood: 'amused' } }),
			]
		),
		mage_thessaly: node('mage_thessaly',
			'*He goes very still, staring at you with sudden, terrible clarity.* ...Thesshaly? *He blinks rapidly.* No. No, you\'re not her. But you have the same... the same LOOK. The way mages look at things like they\'re reading something nobody else can see. She had that look when she walked into the Eye. *His hand shakes.* You\'re going to go looking for her, aren\'t you? All mages are the same. Curiosity that\'ll kill you. She was the smartest person I ever met and it still wasn\'t enough to save her from her own questions.',
			[
				opt('I\'ll be more careful than she was.', 'more_careful', '#4f4'),
				opt('Maybe curiosity is the point.', 'curiosity_point', '#8cf'),
			]
		),
		more_careful: node('more_careful',
			'*He laughs \u2014 a raw, broken sound.* That\'sh EXACTLY what she shaid. Word for word. On the morning we entered level fifteen. "I\'ll be careful, Garvush." Then she read the wall. Then she talked to the Eye. Then she walked into it. Very carefully. With perfect, measured steps. Into oblivion. *He drains his mug.* Be careful, mage. Be careful in a different way than she was.',
			[
				opt('I will. I promise.', 'farewell', '#4f4'),
			]
		),
		curiosity_point: node('curiosity_point',
			'*He stares at you.* ...Yeah. Maybe it is. Maybe the whole dungeon is one big question and the Eye is the answer and people like you and Thessaly are the only ones brave enough to ask. *He sniffs.* Or shtupid enough. The line is very thin. Thesshaly was on BOTH shides of it shimultaneously. Quantum shtupidity, she called it. Even her jokes were too smart for me.',
			[
				opt('She sounds incredible.', 'farewell', '#4f4'),
			]
		),
		deepscript_shock: node('deepscript_shock',
			'*His mug crashes to the floor. He doesn\'t notice. His eyes are wide and he\'s gripping the table like it\'s the only real thing in the universe.* You can READ it? The... the writing on the walls? The writing that Thesshaly spent YEARS learning? *His voice drops to a horrified whisper.* Then you know. You know what the dungeon is SAYING. What it\'s been saying all along. What it said to HER before she... *He covers his face.* Did you read level fifteen? Did you read what she wrote?',
			[
				opt('Not yet. I haven\'t been that deep.', 'not_yet_fifteen', '#4f4'),
				opt('What did she write?', 'she_wrote', '#f44'),
			]
		),
		not_yet_fifteen: node('not_yet_fifteen',
			'*He grabs your arm.* When you get there \u2014 IF you get there \u2014 find the library. Read the east wall. That\'s where she wrote her final entry. Her... her goodbye. To me. To all of ush. *Tears streak his face.* She shaid she was happy. She shaid she finally understood. And she shaid... *He struggles.* ...she shaid to tell Garvush to shtop drinking. *A watery laugh.* I have NOT followed that advice.',
			[
				opt('I\'ll find it. I\'ll read it. For both of you.', 'farewell', '#4f4'),
			]
		),
		she_wrote: node('she_wrote',
			'*He shakes his head.* I can\'t read Deepshcript. I only know what the othersh told me. Thesshaly wrote something on every wall she could reach. Equations. Diagrams. And one sentence in Common, for us. For the ones who couldn\'t read the rest. It said: "The answer is beautiful. Tell Garvus I\'m sorry about the cheese incident." *He laughs and cries at the same time.* It was a VERY funny cheese incident. She turned Korrin\'s entire ration pack into sentient gouda. It filed a complaint.',
			[
				opt('Sentient gouda. Classic Thessaly.', 'farewell', '#4f4'),
			]
		),
		persuade_garvus_ok: node('persuade_garvus_ok',
			'*He sets down the mug. Actually SETS IT DOWN. His eyes clear like a fog lifting from a mountain lake.* You\'re... you\'re right. You sound like Thessaly. She used to say that. "The world needs your mind more than the tavern needs your coin, Garvus." *He takes a deep breath.* Alright. Listen carefully, because I don\'t know how long the clarity lasts. Level five has a hidden armory behind the southeast wall of the boss room. Level ten\'s library has a cipher key for Deepscript carved into the floor \u2014 most people step right over it. And level fifteen... *His voice drops.* The Eye has a blind spot. Due north. It can\'t see due north. Thessaly figured that out. It\'s the only reason four of us made it home.',
			[
				opt('The Eye has a blind spot?! [Rumor learned]', 'return', '#ff4', { onSelect: { rumor: RUMORS.potions_matter, message: 'Garvus reveals the Eye\'s blind spot \u2014 due north!', mood: 'friendly' } }),
			]
		),
		persuade_garvus_fail: node('persuade_garvus_fail',
			'*He clutches his mug tighter.* Shober up? SHOBER UP?! I tried shober once. Lasted three hoursh. The nightmares came back. The Eye, shtaring. The wallsh, whispering my name. Thessaly\'sh voice saying "come back, Garvush, come see what I found." *He shudders.* Shober is where the monstersh live. In HERE \u2014 *He taps the mug.* \u2014 is where the monstersh CAN\'T reach. Mosht of them. The shentient gouda found me even here. Persistent cheese.',
			[
				opt('I understand. I\'m sorry.', 'return', '#4f4', { onSelect: { mood: 'sad' } }),
				opt('...sentient gouda?', 'return', '#ff4', { onSelect: { mood: 'amused' } }),
			]
		),
		intimidate_garvus_ok: node('intimidate_garvus_ok',
			'*He flinches violently, ale sloshing everywhere.* OKAY OKAY DON\'T HURT ME! *He starts babbling at incredible speed.* The Eye is on level twenty not fifteen like I usually say I lied about that it\'s deeper than anyone thinks and it\'s not sleeping it\'s WAITING and the Anchor Stones are the only things keeping it contained and there are SEVEN of them and Aldric wants to remove them all because he thinks he can CONTROL it and he\'s WRONG and Thessaly knew that\'s why she stayed behind to GUARD them and \u2014 *He gasps for air.* ...please don\'t hit me. I bruise like a peach. A very drunk peach.',
			[
				opt('Anchor Stones... seven of them? [Rumor learned]', 'return', '#ff4', { onSelect: { rumor: RUMORS.singing_walls, message: 'Garvus reveals there are seven Anchor Stones containing the Eye!', mood: 'afraid' } }),
			]
		),
		intimidate_garvus_fail: node('intimidate_garvus_fail',
			'*He squints at you, entirely unimpressed.* Really? You\'re going to shout at the man who shtared down a cathedral-shized eyeball? Who watched his besht friend walk into cosmic oblivion? Who once arm-wreshtled a Minotaur for a bar tab? *He flexes.* I may be drunk, but I ushed to be Garvush the BOLD. The Bold! That\'sh not just a name. I EARNED that. By being bold. And by killing a LOT of thingsh. *He pats your arm condescendingly.* Nice try though, shweetie.',
			[
				opt('...did you win the arm wrestle?', 'arm_wrestle', '#ff4'),
				opt('Fair enough, Garvus.', 'return', '#4f4', { onSelect: { mood: 'amused' } }),
			]
		),
		arm_wrestle: node('arm_wrestle',
			'*He grins enormously.* YESH. It took four hoursh and I dislocated my shoulder, but I WON. The Minotaur bought me a drink after. Very shportshmanlike, Minotaursh. Better manner\'sh than mosht humans. It\'sh now my shingle greatesht achievement, shurpassing even the time I convinced a Dragon Turtle that I was a health inspector and it needed to vacate the premises for "code violations." Guild card, very official-looking. Thesshaly forged it.',
			[
				opt('Thessaly forged a health inspector card for you?', 'return', '#ff4', { onSelect: { mood: 'amused' } }),
			]
		),
		// ─── MOOD-SPECIFIC RETURN NODES ───
		return_afraid: node('return_afraid',
			'*He sees you and nearly knocks over his mug.* OH NO. You\'re back. *He shields his ale protectively.* Lishten, I told you everything I know lasht time! The Eye, the Anchor Shtonesh, all of it! I\'m an empty vessel of information! A shqueezed shponge! There\'s nothing left to intimidate out of me except maybe my childhood fear of geese and I\'m NOT dishecussing that!',
			[
				opt('Relax, Garvus. I just came to chat.', 'return', '#4f4', { onSelect: { mood: 'neutral', message: 'Garvus slowly unclenches.' } }),
				opt('...you\'re afraid of geese?', 'geese', '#ff4'),
				opt('[Leave]', '__exit__', '#0ff'),
			]
		),
		geese: node('geese',
			'*He shudders violently.* YESH. Have you SHEEN those thingsh? Dead eyes. Murder waddle. They hish like they know your darkesht shecretsh. I fought a cathedral-shized eyeball and lived. I faced a Minotaur in arm-to-arm combat. But a gooshe? A GOOSHE? *He takes a long drink.* Thesshaly had a pet gooshe at the Athenaeum. Named it Professor Honkington. It bit EVERYONE. Tenured, she shaid. Can\'t fire a tenured gooshe. Akademia ish broken.',
			[
				opt('Professor Honkington. Of course.', 'return', '#4f4', { onSelect: { mood: 'amused' } }),
			]
		),
		return_sad: node('return_sad',
			'*He\'s not drinking. His mug sits untouched. He stares at his hands.* I was thinking about Thesshaly. About level fifteen. About the moment she walked toward the Eye and I did nothing. I jusht... shtood there. Garvush the Bold. More like Garvush the Froze-In-Terror-While-His-Besht-Friend-Walked-Into-Oblivion.',
			[
				opt('You couldn\'t have stopped her, Garvus.', 'sad_guilt', '#4f4'),
				opt('She made her choice. You survived.', 'sad_survivor', '#ff4'),
				opt('[Sit with him in silence]', 'sad_silence', '#8cf'),
			]
		),
		sad_guilt: node('sad_guilt',
			'*His voice cracks.* Maybe. Maybe not. But I should have TRIED. That\'sh what Bold meansh. It meansh trying even when it\'sh shtupid. And I didn\'t. I ran. We ALL ran. And she walked. Calmly. Like she\'d been waiting her whole life for that moment. *He picks up his mug.* ...she probably had been. Thesshaly always knew more than she let on. Even the gooshe reshpected her.',
			[
				opt('She\'d want you to live, Garvus. Not just survive.', 'return', '#4f4', { onSelect: { mood: 'neutral', message: 'Something shifts in Garvus\'s eyes. Not hope. But something adjacent.' } }),
			]
		),
		sad_survivor: node('sad_survivor',
			'*He looks at his mug like it holds answers.* Shurvived. Yeah. That\'sh one word for it. Another word ish "ran." Another ish "abandoned." The thesaurush of cowardice ish very exshtensive. I should know \u2014 I\'ve read it. Alphabetized it. Cross-referenced it with my therapy journal. My therapisht quit, by the way. Shaid I was "too complex a cashe." A THERAPISHT. Quitting. On ME.',
			[
				opt('That just means you\'re too interesting for regular therapy.', 'return', '#4f4', { onSelect: { mood: 'amused', message: 'Garvus almost smiles.' } }),
			]
		),
		sad_silence: node('sad_silence',
			'*You sit next to him. Neither of you says anything. After a long time, he takes a shaky breath.* ...thanksh. *He picks up his mug, takes a sip, and sets it down.* Mosht people try to fix me. Talk me out of drinking. Tell me to "move on." You just... shat here. *He almost smiles.* That\'sh worth more than all the advice in the world. Thesshaly ushed to do that. Just... be there. No judgement. No fixhing.',
			[
				opt('[Nod]', 'return', '#4f4', { onSelect: { mood: 'friendly', message: 'Garvus looks at you with genuine warmth for the first time.' } }),
			]
		),
		return_amused: node('return_amused',
			'*He waves enthusiastically, ale sloshing.* THERE\'sh my favorite person! You know what? You\'re alright. You make old Garvush LAUGH. Do you know how hard that ish? The lasht person to make me laugh was Thesshaly, and she had a PHD in humor. Literally. The Athenaeum has a humor department. Shkeptical, I know, but their theshish defenesh are HILARIOUS.',
			[
				opt('Tell me about the humor department.', 'humor_dept', '#ff4'),
				opt('Got any new stories for me?', 'drunk_stories', '#c8f'),
				opt('What else can you tell me?', 'return', '#ff4'),
			]
		),
		humor_dept: node('humor_dept',
			'*He leans in conspiratorially.* The Department of Applied Humor at the Athenaeum. Three scholarsh. Their entire researchh program was: "Why ish thingsh funny?" They shpent six yearsh on it. Their final paper was titled "A Comprehenshive Theory of Comedy, With Footnotes." It was eight hundred pagesh long. The footnotes were funnier than the main text. The main text was NOT funny. They failed to explain comedy while being accidentally hilarious. The irony won them an award. From the Department of Irony. Which is ALSO a real department.',
			[
				opt('The Department of Irony. Of course.', 'return', '#4f4', { onSelect: { mood: 'amused' } }),
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
				opt('A scholar of YOUR caliber deserves better than this. Share your greatest discovery with me.', 'social_persuade_thessaly', '#4cf', { socialCheck: { skill: 'persuade', difficulty: 13, successNode: 'persuade_thessaly_ok', failNode: 'persuade_thessaly_fail' }, once: true }),
				opt('[Say nothing and leave]', '__exit__', '#0ff'),
			]
		),
		return: node('return',
			'*She looks up.* Oh good, you\'re still alive. I was taking bets with the rats. They had three-to-one odds against you.',
			[
				opt('Tell me more about yourself.', 'who', '#ff4'),
				opt('Any tips for fighting goblins?', 'goblin_tips', '#ff4'),
				opt('What were you doing before you got captured?', 'research', '#8cf'),
				opt('Tell me a scholarly tale.', 'thessaly_stories', '#c8f'),
				opt('Tell me about what lies below.', 'below', '#f44'),
				opt('The Athenaeum sent me to retrieve you. Scholar Aldric authorized the rescue mission personally.', 'social_deceive_thessaly', '#c4f', { socialCheck: { skill: 'deceive', difficulty: 15, successNode: 'deceive_thessaly_ok', failNode: 'deceive_thessaly_fail' }, once: true }),
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
				opt('What about Orcish and Elvish?', 'three_tongues', '#ff4'),
			]
		),
		three_tongues: node('three_tongues',
			'*She sits up straighter, chains clinking with excitement.* You know about the other languages? The Architects didn\'t write in Deepscript alone \u2014 they used THREE tongues! Deepscript for the logical structure, the bones. Orcish for the emotional substrate, the FEELING of each room. Why does the boss chamber feel oppressive? Because it was described in Orcish. Why do safe rooms feel comforting? Same reason. And Elvish... *She drops her voice.* Elvish is the intentionality layer. The PURPOSE. The why-it-exists. The dungeon has a reason for being, and that reason is written in Elvish. Find speakers of all three tongues, and you might actually understand what this place IS.',
			[
				opt('Where do I learn Orcish?', 'orcish_hint', '#ff4'),
				opt('Where do I learn Elvish?', 'elvish_hint', '#ff4'),
				opt('That\'s incredible. Thank you.', 'return', '#4f4'),
			]
		),
		orcish_hint: node('orcish_hint',
			'*She thinks.* The goblins. They\'re descended from the original cave-dwellers who were here before the dungeon. Their language preserved fragments of the Orcish layer. If you find a goblin willing to talk instead of bite \u2014 and that\'s a big if \u2014 they might teach you. I heard rumors of a goblin merchant in the lower levels. Wears a tiny hat. Sounds absurd, but the dungeon is absurd. The hat might be a Keeper\'s crown. Might be just a hat. With goblins, it\'s hard to tell.',
			[
				opt('A goblin in a top hat. Got it.', 'return', '#4f4', { onSelect: { mood: 'amused' } }),
			]
		),
		elvish_hint: node('elvish_hint',
			'*She bites her lip.* Elvish is... harder. The Elvish speakers are mostly gone \u2014 absorbed into the dungeon or ascended beyond it. But there are beings who remember. Ancient ones. The kind who sit in taverns and pretend to drink ale while radiating three centuries of accumulated melancholy. *She gives you a pointed look.* I\'m being specific for a reason. If someone in a hood is being cryptic at you, they probably speak Elvish. Ask them. Politely. They\'ve earned the right to be mysterious.',
			[
				opt('Mysterious hooded ale-pretenders. Very specific.', 'return', '#4f4', { onSelect: { mood: 'amused' } }),
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
		thessaly_stories: node('thessaly_stories',
			'*Her eyes light up with academic fervor.* Oh! You want to hear about my research? Most people\'s eyes glaze over within thirty seconds. I timed Aldric once. Seventeen seconds. New record. What interests you?',
			[
				opt('Tell me about Deepscript.', 'story_deepscript', '#c8f', { once: true }),
				opt('Tell me about the Eye Below.', 'story_eye', '#c8f', { once: true }),
				opt('That\'s enough scholarship.', 'return', '#0ff'),
			]
		),
		story_deepscript: node('story_deepscript',
			'*She sits up straighter, chains clinking with excitement.* Before mortal tongues shaped words, the Architects wrote Deepscript into the bones of the world. It is not a language of communication \u2014 it is a language of CREATION. Each glyph is an instruction. A command to reality itself. *She traces symbols in the dust.* The dungeon\'s walls are covered in it. The traps? Sentences. Boss rooms? Paragraphs. The entire dungeon is a PROGRAM, still running, still executing code written by beings who no longer exist in any conventional sense. *She grins.* I presented this at the Athenaeum. Aldric called it "fanciful." Aldric\'s research was on the mating habits of cave bats. WHO\'S FANCIFUL NOW, ALDRIC.',
			[
				opt('A dungeon that\'s a running program... [Story collected]', 'thessaly_stories', '#4f4', { onSelect: { story: STORIES.thessaly_deepscript } }),
			]
		),
		story_eye: node('story_eye',
			'*Her voice drops to barely a whisper.* At the deepest point of the dungeon, embedded in living rock, there is an Eye. Not a creature\'s eye. Something older. Something that was here before the dungeon, before the Architects, before the world had a name. *She hugs her knees.* I believe the Architects didn\'t BUILD the dungeon. They found the Eye and built the dungeon around it. A container. A prison. A monument. It dreams, and its dreams become the dungeon\'s reality. When it blinks, floors rearrange. When it dreams deeply, new levels appear. *A pause.* I went looking for it once. With the Silver Delvers. I found it. And it... found me. I understood everything for one terrible, beautiful moment. And then I chose to come back. Most people don\'t make that choice.',
			[
				opt('What did you understand? [Story collected]', 'story_eye_truth', '#4f4', { onSelect: { story: STORIES.thessaly_eye } }),
			]
		),
		story_eye_truth: node('story_eye_truth',
			'*She\'s quiet for a long time.* That the dungeon isn\'t meant to be conquered. It\'s meant to be... experienced. Every trap, every monster, every treasure \u2014 it\'s all a curriculum. The Eye is teaching. Every adventurer who enters is a student. And the final exam... *She looks at you.* ...is whether you walk back out or stay to learn more. Thessaly chose to learn. Part of her is still down there, studying. Part of her is here, in chains, regretting the study abroad program. *She manages a weak laugh.* Academic humor. Sorry.',
			[
				opt('You\'re remarkable, Thessaly.', 'return', '#4f4'),
				opt('I\'ll take that exam when the time comes.', 'return', '#ff4'),
			]
		),
		persuade_thessaly_ok: node('persuade_thessaly_ok',
			'*She studies your face for a long moment, then something softens.* You remind me of myself, before the chains and the goblin cuisine. Alright. My greatest discovery. *She lowers her voice.* The dungeon has a heartbeat. Not a metaphor \u2014 a literal cardiac rhythm. 72 beats per minute, same as a human at rest. I measured it with resonance crystals across three levels. The dungeon is alive. Not "alive" like a forest or an ecosystem. Alive like a PERSON. It has moods. It has preferences. And I believe \u2014 though I could never prove it \u2014 that it\'s lonely. It creates monsters and traps not to kill adventurers, but to make them STAY.',
			[
				opt('The dungeon is lonely? That\'s... heartbreaking. [Rumor learned]', 'return', '#4f4', { onSelect: { rumor: RUMORS.potions_matter, message: 'Thessaly reveals her greatest discovery: the dungeon has a heartbeat!', mood: 'friendly' } }),
			]
		),
		persuade_thessaly_fail: node('persuade_thessaly_fail',
			'*She gives you the look of a professor whose student just tried to submit a paper written entirely in crayon.* Flattery? Really? I\'ve been an academic for twenty years. I\'ve been flattered by department chairs angling for my research grants. I\'ve been flattered by grad students hoping I\'d forget their missing dissertations. I\'ve been flattered by a sentient gouda that wanted me to sign its memoir. Your attempt ranks somewhere between the gouda and the time a goblin told me I looked "only slightly edible." Points for effort, though. D-plus.',
			[
				opt('A sentient gouda wrote a memoir?!', 'gouda_memoir', '#ff4'),
				opt('I deserved that.', 'return', '#4f4', { onSelect: { mood: 'amused' } }),
			]
		),
		gouda_memoir: node('gouda_memoir',
			'*She almost smiles.* Oh yes. "Whey of the World: A Cheese\'s Journey to Sentience." Three hundred pages. Surprisingly well-written, if a bit dairy-centric. It argued that consciousness is just organized fermentation, which is \u2014 frankly \u2014 not the worst theory I\'ve encountered in peer review. The Athenaeum rejected it on grounds of "being cheese." Thessaly \u2014 the other Thessaly, the one who stayed behind \u2014 she voted to publish. She always was the bravest of us.',
			[
				opt('Wait, there\'s another Thessaly?', 'two_thessalys', '#8cf'),
				opt('I need to find that gouda.', 'return', '#ff4', { onSelect: { mood: 'amused' } }),
			]
		),
		two_thessalys: node('two_thessalys',
			'*She sighs.* The Athenaeum had a naming convention problem. There were three of us, actually. Thessaly of Grey Reaches \u2014 that\'s me. Thessaly of the Northern Spires \u2014 she\'s the one who went into the Eye. And Thessaly the Younger, who got tired of the confusion and legally changed her name to "Not Thessaly." She works in accounting now. The mail situation was a NIGHTMARE.',
			[
				opt('Three Thessalys and a sentient cheese. Academia is wild.', 'return', '#4f4', { onSelect: { mood: 'amused' } }),
			]
		),
		deceive_thessaly_ok: node('deceive_thessaly_ok',
			'*Her eyes widen with genuine shock.* Aldric sent \u2014 ALDRIC?! That backstabbing, window-coveting, grant-stealing \u2014 *She catches herself.* Actually... if Aldric sent a rescue team, things must be dire. He wouldn\'t spend the budget unless the Anchor Stones situation is critical. *She grabs your arm through the bars.* Listen carefully. Under the Athenaeum library, third sub-basement, behind the painting of Scholar Venn \u2014 there\'s a vault. Inside is my complete research on the Severance. The password is "the gouda was right." Aldric must NOT get those notes. If you\'re truly from the Athenaeum, you\'ll ensure they reach Scholar Maren instead. She\'s the only one I trust.',
			[
				opt('I\'ll make sure Maren gets them. [Rumor learned]', 'return', '#4f4', { onSelect: { rumor: RUMORS.singing_walls, message: 'Thessaly reveals the location of her secret Severance research!', mood: 'friendly' } }),
			]
		),
		deceive_thessaly_fail: node('deceive_thessaly_fail',
			'*Her expression goes cold as ice.* Aldric sent you. How interesting. Because I happen to know that Aldric has been ACTIVELY BLOCKING rescue expeditions to this dungeon for the past six months. He filed three separate motions with the Council to designate my section as "acceptable losses." He ALSO stole my favorite quill. The red one with the phoenix feather. *She narrows her eyes.* You\'re either lying or you\'re one of Aldric\'s pawns. Either way, I am DEEPLY unimpressed. The goblins are better liars than you, and their best deception was wearing a fake mustache and pretending to be a health inspector.',
			[
				opt('That health inspector story keeps coming up...', 'return', '#ff4', { onSelect: { mood: 'hostile' } }),
				opt('I\'m sorry. I shouldn\'t have lied to you.', 'deceive_apology', '#4f4'),
			]
		),
		deceive_apology: node('deceive_apology',
			'*She studies you for a long moment, then exhales.* At least you have the decency to admit it. That puts you above most academics I\'ve known. *A tired smile.* I\'ve been down here long enough to recognize desperation. Whatever you\'re looking for, I respect honesty more than cleverness. Ask me a real question and I\'ll give you a real answer. Scholar\'s honor.',
			[
				opt('What is the Severance?', 'below', '#f44'),
				opt('How do I survive the deeper levels?', 'escape', '#ff4'),
				opt('Thank you for understanding.', 'return', '#4f4', { onSelect: { mood: 'neutral' } }),
			]
		),
		return_afraid: node('return_afraid',
			'*She\'s huddled in the corner, scratching equations into the stone with her fingernail.* The rats are organizing. I\'ve been tracking their patrol patterns. They have SHIFTS. They have a HIERARCHY. The big one with the scar \u2014 I call him Regional Manager \u2014 he reports to something deeper. Something that understands logistics.',
			[
				opt('Thessaly, those are just rats.', 'return', '#4f4', { onSelect: { mood: 'neutral', message: '"JUST rats? That\'s what the last assistant said. Before the rats promoted her to food."' } }),
				opt('What does the Regional Manager want?', 'return', '#ff4', { onSelect: { mood: 'afraid', message: '"Performance reviews. For everyone. Including us."' } }),
				opt('I\'ll protect you from the rat hierarchy.', 'return', '#4f4', { onSelect: { mood: 'friendly', message: 'She relaxes slightly. "You\'d fight a middle manager? You\'re braver than I thought."' } }),
			]
		),
		return_hostile: node('return_hostile',
			'*She doesn\'t look up from her notes.* I have seventeen equations to solve before the dungeon reshuffles. Each one represents a possible escape route. You just interrupted equation fourteen. Equation fourteen was CRITICAL. It involved a variable I have been chasing for THREE WEEKS. That variable is now GONE. I hope you\'re happy.',
			[
				opt('I\'m sorry about the variable.', 'return', '#4f4', { onSelect: { mood: 'neutral', message: '"It was a beautiful variable. Complex. Irrational. Like me."' } }),
				opt('Can I help with the equations?', 'return', '#ff4', { onSelect: { mood: 'amused', message: '"Can you solve a non-Euclidean quadratic in Deepscript notation?" *She sees your face.* "I\'ll take that as no."' } }),
				opt('Math can\'t be that important.', '__exit__', '#f44', { onSelect: { npcAction: 'break_down', message: 'Thessaly stares at you with the hollow eyes of someone whose life\'s work was just dismissed.' } }),
			]
		),
		return_sad: node('return_sad',
			'*She\'s staring at the chains on the wall.* I had a laboratory once. Real equipment. Proper beakers. A grant from the University of Applied Nonsense. Now I have a cave, some rats, and a fingernail I\'ve been using as a stylus. My academic career peaked at "prisoner who does math."',
			[
				opt('You\'ll get back to your lab.', 'return', '#4f4', { onSelect: { mood: 'neutral', message: '"The lab was condemned after the gouda incident. But the sentiment is appreciated."' } }),
				opt('Tell me about your research. The real stuff.', 'research', '#8cf', { onSelect: { mood: 'friendly' } }),
				opt('At least the rats appreciate your math.', 'return', '#ff4', { onSelect: { mood: 'amused', message: '"Regional Manager does seem impressed by my graphs. He chewed the least important one."' } }),
			]
		),
		return_amused: node('return_amused',
			'*She\'s actually giggling, which is unsettling from a prisoner in chains.* I just realized something. The dungeon\'s trap placement follows a Fibonacci spiral. The ENTIRE dungeon is one enormous mathematical joke. Someone with a cosmic sense of humor built the world\'s deadliest punchline. I am trapped inside a JOKE. This is the funniest thing that has ever happened to me. Also the worst.',
			[
				opt('Is the punchline on level twenty?', 'return', '#ff4', { onSelect: { mood: 'amused' } }),
				opt('You\'re handling captivity remarkably well.', 'return', '#4f4', { onSelect: { mood: 'amused', message: '"It\'s the equations. They keep me sane. Mostly. The giggling is new."' } }),
				opt('A Fibonacci trap spiral. Of course.', 'return', '#4f4', { onSelect: { mood: 'amused' } }),
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
				opt('My guild will DOUBLE your standard rate for priority access to your best wares.', 'social_deceive_morrigan', '#c4f', { socialCheck: { skill: 'deceive', difficulty: 16, successNode: 'deceive_morrigan_ok', failNode: 'deceive_morrigan_fail' }, once: true }),
				opt('Give me your best supplies. Free. Or I start breaking merchandise.', 'social_intimidate_morrigan', '#f84', { socialCheck: { skill: 'intimidate', difficulty: 20, successNode: 'intimidate_morrigan_ok', failNode: 'intimidate_morrigan_fail' }, once: true }),
				opt('Goodbye.', 'farewell', '#0ff'),
			]
		),
		return: node('return',
			'*She beams at you.* My favorite customer! Well, my only living customer. The distinction matters less than you\'d think.',
			[
				opt('Got anything for me?', 'wares', '#ff4'),
				opt('Heard any trade gossip?', 'merchant_rumors', '#ff4'),
				opt('Tell me a trade story.', 'morrigan_stories', '#c8f'),
				opt('[Rogue] Got anything that fell off the back of a wagon?', 'rogue_wares', '#4f8', { showIf: { type: 'class', value: 'rogue' } }),
				opt('You\'ve been down here a long time...', 'deep_merchant', '#ff4', { showIf: { type: 'minLevel', value: 5 } }),
				opt('How\'s business?', 'business', '#8cf'),
				opt('Any tips about this level?', 'tips', '#ff4'),
				opt('I\'ve opened a lot of chests down here.', 'morrigan_chests', '#ff4', { showIf: { type: 'minChestsOpened', value: 10 } }),
				opt('I\'ve cleared a lot of levels.', 'morrigan_veteran', '#f84', { showIf: { type: 'minLevelsCleared', value: 5 } }),
				opt('I hear I have a... reputation.', 'morrigan_liar', '#fa4', { showIf: { type: 'knownLiar', value: 3 } }),
			opt('Goodbye, Morrigan.', 'farewell', '#0ff'),
			]
		),
		morrigan_liar: node('morrigan_liar',
			'*Her eyes light up like she\'s found a kindred spirit.* A REPUTATION? Oh, darling, you don\'t have a reputation. You have a PORTFOLIO. I\'ve been tracking your lies like an art collector. The one where you tried to bluff the Stranger? Magnificent. Doomed, obviously \u2014 lying to a three-century-old dungeon anchor is like trying to sell water to a fish \u2014 but the AUDACITY! *She claps her hands.* I haven\'t seen deception this ambitious since I sold a Skeleton its own femur back. Told him it was a "premium replacement bone." He couldn\'t tell the difference. To be fair, he didn\'t have a brain.',
			[
				opt('You\'re... impressed?', 'morrigan_liar_impressed', '#ff4'),
				opt('I\'m not proud of it.', 'morrigan_liar_shame', '#4f4'),
			]
		),
		morrigan_liar_impressed: lie('morrigan_liar_impressed',
			'*She leans in conspiratorially.* Impressed? I\'m INSPIRED. Most adventurers are boringly honest. "Help me, I\'m dying." "Please, I need healing." "Stop selling counterfeit potions." SO tedious. But you? You understand that truth is just one option on a very long menu. *She winks.* Between you and me, half my "rare artifacts" are just regular items with fancy names. My "Cloak of Ethereal Shadows" is a curtain. My "Blade of a Thousand Cuts" has a paper cut on the handle. Marketing, darling. It\'s ALL marketing.',
			[
				opt('We\'re both terrible people. [+2 ATK]', 'return', '#4f4', { onSelect: { atk: 2, message: 'Morrigan shares her secrets of the trade. +2 ATK', mood: 'amused' } }),
			]
		),
		morrigan_liar_shame: node('morrigan_liar_shame',
			'*She tilts her head.* Not proud? Oh, honey. Pride is for people who haven\'t learned that shame is just pride with worse marketing. *She pats your hand.* But if you\'re genuinely trying to reform, I respect that too. Honesty is the most expensive luxury in a dungeon. Nobody can afford it. That\'s why I sell the affordable alternative. *She gestures at her wares.* Plausible deniability, darling. In potion form.',
			[
				opt('Thanks, Morrigan. I think.', 'return', '#4f4'),
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
		morrigan_chests: node('morrigan_chests',
			'*She leans forward, practically vibrating.* Ten chests? You\'ve opened TEN CHESTS? Do you have ANY idea what that means from a supply chain perspective? *She pulls out an abacus.* Each chest represents approximately three to five items that I could have sold you at a MUCH higher markup! You\'re cutting out the middlewoman! *She gasps.* Wait. Do you take requests? Because if you could stop opening the ones with health potions and leave those for me to "discover" and resell, we could have a VERY profitable arrangement. I\'d give you a ten percent finder\'s fee. *She pauses.* Five percent. Three. Final offer.',
			[
				opt('You want me to stop looting chests so YOU can sell me the contents?', 'morrigan_chests_scheme', '#f44'),
				opt('That is the most Morrigan thing I\'ve ever heard.', 'return', '#4f4', { onSelect: { mood: 'amused' } }),
			]
		),
		morrigan_chests_scheme: node('morrigan_chests_scheme',
			'*She throws up her hands.* When you say it OUT LOUD it sounds unreasonable! But that\'s because you\'re thinking like a consumer. Think like a BUSINESSWOMAN. Those chests are free inventory! Placed by the dungeon at no cost to anyone! And you\'re just TAKING it? For FREE? That\'s not adventuring, that\'s SHOPLIFTING! *She catches herself.* From a living labyrinth. Which doesn\'t technically own the items. And has no legal standing. *A long pause.* My argument has some structural weaknesses, I admit.',
			[
				opt('Several, yes.', 'return', '#4f4', { onSelect: { mood: 'amused' } }),
			]
		),
		morrigan_veteran: node('morrigan_veteran',
			'*She sizes you up with newfound respect.* Five levels cleared. FIVE. Do you know how many adventurers clear five levels? About one in twenty. The rest become... inventory. *She gestures around.* Half the bones on these floors used to be customers. I mourn them. Briefly. Then I sell their dropped equipment. The circle of commerce. *She becomes serious.* But YOU. You keep coming back. You\'re what we in the trade call a "recurring revenue stream." That\'s the highest compliment a merchant can give. Higher than "friend." Higher than "valued customer." You are RELIABLE INCOME.',
			[
				opt('I\'ve never been so flattered and insulted simultaneously.', 'morrigan_vet_flattered', '#ff4'),
				opt('Do you have better stock for experienced adventurers?', 'morrigan_vet_stock', '#4f4'),
			]
		),
		morrigan_vet_flattered: node('morrigan_vet_flattered',
			'*She winks.* That\'s my specialty. I once made a Lich feel simultaneously honored and offended by calling his phylactery "vintage." He didn\'t know whether to thank me or curse me. He did both. I sold him a "premium curse removal kit" for the curse he JUST cast on me. Double sale! TRIPLE if you count the emotional damage. *She beams.* Anyway, since you\'re clearly going to survive long enough to be a repeat customer \u2014 here. Something from my personal reserve.',
			[
				opt('From your personal reserve? [+3 ATK]', 'return', '#4f4', { onSelect: { atk: 3, message: 'Morrigan shares something from her secret stock! +3 ATK', mood: 'friendly' } }),
			]
		),
		morrigan_vet_stock: node('morrigan_vet_stock',
			'*She rummages through her infinite pouches.* Better stock for better customers! I have a tiered loyalty program. Bronze tier: you get to browse. Silver tier: I stop lying about the prices. Gold tier: I tell you which items are ACTUALLY magical and which are just shiny. Platinum tier: I reveal my real prices. *She lowers her voice.* Nobody has ever reached Platinum tier. The Gold tier customers all died. The Silver tier customers all left. You are \u2014 I think \u2014 the first Bronze customer to come back FIVE TIMES. Which means you get... *drumroll* ...a small discount. Very small.',
			[
				opt('How small?', 'return', '#ff4', { onSelect: { hp: 4, message: 'Morrigan grudgingly applies a tiny discount. +4 HP in premium potions!' } }),
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
				opt('A salve? I was hoping for something... better. Can we negotiate?', 'haggle_start', '#ff4', { once: true }),
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
		rogue_wares: node('rogue_wares',
			'*She glances left and right \u2014 unnecessarily, given you\'re in a dungeon \u2014 and produces a small pouch.* I KNEW you were the discerning type. I have a very special inventory for customers with... flexible ethics. Lock picks, smoke bombs, a "previously owned" dagger with someone else\'s name engraved on it. *She winks.* The trick to being a rogue in a dungeon? Everything is already stolen. The dungeon stole it from the surface. You\'re just redistributing assets. Very ethical, if you think about it wrong enough.',
			[
				opt('I like the way you think, Morrigan.', 'return', '#4f4'),
			]
		),
		deep_merchant: node('deep_merchant',
			'*She waves a hand dismissively.* "Down here a long time?" I\'ve been on THIS level for two weeks. But I\'ve been in the dungeon for... *She counts on her fingers.* ...longer than I should admit. The first rule of dungeon retail: never tell the customer how long you\'ve been lost. Bad for confidence. Bad for sales. *She lowers her voice.* Between you and me? I stopped trying to reach the surface four floors ago. The dungeon provides customers. The monsters provide protection. And the rent is free. I\'ve genuinely considered this a permanent business address. "Morrigan\'s Mobile Emporium" might need rebranding to "Morrigan\'s Immobile Emporium." Less catchy. But honest.',
			[
				opt('You LIVE in the dungeon?!', 'live_dungeon', '#f44'),
				opt('That\'s oddly inspiring.', 'return', '#4f4'),
			]
		),
		live_dungeon: node('live_dungeon',
			'Where else would I go? The surface has TAXES. Regulations. Health inspections. Do you know what a health inspector would say about my inventory? *She gestures at a jar of pickled something.* Down here, nobody asks if my potions are "FDA approved." Nobody asks what FDA MEANS. It\'s paradise. Horrifying, monster-infested, perpetually dark paradise. But I\'ve learned to appreciate the ambiance. The screaming from level six adds atmosphere. Very mood-setting for the evening sale.',
			[
				opt('You\'re genuinely terrifying, Morrigan.', 'return', '#4f4'),
			]
		),
		morrigan_stories: node('morrigan_stories',
			'*She claps her hands.* Oh, you want to hear about my business ventures? Most people just want potions. You, my friend, want ENTERTAINMENT. I like that. What shall I tell you about?',
			[
				opt('Tell me about the slime fashion industry.', 'story_slime', '#c8f', { once: true }),
				opt('How does the dungeon economy work?', 'story_economy', '#c8f', { once: true }),
				opt('No more stories, thanks.', 'return', '#0ff'),
			]
		),
		story_slime: node('story_slime',
			'*She beams.* My greatest achievement! I sold a decorative bow to a gelatinous slime. It absorbed it. Became FASHIONABLE. Started a TREND. Within a WEEK, every slime on the level wanted accessories. I sold forty-seven tiny hats, twelve monocles, and a cravat. The cravat slime became their leader. President Cravat. Very dignified. Ate three adventurers with impeccable manners. *She wipes a proud tear.* I made more gold that week than most merchants make in a year. And all I had to do was accessorize sentient ooze. The market was RIGHT THERE. Nobody else saw it.',
			[
				opt('President Cravat. Amazing. [Story collected]', 'morrigan_stories', '#4f4', { onSelect: { story: STORIES.morrigan_slime } }),
			]
		),
		story_economy: node('story_economy',
			'*She pulls out what appears to be a ledger.* Oh, the dungeon has a FULL economy. Goblins mine ore \u2014 terrible miners, but enthusiastic. Skeletons provide manual labor \u2014 cheap, they don\'t eat, excellent work ethic, never complain. Mimics run the banking sector. Very trustworthy, if you don\'t try to open them. Slimes handle waste management \u2014 they eat everything, very efficient. The only thing the dungeon lacks is a tax authority. *She places a hand on her heart.* Which I consider its single greatest feature. Pure capitalism. No regulations. No returns policy. Customer ate the product? Not my problem. Customer was eaten BY the product? ALSO not my problem. It\'s beautiful.',
			[
				opt('This is the weirdest economy ever. [Story collected]', 'morrigan_stories', '#4f4', { onSelect: { story: STORIES.morrigan_economy } }),
			]
		),
		deceive_morrigan_ok: node('deceive_morrigan_ok',
			'*Her eyes light up with barely contained avarice.* DOUBLE rate?! Priority access?! Guild-backed funding?! *She\'s already rummaging through her bags.* Oh, you wonderful, deep-pocketed darling! For a premium client I have the SPECIAL stock. *She produces a glowing vial from a hidden pocket.* Morrigan\'s Miracle Elixir. Cures what ails you, prevents what doesn\'t, and makes your hair shinier as a bonus side effect. Normally I charge a king\'s ransom. For YOU \u2014 complimentary sample. Gotta hook \'em with the free taste, as my mentor always said. She sold potions to dragons. DRAGONS. They don\'t even have pockets.',
			[
				opt('Take the Miracle Elixir. [+8 HP, +2 ATK]', 'return', '#4f4', { onSelect: { hp: 8, atk: 2, message: 'Morrigan\'s Miracle Elixir surges through you! +8 HP, +2 ATK!' } }),
			]
		),
		deceive_morrigan_fail: node('deceive_morrigan_fail',
			'*She gives you a look that could curdle milk at forty paces.* "Guild-backed funding." Oh sweetie. I have sold haunted mirrors to ghosts. I have convinced a dragon that he needed fire insurance. I once sold a bucket of AIR to a suffocating fish-man and upsold him on a "premium breathing package." You think you can out-lie the woman who convinced an entire goblin tribe that invisible armor was the next big fashion trend? *She cackles.* They\'re still wearing it! Walking around naked, thinking they look FABULOUS! I am the QUEEN of deception, darling. Bow to the throne or buy something with real coin.',
			[
				opt('...I bow to the throne.', 'return', '#4f4', { onSelect: { mood: 'amused' } }),
				opt('Invisible armor. Genius.', 'invisible_armor', '#ff4'),
			]
		),
		invisible_armor: node('invisible_armor',
			'*She preens.* My magnum opus! I even gave them a certificate of authenticity. "This certifies that the bearer is wearing EXTREMELY invisible armor of GREAT quality." They FRAMED it. It hangs in the Goblin Chief\'s throne room. Right next to his "Employee of the Month" award \u2014 which I ALSO sold him. He\'s the only employee. Won every month. Very proud of it. *She wipes a tear.* Customer retention is about making them feel SPECIAL. Even if what you\'re selling is technically nothing.',
			[
				opt('You are a menace to society.', 'return', '#4f4', { onSelect: { mood: 'amused' } }),
			]
		),
		intimidate_morrigan_ok: node('intimidate_morrigan_ok',
			'*She blinks. Her eye twitches. For the first time in her career, Morrigan looks genuinely unsettled.* I... well. *She swallows.* Nobody\'s ever actually scared me before. Even the Minotaur who threatened to sit on me \u2014 I sold him a cushion. But you... you\'ve got something in your eyes that even the monsters don\'t have. *She slowly pulls out a health potion.* Here. Take it. On the house. And please... please stop looking at me like that. I have a very active imagination and it\'s currently showing me things I don\'t enjoy.',
			[
				opt('Smart choice. [+6 HP]', 'return', '#4f4', { onSelect: { hp: 6, message: 'Morrigan nervously hands over a premium health potion! +6 HP', mood: 'afraid' } }),
			]
		),
		intimidate_morrigan_fail: node('intimidate_morrigan_fail',
			'*She stares at you. Then she starts laughing. Then she KEEPS laughing. Then she\'s on the floor, tears streaming.* Oh... oh my... YOU? Intimidate ME? Dearie, I have stared down a LICH over a disputed invoice. I have threatened a BEHOLDER with a bad Yelp review. I once told an ANCIENT RED DRAGON that his payment was overdue and charged him a LATE FEE. He paid! WITH INTEREST! *She wipes her eyes.* You\'re adorable. Here, have a consolation cookie. *She produces a stale cookie from somewhere.* It\'s only slightly cursed.',
			[
				opt('...slightly cursed?', 'cursed_cookie', '#f44'),
				opt('I\'ll pass on the cursed cookie.', 'return', '#4f4', { onSelect: { mood: 'amused' } }),
			]
		),
		cursed_cookie: node('cursed_cookie',
			'*She waves dismissively.* Minor curse. You might see colors slightly differently for an hour. Or hear a faint humming. Or develop a temporary fondness for interpretive dance. The goblin I got the recipe from said it was "mostly harmless," which in goblin translates to "only two previous customers died, and one of them was already dead." Very encouraging odds, relatively speaking. The undead customer actually LEFT a positive review. Said the cookie was "life-changing." Which, given he was a skeleton, had a very literal meaning.',
			[
				opt('I\'m going to pass. Firmly.', 'return', '#4f4', { onSelect: { mood: 'amused' } }),
			]
		),
		// ─── HAGGLING SYSTEM ───
		haggle_start: node('haggle_start',
			'*Her eyes light up with the unholy gleam of a merchant who smells a deal.* NEGOTIATE? Oh, darling. You just said my favorite word. *She cracks her knuckles.* I should warn you: I once haggled a Fire Elemental down to room temperature. Literally. He\'s a Lukewarm Elemental now. Very sad. Very affordable. What did you have in mind?',
			[
				opt('I need better healing. The salve isn\'t enough.', 'haggle_healing', '#4f4'),
				opt('I need something to hit harder. Attack boost.', 'haggle_weapon', '#ff4'),
				opt('What\'s your BEST stuff? The hidden stock.', 'haggle_secret', '#c8f', { showIf: { type: 'npcMood', value: 'friendly' } }),
				opt('Actually, the salve is fine.', 'wares', '#0ff'),
			]
		),
		haggle_healing: node('haggle_healing',
			'*She taps her chin.* Better healing, better healing... *She digs through her bags.* I\'ve got Morrigan\'s Premium Recovery Tonic. Heals twice what the salve does. But it\'s not free, darling. Nothing in a dungeon is free. Except death. Death has EXCELLENT pricing. Very competitive.',
			[
				opt('Name your price.', 'haggle_healing_price', '#ff4'),
				opt('What if I told you I have connections to the Athenaeum?', 'haggle_healing_persuade', '#4cf', { socialCheck: { skill: 'persuade', difficulty: 12, successNode: 'haggle_healing_good', failNode: 'haggle_healing_meh' } }),
				opt('I could just take it. You know that, right?', 'haggle_healing_intimidate', '#f84', { socialCheck: { skill: 'intimidate', difficulty: 14, successNode: 'haggle_healing_good', failNode: 'haggle_threat_fail' } }),
			]
		),
		haggle_healing_price: node('haggle_healing_price',
			'*She grins.* My standard rate: information. Tell me something I don\'t know about the dungeon. A secret. A rumor. Something JUICY. Knowledge is currency down here, and Morrigan trades in ALL currencies. *She leans forward.* What have you got for me?',
			[
				opt('The dungeon has a heartbeat. 72 beats per minute. Like a sleeping person.', 'haggle_healing_good', '#8cf', { showIf: { type: 'hasRumors', value: 3 } }),
				opt('I\'ve spoken with a creature that calls itself an Architect.', 'haggle_healing_good', '#a8f', { showIf: { type: 'knowsLanguage', value: 'Deepscript' } }),
				opt('I don\'t have anything worth trading.', 'haggle_healing_meh', '#888'),
				opt('The walls sing on the deeper levels. Beautiful melodies.', 'haggle_healing_decent', '#ff4'),
			]
		),
		haggle_healing_good: node('haggle_healing_good',
			'*Her jaw drops.* That\'s... that\'s INCREDIBLE. Do you know how much that information is worth to the right buyer? The Athenaeum would pay a FORTUNE. The alchemists\' guild would start a BIDDING WAR. *She pulls out a large, ornate bottle.* Here \u2014 Morrigan\'s Premium Recovery Tonic. And a little extra for the quality of the intel. I LIKE doing business with you.',
			[
				opt('Take the Premium Tonic. [+10 HP]', 'haggle_complete', '#4f4', { onSelect: { hp: 10, message: 'Morrigan\'s Premium Recovery Tonic surges through you! +10 HP', mood: 'friendly' } }),
			]
		),
		haggle_healing_decent: node('haggle_healing_decent',
			'*She considers.* Singing walls... I\'ve heard that one before, but it\'s still good gossip material. Worth a mid-tier exchange. *She pulls out a respectable bottle.* Standard Premium Tonic. Fair trade for fair information. The walls singing, though \u2014 I wonder what they\'re singing ABOUT. Probably complaining about load-bearing responsibilities. Walls have a LOT of stress.',
			[
				opt('Take the Tonic. [+7 HP]', 'haggle_complete', '#4f4', { onSelect: { hp: 7, message: 'Morrigan\'s Premium Recovery Tonic warms your core! +7 HP' } }),
			]
		),
		haggle_healing_meh: node('haggle_healing_meh',
			'*She sighs.* Nothing to trade? No rumors, no secrets, no scandalous academic gossip? *She thinks.* Alright, alright. Since you\'re a regular customer and I\'d rather have a LIVE regular than a dead one-timer... I\'ll give you the tonic at cost. Which is still better than the salve. Consider it an investment in customer retention.',
			[
				opt('Take the Tonic at cost. [+6 HP]', 'haggle_complete', '#4f4', { onSelect: { hp: 6, message: 'Morrigan reluctantly hands over a basic tonic. +6 HP' } }),
			]
		),
		haggle_weapon: node('haggle_weapon',
			'*She whistles.* Attack boost? Now THERE\'S a premium request. *She opens a locked pouch.* I\'ve got Morrigan\'s Blade Oil \u2014 makes any weapon cut sharper. Also makes it smell like lemons. Side effect. Possibly a feature, depending on your feelings about citrus.',
			[
				opt('What do you want for it?', 'haggle_weapon_price', '#ff4'),
				opt('My guild would pay triple if you throw in extra. Trust me.', 'haggle_weapon_deceive', '#c4f', { socialCheck: { skill: 'deceive', difficulty: 15, successNode: 'haggle_weapon_great', failNode: 'haggle_weapon_caught' } }),
				opt('I\'ll take whatever you\'ve got.', 'haggle_weapon_basic', '#4f4'),
			]
		),
		haggle_weapon_price: node('haggle_weapon_price',
			'*She considers.* For the Blade Oil? I need a STORY. Not a rumor \u2014 a real story. Something that happened to you, or that you heard firsthand. I collect stories the way other merchants collect coins. They\'re worth more, honestly. Coins get spent. Stories get TOLD. And every time someone tells a story, Morrigan gets free advertising.',
			[
				opt('[Share a tale of the Silver Delvers]', 'haggle_weapon_good', '#c8f', { showIf: { type: 'hasStories', value: 2 } }),
				opt('[Describe the Eye Below]', 'haggle_weapon_good', '#f44', { showIf: { type: 'hasStories', value: 4 } }),
				opt('I don\'t have stories worth telling yet.', 'haggle_weapon_basic', '#888'),
			]
		),
		haggle_weapon_good: node('haggle_weapon_good',
			'*Her eyes widen as you speak. She actually stops rummaging.* ...that\'s MAGNIFICENT. The drama! The tragedy! The sentient gouda! *She wipes a tear.* THAT is a story I can sell for YEARS. Here \u2014 take the premium Blade Oil. You\'ve more than earned it. And if you get more stories, come back. I\'ll always deal for a good narrative.',
			[
				opt('Take the Premium Blade Oil. [+3 ATK]', 'haggle_complete', '#4f4', { onSelect: { atk: 3, message: 'Morrigan\'s Premium Blade Oil makes your weapon sing! +3 ATK', mood: 'friendly' } }),
			]
		),
		haggle_weapon_basic: node('haggle_weapon_basic',
			'*She shrugs.* No stories? That\'s fine. You\'re still new. Tell you what \u2014 take the standard Blade Oil. When you\'ve got something worth telling, come back and I\'ll upgrade you. Consider it a... narrative credit system. Buy now, story later.',
			[
				opt('Take the Standard Blade Oil. [+1 ATK]', 'haggle_complete', '#4f4', { onSelect: { atk: 1, message: 'Morrigan\'s Blade Oil adds a slight edge! +1 ATK' } }),
			]
		),
		haggle_weapon_great: node('haggle_weapon_great',
			'*She claps.* Oh you wonderful liar \u2014 I ALMOST believed you! Almost! But the guild line was a nice touch. You know what? I respect the hustle. Takes one to know one. Here \u2014 take the DELUXE Blade Oil. Consider it professional courtesy from one con artist to another. Normally I\'d be offended, but honestly? That was ART.',
			[
				opt('Take the Deluxe Blade Oil. [+4 ATK]', 'haggle_complete', '#4f4', { onSelect: { atk: 4, message: 'Morrigan\'s Deluxe Blade Oil makes your weapon deadly! +4 ATK', mood: 'amused' } }),
			]
		),
		haggle_weapon_caught: node('haggle_weapon_caught',
			'*She stares at you for three full seconds, then bursts out laughing.* "My guild would pay triple." YOUR GUILD. Darling, I have SOLD THINGS to every guild in the Grey Reaches. I know their rates. I know their handshakes. I know which guild master snores. You do NOT have guild backing. *She wags a finger.* Nice try, though. Here \u2014 take the basic oil. For audacity.',
			[
				opt('Take the Basic Blade Oil. [+1 ATK]', 'haggle_complete', '#4f4', { onSelect: { atk: 1, message: 'Morrigan gives you oil out of pity. +1 ATK', mood: 'amused' } }),
			]
		),
		haggle_threat_fail: node('haggle_threat_fail',
			'*She doesn\'t even blink.* Sweetie. I sell things to GOBLINS. Goblins who have AXES. And TEETH. And a COMPLETE LACK of consumer protection laws. You think a vague threat is going to rattle ME? *She pats your hand condescendingly.* Take the basic salve. And maybe work on your intimidation technique. I offer lessons. For a price. Everything is for a price.',
			[
				opt('Take the salve. [+5 HP]', 'haggle_complete', '#4f4', { onSelect: { hp: 5, message: 'Morrigan pats your head and hands you a basic salve. +5 HP', mood: 'amused' } }),
			]
		),
		haggle_secret: node('haggle_secret',
			'*She glances around, then pulls you closer.* The hidden stock? You\'ve EARNED the hidden stock. *She opens a pouch she\'s never opened before \u2014 it glows faintly from within.* I found these on level twelve, near the Anchor Stone chamber. They\'re... different. The dungeon MADE them. Not placed by adventurers, not dropped by monsters. Grown. Like fruit. From the walls.',
			[
				opt('What do they do?', 'haggle_secret_reveal', '#ff4'),
			]
		),
		haggle_secret_reveal: node('haggle_secret_reveal',
			'*She holds up a crystalline vial filled with liquid starlight.* Essence of the Deep. The dungeon\'s own blood, if you will. It heals AND strengthens. I\'ve seen it close wounds that should have been fatal and sharpen a blade to cut through stone. I have exactly ONE vial, and I\'ve been saving it for someone who deserves it. *She looks at you.* Someone who treats me like a person, not just a vending machine in a cave.',
			[
				opt('I\'m honored, Morrigan. [Take Essence of the Deep]', 'haggle_secret_taken', '#4f4', { onSelect: { hp: 15, atk: 3, message: 'Essence of the Deep surges through you! +15 HP, +3 ATK! The dungeon itself lent its power.' } }),
			]
		),
		haggle_secret_taken: node('haggle_secret_taken',
			'*She watches you drink it with an expression that\'s part pride, part maternal concern, part merchant calculating the missed revenue.* That was worth more gold than I\'ll earn in my lifetime. And I gave it away. FOR FREE. My mother would be having a stroke right now. *She grins.* But mum never fought in a dungeon. Some things are worth more than profit. Like... *She searches for the word.* ...friendship? Is that the one? I\'m not great with non-monetary values. But I think that\'s it.',
			[
				opt('That\'s the one, Morrigan.', 'return', '#4f4', { onSelect: { mood: 'friendly' } }),
			]
		),
		haggle_complete: node('haggle_complete',
			'*She rubs her hands together.* Pleasure doing business. Morrigan\'s Mobile Emporium \u2014 where every transaction is an adventure and every adventure is tax-deductible! *She packs up her display.* Come back anytime. Alive, preferably. Repeat customers are the backbone of any sustainable business model, and dead people are TERRIBLE at repeat purchasing. Though I did once sell a ghost its own burial shroud. Nice markup on that one.',
			[
				opt('You\'re one of a kind, Morrigan.', 'return', '#4f4'),
				opt('[Leave]', '__exit__', '#0ff'),
			]
		),
		// ─── MOOD-SPECIFIC RETURN NODES ───
		return_hostile: node('return_hostile',
			'*She doesn\'t look up from counting coins.* Oh. The rude one. *She snaps a pouch shut.* I\'ll have you know that I have a STRICT policy regarding aggressive customers. It\'s called the "Morrigan Surcharge." Everything you want to buy? Triple price. The healing salve? Triple. The advice? Triple. The TIME OF DAY? Also triple. Would you like to apologize, or would you like to see the quadruple tier? Because I HAVE a quadruple tier.',
			[
				opt('I apologize, Morrigan. I was wrong.', 'return', '#4f4', { onSelect: { mood: 'neutral', message: 'Morrigan graciously accepts your apology. Prices return to normal.' } }),
				opt('...quadruple?', 'quadruple_price', '#f44'),
				opt('[Leave]', '__exit__', '#0ff'),
			]
		),
		quadruple_price: node('quadruple_price',
			'*She pulls out a tiny chalkboard from somewhere.* Quadruple: for customers who question the surcharge system. There\'s also a quintuple tier for customers who question the quadruple tier. And a sextuple for those who question THAT. It goes up to duodecuple. I had a Minotaur once who argued all the way to duodecuple. He ended up owing me his entire life savings, his cave, and naming rights to his firstborn. Minotaur Junior Morrigan. Lovely child. Has my business sense.',
			[
				opt('I think I\'ll just apologize now.', 'return', '#4f4', { onSelect: { mood: 'amused', message: 'Morrigan appreciates that you know when to stop.' } }),
			]
		),
		return_afraid: node('return_afraid',
			'*She\'s already backing away, hands raised.* YOU! The scary one! Listen, I\'ve reorganized my entire inventory since last time! Everything is CLEARLY LABELED! Nothing cursed! Probably! And I\'ve prepared a COMPLIMENTARY welcome package because I value our business relationship and also because you terrify me on a molecular level!',
			[
				opt('What\'s in the welcome package?', 'afraid_package', '#4f4'),
				opt('Morrigan, relax. I\'m not going to hurt you.', 'return', '#4f4', { onSelect: { mood: 'neutral', message: 'Morrigan\'s hands stop shaking. Mostly.' } }),
				opt('[Leave]', '__exit__', '#0ff'),
			]
		),
		afraid_package: node('afraid_package',
			'*She nervously produces a small bundle.* The Morrigan\'s "Please Don\'t Hurt Me" Starter Pack! One healing potion \u2014 genuine, not expired, I CHECKED. One lucky charm \u2014 may or may not work, but the placebo effect is scientifically valid! And one coupon for a future purchase \u2014 ten percent off, non-transferable, expires never because I want you to keep coming back ALIVE and HAPPY and NOT ANGRY AT ME.',
			[
				opt('Take the starter pack. [+5 HP]', 'return', '#4f4', { onSelect: { hp: 5, message: 'Morrigan\'s terrified generosity heals you! +5 HP', mood: 'neutral' } }),
			]
		),
		return_amused: node('return_amused',
			'*She claps her hands together with delight.* My FAVORITE customer! Come, come! I\'ve got new stock AND new jokes! Did you hear the one about the Skeleton who walked into a bar? He ordered a beer and a mop! *She cackles.* I\'ve been saving that one. The last person I told it to was a skeleton. He did NOT appreciate the humor. Very thin-skinned. Well. No-skinned. You know what I mean.',
			[
				opt('That\'s terrible. I love it.', 'amused_deals', '#4f4'),
				opt('What\'s the new stock?', 'wares', '#ff4'),
				opt('Any news?', 'return', '#ff4'),
			]
		),
		amused_deals: node('amused_deals',
			'*She beams.* A customer who appreciates bad puns! You\'re rarer than a honest Mimic! Here \u2014 since you make me laugh and laughter is the best medicine, have some ACTUAL medicine. *She hands you a small vial.* Morrigan\'s Mirth Mixture. Brewed with real joy. And some herbs. Mostly herbs. The joy is a marketing addition. But the herbs are VERY good herbs.',
			[
				opt('Take the Mirth Mixture. [+4 HP]', 'return', '#4f4', { onSelect: { hp: 4, message: 'Morrigan\'s Mirth Mixture tickles as it heals! +4 HP' } }),
			]
		),
		return_sad: node('return_sad',
			'*She\'s sitting quietly, pouches unopened, staring at a small locket.* Oh. Hello. *She tucks the locket away quickly.* Sorry. I was just... it\'s nothing. Business is fine. Everything\'s fine. I\'m fine. *She\'s clearly not fine.* Did you want to buy something?',
			[
				opt('What\'s in the locket, Morrigan?', 'locket', '#8cf'),
				opt('You don\'t seem fine.', 'not_fine', '#4f4'),
				opt('Just browsing.', 'return', '#ff4'),
			]
		),
		locket: node('locket',
			'*She hesitates, then opens it. Inside is a tiny portrait of an older woman with the same sharp eyes.* My mother. She was a merchant too. Taught me everything. "Buy low, sell high, and never let them see you cry, Morrie." She ran a shop in the capital. Real shop. With walls and a door and everything. I was supposed to take it over. Instead I\'m here, selling health potions to monsters in a hole in the ground. *She sniffs.* She\'d be furious. Or proud. With her it was always hard to tell.',
			[
				opt('She\'d be proud, Morrigan. You survived where others didn\'t.', 'return', '#4f4', { onSelect: { mood: 'friendly', message: 'Morrigan blinks rapidly and changes the subject, but she\'s smiling.' } }),
				opt('Why not go back to the capital?', 'why_stay', '#8cf'),
			]
		),
		not_fine: node('not_fine',
			'*She sighs.* No. I\'m not. Sometimes the dungeon gets to you, you know? The darkness. The constant danger. The fact that my best customers are literally trying to kill each other. I chose this life because I thought it would be an ADVENTURE. Turns out adventure is just regular life but colder and with more teeth.',
			[
				opt('You\'re braver than you think, Morrigan.', 'return', '#4f4', { onSelect: { mood: 'friendly', message: 'Something in Morrigan\'s expression lifts.' } }),
			]
		),
		why_stay: node('why_stay',
			'*She laughs \u2014 a small, watery sound.* Because the capital shop was boring, darling. I sold candles and soap. SOAP. For fifteen years. Do you know what it\'s like to explain the difference between lavender and chamomile soap eight times a day? At least HERE nobody asks about soap. They ask about survival. About hope in dark places. About whether this potion is expired. Much more interesting. Much more meaningful. *She clutches the locket.* Mum would understand. She always said I had too much fire in me for soap.',
			[
				opt('Too much fire for soap. Best description ever.', 'return', '#4f4', { onSelect: { mood: 'amused', message: 'Morrigan laughs \u2014 a real, warm laugh.' } }),
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
				opt('I know these tunnels well. Follow my lead and I\'ll get us both to the stairs.', 'social_persuade_corwin', '#4cf', { socialCheck: { skill: 'persuade', difficulty: 9, successNode: 'persuade_corwin_ok', failNode: 'persuade_corwin_fail' }, once: true }),
				opt('I\'m actually a dungeon inspector. This level failed code. We need to evacuate immediately.', 'social_deceive_corwin', '#c4f', { socialCheck: { skill: 'deceive', difficulty: 11, successNode: 'deceive_corwin_ok', failNode: 'deceive_corwin_fail' }, once: true }),
				opt('Sorry, can\'t help. Good luck.', 'farewell_cold', '#f44', { onSelect: { mood: 'sad' } }),
			]
		),
		return: node('return',
			'*They look up hopefully.* Oh, it\'s you again. I\'m still lost. I tried going north. Found a wall. Tried going south. Found a different wall. I\'m starting to think the walls are following me.',
			[
				opt('The walls might actually be moving.', 'walls_move', '#f44'),
				opt('Tell me more about yourself.', 'backstory', '#8cf'),
				opt('Tell me about something weird you saw.', 'corwin_stories', '#c8f'),
				opt('[Rogue] As a rogue, I notice things. Let me help you.', 'rogue_help', '#4f8', { showIf: { type: 'class', value: 'rogue' } }),
				opt('[Warrior] I\'ll clear a path for you. Stay behind me.', 'warrior_protect', '#f84', { showIf: { type: 'class', value: 'warrior' } }),
				opt('Any dangers I should know about?', 'dangers', '#ff4'),
				opt('I\'ve killed dozens of monsters. You\'re safe with me.', 'corwin_bodycount', '#f84', { showIf: { type: 'minEnemiesKilled', value: 25 } }),
				opt('I\'ve found secret passages in these walls.', 'corwin_secrets', '#c8f', { showIf: { type: 'minSecretsFound', value: 2 } }),
				opt('Good luck out there.', 'farewell', '#0ff'),
			]
		),
		corwin_bodycount: node('corwin_bodycount',
			'*Their eyes go wide.* Dozens? DOZENS?! I\'ve killed exactly ONE monster since I got here. A rat. And I\'m not entirely sure I killed it \u2014 it might have died of pity. My sword got stuck in a wall on the first swing, I tripped over my own shield on the second, and the rat just... sat there. Watching. Judging. Eventually it sighed and fell over. I\'m choosing to count it. *They gesture at a single tally mark scratched into their breastplate.* My kill count. Singular. You\'re basically a god of war standing next to a man who was defeated by gravity and a disinterested rodent.',
			[
				opt('The rat SIGHED at you?', 'corwin_rat', '#ff4'),
				opt('Everyone starts somewhere.', 'return', '#4f4', { onSelect: { mood: 'friendly' } }),
			]
		),
		corwin_rat: node('corwin_rat',
			'It SIGHED. Audibly. With its little rat lungs. It looked at my sword stuck in the wall, it looked at me lying on the ground, it looked at my shield spinning in a circle like a very sad top, and it let out this tiny... *He makes a small exasperated sound.* ...hhhhhh. And then it just keeled over. I think it died of EMBARRASSMENT. On my behalf. *He looks at the floor.* Sometimes I hear it in my dreams. That little sigh. The universe\'s smallest expression of disappointment. I have been roasted by a rat.',
			[
				opt('That is the saddest combat story I\'ve ever heard. [+2 HP]', 'return', '#4f4', { onSelect: { hp: 2, mood: 'amused', message: 'Corwin\'s terrible rat story somehow makes you feel better about your own fights. +2 HP' } }),
			]
		),
		corwin_secrets: node('corwin_secrets',
			'*They pull out a crumpled, coffee-stained journal.* SECRET passages?! This changes EVERYTHING! I\'ve been mapping the visible dungeon for weeks and the math NEVER worked! Corridors that should connect but don\'t! Rooms that are bigger on the inside! A hallway that\'s eleven feet long going north but only nine feet long going south! *They\'re scribbling furiously.* It\'s the secret passages! They\'re the hidden variables in my equations! The dungeon isn\'t nonsensical \u2014 it has a HIDDEN GEOMETRY!',
			[
				opt('You sound way too excited about secret doors.', 'corwin_geometry', '#ff4'),
				opt('Can I see your map?', 'corwin_map', '#8cf'),
			]
		),
		corwin_geometry: node('corwin_geometry',
			'*They wave the journal, ink splattering everywhere.* You don\'t UNDERSTAND! I\'ve been trying to map this dungeon as a three-dimensional structure and it DOESN\'T WORK! It\'s like trying to draw a tesseract on a napkin! But if there are hidden connections \u2014 if the dungeon is a higher-dimensional space folded into three dimensions \u2014 then the secret passages aren\'t just shortcuts, they\'re DIMENSIONAL SEAMS! Places where the folded space peeks through! *They stop, eyes wide.* This means the dungeon is a four-dimensional object. We\'re walking on the surface of a hypercube. Navigating a three-dimensional shadow of a four-dimensional structure. *Long pause.* No wonder I\'m lost. Nobody taught me four-dimensional cartography. It wasn\'t in the curriculum.',
			[
				opt('I understood about 10% of that but it sounded important.', 'return', '#4f4', { onSelect: { rumor: rumor('hypercube_dungeon', 'The dungeon may be a 4D structure folded into 3D space. Secret passages are dimensional seams where the fold shows.', 'Corwin', 'exaggerated'), mood: 'friendly', message: 'Corwin\'s cartographic breakthrough changes how you see the dungeon.' } }),
			]
		),
		corwin_map: node('corwin_map',
			'*They hold up a map that looks like it was drawn during an earthquake by someone who was also in an earthquake inside a DIFFERENT earthquake.* It\'s a work in progress. The solid lines are confirmed corridors. The dotted lines are probable corridors. The wavy lines are "I THINK this was a corridor but it might have been a fever dream." The skull symbols mark places where I almost died. As you can see, there are... a lot of skull symbols. This entire section is just skulls. I call it the "Neighborhood of Constant Peril." *He turns the map.* Actually, I might be holding it upside down. Hard to tell.',
			[
				opt('This makes the Barkeep\'s map look professional.', 'return', '#4f4', { onSelect: { mood: 'amused' } }),
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
		rogue_help: node('rogue_help',
			'*Their eyes widen.* A rogue? Oh thank the gods. Your kind can SENSE things. Traps, secret passages, the subtle wrongness that means a wall is about to eat you. *They grab your sleeve.* Can you feel that? That slight... vibration? I\'ve been feeling it for hours and I don\'t know if it\'s a trap or my own anxiety. It\'s VERY hard to tell the difference in a dungeon. My anxiety also vibrates.',
			[
				opt('That vibration is just the dungeon breathing. You\'re fine.', 'rogue_reassure', '#4f4'),
				opt('Actually, that IS a trap. Step left. Now.', 'rogue_trap_save', '#f44'),
			]
		),
		rogue_reassure: node('rogue_reassure',
			'*They exhale.* The dungeon BREATHES? You rogues just say things like that casually? "The dungeon breathes." As if that\'s NORMAL. *They run a hand through their hair.* My academy training did not cover this. We learned about contour lines and elevation markers. Nobody mentioned that the FLOOR has LUNGS.',
			[
				opt('You get used to it.', 'farewell', '#4f4'),
			]
		),
		rogue_trap_save: node('rogue_trap_save',
			'*They leap sideways. A blade swings through the space they just occupied.* WHAT. WHAT WAS THAT. *They\'re pressed against the wall, hyperventilating.* How did you KNOW? I\'ve been standing there for TEN MINUTES! You just walk up and casually say "that\'s a trap" like it\'s OBVIOUS? *They stare at you with a mixture of terror and awe.* I am adding you to my will. You now inherit my useless maps.',
			[
				opt('Keep the maps. Stay alive.', 'farewell', '#4f4'),
			]
		),
		warrior_protect: node('warrior_protect',
			'*Their shoulders sag with relief.* A warrior. A REAL warrior. With a REAL sword. Not a cartography compass held menacingly, which has been my primary defense strategy. *They fall in behind you.* I don\'t suppose you do escort services? Not like \u2014 I mean combat escort. Bodyguard. Guard-of-the-body. Because my body is in desperate need of guarding. Multiple things on this level have expressed interest in eating it.',
			[
				opt('Stick close and don\'t touch anything shiny.', 'warrior_advice', '#4f4'),
			]
		),
		warrior_advice: node('warrior_advice',
			'Don\'t touch anything shiny. Right. *They put their hands in their pockets.* ...I touched something shiny earlier. It was a gold coin on the floor. It was not a gold coin. It was a TOOTH. It was a tooth belonging to something that was very interested in getting it back. I ran for six rooms. SIX. The thing pursued me for FIVE. It gave up on the sixth because it found someone else\'s tooth on the floor and got distracted. The dungeon economy is based on lost teeth. I have added this to my notes.',
			[
				opt('Never change, Corwin.', 'farewell', '#4f4'),
			]
		),
		corwin_stories: node('corwin_stories',
			'*They shudder.* Weird things? Oh, I\'ve seen PLENTY of weird things. This dungeon is basically a factory for weird things. What do you want to hear about?',
			[
				opt('Tell me about walking in circles.', 'story_circle', '#c8f', { once: true }),
				opt('Tell me about the map that mapped back.', 'story_map', '#c8f', { once: true }),
				opt('No more stories, thanks.', 'return', '#0ff'),
			]
		),
		story_circle: node('story_circle',
			'*They hold up a hand.* So I\'m on level six, right? Walking. Making notes. Standard cartography. And I realize I\'ve passed the same rock three times. Same scratch marks. Same cobwebs. I start counting steps. 847 per loop. Exactly. Every time. So I make a tally mark on the wall. Walk the loop again. Tally mark. Again. Tally mark. After three hours, I stop. And I notice... *They swallow hard.* ...there are OTHER tally marks. Next to mine. Smaller. Neater. In a different color. Someone \u2014 or something \u2014 was walking the circle WITH me. Keeping count. I never saw them. I never heard them. But they were there. Walking right beside me. For three hours. *They wrap their arms around themselves.* The marks were still there the last time I checked.',
			[
				opt('That\'s deeply unsettling. [Story collected]', 'corwin_stories', '#4f4', { onSelect: { story: STORIES.corwin_circle } }),
			]
		),
		story_map: node('story_map',
			'*They pull out a blank parchment with a traumatized expression.* Level four. My map started UPDATING ITSELF. Lines appeared that I hadn\'t drawn. Accurate lines. Rooms I hadn\'t visited. At first I was thrilled! Free cartography! Then the map drew a room. With a stick figure inside it. The stick figure was holding a map. The map in the drawing had a SMALLER stick figure. Holding a SMALLER map. It was maps all the way down. *They shudder.* I burned the map. The ashes reformed into a smaller, smugger-looking map. I burned THAT. It reformed again. Smaller. SMUGGER. I eventually sealed it in a jar and threw it into a pit. I can still hear it... rustling.',
			[
				opt('A sentient, smug map. [Story collected]', 'corwin_stories', '#4f4', { onSelect: { story: STORIES.corwin_map } }),
			]
		),
		persuade_corwin_ok: node('persuade_corwin_ok',
			'*Their face floods with relief so intense it\'s almost physical.* You KNOW these tunnels? Oh thank every god and several minor deities. *They grab your sleeve.* I have been going in circles for SO LONG. The walls here all look the same. Stone. More stone. Slightly different stone. I have a degree in cartography and I can\'t tell the difference. *They pull out a crumpled notebook.* Here \u2014 take these. My notes on every level I\'ve mapped. The maps are useless because the dungeon cheats, but the NOTES are good. Monster patrol patterns, safe rest spots, which walls sound hollow when you knock. Three weeks of paranoid observation, all yours.',
			[
				opt('Take Corwin\'s field notes. [+3 ATK from tactical knowledge]', 'return', '#4f4', { onSelect: { atk: 3, message: 'Corwin\'s field notes reveal monster patrol patterns! +3 ATK', mood: 'friendly' } }),
			]
		),
		persuade_corwin_fail: node('persuade_corwin_fail',
			'*They squint at you suspiciously.* You "know these tunnels well"? Really? Because I\'ve been mapping dungeons for the Cartographers\' Guild for seven years, and the NUMBER ONE thing I\'ve learned is that NOBODY knows these tunnels well. The tunnels don\'t even know themselves well. I once watched a corridor have an existential crisis and turn into a different corridor. *They fold their arms.* Nice try, but I\'d rather be lost honestly than found dishonestly. That\'s... actually the Cartographers\' Guild motto. We\'re a very on-brand organization.',
			[
				opt('Fair point. The tunnels ARE unpredictable.', 'return', '#4f4'),
				opt('What\'s a corridor existential crisis look like?', 'corridor_crisis', '#ff4'),
			]
		),
		corridor_crisis: node('corridor_crisis',
			'*They gesture wildly.* You know how walls are supposed to be WALLS? Stationary? Load-bearing? Having a fixed position in three-dimensional space? Well, this corridor apparently disagreed with the concept. It started vibrating. Then it sort of... shimmered. Then every stone in the wall rearranged itself into what I can only describe as a worried expression. A WALL. Looking WORRIED. Then it reformed into a completely different corridor going a completely different direction, and I swear \u2014 I SWEAR \u2014 it looked relieved afterwards. Like it had been holding in a sneeze for centuries and finally let it out.',
			[
				opt('The architecture has emotions. Wonderful.', 'return', '#4f4', { onSelect: { mood: 'amused' } }),
			]
		),
		deceive_corwin_ok: node('deceive_corwin_ok',
			'*Their eyes go wide.* A dungeon INSPECTOR?! Failed CODE?! *They look around in a panic.* I KNEW IT. I KNEW something was structurally unsound! Did you see the support beams on level three? NONEXISTENT. And the ventilation! Don\'t get me started on the ventilation! I filed a complaint with the Cartographers\' Guild six months ago. "Dear Guild: the dungeon appears to be in violation of thirty-seven building codes and also contains monsters. Please advise." They sent back a form letter. *They start packing.* Where\'s the emergency exit? Is there an emergency exit? Are WE the emergency?',
			[
				opt('Stay calm. Take this passage north. [Gain a rumor]', 'return', '#4f4', { onSelect: { rumor: RUMORS.merchant_everywhere, message: 'Corwin, panicking about building codes, shares everything they know about the dungeon layout!', mood: 'afraid' } }),
			]
		),
		deceive_corwin_fail: node('deceive_corwin_fail',
			'*They pause mid-panic.* Wait. Wait wait wait. A dungeon inspector? *They slowly look you up and down.* Where\'s your clipboard? Inspectors ALWAYS have clipboards. And the little hat. The inspector hat. With the badge. And where are your forms? You need Form 7-B for structural assessment, Form 12-C for monster density evaluation, and Form 42-Q for "ambient dread levels." I dated an inspector once. VERY boring dinners. But I learned the bureaucracy. *They narrow their eyes.* You, my friend, are no inspector. Garvus tried the same trick with a Dragon Turtle and at least HE had a forged badge.',
			[
				opt('...Garvus told me about that, actually.', 'return', '#ff4', { onSelect: { mood: 'amused' } }),
				opt('You caught me. I just wanted to help.', 'return', '#4f4'),
			]
		),
		// ─── MOOD-SPECIFIC RETURN NODES ───
		return_afraid: node('return_afraid',
			'*They\'re pressed against the wall, hyperventilating.* The walls moved. THE WALLS MOVED. I was just standing here, minding my own business, being lost \u2014 as one does \u2014 and the wall behind me SHIFTED. Not collapsed. Shifted. Like it was adjusting its position. Like it was getting COMFORTABLE. Walls should NOT get comfortable. That implies they were previously UNCOMFORTABLE and had OPINIONS about it.',
			[
				opt('Deep breaths, Corwin. Tell me what you saw.', 'afraid_walls', '#4f4'),
				opt('The dungeon does that sometimes. It\'s normal.', 'return', '#ff4', { onSelect: { mood: 'neutral', message: 'Corwin looks skeptical but slightly calmer.' } }),
				opt('[Leave]', '__exit__', '#0ff'),
			]
		),
		afraid_walls: node('afraid_walls',
			'*They take several shaky breaths.* I was mapping. Like always. And the corridor I\'d mapped yesterday was GONE. Not collapsed \u2014 GONE. Like it was never there. But my map still showed it. My map \u2014 the one I drew with my OWN HANDS \u2014 showed a corridor that reality had disagreed with. Either my map is lying or reality is lying and I don\'t know which is worse. If reality lies, what does cartography even MEAN? *They clutch their maps.* What am I even DOING down here?',
			[
				opt('You\'re surviving. That\'s what matters.', 'return', '#4f4', { onSelect: { mood: 'neutral', message: 'Corwin nods slowly, finding their footing.' } }),
				opt('Maybe the dungeon IS your map. And your map IS reality.', 'philosophical_maps', '#8cf'),
			]
		),
		philosophical_maps: node('philosophical_maps',
			'*They stare at you.* That\'s... that\'s either the most profound thing anyone has ever said to me or the most terrifying. *They look at their maps.* If the map IS reality... then by drawing it, I\'m creating reality. Every line I draw becomes real. Every room I map into existence EXISTS because I mapped it. *Their eyes widen.* Oh gods. That means every wrong turn I\'ve drawn might have MADE a wrong turn. I\'VE been making the dungeon worse this entire time. I\'m the REASON I\'m lost. The cartographer who drew himself into a maze of his own making. *Long pause.* I need a drink. Is Garvus still conscious?',
			[
				opt('Garvus is always conscious. Barely.', 'return', '#4f4', { onSelect: { mood: 'amused' } }),
			]
		),
		return_sad: node('return_sad',
			'*They\'re sitting on the ground, maps spread around them.* I miss Talia. And Kael. And the others. It\'s been... how long has it been? I stopped counting days when the dungeon ate my calendar. Literally ate it. A wall opened, a stone tongue came out, and slurped up my journal. The dungeon ate my SCHEDULE. That\'s not even threatening, that\'s just RUDE.',
			[
				opt('Tell me about your team.', 'sad_team', '#8cf'),
				opt('We\'ll find them, Corwin.', 'return', '#4f4', { onSelect: { mood: 'neutral', message: 'A flicker of hope crosses Corwin\'s face.' } }),
				opt('[Leave]', '__exit__', '#0ff'),
			]
		),
		sad_team: node('sad_team',
			'*Their face softens.* Talia was \u2014 IS \u2014 the best healer in the Grey Reaches. She once healed a man mid-fall. He was falling off a cliff and she cast a heal so powerful it gave him the strength to grab a branch on the way down. She also packed the best trail rations. Little sandwiches with the crusts cut off. In a DUNGEON. *Sniff.* Kael was our tank. Seven feet tall. Afraid of spiders. A seven-foot wall of muscle who once screamed at a spider the size of a coin. We never let him forget it. *A wobbly smile.* I hope they\'re okay. I have to believe they\'re okay.',
			[
				opt('They sound wonderful. You\'ll see them again.', 'return', '#4f4', { onSelect: { mood: 'friendly', message: 'Corwin wipes their eyes and stands a bit straighter.' } }),
			]
		),
		return_friendly: node('return_friendly',
			'*They light up when they see you.* Hey! My favorite not-lost person! *They\'ve clearly tidied their corner of the dungeon \u2014 maps are organized, there\'s a small drawn arrow on the floor pointing toward the stairs.* I\'ve been working on something! A comprehensive guide to being lost! "Corwin\'s Compendium of Confusion: A Cartographer\'s Guide to Not Knowing Where You Are." Chapter one: "You Are Here (Probably)." I think it could really help people.',
			[
				opt('I\'d read that book.', 'corwin_book', '#4f4'),
				opt('Any new discoveries?', 'return', '#ff4'),
				opt('[Leave]', '__exit__', '#0ff'),
			]
		),
		corwin_book: node('corwin_book',
			'*They pull out a crumpled manuscript.* Chapter two: "Don\'t Panic. This Is Not Helpful Advice But Everyone Says It So Here It Is." Chapter three: "Moss Grows On The North Side Of Trees. You Are Not Near Trees. This Information Is Useless." Chapter four: "If All Else Fails, Walk Downhill. All Dungeons Are Downhill. This Is Also Useless." *They beam.* I think the marketable quality is my honest admission that nothing I suggest will actually help. Very refreshing in the self-help industry.',
			[
				opt('Publish it. The world needs this.', 'return', '#4f4', { onSelect: { mood: 'amused' } }),
			]
		),
		return_amused: node('return_amused',
			'*They\'re chuckling to themselves when you arrive.* Oh! Perfect timing! I just discovered something AMAZING. *They hold up a map.* I\'ve been lost for so long that my maps have become a perfect record of everywhere the dungeon ISN\'T. By process of elimination, I now know more about this dungeon\'s layout than anyone alive! The trick is to be wrong about everything and then invert it!',
			[
				opt('That\'s... actually genius?', 'inverted_maps', '#ff4'),
				opt('What else have you figured out?', 'return', '#ff4'),
			]
		),
		inverted_maps: node('inverted_maps',
			'*They nod enthusiastically.* The Corwin Inversion Method! Step one: draw a map. Step two: accept that the map is wrong. Step three: assume the OPPOSITE of everything on the map. Dead end? Probably a corridor! Safe room? DANGER! Monster den? Almost certainly a nice sitting area. I tested it once and found a secret room. The room contained another, smaller secret room. Which contained a very confused rat who had ALSO gotten lost. We bonded. I named him Cartographer Junior. He has better instincts than me.',
			[
				opt('You and the rat should start a guild.', 'return', '#4f4', { onSelect: { mood: 'amused' } }),
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
				opt('[Ask about the Architects\' argument]', 'shade_story_argument', '#c8f'),
				opt('[Leave quietly]', 'farewell', '#0ff'),
			],
			'Deepscript'
		),
		shade_story_argument: node('shade_story_argument',
			'*The Shade\'s form pulses with what might be amusement \u2014 or indigestion, if ethereal beings experienced such things.* The Architects argued. About everything. They could not agree on the length of corridors. One faction insisted all corridors should be prime numbers of paces. Another faction demanded they follow the golden ratio. A third faction \u2014 the one I originated from \u2014 argued that corridors should be whatever length felt aesthetically right. We were considered the radicals. *The Shade\'s edges ripple.* The boss rooms are where they reached dramatic conclusions. Each boss is a physical manifestation of a philosophical point scored. The dead ends are arguments that went nowhere. The loops are circular reasoning. And the thing at the bottom? That is what they were arguing ABOUT. They could never agree on what to do with it. So they argued. And built. And argued. And built. For aeons. Until the argument became the dungeon, and the dungeon became the argument, and nobody could remember which came first.',
			[
				opt('[A dungeon built from an argument. Incredible. Story collected]', 'garbled_greeting', '#4f4', { onSelect: { story: STORIES.shade_architects, message: 'The Shade shares the Architects\' eternal argument \u2014 the true blueprint of the dungeon.' } }),
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
		return_afraid: node('return_afraid',
			'*The Shade is flickering rapidly, its form unstable.* Something below has awakened. The argument... the great debate... a new voice has entered it. A voice that speaks in silence and screams in architecture. The walls are DISAGREEING with each other. Can you not feel it? The floor is uncertain. The ceiling is anxious.',
			[
				opt('[Try to calm the Shade]', 'return', '#4f4', { onSelect: { mood: 'neutral', message: 'The Shade stabilizes, but barely.' } }),
				opt('[Ask what awakened]', 'return', '#f44', { onSelect: { mood: 'afraid', message: '"Something that was sleeping in the argument\'s margin notes. Something annotated."' } }),
				opt('[Back away slowly]', '__exit__', '#0ff', { onSelect: { npcAction: 'flee', message: 'The Shade dissolves into the walls, leaving only a faint chill.' } }),
			],
			'Deepscript'
		),
		return_hostile: node('return_hostile',
			'*The Shade\'s form solidifies into something sharp and angular. Its voice resonates with cold fury.* You desecrate what you do not understand. The Architects spoke in MEANING and you trample through their sentences like a drunk through a library. Every step you take corrupts a thousand years of careful argument.',
			[
				opt('[Apologize in Deepscript]', 'return', '#4f4', { showIf: { type: 'knowsLanguage', value: 'Deepscript' }, onSelect: { mood: 'neutral', message: 'The Shade pauses, surprised. "You speak... imperfectly. But you speak. This is... unexpected."' } }),
				opt('[Stand your ground]', 'return', '#f44', { onSelect: { mood: 'hostile', message: 'The temperature drops several degrees. The Shade\'s eyes burn brighter.' } }),
				opt('[Offer respect]', 'return', '#4f4', { onSelect: { mood: 'sad', message: 'The anger drains from the Shade like water through stone. What remains is just... old grief.' } }),
			],
			'Deepscript'
		),
		return_sad: node('return_sad',
			'*The Shade hangs in the air like a tear that refused to fall.* I remember when these halls were new. When the mortar was still wet and the Architects walked among us, debating the proper angle of every corner. They cared about EVERY angle. Forty-seven degrees was a scandal. Ninety degrees was revolutionary. And now... the corridors crumble. The arguments fade. I am the last one who remembers what they were fighting about. And I am forgetting.',
			[
				opt('[Listen in silence]', 'return', '#4f4', { onSelect: { mood: 'neutral', message: 'Sometimes the greatest comfort is simply being heard.' } }),
				opt('What were they fighting about?', 'return', '#8cf', { onSelect: { mood: 'sad', message: '"Whether existence should be permanent or temporary. They never reached consensus. The dungeon is their indecision made manifest."' } }),
				opt('You\'re not forgotten. I\'m here.', 'return', '#4f4', { onSelect: { mood: 'friendly', message: 'The Shade glows slightly brighter. "You are... kind. For a warm-blooded thing."' } }),
			],
			'Deepscript'
		),
		return_amused: node('return_amused',
			'*The Shade is doing something impossible: it appears to be chuckling. The sound is like wind through a pipe organ.* I have just observed a goblin attempt to sell a health potion to a skeleton. The skeleton has no stomach. The goblin insisted this was "not a dealbreaker." The negotiation lasted forty-five minutes. The skeleton bought two.',
			[
				opt('Grikkle strikes again.', 'return', '#4f4', { onSelect: { mood: 'amused' } }),
				opt('Do ancient ethereal beings normally people-watch?', 'return', '#8cf', { onSelect: { mood: 'amused', message: '"After three millennia, entertainment options narrow significantly."' } }),
				opt('The skeleton economy is fascinating.', 'return', '#ff4', { onSelect: { mood: 'amused' } }),
			],
			'Deepscript'
		),
	}
};

// ─── DUNGEON: GOBLIN PEDDLER ───

export const GOBLIN_PEDDLER_DIALOGUE: DialogueTree = {
	startNode: 'start',
	returnNode: 'return',
	nodes: {
		start: node('start',
			'*A small goblin sits behind an upturned crate covered in... stuff. Teeth. Rocks. Something that might once have been a sandwich. It wears a tiny top hat and a monocle made from a bottle bottom.* Psst! Hey! You! Big-person! Grikkle has GOODS. Best goods! Premium quality! Fell off back of cart! Very legitimate! No questions! You buy?',
			[
				opt('What are you selling?', 'grikkle_wares', '#ff4'),
				opt('You\'re a goblin. In a dungeon. Selling things.', 'grikkle_business', '#8cf'),
				opt('I\'m not buying anything from a goblin.', 'grikkle_offended', '#f44'),
				opt('[Leave]', '__exit__', '#0ff'),
			]
		),
		return: node('return',
			'*Grikkle adjusts his tiny top hat.* Big-person back! Grikkle knew you come back! Nobody can resist Grikkle\'s Premium Inventory Experience! Grikkle has NEW goods! Found them! On floor! Very recently! Not still warm! That is marketing term!',
			[
				opt('Show me what you\'ve got.', 'grikkle_wares', '#ff4'),
				opt('Do you know anything useful about this level?', 'grikkle_info', '#8cf'),
				opt('Tell me a story, Grikkle.', 'grikkle_stories', '#c8f'),
				opt('Tell me about yourself, Grikkle.', 'grikkle_backstory', '#c8f'),
				opt('I could just... take your stuff.', 'grikkle_threaten', '#f84', { socialCheck: { skill: 'intimidate', difficulty: 6, successNode: 'grikkle_intimidated', failNode: 'grikkle_unimpressed' } }),
				opt('[Orcish] Grikkle, I speak your tongue.', 'grikkle_orcish_return', '#a8f', { showIf: { type: 'knowsLanguage', value: 'Orcish' } }),
				opt('Can you teach me Orcish?', 'grikkle_teach_orcish', '#ff4'),
				opt('Goodbye, Grikkle.', 'farewell', '#0ff'),
			]
		),
		grikkle_teach_orcish: node('grikkle_teach_orcish',
			'*He blinks.* You want Grikkle to teach Orcish? TEACH? Like... SCHOOL? *He puffs up with pride.* Grikkle is PROFESSOR now! Professor Grikkle! Grikkle always knew was destined for academia! Okay! Lesson one: "WAAAGH" means hello, goodbye, I love you, I am going to eat you, and also "where is bathroom." Context is VERY important! Lesson two: *He clears his throat and makes a sound like a garbage disposal eating a trumpet.*',
			[
				opt('[Study the basics of Orcish with Grikkle]', 'grikkle_orcish_learned', '#4f4', { onSelect: { learnLanguage: 'Orcish', message: 'Grikkle teaches you Orcish! Your pronunciation is terrible but functional!' } }),
				opt('On second thought, I\'m good.', 'return', '#0ff'),
			]
		),
		grikkle_orcish_learned: node('grikkle_orcish_learned',
			'*After twenty minutes of throat-shredding guttural sounds, Grikkle declares you "acceptable."* There! You speak Orcish now! Well, you speak Orcish like baby goblin with head cold, but is GOOD ENOUGH! Now you can read goblin signs in dungeon! And talk to Grikkle in mother tongue! Which Grikkle actually prefers because Common gives Grikkle a headache! Too many... SYLLABLES!',
			[
				opt('Thank you, Professor Grikkle.', 'return', '#4f4', { onSelect: { mood: 'amused', message: '"PROFESSOR! Yes! Grikkle is adding that to business card!"' } }),
			]
		),
		grikkle_orcish_return: node('grikkle_orcish_return',
			'*His eyes go wide.* You... you speak the Old Tongue? *His entire demeanor shifts. The salesman act drops. For a moment, he looks ancient and weary.* Nobody speaks Orcish up here anymore. Not since the Sundering, when the great goblin clans were scattered. *He removes his top hat.* If you speak the tongue... then I can tell you true things. Not the sales pitch. The REAL things.',
			[
				opt('What real things, Grikkle?', 'grikkle_truth', '#ff4'),
				opt('Tell me about the Sundering.', 'grikkle_sundering', '#8cf'),
				opt('Go back to the sales pitch. I liked it better.', 'return', '#4f4', { onSelect: { mood: 'amused' } }),
			],
			'Orcish'
		),
		grikkle_truth: node('grikkle_truth',
			'*He speaks quietly, in perfect Orcish, without a single stammer.* I am not a merchant. I am a Keeper — the last of the Goblin Lorekeepers. My clan, the Deeprock Grikkari, were chroniclers. We recorded everything the dungeon did. Every shift, every growth, every nightmare. The top hat? A Keeper\'s crown, worn by every Chronicler since the First Descent. The monocle is a genuine reading lens, enchanted to see Deepscript inscriptions invisible to the naked eye. *He puts the hat back on.* But nobody buys history. So I sell rocks. And I wait. For someone who speaks the tongue.',
			[
				opt('You\'ve been waiting for someone like me?', 'grikkle_waiting', '#ff4'),
				opt('The Deeprock Grikkari... a goblin lorekeeper clan?', 'grikkle_clan', '#8cf'),
			],
			'Orcish'
		),
		grikkle_waiting: node('grikkle_waiting',
			'*He nods solemnly.* The dungeon is accelerating. New levels appear faster. The Eye dreams more frequently. Something is coming to a head — an argument three millennia old is reaching its conclusion. The Architects designed a failsafe. A Severance. But the key to activating it is written in THREE languages: Deepscript for the structure, Orcish for the soul, and Elvish for the intent. You need all three. I can give you the Orcish component. *He pulls a tiny scroll from inside his hat.* The Goblin Verse of Unbinding. Memorize it. You will need it at the bottom.',
			[
				opt('Take the scroll. [Rumor learned]', 'return', '#4f4', { onSelect: { mood: 'friendly', rumor: { id: 'grikkle_severance', text: 'The Severance requires three languages: Deepscript for structure, Orcish for soul, and Elvish for intent. Grikkle carries the Goblin Verse of Unbinding.', source: 'Grikkle (as Keeper)', accuracy: 'true' }, message: 'Grikkle entrusts you with ancient goblin lore.' } }),
			],
			'Orcish'
		),
		grikkle_clan: node('grikkle_clan',
			'*His voice carries the weight of centuries.* The Deeprock Grikkari predate the dungeon itself. When the Architects began their construction — their argument — my ancestors were already here, living in the caves above. We watched them build. We learned their language. We documented everything, because that is what Keepers DO. When the dungeon swallowed our caves, we adapted. We became part of it. Some of my kin became monsters — lost to the dungeon\'s influence. Others became merchants, hiding in plain sight. And I... I became the last one who remembers why we started writing things down in the first place.',
			[
				opt('Why DID you start writing things down?', 'grikkle_why_write', '#ff4'),
				opt('Thank you for trusting me with this.', 'return', '#4f4', { onSelect: { mood: 'friendly' } }),
			],
			'Orcish'
		),
		grikkle_why_write: node('grikkle_why_write',
			'*He smiles — not the manic merchant grin, but something genuine and sad.* Because the Architects argued about whether consciousness should persist. Whether memory matters. My ancestors believed the answer was YES. So they proved it. They remembered. They wrote. They persisted. Every page a Keeper writes is a vote for permanence in a universe that keeps trying to forget. *He puts the top hat back on, adjusts the monocle, and suddenly he\'s Grikkle the Merchant again.* ANYWAY! You want buy rock? Very sharp! Premium quality!',
			[
				opt('The greatest lorekeeper in the dungeon sells rocks. Perfect.', 'return', '#4f4', { onSelect: { mood: 'amused' } }),
			],
			'Orcish'
		),
		grikkle_sundering: node('grikkle_sundering',
			'*His ears droop.* Two hundred years ago, the Eye blinked. Not a normal blink — a DEEP blink. The kind that reshuffles ten levels at once. The Deeprock warrens were torn apart. Clan members scattered across a dozen levels. Communication lines severed. Ink wells shattered. The Grand Library of Grikkari — three thousand years of records — fell into a crevasse that wasn\'t there a moment before. *He stares at his pebbles.* Everything Grikkle sells? Found in the rubble. Fragments of a civilization that existed between the cracks of another civilization\'s argument.',
			[
				opt('I\'m sorry, Grikkle.', 'return', '#4f4', { onSelect: { mood: 'sad', message: 'For once, Grikkle has nothing to sell you. Only grief.' } }),
				opt('Can the Grand Library be recovered?', 'return', '#ff4', { onSelect: { mood: 'friendly', message: '"Maybe. If someone goes deep enough. If someone CARES enough. Grikkle has hoped for two hundred years. Grikkle can hope a little longer."' } }),
			],
			'Orcish'
		),
		grikkle_wares: lie('grikkle_wares',
			'*He gestures grandly at his crate.* BEHOLD! Grikkle\'s Emporium of Wonders! Item one: this rock! Very sharp! Could be weapon! Item two: this OTHER rock! Less sharp but bigger! Item three: *He holds up a glowing mushroom.* Grikkle\'s Special Mushroom! Makes you feel STRONG! Or sick! Fifty-fifty! Very exciting! Like gambling but with your stomach! You want to haggle? Grikkle LOVES haggling!',
			[
				opt('I\'ll try the mushroom.', 'mushroom_deal', '#4f4'),
				opt('That\'s just a rock.', 'rock_haggle', '#ff4'),
				opt('Let me haggle for the mushroom.', 'haggle_mushroom_start', '#ff4'),
				opt('Do you have anything that ISN\'T a rock or fungus?', 'grikkle_premium', '#c8f'),
			]
		),
		mushroom_deal: node('mushroom_deal',
			'*He hands you the glowing mushroom with great ceremony.* Grikkle guarantees seventy percent satisfaction! Previous customer very happy! Other previous customer... less happy. But he was already being eaten by slime so maybe not mushroom\'s fault. Correlation not causation! Grikkle took statistics class! Failed! But attended! That counts!',
			[
				opt('Eat the mushroom. [50/50: +6 HP or +2 ATK]', 'mushroom_eaten', '#4f4', { onSelect: { hp: 4, message: 'The mushroom tastes like hope and regret! +4 HP' } }),
			]
		),
		mushroom_eaten: node('mushroom_eaten',
			'*He watches intently.* Well?? How is?? Are you strong? Are you sick? Are you BOTH? That happened once! Very confusing for the customer! He was punching walls while throwing up! Grikkle called it "the full experience." Charged extra.',
			[
				opt('I feel... fine, actually.', 'return', '#4f4', { onSelect: { mood: 'amused' } }),
				opt('That was disgusting, Grikkle.', 'return', '#f44', { onSelect: { mood: 'amused' } }),
			]
		),
		rock_haggle: node('rock_haggle',
			'*He clutches the rock protectively.* "Just" a rock?! THIS is not "just" a rock! This is a PREMIUM rock! You know how many rocks are in this dungeon? MILLIONS. But THIS one Grikkle personally selected! From the FLOOR! He picked it UP! With his own HANDS! Do you know how many rocks Grikkle evaluated before choosing this one? THREE! Three whole rocks! Rigorous selection process!',
			[
				opt('Fine. What do you want for the rock?', 'rock_price', '#ff4'),
				opt('Grikkle, I don\'t need a rock.', 'return', '#0ff'),
			]
		),
		rock_price: node('rock_price',
			'*He strokes the rock lovingly.* For this MASTERPIECE of geological engineering? Grikkle wants... a compliment. That\'s right! Nobody ever says nice things to Grikkle! Other goblins say "Grikkle, you smell bad." Boss Goblin says "Grikkle, stop selling rocks." But Grikkle KNOWS the rock market! One day, rocks will be CURRENCY! Grikkle is ahead of his time!',
			[
				opt('You\'re a visionary, Grikkle.', 'rock_sold', '#4f4', { onSelect: { mood: 'friendly', message: 'Grikkle beams with pride. The validation is free. The rock is not.' } }),
				opt('Your rock business is doomed, Grikkle. Sorry.', 'rock_crushed', '#f44', { onSelect: { mood: 'sad' } }),
			]
		),
		rock_sold: node('rock_sold',
			'*His eyes fill with tears.* V-visionary?! NOBODY has ever called Grikkle visionary! Boss Goblin calls Grikkle "waste of cave space!" Other goblins call Grikkle "that weird one with the rocks!" *He shoves the rock into your hands.* HERE! Take! Premium rock! FOR FREE! Because you are NICE BIG-PERSON and Grikkle will REMEMBER this day! *He pulls out another rock.* Also take THIS rock! Backup rock! For emergencies!',
			[
				opt('Thanks, Grikkle. [+2 ATK from... sharp rocks]', 'return', '#4f4', { onSelect: { atk: 2, message: 'Grikkle\'s premium rocks are surprisingly sharp! +2 ATK' } }),
			]
		),
		rock_crushed: node('rock_crushed',
			'*His bottom lip trembles.* D-doomed? The rock business is... doomed? *He looks at his crate of rocks.* But... but Grikkle BELIEVED. Grikkle had a FIVE-YEAR PLAN. Year one: rocks. Year two: FANCY rocks. Year three: rocks with HATS. Year four: publicly traded rock company. Year five: retirement to a nice cave with a view. *He sniffs.* ...Grikkle will go back to being a regular goblin now. Regular goblins just hit things. Hitting things is boring.',
			[
				opt('Wait, Grikkle. I was wrong. Rocks with hats? GENIUS.', 'rock_saved', '#4f4', { onSelect: { mood: 'friendly' } }),
				opt('I\'m sorry, Grikkle.', 'return', '#4f4'),
			]
		),
		rock_saved: node('rock_saved',
			'*He perks up instantly.* GENIUS?! Grikkle KNEW IT! *He grabs a rock and starts carving.* Grikkle is going to make the BEST rocks with hats! Tiny hats! Big hats! Hats with FEATHERS! *He\'s already fashioning a tiny paper cone hat for a pebble.* First prototype! Grikkle calls it "Señor Pebbleston." Very distinguished! Executive rock! Has corner office! *He hands you a rock with a crude hat glued on.* Here! Take! Founding investor gets first product! FOR FREE!',
			[
				opt('I will treasure Señor Pebbleston. [+1 ATK]', 'return', '#4f4', { onSelect: { atk: 1, message: 'Señor Pebbleston, executive rock, joins your inventory! +1 ATK' } }),
			]
		),
		haggle_mushroom_start: node('haggle_mushroom_start',
			'*His eyes light up.* HAGGLE! YES! Grikkle is BEST haggler! In Goblin School of Business, Grikkle got gold star in haggling! *He pauses.* Gold star was also a rock. With gold paint. BUT STILL! Grikkle\'s opening offer: you give Grikkle something SHINY. Anything shiny! Grikkle LOVES shiny! Deal?',
			[
				opt('I don\'t have anything shiny. How about information?', 'haggle_mushroom_info', '#ff4'),
				opt('How about I just compliment your hat instead?', 'haggle_mushroom_hat', '#4cf', { socialCheck: { skill: 'persuade', difficulty: 8, successNode: 'haggle_mushroom_hat_ok', failNode: 'haggle_mushroom_hat_fail' } }),
				opt('How about I tell your boss where you are?', 'haggle_mushroom_threat', '#f84', { socialCheck: { skill: 'intimidate', difficulty: 10, successNode: 'haggle_mushroom_scared', failNode: 'haggle_mushroom_brave' } }),
			]
		),
		haggle_mushroom_info: node('haggle_mushroom_info',
			'*He tilts his head.* Information? What kind? Grikkle already knows everything! Grikkle knows where rocks are! And where MORE rocks are! And... also where some rocks might be! ...Grikkle\'s knowledge is specialized. What you got?',
			[
				opt('There\'s a merchant named Morrigan nearby. Sells actual goods.', 'haggle_mushroom_morrigan', '#ff4'),
				opt('The walls on the deeper levels sing. True story.', 'haggle_mushroom_sing', '#8cf'),
			]
		),
		haggle_mushroom_morrigan: node('haggle_mushroom_morrigan',
			'*He gasps.* MORRIGAN?! The big-person merchant?! She is Grikkle\'s HERO! She sold invisible armor to Grikkle\'s entire tribe! They walk around naked thinking they look AMAZING! Grikkle was only goblin who knew the armor was fake! That\'s why Grikkle became merchant! To be like Morrigan! *He hands you TWO mushrooms.* Take! For intel on legend! Grikkle will study her techniques! From safe distance! She is very scary up close!',
			[
				opt('Take two mushrooms. [+8 HP]', 'return', '#4f4', { onSelect: { hp: 8, message: 'Grikkle\'s mushrooms surge with energy! The second one tastes like victory! +8 HP', mood: 'friendly' } }),
			]
		),
		haggle_mushroom_sing: node('haggle_mushroom_sing',
			'*His eyes go wide.* Walls SING?! WHAT THEY SING?! Is it rock music?! *He cracks up at his own joke, slapping his knee.* HA! ROCK music! Because walls are made of ROCKS! Get it?! Grikkle made a PUN! *He wipes tears of laughter.* That is best thing anyone ever tell Grikkle! Here, take mushroom! And extra mushroom! Pun tax paid in fungus!',
			[
				opt('Rock music. Classic. [+6 HP]', 'return', '#4f4', { onSelect: { hp: 6, message: 'Grikkle\'s mushrooms are surprisingly effective! +6 HP', mood: 'amused' } }),
			]
		),
		haggle_mushroom_hat_ok: node('haggle_mushroom_hat_ok',
			'*His entire face goes red with pleasure.* You... you LIKE Grikkle\'s hat?! *He touches the tiny top hat reverently.* Grikkle MADE this hat! From a rat! Not a live rat! A dead rat! ...the hat part was an accident! Rat fell on Grikkle\'s head and... stayed! Now is fashion statement! *He\'s so happy he gives you everything on the crate.* TAKE! ALL! FOR NICE BIG-PERSON WHO APPRECIATES FASHION!',
			[
				opt('Take everything. [+5 HP, +2 ATK]', 'return', '#4f4', { onSelect: { hp: 5, atk: 2, message: 'Grikkle dumps his entire inventory on you! +5 HP, +2 ATK!', mood: 'friendly' } }),
			]
		),
		haggle_mushroom_hat_fail: node('haggle_mushroom_hat_fail',
			'*He narrows his eyes.* You say you like hat, but your EYES say you think hat is stupid. Grikkle knows! Grikkle has been lied to before! Boss Goblin said Grikkle\'s cooking was "not actively poisonous" and THAT was a lie! Three goblins hospitalized! Point is: Grikkle has trust issues! Compliment needs to be SINCERE! Try harder or bring shinies!',
			[
				opt('I genuinely do like it. It\'s... unique.', 'return', '#4f4'),
				opt('Fine. One mushroom, no deal sweetener.', 'mushroom_deal', '#ff4'),
			]
		),
		haggle_mushroom_scared: node('haggle_mushroom_scared',
			'*He freezes.* B-boss Goblin?! No! Not Boss Goblin! Boss Goblin said if Grikkle caught selling rocks to big-persons AGAIN, Boss Goblin would use Grikkle AS a rock! For catapult! Grikkle does NOT want to be catapult ammunition! *He shoves everything at you.* TAKE TAKE TAKE! Free! All free! Grikkle was never here! You never saw Grikkle! Grikkle is GHOST! Very solid ghost! With merchandise!',
			[
				opt('Take the panicked offering. [+6 HP, +1 ATK]', 'return', '#4f4', { onSelect: { hp: 6, atk: 1, message: 'Grikkle\'s terror-fueled generosity! +6 HP, +1 ATK!', mood: 'afraid' } }),
			]
		),
		haggle_mushroom_brave: node('haggle_mushroom_brave',
			'*He puffs up his chest — all twelve inches of it.* HA! You think Grikkle scared of Boss Goblin? Grikkle ALREADY in trouble with Boss Goblin! Grikkle in trouble with Boss Goblin every day! Is basically employment status! "Grikkle, stop selling rocks!" "Grikkle, put down the fungus!" "Grikkle, that is not a hat, that is a dead rat!" *He straightens his hat.* Boss Goblin has no vision. No ENTREPRENEURIAL SPIRIT. You want mushroom? We trade fair. No threats. Grikkle has DIGNITY.',
			[
				opt('Fair enough. I respect the hustle.', 'mushroom_deal', '#4f4', { onSelect: { mood: 'amused' } }),
			]
		),
		grikkle_business: node('grikkle_business',
			'*He adjusts his monocle proudly.* YES! Grikkle is ENTREPRENEUR! Other goblins hit things with clubs! Boring! No growth potential! Zero scalability! But SELLING things? Unlimited upside! Grikkle read book about this! Well, Grikkle looked at book. Pictures only. But pictures very inspiring! One picture had goblin with PILE OF GOLD! That is Grikkle\'s five-year plan! Step one: sell rocks. Step two: ???. Step three: pile of gold!',
			[
				opt('I admire the ambition.', 'return', '#4f4', { onSelect: { mood: 'amused' } }),
				opt('Step two is important, Grikkle.', 'step_two', '#ff4'),
			]
		),
		step_two: node('step_two',
			'*He blinks.* Step two IS important! That is why it says "???" — because it is MYSTERIOUS! All great business plans have mysterious step two! Grikkle asked Morrigan — the big-person merchant — about step two. She said "market differentiation and customer acquisition strategy." Grikkle does not know what that means but it sounds PROFITABLE! Grikkle\'s differentiation: ONLY goblin merchant! No competition! Monopoly! Grikkle is the Jeff Bezos of goblins! Except with more teeth and less... whatever Jeff Bezos has!',
			[
				opt('You might actually be onto something.', 'return', '#4f4', { onSelect: { mood: 'friendly' } }),
			]
		),
		grikkle_offended: node('grikkle_offended',
			'*He gasps.* NOT buying from goblin?! That is SPECIESISM! Grikkle has RIGHTS! Grikkle has FEELINGS! Grikkle has... okay Grikkle also has your wallet. *He holds up a purse.* Grikkle picked your pocket while you were being prejudiced! Is educational tax! For closed-mindedness! *He grins.* Also Grikkle has very fast hands. Goblin trait. Very useful in retail AND theft! Overlapping skill sets!',
			[
				opt('Give that back!', 'grikkle_caught', '#f44'),
				opt('...okay, that was impressive.', 'grikkle_respect', '#4f4'),
			]
		),
		grikkle_caught: node('grikkle_caught',
			'*He hands it back sheepishly.* Sorry. Force of habit. Old job was pickpocket. New job is merchant. Skills transfer! Just... in wrong direction sometimes. Grikkle is REFORMING! Mostly! On Tuesdays! The rest of the week is... flexible.',
			[
				opt('Show me your wares, you little menace.', 'grikkle_wares', '#ff4', { onSelect: { mood: 'amused' } }),
				opt('[Leave]', '__exit__', '#0ff'),
			]
		),
		grikkle_respect: node('grikkle_respect',
			'*He beams.* SEE! Grikkle has TALENT! Most goblins just bash and grab! Grikkle has FINESSE! Subtle! Artisanal thievery! *He hands back the purse.* But Grikkle is merchant now! Legitimate business-goblin! Thievery is just... backup career. In case rock market crashes. Which it WON\'T. Rocks are forever. That is literally geology.',
			[
				opt('Show me the rocks, Grikkle.', 'grikkle_wares', '#ff4', { onSelect: { mood: 'friendly' } }),
			]
		),
		grikkle_backstory: node('grikkle_backstory',
			'*He settles in, clearly thrilled someone asked.* Grikkle was born in Goblin Warren, sub-level C, alcove seven. Mother was warrior. Father was also warrior. Brother was warrior. Sister was warrior. EVERYONE warrior! Very violent family! Dinner conversation was mostly screaming and biting! But Grikkle was different. Grikkle did not want to hit things. Grikkle wanted to SELL things. First business: age four, sold mud pies to other goblin children. Made two teeth in profit! Teeth is goblin currency. Very hygenic. Not really.',
			[
				opt('How did you end up here?', 'grikkle_exile', '#8cf'),
				opt('Teeth currency? Really?', 'grikkle_teeth', '#ff4'),
			]
		),
		grikkle_exile: node('grikkle_exile',
			'*He sighs.* Boss Goblin said Grikkle was "embarrassment to goblin kind." Said selling things was "un-goblin." Kicked Grikkle out of warren! So Grikkle set up shop in dungeon! At first, customers were just lost adventurers. Then word spread! Now Grikkle has REGULARS! A skeleton comes every Tuesday for polish. A slime bought eight hats. And there was one very confused rat who Grikkle is PRETTY sure was trying to buy cheese but might have just been lost. Grikkle charged it anyway.',
			[
				opt('A skeleton buys polish from you?', 'grikkle_skeleton', '#ff4'),
				opt('You charged a lost rat?', 'return', '#ff4', { onSelect: { mood: 'amused' } }),
			]
		),
		grikkle_skeleton: node('grikkle_skeleton',
			'*He nods enthusiastically.* Mr. Bones! Best customer! Very reliable! Never haggles! Doesn\'t talk much! PERFECT customer! Grikkle sells him bone polish every Tuesday! Mr. Bones pays in teeth! Which is ironic because Mr. Bones IS mostly teeth! But Grikkle does not ask questions! Good merchants don\'t! Unless question is "want to buy more?"',
			[
				opt('I need to meet Mr. Bones.', 'return', '#4f4', { onSelect: { mood: 'amused' } }),
			]
		),
		grikkle_teeth: node('grikkle_teeth',
			'*He pulls out a small bag that rattles.* Goblin economy runs on teeth! Very logical! Always in supply! Every goblin born with full set! Then they fall out! Then new ones grow! Renewable resource! Way better than gold! Gold just sits there! Teeth have UTILITY! Can be used as currency AND as weapons! Try biting someone with a gold coin! Not effective! Grikkle tried!',
			[
				opt('The economics check out, honestly.', 'return', '#4f4', { onSelect: { mood: 'amused' } }),
			]
		),
		grikkle_info: node('grikkle_info',
			'*He looks around conspiratorially.* Grikkle knows THINGS. Grikkle sees things. Small goblin, big eyes. Nobody notices Grikkle! Is like being invisible! But with better inventory! This level has secret room in east wall \u2014 Grikkle heard walls talking about it. Also, big-monsters mostly sleep in the northwest. And there is trap near the stairs \u2014 Grikkle saw other goblin step on it. Other goblin is now ceiling decoration. Very tragic. Also very funny. Grikkle feels conflicted.',
			[
				opt('Walls talking? You heard the walls talk?', 'grikkle_walls', '#8cf'),
				opt('Thanks for the tips, Grikkle.', 'return', '#4f4', { onSelect: { rumor: RUMORS.secret_walls, message: 'Grikkle reveals secret room locations!' } }),
			]
		),
		grikkle_walls: node('grikkle_walls',
			'*He nods solemnly.* Grikkle hears them. Late at night. When dungeon is quiet. Walls whisper. They say things like "containment integrity at eighty-seven percent" and "alert: organic entity detected in sector four" and sometimes just "hmmmmmm" for a VERY long time. Grikkle thinks walls are computers. Or ghosts. Or ghost computers. Grikkle\'s theory: entire dungeon is one big thinking machine and we are all bugs in the code! *He taps his nose.* Also literal bugs sometimes. Dungeon has centipedes. HUGE ones.',
			[
				opt('That\'s... actually a sophisticated theory, Grikkle.', 'return', '#4f4', { onSelect: { mood: 'friendly', rumor: RUMORS.singing_walls, message: 'Grikkle\'s theory about the dungeon as a thinking machine makes disturbing sense.' } }),
			]
		),
		grikkle_premium: node('grikkle_premium',
			'*He glances around, then lifts a corner of his crate.* Under here. Grikkle\'s PREMIUM stock. Not rocks! Not fungus! Real items! Found in deep places where other goblins too scared to go! Grikkle goes because Grikkle has two things other goblins don\'t: courage! And a complete inability to sense danger! Same thing, really! *He reveals a surprisingly well-maintained potion.* Dungeon-brewed healing tonic. Real stuff. Want?',
			[
				opt('Now we\'re talking. What do you want for it?', 'grikkle_premium_price', '#ff4'),
				opt('Where did you really get this?', 'grikkle_premium_source', '#8cf'),
			]
		),
		grikkle_premium_price: node('grikkle_premium_price',
			'*He thinks VERY hard. Steam might be coming from his ears.* For premium tonic... Grikkle wants a TRADE SECRET. You know other merchants? The big-person ones? Tell Grikkle their tricks! How they sell things that are NOT rocks! Grikkle needs to expand inventory! Diversify! That is business word Grikkle learned from broken book he found!',
			[
				opt('Morrigan says: "marketing is everything." Sell the story, not the product.', 'grikkle_wisdom', '#ff4', { showIf: { type: 'hasStories', value: 1 } }),
				opt('I don\'t know any merchant secrets.', 'grikkle_pity_deal', '#888'),
				opt('The secret is confidence. ACT like your rocks are worth gold.', 'grikkle_wisdom', '#4cf', { socialCheck: { skill: 'persuade', difficulty: 10, successNode: 'grikkle_wisdom', failNode: 'grikkle_pity_deal' } }),
			]
		),
		grikkle_wisdom: node('grikkle_wisdom',
			'*His eyes go WIDE.* Marketing! STORY! CONFIDENCE! *He scribbles on a stone tablet with a piece of charcoal.* This changes EVERYTHING! Grikkle is not selling rocks! Grikkle is selling EXPERIENCES! Premium Hand-Selected Geological Artifacts! Artisanal Cave Minerals! *He\'s vibrating with excitement.* HERE! Take tonic! Take TWO tonics! You just gave Grikkle MBA! In one sentence! Big-person business school is VERY efficient!',
			[
				opt('Take the tonics. [+10 HP]', 'return', '#4f4', { onSelect: { hp: 10, message: 'Grikkle\'s premium dungeon-brewed tonics are surprisingly potent! +10 HP', mood: 'friendly' } }),
			]
		),
		grikkle_pity_deal: node('grikkle_pity_deal',
			'*He deflates slightly.* No secrets? Okay. Is fine. Grikkle will figure out step two eventually. In meantime, take tonic anyway. Grikkle needs REVIEWS more than payment! Tell other big-persons about Grikkle! Word of mouth! Viral marketing! Grikkle also has actual virus but that is different thing!',
			[
				opt('Take the tonic. [+5 HP]', 'return', '#4f4', { onSelect: { hp: 5, message: 'Grikkle\'s tonic works! Probably don\'t think about the "virus" comment. +5 HP' } }),
			]
		),
		grikkle_premium_source: node('grikkle_premium_source',
			'*He lowers his voice.* Grikkle goes to deep places. Level five. Level six. Places where air is thick and walls glow. There are pools \u2014 dark pools that shimmer like oil \u2014 and things GROW near them. Mushrooms. Crystals. And sometimes... potions. Already bottled. Already labeled. Like dungeon is making them ON PURPOSE. *He shudders.* Grikkle does not think about WHY dungeon makes potions. Thinking about WHY dungeon does things makes Grikkle\'s head hurt. Grikkle just takes and sells. Is simpler.',
			[
				opt('The dungeon manufactures its own items?', 'grikkle_dungeon_factory', '#f44'),
				opt('Smart not to think too hard about it.', 'grikkle_premium_price', '#ff4'),
			]
		),
		grikkle_dungeon_factory: node('grikkle_dungeon_factory',
			'*He nods, clearly unnerved.* Makes potions. Makes traps. Makes MONSTERS. Everything in dungeon is... GROWN. Like garden. Very scary garden with death flowers and murder soil. Grikkle once saw a corridor grow a NEW ROOM overnight. Just... pushed the walls apart and there was room. Empty. Clean. Waiting. Like house making spare bedroom for guest that hasn\'t arrived yet. *He pulls his hat down tighter.* Grikkle does not want to be the guest. Grikkle is just the caterer.',
			[
				opt('A spare bedroom for an expected guest... [Rumor learned]', 'return', '#f44', { onSelect: { rumor: RUMORS.potions_matter, message: 'Grikkle reveals that the dungeon grows new rooms as if expecting visitors.' } }),
			]
		),
		grikkle_intimidated: node('grikkle_intimidated',
			'*He leaps behind his crate.* OKAY OKAY! Take things! All things! Grikkle\'s things are YOUR things now! Hostile takeover! Very legal! Grikkle knows about hostile takeovers from broken business book! *He pushes the crate toward you.* Just please do not step on Grikkle! Previous customer stepped on Grikkle! Was very flat for a week! Goblin skeleton is surprisingly flexible but the experience was NOT enjoyable!',
			[
				opt('Take Grikkle\'s inventory. [+4 HP, +1 ATK]', 'return', '#4f4', { onSelect: { hp: 4, atk: 1, message: 'You help yourself to Grikkle\'s "inventory." +4 HP, +1 ATK', mood: 'afraid' } }),
			]
		),
		grikkle_unimpressed: node('grikkle_unimpressed',
			'*He crosses his tiny arms.* Pfft. You think THAT is scary? Grikkle lives in dungeon! With MONSTERS! Grikkle\'s NEIGHBORS are a pack of giant rats and a skeleton who plays trumpet at 3 AM! You are not scary! You are just BIG! Lots of things are big! Mountains! Dragons! Boss Goblin\'s ego! None of them scare Grikkle! Well, dragons do. But that is REASONABLE fear! Very sensible! Not embarrassing!',
			[
				opt('Fair point. Let\'s just trade normally.', 'grikkle_wares', '#4f4', { onSelect: { mood: 'amused' } }),
			]
		),
		grikkle_threaten: node('grikkle_threaten',
			'*Used as social check routing node.*',
			[
				opt('[This node should not display]', 'return', '#888'),
			]
		),
		grikkle_stories: node('grikkle_stories',
			'*He claps his tiny hands.* STORIES?! Grikkle LOVES stories! Stories is FREE marketing! Every story is advertisement for Grikkle brand! You sit! Grikkle tell!',
			[
				opt('Tell me about Se\u00f1or Pebbleston.', 'story_pebbleston', '#c8f', { once: true }),
				opt('Tell me about Mr. Bones.', 'story_mr_bones', '#c8f', { once: true }),
				opt('No more stories.', 'return', '#0ff'),
			]
		),
		story_pebbleston: node('story_pebbleston',
			'*His eyes go misty.* Se\u00f1or Pebbleston. *He removes his tiny top hat and holds it to his chest.* Greatest business partner Grikkle ever had. Found him on level two. IMMEDIATELY knew he was special. He had... PRESENCE. Other rocks? Just rocks. Se\u00f1or Pebbleston? He had CHARISMA. He had VISION. He had... well, he was very shiny. Grikkle cleaned him and put tiny hat on him. MATCHING hats! We were business TEAM! Se\u00f1or Pebbleston negotiated seventeen trades! Just by sitting there! Clients assumed the rock was powerful artifact! Grikkle did not correct them! GENIUS marketing! *His lip trembles.* Then Grikkle ACCIDENTALLY sold him to a skeleton who thought he was premium kidney stone. Grikkle has never forgiven self. Se\u00f1or Pebbleston, if you can hear Grikkle... Grikkle is SORRY.',
			[
				opt('That is the saddest business story I\'ve ever heard. [Story collected]', 'grikkle_stories', '#4f4', { onSelect: { story: STORIES.grikkle_rocks, message: 'You learned the tragic tale of Se\u00f1or Pebbleston, goblin business legend.' } }),
			]
		),
		story_mr_bones: node('story_mr_bones',
			'*He cackles.* Mr. Bones! Best worst customer! Grikkle sold him "Premium Reconstitution Kit" for when bones fall off! Very common skeleton problem! Kit was... bag of random bones from floor. Grikkle may have been... CREATIVE with sourcing. Mr. Bones assembled himself with new bones. Got THREE arms! TWO ribcages! Pelvis on HEAD! Very avant-garde look! Mr. Bones was NOT happy! Filed complaint! In Morse code! By clacking jaw! Very persistent! Grikkle offered refund \u2014 two pebbles! Mr. Bones wanted "emotional damages!" *He shakes his head.* Skeletons don\'t HAVE emotions! They don\'t even have brains! But Mr. Bones INSISTED. Settlement was: Grikkle no sell bone products for one week. Grikkle lasted two days. Mr. Bones still comes for polish though. With all three arms. Good customer.',
			[
				opt('Mr. Bones filed a complaint in Morse code. Amazing. [Story collected]', 'grikkle_stories', '#4f4', { onSelect: { story: STORIES.grikkle_bones, message: 'You learned about Mr. Bones and the customer service dispute of the century.' } }),
			]
		),
		farewell: node('farewell',
			'*He waves enthusiastically with both hands.* BYE BYE! Come back soon! Tell friends! Tell ENEMIES! Grikkle does not discriminate! All customers welcome! Even the ones who tried to eat Grikkle! Especially them! Repeat customers are VERY important! Even cannibalistic ones!',
			[
				opt('[Leave conversation]', '__exit__', '#0ff'),
			]
		),
		return_afraid: node('return_afraid',
			'*Grikkle is hiding behind his crate. Only his tiny top hat is visible.* BIG-PERSON! You are BACK! Is scary things gone? Grikkle heard NOISES! Very bad noises! Like bones crunching but BIGGER! And then... silence! SILENCE IS WORSE! When dungeon is quiet, dungeon is PLANNING! Grikkle knows this! Grikkle survived FOURTEEN attempted hostile takeovers! Physical ones! Not corporate ones!',
			[
				opt('The coast is clear, Grikkle.', 'return', '#4f4', { onSelect: { mood: 'neutral', message: '*Grikkle peeks out.* "You SURE? Last time someone said coast is clear, coast was very NOT clear. Coast was full of spiders."' } }),
				opt('BOO!', '__exit__', '#f44', { onSelect: { npcAction: 'flee', message: 'Grikkle screams, grabs his crate, and vanishes into a crack in the wall you didn\'t know existed.' } }),
				opt('Want me to stand guard?', 'return', '#4f4', { onSelect: { mood: 'friendly', message: '"FREE bodyguard?! Grikkle accepts! This is best deal Grikkle has made all week! And Grikkle makes LOTS of deals!"' } }),
			]
		),
		return_hostile: node('return_hostile',
			'*Grikkle stands on his crate to look you in the eye. He fails by approximately three feet, but the ENERGY is there.* You! BAD customer! Grikkle knows what you did! You told OTHER customers about Grikkle\'s "flexible sourcing policies!" This is SLANDER! Grikkle\'s sourcing is not flexible! It is CREATIVE! Very different! Flexible implies dishonesty! Creative implies GENIUS!',
			[
				opt('Grikkle, I\'m sorry.', 'return', '#4f4', { onSelect: { mood: 'neutral', message: '"Hmph. Grikkle accepts apology. But you are on PROBATION. Customer probation. Very serious."' } }),
				opt('I\'ll buy something to make up for it.', 'grikkle_wares', '#ff4', { onSelect: { mood: 'amused', message: '"Now THAT is the language Grikkle understands! Money speaks louder than slander!"' } }),
				opt('Your sourcing IS dishonest, Grikkle.', '__exit__', '#f44', { onSelect: { npcAction: 'storm_off', message: 'Grikkle pulls his tiny top hat over his eyes, picks up his crate, and waddles away with maximum indignation.' } }),
			]
		),
		return_sad: node('return_sad',
			'*Grikkle is sitting on his crate, staring at a small pebble.* Grikkle misses Se\u00f1or Pebbleston. *He sniffles.* Best business partner. Never complained. Never asked for raise. Never got sick. Was rock. Perfect employee. And Grikkle SOLD him. For three teeth and a button. Grikkle is BAD friend. BAD business partner. Grikkle should close shop. Go live in cave. Smaller cave. Sadder cave.',
			[
				opt('Señor Pebbleston would want you to keep selling, Grikkle.', 'return', '#4f4', { onSelect: { mood: 'friendly', message: '*Grikkle wipes his eyes.* "You... you think so? Se\u00f1or Pebbleston believed in Grikkle Brand? Even from beyond?"' } }),
				opt('I\'ll help you find Señor Pebbleston.', 'return', '#ff4', { onSelect: { mood: 'amused', message: '"REALLY?! You would search entire dungeon for one rock?! *His eyes light up.* That is either very kind or very stupid! Either way, Grikkle APPROVES!"' } }),
				opt('There are other rocks, Grikkle.', 'return', '#f44', { onSelect: { mood: 'hostile', message: '"OTHER rocks?! OTHER ROCKS?! There are no OTHER Se\u00f1or Pebblestons! Every rock is UNIQUE! You are CANCELLED, big-person!"' } }),
			]
		),
		return_amused: node('return_amused',
			'*Grikkle is practically vibrating with glee.* BIG-PERSON! Guess what?! Grikkle just sold a MIRROR to a Mimic! A MIRROR! Mimic looked at self for FIRST TIME! Had existential crisis! Mimic now questioning if it is a chest pretending to be a monster or a monster pretending to be a chest! Grikkle charged EXTRA for the therapy session afterwards! Philosophy is PREMIUM SERVICE!',
			[
				opt('You gave a Mimic an identity crisis.', 'return', '#4f4', { onSelect: { mood: 'amused' } }),
				opt('How much did you charge for the therapy?', 'return', '#ff4', { onSelect: { mood: 'amused', message: '"Four teeth! Which is actually what Mimic was ALREADY holding! So Mimic technically paid with its OWN teeth! Capitalism is BEAUTIFUL!"' } }),
				opt('You are the most dangerous thing in this dungeon, Grikkle.', 'return', '#4f4', { onSelect: { mood: 'amused', message: '"Thank you! Grikkle puts that on business card! \'More dangerous than monsters! Better prices too!\'"' } }),
			]
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
	'Grikkle': GOBLIN_PEDDLER_DIALOGUE,
};
