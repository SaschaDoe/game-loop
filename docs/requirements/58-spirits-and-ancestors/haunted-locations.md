# Haunted Locations

As a player, I want certain locations to be haunted by restless spirits with unique encounters and rewards, so that the spirit world intersects with physical exploration.

## Details

- **Haunting Types**:
  - **Residual Haunt**: ghostly replay of past events; no interaction possible; provides lore about what happened; harmless but eerie
  - **Intelligent Haunt**: a specific ghost with personality and goals; can be spoken to (LLM dialogue); may request help (unfinished business quest); hostile if provoked
  - **Poltergeist**: telekinetic disturbances; objects thrown at player (damage); furniture rearranges blocking paths; must find and destroy the anchor object to stop
  - **Possession Haunt**: spirit attempts to possess the player or NPCs; WIS save to resist; possessed NPCs become hostile; possessed player loses control for turns (auto-actions)
  - **Death Echo**: replays the final moments of someone's death; interacting reveals clues for murder mystery quests; some death echoes loop endlessly until resolved
- **Haunted Location Types**: abandoned houses, old battlefields, execution sites, cursed tombs, shipwrecks, murder scenes, forgotten temples
- **Detection**: haunted locations have subtle signs (cold spots, flickering lights, animals avoiding the area, NPCs warning you); Spirit Sight ability reveals invisible ghosts
- **Resolution Methods**:
  - Destroy the anchor (object binding the spirit): forceful, ghost is gone but no reward from the spirit
  - Complete the ghost's unfinished business: peaceful resolution; ghost grants a blessing or reward before departing
  - Exorcism ritual: requires holy water + incantation + holy symbol; banishes the spirit; religious characters excel
  - Bind the spirit: trap the ghost in a soul gem; can be used for enchanting or necromancy; morally questionable
- **Haunting Consequences**: spending too long in haunted locations accumulates "chill" debuff (movement slow, perception penalty); sleeping in haunted locations triggers nightmares (ties to dream system)

## Acceptance Criteria

- [ ] All haunting types produce correct encounter behaviors
- [ ] Detection methods reveal appropriate information based on skills
- [ ] Resolution methods each have distinct requirements and outcomes
- [ ] Unfinished business quests generate via LLM for intelligent haunts
- [ ] Chill debuff accumulates and clears correctly
