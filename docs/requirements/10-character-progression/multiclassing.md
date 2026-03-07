# Multiclassing

As a player, I want to invest levels into a second class to create hybrid builds, so that character customization allows creative combinations beyond single-class progression.

## Details

- **Unlock Condition**: reach level 10 in primary class to unlock multiclassing
- **Multiclass Rules**:
  - At each level-up after unlocking, choose which class receives the level
  - Secondary class starts at level 1 with basic abilities; gains abilities as levels are invested
  - HP/mana growth per level uses the class the level was invested in (warrior levels give more HP, mage levels give more mana)
  - Maximum level: 30 total (split between classes; e.g., 20 warrior + 10 mage)
- **Hybrid Builds** (examples):
  - **Spellblade** (Warrior + Mage): melee attacks with spell enhancements; limited spell selection but physical durability
  - **Shadow Priest** (Cleric + Rogue): healing and stealth; can sneak into position and heal allies undetected
  - **Arcane Archer** (Ranger + Mage): enchanted arrows with spell effects; track targets magically
  - **Battle Bard** (Bard + Warrior): songs that buff while fighting in melee; combat music
  - **Death Knight** (Warrior + Necromancer sub-path): undead summoning + heavy armor; dark paladin aesthetic
- **Synergy Bonuses**: certain class combinations unlock unique abilities not available to either class alone:
  - Warrior 10 + Mage 10: "Arcane Blade" — permanently enchant your weapon with your strongest element
  - Rogue 10 + Ranger 10: "Phantom Hunter" — stealth doesn't break from ranged attacks
  - Cleric 10 + Mage 10: "Divine Channeling" — convert mana to healing or healing to mana
- **Restrictions**: some talent keystones require 20+ levels in a single class; multiclassing locks these out (trade-off: versatility vs. specialization peak)
- **Respec**: multiclass levels can be redistributed at a trainer (expensive); allows experimenting without permanent commitment
- **NPC Trainers**: must find a trainer for the secondary class to unlock it; some classes have hidden trainers

## Acceptance Criteria

- [ ] Multiclassing unlocks at level 10 with correct mechanics
- [ ] Leveling in each class provides appropriate stat growth and abilities
- [ ] Synergy bonuses activate for correct class combinations
- [ ] Keystone talent restriction is enforced for multiclass characters
- [ ] Respec allows redistributing multiclass levels
