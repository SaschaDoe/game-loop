# Explosive Compounds

As a player, I want to craft bombs and explosive devices from alchemical ingredients, so that I have powerful AoE options outside of magic.

## Details

- **Bomb Types**:
  - **Fire Bomb**: AoE fire damage (3x3 tiles), creates burning terrain for 2 turns; ingredients: sulfite + oil + cloth
  - **Frost Bomb**: AoE cold damage, freezes water tiles, slows enemies; ingredients: frostbloom + arcane crystal + glass vial
  - **Poison Cloud**: AoE poison gas (5x5), lasts 4 turns, damages anyone entering; ingredients: spider venom + gloomcap + sulfite
  - **Flashbang**: blinds all enemies in room for 2 turns, no damage; ingredients: sunleaf + arcane crystal + iron filings
  - **Smoke Bomb**: creates fog (blocks line of sight) in 4x4 area for 5 turns; ingredients: gloomcap + sulfite + cloth
  - **Acid Flask**: single target, melts armor (-3 armor for rest of combat), high damage to constructs; ingredients: basilisk eye + mercury + glass vial
  - **Holy Water Bomb**: AoE holy damage to undead (3x damage), heals living allies slightly; ingredients: holy water + sunleaf + silver dust
- **Crafting**: requires alchemy station or portable alchemy kit; Alchemy skill determines success rate and potency
- **Throwing**: bombs are thrown up to 6 tiles; Dexterity check for accuracy; miss = detonation 1-2 tiles off target
- **Chain Reactions**: bombs near explosive barrels or other bombs trigger chain detonations
- **Friendly Fire**: all bombs damage the player and allies if in the blast zone
- **Bomb Pouch**: holds up to 10 bombs; without it, bombs take regular inventory slots

## Acceptance Criteria

- [ ] All bomb types craft with correct ingredients
- [ ] AoE effects apply to correct tile areas
- [ ] Throwing accuracy uses Dexterity checks
- [ ] Chain reactions trigger between explosive sources
- [ ] Friendly fire applies to player and allies
