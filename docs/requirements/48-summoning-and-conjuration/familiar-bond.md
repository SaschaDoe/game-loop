# Familiar Bond

As a player, I want to bond with a magical familiar that shares my senses and grows with me, so that summoners have a permanent companion with a unique progression.

## Details

- **Familiar Types** (chosen at first summoning, permanent):
  - **Raven**: flying scout; can carry small items; speaks in riddles; grants +2 WIS; perches on shoulder
  - **Cat**: stealth expert; detects invisible creatures; grants +2 DEX; can distract enemies
  - **Toad**: alchemical focus; taste-tests potions safely; grants +2 CON; absorbs one poison per day
  - **Snake**: combat assistant; venomous bite (2 poison damage); grants +2 INT; wraps around arm
  - **Owl**: night vision; silent flight for scouting; grants +2 Perception at night; sits on head
  - **Fox**: social assistant; charm aura (+1 CHA); can pickpocket small items; grants +2 CHA; rides in backpack
- **Familiar Bond Mechanics**:
  - Shared senses: see through familiar's eyes (command); hear through familiar's ears; feel its pain (take 25% of familiar's damage)
  - Familiar HP: low (10-20 based on level); if killed, can be resummoned after 100 turns; repeated deaths weaken the bond (-1 to familiar's stats permanently, recoverable via ritual)
  - Range: familiar can move up to 20 tiles from the player; beyond that, the bond stretches (shared senses degrade, then fail at 50 tiles)
- **Familiar Progression**: familiar gains abilities as the summoner levels:
  - Level 5: familiar can deliver touch spells at range (cast through the familiar)
  - Level 10: telepathic link (silent communication, no range limit within same map)
  - Level 15: familiar can transform into a larger combat form for 10 turns (medium creature, decent stats)
  - Level 20: permanent enhancement — familiar gains an elemental affinity matching the summoner's attunement
- **Familiar Personality**: LLM-generated personality based on type; develops opinions and preferences over time; may refuse requests it finds distasteful
- **Familiar Dialogue**: player can talk to their familiar; it comments on situations, warns of danger, and occasionally provides cryptic hints about nearby secrets

## Acceptance Criteria

- [ ] All familiar types provide correct stat bonuses and abilities
- [ ] Shared senses function with correct range limits
- [ ] Familiar death and resummoning work with bond weakening
- [ ] Progression abilities unlock at correct summoner levels
- [ ] LLM generates consistent familiar personality and dialogue
