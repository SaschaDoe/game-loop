# Near-Death Experience

As a player, I want near-death moments to trigger special visions and gameplay effects, so that brushing with death is dramatic and mechanically interesting.

## Details

- **Trigger**: when player HP drops to 1-5% of max HP and survives the encounter; also triggers when resurrected or healed from 0 HP
- **Vision Types** (LLM-generated based on character history):
  - **Life Flash**: rapid replay of key character moments (major quests, first kill, relationships); provides a random permanent +1 to a stat ("renewed purpose")
  - **Death's Door**: brief visit to the afterlife; see deceased NPCs; they offer cryptic advice about current quests or warnings about future dangers
  - **Premonition**: vision of a future event (upcoming boss, betrayal, natural disaster); gives 1 specific actionable hint; vision may be literal or symbolic
  - **Dark Bargain**: a death entity offers a deal (extra life in exchange for a permanent debuff, or a powerful ability that costs lifespan); player chooses to accept or refuse
  - **Ancestral Guidance**: if player has communed with ancestors before, they appear and grant a temporary powerful buff (30 turns) to help survive the current danger
- **Adrenaline Surge**: surviving near-death grants "Adrenaline" buff for 10 turns (+2 STR, +2 DEX, +20% damage, +2 movement speed); represents the rush of cheating death
- **Death Counter**: the game tracks total near-death experiences; milestones unlock titles ("Deathwalker" at 5, "Unkillable" at 10, "Death's Nemesis" at 25) and a passive death resistance bonus (+1% max HP per near-death experience, capped at +10%)
- **Psychological Effects**: frequent near-death experiences may trigger PTSD-like effects in the character (nightmares, combat hesitation); manageable through rest and meditation
- **Narrative Impact**: NPCs who witness your near-death react with concern, awe, or fear; LLM-powered dialogue references the event

## Acceptance Criteria

- [ ] Near-death triggers at correct HP thresholds
- [ ] Vision types generate via LLM with character-appropriate content
- [ ] Adrenaline buff applies correct bonuses for correct duration
- [ ] Death counter tracks correctly and milestones unlock
- [ ] Dark Bargain offers function with correct trade-offs
