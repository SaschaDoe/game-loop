import { describe, it, expect } from 'vitest';
import { NPC_DIALOGUE_TREES } from './dialogue';

describe('Farmer Edric dialogue tree', () => {
	const tree = NPC_DIALOGUE_TREES['Farmer Edric'];

	it('should exist in NPC_DIALOGUE_TREES', () => {
		expect(tree).toBeDefined();
		expect(tree.startNode).toBe('start');
		expect(tree.returnNode).toBe('investigation_done');
	});

	it('should have all expected nodes', () => {
		const expectedNodes = [
			'start', 'symptoms', 'vision_detail', 'help_request',
			'quest_accepted', 'investigation_done', 'ley_explained',
			'ward_well', 'redirect_flow',
		];
		for (const nodeId of expectedNodes) {
			expect(tree.nodes[nodeId], `node "${nodeId}" should exist`).toBeDefined();
		}
	});

	it('start node should offer quest acceptance', () => {
		const n = tree.nodes['start'];
		expect(n.npcText).toContain('crops grow twisted');
		const acceptOpt = n.options.find(o => o.text.includes('Accept: Blighted Harvest'));
		expect(acceptOpt).toBeDefined();
		expect(acceptOpt!.onSelect?.acceptQuest).toBe('blighted_harvest');
	});

	it('symptoms node should mention seven figures', () => {
		const n = tree.nodes['symptoms'];
		expect(n.npcText).toContain('seven figures');
	});

	it('vision_detail node should offer quest acceptance', () => {
		const n = tree.nodes['vision_detail'];
		expect(n.npcText).toContain('wearing masks');
		const acceptOpt = n.options.find(o => o.text.includes('Accept: Blighted Harvest'));
		expect(acceptOpt).toBeDefined();
		expect(acceptOpt!.onSelect?.acceptQuest).toBe('blighted_harvest');
	});

	it('help_request node should offer quest acceptance', () => {
		const n = tree.nodes['help_request'];
		const acceptOpt = n.options.find(o => o.text.includes('Accept: Blighted Harvest'));
		expect(acceptOpt).toBeDefined();
		expect(acceptOpt!.onSelect?.acceptQuest).toBe('blighted_harvest');
	});

	it('ley_explained node should have conditional ward and redirect options', () => {
		const n = tree.nodes['ley_explained'];
		expect(n.npcText).toContain('ley line');

		const wardOpt = n.options.find(o => o.text.includes('Ward the Well'));
		expect(wardOpt).toBeDefined();
		expect(wardOpt!.showIf).toEqual({ type: 'hasRitual', value: 'ward_of_protection' });

		const redirectOpt = n.options.find(o => o.text.includes('Redirect the Flow'));
		expect(redirectOpt).toBeDefined();
		expect(redirectOpt!.showIf).toEqual({ type: 'questCompleted', value: 'threads_of_power' });
	});

	it('ward_well and redirect_flow nodes should have message effects', () => {
		const ward = tree.nodes['ward_well'];
		expect(ward.options[0].onSelect?.message).toContain('well is safe');

		const redirect = tree.nodes['redirect_flow'];
		expect(redirect.options[0].onSelect?.message).toContain('farm is restored');
	});

	it('all nodes should have valid nextNode references', () => {
		for (const [nodeId, n] of Object.entries(tree.nodes)) {
			for (const option of n.options) {
				expect(
					tree.nodes[option.nextNode] || option.nextNode === '__exit__',
					`option "${option.text}" in ${nodeId} references non-existent node "${option.nextNode}"`
				).toBeTruthy();
			}
		}
	});
});
