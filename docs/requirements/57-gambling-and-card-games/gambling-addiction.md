# Gambling Addiction

As a player, I want excessive gambling to risk developing a compulsive gambling habit with mechanical consequences, so that the gambling system has meaningful risk beyond gold loss.

## Details

- **Addiction Trigger**: gambling 10+ times within 200 turns builds "gambling urge"; each additional gamble increases urge; winning big accelerates addiction (the thrill); losing doesn't reduce it (chasing losses is part of the addiction)
- **Addiction Stages**:
  - **Casual (0-20 urge)**: no mechanical effect; occasional messages ("That was exciting, maybe one more round?")
  - **Enthusiast (21-50 urge)**: when near a gambling venue, periodic prompts suggest gambling; -1 WIS; gambling provides a small temporary mood boost (+1 CHA for 10 turns after gambling)
  - **Compulsive (51-80 urge)**: can't walk past a gambling venue without a WIS save or entering automatically; -2 WIS; bet sizes increase involuntarily (+25% minimum bet); NPC companions comment with concern
  - **Desperate (81-100 urge)**: character gambles automatically when near venues (no save); bets maximum amount; will sell equipment to keep gambling if gold runs out; -3 WIS, -1 INT; gambling debts accumulate with loan shark NPCs; debt collectors may attack
- **Gambling Debt**: losing more gold than you have creates debt with the venue; debt accrues interest (10% per 100 turns); debt collectors pursue you if unpaid; can lead to: imprisonment, forced labor, or bounty on your head
- **Recovery**: visit a counselor NPC (temples, certain healers); recovery program takes 200 turns of no gambling; WIS save each time you pass a venue during recovery (failure = relapse, reset progress); successful recovery removes addiction but urge resets to 0 slowly
- **Enablers and Supporters**: some NPCs encourage gambling (they profit from your losses); other NPCs support recovery (companions intervene, healers offer programs); choosing your social circle matters
- **Rock Bottom Event**: at maximum addiction, a scripted event occurs — lose everything in one catastrophic gambling session; wake up in an alley with nothing; serves as a narrative low point and motivation for recovery quest
- **Positive Ending**: successfully recovering from gambling addiction grants "Iron Will" permanent buff (+3 WIS saves vs all addiction/compulsion effects)

## Acceptance Criteria

- [ ] Urge builds correctly based on gambling frequency
- [ ] Addiction stages apply correct mechanical penalties
- [ ] Auto-gambling triggers correctly at compulsive/desperate stages
- [ ] Debt system tracks interest and triggers collectors
- [ ] Recovery program tracks progress and handles relapses correctly
