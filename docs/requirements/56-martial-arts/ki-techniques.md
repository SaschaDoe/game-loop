# Ki Techniques

As a player, I want to unlock advanced ki (chi) techniques that blend martial arts with supernatural power, so that high-level unarmed fighters feel superhuman.

## Details

- **Ki Techniques** (unlocked through the Martial Arts skill tree + master training):
  - **Ki Burst** (Lv10): release a shockwave of energy from your body; 3-tile radius AoE; 8 damage + knockback; costs 10 chi
  - **Iron Fist** (Lv12): channel ki into your fist; next unarmed attack deals 5x damage and shatters armor (-5 armor permanently on target); costs 8 chi
  - **Void Step** (Lv14): move so fast you appear to teleport; instant movement up to 6 tiles; leaves an afterimage (enemies attack the image for 1 turn); costs 6 chi
  - **Ki Barrier** (Lv16): project a force field; absorbs 30 damage; reflects 20% of absorbed damage back at attackers; lasts 5 turns or until depleted; costs 12 chi
  - **Pressure Point Paralysis** (Lv18): strike 5 pressure points in rapid succession; target is completely paralyzed for 3 turns (no save); costs 15 chi + requires melee range
  - **Dragon Fist** (Lv22): channel all remaining chi into a single devastating punch; damage = remaining chi × 3; leaves you at 0 chi; spectral dragon surrounds the fist (visual effect)
  - **Astral Projection** (Lv25): project your spirit out of your body; spirit form can fly, pass through walls, and interact with spirits; physical body is vulnerable; costs 20 chi to initiate
  - **One with Everything** (Lv30, ultimate): passive; chi regeneration triples; unarmed damage equals the best weapon in your inventory; immune to fear, charm, and psychic attacks
- **Ki Regeneration Methods**:
  - Passive: 1 chi per 5 turns
  - Meditation: skip a turn = 5 chi
  - Combat Flow: landing 3 consecutive hits without taking damage = 3 bonus chi
  - Ki Tea: consumable, restores 15 chi instantly; brewed from rare mountain herbs
- **Ki Corruption**: overusing ki techniques without rest causes Ki Exhaustion (-2 to all physical stats; 50 turns of no ki abilities); resolved by meditation or rest
- **NPC Ki Masters**: 3 legendary masters teach ki techniques; each specializes in offensive, defensive, or spiritual ki

## Acceptance Criteria

- [ ] All ki techniques function with correct damage, range, and chi costs
- [ ] Ki regeneration methods restore chi at correct rates
- [ ] Ki Exhaustion triggers from overuse and debuffs correctly
- [ ] Dragon Fist damage scales with remaining chi
- [ ] NPC masters teach techniques with prerequisite checks
