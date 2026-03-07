# Body Modifications

As a player, I want to permanently modify my character with tattoos, scars, and implants, so that I have progression options beyond equipment and levels.

## Details

- **Tattoos**: applied by tattoo artists in specific towns, cost gold + rare ink
  - Rune tattoos: permanent stat bonus (+1 STR, +1 DEX, etc.), max 3 tattoos
  - Elemental tattoos: permanent 10% resistance to an element
  - Beast tattoos: cosmetic + minor ability (wolf tattoo: track enemies, eagle tattoo: extended sight range)
- **Scars**: earned through gameplay events (surviving a boss, near-death experiences)
  - Battle scars: +1 Intimidation permanently per major battle scar
  - Curse scars: visible mark from surviving a curse, grants minor curse resistance
  - Scars are referenced by NPCs in dialogue ("That's quite the scar — you've seen battle")
- **Implants** (late-game, Clockwork Creed faction):
  - Mechanical eye: see in darkness, detect hidden enemies
  - Iron arm: +3 STR, can't wear glove armor
  - Clockwork heart: +20 max HP, immune to poison, but vulnerable to lightning
- Modifications are permanent and visible on the character

## Acceptance Criteria

- [ ] Tattoos apply permanent bonuses correctly
- [ ] Scars are earned from gameplay events
- [ ] Implants provide bonuses with trade-offs
- [ ] NPCs reference visible modifications in dialogue
