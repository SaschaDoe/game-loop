# Death Domain Spells

As a player, I want a necromancy spell tree covering death magic, decay, life drain, and undead enhancement, so that necromancer casters have a full spell progression.

## Details

- **Tier 1 (Novice)**:
  - **Life Tap**: drain 5 HP from a living target, heal yourself for the amount; touch range; basic sustain spell
  - **Bone Shield**: conjure a floating shield of bones; absorbs 15 damage; lasts 30 turns or until depleted
  - **Chill Touch**: ranged necrotic attack; 8 damage; prevents target from healing for 3 turns
  - **Sense Death**: detect corpses, undead, and dying creatures within 20 tiles; reveals through walls
- **Tier 2 (Adept)**:
  - **Corpse Explosion**: detonate a corpse; AoE damage (damage scales with corpse size); 3-tile radius; gore everywhere
  - **Wither**: target creature ages rapidly; -3 STR, -3 CON for 10 turns; living plants die; CON save halves
  - **Undead Fortitude**: buff all controlled undead; +5 HP, +1 damage, +1 armor for 30 turns
  - **Death's Embrace**: touch a dying creature; instantly kill it and absorb its remaining HP (up to 30 HP gained)
- **Tier 3 (Expert)**:
  - **Plague Cloud**: create a cloud of necrotic gas; 5-tile radius; 3 damage per turn to living creatures inside; lasts 10 turns; doesn't affect undead
  - **Soul Rip**: tear at a target's soul; massive damage (30 necrotic) + stun for 2 turns; target at half HP or lower = instant kill (WIS save negates kill); 40 mana
  - **Mass Raise Dead**: raise all corpses in a 10-tile radius simultaneously; quality based on skill; great after a large battle; 60 mana
  - **Death Ward**: place a ward on yourself or ally; if lethal damage would kill them, they survive at 1 HP instead; one-time trigger; lasts 100 turns
- **Tier 4 (Master)**:
  - **Lichdom Ritual**: transform yourself into a lich (see lich transformation story); ultimate necromancy goal; requires level 20+ Necromancy, Grand Soul Gem with a humanoid soul, and 7 rare components
  - **Finger of Death**: point at a creature; it must make a CON save or die instantly; on success, takes 50 necrotic damage; killed creatures rise as zombies under your control; 80 mana
  - **Army of the Dead**: passive; all undead you control gain +3 to all stats; undead army limit doubles; your death aura frightens living enemies within 5 tiles

## Acceptance Criteria

- [ ] All spells deal correct damage/effects at correct mana costs
- [ ] Life drain spells correctly transfer HP from target to caster
- [ ] Corpse Explosion scales damage with corpse size
- [ ] Mass Raise Dead correctly animates all corpses in radius
- [ ] Lichdom Ritual requires correct prerequisites and components
