import { describe, it, expect } from 'vitest';
import { NPC_DIALOGUE_TREES } from './dialogue';

describe('Prof. Ignis ley line dialogue nodes', () => {
	const tree = NPC_DIALOGUE_TREES['Professor Ignis Valdren'];

	it('should have ley_lines_intro node', () => {
		const n = tree.nodes['ley_lines_intro'];
		expect(n).toBeDefined();
		expect(n.npcText).toContain('ley lines');
		expect(n.options.length).toBe(3);
	});

	it('should have ley_explanation node', () => {
		const n = tree.nodes['ley_explanation'];
		expect(n).toBeDefined();
		expect(n.npcText).toContain('convergence');
	});

	it('should have ley_teach_truesight node with learnSpell effect', () => {
		const n = tree.nodes['ley_teach_truesight'];
		expect(n).toBeDefined();
		expect(n.npcText).toContain('True Sight');
		const learnOpt = n.options.find(o => o.text === '[Learn True Sight]');
		expect(learnOpt).toBeDefined();
		expect(learnOpt!.onSelect?.learnSpell).toBe('spell_true_sight');
	});

	it('should have ley_teach_truesight "already know" option gated by hasSpell', () => {
		const n = tree.nodes['ley_teach_truesight'];
		const alreadyOpt = n.options.find(o => o.text === 'I already know True Sight.');
		expect(alreadyOpt).toBeDefined();
		expect(alreadyOpt!.showIf).toEqual({ type: 'hasSpell', value: 'spell_true_sight' });
	});

	it('should have ley_quest_start node with acceptQuest effect', () => {
		const n = tree.nodes['ley_quest_start'];
		expect(n).toBeDefined();
		const acceptOpt = n.options.find(o => o.text.includes('Threads of Power'));
		expect(acceptOpt).toBeDefined();
		expect(acceptOpt!.onSelect?.acceptQuest).toBe('threads_of_power');
	});

	it('should have ley_quest_accepted node', () => {
		const n = tree.nodes['ley_quest_accepted'];
		expect(n).toBeDefined();
		expect(n.npcText).toContain('deeper theory');
		expect(n.options[0].nextNode).toBe('return');
	});

	it('should have a return-node option linking to ley_lines_intro gated by academyEnrolled', () => {
		const returnNode = tree.nodes['return'];
		const leyOpt = returnNode.options.find(o => o.nextNode === 'ley_lines_intro');
		expect(leyOpt).toBeDefined();
		expect(leyOpt!.text).toContain('ley lines');
		expect(leyOpt!.showIf).toEqual({ type: 'academyEnrolled' });
	});

	it('all ley line nodes should have valid nextNode references', () => {
		const leyNodeIds = ['ley_lines_intro', 'ley_explanation', 'ley_teach_truesight', 'ley_quest_start', 'ley_quest_accepted'];
		for (const nodeId of leyNodeIds) {
			const n = tree.nodes[nodeId];
			expect(n, `node ${nodeId} should exist`).toBeDefined();
			for (const option of n.options) {
				expect(
					tree.nodes[option.nextNode] || option.nextNode === '__exit__',
					`option "${option.text}" in ${nodeId} references non-existent node "${option.nextNode}"`
				).toBeTruthy();
			}
		}
	});
});
