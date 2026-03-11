import type { GameState, Entity, Position, MessageType, CharacterClass } from './types';
import { Visibility } from './types';
import { addMessage, handlePlayerDeath, isBlocked, xpReward, applyXpMultiplier, checkLevelUp, processAchievements, tickEntityEffects, tryDropLoot, tickNpcMoods, racialPoisonDuration } from './engine-utils';
import { tickTerrainEffects, checkRitualInterrupt } from './spell-handler';
import { hasEffect, applyEffect } from './status-effects';
import { getSkillBonuses } from './skills';
import { tickAbilityCooldown } from './abilities';
import { applyHazards, getHazardAt, applyHazardToEntity } from './hazards';
import { isBoss, isRare, getMonsterBehavior, decideMoveDirection, getMonsterDefByName, getMonsterOnHitEffect } from './monsters';
import { recordKill } from './bestiary';
import { updateQuestProgress } from './quests';
import { getSpellDef, tickManaRegen, tickSpellCooldowns } from './spells';
import { getEquipmentBonuses } from './items';
import { passExam } from './academy';

// ── Combat Constants ──

export const DODGE_CHANCE: Record<CharacterClass, number> = {
	rogue: 0.25,
	mage: 0.15,
	warrior: 0.10,
	ranger: 0.20,
	cleric: 0.08,
	paladin: 0.05,
	necromancer: 0.12,
	bard: 0.18,
	adept: 0.10,
	primordial: 0.15,
	runesmith: 0.08,
	spellblade: 0.12,
};

export const BLOCK_REDUCTION: Record<CharacterClass, number> = {
	warrior: 2,
	mage: 0,
	rogue: 1,
	ranger: 1,
	cleric: 1,
	paladin: 3,
	necromancer: 0,
	bard: 0,
	adept: 0,
	primordial: 0,
	runesmith: 2,
	spellblade: 1,
};

export const PUSH_CHANCE: Record<CharacterClass, number> = {
	warrior: 1.0,
	rogue: 0.40,
	mage: 0.30,
	ranger: 0.45,
	cleric: 0.35,
	paladin: 0.80,
	necromancer: 0.20,
	bard: 0.25,
	adept: 0.25,
	primordial: 0.25,
	runesmith: 0.70,
	spellblade: 0.55,
};

export const ENVIRONMENTAL_KILL_BONUS = 1.5;

const FLEE_CHANCE: Record<CharacterClass, number> = {
	rogue: 0.75,
	mage: 0.60,
	warrior: 0.50,
	ranger: 0.70,
	cleric: 0.45,
	paladin: 0.40,
	necromancer: 0.55,
	bard: 0.65,
	adept: 0.60,
	primordial: 0.55,
	runesmith: 0.40,
	spellblade: 0.50,
};

// ── Interfaces ──

export interface PushResult {
	pushed: boolean;
	messages: { text: string; type: MessageType }[];
	environmentalKill: boolean;
}

interface FleeResult {
	moved: Position | null;
	messages: { text: string; type: MessageType }[];
}

// ── processKill: deduplicated kill-processing logic ──

/**
 * Process a kill: award XP (boss 3x, rare 2x), drop loot, update stats,
 * record in bestiary, update quest progress, check exam golem, add kill message.
 * Returns the XP reward amount.
 */
export function processKill(state: GameState, enemy: Entity, bonusMultiplier?: number): number {
	tryDropLoot(state, enemy);
	const bossKill = isBoss(enemy);
	const rareKill = isRare(enemy);
	const baseReward = xpReward(enemy, state.level);
	const multiplier = bonusMultiplier ?? 1;
	const reward = applyXpMultiplier(
		Math.floor((bossKill ? baseReward * 3 : rareKill ? baseReward * 2 : baseReward) * multiplier),
		state
	);
	state.xp += reward;
	state.stats.enemiesKilled++;
	if (bossKill) state.stats.bossesKilled++;
	recordKill(state.bestiary, enemy);

	// Quest progress
	const questMsgs = updateQuestProgress(state, 'kill', enemy.name);
	for (const qm of questMsgs) addMessage(state, qm, 'discovery');

	// Check for exam golem kill
	if (enemy.name === 'Exam Golem' && state.academyState && !state.academyState.examPassed) {
		passExam(state);
		addMessage(state, 'You defeated the Exam Golem! You have passed the combat trial!', 'level_up');
		addMessage(state, 'The Archmagus awaits you for the graduation ceremony.', 'discovery');
	}

	// Kill message varies by kill type
	if (multiplier > 1) {
		addMessage(state, `${enemy.name} perished in the environment! +${reward} XP (Creativity bonus!)`, 'level_up');
	} else if (bossKill) {
		addMessage(state, `${enemy.name} has been vanquished! +${reward} XP`, 'level_up');
	} else if (rareKill) {
		addMessage(state, `${enemy.name} slain! +${reward} XP`, 'level_up');
	} else {
		addMessage(state, `${enemy.name} defeated! +${reward} XP`, 'player_attack');
	}

	return reward;
}

// ── Push mechanic ──

export function attemptPush(
	state: GameState,
	target: Entity,
	dx: number,
	dy: number
): PushResult {
	const messages: { text: string; type: MessageType }[] = [];
	const pushX = target.pos.x + dx;
	const pushY = target.pos.y + dy;

	// Can't push if destination is blocked or occupied
	if (isBlocked(state, pushX, pushY)) return { pushed: false, messages, environmentalKill: false };
	if (state.enemies.some((e) => e !== target && e.pos.x === pushX && e.pos.y === pushY)) {
		return { pushed: false, messages, environmentalKill: false };
	}
	if (pushX === state.player.pos.x && pushY === state.player.pos.y) {
		return { pushed: false, messages, environmentalKill: false };
	}

	const chance = PUSH_CHANCE[state.characterConfig.characterClass];
	if (Math.random() >= chance) return { pushed: false, messages, environmentalKill: false };

	// Push succeeds
	target.pos = { x: pushX, y: pushY };
	messages.push({ text: `You push ${target.name} back!`, type: 'player_attack' });

	let environmentalKill = false;

	// Check hazard at new position
	const hazard = getHazardAt(state.hazards, pushX, pushY);
	if (hazard) {
		const effect = applyHazardToEntity(hazard, target, state.level);
		if (effect) {
			messages.push({ text: effect.text, type: 'player_attack' });
		}
		if (target.hp <= 0) environmentalKill = true;
	}

	return { pushed: true, messages, environmentalKill };
}

// ── Enemy AI / Move Enemies ──

export function moveEnemies(state: GameState, defending = false) {
	tickAbilityCooldown(state);
	tickNpcMoods(state);

	// Apply hazard effects to all entities
	const hazardEffects = applyHazards(state);
	for (const effect of hazardEffects) {
		addMessage(state, effect.text, effect.type);
	}
	if (state.player.hp <= 0) {
		handlePlayerDeath(state);
	}

	// Remove enemies killed by hazards and award XP
	state.enemies = state.enemies.filter((e) => {
		if (e.hp <= 0) {
			tryDropLoot(state, e);
			const reward = applyXpMultiplier(xpReward(e, state.level), state);
			state.xp += reward;
			addMessage(state, `${e.name} perished in a hazard! +${reward} XP`, 'player_attack');
			return false;
		}
		return true;
	});
	if (hazardEffects.length > 0) checkLevelUp(state);

	// Tick enemy status effects and remove dead enemies
	for (const enemy of state.enemies) {
		tickEntityEffects(state, enemy);
	}
	state.enemies = state.enemies.filter((e) => {
		if (e.hp <= 0) {
			tryDropLoot(state, e);
			const reward = applyXpMultiplier(xpReward(e, state.level), state);
			state.xp += reward;
			addMessage(state, `${e.name} died from status effects! +${reward} XP`, 'player_attack');
			return false;
		}
		return true;
	});
	checkLevelUp(state);

	// Tick player status effects
	tickEntityEffects(state, state.player);

	// Tick mana regeneration and spell cooldowns
	tickManaRegen(state);
	tickSpellCooldowns(state);

	// Tick terrain effects (burning/frozen/electrified ground)
	tickTerrainEffects(state);
	if (state.player.hp <= 0) {
		handlePlayerDeath(state);
	}
	// Remove enemies killed by terrain effects
	state.enemies = state.enemies.filter((e) => {
		if (e.hp <= 0) {
			tryDropLoot(state, e);
			const reward = applyXpMultiplier(xpReward(e, state.level), state);
			state.xp += reward;
			return false;
		}
		return true;
	});

	for (const enemy of state.enemies) {
		if (hasEffect(enemy, 'stun') || hasEffect(enemy, 'sleep') || hasEffect(enemy, 'freeze')) continue;

		// Exam Golem: 3-turn cycle AI (charge, charge, blast)
		if (enemy.name === 'Exam Golem' && enemy.turnCounter !== undefined) {
			enemy.turnCounter++;
			const cycle = ((enemy.turnCounter - 1) % 3) + 1; // 1, 2, 3
			const dx = state.player.pos.x - enemy.pos.x;
			const dy = state.player.pos.y - enemy.pos.y;
			const dist = Math.abs(dx) + Math.abs(dy);

			if (cycle === 3) {
				// BLAST turn — only hits if adjacent
				if (dist <= 1) {
					const blastDmg = 8 + Math.floor(Math.random() * 5); // 8-12
					state.player.hp -= blastDmg;
					state.stats.damageTaken += blastDmg;
					addMessage(state, `Exam Golem unleashes ARCANE BLAST for ${blastDmg} damage!`, 'damage_taken');
					checkRitualInterrupt(state, blastDmg);
				} else {
					addMessage(state, 'Exam Golem unleashes ARCANE BLAST — but you\'re out of range!', 'info');
				}
			} else {
				// CHARGE turn — move toward player and deal low damage if adjacent
				const moveX = dx === 0 ? 0 : dx > 0 ? 1 : -1;
				const moveY = dy === 0 ? 0 : dy > 0 ? 1 : -1;
				const nx = enemy.pos.x + moveX;
				const ny = enemy.pos.y + moveY;
				if (nx === state.player.pos.x && ny === state.player.pos.y) {
					const chargeDmg = 1 + Math.floor(Math.random() * 2); // 1-2
					state.player.hp -= chargeDmg;
					state.stats.damageTaken += chargeDmg;
					addMessage(state, `Exam Golem charges! ${chargeDmg} damage.`, 'damage_taken');
					checkRitualInterrupt(state, chargeDmg);
				} else if (nx >= 0 && ny >= 0 && nx < state.map.width && ny < state.map.height &&
					state.map.tiles[ny][nx] === '.') {
					enemy.pos = { x: nx, y: ny };
					addMessage(state, `Exam Golem charges toward you...`, 'info');
				}
			}
			if (state.player.hp <= 0) handlePlayerDeath(state);
			continue;
		}

		// Spellcaster enemy AI
		const monsterDef = getMonsterDefByName(enemy.name);
		if (monsterDef?.isSpellcaster && monsterDef.spells) {
			// Handle channeling completion
			if (enemy.channeling) {
				enemy.channeling.turnsLeft--;
				if (enemy.channeling.turnsLeft <= 0) {
					const chSpell = getSpellDef(enemy.channeling.spellId);
					if (chSpell && chSpell.baseDamage > 0) {
						const dmg = Math.max(1, Math.floor(chSpell.baseDamage * (1 + state.level / 10)));
						state.player.hp -= dmg;
						addMessage(state, `${enemy.name} unleashes ${chSpell.name} for ${dmg} damage!`, 'damage_taken');
					}
					if (chSpell?.statusEffect) {
						applyEffect(state.player, chSpell.statusEffect.type as any, racialPoisonDuration(state, chSpell.statusEffect.type, chSpell.statusEffect.duration), chSpell.statusEffect.potency);
					}
					enemy.channeling = null;
				}
				if (state.player.hp <= 0) handlePlayerDeath(state);
				continue; // skip normal movement while channeling
			}

			// Try to cast a spell
			const dist = Math.max(Math.abs(enemy.pos.x - state.player.pos.x), Math.abs(enemy.pos.y - state.player.pos.y));
			if (dist <= 5) {
				if (!enemy.enemySpellCooldowns) enemy.enemySpellCooldowns = {};

				let castSpell = false;
				for (const opt of monsterDef.spells) {
					if ((enemy.enemySpellCooldowns[opt.spellId] ?? 0) > 0) continue;
					if (Math.random() > opt.castChance) continue;

					const spell = getSpellDef(opt.spellId);
					if (!spell) continue;

					if (spell.tier >= 3) {
						enemy.channeling = { spellId: spell.id, turnsLeft: 1 };
						addMessage(state, `${enemy.name} begins channeling ${spell.name}!`, 'danger');
						enemy.enemySpellCooldowns[opt.spellId] = spell.cooldown + 1;
						castSpell = true;
						break;
					}

					const dmg = Math.max(1, Math.floor(spell.baseDamage * (1 + state.level / 10)));
					if (dmg > 0 && spell.baseDamage > 0) {
						state.player.hp -= dmg;
						addMessage(state, `${enemy.name} casts ${spell.name} for ${dmg} damage!`, 'damage_taken');
					}
					if (spell.statusEffect) {
						applyEffect(state.player, spell.statusEffect.type as any, racialPoisonDuration(state, spell.statusEffect.type, spell.statusEffect.duration), spell.statusEffect.potency);
						if (spell.baseDamage <= 0) {
							addMessage(state, `${enemy.name} casts ${spell.name}!`, 'danger');
						}
					}
					enemy.enemySpellCooldowns[opt.spellId] = spell.cooldown;
					castSpell = true;
					break;
				}

				// Tick cooldowns
				for (const id of Object.keys(enemy.enemySpellCooldowns)) {
					if (enemy.enemySpellCooldowns[id] > 0) enemy.enemySpellCooldowns[id]--;
				}

				if (castSpell) {
					if (state.player.hp <= 0) handlePlayerDeath(state);
					continue; // skip normal movement this turn
				}
			}
		}

		const behavior = getMonsterBehavior(enemy);
		const move = decideMoveDirection(enemy, state.player.pos, state.enemies, behavior);
		if (move.skip) continue;

		const nx = enemy.pos.x + move.dx;
		const ny = enemy.pos.y + move.dy;

		if (nx === state.player.pos.x && ny === state.player.pos.y) {
			// Blind miss check
			if (hasEffect(enemy, 'blind') && Math.random() < 0.5) {
				addMessage(state, `${enemy.name} swings blindly and misses!`, 'info');
				continue;
			}

			// Dodge check — bosses are undodgeable
			const skillBonuses = getSkillBonuses(state.unlockedSkills);
			const dodgeChance = (DODGE_CHANCE[state.characterConfig.characterClass] + (skillBonuses.dodgeChance ?? 0)) * (defending ? 2 : 1);
			if (!isBoss(enemy) && Math.random() < dodgeChance) {
				addMessage(state, `You dodge ${enemy.name}'s attack!`, 'info');
				continue;
			}

			const curseReduction = enemy.statusEffects.find((e) => e.type === 'curse')?.potency ?? 0;
			const rawDmg = Math.max(1, (enemy.attack - curseReduction) + Math.floor(Math.random() * 2));
			const blockValue = (BLOCK_REDUCTION[state.characterConfig.characterClass] + (skillBonuses.blockReduction ?? 0)) * (defending ? 2 : 1);
			const dmg = Math.max(1, rawDmg - blockValue);
			if (blockValue > 0 && rawDmg > dmg) {
				addMessage(state, `You block ${rawDmg - dmg} damage from ${enemy.name}!`, 'info');
			}
			state.player.hp -= dmg;
			state.stats.damageTaken += dmg;
			addMessage(state, `${enemy.name} hits you for ${dmg} damage!`, 'damage_taken');
			checkRitualInterrupt(state, dmg);
			const onHit = getMonsterOnHitEffect(enemy);
			if (onHit) {
				applyEffect(state.player, onHit.type, racialPoisonDuration(state, onHit.type, onHit.duration), onHit.potency);
				addMessage(state, `${enemy.name}'s attack inflicts ${onHit.type}!`, 'damage_taken');
			}
			if (state.player.hp <= 0) {
				handlePlayerDeath(state);
			}
		} else if (!isBlocked(state, nx, ny) && !state.enemies.some((e) => e !== enemy && e.pos.x === nx && e.pos.y === ny)) {
			// Non-relentless enemies avoid hazard tiles
			if (behavior !== 'relentless' && getHazardAt(state.hazards, nx, ny)) continue;
			// Narrate visible enemy movement
			if (state.visibility[enemy.pos.y]?.[enemy.pos.x] === Visibility.Visible) {
				const distBefore = Math.abs(enemy.pos.x - state.player.pos.x) + Math.abs(enemy.pos.y - state.player.pos.y);
				const distAfter = Math.abs(nx - state.player.pos.x) + Math.abs(ny - state.player.pos.y);
				if (distAfter < distBefore) {
					addMessage(state, `${enemy.name} moves toward you.`, 'info');
				} else if (distAfter > distBefore && behavior === 'cowardly') {
					addMessage(state, `${enemy.name} retreats!`, 'info');
				}
			}
			enemy.pos = { x: nx, y: ny };
		}
	}

	// Tick active wards
	state.activeWards = state.activeWards.filter(ward => {
		ward.turnsRemaining--;
		if (ward.turnsRemaining <= 0) {
			addMessage(state, 'A protective ward fades away.', 'info');
			return false;
		}
		// Damage enemies inside the ward radius
		for (const enemy of state.enemies) {
			const dx = Math.abs(enemy.pos.x - ward.center.x);
			const dy = Math.abs(enemy.pos.y - ward.center.y);
			if (dx <= ward.radius && dy <= ward.radius) {
				enemy.hp -= ward.damage;
				applyEffect(enemy, 'freeze', 1, 0);
				addMessage(state, `${enemy.name} is struck by the ward for ${ward.damage} damage!`, 'player_attack');
			}
		}
		// Remove enemies killed by wards
		state.enemies = state.enemies.filter(e => {
			if (e.hp <= 0) {
				tryDropLoot(state, e);
				const reward = applyXpMultiplier(xpReward(e, state.level), state);
				state.xp += reward;
				state.stats.enemiesKilled++;
				recordKill(state.bestiary, e);
				addMessage(state, `${e.name} is destroyed by the ward! +${reward} XP`, 'player_attack');
				return false;
			}
			return true;
		});
		if (state.enemies.length === 0) checkLevelUp(state);
		return true;
	});

	// Summon AI
	if (state.activeSummon && state.activeSummon.hp > 0) {
		const summon = state.activeSummon;
		let nearestEnemy: Entity | null = null;
		let nearestDist = Infinity;
		for (const enemy of state.enemies) {
			const dist = Math.abs(enemy.pos.x - summon.pos.x) + Math.abs(enemy.pos.y - summon.pos.y);
			if (dist < nearestDist) {
				nearestDist = dist;
				nearestEnemy = enemy;
			}
		}
		if (nearestEnemy) {
			if (nearestDist <= 1) {
				// Attack
				nearestEnemy.hp -= summon.attack;
				addMessage(state, `Arcane Familiar attacks ${nearestEnemy.name} for ${summon.attack} damage!`, 'player_attack');
				if (nearestEnemy.hp <= 0) {
					tryDropLoot(state, nearestEnemy);
					const reward = applyXpMultiplier(xpReward(nearestEnemy, state.level), state);
					state.xp += reward;
					state.stats.enemiesKilled++;
					recordKill(state.bestiary, nearestEnemy);
					addMessage(state, `${nearestEnemy.name} is slain by your familiar! +${reward} XP`, 'player_attack');
					state.enemies = state.enemies.filter(e => e.hp > 0);
					checkLevelUp(state);
				}
			} else {
				// Move toward nearest enemy
				const mdx = Math.sign(nearestEnemy.pos.x - summon.pos.x);
				const mdy = Math.sign(nearestEnemy.pos.y - summon.pos.y);
				const candidates: Position[] = [];
				if (mdx !== 0) candidates.push({ x: summon.pos.x + mdx, y: summon.pos.y });
				if (mdy !== 0) candidates.push({ x: summon.pos.x, y: summon.pos.y + mdy });
				for (const c of candidates) {
					if (c.x < 0 || c.y < 0 || c.x >= state.map.width || c.y >= state.map.height) continue;
					if (state.map.tiles[c.y][c.x] === '#') continue;
					if (c.x === state.player.pos.x && c.y === state.player.pos.y) continue;
					if (state.enemies.some(e => e.pos.x === c.x && e.pos.y === c.y)) continue;
					summon.pos = c;
					break;
				}
			}
		}
	}
}

// ── Flee mechanic ──

export function attemptFlee(state: GameState): FleeResult {
	const messages: { text: string; type: MessageType }[] = [];
	const { player, enemies } = state;

	// Must be adjacent to at least one enemy
	const adjacent = enemies.filter(
		(e) => Math.abs(e.pos.x - player.pos.x) <= 1 && Math.abs(e.pos.y - player.pos.y) <= 1
	);
	if (adjacent.length === 0) {
		messages.push({ text: 'There is nothing to flee from.', type: 'info' });
		return { moved: null, messages };
	}

	// Bosses block fleeing
	if (adjacent.some((e) => isBoss(e))) {
		messages.push({ text: 'The boss blocks your escape!', type: 'damage_taken' });
		return { moved: null, messages };
	}

	const chance = FLEE_CHANCE[state.characterConfig.characterClass];
	if (Math.random() >= chance) {
		messages.push({ text: 'You failed to flee!', type: 'damage_taken' });
		return { moved: null, messages };
	}

	// Find the nearest enemy and move 2 tiles away from it
	const nearest = adjacent.reduce((a, b) => {
		const da = Math.abs(a.pos.x - player.pos.x) + Math.abs(a.pos.y - player.pos.y);
		const db = Math.abs(b.pos.x - player.pos.x) + Math.abs(b.pos.y - player.pos.y);
		return da <= db ? a : b;
	});

	const awayX = Math.sign(player.pos.x - nearest.pos.x);
	const awayY = Math.sign(player.pos.y - nearest.pos.y);

	// Try 2 tiles away, then 1 tile, in away direction and perpendicular directions
	const candidates: Position[] = [];
	if (awayX !== 0 || awayY !== 0) {
		candidates.push({ x: player.pos.x + awayX * 2, y: player.pos.y + awayY * 2 });
		candidates.push({ x: player.pos.x + awayX, y: player.pos.y + awayY });
	}
	// Perpendicular options
	const perps = awayX !== 0 && awayY !== 0
		? [{ x: awayX, y: 0 }, { x: 0, y: awayY }]
		: awayX !== 0
			? [{ x: 0, y: 1 }, { x: 0, y: -1 }]
			: [{ x: 1, y: 0 }, { x: -1, y: 0 }];
	for (const p of perps) {
		candidates.push({ x: player.pos.x + p.x * 2, y: player.pos.y + p.y * 2 });
		candidates.push({ x: player.pos.x + p.x, y: player.pos.y + p.y });
	}

	const dest = candidates.find(
		(c) => !isBlocked(state, c.x, c.y) && !enemies.some((e) => e.pos.x === c.x && e.pos.y === c.y)
	);

	if (!dest) {
		messages.push({ text: 'You try to flee but there is nowhere to go!', type: 'damage_taken' });
		return { moved: null, messages };
	}

	messages.push({ text: 'You flee from combat!', type: 'info' });
	return { moved: dest, messages };
}
