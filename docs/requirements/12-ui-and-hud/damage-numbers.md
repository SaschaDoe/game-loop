# Damage Numbers

As a player, I want floating damage numbers to appear when damage is dealt, so that I can immediately understand the impact of attacks without reading the combat log.

## Details

- **Number Display**: when damage is dealt, the number floats upward from the target tile and fades over 1 second
- **Color Coding**:
  - White: normal physical damage
  - Red: critical hit (displayed larger, with "!" suffix)
  - Blue: cold/water damage
  - Orange: fire damage
  - Yellow: lightning damage
  - Purple: necrotic/psychic damage
  - Green: poison damage (ticks show each turn)
  - Gold: holy damage
  - Cyan: healing (displayed with "+" prefix)
  - Gray: blocked/resisted damage (smaller, with "~" suffix indicating partial)
- **Miss Indicator**: "MISS" in gray text floats from target on missed attacks
- **Status Text**: status effect application shows the effect name ("STUNNED", "POISONED", "FROZEN") in the effect's color
- **Stacking**: multiple damage sources display simultaneously without overlapping; offset positions prevent pile-up
- **XP Pop**: "+X XP" in gold floats from killed enemies
- **Overkill**: if damage exceeds remaining HP, show the full damage number with "OVERKILL" label
- **Combo Counter**: during combos, a running counter ("x2", "x3") appears with increasing font size
- **Settings**: damage numbers can be toggled off, or set to "minimal" (only crits and healing shown)
- All damage numbers use ASCII-friendly characters; animation uses simple CSS transitions for performance

## Acceptance Criteria

- [ ] Damage numbers appear at correct positions with correct colors
- [ ] Critical hits, misses, and status effects display distinctly
- [ ] Multiple simultaneous numbers don't overlap
- [ ] XP and overkill labels display correctly
- [ ] Settings allow toggling or minimizing damage numbers
