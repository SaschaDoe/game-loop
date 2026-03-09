import { describe, it, expect } from 'vitest';
import { parseCommand } from './driver-commands';

describe('parseCommand', () => {
	it('parses directional movement', () => {
		expect(parseCommand('move north')).toEqual({ type: 'keys', keys: ['w'] });
		expect(parseCommand('go south')).toEqual({ type: 'keys', keys: ['s'] });
		expect(parseCommand('east')).toEqual({ type: 'keys', keys: ['d'] });
		expect(parseCommand('west')).toEqual({ type: 'keys', keys: ['a'] });
		expect(parseCommand('n')).toEqual({ type: 'keys', keys: ['w'] });
	});

	it('parses wait', () => {
		expect(parseCommand('wait')).toEqual({ type: 'keys', keys: ['.'] });
	});

	it('parses rest', () => {
		expect(parseCommand('rest')).toEqual({ type: 'keys', keys: ['r'] });
	});

	it('parses defend', () => {
		expect(parseCommand('defend')).toEqual({ type: 'keys', keys: ['b'] });
	});

	it('parses dialog choice', () => {
		expect(parseCommand('choose 1')).toEqual({ type: 'dialog', index: 0 });
		expect(parseCommand('dialog 3')).toEqual({ type: 'dialog', index: 2 });
		expect(parseCommand('1')).toEqual({ type: 'dialog', index: 0 });
	});

	it('parses inventory', () => {
		expect(parseCommand('inventory')).toEqual({ type: 'keys', keys: ['i'] });
		expect(parseCommand('inv')).toEqual({ type: 'keys', keys: ['i'] });
	});

	it('parses inspect commands', () => {
		expect(parseCommand('status')).toEqual({ type: 'inspect', target: 'status' });
		expect(parseCommand('quests')).toEqual({ type: 'inspect', target: 'quests' });
		expect(parseCommand('look')).toEqual({ type: 'inspect', target: 'look' });
	});

	it('parses escape', () => {
		expect(parseCommand('back')).toEqual({ type: 'keys', keys: ['Escape'] });
		expect(parseCommand('cancel')).toEqual({ type: 'keys', keys: ['Escape'] });
		expect(parseCommand('escape')).toEqual({ type: 'keys', keys: ['Escape'] });
	});

	it('parses stairs', () => {
		expect(parseCommand('descend')).toEqual({ type: 'keys', keys: ['>'] });
		expect(parseCommand('stairs')).toEqual({ type: 'keys', keys: ['>'] });
	});

	it('parses ability keys', () => {
		expect(parseCommand('ability 1')).toEqual({ type: 'keys', keys: ['1'] });
		expect(parseCommand('ability 2')).toEqual({ type: 'keys', keys: ['2'] });
	});

	it('returns unknown for unrecognized input', () => {
		expect(parseCommand('asdfghjkl')).toEqual({ type: 'unknown', raw: 'asdfghjkl' });
	});
});
