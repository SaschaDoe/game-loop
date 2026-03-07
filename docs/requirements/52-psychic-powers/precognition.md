# Precognition

As a player, I want to glimpse future events and use foresight tactically, so that psychic characters have a unique information advantage.

## Details

- **Precognition Abilities**:
  - **Danger Sense** (passive, Lv1): 1 turn before an ambush, trap, or surprise attack, a warning flashes ("You sense danger!"); gives the player a free turn to react
  - **Combat Foresight** (Lv5): see the enemy's next action 1 turn in advance (displayed as a ghost preview of their movement/attack); costs 3 psi/turn to maintain
  - **Path Preview** (Lv3): spend 5 psi to see 3 turns into the future for a specific action ("If I open this door, what happens?"); shows a brief vision of the outcome
  - **Death Warning** (Lv8): when an action would result in the player's death, time freezes and the player gets to choose a different action; once per combat; costs 15 psi
  - **Prophecy** (Lv12): meditate for 10 turns to receive a vision of a future event (quest-related, treasure location, or NPC action); visions are symbolic and require interpretation
  - **Timeline Split** (Lv18): create a save state; play forward for 10 turns; then choose to keep the result or rewind; costs 25 psi; once per day
  - **Oracle's Eye** (Lv25): passive; always see 1 turn ahead in combat (enemy actions shown as ghosts); combat becomes significantly easier; heavy psi drain
- **Precognition Limits**:
  - Visions show probabilities, not certainties; changing actions after seeing a vision may change the outcome
  - High-level precognition causes temporal headaches (-2 WIS for 10 turns after heavy use)
  - Some enemies are "temporally shielded" (bosses, chronomancers); their actions can't be foreseen
  - Future visions from Prophecy are deliberately cryptic; LLM generates symbolic imagery the player must interpret
- **Precognition vs Chronomancy**: precognition sees the future but can't change it directly; chronomancy changes the past; combining both creates paradoxes (dangerous but powerful)
- **NPC Oracles**: NPC psychics who offer prophecies for gold; their accuracy depends on skill and honesty (some are frauds)

## Acceptance Criteria

- [ ] Danger Sense warns before ambushes and traps
- [ ] Combat Foresight correctly previews enemy actions
- [ ] Death Warning prevents one lethal action per combat
- [ ] Prophecy generates symbolic LLM visions that are interpretable
- [ ] Timeline Split allows rewinding 10 turns correctly
