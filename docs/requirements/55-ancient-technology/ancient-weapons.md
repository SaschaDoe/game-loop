# Ancient Weapons

As a player, I want to find and master ancient technological weapons that outclass normal equipment, so that exploring Precursor ruins has top-tier combat rewards.

## Details

- **Ancient Weapon Types**:
  - **Energy Blade**: melee weapon; pure energy edge; ignores armor completely; deals 15 base damage (highest in game); requires power cell charges (50 hits per cell); hums audibly (stealth penalty)
  - **Plasma Caster**: ranged weapon; fires superheated bolts; 12 damage, 10-tile range, penetrates 1 target to hit behind; 30 shots per power cell; leaves scorch marks on terrain
  - **Gravity Hammer**: heavy melee; creates a gravity shockwave on impact; 10 damage + 3-tile AoE knockback; slow (attack every 2 turns); 20 uses per cell
  - **Shield Emitter**: off-hand device; projects a force field that absorbs 30 damage before collapsing; recharges between combats; requires 1 power cell per 5 uses
  - **Disintegrator**: ultimate weapon; single target, 50 damage, bypasses all resistances; 3 uses per power cell; 15-turn cooldown; target leaves no corpse (no loot)
  - **Stasis Gun**: non-lethal; freezes target in time for 10 turns (cannot be damaged, cannot act); 5 uses per cell; doesn't work on bosses
  - **Nanite Swarm**: deployable cloud of repair nanites; heals 5 HP/turn to all allies in 3x3 area for 8 turns; also repairs equipment; 3 uses per cell
- **Power Cell Scarcity**: power cells are found only in Precursor ruins; cannot be crafted (yet — Artificer questline may unlock crafting at high level); creates meaningful ammo management
- **Weapon Degradation**: ancient weapons degrade faster than normal weapons; require Artificer skill to maintain; fully broken ancient weapon is irreparable
- **Learning Curve**: first use of an ancient weapon has -5 accuracy penalty; penalty reduces by 1 per 10 uses (unfamiliarity with technology)
- **NPC Reactions**: displaying ancient weapons in towns causes awe, fear, or covetousness; some factions want to confiscate them; collectors offer enormous gold
- **Lore Integration**: each weapon has inscriptions (in Precursor language) revealing its original purpose and the civilization's history

## Acceptance Criteria

- [ ] All ancient weapon types function with correct damage and effects
- [ ] Power cell ammunition system tracks usage correctly
- [ ] Weapon degradation and Artificer maintenance work
- [ ] Learning curve penalty reduces with use
- [ ] NPC reactions trigger based on displayed ancient weapons
