# Rebellion

As a player, I want to start or join a rebellion against an unjust ruler, progressing from underground resistance to open revolt, so that political gameplay includes revolutionary change.

## Details

- **Rebellion Prerequisites**: kingdom must have "Oppression" score above 60 (from: high taxes, brutal punishments, religious persecution, racial discrimination, military conscription); player must have contacts among the oppressed populace
- **Rebellion Phases**:
  - **Phase 1 — Underground (turns 1-200)**: recruit secretly; hold secret meetings in basements and forests; spread propaganda (leaflets, speeches in disguise); avoid the king's spies; discovery = imprisonment; build rebel reputation separate from public reputation
  - **Phase 2 — Resistance (turns 201-500)**: sabotage government operations (poison supplies, burn tax records, free prisoners); ambush patrols; establish safe houses; the king knows a rebellion exists but not who leads it; cat-and-mouse with the secret police
  - **Phase 3 — Open Revolt (turns 501+)**: enough support gathered; declare rebellion publicly; pitched battles between rebel forces and royal army; siege the capital or defend rebel territory; other factions choose sides; outcome determines the kingdom's future
- **Rebel Actions**:
  - **Recruit**: CHA check; convince NPCs to join; each recruit adds a soldier or specialist (healer, spy, blacksmith) to the cause; risky if recruiting near loyalists
  - **Sabotage**: DEX/INT missions; destroy supply depots, cut communications, poison water supplies (morally questionable); weakens the royal army
  - **Propaganda**: CHA + Deception; spread messages about the king's tyranny; raises public support; lowers guard morale; if intercepted, traced back to you
  - **Diplomacy**: seek foreign aid (neighboring kingdoms may support you for political gain); hire mercenaries; forge alliances with other oppressed groups (mages if magic is banned, a minority race if they're persecuted)
  - **Assassination**: target key regime figures (generals, tax collectors, the king himself); high risk, high reward; killing civilians in the process damages rebel reputation
- **Rebel Leadership**: as rebellion grows, manage: troop allocation, supply lines, morale, and internal politics (hardliners vs moderates within the rebellion); failure to manage = rebellion splinters
- **Victory Outcomes**: overthrow the king = choose new government type (democracy, new monarchy, theocracy, anarchy); each has different consequences for the kingdom's future; the player can claim the throne themselves
- **Failure Outcomes**: rebellion crushed = mass executions, player exiled or imprisoned; underground remnants may try again later with new leadership

## Acceptance Criteria

- [ ] Rebellion unlocks when oppression score exceeds threshold
- [ ] All three phases progress on correct timelines with correct mechanics
- [ ] Rebel actions use correct skill checks and produce correct effects
- [ ] Leadership management affects rebellion cohesion
- [ ] Victory and failure outcomes permanently reshape the kingdom
