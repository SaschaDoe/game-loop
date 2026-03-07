# Battle Stances

As a player, I want to switch between combat stances that shift my stats between offense, defense, and utility, so that positioning and role adaptation are part of combat strategy.

## Details

- **Stance Types** (switch as a free action, once per turn):
  - **Aggressive Stance**: +3 damage, +1 attack speed, -3 armor, -1 dodge; red border on character tile
  - **Defensive Stance**: +3 armor, +2 dodge, -2 damage, -1 movement; blue border on character tile
  - **Balanced Stance**: no modifiers; default stance; white border
  - **Evasive Stance**: +4 dodge, +2 movement, -2 damage, -2 armor; attacks have 30% chance to be completely avoided; green border
  - **Berserker Stance** (Warrior only): +5 damage, attack cleaves to adjacent enemies, -5 armor, cannot block/dodge, cannot retreat; orange border
  - **Sentinel Stance** (Guardian talent): can't move but automatically counterattack any enemy that attacks you or moves past you; perfect for chokepoints
  - **Arcane Stance** (Mage only): +20% spell damage, -20% spell cost, -4 physical armor, movement triggers arcane mines on vacated tiles
  - **Shadow Stance** (Rogue only): +50% stealth, first attack from stance is always a crit, movement is silent; breaks if you take damage
- **Stance Mastery**: using a stance earns mastery XP; higher mastery reduces that stance's penalties by 25% → 50%
- **Stance Combos**: switching stances mid-combat triggers transition effects:
  - Aggressive → Defensive = "Riposte" (block then counter for full aggressive damage)
  - Evasive → Aggressive = "Ambush" (dodge then strike for +50% damage)
  - Defensive → Sentinel = "Iron Wall" (5 turns of absolute defense — 80% damage reduction, can't move)
- **Enemy Stances**: elite enemies also use stances; observant players can read their stance (visual cue) and choose the counter-stance
- **Stance Lock**: some debuffs lock you in a stance (fear = locked in defensive; rage = locked in berserker)

## Acceptance Criteria

- [ ] All stances apply correct stat modifiers
- [ ] Stance switching is free action, limited to once per turn
- [ ] Class-specific stances are restricted to correct classes
- [ ] Stance combos trigger correct transition effects
- [ ] Stance mastery reduces penalties with use
