# Magical Trap Runes

As a player, I want to create spell-powered traps using rune combinations that produce magical effects when triggered, so that mage characters have a trap system that scales with magical power.

## Details

- **Rune Trap Basics**: draw a trigger rune + effect rune on the ground using arcane chalk (5 turns to inscribe); INT + Enchanting skill determines trap power and detection difficulty; mana consumed on creation (not trigger); traps persist until triggered or 500 turns pass
- **Trigger Runes**:
  - **Proximity**: activates when a creature enters 2-tile radius
  - **Pressure**: activates on weight (can set weight threshold — triggers on heavy creatures but not rats)
  - **Timed**: activates after set number of turns
  - **Conditional**: activates on a specific condition (undead only, hostile only, creature type specific); requires higher skill
  - **Chain**: activates when another rune trap within 5 tiles triggers; enables trap cascades
- **Effect Runes**:
  - **Fire Rune**: AoE fire explosion (3-tile radius); 20 + INT modifier damage; ignites terrain
  - **Frost Rune**: AoE freezing burst (3-tile radius); 15 damage + frozen ground (slow for 10 turns)
  - **Lightning Rune**: chain lightning hitting up to 4 targets; 18 + INT modifier damage; stun chance
  - **Gravity Rune**: pulls all creatures within 5 tiles to the center; 10 crushing damage; immobilized for 2 turns
  - **Banishment Rune**: target must WIS save or be banished to a pocket dimension for 10 turns; returns dazed; only works on extraplanar creatures permanently
  - **Silence Rune**: AoE silence (4-tile radius); no magic can be cast; lasts 15 turns; anti-mage trap
  - **Sleep Rune**: AoE sleep (3-tile radius); WIS save or fall asleep for 10 turns; wake on damage
  - **Teleport Rune**: triggered creature teleported to a location you designate (must have visited); one-way trip; hilarious for sending enemies far away
- **Rune Camouflage**: higher skill makes runes harder to detect; master-level runes are invisible without Detect Magic; combine with mundane traps for layered defenses
- **Rune Synergy with Clockwork Traps**: rune trigger + clockwork mechanism = hybrid trap (magical effect powered by mechanical reliability); the best of both systems

## Acceptance Criteria

- [ ] All trigger runes activate under correct conditions
- [ ] All effect runes produce correct damage and effects
- [ ] Rune creation consumes correct mana based on effect tier
- [ ] Chain trigger correctly cascades to linked rune traps
- [ ] Rune camouflage difficulty scales with caster skill
