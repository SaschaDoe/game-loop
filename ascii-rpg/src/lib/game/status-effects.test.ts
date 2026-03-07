import { describe, it, expect } from 'vitest';
import { applyEffect, hasEffect, tickEffects, effectColor } from './status-effects';
import type { Entity } from './types';

function makeEntity(overrides?: Partial<Entity>): Entity {
	return {
		pos: { x: 0, y: 0 },
		char: 'T',
		color: '#fff',
		name: 'TestEntity',
		hp: 20,
		maxHp: 20,
		attack: 5,
		statusEffects: [],
		...overrides
	};
}

describe('applyEffect', () => {
	it('adds a new effect to an entity', () => {
		const entity = makeEntity();
		applyEffect(entity, 'poison', 3, 2);
		expect(entity.statusEffects).toHaveLength(1);
		expect(entity.statusEffects[0]).toEqual({ type: 'poison', duration: 3, potency: 2 });
	});

	it('refreshes duration if same effect already exists', () => {
		const entity = makeEntity();
		applyEffect(entity, 'poison', 3, 2);
		applyEffect(entity, 'poison', 5, 1);
		expect(entity.statusEffects).toHaveLength(1);
		expect(entity.statusEffects[0].duration).toBe(5);
		expect(entity.statusEffects[0].potency).toBe(2); // keeps higher potency
	});

	it('uses higher potency when refreshing', () => {
		const entity = makeEntity();
		applyEffect(entity, 'poison', 3, 1);
		applyEffect(entity, 'poison', 2, 5);
		expect(entity.statusEffects[0].potency).toBe(5);
		expect(entity.statusEffects[0].duration).toBe(3); // keeps longer duration
	});

	it('can stack different effect types', () => {
		const entity = makeEntity();
		applyEffect(entity, 'poison', 3, 2);
		applyEffect(entity, 'stun', 1, 0);
		applyEffect(entity, 'regeneration', 5, 3);
		expect(entity.statusEffects).toHaveLength(3);
	});
});

describe('hasEffect', () => {
	it('returns true when entity has the effect', () => {
		const entity = makeEntity();
		applyEffect(entity, 'stun', 2, 0);
		expect(hasEffect(entity, 'stun')).toBe(true);
	});

	it('returns false when entity does not have the effect', () => {
		const entity = makeEntity();
		expect(hasEffect(entity, 'poison')).toBe(false);
	});
});

describe('tickEffects', () => {
	it('applies poison damage', () => {
		const entity = makeEntity({ hp: 20 });
		applyEffect(entity, 'poison', 3, 2);
		const result = tickEffects(entity);
		expect(result.damage).toBe(2);
		expect(entity.hp).toBe(18);
		expect(result.messages).toContain('TestEntity takes 2 poison damage!');
	});

	it('applies regeneration healing', () => {
		const entity = makeEntity({ hp: 10, maxHp: 20 });
		applyEffect(entity, 'regeneration', 3, 4);
		const result = tickEffects(entity);
		expect(result.healing).toBe(4);
		expect(entity.hp).toBe(14);
	});

	it('regeneration does not exceed maxHp', () => {
		const entity = makeEntity({ hp: 19, maxHp: 20 });
		applyEffect(entity, 'regeneration', 3, 10);
		tickEffects(entity);
		expect(entity.hp).toBe(20);
	});

	it('stun produces a message but no damage/healing', () => {
		const entity = makeEntity({ hp: 20 });
		applyEffect(entity, 'stun', 2, 0);
		const result = tickEffects(entity);
		expect(result.damage).toBe(0);
		expect(result.healing).toBe(0);
		expect(entity.hp).toBe(20);
		expect(result.messages).toContain('TestEntity is stunned!');
	});

	it('decrements duration each tick', () => {
		const entity = makeEntity();
		applyEffect(entity, 'poison', 3, 1);
		tickEffects(entity);
		expect(entity.statusEffects[0].duration).toBe(2);
		tickEffects(entity);
		expect(entity.statusEffects[0].duration).toBe(1);
	});

	it('removes effects when duration reaches 0', () => {
		const entity = makeEntity();
		applyEffect(entity, 'stun', 1, 0);
		tickEffects(entity);
		expect(entity.statusEffects).toHaveLength(0);
		expect(hasEffect(entity, 'stun')).toBe(false);
	});

	it('handles multiple effects simultaneously', () => {
		const entity = makeEntity({ hp: 15, maxHp: 20 });
		applyEffect(entity, 'poison', 2, 3);
		applyEffect(entity, 'regeneration', 2, 1);
		const result = tickEffects(entity);
		// Poison: -3, Regen: +1, net -2
		expect(result.damage).toBe(3);
		expect(result.healing).toBe(1);
		// hp = 15 - 3 = 12, then min(20, 12 + 1) = 13
		expect(entity.hp).toBe(13);
	});

	it('can kill an entity through poison', () => {
		const entity = makeEntity({ hp: 2 });
		applyEffect(entity, 'poison', 3, 5);
		tickEffects(entity);
		expect(entity.hp).toBe(-3);
	});

	it('applies burn damage', () => {
		const entity = makeEntity({ hp: 20 });
		applyEffect(entity, 'burn', 3, 4);
		const result = tickEffects(entity);
		expect(result.damage).toBe(4);
		expect(entity.hp).toBe(16);
		expect(result.messages).toContain('TestEntity burns for 4 fire damage!');
	});

	it('burn stacks with poison damage', () => {
		const entity = makeEntity({ hp: 20 });
		applyEffect(entity, 'poison', 3, 2);
		applyEffect(entity, 'burn', 3, 3);
		const result = tickEffects(entity);
		expect(result.damage).toBe(5);
		expect(entity.hp).toBe(15);
	});

	it('freeze produces message and decrements', () => {
		const entity = makeEntity({ hp: 20 });
		applyEffect(entity, 'freeze', 2, 0);
		const result = tickEffects(entity);
		expect(result.damage).toBe(0);
		expect(entity.hp).toBe(20);
		expect(result.messages).toContain('TestEntity is frozen!');
		expect(entity.statusEffects[0].duration).toBe(1);
	});

	it('blind produces message without damage', () => {
		const entity = makeEntity({ hp: 20 });
		applyEffect(entity, 'blind', 3, 0);
		const result = tickEffects(entity);
		expect(result.damage).toBe(0);
		expect(entity.hp).toBe(20);
		expect(result.messages).toContain('TestEntity is blinded!');
	});

	it('curse produces message showing ATK reduction', () => {
		const entity = makeEntity({ hp: 20 });
		applyEffect(entity, 'curse', 3, 2);
		const result = tickEffects(entity);
		expect(result.damage).toBe(0);
		expect(entity.hp).toBe(20);
		expect(result.messages).toContain('TestEntity is cursed! (-2 ATK)');
	});
});

describe('effectColor', () => {
	it('returns stun color with highest priority', () => {
		const entity = makeEntity();
		applyEffect(entity, 'poison', 3, 1);
		applyEffect(entity, 'stun', 1, 0);
		expect(effectColor(entity)).toBe('#ffff00');
	});

	it('returns poison color when poisoned', () => {
		const entity = makeEntity();
		applyEffect(entity, 'poison', 3, 1);
		expect(effectColor(entity)).toBe('#00ff00');
	});

	it('returns regeneration color when regenerating', () => {
		const entity = makeEntity();
		applyEffect(entity, 'regeneration', 3, 1);
		expect(effectColor(entity)).toBe('#00ffaa');
	});

	it('returns null when no effects', () => {
		const entity = makeEntity();
		expect(effectColor(entity)).toBeNull();
	});

	it('returns freeze color', () => {
		const entity = makeEntity();
		applyEffect(entity, 'freeze', 2, 0);
		expect(effectColor(entity)).toBe('#88ccff');
	});

	it('returns burn color', () => {
		const entity = makeEntity();
		applyEffect(entity, 'burn', 2, 1);
		expect(effectColor(entity)).toBe('#ff6600');
	});

	it('returns curse color', () => {
		const entity = makeEntity();
		applyEffect(entity, 'curse', 2, 1);
		expect(effectColor(entity)).toBe('#aa00ff');
	});

	it('returns blind color', () => {
		const entity = makeEntity();
		applyEffect(entity, 'blind', 2, 0);
		expect(effectColor(entity)).toBe('#888888');
	});

	it('freeze has higher priority than poison', () => {
		const entity = makeEntity();
		applyEffect(entity, 'poison', 3, 1);
		applyEffect(entity, 'freeze', 2, 0);
		expect(effectColor(entity)).toBe('#88ccff');
	});
});
