# Spirit Possession Defense

As a player, I want mechanics for defending against spirit possession and methods for exorcising possessed NPCs, so that spiritual threats have engaging counter-play.

## Details

- **Possession Mechanics**: hostile spirits attempt possession via WIS contest (spirit's power vs target's WIS + will saves); proximity required (spirit must be within 3 tiles); takes 3 turns of sustained contact; target feels cold, hears whispers, sees flickers before full possession
- **Possession Indicators**: possessed NPCs show subtle signs — personality shift (kind NPC becomes cruel), unusual knowledge (knows things they shouldn't), physical tells (eye color change, voice distortion, cold touch), aura visible with Spirit Sight
- **Player Defense**:
  - **Iron Will (passive)**: high WIS provides natural resistance; WIS 18+ = near-immunity to weak spirits
  - **Protection Amulet**: wearable item; blocks possession attempts from spirits below the amulet's power level; consumes charge per blocked attempt
  - **Salt Circle**: draw a circle of salt (2 turns); spirits can't cross the barrier; lasts until disturbed; protects a small area
  - **Holy Symbol**: present a holy symbol (requires faith/deity); spirits must WIS save or flee; stronger faith = stronger effect
  - **Mental Fortress (skill)**: active defense; spend 3 turns focusing; grant +5 to WIS saves vs possession for 50 turns
- **Exorcism Methods**:
  - **Religious Exorcism**: priest or paladin performs ritual (10 turns); prayer + holy water + holy symbol; contest between exorcist's WIS + faith vs spirit's power; success = spirit expelled and banished; failure = spirit attacks exorcist
  - **Shamanic Exorcism**: shaman enters the spirit world to confront the possessing spirit directly; spirit combat in the ethereal plane; victory = spirit removed; less formal but more dangerous
  - **Forced Expulsion**: damage the possessed body enough that the spirit can't maintain hold (drop to 25% HP); spirit is expelled but the host is badly injured; brute force last resort
  - **Negotiation**: speak with the possessing spirit (CHA + Spirit Lore); some spirits have reasons for possessing (unfinished business, seeking help); resolve their issue and they leave voluntarily; best outcome for the host
  - **Binding**: instead of expelling, bind the spirit into an object (soul gem, totem, binding scroll); spirit is contained; object becomes magical but potentially dangerous
- **Failed Exorcism Consequences**: spirit becomes entrenched (harder to remove); spirit retaliates through the host (attacks the exorcist using the host's body); host's personality further suppressed

## Acceptance Criteria

- [ ] Possession attempts use correct WIS contest mechanics
- [ ] All defense methods provide correct protection levels
- [ ] Exorcism methods each have distinct requirements and success conditions
- [ ] Negotiation option resolves possession peacefully when spirit has valid reason
- [ ] Failed exorcism correctly increases difficulty and triggers retaliation
