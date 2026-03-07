# Psychic Combat

As a player, I want to engage enemies in mental battles on a psychic plane, so that combat has a non-physical dimension for mind-focused characters.

## Details

- **Psychic Duel Trigger**: initiated by psi-capable creatures or by the player targeting a sentient enemy's mind; both combatants enter a mental arena
- **Mental Arena**: abstract ASCII representation of a mindscape; terrain is shaped by both combatants' mental state (confident = solid ground; fearful = chasms; angry = fire)
- **Psychic Attacks**:
  - **Mind Blast**: direct psychic damage; bypasses physical armor; resisted by Wisdom
  - **Memory Assault**: force the target to relive traumatic memories; stun + psychic damage; more effective against targets with low sanity
  - **Identity Erosion**: strip away the target's sense of self; -2 to all stats per successful hit; at -10 total, target is catatonic
  - **Ego Whip**: lash of mental energy; targets self-confidence; reduces attack damage of the target by 50% for 3 turns
  - **Psychic Fortress**: build mental walls; +5 to psychic defense for 3 turns; if enemy attacks, they take reflected damage
- **Psychic Defense**:
  - **Iron Will**: passive resistance; Wisdom modifier reduces all psychic damage
  - **Mind Blank**: 1 turn of complete psychic immunity; costs heavy psi points
  - **Counter-Intrusion**: when an enemy uses telepathy on you, trace it back and deal damage to them
- **Duel Resolution**: loser is stunned in the real world for 5 turns; winner gets a mental advantage (+2 to all checks against that enemy for 50 turns)
- **Psychic Feedback**: if a psychic duel participant dies in the mental arena, they take 50% of their max HP as real damage + permanent -1 WIS
- **NPC Psychics**: some enemies are primarily psychic combatants (mind flayer-types, psion monks, eldritch seers); physical attacks on them are less effective; psychic duel is the intended approach
- Physical combat continues around the duel; both bodies are vulnerable while in the psychic plane

## Acceptance Criteria

- [ ] Psychic duel initiates and renders mental arena correctly
- [ ] All psychic attacks and defenses function with correct damage/effects
- [ ] Duel resolution applies correct post-duel effects
- [ ] Physical vulnerability during duel creates tactical risk
- [ ] NPC psychic enemies encourage psychic combat approach
