# Fighting Styles

As a player, I want to learn and master distinct martial arts fighting styles with unique move sets and philosophies, so that unarmed combat has as much depth and variety as weapon combat.

## Details

- **Style Learning**: find a master of the style; complete a trial to prove worthiness; training takes 20-50 turns; can learn up to 3 styles but only 1 active at a time (switch outside combat)
- **Available Styles**:
  - **Iron Fist (STR)**: powerful single strikes; each hit has a chance to stagger; signature move: "Shattering Palm" (ignores 50% armor); slow but devastating
  - **Wind Step (DEX)**: rapid combos; each consecutive hit in a turn adds +1 damage; signature move: "Hundred Hands" (5 rapid strikes at reduced damage each); fast but individually weak
  - **Stone Wall (CON)**: defensive martial art; reduces incoming melee damage by 25%; counter-attacks on missed enemy strikes; signature move: "Immovable Stance" (cannot be moved or knocked down for 3 turns)
  - **Viper Strike (DEX)**: targets pressure points; attacks have 15% chance to disable a body part (arm = reduced attack, leg = reduced movement); signature move: "Paralyzing Touch" (full body paralysis for 2 turns, CON save)
  - **Dragon Breath (WIS)**: channels chi into elemental attacks; punches deal fire/ice/lightning damage based on chi attunement; signature move: "Dragon's Roar" (AoE chi blast, 3-tile range)
  - **Drunken Fist (CHA)**: unpredictable movements; +20% dodge; accuracy penalty but critical hit chance doubled; signature move: "Stumbling Fury" (random flurry of 3-7 hits)
  - **Shadow Palm (INT)**: strikes target the opponent's magical essence; deals damage to mana as well as HP; signature move: "Void Touch" (drains 50% of target's current mana, heals user for half)
- **Style Mastery**: using a style in 50+ combats unlocks mastery rank; mastery reduces chi costs by 25%, unlocks a second signature move, and allows blending techniques from 2 styles simultaneously
- **Style Rivalries**: certain styles have bonuses against others (Iron Fist beats Stone Wall with armor-piercing, Wind Step beats Iron Fist with speed, etc.)

## Acceptance Criteria

- [ ] All fighting styles have distinct move sets and stat scaling
- [ ] Style switching works outside combat with correct active style
- [ ] Signature moves trigger with correct effects and costs
- [ ] Mastery system tracks combat usage and unlocks at 50 fights
- [ ] Style rivalries apply correct bonuses in PvP and sparring
