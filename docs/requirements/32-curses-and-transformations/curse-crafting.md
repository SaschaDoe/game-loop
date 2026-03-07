# Curse Crafting

As a player, I want to craft custom curses to inflict on enemies, items, and locations, so that dark magic users have an offensive debuff creation system.

## Details

- **Curse Components**:
  - **Catalyst**: what carries the curse (item, food, letter, spoken word, touch, gaze)
  - **Effect**: what the curse does (stat drain, bad luck, transformation, pain, madness, death)
  - **Trigger**: when the curse activates (on equip, on read, on touch, on eye contact, delayed timer, conditional — "when you betray someone")
  - **Duration**: temporary (100 turns), long-term (1000 turns), permanent (until dispelled), escalating (worsens over time)
- **Curse Recipes**:
  - **Curse of Weakness**: hair/blood of target + black candle + spoken incantation; -3 STR for 200 turns; range: any distance if you have target's hair; Necromancy 3 required
  - **Curse of Poverty**: target's coin + ash + raven feather; all gold earned is halved; 500 turns; attach to a gifted item (triggers on possession)
  - **Curse of Paranoia**: target's name written in blood + nightmare dust; target hears whispers, sees shadows, trusts no one; NPCs affected become hostile to allies; 300 turns; Enchanting 4 required
  - **Doom Curse**: skull + black pearl + target's blood; target takes 1 damage per 10 turns (unstoppable); permanent until dispelled; requires Necromancy 7
  - **Lycanthropy Curse**: wolf fang + target's blood + full moon casting; target becomes a werewolf; permanent; extremely difficult to create (Necromancy 8)
  - **Love Curse**: rose + target's possession + honey; target becomes infatuated with the caster; WIS save resists; 200 turns; ethically monstrous; some factions hunt love cursers
- **Curse Delivery**: must get the catalyst to the target; direct touch (risky), gifted item (deceptive), planted in their home (stealth required), spoken at close range (CHA + Necromancy check), sent via letter/package
- **Curse Detection**: targets with high WIS or Arcana may detect the curse before it activates; Detect Magic reveals cursed items; cautious NPCs are harder to curse
- **Karma**: crafting and delivering curses is always an evil act; repeated cursing builds dark karma rapidly; divine entities may intervene against prolific cursers

## Acceptance Criteria

- [ ] All curse components combine into correct curse effects
- [ ] Delivery methods require correct skill checks
- [ ] Curse durations and effects apply correctly to targets
- [ ] Detection mechanics allow targets to resist with correct skills
- [ ] Karma system penalizes curse crafting appropriately
