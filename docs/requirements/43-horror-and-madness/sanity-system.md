# Sanity System

As a player, I want a sanity meter that degrades when exposed to eldritch horrors, darkness, and traumatic events, so that psychological survival adds tension beyond physical HP.

## Details

- **Sanity Meter**: 0-100, starts at 100; displayed as a brain icon in the HUD
- **Sanity Drains**:
  - Witnessing eldritch creatures: -5 to -20 depending on creature tier
  - Prolonged darkness without a light source: -1 per 10 turns
  - Reading forbidden tomes: -10 per book (but grants powerful knowledge)
  - Companion death: -15
  - Killing innocents: -10
  - Being in haunted locations: -2 per 10 turns
  - Failing a nightmare encounter: -10
- **Sanity Thresholds**:
  - 75-100: Normal — no effects
  - 50-74: Uneasy — occasional whispers in the message feed, minor visual glitches (tile colors flicker)
  - 25-49: Disturbed — hallucinated enemies appear on map (not real, waste attacks), NPC dialogue seems threatening, paranoia (-2 Charisma)
  - 1-24: Unhinged — severe hallucinations (entire fake rooms), controls occasionally invert, character mutters (alerts real enemies), -4 to all mental stats
  - 0: Madness — character becomes uncontrollable for 20 turns (wanders randomly, attacks allies), then recovers to 10 sanity
- **Sanity Recovery**: resting at safe locations (+5), talking to companions (+3), visiting a temple (+15), drinking calming tea (+10), completing quests (+5)
- **Madness Perks**: at low sanity, player can see things others can't — hidden messages on walls, ghost NPCs with useful information, secret paths
- **Eldritch Resistance**: Wisdom stat reduces sanity loss; certain items (amulet of clarity, mind ward) provide protection

## Acceptance Criteria

- [ ] Sanity meter displays and drains from correct sources
- [ ] All threshold effects trigger at correct ranges
- [ ] Hallucinations are visually distinct enough to eventually recognize but initially convincing
- [ ] Recovery methods restore correct amounts
- [ ] Low-sanity perks reveal hidden content
