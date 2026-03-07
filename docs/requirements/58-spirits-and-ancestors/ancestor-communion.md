# Ancestor Communion

As a player, I want to communicate with the spirits of my character's ancestors for guidance and power, so that lineage and family history have gameplay significance.

## Details

- **Ancestor Shrine**: buildable at player housing or found at sacred burial sites; meditation here contacts ancestors
- **Ancestor Types** (procedurally generated from character backstory):
  - **Warrior Ancestor**: grants combat advice and temporary STR/CON buffs; challenges you to prove your valor
  - **Scholar Ancestor**: reveals lore, teaches languages, and grants INT/WIS buffs; asks riddles before helping
  - **Trickster Ancestor**: grants luck bonuses and stealth buffs; offers cryptic advice that's always technically correct but misleading
  - **Healer Ancestor**: cures diseases, removes curses, and grants healing buffs; lectures about taking better care of yourself
  - **Tragic Ancestor**: died under mysterious circumstances; unraveling their death is a multi-part quest; reward: their legendary weapon/armor
- **Ancestor Favor**: spending time at shrines, honoring traditions, and living virtuously increases ancestor favor; neglecting shrines or dishonorable acts decreases it
  - High favor: ancestors appear unbidden to warn of danger, buff during boss fights, reveal hidden paths
  - Low favor: ancestors go silent; at very low, they become hostile spirits (haunt the player)
- **Ancestor Powers** (unlocked through favor tiers):
  - Tier 1: Ghost Light (spectral lantern, infinite duration, 4-tile radius)
  - Tier 2: Ancestor's Shield (spectral armor absorbs 1 lethal hit per day)
  - Tier 3: Spirit Walk (become incorporeal for 5 turns, phase through walls)
  - Tier 4: Ancestral Army (summon 5 spectral warriors for 10 turns; once per week)
- **LLM Dialogue**: ancestors speak in archaic style; remember previous conversations; have opinions about your actions
- **Bloodline Discovery**: finding lost ancestors through exploration (forgotten graves, old records, family heirlooms) expands your family tree and unlocks new ancestor contacts
- Different races have different ancestor traditions (elves have ancient ancestors spanning millennia; dwarves have ancestor halls carved in stone)

## Acceptance Criteria

- [ ] Ancestor communion triggers at shrines with correct ancestor types
- [ ] Ancestor favor tracks and produces correct effects at each tier
- [ ] Ancestor powers unlock and function at correct favor levels
- [ ] LLM dialogue maintains archaic style and conversation memory
- [ ] Bloodline discovery expands available ancestors
