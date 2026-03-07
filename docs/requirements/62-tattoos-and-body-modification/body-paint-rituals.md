# Body Paint Rituals

As a player, I want temporary body paint rituals that grant powerful short-duration buffs tied to cultural traditions, so that body modification includes a temporary, renewable option.

## Details

- **Paint Types**:
  - **War Paint (Barbarian)**: red/black patterns; +2 STR, +2 intimidation, +15% damage for 50 turns; applied by barbarian shaman or self-applied with tribal knowledge
  - **Camouflage Paint (Ranger)**: green/brown patterns; +3 stealth in wilderness, enemies have -2 to detect you outdoors; 50 turns; requires natural pigments
  - **Ritual Markings (Shaman)**: white/blue spiral patterns; +2 WIS, +10% healing effectiveness, spirit sight (see invisible spirits); 50 turns; requires blessed chalk
  - **Death Mask (Necromancer)**: skull paint on face; undead treat you as one of them (no aggro), +2 intimidation vs living; 30 turns; requires bone powder + ash
  - **Festival Paint (Bard)**: bright colorful patterns; +3 CHA, +20% performance tips, NPC friendliness +2; 30 turns; available during festivals from face-painting NPCs
  - **Blood Runes (Blood Mage)**: drawn with own blood (-5 HP to apply); +15% blood magic damage, blood spells cost 20% less HP; 40 turns; self-applied only
  - **Warding Glyphs (Priest)**: holy symbols painted on skin; +20% resistance to dark magic, undead deal -2 damage to you; 50 turns; requires holy oil
- **Application Mechanics**: applying paint takes 5 turns; requires the correct materials; some paints require an NPC to apply (barbarian war paint needs a shaman); self-applied paint has slightly weaker effects (-10%)
- **Paint Stacking**: maximum 2 paints active simultaneously; paints from conflicting traditions cancel each other (war paint + camouflage don't stack; death mask + warding glyphs conflict)
- **Environmental Effects**: rain washes paint away faster (duration halved); swimming removes paint entirely; extremely hot environments cause paint to smear (duration reduced 25%)
- **Cultural Context**: applying a culture's paint without belonging to that culture may offend them (-reputation); or impress them if you've earned their trust

## Acceptance Criteria

- [ ] All paint types grant correct buffs for correct durations
- [ ] Application requires correct materials and time
- [ ] Stacking rules prevent conflicting paints from coexisting
- [ ] Environmental effects correctly reduce paint duration
- [ ] Cultural context affects reputation appropriately
