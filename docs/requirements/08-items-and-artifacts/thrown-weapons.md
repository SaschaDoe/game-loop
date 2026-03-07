# Thrown Weapons

As a player, I want a variety of throwable weapons with unique trajectories and effects, so that ranged combat has options beyond bows and spells.

## Details

- **Thrown Weapon Types**:
  - **Throwing Knife**: fast, accurate, low damage; can throw 2 per turn at high skill; 8-tile range; retrievable from corpses
  - **Javelin**: heavy, high damage, 6-tile range; pierces through the first target to hit a second (if aligned); not always retrievable (breaks 30% of the time)
  - **Throwing Axe**: medium damage, 5-tile range; can hit multiple enemies in an arc if they're adjacent; loud (alerts enemies)
  - **Chakram**: circular blade, returns to thrower after hitting; can curve around corners (player chooses trajectory); 7-tile range; rare weapon type
  - **Bolas**: low damage but entangles target (immobilized 3 turns); 6-tile range; Dexterity save to avoid; effective against fleeing enemies
  - **Bomb** (see explosive-compounds): AoE damage; doesn't return; friendly fire
  - **Net**: no damage; restrains target (reduced actions until cut free or Strength check); 4-tile range; large creatures are harder to net
  - **Shuriken**: very fast, very low damage; throw 3 per turn; applies poison if coated; 6-tile range; silent (doesn't alert)
- **Throwing Skill**: affects accuracy, damage bonus, range extension (+1 tile per 3 skill levels), and unlocks trick throws
- **Trick Throws** (high skill):
  - Ricochet: bounce off a wall to hit enemies around corners
  - Headshot: aimed throw for double damage + stun; -3 accuracy penalty
  - Disarm: knock a weapon out of an enemy's hand
  - Fan Throw: throw 3 weapons simultaneously in a cone
- **Ammunition Management**: thrown weapons are consumable (except returning weapons); carry in a bandolier (holds 20 light thrown weapons)
- **Enchanted Thrown Weapons**: returning enchantment (always comes back), explosive (AoE on impact), homing (+5 accuracy)

## Acceptance Criteria

- [ ] All thrown weapon types have correct range, damage, and special effects
- [ ] Throwing skill improves accuracy and unlocks trick throws
- [ ] Retrievable weapons can be picked up from corpses/ground
- [ ] Trick throws (ricochet, headshot, disarm, fan) function correctly
- [ ] Ammunition tracking works with bandolier system
