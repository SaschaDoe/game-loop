import { describe, it, expect } from 'vitest';
import { SeededRandom, hashSeed, createRng, randomSeedString } from './seeded-random';

describe('SeededRandom', () => {
	it('produces deterministic sequences from the same seed', () => {
		const rng1 = new SeededRandom(42);
		const rng2 = new SeededRandom(42);
		const seq1 = Array.from({ length: 20 }, () => rng1.next());
		const seq2 = Array.from({ length: 20 }, () => rng2.next());
		expect(seq1).toEqual(seq2);
	});

	it('produces different sequences from different seeds', () => {
		const rng1 = new SeededRandom(42);
		const rng2 = new SeededRandom(99);
		const seq1 = Array.from({ length: 10 }, () => rng1.next());
		const seq2 = Array.from({ length: 10 }, () => rng2.next());
		expect(seq1).not.toEqual(seq2);
	});

	it('next() returns values in [0, 1)', () => {
		const rng = new SeededRandom(12345);
		for (let i = 0; i < 1000; i++) {
			const v = rng.next();
			expect(v).toBeGreaterThanOrEqual(0);
			expect(v).toBeLessThan(1);
		}
	});

	it('nextInt(max) returns integers in [0, max)', () => {
		const rng = new SeededRandom(777);
		for (let i = 0; i < 100; i++) {
			const v = rng.nextInt(10);
			expect(v).toBeGreaterThanOrEqual(0);
			expect(v).toBeLessThan(10);
			expect(Number.isInteger(v)).toBe(true);
		}
	});

	it('nextRange(min, max) returns integers in [min, max]', () => {
		const rng = new SeededRandom(555);
		for (let i = 0; i < 100; i++) {
			const v = rng.nextRange(5, 15);
			expect(v).toBeGreaterThanOrEqual(5);
			expect(v).toBeLessThanOrEqual(15);
			expect(Number.isInteger(v)).toBe(true);
		}
	});

	it('shuffle() is deterministic', () => {
		const rng1 = new SeededRandom(42);
		const rng2 = new SeededRandom(42);
		const a = [1, 2, 3, 4, 5, 6, 7, 8];
		const b = [1, 2, 3, 4, 5, 6, 7, 8];
		rng1.shuffle(a);
		rng2.shuffle(b);
		expect(a).toEqual(b);
	});

	it('pick() returns an element from the array', () => {
		const rng = new SeededRandom(42);
		const arr = ['a', 'b', 'c'];
		for (let i = 0; i < 20; i++) {
			expect(arr).toContain(rng.pick(arr));
		}
	});

	it('chance() returns boolean', () => {
		const rng = new SeededRandom(42);
		let trueCount = 0;
		for (let i = 0; i < 1000; i++) {
			if (rng.chance(0.5)) trueCount++;
		}
		// Should be roughly 50% (allow wide range for small sample)
		expect(trueCount).toBeGreaterThan(400);
		expect(trueCount).toBeLessThan(600);
	});
});

describe('hashSeed', () => {
	it('produces consistent hash for same string', () => {
		expect(hashSeed('hello')).toBe(hashSeed('hello'));
	});

	it('produces different hashes for different strings', () => {
		expect(hashSeed('hello')).not.toBe(hashSeed('world'));
	});

	it('returns a number', () => {
		expect(typeof hashSeed('test')).toBe('number');
	});
});

describe('createRng', () => {
	it('accepts string seed', () => {
		const rng = createRng('my-seed');
		expect(rng.next()).toBeGreaterThanOrEqual(0);
	});

	it('accepts number seed', () => {
		const rng = createRng(42);
		expect(rng.next()).toBeGreaterThanOrEqual(0);
	});

	it('same string seed = same sequence', () => {
		const rng1 = createRng('test-seed');
		const rng2 = createRng('test-seed');
		const seq1 = Array.from({ length: 10 }, () => rng1.next());
		const seq2 = Array.from({ length: 10 }, () => rng2.next());
		expect(seq1).toEqual(seq2);
	});
});

describe('randomSeedString', () => {
	it('returns a non-empty string', () => {
		const seed = randomSeedString();
		expect(seed.length).toBeGreaterThan(0);
	});

	it('returns different seeds on successive calls', () => {
		const seeds = new Set(Array.from({ length: 10 }, () => randomSeedString()));
		expect(seeds.size).toBeGreaterThan(1);
	});
});
