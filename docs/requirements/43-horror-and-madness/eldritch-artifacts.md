# Eldritch Artifacts

As a player, I want to discover alien artifacts that grant terrifying power at the cost of sanity and humanity, so that horror items create genuine risk-reward dilemmas.

## Details

- **Artifact Discovery**: found in eldritch dungeons, cultist lairs, meteorite crash sites, and the deepest ocean trenches; never sold in shops; some are quest rewards from dark entities
- **Artifact Types**:
  - **Eye of the Void**: a floating eye that orbits the player; grants True Sight (see invisible, through walls, detect lies); costs 1 sanity per 10 turns while equipped; at 0 sanity, the eye controls the player
  - **Whispering Blade**: a dagger that whispers in alien languages; deals psychic damage (ignores armor); each kill heals the wielder but reduces max sanity by 1 permanently; blade resists being unequipped (WIS save to remove)
  - **Crown of the Deep**: a coral crown; grants water breathing, command sea creatures, immunity to pressure; wearer slowly transforms into a sea creature (cosmetic changes every 100 turns); full transformation at 500 turns (lose the character)
  - **Tome of Unspeakable Truths**: reading grants +5 INT permanently but -3 WIS permanently and a permanent phobia (random); each re-read grants another +1 INT / -1 WIS; addictive
  - **Void Compass**: points toward the nearest dimensional weak point; allows opening unstable portals; using it attracts extradimensional entities that hunt the user
  - **Living Mask**: bonds to the wearer's face; grants +5 CHA and Mesmerize ability; slowly replaces the wearer's personality with the mask's previous owner; removing requires Remove Curse + holy ritual
- **Eldritch Corruption**: using artifacts builds corruption counter; corruption causes: NPC unease (lower reputation), dark visual aura, nightmares, hearing whispers, and eventually attracting eldritch monster encounters
- **Artifact Destruction**: most artifacts can't be destroyed normally; requires specific rituals (drown in holy water under a full moon, burn in a dragon's flame, shatter at a dimensional nexus); destruction releases a burst of eldritch energy (area damage + sanity drain to all nearby)
- **Artifact Synergy**: carrying multiple eldritch artifacts amplifies their power but compounds their drawbacks; 3+ artifacts triggers "Eldritch Convergence" (powerful AoE aura but sanity drains at 3x rate)

## Acceptance Criteria

- [ ] All artifacts provide correct powers and exact drawback mechanics
- [ ] Sanity costs accumulate correctly from artifact usage
- [ ] Corruption counter tracks and produces correct effects
- [ ] Artifact destruction requires specific conditions
- [ ] Synergy bonuses and amplified drawbacks calculate correctly for multiple artifacts
