# Shapeshifting

As a player, I want to transform into creatures and monsters with different abilities, so that I can adapt my combat form to the situation.

## Details

- Available to: Druid class, Old Ways religion followers, players with polymorph items
- Shapeshift forms:
  - **Wolf**: fast movement, pack bonus near wolf allies, howl stun, weak armor
  - **Bear**: high HP, powerful melee, slow, intimidate aura
  - **Hawk**: flight (ignore terrain), ranged divebomb attack, fragile
  - **Spider**: wall climbing, web trap placement, poison bite, small (can enter tiny passages)
  - **Elemental** (high level): become fire/ice/earth elemental with corresponding immunities and attacks
  - **Dragon** (ultimate): massive damage, flight, breath weapon, costs enormous mana, limited duration
- Shifting costs mana and has a cooldown
- While shifted: cannot use items, cast spells, or talk to NPCs
- Equipment is hidden during shift; stats come from the form, not equipment
- Some NPCs react with fear or hostility to shifted forms
- Shift interrupted if mana reaches zero (forced back to humanoid form)

## Acceptance Criteria

- [ ] All shapeshift forms are selectable and functional
- [ ] Form-specific abilities and stats replace normal ones
- [ ] Item and spell restrictions apply during shift
- [ ] NPC reactions to shifted forms are appropriate
