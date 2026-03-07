# Unarmed Combat

As a player, I want a deep unarmed fighting system with kicks, punches, throws, and chi techniques, so that monk and brawler builds are viable without weapons.

## Details

- **Unarmed Attacks**:
  - **Jab** (fast): 3 damage, no cooldown, can attack twice per turn; builds combo meter
  - **Cross** (heavy): 7 damage, slight windup; chance to daze (enemy -2 accuracy next turn)
  - **Uppercut** (finisher): 10 damage, knocks small enemies into the air (1 turn stun); requires 3 combo stacks
  - **Roundhouse Kick**: 8 damage, hits target + adjacent enemy (sweep AoE); requires DEX 14+
  - **Flying Kick**: move 3 tiles + attack in one action; 9 damage + knockback; must have running start
  - **Palm Strike**: 6 damage + pushes enemy back 2 tiles; ignores 50% armor (internal damage)
  - **Elbow Strike**: 5 damage at point blank; breaks grapples; guaranteed bleed if target has no helmet
- **Chi System** (monk resource, like mana but for martial arts):
  - Chi generates from landing unarmed attacks (1 per hit) and from meditation (skip turn = 5 chi)
  - **Chi Strike**: spend 5 chi; next unarmed hit deals 3x damage and ignores all armor
  - **Iron Body**: spend 10 chi; become immune to physical damage for 2 turns
  - **Flurry of Blows**: spend 8 chi; attack 5 times in one turn (each hit builds more chi)
  - **Pressure Points**: spend 3 chi; target a specific body part (arm = disarm, leg = slow, neck = stun, eye = blind)
  - **Ki Blast**: spend 15 chi; ranged energy attack, 6-tile line, 12 damage; only unarmed ability with range
- **Unarmed Scaling**: unarmed damage scales with STR, DEX, and Unarmed Combat skill; at high levels, fists outdamage most weapons
- **Unarmed Defense**: blocking with forearms (Dodge + Unarmed skill); deflect projectiles at high skill (catch arrows)
- **Fighting Styles** (learnable from trainer NPCs):
  - Crane Style: evasive, counter-focused; +3 dodge, counterattack after every dodge
  - Tiger Style: aggressive, overwhelm; +3 damage, attacks build bonus damage stacks
  - Dragon Style: balanced, elemental; unarmed attacks can channel elemental chi (fire fists, lightning palm)
  - Drunken Style: unpredictable; drinking alcohol improves unarmed combat (+2 damage per drink, no drunkenness penalty to unarmed)

## Acceptance Criteria

- [ ] All unarmed attacks function with correct damage and effects
- [ ] Chi system generates, tracks, and spends correctly
- [ ] Unarmed damage scales with relevant stats and skill
- [ ] All four fighting styles provide distinct playstyle changes
- [ ] Pressure point targeting affects correct body parts
