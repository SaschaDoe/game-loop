# Warrior Class

As a player, I want the warrior class to have unique combat stances, rage mechanics, and martial techniques that make melee combat visceral and tactical, so that warriors feel powerful and distinct from other classes.

## Details

- **Core Stats**: STR primary, CON secondary; bonus HP per level (+3 vs standard +2); natural armor proficiency (all armor types, no penalty)
- **Class Resource — Battle Fury**: builds during combat (gain 5 fury per hit dealt, 10 per kill, 3 per hit taken); max fury = 100; fury decays outside combat (-5 per turn); spend fury on powerful abilities
- **Combat Stances** (toggle, one active at a time):
  - **Aggressive Stance**: +20% damage, -10% defense; fury builds 50% faster; best for offense-focused fights
  - **Defensive Stance**: +20% defense, -10% damage; taunt (force enemies to attack you); block chance +15%; best for tanking
  - **Balanced Stance**: no modifiers; access to both offensive and defensive abilities; default stance
  - **Berserker Stance**: +40% damage, -25% defense, +50% attack speed; fury doesn't decay; can't use defensive abilities; locked above 50 fury; auto-activates at 100 fury if not controlled
- **Warrior Abilities** (fury cost):
  - **Shield Bash** (15 fury): stun target 1 turn + moderate damage; requires shield
  - **Whirlwind** (25 fury): hit all adjacent enemies; reduced damage per target
  - **Battle Cry** (20 fury): AoE buff; allies gain +2 attack for 5 turns; enemies must WIS save or be frightened
  - **Execute** (40 fury): massive single-target damage; +100% damage vs enemies below 25% HP
  - **Second Wind** (30 fury): heal 25% max HP instantly; usable once per combat
  - **Unstoppable** (50 fury): immune to stun, knockback, fear, and immobilization for 5 turns
  - **Earthquake Slam** (60 fury): slam weapon into ground; AoE 3 tiles; damage + knockdown; requires 2-handed weapon
- **Warrior Specializations** (choose at level 10):
  - **Champion**: enhanced criticals (+10% crit chance, +50% crit damage); Legendary Strike (once per fight, guaranteed critical hit)
  - **Battlemaster**: tactical superiority; issue commands to allies (+2 to their actions); Counter-Strike (automatic retaliation on missed attacks)
  - **Berserker**: enhanced rage; Berserker Stance bonuses increased; Deathless Rage (survive at 1 HP for 3 turns after fatal damage); Frenzy (+1 attack per turn while raging)

## Acceptance Criteria

- [ ] Battle Fury builds and decays at correct rates
- [ ] Combat stances apply correct modifiers and toggle correctly
- [ ] All abilities consume correct fury and produce correct effects
- [ ] Specializations unlock at level 10 with correct unique abilities
- [ ] Berserker Stance auto-activates at 100 fury correctly
