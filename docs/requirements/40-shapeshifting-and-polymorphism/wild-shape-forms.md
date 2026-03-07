# Wild Shape Forms

As a player, I want a comprehensive list of wild shape animal forms with distinct abilities and tactical uses, so that druid shapeshifting offers real strategic choice.

## Details

- **Form Categories and Examples**:
  - **Scout Forms** (fast, stealthy, fragile):
    - Cat: +4 stealth, night vision, fit through small gaps, silent movement; 15 HP
    - Hawk: flight, +5 Perception, can survey large areas; 10 HP; can't attack effectively
    - Snake: tiny size, +3 stealth, venomous bite (poison DoT), squeeze through cracks; 12 HP
    - Spider: wall climbing, web trap (immobilize 1 enemy), tiny size, tremorsense; 8 HP
  - **Combat Forms** (strong, durable, offensive):
    - Bear: +4 STR, +3 CON, claw/bite combo attack, intimidating roar (fear effect); 60 HP
    - Wolf: +2 STR, +3 DEX, pack tactics (bonus when ally adjacent), trip attack; 35 HP
    - Boar: +3 STR, +4 CON, charge attack (double damage on first hit), tusks (bleed); 45 HP
    - Tiger: +3 STR, +4 DEX, pounce (leap + pin), stealth bonus in foliage; 40 HP
  - **Utility Forms** (special traversal, problem-solving):
    - Fish: swim in any water, breathe underwater indefinitely, small and fast in water; 10 HP; useless on land
    - Mole: burrow underground, tremorsense, navigate tunnels, dig new passages; 15 HP
    - Horse: mounted speed for an ally, long-distance travel at 3x speed, carry heavy loads; 50 HP
    - Bat: echolocation (reveals hidden objects/enemies in dark), flight, tiny size; 8 HP
  - **Legendary Forms** (unlocked at high druid levels):
    - Dire Wolf: enhanced wolf with +5 STR, howl (AoE fear), pack leader (all beast allies +2 attack); 70 HP
    - Great Eagle: powerful flight, talons deal heavy damage, carry an ally while flying; 50 HP
    - Giant Spider: web multiple targets, wall climbing, venomous bite (paralysis), large size; 55 HP
- **Form Learning**: must observe the animal in the wild (spend 5 turns studying it); each form must be learned individually; some rare forms require tracking the animal to its habitat
- **Form Duration**: 30 turns per transformation; ends early if HP drops to 0 (revert to humanoid with original HP minus damage overflow)
- **Equipment**: equipment melds into animal form (inaccessible but not lost); some enchantments persist through transformation (rings, amulets)

## Acceptance Criteria

- [ ] All forms provide correct stat modifications and abilities
- [ ] Form HP is separate from humanoid HP with overflow damage
- [ ] Form learning requires observing the correct animal
- [ ] Duration timer correctly reverts form at 30 turns
- [ ] Legendary forms unlock at appropriate druid level
