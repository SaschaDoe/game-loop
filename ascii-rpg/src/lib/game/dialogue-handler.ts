import type { GameState, Entity, CharacterClass, CharacterRace, NPC, NPCMood, DialogueContext, DialogueCondition, SocialSkill, SocialCheck } from './types';
import { addMessage, handlePlayerDeath, relocateNpc } from './engine-utils';
import { getEffectiveAttitude, getRaceFlavorLine } from './races';
import { revealOverworldArea } from './overworld-handler';
import { learnRitual } from './spell-handler';
import { SPELL_CATALOG } from './spells';
import { acceptQuest, completeQuest } from './quests';
import { enrollAtAcademy, completeLesson, completeTeachingSession, getAcademyDay, isLessonReady, allLessonsComplete } from './academy';
import type { WorldMap } from './overworld';

export function buildDialogueContext(state: GameState, npcMood: NPCMood = 'neutral', npc?: NPC): DialogueContext {
	// Compute effective race attitude from NPC base attitude + player-driven shifts
	let raceAttitude: Record<CharacterRace, number> = { elf: 0, dwarf: 0, human: 0 };
	if (npc?.raceAttitude) {
		const shifts = state.npcAttitudeShifts;
		raceAttitude = {
			elf: Math.max(-5, Math.min(5, (npc.raceAttitude.elf ?? 0) + (shifts[npc.name]?.elf ?? 0))),
			dwarf: Math.max(-5, Math.min(5, (npc.raceAttitude.dwarf ?? 0) + (shifts[npc.name]?.dwarf ?? 0))),
			human: Math.max(-5, Math.min(5, (npc.raceAttitude.human ?? 0) + (shifts[npc.name]?.human ?? 0))),
		};
	}
	return {
		dungeonLevel: state.level,
		characterLevel: state.characterLevel,
		characterClass: state.characterConfig.characterClass,
		hpPercent: Math.round((state.player.hp / state.player.maxHp) * 100),
		enemyCount: state.enemies.length,
		rumorCount: state.rumors.length,
		rumorIds: state.rumors.map(r => r.id),
		storyCount: state.heardStories.length,
		knownLanguages: state.knownLanguages,
		playerName: state.player.name,
		npcMood,
		lieCount: state.lieCount,
		enemiesKilled: state.stats.enemiesKilled,
		bossesKilled: state.stats.bossesKilled,
		secretsFound: state.stats.secretsFound,
		trapsDisarmed: state.stats.trapsDisarmed,
		chestsOpened: state.stats.chestsOpened,
		levelsCleared: state.stats.levelsCleared,
		maxDungeonLevel: state.stats.maxDungeonLevel,
		startingLocation: state.characterConfig.startingLocation,
		playerTitles: state.playerTitles,
		academyEnrolled: state.academyState?.enrolled ?? false,
		academyGraduated: state.academyState?.graduated ?? false,
		academyDay: getAcademyDay(state),
		academyLessonReady: isLessonReady(state),
		academyAllLessonsComplete: allLessonsComplete(state),
		lessonsCompleted: state.academyState?.lessonsCompleted ?? [],
		academyExamTaken: state.academyState?.examTaken ?? false,
		learnedSpells: state.learnedSpells,
		learnedRituals: state.learnedRituals,
		activeQuestIds: state.quests.filter(q => q.status === 'active').map(q => q.id),
		completedQuestIds: state.completedQuestIds,
		playerRace: state.playerRace,
		raceAttitude,
	};
}

export function checkCondition(cond: DialogueCondition, ctx: DialogueContext): boolean {
	switch (cond.type) {
		case 'minLevel': return ctx.dungeonLevel >= cond.value;
		case 'maxLevel': return ctx.dungeonLevel <= cond.value;
		case 'class': return ctx.characterClass === cond.value;
		case 'notClass': return ctx.characterClass !== cond.value;
		case 'hpBelow': return ctx.hpPercent < cond.value;
		case 'knowsLanguage': return ctx.knownLanguages.includes(cond.value);
		case 'hasRumors': return ctx.rumorCount >= cond.value;
		case 'hasStories': return ctx.storyCount >= cond.value;
		case 'minCharLevel': return ctx.characterLevel >= cond.value;
		case 'npcMood': return ctx.npcMood === cond.value;
		case 'knownLiar': return ctx.lieCount >= cond.value;
		case 'minEnemiesKilled': return ctx.enemiesKilled >= cond.value;
		case 'hasBossKills': return ctx.bossesKilled >= cond.value;
		case 'minSecretsFound': return ctx.secretsFound >= cond.value;
		case 'hasRumor': return ctx.rumorIds.includes(cond.value);
		case 'minChestsOpened': return ctx.chestsOpened >= cond.value;
		case 'startingLocation': return ctx.startingLocation === cond.value;
		case 'minLevelsCleared': return ctx.levelsCleared >= cond.value;
		case 'hasTitle': return ctx.playerTitles.includes(cond.value);
		case 'academyEnrolled': return ctx.academyEnrolled;
		case 'academyGraduated': return ctx.academyGraduated;
		case 'academyDay': return ctx.academyDay >= cond.value;
		case 'academyLessonReady': return ctx.academyLessonReady;
		case 'academyAllLessonsComplete': return ctx.academyAllLessonsComplete;
		case 'lessonCompleted': return ctx.lessonsCompleted.includes(cond.value);
		case 'lessonNotCompleted': return !ctx.lessonsCompleted.includes(cond.value);
		case 'academyExamNotTaken': return !ctx.academyExamTaken;
		case 'hasSpell': return ctx.learnedSpells.includes(cond.value);
		case 'hasRitual': return ctx.learnedRituals.includes(cond.value);
		case 'hasQuest': return ctx.activeQuestIds.includes(cond.value);
		case 'questCompleted': return ctx.completedQuestIds.includes(cond.value);
		case 'race': return ctx.playerRace === cond.value;
		case 'notRace': return ctx.playerRace !== cond.value;
		case 'minRaceAttitude': return ctx.raceAttitude[cond.race] >= cond.value;
		case 'maxRaceAttitude': return ctx.raceAttitude[cond.race] <= cond.value;
		case 'allOf': return cond.conditions.every(c => checkCondition(c, ctx));
	}
}

export const SOCIAL_CLASS_BONUS: Record<CharacterClass, Record<SocialSkill, number>> = {
	warrior:     { persuade: 0, intimidate: 4, deceive: -1 },
	mage:        { persuade: 4, intimidate: -1, deceive: 1 },
	rogue:       { persuade: 1, intimidate: 0, deceive: 4 },
	ranger:      { persuade: 1, intimidate: 1, deceive: 0 },
	cleric:      { persuade: 3, intimidate: 0, deceive: -2 },
	paladin:     { persuade: 2, intimidate: 3, deceive: -3 },
	necromancer: { persuade: -1, intimidate: 4, deceive: 2 },
	bard:        { persuade: 4, intimidate: -1, deceive: 3 },
	adept:       { persuade: 2, intimidate: 1, deceive: 0 },
	primordial:  { persuade: 3, intimidate: -2, deceive: 1 },
	runesmith:   { persuade: 1, intimidate: 2, deceive: -2 },
	spellblade:  { persuade: 2, intimidate: 2, deceive: -1 },
};

export function rollSocialCheck(check: SocialCheck, state: GameState): { success: boolean; roll: number; bonus: number; total: number } {
	const roll = 1 + Math.floor(Math.random() * 20);
	const classBonus = SOCIAL_CLASS_BONUS[state.characterConfig.characterClass][check.skill];
	const levelBonus = Math.floor(state.characterLevel / 3);
	const bonus = classBonus + levelBonus;
	const total = roll + bonus;
	return { success: total >= check.difficulty, roll, bonus, total };
}

export const SOCIAL_SKILL_DISPLAY: Record<SocialSkill, { label: string; color: string }> = {
	persuade: { label: 'Persuasion', color: '#4cf' },
	intimidate: { label: 'Intimidation', color: '#f84' },
	deceive: { label: 'Deception', color: '#c4f' },
};

/** Reveal a random undiscovered settlement on the overworld when a rumor is learned. */
function revealRumorLocation(state: GameState): void {
	const worldMap = state.worldMap as WorldMap;
	const pos = state.overworldPos;
	// Find settlements not yet revealed (center tile unexplored)
	const unrevealed = worldMap.settlements.filter(s => !worldMap.explored[s.pos.y]?.[s.pos.x]);
	if (unrevealed.length === 0) return;
	// Pick the nearest unrevealed settlement (rumors tend to be about nearby places)
	let target = unrevealed[0];
	if (pos) {
		let bestDist = Infinity;
		for (const s of unrevealed) {
			const dist = Math.abs(s.pos.x - pos.x) + Math.abs(s.pos.y - pos.y);
			if (dist < bestDist) { bestDist = dist; target = s; }
		}
	}
	// Reveal area around the settlement
	revealOverworldArea(worldMap, target.pos, 8);
	addMessage(state, `The rumor reveals the location of ${target.name} on your map.`, 'discovery');
}

export function handleDialogueChoice(state: GameState, optionIndex: number): GameState {
	if (!state.activeDialogue) return state;
	const { tree, currentNodeId, visitedNodes } = state.activeDialogue;
	const currentNode = tree.nodes[currentNodeId];
	if (!currentNode || optionIndex < 0 || optionIndex >= currentNode.options.length) return state;

	const option = currentNode.options[optionIndex];
	visitedNodes.add(currentNodeId);

	// Apply dialogue effects
	if (option.onSelect) {
		// Item gifts only once
		if (!state.activeDialogue.givenItems && (option.onSelect.hp || option.onSelect.atk)) {
			if (option.onSelect.hp) {
				state.player.hp = Math.min(state.player.maxHp, state.player.hp + option.onSelect.hp);
				addMessage(state, option.onSelect.message ?? `Healed ${option.onSelect.hp} HP!`, 'healing');
			}
			if (option.onSelect.atk) {
				state.player.attack += option.onSelect.atk;
				addMessage(state, option.onSelect.message ?? `+${option.onSelect.atk} ATK!`, 'level_up');
			}
			state.activeDialogue.givenItems = true;
			const npc = state.npcs.find((n) => n.name === state.activeDialogue!.npcName);
			if (npc) npc.given = true;
		}
		// Mood changes always apply
		if (option.onSelect.mood) {
			state.activeDialogue.mood = option.onSelect.mood;
			state.activeDialogue.context = { ...state.activeDialogue.context, npcMood: option.onSelect.mood };
			const npc = state.npcs.find((n) => n.name === state.activeDialogue!.npcName);
			if (npc) {
				npc.mood = option.onSelect.mood;
				npc.moodTurns = 0;
			}
		}
		// Learn rumors
		if (option.onSelect.rumor && !state.rumors.some(r => r.id === option.onSelect!.rumor!.id)) {
			state.rumors = [...state.rumors, option.onSelect.rumor];
			addMessage(state, `Rumor learned: "${option.onSelect.rumor.text}"`, 'discovery');
			// Rumors reveal a distant location on the overworld map
			if (state.worldMap) {
				revealRumorLocation(state);
			}
		}
		// Learn languages
		if (option.onSelect.learnLanguage && !state.knownLanguages.includes(option.onSelect.learnLanguage)) {
			state.knownLanguages = [...state.knownLanguages, option.onSelect.learnLanguage];
			addMessage(state, `Language learned: ${option.onSelect.learnLanguage}! You can now understand speakers of this tongue.`, 'discovery');
		}
		// Learn rituals from dialogue
		if (option.onSelect.learnRitual) {
			learnRitual(state, option.onSelect.learnRitual);
		}
		// Collect stories
		if (option.onSelect.story && !state.heardStories.includes(option.onSelect.story.id)) {
			state.heardStories = [...state.heardStories, option.onSelect.story.id];
			addMessage(state, `Story collected: "${option.onSelect.story.title}" (+5 XP)`, 'discovery');
			state.xp += 5;
		}
		// NPC extreme emotional actions
		if (option.onSelect.npcAction) {
			const npcName = state.activeDialogue!.npcName;
			const npc = state.npcs.find((n) => n.name === npcName);
			state.activeDialogue = null;
			if (npc) {
				switch (option.onSelect.npcAction) {
					case 'attack': {
						const dmg = Math.max(1, Math.floor(state.player.attack * 0.3));
						state.player.hp -= dmg;
						addMessage(state, `${npcName} attacks you in a fury! You take ${dmg} damage!`, 'damage_taken');
						npc.mood = 'hostile';
						npc.moodTurns = 0;
						if (state.player.hp <= 0) handlePlayerDeath(state);
						break;
					}
					case 'flee': {
						addMessage(state, `${npcName} backs away in terror and flees!`, 'npc');
						npc.mood = 'afraid';
						npc.moodTurns = 0;
						relocateNpc(state, npc);
						break;
					}
					case 'break_down': {
						addMessage(state, `${npcName} breaks down sobbing uncontrollably...`, 'npc');
						npc.mood = 'sad';
						npc.moodTurns = 0;
						break;
					}
					case 'storm_off': {
						addMessage(state, `${npcName} storms off in disgust!`, 'npc');
						npc.mood = 'hostile';
						npc.moodTurns = 0;
						relocateNpc(state, npc);
						break;
					}
				}
			}
			return { ...state };
		}
		// Academy effects
		if (option.onSelect.enrollAcademy) {
			enrollAtAcademy(state);
			addMessage(state, 'You are now enrolled at the Arcane Academy! Your school year begins.', 'discovery');
		}
		if (option.onSelect.completeLesson) {
			completeLesson(state, option.onSelect.completeLesson);
			addMessage(state, 'Lesson complete! Remember what you learned.', 'discovery');
		}
		if (option.onSelect.addTitle && !state.playerTitles.includes(option.onSelect.addTitle)) {
			state.playerTitles.push(option.onSelect.addTitle);
			addMessage(state, `Title earned: ${option.onSelect.addTitle}!`, 'discovery');
		}
		// Teach spells from dialogue (free — no talent point cost)
		if (option.onSelect.learnSpell) {
			const spellId = option.onSelect.learnSpell;
			if (!state.learnedSpells.includes(spellId)) {
				state.learnedSpells.push(spellId);
				// Auto-assign to first empty quick-cast slot
				const emptySlot = state.quickCastSlots.indexOf(null);
				if (emptySlot !== -1) state.quickCastSlots[emptySlot] = spellId;
				addMessage(state, `Spell learned: ${SPELL_CATALOG[spellId]?.name ?? spellId}!`, 'magic');
			}
		}
		// Accept quest from dialogue
		if (option.onSelect.acceptQuest) {
			const questResult = acceptQuest(state, option.onSelect.acceptQuest);
			if (questResult.success) {
				addMessage(state, questResult.message, 'discovery');
			}
		}
		// Complete quest from dialogue
		if (option.onSelect?.completeQuest) {
			const questId = option.onSelect.completeQuest;
			const quest = state.quests.find(q => q.id === questId && q.status === 'active');
			if (quest) {
				// Mark all objectives as complete
				quest.objectives.forEach(o => { o.current = o.required; o.completed = true; });
				const result = completeQuest(state, questId);
				if (result.success) {
					for (const msg of result.messages) {
						addMessage(state, msg, 'discovery');
					}
				}
			}
		}
		if (option.onSelect.startExam) {
			// Spawn exam golem in the arena area
			const examGolem: Entity = {
				pos: { x: 40, y: 17 },
				char: 'G',
				color: '#f0f',
				name: 'Exam Golem',
				hp: 20,
				maxHp: 20,
				attack: 2,
				statusEffects: [],
				turnCounter: 0,
			};
			state.enemies.push(examGolem);
			addMessage(state, 'An Arcane Golem materializes in the practice arena! Defeat it to pass!', 'danger');
			if (state.academyState) {
				state.academyState.examTaken = true;
				state.academyState.examPart1Passed = true;
			}
			state.activeDialogue = null;
			return { ...state };
		}
		if (option.onSelect.startTeaching) {
			// Teaching handled through dialogue flow — just mark the intent
		}
		if (option.onSelect.completeTeaching) {
			const correct = option.onSelect.completeTeaching === 'correct';
			const teachMsgs = completeTeachingSession(state, correct);
			for (const tm of teachMsgs) state.messages.push(tm);
		}
	}

	// Social skill check — overrides normal navigation
	if (option.socialCheck) {
		const result = rollSocialCheck(option.socialCheck, state);
		const display = SOCIAL_SKILL_DISPLAY[option.socialCheck.skill];
		const bonusStr = result.bonus >= 0 ? `+${result.bonus}` : `${result.bonus}`;
		if (result.success) {
			addMessage(state, `[${display.label} Check: ${result.roll}${bonusStr}=${result.total} vs ${option.socialCheck.difficulty}] Success!`, 'discovery');
		} else {
			addMessage(state, `[${display.label} Check: ${result.roll}${bonusStr}=${result.total} vs ${option.socialCheck.difficulty}] Failed!`, 'damage_taken');
			// Track failed deception attempts for liar reputation
			if (option.socialCheck.skill === 'deceive') {
				state.lieCount++;
				if (state.lieCount >= 3) {
					addMessage(state, 'Your reputation as a liar is spreading...', 'trap');
				}
			}
		}
		const targetNode = result.success ? option.socialCheck.successNode : option.socialCheck.failNode;
		if (tree.nodes[targetNode]) {
			state.activeDialogue = { ...state.activeDialogue, currentNodeId: targetNode };
		}
		return { ...state };
	}

	// Exit dialogue
	if (option.nextNode === '__exit__') {
		state.activeDialogue = null;
		return { ...state };
	}

	// Navigate to next node
	if (tree.nodes[option.nextNode]) {
		state.activeDialogue = { ...state.activeDialogue, currentNodeId: option.nextNode };
	}
	return { ...state };
}

export function canDetectLies(state: GameState): boolean {
	if (state.characterConfig.characterClass === 'rogue') return true;
	if (state.knownLanguages.includes('Deepscript')) return true;
	if (state.characterLevel >= 8) return true;
	return false;
}

export const MOOD_DISPLAY: Record<string, { label: string; color: string; icon: string }> = {
	friendly: { label: 'Friendly', color: '#4f4', icon: '\u2665' },
	neutral: { label: 'Neutral', color: '#888', icon: '' },
	hostile: { label: 'Hostile', color: '#f44', icon: '!' },
	afraid: { label: 'Afraid', color: '#f8f', icon: '~' },
	amused: { label: 'Amused', color: '#ff4', icon: '*' },
	sad: { label: 'Sad', color: '#48f', icon: ',' },
};

export function npcMoodColor(npc: NPC): string {
	if (npc.mood === 'neutral') return npc.color;
	return MOOD_DISPLAY[npc.mood]?.color ?? npc.color;
}

const DEEPSCRIPT_GLYPHS = 'ᚠᚡᚢᚣᚤᚥᚦᚧᚨᚩᚪᚫᚬᚭᚮᚯᚰᚱᚲᚳᚴᚵᚶᚷᚸᚹᚺᚻᚼᚽᚾᚿ';
const ORCISH_GLYPHS = 'ɤʁʂʃʇʈʊʋʌʍʎʏɯɰɱɲɳɴɵɶɷɸɹɺɻɼɽɾɿ';
const ELVISH_GLYPHS = 'ꝏꝑꝓꝕꝗꝙꝛꝝꝟꝡꝣꝥꝧꝩꝫꝭꝯꜣꜥꜧꜩꜫꜭꜯꜱꜳꜵꜷꜹꜻꜽ';

const LANGUAGE_GLYPHS: Record<string, string> = {
	Deepscript: DEEPSCRIPT_GLYPHS,
	Orcish: ORCISH_GLYPHS,
	Elvish: ELVISH_GLYPHS,
};

export function garbleText(text: string, language: string): string {
	const glyphs = LANGUAGE_GLYPHS[language] ?? DEEPSCRIPT_GLYPHS;
	let result = '';
	for (const ch of text) {
		if (ch === ' ' || ch === '\n' || ch === '.' || ch === ',' || ch === '!' || ch === '?') {
			result += ch;
		} else if (ch === '*') {
			result += ch;
		} else {
			const idx = (ch.charCodeAt(0) * 7 + result.length * 3) % glyphs.length;
			result += glyphs[idx];
		}
	}
	return result;
}

/**
 * Prepend a race flavor line to NPC dialogue text based on the NPC's
 * effective attitude toward the player's race.
 * Returns the original text unmodified if no flavor applies.
 */
export function injectRaceFlavorLine(
	npcText: string,
	npcRace: CharacterRace | undefined,
	npcGender: 'male' | 'female' | undefined,
	baseAttitude: Record<CharacterRace, number> | undefined,
	npcId: string,
	playerRace: CharacterRace,
	shifts: Record<string, Record<CharacterRace, number>>,
): string {
	if (!npcRace || !baseAttitude) return npcText;
	const attitude = getEffectiveAttitude(baseAttitude, shifts, npcId, playerRace);
	const flavor = getRaceFlavorLine(npcRace, playerRace, attitude, npcGender);
	if (!flavor) return npcText;
	return `${flavor}\n\n${npcText}`;
}

export function closeDialogue(state: GameState): GameState {
	state.activeDialogue = null;
	return { ...state };
}
