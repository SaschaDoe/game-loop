export type ParsedCommand =
	| { type: 'keys'; keys: string[] }
	| { type: 'dialog'; index: number }
	| { type: 'inspect'; target: 'status' | 'quests' | 'look' | 'inventory' | 'spells' | 'map' }
	| { type: 'unknown'; raw: string };

const DIRECTION_MAP: Record<string, string> = {
	north: 'w', south: 's', east: 'd', west: 'a',
	up: 'w', down: 's', left: 'a', right: 'd',
	n: 'w', s: 's', e: 'd', w: 'a',
};

export function parseCommand(input: string): ParsedCommand {
	const trimmed = input.trim().toLowerCase();
	const parts = trimmed.split(/\s+/);
	const cmd = parts[0];
	const arg = parts[1];

	// Single digit → dialog choice
	if (/^\d+$/.test(trimmed)) {
		return { type: 'dialog', index: parseInt(trimmed, 10) - 1 };
	}

	// Movement: "move north", "go east", or just "north"
	if (cmd === 'move' || cmd === 'go') {
		const dir = DIRECTION_MAP[arg];
		if (dir) return { type: 'keys', keys: [dir] };
	}
	if (DIRECTION_MAP[cmd] && parts.length === 1) {
		return { type: 'keys', keys: [DIRECTION_MAP[cmd]] };
	}

	// Dialog choices: "choose 1", "dialog 2"
	if ((cmd === 'choose' || cmd === 'dialog' || cmd === 'pick' || cmd === 'select') && arg) {
		const idx = parseInt(arg, 10);
		if (!isNaN(idx)) return { type: 'dialog', index: idx - 1 };
	}

	// Ability: "ability 1"
	if (cmd === 'ability' && arg) {
		const n = parseInt(arg, 10);
		if (n >= 1 && n <= 9) return { type: 'keys', keys: [String(n)] };
	}

	// Simple key mappings
	const SIMPLE: Record<string, string[]> = {
		wait: ['.'],
		rest: ['r'],
		defend: ['b'], block: ['b'],
		inventory: ['i'], inv: ['i'],
		descend: ['>'], stairs: ['>'],
		back: ['Escape'], cancel: ['Escape'], escape: ['Escape'],
		examine: ['x'], interact: ['x'],
		spellmenu: ['m'],
	};
	if (SIMPLE[trimmed]) return { type: 'keys', keys: SIMPLE[trimmed] };

	// Inspect commands
	const INSPECTS: Record<string, 'status' | 'quests' | 'look' | 'inventory' | 'spells' | 'map'> = {
		status: 'status', stats: 'status',
		quests: 'quests', quest: 'quests',
		look: 'look', surroundings: 'look',
		spells: 'spells',
		map: 'map', location: 'map',
	};
	if (INSPECTS[trimmed]) return { type: 'inspect', target: INSPECTS[trimmed] };

	return { type: 'unknown', raw: trimmed };
}
