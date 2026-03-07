# Bestiary

As a player, I want a bestiary that records information about every creature I encounter, so that I can learn enemy weaknesses and track my encounters.

## Details

- Bestiary auto-populates when a creature type is first encountered
- Initial entry: creature name, ASCII symbol, basic description
- Information unlocks with more encounters:
  - 1 encounter: name, appearance, basic behavior
  - 3 encounters: HP range, damage range, attack type
  - 5 encounters: resistances, weaknesses, special abilities
  - 10 encounters: full stat block, loot table, habitat preferences, lore text
- Sortable and filterable: by type (beast, undead, humanoid, elemental), biome, difficulty
- Completion percentage tracked: "Bestiary: 47/112 creatures discovered"
- Rare/legendary creatures have special gold-bordered entries
- NPC scholars can fill in bestiary entries for a fee (without fighting the creature)
- Bestiary tips appear before boss fights if the boss type has been studied
- **Creature Illustrations**: each bestiary entry has an ASCII art representation of the creature (larger than the map tile)
- **Ecology Notes**: at 10+ encounters, reveals relationships between creatures (wolves hunt deer, trolls fear fire elementals, goblins serve dragons)
- **Hunting Challenges**: bestiary tracks kill counts per creature; milestones (10, 50, 100 kills) grant titles and small passive bonuses ("Goblin Slayer: +5% damage vs goblins")
- **Field Notes**: player can add custom notes to bestiary entries (e.g., "Found mostly in floor 3 of the Eastern Mine")
- **Creature Comparison**: side-by-side stat comparison between two bestiary entries
- **Endangered Species**: some creatures have low world populations; driving them to extinction has ecological consequences (their prey overpopulates)
- Bestiary data persists across character deaths (legacy knowledge)

## Acceptance Criteria

- [ ] Bestiary populates on first encounter per creature type
- [ ] Information progressively reveals with more encounters
- [ ] Sorting and filtering functions work
- [ ] Scholar NPCs can fill in entries for gold
