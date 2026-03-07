# Aberration Enemies

As a player, I want to face eldritch aberrations — alien creatures that defy natural law — with sanity-draining attacks and bizarre abilities, so that some enemies feel truly otherworldly and terrifying.

## Details

- **Aberration Types**:
  - **Mind Flayer**: humanoid with tentacle face; psychic blast (AoE INT damage + stun); tentacle grapple (extract brain if held 3 turns = instant kill); mind control (dominate one ally); INT 18; weak to: fire, bright light
  - **Beholder**: floating orb with central eye + 10 eyestalks; each eyestalk fires a different ray (charm, fear, slow, petrify, disintegrate, sleep, telekinesis, paralysis, death, antimagic); antimagic central eye (cone negates all magic in front); rotates to aim different rays each turn; weak to: melee from behind (no eyestalks)
  - **Gibbering Mouther**: amorphous blob of mouths and eyes; gibbering noise (WIS save or confused for 3 turns); acid spit (dissolve armor); absorb (engulf and digest grappled targets); ground nearby becomes slippery (DEX save or fall); weak to: fire, cold
  - **Aboleth**: ancient aquatic creature; telepathy (knows your thoughts, anticipates attacks); mucus cloud (transforms air-breathers to water-breathers temporarily — can't breathe air for 50 turns); enslave (WIS save or permanently charmed until cured); lair in deep water; weak to: psychic damage, dehydration
  - **Intellect Devourer**: brain-shaped creature on legs; devour intellect (reduce INT by 3 per hit; at 0 INT = body puppet, intellect devourer controls the body); small and fast; steals intelligence to grow; weak to: Protection from Evil, holy magic
  - **Star Spawn**: creatures from beyond the stars; reality warps around them (terrain shifts, gravity changes); tentacle lash (reach 3 tiles); dimensional anchor (teleport blocked near them); gaze of madness (WIS save or gain a random phobia); weak to: radiant damage, banishment spells
  - **Otyugh**: trash-eating tentacle monster; found in sewers and garbage heaps; tentacle slam + grapple; diseased bite (infection chance); stench aura (CON save or nauseated); weak to: fire; not truly evil (territorial scavenger)
- **Sanity Impact**: all aberrations cause passive sanity drain (1 sanity per turn in proximity); killing an aberration restores 5 sanity; fleeing from aberrations without fighting causes shame debuff (-1 CHA)
- **Aberration Loot**: alien materials (void chitin, psychic crystals, tentacle leather); used in crafting unique items that have both powerful effects and sanity costs
- **Aberration Lairs**: reality is distorted inside; gravity shifts, non-Euclidean geometry (rooms connect in impossible ways), time dilation (turns pass faster/slower); must navigate environmental puzzles alongside combat

## Acceptance Criteria

- [ ] All aberration types use correct abilities with correct stat targets
- [ ] Mind Flayer brain extraction triggers after correct grapple duration
- [ ] Beholder eyestalk rays cycle correctly each turn
- [ ] Sanity drain applies passively during aberration encounters
- [ ] Aberration lairs produce correct reality distortion effects
