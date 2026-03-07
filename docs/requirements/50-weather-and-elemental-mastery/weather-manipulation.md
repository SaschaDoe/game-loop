# Weather Manipulation

As a player, I want to learn spells that control weather to gain tactical advantages in combat and exploration, so that mastering the elements feels powerful and world-altering.

## Details

- **Weather Spells** (Elementalist tree or Druid tree):
  - **Call Rain** (Lv6): rain in current area for 30 turns; extinguishes fires, creates puddles, reduces visibility; buff to water/lightning magic
  - **Summon Fog** (Lv8): dense fog reduces all vision to 2 tiles for 20 turns; enemies can't target at range; stealth bonus
  - **Lightning Storm** (Lv14): storm clouds; random lightning strikes hit enemies in the area (3 per turn, medium damage); metal armor attracts strikes
  - **Blizzard** (Lv18): heavy snow and ice; all movement halved, cold damage per turn to unprotected creatures, water freezes solid; lasts 25 turns
  - **Sunburst** (Lv12): clear all weather effects; bright light; bonus to fire magic, penalty to undead/shadow creatures; lasts 30 turns
  - **Tornado** (Lv22): funnel cloud in a line; picks up and throws anything in its path (massive damage + displacement); short duration (5 turns), random movement
  - **Earthquake** (Lv25): ground shakes; chance to knock all creatures prone each turn; opens crevices (new terrain), collapses weak structures; lasts 10 turns
- **Weather Persistence**: spells affect the current map area; moving to a new area = normal weather unless the spell has global range (high level)
- **Elemental Synergies**: rain + lightning = electrified puddles; blizzard + fire = steam fog; tornado + fire = fire tornado (massive AoE)
- **NPC Reactions**: farmers grateful for rain, travelers hate blizzards, guards suspicious of unnatural weather
- **Weather Resistance Gear**: storm cloak (rain/lightning protection), snow boots (blizzard movement penalty removed), sun charm (heat resistance)
- **Weather Memory**: the world remembers recent weather manipulation; excessive use causes ecological side effects (drought, flooding, crop failure)
- Druid circles teach weather magic at reduced cost; artificers can build weather machines (slower but no mana cost)

## Acceptance Criteria

- [ ] All weather spells produce correct environmental effects
- [ ] Weather persistence affects only the current area
- [ ] Elemental synergy combinations work correctly
- [ ] NPC reactions respond to weather changes
- [ ] Ecological side effects trigger from excessive weather manipulation
