import type { Entity, StatusEffect, StatusEffectType } from './types';

export function applyEffect(entity: Entity, type: StatusEffectType, duration: number, potency: number): void {
	const existing = entity.statusEffects.find((e) => e.type === type);
	if (existing) {
		// Refresh duration to the longer of the two, use higher potency
		existing.duration = Math.max(existing.duration, duration);
		existing.potency = Math.max(existing.potency, potency);
	} else {
		entity.statusEffects.push({ type, duration, potency });
	}
}

export function hasEffect(entity: Entity, type: StatusEffectType): boolean {
	return entity.statusEffects.some((e) => e.type === type);
}

export function tickEffects(entity: Entity): { damage: number; healing: number; messages: string[] } {
	let damage = 0;
	let healing = 0;
	const messages: string[] = [];

	for (const effect of entity.statusEffects) {
		switch (effect.type) {
			case 'poison':
				damage += effect.potency;
				messages.push(`${entity.name} takes ${effect.potency} poison damage!`);
				break;
			case 'regeneration':
				healing += effect.potency;
				messages.push(`${entity.name} regenerates ${effect.potency} HP.`);
				break;
			case 'burn':
				damage += effect.potency;
				messages.push(`${entity.name} burns for ${effect.potency} fire damage!`);
				break;
			case 'stun':
				messages.push(`${entity.name} is stunned!`);
				break;
			case 'freeze':
				messages.push(`${entity.name} is frozen!`);
				break;
			case 'blind':
				messages.push(`${entity.name} is blinded!`);
				break;
			case 'curse':
				messages.push(`${entity.name} is cursed! (-${effect.potency} ATK)`);
				break;
			case 'sleep':
				// Sleep doesn't tick — it's removed externally when woken
				break;
		}
		if (effect.type !== 'sleep') effect.duration--;
	}

	entity.statusEffects = entity.statusEffects.filter((e) => e.duration > 0);

	entity.hp -= damage;
	entity.hp = Math.min(entity.maxHp, entity.hp + healing);

	return { damage, healing, messages };
}

export function effectColor(entity: Entity): string | null {
	if (hasEffect(entity, 'sleep')) return '#666688';
	if (hasEffect(entity, 'stun')) return '#ffff00';
	if (hasEffect(entity, 'freeze')) return '#88ccff';
	if (hasEffect(entity, 'burn')) return '#ff6600';
	if (hasEffect(entity, 'curse')) return '#aa00ff';
	if (hasEffect(entity, 'blind')) return '#888888';
	if (hasEffect(entity, 'poison')) return '#00ff00';
	if (hasEffect(entity, 'regeneration')) return '#00ffaa';
	return null;
}
