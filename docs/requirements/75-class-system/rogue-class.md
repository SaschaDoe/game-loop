# Rogue Class

As a player, I want the rogue class to excel at stealth, precision strikes, and resource exploitation with a combo point system, so that rogues reward cunning and positioning.

## Details

- **Core Stats**: DEX primary, INT secondary; moderate HP (+2 per level); light armor proficiency only; bonus to stealth, lockpicking, and trap skills
- **Class Resource — Combo Points**: build combo points through basic attacks and abilities (1 per hit, 2 for attacks from stealth, 1 for dodge); max 5 combo points; spend on finishing moves; combo points reset when leaving combat
- **Stealth Mechanics**:
  - Enter stealth: 1 turn, can't be adjacent to enemies; Stealth skill + DEX vs enemy Perception
  - While stealthed: move at 75% speed, can't attack (breaks stealth); can pickpocket, set traps, position for ambush
  - Ambush: attack from stealth = guaranteed hit + 2x damage + 2 combo points; resets stealth cooldown
  - Shadow Blend: in dim light/darkness, stealth is easier (+5 bonus); in bright light, stealth is harder (-3 penalty)
- **Rogue Abilities**:
  - **Backstab** (0 combo, requires behind target): 2x damage from behind; 3x if stealthed; core damage source
  - **Evasion** (passive): 25% chance to dodge any attack; 50% chance to dodge AoE effects
  - **Dirty Trick** (1 combo): throw sand (blind 2 turns), low blow (stun 1 turn), or pocket bomb (small AoE smoke)
  - **Expose Weakness** (2 combo): mark a target; all attacks against marked target deal +25% damage for 5 turns
  - **Kidney Shot** (3 combo): finishing move; stun target for 3 turns; guaranteed critical on next attack
  - **Eviscerate** (5 combo): ultimate finisher; massive damage scaling with combo points spent; the rogue's execute
  - **Vanish** (30-turn cooldown): instantly enter stealth mid-combat; break all targeting; 1 free stealthed action
- **Rogue Specializations** (level 10):
  - **Assassin**: stealth damage +50%; Death Mark (target takes +100% damage from next attack); Poison Mastery (all attacks can apply poison without consumable cost)
  - **Swashbuckler**: dual-wielding bonuses; Riposte (counter-attack after dodging); Dashing Strike (move + attack in one action); CHA-based intimidation abilities
  - **Shadow Dancer**: teleport between shadows (any dim/dark tile within 10 tiles); Shadow Clone (creates a decoy that absorbs 1 hit); Phase Step (move through enemies and walls for 1 turn)

## Acceptance Criteria

- [ ] Combo points build correctly from attacks and abilities
- [ ] Stealth checks use correct DEX + skill vs Perception
- [ ] Backstab damage multiplier applies correctly based on position and stealth
- [ ] Finishing moves scale correctly with combo points
- [ ] Specializations unlock at level 10 with correct unique mechanics
