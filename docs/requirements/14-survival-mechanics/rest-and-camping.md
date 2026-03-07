# Rest and Camping

As a player, I want to set up camp and rest in safe areas, so that I can restore health and mana, skip time, and manage my character between adventures.

## Details

- Rest action available when no enemies are nearby
- Short rest: restores some HP/mana, advances time 10 turns
- Long rest (camp): fully restores HP/mana, advances time 100 turns, requires a bedroll
- Camping has a chance of random encounter (ambush while sleeping)
- Campfire provides light, warmth (cold biome buff), and cooking ability
- Safe rest locations (inns, camps with guards) have no ambush risk
- Companions share camp dialogue during rest (LLM-powered fireside chats)

## Acceptance Criteria

- [ ] Short and long rest restore appropriate resources
- [ ] Time advances correctly during rest
- [ ] Ambush encounters trigger during wilderness camping
- [ ] Safe locations prevent ambushes
