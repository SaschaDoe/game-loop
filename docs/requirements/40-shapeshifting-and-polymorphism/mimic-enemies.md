# Mimic Enemies

As a player, I want to encounter mimics disguised as treasure chests, doors, and other objects, so that exploration has an element of paranoia and surprise.

## Details

- **Chest Mimic**: disguised as a treasure chest (*), attacks when opened; tongue lash (pull player adjacent), bite (high damage), adhesive (player stuck for 1 turn)
- **Door Mimic**: disguised as a door (+), attacks when player tries to open; slam (knockback), teeth border (damage when passing through)
- **Furniture Mimic**: disguised as barrels, tables, bookshelves; found in towns and dungeons; less aggressive, more defensive
- **Greater Mimic**: disguised as an entire room; walls close in, floor becomes sticky, the "room" has HP and must be killed to escape
- Detection: Perception check when approaching, detect magic reveals them, throwing an item at a mimic triggers it early
- Mimics drop mimic teeth (crafting material), adhesive glands (alchemy ingredient), and the actual item they were pretending to be
- After encountering mimics, the player can develop "mimic paranoia" — a buff that gives +5 Perception against mimics
- Rare friendly mimic: a tamed mimic that serves as a living backpack (extra inventory slots, occasionally eats an item)
- Mimic population scales with dungeon depth — deeper floors have more and stronger mimics

## Acceptance Criteria

- [ ] All mimic types are disguised as their respective objects
- [ ] Detection checks reveal mimics before triggering
- [ ] Mimic-specific attacks and adhesive mechanic work
- [ ] Greater Mimic room encounter functions correctly
- [ ] Friendly mimic companion is obtainable
