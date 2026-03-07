# Transmutation

As a player alchemist, I want to transmute base materials into more valuable ones through alchemical processes, so that alchemy extends beyond potion-making into material transformation.

## Details

- **Transmutation Circle**: required for all transmutation; drawn with arcane chalk (consumable); complexity determines what can be transmuted; takes 3 turns to draw; disrupting the circle mid-process causes an explosion (AoE damage)
- **Material Transmutation Tiers**:
  - **Tier 1 (Novice)**: transmute between base materials; wood to stone, clay to glass, iron to copper; 1:1 ratio; useful for getting crafting materials
  - **Tier 2 (Adept)**: transmute metals upward; copper to silver (5:1 ratio), iron to steel (3:1); cheaper than buying refined materials
  - **Tier 3 (Expert)**: transmute precious materials; silver to gold (10:1 ratio — the classic philosopher's dream); steel to mithril (20:1); economically powerful
  - **Tier 4 (Master)**: transmute magical materials; gold to orichalcum (5:1); mithril to adamantine (10:1); create materials that can't be mined
  - **Tier 5 (Grandmaster)**: transmute concepts; convert mana into physical objects (conjuration-like); convert experience into items (lose XP, gain unique item); the boundary between alchemy and creation
- **Philosopher's Stone**: legendary alchemical item; 1:1 transmutation of any material to any other; never consumed; quest to create requires: 100 Alchemy skill, Grand Transmutation Circle, 7 rare ingredients gathered across the world, and 50 turns of uninterrupted work; having it makes you the richest person in the world
- **Failed Transmutation**: insufficient skill or wrong ratios; materials are destroyed (50% loss); critical failure = explosion + material becomes a toxic substance; very high failure risk at higher tiers
- **Economic Impact**: flooding the market with transmuted gold crashes prices; NPCs adjust to your output; kings may outlaw transmutation if it threatens their economy; must be strategic about selling
- **Living Transmutation**: transmuting living tissue is forbidden; attempting to transmute a living creature requires Tier 5 + dark arts knowledge; results are horrific (chimera creation, failed homunculi); massive evil karma

## Acceptance Criteria

- [ ] Transmutation circle required and disruption causes explosion
- [ ] Material ratios calculate correctly per tier
- [ ] Philosopher's Stone quest requires correct prerequisites and provides correct power
- [ ] Failed transmutation destroys materials at correct rates
- [ ] Economic impact adjusts NPC pricing based on player gold flooding
