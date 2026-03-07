# Phobia System

As a player, I want my character to develop phobias from traumatic experiences, so that past failures create persistent challenges that shape my playstyle.

## Details

- **Phobia Triggers**: near-death experiences with specific enemy types or environments
  - Nearly killed by spiders → Arachnophobia
  - Nearly drowned → Aquaphobia
  - Trapped in a cave-in → Claustrophobia
  - Burned badly → Pyrophobia
  - Fell from great height → Acrophobia
  - Attacked in total darkness → Nyctophobia
  - Betrayed by an NPC → Pistanthrophobia (trust issues)
- **Phobia Effects**: when encountering the feared thing:
  - Mild: -2 to all rolls, "Your hands tremble" messages
  - Moderate: -4 to all rolls, chance to freeze (lose a turn), visual effects (screen edges darken)
  - Severe: -6 to all rolls, flee impulse (Wisdom save or auto-flee), can't willingly approach the trigger
- **Phobia Progression**: repeated exposure without dying lessens phobia over time (exposure therapy)
- **Overcoming Phobias**: face the fear in a climactic moment (e.g., fight the spider queen while arachnophobic); success permanently removes the phobia and grants a bravery bonus
- **Maximum Phobias**: character can have up to 3 active phobias; gaining a 4th replaces the mildest one
- **Backstory Phobias**: certain backstory choices start the character with a mild phobia (adds roleplay flavor)
- **NPC Phobias**: some NPCs have phobias too — exploitable in combat or dialogue ("The bandit leader is terrified of fire")

## Acceptance Criteria

- [ ] Phobias trigger from correct near-death experiences
- [ ] Phobia effects apply at correct severity levels
- [ ] Exposure therapy gradually reduces phobia severity
- [ ] Climactic overcoming grants permanent removal and bonus
- [ ] NPC phobias are exploitable in gameplay
