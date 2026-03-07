# Permutation Modifiers

As a player, I want optional world modifiers that dramatically change game rules for replayability, so that each new game can have completely different mechanics.

## Details

- **Modifier Selection**: choose 0-5 modifiers at world creation; each modifier changes fundamental game rules; more modifiers = harder but more interesting; modifiers shown on character select as icons
- **World Modifiers**:
  - **No Magic**: all magic disabled; no spells, enchantments, or magical creatures; pure physical combat and technology; potions replaced with herbal remedies; completely different game feel
  - **Eternal Night**: no daytime; permanent darkness; nocturnal creatures everywhere; torches and light sources critical; sun-based mechanics removed; vampires and undead dominant
  - **Flooded World**: sea levels risen; most land is shallow water or islands; boats essential for travel; aquatic creatures abundant; underwater dungeons more common; fire magic penalized
  - **Monster Uprising**: all monsters 50% stronger; monsters coordinate attacks on towns; peaceful wilderness doesn't exist; survival mode emphasis; double loot as compensation
  - **Pacifist World**: no lethal combat allowed (all damage is non-lethal); emphasis on diplomacy, stealth, puzzles, and social skills; killing anything results in divine punishment; fundamentally different playstyle
  - **Time Pressure**: a world-ending event is 5000 turns away; everything you do must work toward stopping it; no time for side content unless it contributes; creates urgency and tough choices
  - **Reversed Economy**: common items are expensive, rare items are cheap; gold is nearly worthless; barter economy; completely different gear progression
  - **One Life**: combined with permadeath; no resurrection of any kind; even quest-related deaths are permanent; ultimate challenge modifier
  - **Random Classes**: character class changes every 500 turns; must adapt to new abilities constantly; equipment may become unusable when class shifts
  - **Friendly Fire**: all AoE and splash damage hits allies; positioning becomes critical; companions become dangerous to have; solo play encouraged
- **Modifier Combos**: certain combinations create special modes (No Magic + Monster Uprising = "Survival Horror"; Eternal Night + One Life = "Nightmare Mode"; Pacifist World + Time Pressure = "Diplomat's Race")
- **Modifier Achievements**: completing the game with specific modifiers active grants unique achievements and cosmetic rewards; completing with all modifiers simultaneously = "Impossible" achievement

## Acceptance Criteria

- [ ] All modifiers correctly alter game rules as described
- [ ] Modifiers are selectable at world creation (0-5)
- [ ] Modifier combos create named special modes
- [ ] Achievements track completion with specific modifier configurations
- [ ] Compensation mechanisms (double loot, etc.) balance difficulty increases
