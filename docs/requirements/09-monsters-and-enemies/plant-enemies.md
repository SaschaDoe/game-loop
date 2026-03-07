# Plant Enemies

As a player, I want to encounter hostile plant creatures in forests, swamps, and gardens, so that natural environments have organic threats that differ from typical combat.

## Details

- **Plant Enemy Types**:
  - **Vine Strangler**: hidden as normal vegetation until the player steps adjacent; grapple attack (immobilize + crush damage per turn); must be cut free or break Strength check
  - **Thorn Shooter**: stationary, fires thorn projectiles at 8-tile range; 3 damage + bleed; can't move but can rotate to face threats; destroy the root to kill
  - **Spore Cloud Mushroom**: releases spore burst when approached (3x3 AoE); confusion debuff (random movement for 3 turns) or poison; immune to physical, weak to fire
  - **Treant**: massive tree creature; slow, extremely high HP; slam attack (AoE knockback); throws boulders; can root in place to regenerate 5 HP/turn; weak to fire and axes
  - **Corpse Flower**: grows on battlefields; emits stench (nausea -2 all stats in 4-tile radius); tongue lash (pull player in); swallow whole (trapped inside, acid damage until killed or cut free)
  - **Blight Creeper**: spreading corruption; moves 1 tile per 3 turns, converting floor to blight terrain (damage + slow); infinite HP, must destroy the heart node elsewhere on the map
  - **Dryad** (hostile variant): casts entangle (root player in place), thorn whip (ranged), summons forest animals; will negotiate if approached peacefully (Charisma check)
- **Plant Immunities**: all plants are immune to poison, charm, fear, bleed, psychic damage
- **Plant Vulnerabilities**: fire (+50% damage), cold (slows growth), axes (+25% damage), herbicide potions (instant kill on small plants)
- **Symbiotic Plants**: some plants have parasitic relationships with other enemies (vine strangler + spider ambush combo; spore mushroom + zombie horde)
- **Harvesting**: killed plant enemies yield useful ingredients (vine rope, thorns for arrows, spore sacs for alchemy, treant wood for crafting)
- Plant enemies don't trigger encounter warnings (they're disguised as terrain until activated)

## Acceptance Criteria

- [ ] All plant enemy types have unique attack patterns
- [ ] Plant immunities and vulnerabilities apply correctly
- [ ] Blight creeper spreading mechanic requires finding the heart node
- [ ] Symbiotic combos trigger with correct enemy pairings
- [ ] Plant enemies are visually disguised as terrain until activated
