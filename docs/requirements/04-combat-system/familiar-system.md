# Familiar System

As a Mage player, I want to bond with a magical familiar that provides passive bonuses and scouts ahead, so that spellcasters have a utility companion distinct from the pet system.

## Details

- Familiars available to: Mage, Necromancer, Warlock (not same as pets — magical constructs, not animals)
- Familiar types:
  - **Imp**: fire resistance, can carry 1 small item, detects traps in a 3-tile radius
  - **Owl**: extended sight range (+3), reveals hidden enemies, delivers messages to NPCs
  - **Cat (spectral)**: +2 Dexterity, lands on feet (reduced fall damage), can squeeze through small gaps to scout
  - **Raven**: can read inscriptions from a distance, +1 Intelligence, mimics sounds to distract enemies
  - **Skull (floating)**: +2 to necromancy spells, intimidates weak enemies (may flee on sight), immune to poison areas
  - **Wisp**: provides constant light source, +1 to all saving throws, can be sent to scout rooms ahead
- Familiars cannot fight but can be targeted by enemies (if killed, resummon after 50 turns)
- Familiar bond: over time, familiar develops personality quirks (LLM-generated comments)
- Familiar sight: press a key to see through your familiar's eyes (scout ahead without moving)
- One familiar at a time; can be dismissed and replaced at any summoning circle

## Acceptance Criteria

- [ ] All familiar types provide correct passive bonuses
- [ ] Familiar sight scouting is functional
- [ ] Familiars can be killed and resummoned
- [ ] Familiar personality develops over time via LLM
