# Druid Shapeshifting

As a player, I want to transform into animals and elemental forms as a druid, so that I can access unique abilities and solve problems through shapeshifting.

## Details

- **Animal Forms** (unlocked progressively):
  - **Wolf**: fast movement, pack howl (calls wolf allies), bite attack, scent tracking (reveals hidden NPCs/items)
  - **Bear**: massive HP boost, claw swipe (AoE melee), intimidation aura, cannot fit through narrow passages
  - **Eagle**: flight (bypass terrain), dive attack (high damage from above), enhanced vision (reveals map in large radius)
  - **Snake**: small size (fit through cracks), venomous bite (poison DoT), heat vision (see in darkness), stealth bonus
  - **Fish**: breathe underwater, fast swim speed, access aquatic-only areas
- **Elemental Forms** (high-level):
  - **Fire Elemental**: immune to fire, burn aura (damage nearby enemies), ignite flammable terrain
  - **Water Elemental**: immune to water, healing rain aura, extinguish fires, flow through grates
  - **Earth Elemental**: immune to physical, slow, earthquake stomp, tunnel through soft walls
- Shapeshifting costs mana and has a duration; revert costs nothing
- Cannot talk to NPCs while transformed (except with a talent that allows beast-speech)
- Equipment merges into form (stats still apply but visually hidden)
- Each form has a unique ASCII character representation on the map
- Transformation has a 1-turn animation where the character tile flickers between forms

## Acceptance Criteria

- [ ] All animal forms are unlockable and playable
- [ ] Elemental forms grant appropriate immunities
- [ ] Form-specific abilities work correctly
- [ ] Equipment stats carry over during transformation
- [ ] ASCII representation changes per form
