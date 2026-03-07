# Undead Army

As a player necromancer, I want to raise and command an army of undead minions with different types and tactical roles, so that necromancy is a full summoner-commander playstyle.

## Details

- **Raising Undead**: target a corpse; spend mana + Necromancy skill check; success = corpse rises as an undead minion under your control; failure = mana wasted, corpse consumed; corpse quality matters (fresh = stronger undead, old = weaker)
- **Undead Types**:
  - **Skeleton**: basic melee; low HP, low damage, no decay; cheap to raise (10 mana); useful as cannon fodder and scouts; can be equipped with weapons and armor from inventory
  - **Zombie**: slow melee; moderate HP, moderate damage; infectious bite (chance to raise slain enemies as zombies); decays over 200 turns (weakens then crumbles); costs 15 mana
  - **Skeletal Archer**: ranged skeleton; requires corpse + bow in inventory; lower accuracy than living archers but tireless; 15 mana
  - **Ghoul**: fast melee; paralyzing touch (CON save); feeds on corpses to heal itself; more intelligent than zombies, can follow complex orders; 25 mana
  - **Wraith**: incorporeal; passes through walls; cold touch (drains STR); vulnerable to holy/radiant damage; 35 mana; requires a corpse that died violently
  - **Death Knight**: elite undead; retains combat skills from life (raise a warrior corpse = death knight fights like a warrior); heavily armed; commands lesser undead nearby (+2 attack to all undead within 5 tiles); 50 mana; requires a powerful corpse
  - **Bone Golem**: construct from multiple corpses (requires 5 skeletons or corpses); massive HP, slam attack, AoE stomp; slow but devastating; 75 mana
- **Army Limits**: maximum undead = Necromancy skill level x 3; exceeding limit causes oldest undead to collapse; higher INT increases individual undead power
- **Undead Commands**: attack, defend, patrol area, guard location, follow, stay; undead follow commands mindlessly (no initiative); uncontrolled undead attack all living creatures
- **Social Consequences**: most societies outlaw necromancy; having undead visible causes NPC panic, guard aggression, and massive reputation loss; undead must be hidden or dismissed near civilization
- **Undead Maintenance**: undead decay over time (except skeletons); casting Mend Undead (5 mana) restores them; neglected undead eventually crumble or go feral (attack everything including you)

## Acceptance Criteria

- [ ] All undead types raise from correct corpse conditions at correct mana costs
- [ ] Army limit enforces correctly based on Necromancy skill
- [ ] Undead follow commands with correct AI behavior
- [ ] Social consequences trigger when undead are visible near NPCs
- [ ] Decay and maintenance mechanics function on correct timers
