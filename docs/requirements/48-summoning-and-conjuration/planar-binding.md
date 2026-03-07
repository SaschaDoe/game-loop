# Planar Binding

As a player, I want to bind creatures from other planes into permanent service through dangerous rituals, so that endgame summoning offers powerful but risky long-term allies.

## Details

- **Bindable Entities** (each from a different plane):
  - **Imp** (Infernal Plane): small, flies, invisible at will, scouts, can pick locks; unreliable — may lie or steal
  - **Djinn** (Elemental Plane): grants 3 wishes (limited: no resurrection, no stat changes, no instant kills); then departs
  - **Shadow Hound** (Shadow Plane): tracks any target across the world map; silent, terrifying; howl causes fear
  - **Celestial Guardian** (Divine Plane): heavy armor, holy sword, protects the caster; refuses to attack innocents
  - **Void Walker** (Far Realm): alien entity; sees through walls, teleports, madness aura affects everyone nearby (including allies); uncontrollable in combat
- **Binding Ritual Requirements**:
  - Summoning circle (drawn with chalk/blood/runes at specific location types)
  - Offering: each entity demands something specific (imp: soul gem, djinn: elemental core, shadow hound: fresh corpse, celestial: holy relic, void walker: forbidden tome)
  - Willpower contest: caster's INT + Summoning skill vs entity's resistance; failure = entity breaks free and attacks
- **Bound Entity Behavior**: follows commands but retains personality; may question or refuse orders that conflict with their nature
- **Breaking Free**: if the caster is knocked unconscious, bound entities make a check to break free each turn; freed entities may attack, flee, or express gratitude depending on how they were treated
- **LLM Dialogue**: bound entities can be conversed with; they have opinions, offer advice, and may reveal planar secrets
- Only 1 bound entity at a time; binding a second releases the first

## Acceptance Criteria

- [ ] All five entity types are bindable with correct rituals
- [ ] Willpower contest determines binding success
- [ ] Bound entities follow commands with personality-consistent exceptions
- [ ] Entities can break free when caster is unconscious
- [ ] LLM dialogue works for bound entity conversations
