# Resurrection Mechanics

As a player, I want multiple ways to be resurrected after death beyond just reloading, so that death has narrative weight while still allowing continued play.

## Details

- **Resurrection Methods**:
  - **Divine Intervention**: if the player has high enough reputation with a temple, a deity resurrects them at the nearest shrine (costs all gold, -1 max HP permanently)
  - **Companion Rescue**: a surviving companion can carry the player to a healer within 10 turns; success = revive at 25% HP; failure = permadeath
  - **Phylactery (Lich Path)**: necromancers can create a soul phylactery; on death, respawn at phylactery location after 20 turns; phylactery is destructible
  - **Phoenix Feather**: rare consumable, auto-triggers on death, full HP restore, one-time use; extremely rare drop
  - **Deal with Death**: in the ghost realm (see death-mechanics), negotiate with the Reaper NPC (LLM dialogue) — bargain for your life at a cost (years of life = stat reduction, a quest for Death, a soul debt)
  - **Necromantic Revival**: another player or NPC necromancer can raise you as undead (lose CHA, gain undead immunities, living NPCs react with fear/hostility)
- **Resurrection Sickness**: after any resurrection, suffer -3 to all stats for 100 turns; stacks if resurrected multiple times
- **Death Counter**: tracked permanently; NPCs reference how many times you've died ("You again? How do you keep coming back?")
- **Permanent Death Mode**: optional mode where death is truly final (see challenge-modes/ironman-mode)
- Resurrection is never free — every method has a meaningful cost

## Acceptance Criteria

- [ ] All resurrection methods function with correct costs
- [ ] Resurrection sickness applies and stacks correctly
- [ ] Death counter persists and influences NPC dialogue
- [ ] Deal with Death LLM negotiation works
- [ ] Necromantic revival changes character type to undead
