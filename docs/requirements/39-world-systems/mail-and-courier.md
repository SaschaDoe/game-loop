# Mail and Courier System

As a player, I want to send and receive letters via a courier system, so that I can communicate with distant NPCs, receive quest updates, and manage my affairs remotely.

## Details

- Post offices in every town; courier NPCs travel between them
- Send letters: write to any NPC you've met (free-text via LLM, they respond in character)
- Receive letters: NPCs send you messages — quest updates, warnings, invitations, love letters, threats
- Delivery time: depends on distance (10-50 turns between towns)
- Package delivery: send items to NPCs or your own home storage (costs gold)
- Intercepted mail: in wartime or high-bounty situations, letters may be intercepted by enemies
- Coded letters: write in code to avoid interception (requires recipient to have the cipher)
- Quest delivery: some quests require delivering sealed letters without reading them (temptation: open and read?)
- Mail notification: letter icon in HUD when mail arrives at any post office you've visited

## Acceptance Criteria

- [ ] Letters can be sent to and received from any met NPC
- [ ] NPC responses are LLM-generated and in-character
- [ ] Delivery times scale with distance
- [ ] Mail interception triggers in appropriate situations
