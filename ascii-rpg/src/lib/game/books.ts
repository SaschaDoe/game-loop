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
};

export function getBookById(id: string): Item | undefined {
	return BOOK_CATALOG[id];
}

export function getAllBookIds(): string[] {
	return Object.keys(BOOK_CATALOG);
}
