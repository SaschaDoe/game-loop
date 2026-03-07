# Elemental Enemies

As a player, I want to fight pure elemental creatures with strong resistances and weaknesses, so that combat rewards elemental knowledge and gear preparation.

## Details

- **Elemental Types**:
  - **Fire Elemental**: immune to fire, vulnerable to cold (+100%); burning aura (1 damage/turn to adjacent); ignites flammable terrain; extinguished by water (instant kill if fully submerged)
  - **Water Elemental**: immune to cold/water, vulnerable to lightning (+100%); engulf attack (drowning damage, target trapped inside); can flood corridors; evaporated by intense heat
  - **Earth Elemental**: immune to physical, vulnerable to water (erosion, +50%); tremor attack (AoE knockdown); merges with stone walls (ambush); shattered by sonic/thunder
  - **Air Elemental**: immune to lightning, vulnerable to earth (grounding, +100%); tornado form (picks up and throws targets); invisible in open areas; dispersed by vacuum/sealing spells
  - **Lightning Elemental**: immune to lightning, vulnerable to earth (+100%); chain attack (bounces between metal-wearing targets); moves at double speed; attracted to metal (beeline toward armored players)
  - **Ice Elemental**: immune to cold, vulnerable to fire (+100%); freezing touch (slow + freeze at 3 stacks); creates ice terrain; shatters on death (AoE cold to all nearby)
  - **Shadow Elemental**: immune to necrotic/physical in darkness, vulnerable to light/holy (+100%); drains light sources; becomes physical in bright light; shadow step (teleport between dark areas)
  - **Crystal Elemental**: reflects 50% of spell damage; prismatic beam (random element each turn); splits into 2 smaller elementals at 50% HP; weak to sonic/blunt
- **Elemental Cores**: each defeated elemental drops an elemental core (crafting component for elemental weapons, potions, and enchantments)
- **Elemental Convergence Events**: rarely, multiple elementals spawn at once in a chaotic mix; combined elemental terrain effects make the battlefield hazardous
- **Elemental Zones**: areas with heavy elemental concentration spawn only that element type; walking into a fire zone without fire resistance is suicidal
- **Taming Elementals**: at high Summoning skill, defeated elementals can be bound as summons (see planar-binding)

## Acceptance Criteria

- [ ] All elemental types have correct immunities and vulnerabilities
- [ ] Elemental terrain effects trigger from elemental abilities
- [ ] Elemental cores drop and are usable in crafting
- [ ] Crystal Elemental splitting mechanic works
- [ ] Elemental zones restrict spawns and apply environmental damage
