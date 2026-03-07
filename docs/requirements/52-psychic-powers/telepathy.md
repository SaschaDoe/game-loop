# Telepathy

As a player, I want to read minds, project thoughts, and communicate silently, so that psychic powers expand dialogue and stealth options beyond speech.

## Details

- **Telepathy Abilities**:
  - **Surface Read** (Lv1): read an NPC's current emotion and surface thought (displayed as a thought bubble over their tile); reveals disposition and immediate intent
  - **Deep Scan** (Lv5): learn an NPC's secrets, hidden quests, and true motivations; Wisdom save by target — if they resist, they become hostile; costs psi points
  - **Thought Projection** (Lv3): send a mental message to any NPC within 10 tiles; silent communication (no one else hears); useful for coordinating with companions silently
  - **Mind Link** (Lv8): share senses with a companion; see through their eyes (scout remotely); share HP awareness; linked pair gets +2 to coordination in combat
  - **Suggestion** (Lv10): implant a subtle thought in target's mind ("You should leave this room", "That door looks dangerous"); Wisdom save; not mind control but nudges behavior
  - **Psychic Scream** (Lv15): broadcast overwhelming mental noise; 5-tile radius; all creatures make Wisdom save or stunned 2 turns + 8 psychic damage; affects allies too
  - **Hive Mind** (Lv20): link all companions telepathically; shared initiative (all act on the fastest member's turn), shared knowledge (all see what any one sees), +3 to all group checks
- **Telepathic Dialogue**: when using telepathy on NPCs, LLM generates their thoughts as inner monologue (different tone than spoken dialogue — more honest, fragmented, emotional)
- **Mental Resistance**: some NPCs have natural or trained resistance (spymasters, mages, monks); attempting telepathy on them triggers a contest
- **Psychic Fingerprint**: repeated telepathy on the same NPC makes them paranoid; they may hire a psion to trace the intrusion back to you
- **Non-Verbal Races**: telepathy allows full communication with creatures that can't speak (animals, constructs with AI crystals, eldritch entities)
- **Anti-Telepathy Gear**: tin foil hat (joke item that actually works), mind ward amulet, psi-dampening field

## Acceptance Criteria

- [ ] Surface read shows NPC emotions and thoughts correctly
- [ ] Deep scan reveals hidden information with save mechanic
- [ ] LLM generates thought-style inner monologue for telepathic reads
- [ ] Suggestion nudges NPC behavior without full mind control
- [ ] Anti-telepathy gear blocks or reduces telepathic abilities
