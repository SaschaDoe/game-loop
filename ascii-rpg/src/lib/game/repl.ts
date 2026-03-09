import * as readline from 'node:readline';
import { GameDriver } from './driver';
import type { CharacterClass } from './types';

const args = process.argv.slice(2);
const classArg = args.find(a => a.startsWith('--class='))?.split('=')[1] as CharacterClass | undefined;
const seedArg = args.find(a => a.startsWith('--seed='))?.split('=')[1];

const game = new GameDriver({
	...(classArg && { characterClass: classArg }),
	...(seedArg && { worldSeed: seedArg }),
});

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: '> ',
});

function printMessages(): void {
	const text = game.log();
	if (text) console.log(text);
}

function printHelp(): void {
	console.log(`
=== Aethermoor Headless REPL ===

MOVEMENT:    north/n, south/s, east/e, west/w  (or raw keys: w,a,s,d)
ACTIONS:     wait, rest, defend, descend/stairs, examine
DIALOG:      choose <n>, or just type a number (1, 2, 3...)
INVENTORY:   inventory/inv
SPELLS:      spellmenu, ability <n>
INSPECT:     status, quests, look, spells, map
NAVIGATION:  back/cancel/escape

CHEATS (prefix with /):
  /godmode          - unkillable, massive stats
  /kill             - kill all enemies
  /give <item_id>   - add item to inventory
  /tp <x> <y>       - teleport to position
  /level <n>        - set character level
  /spell <id>       - learn a spell
  /allspells        - learn all spells
  /allrituals       - learn all rituals
  /ritual <id>      - learn a ritual
  /mood <npc> <mood> - set NPC mood
  /graduate         - complete academy
  /spawn <name> <x> <y> - spawn enemy
  /state <path>     - inspect any state path (e.g. /state player.hp)

  /help             - show this help
  /quit             - exit
`);
}

function handleCheat(input: string): void {
	const parts = input.slice(1).split(/\s+/);
	const cmd = parts[0];
	switch (cmd) {
		case 'godmode': case 'god':
			game.godMode();
			console.log('GOD MODE activated.');
			break;
		case 'kill': case 'killall':
			game.killAll();
			console.log('All enemies killed.');
			break;
		case 'give':
			if (parts[1]) {
				game.giveItem(parts[1], parseInt(parts[2] || '1', 10));
				console.log(`Gave ${parts[1]}.`);
			}
			break;
		case 'tp': case 'teleport':
			if (parts[1] && parts[2]) {
				game.teleport(parseInt(parts[1], 10), parseInt(parts[2], 10));
				console.log(`Teleported to (${parts[1]}, ${parts[2]}).`);
			}
			break;
		case 'level':
			if (parts[1]) {
				game.setLevel(parseInt(parts[1], 10));
				console.log(`Level set to ${parts[1]}.`);
			}
			break;
		case 'spell':
			if (parts[1]) {
				game.learnSpell(parts[1]);
				console.log(`Learned spell ${parts[1]}.`);
			}
			break;
		case 'allspells':
			game.learnAllSpells();
			console.log('All spells learned.');
			break;
		case 'allrituals':
			game.learnAllRituals();
			console.log('All rituals learned.');
			break;
		case 'ritual':
			if (parts[1]) {
				game.learnRitual(parts[1]);
				console.log(`Learned ritual ${parts[1]}.`);
			}
			break;
		case 'mood':
			if (parts[1] && parts[2]) {
				game.setNpcMood(parts[1], parts[2] as any);
				console.log(`Set ${parts[1]} mood to ${parts[2]}.`);
			}
			break;
		case 'graduate':
			game.graduateAcademy();
			console.log('Academy graduated.');
			break;
		case 'spawn':
			if (parts[1] && parts[2] && parts[3]) {
				game.spawnEnemy(parts[1], parseInt(parts[2], 10), parseInt(parts[3], 10));
				console.log(`Spawned ${parts[1]} at (${parts[2]}, ${parts[3]}).`);
			}
			break;
		case 'state': {
			if (parts[1]) {
				const path = parts[1].split('.');
				let val: unknown = game.state;
				for (const p of path) {
					if (val == null || typeof val !== 'object') break;
					val = (val as Record<string, unknown>)[p];
				}
				console.log(JSON.stringify(val, null, 2));
			}
			break;
		}
		case 'help':
			printHelp();
			break;
		case 'quit': case 'exit':
			process.exit(0);
			break;
		default:
			console.log(`Unknown cheat: ${cmd}. Type /help for commands.`);
	}
}

function showDialogPrompt(): void {
	if (game.dialog) {
		const node = game.dialog.tree.nodes[game.dialog.currentNodeId];
		if (node) {
			console.log(`\n[${game.dialog.npcName}]: ${node.npcText}`);
			node.options.forEach((opt, i) => {
				console.log(`  ${i + 1}. ${opt.text}`);
			});
		}
	}
}

// Startup
console.log(`Aethermoor REPL - ${game.state.characterConfig.characterClass} "${game.state.player.name}"`);
console.log(`Type /help for commands.\n`);
printMessages();
showDialogPrompt();
rl.prompt();

rl.on('line', (line) => {
	const input = line.trim();
	if (!input) {
		rl.prompt();
		return;
	}

	if (input.startsWith('/')) {
		handleCheat(input);
	} else {
		game.command(input);
		printMessages();
		showDialogPrompt();
	}

	if (game.state.gameOver) {
		console.log('\n=== GAME OVER ===');
		console.log('Press r to restart or /quit to exit.');
	}

	rl.prompt();
});

rl.on('close', () => {
	console.log('\nGoodbye!');
	process.exit(0);
});
