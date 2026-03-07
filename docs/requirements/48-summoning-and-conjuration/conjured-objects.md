# Conjured Objects

As a player, I want to conjure temporary walls, bridges, and platforms from thin air, so that I can reshape the battlefield and solve traversal puzzles with magic.

## Details

- **Conjurable Objects**:
  - **Conjure Wall** (Lv5): create a 1-3 tile wall segment anywhere within 6 tiles; blocks movement and line of sight; lasts 20 turns; useful for funneling enemies or blocking ranged attacks
  - **Conjure Bridge** (Lv8): create a temporary bridge over a gap, river, or pit (up to 5 tiles long); lasts 15 turns; collapses after duration (anything on it falls)
  - **Conjure Platform** (Lv12): floating platform that rises 1 level; use for elevation advantage or reaching high places; lasts 10 turns
  - **Conjure Door** (Lv6): create a lockable door in any wall opening; only the caster has the key; lasts 30 turns
  - **Conjure Cage** (Lv15): trap an enemy in a conjured cage (Strength save to break free; 3 turns to escape for strong enemies, 10 for weak)
  - **Conjure Shelter** (Lv10): small room (3x3) with walls and a door; safe resting spot; lasts until next rest
  - **Conjure Weapon** (Lv4): create a temporary magic weapon matching caster's level; disappears after combat
- **Conjuration Rules**:
  - Cannot conjure objects on occupied tiles
  - Conjured objects are translucent blue in ASCII display (distinct from real objects)
  - Enemies can attack conjured objects to destroy them (each has HP proportional to caster level)
  - Dispel Magic instantly destroys all conjured objects
  - Maximum 3 conjured objects active simultaneously
- **Creative Combinations**: conjure wall + conjure bridge to create elevated platforms; conjure cage + conjure wall to seal enemies completely
- Conjured objects don't persist through save/load (they're temporary by nature)

## Acceptance Criteria

- [ ] All conjured object types create correct terrain modifications
- [ ] Duration timers and collapse mechanics work
- [ ] Enemies can attack and destroy conjured objects
- [ ] Active conjuration limit is enforced
- [ ] Conjured objects are visually distinct from permanent ones
