# Polymorph Spell

As a player, I want to cast polymorph on enemies and NPCs to temporarily turn them into harmless creatures, so that I have a powerful crowd-control option in and out of combat.

## Details

- Polymorph targets a single creature (enemy or NPC) and transforms them for 3-8 turns depending on spell level
- Target becomes a harmless creature: sheep, frog, chicken, or snail (random)
- Transformed creature retains its HP but loses all abilities, attacks, and resistances
- If the polymorphed creature takes damage, the spell breaks early
- Higher-level polymorph: longer duration, harder to resist, option to choose the form
- **Baleful Polymorph** (advanced): permanent transformation, requires Wisdom save; failure = permanent animal form
- Polymorph can be cast on self as a disguise (enter areas as a harmless animal)
- Some enemies are immune: constructs, undead, boss-tier creatures
- Visual: target tile changes to the animal character with a sparkle effect
- NPCs react to polymorphed creatures (a sheep in a dungeon is suspicious)
- Dispel Magic removes polymorph instantly

## Acceptance Criteria

- [ ] Polymorph transforms targets for correct duration
- [ ] Transformed creatures lose abilities and attacks
- [ ] Damage breaks the spell early
- [ ] Boss and construct immunities work
- [ ] Self-polymorph functions as disguise
