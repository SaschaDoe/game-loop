/**
 * Seeded PRNG using Mulberry32 algorithm.
 * Produces deterministic sequences from a numeric seed.
 */
export class SeededRandom {
	private state: number;

	constructor(seed: number) {
		this.state = seed | 0;
	}

	/** Returns a float in [0, 1) */
	next(): number {
		this.state = (this.state + 0x6d2b79f5) | 0;
		let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	}

	/** Returns an integer in [0, max) */
	nextInt(max: number): number {
		return Math.floor(this.next() * max);
	}

	/** Returns an integer in [min, max] (inclusive) */
	nextRange(min: number, max: number): number {
		return min + Math.floor(this.next() * (max - min + 1));
	}

	/** Shuffles an array in-place (Fisher-Yates) */
	shuffle<T>(arr: T[]): T[] {
		for (let i = arr.length - 1; i > 0; i--) {
			const j = this.nextInt(i + 1);
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
	}

	/** Picks a random element from an array */
	pick<T>(arr: readonly T[]): T {
		return arr[this.nextInt(arr.length)];
	}

	/** Returns true with given probability (0-1) */
	chance(probability: number): boolean {
		return this.next() < probability;
	}
}

/** Hash a string into a 32-bit integer for use as a seed */
export function hashSeed(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const ch = str.charCodeAt(i);
		hash = ((hash << 5) - hash + ch) | 0;
	}
	return hash;
}

/** Create a SeededRandom from a string or number seed */
export function createRng(seed: string | number): SeededRandom {
	const numericSeed = typeof seed === 'string' ? hashSeed(seed) : seed;
	return new SeededRandom(numericSeed);
}

/** Generate a random seed string (for default/new games) */
export function randomSeedString(): string {
	return Math.random().toString(36).substring(2, 10);
}
