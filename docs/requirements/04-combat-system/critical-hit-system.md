# Critical Hit System

As a player, I want critical hits to trigger spectacular effects beyond extra damage, with location-based injuries and cinematic descriptions, so that crits are exciting and tactically meaningful.

## Details

- **Critical Hit Trigger**: natural 20 on attack roll (5% base chance); modified by: weapon properties (+1-3% for keen weapons), abilities (certain talents increase crit range), flanking (+2% when attacking from behind), enemy condition (+5% vs stunned/paralyzed)
- **Critical Hit Locations** (roll on hit):
  - **Head (10%)**: 3x damage; stun for 2 turns; chance of concussion (-2 INT for 50 turns); helmets reduce to 2x damage
  - **Torso (30%)**: 2.5x damage; knockback 2 tiles; chance of broken ribs (-1 CON, pain when sprinting); armor absorbs some
  - **Arms (20%)**: 2x damage; disarm (weapon drops) or arm injury (-2 attack rolls for 30 turns); shields reduce chance
  - **Legs (20%)**: 2x damage; trip (target falls prone); leg injury (-2 movement speed for 30 turns); heavy armor reduces trip chance
  - **Vital Organs (10%)**: 3x damage; bleed (3 damage per turn for 10 turns); internal injury (ongoing damage until healed by skilled healer)
  - **Lucky Shot (10%)**: 4x damage; no special effect but massive raw damage; the "perfect strike"
- **Critical Descriptions**: LLM generates a vivid one-sentence description of the critical hit based on weapon type, location, and context ("Your warhammer catches the ogre's knee, shattering bone and sending it crashing to the ground")
- **Critical Fumble**: natural 1 on attack = fumble; effects: drop weapon (30%), hit ally (20%, half damage), stumble (lose next turn, 30%), weapon damage (weapon loses durability, 20%); fumble can be mitigated by DEX save (high DEX = less severe fumble)
- **Critical Hit Resistance**: some enemies have "crit immunity" (constructs, oozes, swarms — no vital points); boss enemies may have "fortified" (crit damage capped at 2x instead of location-based)
- **Critical Hit Talents**: talent tree branch for crit specialization; improved crit range, enhanced crit effects, "Executioner" (crits on enemies below 25% HP deal 5x damage), "Precise Strike" (choose crit location instead of rolling)

## Acceptance Criteria

- [ ] Critical hits trigger at correct probability including modifiers
- [ ] Hit locations roll with correct distribution and apply correct effects
- [ ] LLM generates contextual critical hit descriptions
- [ ] Critical fumbles produce correct negative effects with DEX mitigation
- [ ] Crit-immune enemies correctly resist location-based effects
