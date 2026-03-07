# Blood Magic

As a player, I want access to a forbidden blood magic school that uses HP instead of mana, so that I have a high-risk, high-reward magical path with dark thematic flavor.

## Details

- Blood magic costs HP instead of mana — no mana required, but self-harm is the price
- Spells:
  - **Blood Bolt** (Lv1): 6 damage ranged, costs 3 HP
  - **Hemorrhage** (Lv5): target bleeds for 4 damage/turn for 5 turns, costs 5 HP
  - **Blood Shield** (Lv8): absorb next 15 damage by forming a barrier from your blood, costs 8 HP
  - **Sanguine Whip** (Lv12): 10 damage melee, heals self for 50% of damage dealt, costs 6 HP
  - **Blood Pact** (Lv16): sacrifice 20 HP permanently (max HP reduction) to gain a permanent +5 to any stat
  - **Crimson Tide** (Lv20): 20 damage AoE, all enemies bleed, heal self for 5 per enemy hit, costs 15 HP
  - **Heart Stop** (Lv25): instant kill on target below 30% HP, costs 25 HP, fails on bosses
- Learning blood magic: discovered through Cult of the Void questline or forbidden tomes
- Blood magic use shifts alignment toward evil and chaotic
- NPCs who witness blood magic react with horror; Holy Order becomes hostile
- Unique status: "Blood Frenzy" — below 25% HP, blood spells cost 50% less HP and deal 50% more damage
- **Blood Rituals** (out-of-combat abilities):
  - Blood Sight: sacrifice 5 HP to see through walls for 20 turns
  - Blood Bond: link HP with a companion — share damage taken 50/50
  - Blood Memory: sacrifice 10 HP to gain a dead NPC's last memory (investigation tool)
  - Bloodletting: sacrifice 30 HP to fully restore another character's HP and mana
- **Blood Mage Nemesis**: at high blood magic usage, a Holy Order paladin is dispatched to hunt you — recurring mini-boss that scales with your level
- **Blood Corruption**: cumulative blood magic use darkens the player's ASCII color gradually (white → pink → red → crimson); fully corrupt = NPCs refuse to trade
- **Blood Magic Artifacts**: Crimson Gauntlets (blood spells cost 25% less), Sanguine Amulet (heal 2 HP per turn), Chalice of Eternity (blood pact doesn't reduce max HP, unique legendary)
- Companion reactions: good-aligned companions object to blood magic use; evil-aligned companions encourage it and teach advanced techniques

## Acceptance Criteria

- [ ] Blood spells deduct HP correctly instead of mana
- [ ] Blood Pact permanently reduces max HP
- [ ] Alignment shifts toward evil on use
- [ ] Blood Frenzy activates at low HP
