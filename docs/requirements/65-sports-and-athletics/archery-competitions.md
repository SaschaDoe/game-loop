# Archery Competitions

As a player, I want to compete in archery contests testing accuracy, speed, and trick shots, so that ranged combat skills have a competitive outlet beyond combat.

## Details

- **Competition Types**:
  - **Target Shooting**: stationary targets at increasing distances (10, 20, 30, 40, 50 tiles); DEX + ranged skill determines accuracy; bullseye = 10 points, inner ring = 7, outer ring = 4, miss = 0; 5 arrows per distance
  - **Speed Shooting**: hit as many targets as possible in 10 turns; targets appear for 2 turns each then vanish; tests reaction speed and quick aiming; DEX primary
  - **Moving Targets**: targets slide across the field on tracks; must lead the shot; DEX + INT (calculating trajectory); some targets are small (bonus points), some are decoys (penalty for hitting)
  - **Trick Shot Challenge**: increasingly difficult shots; through hoops, off surfaces, split an arrow, hit a target while blindfolded (Perception check); crowd cheers for successful tricks
  - **Mounted Archery**: shoot targets while riding a horse/mount at speed; DEX + Riding skill; horse speed affects difficulty; extra points for hitting targets on both sides
  - **Combat Archery**: two archers face off with padded arrows; hit opponent's target zones for points; dodge opponent's arrows; first to 10 points or last standing wins
- **Wind and Weather**: outdoor competitions affected by wind (arrow drift), rain (reduced visibility), sun glare (Perception penalty); reading conditions is part of the skill
- **Equipment**: competition provides standard bows; players can use their own (better bow = accuracy bonus); enchanted bows banned in official tournaments but allowed in underground matches
- **Prize Tiers**: local (gold + minor item), regional (gold + quality bow), national (gold + legendary bow + "Hawkeye" title), world championship (unique ability: "Perfect Shot" — 1/day guaranteed critical hit with ranged weapon)

## Acceptance Criteria

- [ ] All competition types use correct skill checks and scoring
- [ ] Wind and weather modifiers affect arrow trajectory appropriately
- [ ] Moving target leading calculations work correctly
- [ ] Equipment bonuses apply within tournament rules
- [ ] Prize tiers scale correctly with competition level
