# Magical Tattoos

As a player, I want to get magical tattoos that grant permanent passive bonuses and activated abilities, so that body modification is a meaningful character customization system.

## Details

- **Tattoo Slots**: 8 body locations (left arm, right arm, chest, back, left leg, right leg, face, hands); each slot holds one tattoo; tattoos are permanent unless magically removed
- **Tattoo Artists**: specialized NPCs in major cities; each artist has a unique style and specialty; some are hidden (tribal shaman, underground ink mage, elven skin-singer)
- **Tattoo Types**:
  - **Elemental Runes**: fire (resist fire +15%, touch attacks deal burn), ice (resist cold +15%, slow aura in combat), lightning (resist shock +15%, chance to stun on hit), earth (resist physical +10%, +2 CON)
  - **Beast Marks**: wolf (night vision, tracking bonus), eagle (perception +3, dodge bonus), bear (STR +2, intimidation bonus), serpent (poison resist, flexibility bonus)
  - **Arcane Sigils**: mana regeneration +10%, spell damage +5%, spell cost reduction, arcane shield (auto-absorb first hit per combat)
  - **Shadow Ink**: stealth +3, blend into darkness, shadow step (short-range teleport in dim light, 1/day)
  - **Blood Tattoos**: forbidden; grants powerful abilities (life steal, berserker rage, death ward) but costs HP to activate; reputation penalty if visible
  - **Living Tattoos**: animate and move across skin; provide companionship bonus; occasionally warn of danger; rare and expensive
- **Tattoo Acquisition**: costs gold + materials (special inks, monster parts, gems); application takes 10-30 turns; pain mechanic (CON save or flinch = reduced quality)
- **Tattoo Interactions**: some tattoos synergize (wolf + eagle = "Hunter's Mark" combo bonus); conflicting tattoos weaken each other (fire + ice cancel resistances)
- **Tattoo Removal**: painful and expensive; arcane eraser NPC; leaves a scar (cosmetic) unless high-quality removal; freed slot can be re-tattooed
- **Tattoo Visibility**: visible tattoos affect NPC reactions (tribal tattoos respected by barbarians, feared by townsfolk; arcane sigils respected by mages, suspicious to templars)

## Acceptance Criteria

- [ ] All body slots correctly hold one tattoo each
- [ ] Tattoo bonuses apply correctly as passive and activated abilities
- [ ] Synergy and conflict systems work between tattoo types
- [ ] NPC reactions reflect visible tattoo types
- [ ] Removal and replacement mechanics function correctly
