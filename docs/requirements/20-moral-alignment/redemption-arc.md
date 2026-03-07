# Redemption Arc

As a player, I want to pursue a redemption arc that allows evil-aligned characters to gradually shift toward good through specific quests and sacrifices, so that alignment isn't permanently locked and character growth is meaningful.

## Details

- **Redemption Trigger**: available when player's alignment is Evil or Chaotic Evil and they perform a genuinely selfless act (saving an NPC without reward, sparing an enemy, donating significant wealth); a vision/dream sequence offers the path of redemption
- **Redemption Quests**: a chain of 5 escalating quests designed to test sincerity:
  1. **Atonement**: apologize and make amends to a specific wronged NPC (gold payment + service); NPC may refuse initially
  2. **Sacrifice**: give up a powerful item or significant gold to help a community in need; no gameplay reward
  3. **Protection**: defend a vulnerable group (orphanage, refugees, monastery) against a threat without any payment
  4. **Confession**: publicly confess past crimes at a temple; takes reputation hit with criminal contacts; gains trust with lawful factions
  5. **Final Test**: face a mirror of your past self (shadow boss fight); victory represents overcoming your nature
- **Alignment Shift**: each quest shifts alignment 1 step toward good; completing all 5 moves from Evil to Good; partial completion leaves you at Neutral
- **Consequences of Redemption**: evil faction contacts become hostile; good factions slowly accept you (50-turn warming period); former criminal allies may try to kill you as a traitor; new quest lines unlock
- **Backsliding**: committing evil acts during redemption resets progress; 3 backsides cancel the redemption arc entirely (NPC says "You had your chance")
- **Reverse Redemption (Corruption)**: good characters can pursue a corruption arc with mirrored mechanics; 5 quests of increasingly dark acts; same consequences in reverse

## Acceptance Criteria

- [ ] Redemption triggers correctly for evil-aligned characters
- [ ] All 5 quest stages complete with correct alignment shifts
- [ ] Backsliding resets progress appropriately
- [ ] Faction reputation changes reflect alignment shift
- [ ] Corruption arc mirrors redemption for good-aligned characters
