# Combat Sound Design

As a player, I want distinct sound effects for every combat action that convey impact and information, so that I can understand combat flow through audio alone.

## Details

- **Weapon Sounds** (procedurally generated per weapon type):
  - Sword: metallic slash, pitch varies with damage dealt (higher pitch = crit)
  - Mace: heavy thud, bass impact, crunch on armored targets
  - Dagger: quick sharp stab, whisper sound for stealth kills
  - Bow: string twang → arrow whistle → impact thud (delay based on distance)
  - Staff: wooden crack, arcane hum on magic-enhanced hits
- **Spell Sounds**:
  - Fire: crackling roar, whoosh on cast, sizzle on impact
  - Ice: crystalline chime on cast, cracking shatter on impact
  - Lightning: electric zap, thunderclap on hit, buzzing on chain lightning
  - Heal: warm chime, rising tone, gentle bell
  - Necromancy: deep moan, bone rattle, eerie whisper
- **Hit Feedback**:
  - Normal hit: impact sound matching weapon
  - Critical hit: enhanced impact + glass-shatter accent
  - Miss: whoosh (swing through air)
  - Block/Parry: metallic clang, shield thud
  - Dodge: quick wind rush
  - Resist: dull muffled impact
- **Status Effect Sounds**: poison (bubbling), burning (sustained crackle), frozen (ice creak), stunned (ringing bell), bleeding (drip)
- **Combat Music Integration**: hit sounds sync to the beat of combat music when possible
- All sounds generated via Web Audio API oscillators and noise shaping — zero audio file downloads
- Sound panning: attacks from the left pan left, etc. (spatial positioning)

## Acceptance Criteria

- [ ] All weapon types produce distinct sounds
- [ ] Spell sounds match elemental type
- [ ] Hit feedback sounds differentiate outcomes (hit, crit, miss, block)
- [ ] Status effect sounds loop during active effects
- [ ] All audio is procedurally generated via Web Audio API
