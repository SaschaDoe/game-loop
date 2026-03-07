# Undead Enemies

As a player, I want to encounter a variety of undead creatures with distinct abilities and weaknesses, so that fighting the undead feels thematically different from other combat.

## Details

- **Skeleton Warrior**: low HP, immune to poison/bleed, reassembles after death (must be killed twice or hit with blunt weapon to shatter permanently)
- **Zombie**: slow, high HP, infectious bite (Constitution save or take ongoing necrotic damage), swarm in groups
- **Ghoul**: fast, paralyzing touch (Dexterity save or stunned 1 turn), pack hunter, attracted to corpses on the battlefield
- **Wraith**: incorporeal (50% chance to avoid physical damage), life drain attack, can phase through walls, weak to holy and silver
- **Vampire Spawn**: fast, charming gaze (Wisdom save), blood drain (heals self), recoils from garlic and holy symbols, regenerates in darkness
- **Lich**: boss-tier, powerful spellcaster, has a phylactery hidden elsewhere — must find and destroy it or the lich returns after 10 turns
- **Death Knight**: armored, mounted on skeletal horse, aura of despair (-2 to all nearby player stats), devastating charge attack
- **Bone Golem**: assembled from many skeletons, throws bone shards (ranged AoE), immune to necrotic
- **All Undead share**: immunity to poison, disease, charm, fear, bleeding; vulnerability to holy damage, fire, silver weapons
- Undead are more common at night; some only spawn in darkness
- Necromancers can raise killed enemies as undead allies (player necromancer can too)

## Acceptance Criteria

- [ ] All undead types have unique abilities and behaviors
- [ ] Shared immunities (poison, charm, etc.) apply to all undead
- [ ] Holy/fire/silver vulnerability is mechanically rewarded
- [ ] Lich phylactery mechanic works correctly
- [ ] Undead spawn rates increase at night
