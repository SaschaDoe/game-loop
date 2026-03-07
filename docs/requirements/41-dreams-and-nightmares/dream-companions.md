# Dream Companions

As a player, I want to encounter unique companion NPCs that exist only within dreams and can assist me in dream realm challenges, so that the dream world has its own cast of characters.

## Details

- **Dream Companion Types**:
  - **The Dreamer's Shadow**: a manifestation of your subconscious; mirrors your class but with inverted strengths/weaknesses (your STR becomes its INT, etc.); offers cryptic advice about waking-world problems; sometimes argues with you (internal conflict dialogue via LLM)
  - **Memory Echoes**: deceased NPCs from your past encounters appear in dreams; they remember you but are confused about being dead; can fight alongside you using their living abilities; emotional interactions via LLM dialogue
  - **Dream Beasts**: friendly spirit animals that guide you through dream labyrinths; each dream beast represents an emotion (courage-lion, wisdom-owl, curiosity-fox, anger-bear); bonding with one grants a small permanent waking-world buff
  - **The Sandman**: a recurring neutral NPC who maintains the dream realm; provides dream quests, sells dream items (currency: dream fragments), and warns of nightmare incursions; can be befriended over multiple dream visits
  - **Lucid Projections**: other sleeping NPCs whose dreams overlap with yours; brief encounters; exchange information (things they know in the waking world slip into dream dialogue); rare but valuable for quest hints
- **Companion Persistence**: dream companions remember previous dream encounters; relationships develop over multiple dreams; trust must be built (dream companions are wary of waking beings)
- **Dream Companion Abilities**: each has unique dream-only abilities (phase through dream walls, reshape dream terrain, banish nightmare creatures, create dream items); abilities don't transfer to the waking world
- **Companion Loss**: if a dream companion "dies" in a nightmare encounter, they're gone for 500 turns (reforming in the dream realm); losing one you've bonded with causes a waking-world sadness debuff (-1 CHA for 50 turns)

## Acceptance Criteria

- [ ] All companion types have correct abilities and interaction styles
- [ ] Companion persistence tracks across multiple dream visits
- [ ] LLM generates appropriate dialogue for Shadow and Memory Echo types
- [ ] Dream beast bonding grants correct waking-world buffs
- [ ] Companion death triggers correct reforming timer and sadness debuff
