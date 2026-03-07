# Persuasion and Intimidation

As a player, I want to persuade, intimidate, or deceive NPCs through dialogue, so that my social skills open up alternative solutions to problems.

## Details

- The LLM evaluates the player's dialogue attempt against the NPC's personality and willingness
- Charisma stat influences success probability
- Persuasion: convince NPCs to help, lower prices, reveal secrets
- Intimidation: threaten NPCs into compliance (may damage relationship)
- Deception: lie to NPCs (Wisdom-based detection chance)
- Success/failure is determined by a combination of stat check and LLM judgment
- NPCs who catch you lying remember it and trust you less
- Some NPCs are immune to intimidation (guards, bosses) or persuasion (fanatics)

## Acceptance Criteria

- [ ] Player can attempt persuasion, intimidation, or deception in dialogue
- [ ] Success rates are influenced by stats and NPC personality
- [ ] Failed deception is remembered by the NPC
- [ ] Immune NPCs resist appropriate social approaches
