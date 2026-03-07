# Dodge and Block

As a player, I want to dodge or block incoming attacks, so that I can mitigate damage through skill and equipment rather than just absorbing hits.

## Details

- Dodge chance based on Dexterity and armor weight (light armor = better dodge)
- Block chance based on shield equipped and Strength
- Successful dodge: attack misses entirely, with "dodged!" message
- Successful block: damage reduced by shield's block value
- "Defend" action on player's turn doubles block chance for that round
- Some attacks are undodgeable (huge AoE, trap damage)

## Acceptance Criteria

- [ ] Dodge and block chances calculate correctly from stats
- [ ] Dodge causes complete miss; block reduces damage
- [ ] Defend action increases block chance
- [ ] Undodgeable attacks bypass dodge
