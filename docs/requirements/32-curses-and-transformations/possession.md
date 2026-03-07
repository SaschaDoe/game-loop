# Possession

As a player, I want demonic or ghostly possession to occasionally take control of my character, so that curse mechanics create dramatic moments and unique gameplay challenges.

## Details

- **Possession Sources**: cursed items worn too long, demon encounters, haunted location exposure, failed exorcism, dark ritual backlash
- **Possession Stages**:
  - **Stage 1 (Influence)**: occasional intrusive messages in the feed ("Destroy them all..."); minor stat fluctuations; -1 WIS; player retains full control
  - **Stage 2 (Struggle)**: possessing entity takes control for 1-3 turns randomly; character performs unwanted actions (attacks allies, opens locked doors, walks toward danger); player can resist with Wisdom save (regain control 1 turn early)
  - **Stage 3 (Dominated)**: entity controls the character for 10+ turns; player watches helplessly; character seeks out the entity's goals (find a specific item, go to a location, kill a specific NPC)
  - **Stage 4 (Consumed)**: permanent possession; character becomes an NPC villain; game over unless rescued by companions
- **Possession Types**:
  - **Ghost Possession**: ghost seeks to complete unfinished business through the player; relatively benign; may lead to useful locations
  - **Demon Possession**: demon seeks chaos and destruction; violent; corrupts alignment; grants dark powers during possession (fire abilities, fear aura)
  - **Ancient Spirit**: an ancient being takes interest; grants visions and knowledge but slowly overwrites the player's identity
- **Exorcism**: cure via temple ritual (gold + cleric NPC), holy water + prayer (self-administered, lower success rate), companion intervention (loyal companion can snap you out during Stage 2), Psychic Combat (mentally fight the possessing entity)
- **Possession Benefits**: during early stages, the entity may grant power (+3 to a stat, access to entity's abilities); tempting the player to delay exorcism
- **Possession Resistance**: Wisdom modifier, holy items, mind ward equipment, deity protection (see divine-intervention)
- **LLM Integration**: the possessing entity speaks through the character during NPC dialogue; LLM generates entity-influenced dialogue that NPCs react to with confusion or alarm

## Acceptance Criteria

- [ ] Possession stages progress with correct effects
- [ ] All possession types have distinct entity behaviors
- [ ] Exorcism methods cure possession at correct success rates
- [ ] Entity-controlled turns play out autonomously
- [ ] LLM generates entity-influenced dialogue during NPC interactions
