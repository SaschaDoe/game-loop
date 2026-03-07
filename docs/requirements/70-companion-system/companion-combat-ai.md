# Companion Combat AI

As a player, I want companions to fight intelligently based on their class and personality with configurable tactics, so that party combat is strategic without requiring micromanagement.

## Details

- **AI Behavior Presets**:
  - **Aggressive**: prioritizes attacking; targets lowest-HP enemy; uses strongest abilities first; charges into melee range
  - **Defensive**: stays near player; prioritizes protecting squishy allies; uses shield/taunt abilities; only attacks threats to the party
  - **Support**: prioritizes healing and buffing; stays at range; uses crowd control abilities; attacks only when no support actions needed
  - **Balanced**: evaluates situation each turn; attacks when advantageous, heals when needed, repositions when threatened; default mode
  - **Passive**: follows player; only attacks in self-defense; useful for stealth sections or peaceful interactions
- **Class-Specific AI**: warrior companions naturally tank; healers naturally heal; rogues flank enemies; mages use AoE at safe distance; AI respects class role even within preset
- **Tactical Commands** (player can issue mid-combat):
  - Focus target: all companions attack the same enemy
  - Spread out: companions distribute across different targets
  - Fall back: companions retreat to player position
  - Hold position: companions stay where they are and attack anything in range
  - Use ability: direct a specific companion to use a specific ability on a specific target
- **Smart Positioning**: companions avoid standing in AoE danger zones; melee companions flank enemies (bonus damage); ranged companions seek cover; healers maintain line-of-sight to allies
- **Resource Management**: companions conserve powerful abilities for tough fights; won't burn all mana on trash mobs; player can override ("go all out" command)
- **Companion Death**: companions drop to 0 HP and become incapacitated; can be revived mid-combat with healing; if not revived by end of combat, require medical attention (healer NPC, 50 turns recovery); permadeath only in hardcore mode
- **Combat Synergies**: companions with high mutual approval execute combo attacks; warrior knocks enemy into mage's AoE, rogue backstabs while warrior taunts, healer buffs everyone simultaneously

## Acceptance Criteria

- [ ] All behavior presets produce correct combat patterns
- [ ] Tactical commands override preset behavior correctly
- [ ] Class-specific AI respects role while following preset
- [ ] Smart positioning avoids hazards and maximizes tactical advantage
- [ ] Combat synergies trigger between high-approval companions
