# Doppelganger Encounters

As a player, I want to encounter shapeshifting doppelgangers that impersonate NPCs, so that paranoia and identity verification become gameplay mechanics.

## Details

- **Doppelganger Behavior**: replaces an existing NPC in a town; looks identical; imitates their dialogue (but subtly off — LLM generates slightly wrong personality cues)
- **Tells** (how to detect a doppelganger):
  - Dialogue inconsistencies: the doppelganger doesn't perfectly know the NPC's history (ask specific personal questions)
  - Shadow: doppelganger's shadow doesn't match their current form (visible with careful tile examination)
  - Animal reactions: pets and animals growl at doppelgangers; horses refuse to let them ride
  - Detect Magic: reveals a transmutation aura around the doppelganger
  - Mirror: doppelgangers appear as their true form in mirrors/reflections
  - Silver Touch: silver items cause pain to doppelgangers (they flinch)
- **Doppelganger Goals**: assassination (replace target to get close to their allies), infiltration (access restricted areas), theft (steal from the NPC's resources), sabotage (destroy relationships by acting badly while disguised)
- **Quest Hooks**:
  - An NPC behaves strangely; investigation reveals they've been replaced
  - Multiple NPCs report seeing each other in places they weren't (doppelganger was there)
  - A murder suspect is innocent — a doppelganger committed the crime wearing their face
  - A companion is replaced during a long absence (devastating betrayal moment)
- **Combat**: when exposed, doppelgangers fight with: shapeshifting mid-combat (cycling through known NPC forms to confuse), mimicry attack (copies player's last ability), flee + disguise (attempt to blend back into the crowd)
- **True Form**: gray, featureless humanoid; weaker in true form than in disguise; will avoid being forced into it
- **Player Doppelganger**: extremely rare event where a doppelganger takes the player's form and attempts to ruin their reputation

## Acceptance Criteria

- [ ] Doppelgangers replace NPCs with slightly incorrect behavior
- [ ] All detection methods reveal doppelgangers correctly
- [ ] Quest hooks trigger from doppelganger activity
- [ ] Combat shapeshifting cycles through known forms
- [ ] Player doppelganger event creates reputation damage
