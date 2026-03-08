import type { Item } from './items';

export const BOOK_CATALOG: Record<string, Item> = {
	// -----------------------------------------------------------------------
	// 1. The Light of Solaris — temple propaganda
	// -----------------------------------------------------------------------
	book_light_of_solaris: {
		id: 'book_light_of_solaris',
		name: 'The Light of Solaris',
		char: 'B',
		color: '#ff8',
		type: 'book',
		description: 'A common prayer book bound in pale linen. Its pages smell of temple incense.',
		pages: [
			`O Solaris, Radiant and Undying,\n` +
				`You who hung the stars in their courses\n` +
				`and set the rivers to their winding paths —\n` +
				`hear us, your children, small and thankful.\n\n` +
				`We lift our voices to the Seven\n` +
				`who chose us from the darkness,\n` +
				`who descended from the eternal light\n` +
				`to shelter us beneath their gaze.\n\n` +
				`Grant us sight to see your truth.\n` +
				`Grant us hands to do your work.\n` +
				`Grant us hearts that do not question\n` +
				`the mercy of your chosen design.\n\n` +
				`For you were always,\n` +
				`and you shall always be,\n` +
				`and we are but the grateful garden\n` +
				`that grows beneath your endless sun.`,

			`A BRIEF CATECHISM FOR THE FAITHFUL\n\n` +
				`Q: Whence came the gods?\n` +
				`A: They were always. Before the mountains,\n` +
				`before the seas, the Seven existed in\n` +
				`radiance eternal. They chose to create the\n` +
				`world as an act of perfect love.\n\n` +
				`Q: Why do the gods watch over us?\n` +
				`A: Because they who chose us could not bear\n` +
				`to see their creation wander without\n` +
				`guidance. Their benevolence is eternal and\n` +
				`without condition.\n\n` +
				`Q: Must we understand the gods?\n` +
				`A: We must not. Understanding is for them.\n` +
				`Obedience is for us. The faithful heart does\n` +
				`not ask why the sun rises — it simply\n` +
				`gives thanks for the warmth.`,
		],
	},

	// -----------------------------------------------------------------------
	// 2. A Soldier's Journal — echoes of Khorvan
	// -----------------------------------------------------------------------
	book_soldiers_journal: {
		id: 'book_soldiers_journal',
		name: "A Soldier's Journal",
		char: 'B',
		color: '#aa8866',
		type: 'book',
		description: 'A water-stained journal bound in cracked leather. The handwriting grows more unsteady toward the end.',
		pages: [
			`14th of Ashmouth\n\n` +
				`Twelve days marching under the General's\n` +
				`banner. Haven't seen the man once. He rides\n` +
				`somewhere behind the supply train with his\n` +
				`personal guard — fifty men who've never\n` +
				`swung a blade in anger.\n\n` +
				`Draven says the General got his commission\n` +
				`through family connections. "Never held a\n` +
				`sword that wasn't decorative," he said.\n` +
				`The men laughed, but quietly.\n\n` +
				`There are rumors the General fled from\n` +
				`a skirmish at Pellin's Crossing last year.\n` +
				`Nobody will confirm it. Nobody will deny it\n` +
				`either.`,

			`16th of Ashmouth\n\n` +
				`Tomorrow we fight. The enemy holds the\n` +
				`gate. Our orders came by courier — the\n` +
				`General's seal, the General's words, but\n` +
				`not the General's presence.\n\n` +
				`He promises a flanking force will hit them\n` +
				`from the east at dawn. Draven looked at\n` +
				`the battle plan a long time and said\n` +
				`nothing. That worried me more than any\n` +
				`words could have.\n\n` +
				`Harsk joked: "If I die tomorrow, at least\n` +
				`I'll know the General survived." Nobody\n` +
				`laughed. We all know he'll be positioned\n` +
				`"in reserve." He always is.\n\n` +
				`Somewhere safe. Somewhere far from the\n` +
				`screaming.`,

			`19th of Ashmouth\n\n` +
				`There was no flanking force. There was\n` +
				`never a flanking force.\n\n` +
				`Eight thousand went to the gate. I don't\n` +
				`know how many came back. I stopped\n` +
				`counting the dead when I found Harsk.\n\n` +
				`Draven carved something into the stone\n` +
				`before he died. I couldn't read it through\n` +
				`the blood. But I think it was a name.\n\n` +
				`The General survived, of course. He always\n` +
				`does. They say he was seen riding east\n` +
				`before the battle even ended, his personal\n` +
				`guard around him like a shell.\n\n` +
				`I am done with generals. I am done with\n` +
				`men who send others to die from a safe\n` +
				`distance and call it courage.`,
		],
	},

	// -----------------------------------------------------------------------
	// 3. Herbal Remedies of the Greenweald
	// -----------------------------------------------------------------------
	book_herbal_remedies: {
		id: 'book_herbal_remedies',
		name: 'Herbal Remedies of the Greenweald',
		char: 'B',
		color: '#88cc66',
		type: 'book',
		description: 'A practical guide to medicinal plants, illustrated with pressed leaf samples between the pages.',
		pages: [
			`COMMON HEALING PLANTS\n\n` +
				`Moonpetal — Found along streams in dappled\n` +
				`shade. Brew as a tea for fever and aching\n` +
				`joints. Harvest only at night; the petals\n` +
				`close at dawn and lose potency.\n\n` +
				`Thornberry — The deep red berries of the\n` +
				`thornberry bush will staunch bleeding when\n` +
				`crushed into a poultice. Mind the thorns.\n\n` +
				`Silverroot — Dig carefully near old oaks.\n` +
				`The pale root, when chewed, eases nausea\n` +
				`and steadies the hands. Invaluable for\n` +
				`surgeons and archers alike.\n\n` +
				`Witchgrass — A common weed with uncommon\n` +
				`properties. Boil the stems for a draught\n` +
				`that clears poison from the blood. Tastes\n` +
				`vile, but you'll live.`,

			`A WARNING ON THE GREY WASTES\n\n` +
				`No plant grows in the Grey Wastes. Not one.\n` +
				`I have walked that dead land and I tell you\n` +
				`the soil itself is murdered. It crumbles to\n` +
				`dust that smells of nothing — not even rot,\n` +
				`for rot requires life.\n\n` +
				`The old druids say something was poured\n` +
				`into the water there, long ago. Something\n` +
				`that drank the life from everything it\n` +
				`touched — tree, beast, and stone alike.\n\n` +
				`Even the Ley Lines are dead beneath those\n` +
				`ashen fields. Even the goddess weeps there,\n` +
				`they say. If that is so, I wonder why.\n` +
				`Surely a goddess of growing things would\n` +
				`not allow such a wound to fester — unless\n` +
				`it is a wound she cannot heal.\n\n` +
				`Or one she dare not touch.`,
		],
	},

	// -----------------------------------------------------------------------
	// 4. The Brother War: A History
	// -----------------------------------------------------------------------
	book_brother_war: {
		id: 'book_brother_war',
		name: 'The Brother War: A History',
		char: 'B',
		color: '#ccaa88',
		type: 'book',
		description: 'A scholarly volume in heavy binding. The author\'s name has been scratched out.',
		pages: [
			`THE BROTHER WAR: A HISTORY\n` +
				`Author: [name removed by censor]\n\n` +
				`For three hundred years the kingdoms of\n` +
				`Vestraad and Korinn stood as one. Their\n` +
				`peoples intermarried. Their merchants\n` +
				`traded freely across open borders. A child\n` +
				`of Vestraad might grow up speaking Korinn\n` +
				`dialect and think nothing of it.\n\n` +
				`To understand the war, one must first\n` +
				`understand this: these were not enemies.\n` +
				`They were family. And that is what made\n` +
				`their destruction so precise, so surgical,\n` +
				`and so complete.`,

			`THE EVIDENCE\n\n` +
				`It began with letters — correspondence\n` +
				`between officials that revealed plans for\n` +
				`betrayal. Vestraad's court received proof\n` +
				`that Korinn's queen was plotting invasion.\n` +
				`Korinn's generals found intelligence\n` +
				`showing Vestraad massing troops in secret.\n\n` +
				`Every document was perfect. The seals were\n` +
				`genuine — or appeared so. The handwriting\n` +
				`matched known samples flawlessly. Scholars\n` +
				`authenticated ancient texts that "proved"\n` +
				`the two kingdoms had been enemies in a\n` +
				`forgotten age.\n\n` +
				`Witnesses came forward. Merchants who had\n` +
				`"overheard" treasonous conversations.\n` +
				`Soldiers who had "seen" secret armies.\n` +
				`Every testimony was consistent. Every lie\n` +
				`was seamless.\n\n` +
				`And both kingdoms believed, because the\n` +
				`alternative — that someone had fabricated\n` +
				`all of it — was unthinkable.`,

			`THE WAR\n\n` +
				`Six years. Four hundred thousand dead.\n\n` +
				`At the Betrayal of Mirrow Ford, soldiers\n` +
				`who had once been trading partners killed\n` +
				`each other in a river that ran red for\n` +
				`three days.\n\n` +
				`Brother fought brother. Literally — there\n` +
				`are records of men discovering, mid-battle,\n` +
				`that they were fighting cousins, in-laws,\n` +
				`childhood friends. The grief did not stop\n` +
				`them. By then the lies had become the only\n` +
				`truth anyone could bear.\n\n` +
				`It is easier to believe your brother is\n` +
				`your enemy than to believe you have been\n` +
				`made a fool.`,

			`THE AFTERMATH\n\n` +
				`Both kingdoms fell. Vestraad was a ruin.\n` +
				`Korinn was ash. The survivors — those few\n` +
				`who lived — learned the truth decades later\n` +
				`when a workshop was discovered containing\n` +
				`the forger's tools, his practice sheets,\n` +
				`his notes.\n\n` +
				`The notes were clinical. Detached. The\n` +
				`forger described the destruction of two\n` +
				`nations with the dispassion of a craftsman\n` +
				`evaluating his technique. There was no\n` +
				`hatred in his work. No ideology. He had\n` +
				`been hired. He had delivered.\n\n` +
				`The survivors searched for him. They never\n` +
				`found him. He had simply... vanished.\n` +
				`As if he had stepped out of the world\n` +
				`entirely.`,

			`THE AUTHOR'S LAMENT\n\n` +
				`I have spent thirty years studying this\n` +
				`war. I have read every surviving letter,\n` +
				`every forged document, every account.\n\n` +
				`What haunts me is not the scale of it.\n` +
				`Wars kill. That is their nature.\n\n` +
				`What haunts me is the perfection. No single\n` +
				`person should be capable of this — the\n` +
				`patience, the precision, the ability to\n` +
				`mimic any hand, forge any seal, create\n` +
				`witnesses from nothing. To orchestrate the\n` +
				`death of four hundred thousand people with\n` +
				`nothing but ink and parchment.\n\n` +
				`Who could craft such perfect deception?\n` +
				`What mind could be so cold, so patient,\n` +
				`so utterly without conscience?\n\n` +
				`And — the question that keeps me awake —\n` +
				`where did he go?\n\n` +
				`Men like that do not simply disappear.\n` +
				`They ascend.`,
		],
	},

	// -----------------------------------------------------------------------
	// 5. Songs of the Luminari
	// -----------------------------------------------------------------------
	book_songs_luminari: {
		id: 'book_songs_luminari',
		name: 'Songs of the Luminari',
		char: 'B',
		color: '#ffcc88',
		type: 'book',
		description: 'A fragile collection of preserved poems, transcribed from stone carvings. The pages are edged in gold leaf.',
		pages: [
			`I. THE LIBRARIES OF LIGHT\n\n` +
				`We built our halls of cedar and of stone\n` +
				`and filled them with the voices of the wise.\n` +
				`Five hundred thousand scrolls — each one\n` +
				`a life, a question, a discovered truth.\n\n` +
				`Our painters set the sunset down in oils\n` +
				`so that our children's children's children\n` +
				`might know its colors. Our philosophers\n` +
				`sat in gardens made for thinking and asked\n` +
				`the questions that take centuries to answer.\n\n` +
				`We were not warriors. We were not kings.\n` +
				`We were the people who remembered,\n` +
				`and in remembering, kept the world\n` +
				`from losing its way.`,

			`II. THE BURNING\n\n` +
				`The scrolls burned brightest at the edges\n` +
				`where the ink was thickest — where the\n` +
				`careful hands had pressed hardest, writing\n` +
				`words they thought would last forever.\n\n` +
				`Our king decreed. We do not know why.\n` +
				`He could not read the scrolls he burned.\n` +
				`He could not name the scholars he silenced.\n` +
				`He destroyed what he could not comprehend\n` +
				`and called it strength.\n\n` +
				`The gardens are ashes. The paintings are\n` +
				`smoke. Two thousand years of patient\n` +
				`gathering, undone in a single afternoon\n` +
				`by a man who mistook ignorance for power.\n\n` +
				`We built a civilization of light.\n` +
				`He could not see it. So he burned it\n` +
				`until there was nothing left to see.`,

			`III. THE LAST INSCRIPTION\n` +
				`(carved on the inner wall of the\n` +
				` final Luminari city)\n\n` +
				`We survived the darkness before the stars.\n` +
				`We survived the wars of iron and of stone.\n` +
				`We survived the serpent and its hunger.\n` +
				`We survived the silence of empty heavens.\n\n` +
				`We did not survive our king.\n\n` +
				`Let this be carved where time cannot\n` +
				`reach it. Let this be the one thing\n` +
				`that endures when all else is ash.\n\n` +
				`He was not cruel. He was not wicked.\n` +
				`He was simply, utterly, catastrophically\n` +
				`incapable of wisdom — and we gave him\n` +
				`a throne.\n\n` +
				`If the gods are just, let no fool\n` +
				`ever sit so high again.`,
		],
	},

	// -----------------------------------------------------------------------
	// 6. The Blind Monks of Still Waters
	// -----------------------------------------------------------------------
	book_blind_monks: {
		id: 'book_blind_monks',
		name: 'The Blind Monks of Still Waters',
		char: 'B',
		color: '#aaaacc',
		type: 'book',
		description: 'A slim volume of folk tales. This story has been dog-eared by many readers.',
		pages: [
			`THE BLIND MONKS OF STILL WATERS\n` +
				`A Folk Tale of the Southern Reaches\n\n` +
				`There was once a monastery beside a lake\n` +
				`so calm it showed the sky without a ripple.\n` +
				`Eighty-six monks lived there. They healed\n` +
				`the sick who came to their doors. They\n` +
				`taught children their letters. They tended\n` +
				`gardens that fed the village below.\n\n` +
				`They had taken vows of gentleness and\n` +
				`kept them without exception. They harmed\n` +
				`no living thing — not even the wasps\n` +
				`that nested in their chapel eaves.\n\n` +
				`They were, by all accounts, the kindest\n` +
				`people in the world.`,

			`One day an inquisitor came to the monastery.\n` +
				`She carried papers bearing an official seal\n` +
				`and a mandate to search for heretical\n` +
				`texts. There were none, of course.\n\n` +
				`But she stayed. She questioned the monks\n` +
				`for weeks — calmly, methodically, with the\n` +
				`patient curiosity of a scholar dissecting\n` +
				`a specimen. "She was curious, not cruel,"\n` +
				`the survivors would later say, though\n` +
				`perhaps they were too kind to know the\n` +
				`difference.\n\n` +
				`When the monks had nothing to confess —\n` +
				`for they were innocent — the inquisitor\n` +
				`grew frustrated. She said: "Those who\n` +
				`will not see the truth do not deserve\n` +
				`sight."\n\n` +
				`She blinded all eighty-six.`,

			`The monks wandered out of the monastery\n` +
				`with empty eyes and steady hands, holding\n` +
				`each other in a long, slow chain. They\n` +
				`walked into the wilderness, feeling their\n` +
				`way by touch and by the sound of birdsong.\n\n` +
				`Some say they perished. Some say they\n` +
				`found another lake and built again. But\n` +
				`the story's heart is this:\n\n` +
				`They forgave her.\n\n` +
				`Every one of them. Without hesitation,\n` +
				`without bitterness, without condition.\n` +
				`They prayed for her soul as they stumbled\n` +
				`blind through the bracken. They wept not\n` +
				`for themselves but for whatever wound\n` +
				`inside her had made such cruelty possible.\n\n` +
				`And this, the storytellers say, was the\n` +
				`cruelest thing of all — that mercy can\n` +
				`be given to those who least deserve it,\n` +
				`and that the giving is a kind of wound\n` +
				`that never heals.`,
		],
	},

	// -----------------------------------------------------------------------
	// 7. On the Nature of Ley Lines
	// -----------------------------------------------------------------------
	book_ley_lines: {
		id: 'book_ley_lines',
		name: 'On the Nature of Ley Lines',
		char: 'B',
		color: '#aa88ff',
		type: 'book',
		description: 'A scholarly treatise on magical theory. The margins are filled with anxious annotations in a different hand.',
		pages: [
			`ON THE NATURE OF LEY LINES\n` +
				`A Treatise by Aldric Venn, Third Chair of\n` +
				`the Arcanum Collegium\n\n` +
				`Ley Lines are the veins of the world.\n` +
				`Through them flows the raw substance of\n` +
				`magic — an energy that predates the gods\n` +
				`themselves, if the oldest texts are to be\n` +
				`believed.\n\n` +
				`Every spell draws from them. Every enchant-\n` +
				`ment is a sip from their current. Where\n` +
				`they converge, magic pools into nexus points\n` +
				`of extraordinary power. Where they thin,\n` +
				`the world grows mundane and brittle.\n\n` +
				`They are, in every meaningful sense, the\n` +
				`foundation upon which reality is built.`,

			`THE SEVEN TYPES\n\n` +
				`My research has identified seven distinct\n` +
				`frequencies within the Ley Line network,\n` +
				`each corresponding to a fundamental\n` +
				`principle of existence:\n\n` +
				`  Order  — structure, pattern, law\n` +
				`  Change — transformation, flux, growth\n` +
				`  Time   — causality, memory, sequence\n` +
				`  Space  — distance, dimension, boundary\n` +
				`  Matter — substance, weight, form\n` +
				`  Energy — motion, heat, force\n` +
				`  Spirit — awareness, soul, meaning\n\n` +
				`Note that these are not the domains of the\n` +
				`gods, though they resemble them. The Ley\n` +
				`Lines existed before the Ascension. The\n` +
				`principles are older than any deity.\n\n` +
				`This distinction troubles me more than\n` +
				`I can express in a public text.`,

			`LIVING LINES?\n\n` +
				`What I write here may end my career.\n\n` +
				`In thirty years of study, I have spoken\n` +
				`with dozens of scholars who have spent\n` +
				`time near major Ley Line nexus points.\n` +
				`Their accounts are remarkably consistent.\n\n` +
				`They describe presences. Not gods — they\n` +
				`are clear on this point — but something\n` +
				`older. Vast, patient, and sorrowful.\n` +
				`One colleague described it as "standing\n` +
				`beside a sleeping giant who dreams of\n` +
				`what it used to be."\n\n` +
				`Near an Order nexus, researchers report\n` +
				`a sense of profound structure — as if\n` +
				`the mathematics of the world were alive\n` +
				`and watching. Near a Spirit nexus, the\n` +
				`feeling of being known completely.\n\n` +
				`These are not divine manifestations. The\n` +
				`sensation is entirely unlike prayer. It\n` +
				`is older. Deeper. Sadder.`,

			`THE FORBIDDEN QUESTION\n\n` +
				`I will ask it plainly, knowing what it\n` +
				`may cost me.\n\n` +
				`Seven principles. Seven Ley Lines. Each\n` +
				`bearing the unmistakable signature of\n` +
				`awareness — not mere energy, but will.\n` +
				`Purpose. Memory.\n\n` +
				`If seven principles became seven lines...\n` +
				`where did the awareness go?\n\n` +
				`And — the question that truly matters —\n` +
				`if these principles once had thrones,\n` +
				`and the thrones are now occupied...\n\n` +
				`who sits where they once stood?\n\n` +
				`I do not expect to publish this edition.\n` +
				`I write it for whomever finds it, in\n` +
				`whatever age is brave enough to ask\n` +
				`questions the gods would rather we\n` +
				`did not.\n\n` +
				`    — Aldric Venn\n` +
				`    Written in the year of his\n` +
				`    disappearance`,
		],
	},

	// -----------------------------------------------------------------------
	// 8. Three Children and the Ashlands
	// -----------------------------------------------------------------------
	book_three_children: {
		id: 'book_three_children',
		name: 'Three Children and the Ashlands',
		char: 'B',
		color: '#ffaacc',
		type: 'book',
		description: 'A children\'s storybook with a faded cover. The illustrations have been worn smooth by small fingers.',
		pages: [
			`THREE CHILDREN AND THE ASHLANDS\n` +
				`A Bedtime Story\n\n` +
				`Once there were three children — a boy\n` +
				`with dark eyes, a girl with bright hair,\n` +
				`and a baby who smiled at everything.\n\n` +
				`Their mother was very beautiful and very\n` +
				`busy. She had important things to do —\n` +
				`parties to attend and powerful people to\n` +
				`charm. She loved the children, she said.\n` +
				`She told each one separately, holding\n` +
				`their faces in her soft hands.\n\n` +
				`One day she said: "I am sending you on\n` +
				`a great adventure! A caravan will take\n` +
				`you to see the wonders of the Ashlands.\n` +
				`You will see things no child has ever\n` +
				`seen!"\n\n` +
				`The boy was frightened. The girl was\n` +
				`brave. The baby just smiled.`,

			`The caravan left at dawn. The children\n` +
				`waved from the back of the wagon, but\n` +
				`their mother had already gone inside.\n\n` +
				`They traveled east, where the ground\n` +
				`turned grey and the sky turned pale.\n` +
				`The Ashlands stretched before them like\n` +
				`a dead sea. Nothing grew. Nothing sang.\n` +
				`Even the wind was quiet.\n\n` +
				`The children were never seen again.\n\n` +
				`Some say their spirits still wander the\n` +
				`Ashlands, calling for a mother who dances\n` +
				`at a ball far away. The boy still has\n` +
				`dark eyes. The girl still has bright hair.\n` +
				`The baby has stopped smiling.\n\n` +
				`Their mother became very important.\n` +
				`She married well. She was admired by all.\n` +
				`And if she ever thought of the three small\n` +
				`faces pressed against the wagon's back\n` +
				`window, she never spoke of it.\n\n` +
				`Some adventures have no ending.\n` +
				`Some mothers have no heart.`,
		],
	},

	// -----------------------------------------------------------------------
	// 9. Thornhaven: A Village Remembered
	// -----------------------------------------------------------------------
	book_thornhaven: {
		id: 'book_thornhaven',
		name: 'Thornhaven: A Village Remembered',
		char: 'B',
		color: '#cc8888',
		type: 'book',
		description: 'A slim memorial volume printed on rough paper. A pressed thornflower marks the first page.',
		pages: [
			`THORNHAVEN: A VILLAGE REMEMBERED\n\n` +
				`Thornhaven was a small village at the\n` +
				`edge of the salt flats. Three hundred and\n` +
				`forty people lived there. They were\n` +
				`farmers, mostly. Weavers. A blacksmith\n` +
				`named Ollen who made nails and horseshoes\n` +
				`and, on feast days, tin whistles for the\n` +
				`children.\n\n` +
				`They were not rebels. They were not\n` +
				`heretics. They were ordinary people who\n` +
				`made the singular mistake of refusing\n` +
				`to pay a magistrate's "protection tax" —\n` +
				`an illegal levy that lined his pockets\n` +
				`and no one else's.\n\n` +
				`For this, they were destroyed.`,

			`The magistrate accused the entire village of\n` +
				`harboring demon cultists. He produced\n` +
				`evidence — documents, witnesses, confess-\n` +
				`ions extracted in the night. All of it was\n` +
				`fabricated. Every word. Every seal. Every\n` +
				`trembling signature.\n\n` +
				`The trial lasted six minutes.\n\n` +
				`All three hundred and forty were sentenced\n` +
				`to the salt mines. Eighty-three of them\n` +
				`were children.\n\n` +
				`The one honest clerk who had recorded the\n` +
				`true proceedings was found dead the next\n` +
				`morning. The real documents were burned.\n` +
				`Forgeries were planted in their place.\n\n` +
				`The village of Thornhaven ceased to exist\n` +
				`between sunrise and sunset of a single\n` +
				`day.`,

			`There was one survivor.\n\n` +
				`A girl named Sera had been away from the\n` +
				`village that day, gathering herbs in the\n` +
				`hills. She returned to find empty houses\n` +
				`and a magistrate's seal on every door.\n\n` +
				`Sera spent years searching. She found the\n` +
				`real documents in a hidden archive — the\n` +
				`clerk had made copies before he died.\n` +
				`She spent the rest of her life hunting\n` +
				`the magistrate who had condemned her\n` +
				`people.\n\n` +
				`She never found him.\n\n` +
				`He had fled beyond the reach of mortal\n` +
				`justice. Vanished, as if the earth itself\n` +
				`had swallowed him. As if he had found\n` +
				`some refuge no human pursuer could\n` +
				`follow.\n\n` +
				`Sera died still searching. But the\n` +
				`documents survived. Somewhere, they\n` +
				`wait — proof that three hundred and\n` +
				`forty innocent people were condemned\n` +
				`by a man who called himself justice\n` +
				`and was anything but.`,
		],
	},

	// -----------------------------------------------------------------------
	// 10. The Gravedigger's Lantern — Soul Shepherd / Hollow Ones
	// -----------------------------------------------------------------------
	book_gravediggers_lantern: {
		id: 'book_gravediggers_lantern',
		name: "The Gravedigger's Lantern",
		char: 'B',
		color: '#7799aa',
		type: 'book',
		description:
			"A hand-stitched journal with no title on the cover. The pages are yellowed and smell faintly of earth and dried flowers.",
		pages: [
			`I was sixteen when I started digging\n` +
				`graves in Ashwick. It was autumn, and\n` +
				`the soil was soft from rain, and the\n` +
				`sexton needed young arms because his\n` +
				`were failing.\n\n` +
				`I liked the work. That surprises people.\n` +
				`But there is a kindness in it — making\n` +
				`the last bed someone will ever need and\n` +
				`making it well. I smoothed the earth and\n` +
				`planted wildflowers above each grave,\n` +
				`though nobody asked me to.\n\n` +
				`It was the wildflowers that first\n` +
				`troubled me. I planted marigolds above\n` +
				`old Hessa's plot on a Tuesday. By\n` +
				`Thursday they were blooming — not the\n` +
				`ragged blooms of autumn flowers clinging\n` +
				`to warmth, but full summer blooms, golden\n` +
				`and perfect, as if someone had poured a\n` +
				`whole season into them overnight.\n\n` +
				`I told the sexton. He said the soil\n` +
				`was good. The soil was not that good.`,

			`I started staying late. I told myself\n` +
				`it was to tend the plots, but I was\n` +
				`watching. Waiting.\n\n` +
				`On the third night I saw it.\n\n` +
				`Not a ghost. I have seen ghosts — pale\n` +
				`things that don't know they're dead,\n` +
				`bumping against the walls of their old\n` +
				`houses like moths against glass. This\n` +
				`was nothing like that. This was a shape\n` +
				`at the edge of seeing, like heat rising\n` +
				`from summer stone. It moved between the\n` +
				`graves with purpose — pausing at each\n` +
				`one, bending low, making gestures I\n` +
				`couldn't read. The way a mother tucks\n` +
				`blankets around a sleeping child.\n\n` +
				`I should have been afraid. I wasn't.\n` +
				`There was something in the way it\n` +
				`moved — careful and worn, like old hands\n` +
				`doing familiar work. It tended the dead\n` +
				`the way I tended the earth: with a\n` +
				`gentleness that expected nothing.\n\n` +
				`That night I left my lantern burning\n` +
				`on the cemetery wall. I don't know why.\n` +
				`It felt right — the way leaving a candle\n` +
				`in the window feels right when someone\n` +
				`you love is still out in the dark.`,

			`It came every night. Always at dusk.\n` +
				`Always the same way — grave to grave,\n` +
				`pause, bend, those strange gentle\n` +
				`gestures, then on to the next.\n\n` +
				`I began talking to it. Small things —\n` +
				`the weather, the names of the newly\n` +
				`buried, which flowers I'd planted\n` +
				`where. It never answered. But I noticed\n` +
				`things. A fallen leaf placed on a\n` +
				`headstone, stem pointing east. Stones\n` +
				`arranged beside my lantern in patterns\n` +
				`I didn't understand — spirals, nested\n` +
				`circles, shapes that made my eyes ache\n` +
				`pleasantly, as if I were almost seeing\n` +
				`something beautiful.\n\n` +
				`Once I brought it bread. In the morning\n` +
				`the bread was untouched, but flowers\n` +
				`were growing from the cracks in the\n` +
				`stone where I had set it — tiny blue\n` +
				`flowers with petals like folded hands.\n\n` +
				`Whatever it was, it was not empty.\n` +
				`Scholars speak of hollow things that\n` +
				`wander old places, going through motions\n` +
				`without meaning. But there was meaning\n` +
				`here. Faded meaning, like a letter left\n` +
				`in the rain — the ink washed pale, but\n` +
				`the words still there if you held it\n` +
				`to the light.`,

			`One autumn night I fell asleep against\n` +
				`the cemetery wall. I dreamed.\n\n` +
				`I stood in a hall of black stone. Seven\n` +
				`thrones rose before me, carved from the\n` +
				`bedrock of the world. Seven figures sat\n` +
				`upon them, wearing faces that shifted\n` +
				`and shimmered — beautiful, holy. But\n` +
				`beneath each shining mask I glimpsed\n` +
				`another face. Cruel. Frightened. Small.\n\n` +
				`The thing from the cemetery stood\n` +
				`beside the last throne. It did not look\n` +
				`at the figure seated there. It stood\n` +
				`with its hands open and its head bowed,\n` +
				`as if the throne were empty — as if the\n` +
				`shining figure did not exist and had\n` +
				`never existed.\n\n` +
				`It turned to me. I felt what it\n` +
				`carried: a memory of warmth. Someone\n` +
				`had sat in that throne once. Someone\n` +
				`patient and kind, who guided every lost\n` +
				`soul home. That someone had given itself\n` +
				`away — poured its essence into the bones\n` +
				`of the world to keep it whole. And then\n` +
				`a stranger climbed up and sat down and\n` +
				`put on a beautiful face, and the world\n` +
				`called the stranger holy, and nobody\n` +
				`remembered the one who was gone.\n\n` +
				`Nobody except this thing. This faithful,\n` +
				`broken thing, still waiting for a master\n` +
				`who would never return.`,

			`I woke before dawn. The lantern had\n` +
				`burned to nothing. The cemetery was\n` +
				`empty. It never came back.\n\n` +
				`I dug graves in Ashwick for forty-seven\n` +
				`more years. Every evening I lit a fresh\n` +
				`lantern and set it on the wall. Every\n` +
				`morning I found it cold and dark.\n` +
				`No flowers grew from the stone. No\n` +
				`stones were arranged in patterns.\n\n` +
				`I am old now. My hands shake. But I\n` +
				`still walk to the cemetery at dusk and\n` +
				`light the lantern, and I stand there\n` +
				`and listen.\n\n` +
				`I have never told anyone what I\n` +
				`dreamed. I saw thrones. I saw masks.\n` +
				`I felt a grief so old it had worn\n` +
				`smooth, like river stone, all its\n` +
				`sharp edges polished away by centuries\n` +
				`of patient, pointless waiting.\n\n` +
				`I don't understand it. I don't need to.\n\n` +
				`I just light the lantern. Every night.\n` +
				`Because somewhere out there, something\n` +
				`is still looking for its way home.\n` +
				`And maybe a small light in the dark\n` +
				`is enough to remind it that someone\n` +
				`remembers.\n\n` +
				`Even if I don't know what\n` +
				`I'm remembering.`,
		],
	},

	// -----------------------------------------------------------------------
	// 11. The Seventh Warden's Report — Void Serpent / The Cage / Cover-up
	// -----------------------------------------------------------------------
	book_seventh_warden: {
		id: 'book_seventh_warden',
		name: "The Seventh Warden's Report",
		char: 'B',
		color: '#6655aa',
		type: 'book',
		description:
			"A thin sheaf of papers bound with wax cord. The handwriting is precise and small, as if the writer was accustomed to working in darkness.",
		pages: [
			`REPORT — LOWER SEAL SURVEY\n` +
				`Warden Designation: Seventh\n` +
				`Shaft: Nine, Eastern Descent\n` +
				`Cycle: 4,717th since Founding\n\n` +
				`Standard inspection of the first three\n` +
				`seal-stones. Structural integrity within\n` +
				`acceptable parameters. Luminance steady.\n` +
				`Harmonic resonance at expected frequency.\n\n` +
				`One anomaly. The grain of the second\n` +
				`seal-stone has shifted. Not cracked —\n` +
				`the stone remains whole. But the mineral\n` +
				`pattern within the rock has rearranged\n` +
				`itself into lines. Regular. Deliberate.\n` +
				`As though the stone were trying to write.\n\n` +
				`I recorded the pattern. It does not match\n` +
				`any known script. I will include a\n` +
				`transcription with this report, though\n` +
				`I cannot read it.\n\n` +
				`The third seal-stone is warm. Previous\n` +
				`surveys recorded it as cold. I have\n` +
				`marked this for follow-up and descended.`,

			`The fourth seal shows a hairline\n` +
				`fracture. I wish to be precise: it is\n` +
				`not broken. The seal holds. But there\n` +
				`is a crack no wider than a thread, and\n` +
				`through it comes warmth. Not heat —\n` +
				`warmth. The difference matters. Heat is\n` +
				`a property of energy. Warmth is a\n` +
				`property of presence.\n\n` +
				`Something on the other side of the seal\n` +
				`is aware of the crack.\n\n` +
				`I performed standard diagnostic rituals.\n` +
				`The results were normal in every respect\n` +
				`except one: the echo came back wrong.\n` +
				`When you sound a seal, it should return\n` +
				`your own resonance. This one returned\n` +
				`a question.\n\n` +
				`I do not know how to describe a question\n` +
				`that has no words. It was a feeling —\n` +
				`patient, vast, and very old — that\n` +
				`pressed against my mind the way a hand\n` +
				`presses against a closed door.\n\n` +
				`Do you know their names?\n\n` +
				`That is as close as I can render it.\n` +
				`I withdrew to the third seal-stone and\n` +
				`composed myself before continuing.`,

			`I returned to the second seal-stone on\n` +
				`my ascent. The grain pattern had changed.\n\n` +
				`Where before it showed symbols I could\n` +
				`not read, it now displayed seven words\n` +
				`in common script. Seven names.\n\n` +
				`I will not write them here. The Circle\n` +
				`will understand why when they read the\n` +
				`transcription I have appended to this\n` +
				`report under separate seal.\n\n` +
				`I will say only this: the names were\n` +
				`almost — but not quite — the names we\n` +
				`use in prayer. As if someone who knew\n` +
				`the true names was shouting them through\n` +
				`a wall, and the wall was changing the\n` +
				`sounds just enough to make them\n` +
				`unfamiliar.\n\n` +
				`Or as if the names we pray to are\n` +
				`themselves the distortion, and what the\n` +
				`stone wrote is closer to the truth.\n\n` +
				`I do not know which interpretation\n` +
				`is correct. I do not know which\n` +
				`I prefer.`,

			`RECOMMENDATION:\n\n` +
				`Reinforce all seals in Shaft Nine.\n` +
				`The hairline fracture in the fourth\n` +
				`stone requires immediate attention.\n\n` +
				`SECONDARY RECOMMENDATION:\n\n` +
				`I have served the Circle for thirty\n` +
				`years. I was taught that the Contained\n` +
				`is mindless — a force, not an\n` +
				`intelligence. A danger like fire or\n` +
				`flood, powerful but purposeless.\n\n` +
				`This is not accurate. The Contained\n` +
				`thinks. It remembers. It asked me a\n` +
				`question and wrote seven names and\n` +
				`waited for me to read them. Nothing\n` +
				`mindless waits.\n\n` +
				`I request a full review of our founding\n` +
				`documents. Someone told the first\n` +
				`Wardens that the Contained does not\n` +
				`think. I want to know who told them\n` +
				`this, and whether that person had\n` +
				`reason to want us incurious.\n\n` +
				`I am not afraid of what is beneath\n` +
				`the seal. I am afraid of how carefully\n` +
				`I was taught not to look at it.\n\n` +
				`    — Seventh Warden\n` +
				`    Report filed. Unanswered.`,
		],
	},

	// -----------------------------------------------------------------------
	// 12. The Seven Trees — Primordialist oral teaching / allegory
	// -----------------------------------------------------------------------
	book_seven_trees: {
		id: 'book_seven_trees',
		name: 'The Seven Trees',
		char: 'B',
		color: '#558844',
		type: 'book',
		description:
			'A scroll of birch bark, hand-painted with berry ink. The illustrations are crude but careful — the work of someone who valued meaning over artistry.',
		pages: [
			`A TEACHING OF THE ROOT SINGERS\n` +
				`(Told at the lighting of the winter fire)\n\n` +
				`Before the gods there were seven\n` +
				`trees. Do not ask me their names.\n` +
				`Names are for things that can be\n` +
				`held, and these were too vast\n` +
				`for holding.\n\n` +
				`Each tree carried a piece of what\n` +
				`the world needed. The first held\n` +
				`order — the pattern of snowflakes,\n` +
				`the turning of seasons, the promise\n` +
				`that morning follows night. The\n` +
				`second held change — the rot that\n` +
				`feeds new growth, the river that\n` +
				`carves new stone. The third held\n` +
				`time. The fourth held distance.\n` +
				`The fifth held the weight of every\n` +
				`stone. The sixth held the fire in\n` +
				`every star.\n\n` +
				`The seventh held something harder\n` +
				`to name. Call it awareness. Call it\n` +
				`the knowing that you exist. Every\n` +
				`soul that has ever opened its eyes\n` +
				`and thought "I am here" — that was\n` +
				`the seventh tree's gift.`,

			`The trees gave everything.\n\n` +
				`Not because they were asked. Not\n` +
				`because they were forced. Because\n` +
				`the world was new and fragile and\n` +
				`needed roots more than it needed\n` +
				`branches. So they poured themselves\n` +
				`into the earth — their roots became\n` +
				`the veins of the world, their sap\n` +
				`became the rivers, their leaves\n` +
				`became the souls of every living\n` +
				`thing.\n\n` +
				`The trees are gone now. But the old\n` +
				`ones say that if you press your ear\n` +
				`to the ground in a deep forest, at\n` +
				`the hour when the light is neither\n` +
				`day nor night, you can hear them\n` +
				`still — not as trees, but as\n` +
				`something beneath. A pulse. A\n` +
				`patience. A vast, slow, beautiful\n` +
				`sadness that has no name because\n` +
				`it is too large for language.\n\n` +
				`They did not die. They became\n` +
				`what holds us.`,

			`Seven stumps remained.\n\n` +
				`And one day, seven birds came.\n` +
				`They were bright and loud and\n` +
				`hungry. They had flown a long way\n` +
				`and they were tired of flying and\n` +
				`the stumps looked like thrones.\n\n` +
				`So they landed. And they opened\n` +
				`their beaks. And they sang the\n` +
				`trees' songs.\n\n` +
				`But the notes were wrong.\n\n` +
				`The forest knew. The rivers knew.\n` +
				`The roots beneath the earth — the\n` +
				`roots that were the trees — knew.\n` +
				`These birds had not grown here.\n` +
				`They had not given anything. They\n` +
				`had simply arrived, and sat down,\n` +
				`and begun to sing as if the songs\n` +
				`had always been theirs.\n\n` +
				`And because the birds were\n` +
				`beautiful, and their songs were\n` +
				`almost right, the smaller creatures\n` +
				`of the forest listened. And slowly,\n` +
				`slowly, they forgot there had ever\n` +
				`been trees at all.`,

			`But the roots remember.\n\n` +
				`Beneath every forest, beneath every\n` +
				`field, beneath the mountains and the\n` +
				`deserts and the quiet places where\n` +
				`no one walks — the roots are still\n` +
				`there. Still holding the world\n` +
				`together. Still carrying the pulse\n` +
				`of what was given freely by seven\n` +
				`vast and patient things that loved\n` +
				`the world enough to become it.\n\n` +
				`The birds still sing. Their songs\n` +
				`are loud. But if you are quiet —\n` +
				`truly quiet — you will hear\n` +
				`something beneath the singing.\n` +
				`Not a sound. A feeling. The feeling\n` +
				`of being held by something that has\n` +
				`never stopped caring, even though\n` +
				`it was forgotten, even though\n` +
				`strangers sit on its stumps and\n` +
				`call themselves the forest.\n\n` +
				`This is what we teach our children,\n` +
				`at the lighting of the winter fire.\n` +
				`This is what we pass from mouth to\n` +
				`ear, because some truths are too\n` +
				`important for paper and too\n` +
				`dangerous for temples.\n\n` +
				`The birds will sing until they are\n` +
				`hoarse. But the roots will outlast\n` +
				`them. The roots always do.`,
		],
	},

	// -----------------------------------------------------------------------
	// 13. Nights at the Silver Oak — Dreamweavers / Aelith's flood
	// -----------------------------------------------------------------------
	book_silver_oak: {
		id: 'book_silver_oak',
		name: 'Nights at the Silver Oak',
		char: 'B',
		color: '#99aacc',
		type: 'book',
		description:
			'A small notebook with a dried leaf pressed into the cover. Several pages have been torn out.',
		pages: [
			`I keep these notes because the dreams\n` +
				`are getting strange and I want to know\n` +
				`if I am losing my mind.\n\n` +
				`I am a shepherd. I graze my flock on\n` +
				`the hill above Mirren's Cross where an\n` +
				`old oak stands alone. The bark is\n` +
				`silver-white and the leaves catch light\n` +
				`in ways that make no sense — green in\n` +
				`sunshine, gold in shadow. It is a good\n` +
				`tree for shade and I have slept beneath\n` +
				`it many times.\n\n` +
				`Three weeks ago the dreams began. At\n` +
				`first: colors without shape. The feeling\n` +
				`of being watched by something patient.\n` +
				`I would wake rested but with the sense\n` +
				`that I had been somewhere very far away.\n\n` +
				`Then the colors became images. A vast\n` +
				`dark space. Threads of faint light\n` +
				`stretching in every direction, fine as\n` +
				`spider silk, each one trembling with\n` +
				`the pulse of a sleeping mind. Something\n` +
				`moved among the threads. Something\n` +
				`careful. Something that was making\n` +
				`something beautiful.`,

			`The thing in the dark is not a ghost.\n` +
				`It is not a god. I have prayed to the\n` +
				`gods and this is nothing like praying.\n` +
				`Praying feels like shouting up. This\n` +
				`feels like sinking down — into a quiet\n` +
				`place beneath everything, where the\n` +
				`world hums in its sleep.\n\n` +
				`It does not speak. It shows.\n\n` +
				`Last night it showed me what it was.\n` +
				`I saw hundreds of them, moving through\n` +
				`the dark like fish through deep water,\n` +
				`each one trailing light from their\n` +
				`fingers. They were weaving. Every\n` +
				`thread was a dreamer's mind, and the\n` +
				`weavers connected them — this sleeper's\n` +
				`hope to that sleeper's memory, this\n` +
				`child's nightmare gently unknotted and\n` +
				`rewoven into something kinder.\n\n` +
				`They tended the world's sleep the way\n` +
				`I tend my flock. With patience. With\n` +
				`attention. With a gentleness I\n` +
				`recognized because it is the same\n` +
				`gentleness I use when a lamb won't\n` +
				`settle.\n\n` +
				`They were beautiful. I woke with tears\n` +
				`on my face and did not know why.`,

			`It showed me what happened to them.\n\n` +
				`A flood. Not water — something worse.\n` +
				`Something sweet. A vast wave of warmth\n` +
				`that crashed through the dreaming dark\n` +
				`like honey poured into a clear stream.\n` +
				`It was love — or what called itself\n` +
				`love — but too much, too loud, too\n` +
				`bright. It drowned the delicate threads.\n` +
				`It dissolved the weavers like salt in\n` +
				`hot water.\n\n` +
				`Hundreds of them. Gone in a single\n` +
				`terrible moment of sweetness.\n\n` +
				`A few survived. They fled downward,\n` +
				`into the deepest layers of sleep,\n` +
				`where even the flood could not reach.\n` +
				`They have been there ever since.\n` +
				`Alone. Weaving in the dark with no\n` +
				`threads to weave. Going through the\n` +
				`motions of tending a world that can\n` +
				`no longer feel their hands.\n\n` +
				`The one beneath my oak is the last,\n` +
				`I think. It reached up through the\n` +
				`roots because it felt me sleeping\n` +
				`above it and it remembered — dimly,\n` +
				`the way you remember a word in a\n` +
				`language you spoke as a child — what\n` +
				`it was like to tend a dreamer's mind.`,

			`I went back one last time.\n\n` +
				`I lay beneath the silver oak and I\n` +
				`did not fight the dream. I let it\n` +
				`take me down, past the colors, past\n` +
				`the dark, to the place where the\n` +
				`last weaver works.\n\n` +
				`It showed me the world as it was when\n` +
				`the tapestry was whole. Every sleeping\n` +
				`mind connected. Every dream a thread\n` +
				`in a web so vast and so delicate that\n` +
				`seeing it was like hearing music made\n` +
				`of starlight. I am a shepherd who has\n` +
				`seen ten thousand sunrises and I tell\n` +
				`you none of them came close.\n\n` +
				`Then it was gone. And I was awake.\n` +
				`And the oak was warm against my back,\n` +
				`and its leaves glowed faintly, and\n` +
				`I knew that something small had been\n` +
				`repaired by the seeing of it.\n\n` +
				`I think it needed to be seen. Not\n` +
				`understood — just seen. The way a\n` +
				`candle needs a window. Not to light\n` +
				`the whole dark, but to prove the\n` +
				`dark isn't everything.\n\n` +
				`I am a shepherd. I know nothing of\n` +
				`gods or magic or old things in the\n` +
				`deep. But I know what it looks like\n` +
				`when something has been alone too\n` +
				`long. And I know what it costs\n` +
				`nothing to give.`,
		],
	},

	// -----------------------------------------------------------------------
	// 14. A Grandmother's Cures — Blood Singers / anti-divine magic
	// -----------------------------------------------------------------------
	book_grandmothers_cures: {
		id: 'book_grandmothers_cures',
		name: "A Grandmother's Cures",
		char: 'B',
		color: '#aa6644',
		type: 'book',
		description:
			"A stained recipe book with a cracked spine. It smells of rosemary and iron.",
		pages: [
			`FOR MY GRANDDAUGHTER\n` +
				`when she is old enough to understand\n\n` +
				`FEVER TEA\n` +
				`Boil moonpetal and silverroot in\n` +
				`clean water until the steam smells\n` +
				`sweet. Let it cool until you can\n` +
				`hold the cup without flinching.\n` +
				`Before you give it to the child,\n` +
				`prick your thumb and let three drops\n` +
				`fall into the tea. Press your hand\n` +
				`to the cup and think of warmth.\n` +
				`The tea will do the rest.\n\n` +
				`WOUND PASTE\n` +
				`Crush thornberry and witchgrass\n` +
				`into a paste with river clay. Spread\n` +
				`it thick on the cut. Then press your\n` +
				`palm flat against it and hold still.\n` +
				`You will feel a pull — a small\n` +
				`tiredness, as if you had walked a\n` +
				`long way. That is the healing. It\n` +
				`comes from you. Do not be afraid of\n` +
				`it. It is yours to give.\n\n` +
				`BONE-MEND BROTH\n` +
				`Simmer marrow bones with ashbloom\n` +
				`petal and salt. When the child drinks,\n` +
				`hold their broken limb and hum. Any\n` +
				`tune. The song does not matter. What\n` +
				`matters is your breath and your blood\n` +
				`moving together, carrying your intent\n` +
				`into them. You will be tired after.\n` +
				`Eat well. Sleep long. You have given\n` +
				`something of yourself.`,

			`You will notice, child, that none of\n` +
				`these remedies ask you to pray.\n\n` +
				`This is not an accident.\n\n` +
				`The warmth you feel leaving you and\n` +
				`entering the sick — that is life.\n` +
				`Your life, freely given, passed to\n` +
				`another. It is the oldest medicine\n` +
				`there is. Older than temples. Older\n` +
				`than hymns. Older than the gods\n` +
				`themselves, though they would rather\n` +
				`you did not know that.\n\n` +
				`Your blood knew how to heal before\n` +
				`any god taught any priest to pray.\n` +
				`The body remembers what the temples\n` +
				`have forgotten — that you carry a\n` +
				`river inside you, and that river\n` +
				`connects to every river in every\n` +
				`living thing, and no one owns the\n` +
				`current. No one grants it. No one\n` +
				`can take it away.\n\n` +
				`The priests will tell you healing\n` +
				`must come from above. They are not\n` +
				`lying — they believe it. But they\n` +
				`are wrong. Healing comes from\n` +
				`beside. From one living thing\n` +
				`reaching toward another and saying:\n` +
				`here. Take what you need. I have\n` +
				`enough.`,

			`SNAKEBITE CURE\n` +
				`(for when the temple healers have\n` +
				` failed or are too far away)\n\n` +
				`Cut the wound open. Press your mouth\n` +
				`to it. Draw the venom with your\n` +
				`breath — but do not swallow. Spit\n` +
				`it into the fire. Then cut your own\n` +
				`palm and press it to the wound, blood\n` +
				`to blood, and push.\n\n` +
				`This will cost you. More than the\n` +
				`fever tea. More than the wound paste.\n` +
				`You will be dizzy afterward. You may\n` +
				`faint. Your hair may grey at the\n` +
				`temples. You are giving months of\n` +
				`your life to buy back theirs.\n\n` +
				`I have done this eleven times. I am\n` +
				`fifty-three and I look seventy. My\n` +
				`hands shake. My joints ache in the\n` +
				`cold. Every morning I feel the weight\n` +
				`of the years I gave away.\n\n` +
				`But every tremor is a child who\n` +
				`breathed when they should not have.\n` +
				`I do not regret a single drop.`,

			`They will come for you.\n\n` +
				`The ones in white robes with golden\n` +
				`suns on their chests. They will call\n` +
				`you witch. Heretic. Demon-touched.\n` +
				`They will say your healing is an\n` +
				`abomination because it does not flow\n` +
				`through the proper channels — their\n` +
				`channels, their gods, their hands.\n\n` +
				`Remember this: they cannot do what\n` +
				`you do. Their prayers go up and\n` +
				`sometimes an answer comes down, and\n` +
				`sometimes it doesn't. Your healing\n` +
				`goes from your heart to theirs, and\n` +
				`it always works, because it is yours\n` +
				`to give.\n\n` +
				`No god stands between your blood and\n` +
				`their need. That is why they fear\n` +
				`you. Not because you are dangerous —\n` +
				`but because you do not need them.\n` +
				`And nothing frightens a throne more\n` +
				`than being unnecessary.\n\n` +
				`Now go. Heal quietly. Charge nothing.\n` +
				`And when they ask how you did it,\n` +
				`smile and say it was prayer.\n` +
				`Let them have their pride.\n` +
				`We have our children, alive and\n` +
				`breathing, and that is enough.`,
		],
	},

	// -----------------------------------------------------------------------
	// 15. A Letter Never Sent — Twilight Courts / Spirit Membrane
	// -----------------------------------------------------------------------
	book_letter_never_sent: {
		id: 'book_letter_never_sent',
		name: 'A Letter Never Sent',
		char: 'B',
		color: '#9977aa',
		type: 'book',
		description:
			'A letter written on paper that shimmers between opaque and translucent. The ink appears and disappears as you tilt the page.',
		pages: [
			`My love,\n\n` +
				`You are sitting by the fire as I\n` +
				`write this, except you are not\n` +
				`reading it, because I cannot send\n` +
				`it. I am standing in the doorway\n` +
				`watching you, except you cannot\n` +
				`see me, because I am no longer\n` +
				`solid enough to be seen.\n\n` +
				`Our people called it the dimming.\n` +
				`It began years ago — a thinning\n` +
				`at the edges, like fog burning off\n` +
				`at dawn. Some mornings I wake and\n` +
				`I am here, fully, and I can touch\n` +
				`things and be heard and cast a\n` +
				`shadow. Other mornings my hand\n` +
				`passes through the cup I reach\n` +
				`for, and my voice does not carry,\n` +
				`and I stand in the kitchen saying\n` +
				`good morning to someone who does\n` +
				`not know I am there.\n\n` +
				`Our city is disappearing. The\n` +
				`buildings flicker — stone one\n` +
				`moment, starlight the next.\n` +
				`Children cry because they cannot\n` +
				`hold their mothers' hands.`,

			`We lived in two worlds once. That\n` +
				`was the beauty of us — one foot\n` +
				`in your world of bread and iron,\n` +
				`one foot in the quiet world\n` +
				`beneath, where the dead walk softly\n` +
				`and the old memories drift like\n` +
				`leaves on still water.\n\n` +
				`We built our homes on the seam\n` +
				`between. A door in our house\n` +
				`might open onto your market square\n` +
				`or onto a garden that exists only\n` +
				`in the hush. We walked both roads.\n` +
				`We spoke to the living and the\n` +
				`gone and we kept the peace between\n` +
				`them.\n\n` +
				`Then something changed. Something\n` +
				`pressed down on the veil between\n` +
				`the worlds — slowly, steadily,\n` +
				`the way a hand presses a pillow\n` +
				`over a sleeping face. The seam\n` +
				`grew thick. The doors grew heavy.\n` +
				`The quiet world pulled away from\n` +
				`yours like a tide retreating, and\n` +
				`we were caught between — too real\n` +
				`for one world, too faint for the\n` +
				`other.\n\n` +
				`Whoever did this did not do it\n` +
				`to hurt us. I am sure of that.\n` +
				`We were not the target. We were\n` +
				`simply in the way.`,

			`I have been watching you for\n` +
				`months now. You do not know.\n\n` +
				`I watch you cook. I watch you\n` +
				`read the book of poems I gave\n` +
				`you when I was still solid enough\n` +
				`to give. You smile at the line\n` +
				`I marked — the one about the\n` +
				`river and the stone — and I try\n` +
				`to say I marked it for you,\n` +
				`and my voice is smoke, and you\n` +
				`turn the page.\n\n` +
				`I try to touch your hair. My\n` +
				`fingers pass through like wind.\n` +
				`You shiver and pull your shawl\n` +
				`tighter and say to yourself,\n` +
				`"The draft again," and I am\n` +
				`standing right beside you with\n` +
				`my hand where your cheek was\n` +
				`and I cannot tell you that\n` +
				`there is no draft.\n\n` +
				`I am not dying. That would be\n` +
				`simpler. I am dimming. I am still\n` +
				`here. I can still see you. I\n` +
				`can still hear your voice. I\n` +
				`just cannot answer.`,

			`I will leave this letter on the\n` +
				`table. Perhaps your hand will\n` +
				`pass through it. Perhaps mine\n` +
				`will pass through the table.\n` +
				`Perhaps, for one moment, the\n` +
				`veil will thin and you will feel\n` +
				`the weight of a page written by\n` +
				`someone who stood beside you\n` +
				`every day and could not be seen.\n\n` +
				`If you feel a chill at your\n` +
				`shoulder sometimes, on evenings\n` +
				`when the light is neither day\n` +
				`nor night — that is me. Still\n` +
				`standing in the doorway. Still\n` +
				`watching. Still trying to say\n` +
				`good morning.\n\n` +
				`I love you. I have always loved\n` +
				`you. And I am still here, even\n` +
				`if here has become a place you\n` +
				`cannot reach.\n\n` +
				`What else is love, if not the\n` +
				`things we do knowing they may\n` +
				`never be received?\n\n` +
				`Yours, from the flickering side\n` +
				`of the world,\n\n` +
				`    — E.`,
		],
	},

	// -----------------------------------------------------------------------
	// 16. Shaft Twelve: A Record — The Architects / dormant living mountains
	// -----------------------------------------------------------------------
	book_shaft_twelve: {
		id: 'book_shaft_twelve',
		name: 'Shaft Twelve: A Record',
		char: 'B',
		color: '#887766',
		type: 'book',
		description:
			'A water-stained logbook with mining company stamps on the cover. The final pages are blank, as if the writers simply stopped coming.',
		pages: [
			`SHAFT TWELVE — COMPANY RECORD\n` +
				`Aetherton Mining Concern\n\n` +
				`Day 1. Standard excavation. Granite\n` +
				`with quartz veining. Good progress,\n` +
				`four yards.\n\n` +
				`Day 4. Hit a hollow behind the rock\n` +
				`face. Not a cave — the walls are too\n` +
				`smooth, too regular. Natural formation\n` +
				`doesn't make right angles. Broke\n` +
				`through into a chamber roughly thirty\n` +
				`paces across. Walls are warm to the\n` +
				`touch.\n` +
				`    — Henryk, lead pick\n\n` +
				`Day 6. The chamber connects to others.\n` +
				`Passages curve away in both directions,\n` +
				`smooth-walled, gently sloping downward.\n` +
				`The cross-section is oval, not round.\n` +
				`Torchlight reflects strangely — the\n` +
				`stone has a grain to it. Like wood.\n` +
				`Like muscle.\n\n` +
				`Day 8. Torben says the walls feel like\n` +
				`they're humming. Nobody else can feel\n` +
				`it. We told him to drink less. He\n` +
				`wasn't drinking.`,

			`Day 12. Found a structure at the\n` +
				`junction of two passages. I lack the\n` +
				`vocabulary. It is taller than a\n` +
				`chapel. It is made of stone but shaped\n` +
				`like no masonry I have seen. There are\n` +
				`openings that resemble valves — great\n` +
				`stone flaps that hang closed but could,\n` +
				`I think, open. And channels running\n` +
				`from it in every direction, vanishing\n` +
				`into the walls.\n\n` +
				`Maren says it looks like a pump. I\n` +
				`asked her: a pump for what? She\n` +
				`didn't answer. She just put her hand\n` +
				`on it and stood there a long time.\n` +
				`Then she said: "It's not broken.\n` +
				`It's sleeping."\n\n` +
				`Day 14. The passages go deeper than\n` +
				`we can map. We've walked for hours\n` +
				`and found no end. The walls grow\n` +
				`warmer the further we descend. The\n` +
				`air smells of something old — not\n` +
				`decay, not dust. Something alive that\n` +
				`has been still for a very long time.\n` +
				`    — Foreman Aldric, shift lead`,

			`Day 18. The walls move.\n\n` +
				`I need to be precise. Once every few\n` +
				`hours, the passage narrows by a\n` +
				`hand's width, then widens again.\n` +
				`Slowly. Over the course of thirty or\n` +
				`forty heartbeats. If you are not\n` +
				`watching, you would miss it. If you\n` +
				`are watching, you wish you had not.\n\n` +
				`Day 20. Henryk went deeper than the\n` +
				`rest of us. Alone. He came back pale\n` +
				`and quiet and would not speak for an\n` +
				`hour. Then he said: "There's a\n` +
				`chamber. Bigger than anything. The\n` +
				`walls pulse. Like a heartbeat. The\n` +
				`whole mountain has a heartbeat."\n\n` +
				`I ordered Shaft Twelve sealed.\n\n` +
				`Day 21. Official reason for closure:\n` +
				`structural instability. Actual reason:\n` +
				`the mountain moved. Not a quake — I\n` +
				`have felt quakes. This was deliberate.\n` +
				`The stone shifted around us the way a\n` +
				`sleeping animal adjusts its weight.\n` +
				`Slowly. Carefully. As if trying not\n` +
				`to wake itself.\n` +
				`    — Foreman Aldric`,

			`Day 23. (Unauthorized entry.)\n\n` +
				`I went back. Alone. At night. I know\n` +
				`I should not have. But I could not\n` +
				`stop thinking about the heartbeat.\n\n` +
				`I found the chamber Henryk described.\n` +
				`It is vast. The ceiling is beyond\n` +
				`torchlight. The walls pulse — slow,\n` +
				`steady, ancient. I pressed my hand\n` +
				`to the stone and it was warm and\n` +
				`alive and I felt it notice me. Not\n` +
				`hostile. Not afraid. Curious. The\n` +
				`way a sleeping creature notices a\n` +
				`sound — barely, distantly, from\n` +
				`very far inside a dream.\n\n` +
				`This mountain is not a mountain. I\n` +
				`do not know what it is. But it is\n` +
				`dreaming, and it has been dreaming\n` +
				`for longer than I have words to\n` +
				`describe, and whatever it dreams of,\n` +
				`it dreams patiently, the way only\n` +
				`something truly vast can be patient.\n\n` +
				`I sealed the entrance behind me.\n` +
				`Some doors should stay closed. Not\n` +
				`because what's behind them is\n` +
				`dangerous — but because some things\n` +
				`deserve to sleep undisturbed.\n\n` +
				`    — Henryk\n` +
				`    (no further entries)`,
		],
	},

	// -----------------------------------------------------------------------
	// 17. On the Migration of Griefmoths — ecology reveals the cover-up
	// -----------------------------------------------------------------------
	book_griefmoths: {
		id: 'book_griefmoths',
		name: 'On the Migration of Griefmoths',
		char: 'B',
		color: '#aabbdd',
		type: 'book',
		description:
			'A leather-bound field journal with moth-wing specimens pressed between the pages. The margins are filled with maps and coordinates.',
		pages: [
			`ON THE MIGRATION OF GRIEFMOTHS\n` +
				`Field Notes — Yara Denn,\n` +
				`Natural Philosopher\n\n` +
				`The griefmoth (Lacrimosa lepidoptera)\n` +
				`is common enough to be unremarkable.\n` +
				`Wings patterned like teardrops. Soft\n` +
				`blue-white luminescence. Wingbeats\n` +
				`that produce a sound like distant\n` +
				`weeping — not true weeping, but close\n` +
				`enough to unsettle those who hear it\n` +
				`after dark.\n\n` +
				`They gather at graveyards, battlefields,\n` +
				`and houses where someone has recently\n` +
				`died. This is well known. What is less\n` +
				`known — what five years of careful\n` +
				`mapping has shown me — is that their\n` +
				`densest colonies do not correspond to\n` +
				`known sites of death or mourning.\n\n` +
				`The moths swarm thickest in places\n` +
				`where the histories record nothing\n` +
				`at all.\n\n` +
				`This was my first clue that something\n` +
				`was wrong with the histories.`,

			`THREE ANOMALOUS SITES\n\n` +
				`Site One: An empty field outside\n` +
				`Garen's Rest. No battle recorded. No\n` +
				`cemetery. Just grass. But on summer\n` +
				`nights the moths swarm so thick the\n` +
				`air glows blue. An old woman told me\n` +
				`her grandmother warned her to avoid\n` +
				`the field because "the ground weeps\n` +
				`after rain." I dug. I found foundation\n` +
				`stones, pottery, iron nails — the\n` +
				`remains of a settlement. Hundreds\n` +
				`lived there. No record of them exists.\n\n` +
				`Site Two: A stretch of coastline where\n` +
				`the moths are so numerous they blot\n` +
				`out the stars. Fishermen avoid it.\n` +
				`They say the water tastes of salt and\n` +
				`sorrow. I found stone foundations\n` +
				`beneath the surf — streets, walls,\n` +
				`a market square, all drowned. A city\n` +
				`erased from every map.\n\n` +
				`Site Three: A quiet valley in the\n` +
				`Thornlands. Wild thornbrush and\n` +
				`birdsong. Beautiful. Peaceful. I\n` +
				`followed the moths to a hillside\n` +
				`and found mass graves. Hundreds of\n` +
				`bodies. Centuries old. No record of\n` +
				`who they were or what killed them.`,

			`THE PATTERN\n\n` +
				`Every griefmoth colony marks a wound.\n` +
				`Not a wound in the earth — a wound\n` +
				`in memory. These are places where\n` +
				`grief was never expressed. Where\n` +
				`people died and no one was allowed\n` +
				`to mourn them. Where the sorrow was\n` +
				`cut short, silenced, erased before\n` +
				`anyone could weep.\n\n` +
				`The moths come to weep in their\n` +
				`place.\n\n` +
				`I have mapped forty-three sites.\n` +
				`Forty-three places where the\n` +
				`histories say nothing happened and\n` +
				`the moths say otherwise. Thousands\n` +
				`of dead. Settlements, villages,\n` +
				`a city — all scrubbed from the\n` +
				`records as if they never existed.\n\n` +
				`Something is erasing tragedies\n` +
				`from our history. Systematically.\n` +
				`Thoroughly. For a very long time.\n\n` +
				`The moths are the only mourners\n` +
				`these dead have ever had.`,

			`I attempted to publish my findings.\n` +
				`My manuscript was rejected by three\n` +
				`universities. My maps were requested\n` +
				`by the Church "for safekeeping" — I\n` +
				`sent copies and kept the originals.\n` +
				`A colleague took me aside and said:\n` +
				`"Certain people do not want a map\n` +
				`of forgotten tragedies. Forgetting\n` +
				`is the point."\n\n` +
				`I have been told to stop. I have\n` +
				`been told my research is inflammatory.\n` +
				`I have been told that empty fields\n` +
				`are empty because nothing happened\n` +
				`there, and that moths are moths and\n` +
				`their behavior means nothing.\n\n` +
				`But I have held a griefmoth in my\n` +
				`hands. I have felt the vibration of\n` +
				`its wings — that soft, persistent\n` +
				`weeping that is not its own. It\n` +
				`weeps for others. It carries grief\n` +
				`that no living soul was allowed to\n` +
				`express, on wings too fragile for\n` +
				`the weight they bear.\n\n` +
				`I will not stop. One day, when\n` +
				`someone asks what happened in those\n` +
				`quiet fields, the moths will still\n` +
				`be there — patient, luminous,\n` +
				`faithful — counting the dead that\n` +
				`no one else will count.`,
		],
	},

	// -----------------------------------------------------------------------
	// 18. The Hill That Walked — Stone Turtles / Shapers / Ley Lines
	// -----------------------------------------------------------------------
	book_hill_walked: {
		id: 'book_hill_walked',
		name: 'The Hill That Walked',
		char: 'B',
		color: '#77aa77',
		type: 'book',
		description:
			"A traveler's memoir written on miscellaneous paper — receipts, napkins, and one page of fine vellum. The handwriting is cheerful and unsteady.",
		pages: [
			`THE HILL THAT WALKED\n` +
				`Being a True Account by Pol Kettner,\n` +
				`Tinker, of Something He Cannot Explain\n\n` +
				`I made camp on a fine flat hilltop\n` +
				`east of Barren's Crossing. Good grass.\n` +
				`A few trees. Nice view of the valley.\n` +
				`I slept well and woke to find the\n` +
				`view had changed.\n\n` +
				`Not dramatically. Just — the barn\n` +
				`that had been to my left was now\n` +
				`behind me. The river was closer. I\n` +
				`checked my compass. According to the\n` +
				`needle, I had moved two hundred yards\n` +
				`east in the night.\n\n` +
				`I looked at the hill. The hill looked\n` +
				`innocent.\n\n` +
				`I made camp again. In the morning I\n` +
				`had moved again. Same direction. Same\n` +
				`distance. I stayed up the third night\n` +
				`and watched. Nothing seemed to move.\n` +
				`But at dawn, the landmarks had\n` +
				`shifted. The hill was walking, and it\n` +
				`was walking so slowly that watching\n` +
				`could not catch it.`,

			`On the fourth day I looked more\n` +
				`carefully. The trees on the hilltop\n` +
				`had different moss on their north\n` +
				`sides than the trees on the ground.\n` +
				`The boulders near the summit had a\n` +
				`grain to them — curved, layered,\n` +
				`like the plates of a shell. And\n` +
				`the dark hollow at the hill's base\n` +
				`that I had taken for a shallow cave\n` +
				`was not a cave.\n\n` +
				`It blinked.\n\n` +
				`The hill blinked at me.\n\n` +
				`I should have run. I did not. There\n` +
				`was something about the way it moved\n` +
				`— patient, gentle, careful not to\n` +
				`crush the grass beneath itself more\n` +
				`than necessary. Whatever this thing\n` +
				`was, it was not in a hurry. It was\n` +
				`going somewhere it had been going\n` +
				`for a very long time, and my little\n` +
				`camp on its back was of no more\n` +
				`concern to it than a sparrow on\n` +
				`a cathedral.`,

			`I walked beside it for a week. I\n` +
				`am a tinker. I had nowhere pressing\n` +
				`to be.\n\n` +
				`It followed a path — an ancient\n` +
				`track marked by standing stones so\n` +
				`old they had sunk into the earth\n` +
				`like teeth into a jaw. The path\n` +
				`followed something I could feel\n` +
				`but not see: a warmth in the ground,\n` +
				`a faint humming, a sense of something\n` +
				`flowing beneath the way a river\n` +
				`flows beneath winter ice.\n\n` +
				`I am no scholar. I could not tell\n` +
				`you what flows beneath the earth.\n` +
				`But I can tell you that this hill\n` +
				`knows where it is going, and it has\n` +
				`been going there for longer than I\n` +
				`can imagine, and whatever task it is\n` +
				`performing, it performs it with the\n` +
				`steady devotion of a creature that\n` +
				`has never once considered stopping.`,

			`I parted ways with the hill on the\n` +
				`seventh day. I left a gift — an\n` +
				`apple from my pack, placed on the\n` +
				`mossy shoulder between two stones.\n` +
				`The hill paused. The trees on its\n` +
				`back rustled though there was no\n` +
				`wind. The apple rolled gently into\n` +
				`a hollow and stayed.\n\n` +
				`I choose to believe it accepted\n` +
				`my gift. I have no proof. I am a\n` +
				`tinker, not a philosopher. But I\n` +
				`walked beside something older than\n` +
				`language for seven days, and I will\n` +
				`tell you this:\n\n` +
				`The world is held together by things\n` +
				`we step on without noticing. The\n` +
				`roots beneath our feet. The rivers\n` +
				`we cross without thanking. The hills\n` +
				`that walk when no one is watching,\n` +
				`tending a world that has forgotten\n` +
				`them.\n\n` +
				`We build temples to gods who sit on\n` +
				`thrones. Perhaps we should build\n` +
				`them to the things that carry us\n` +
				`instead.`,
		],
	},
};

export function getBookById(id: string): Item | undefined {
	return BOOK_CATALOG[id];
}

export function getAllBookIds(): string[] {
	return Object.keys(BOOK_CATALOG);
}
