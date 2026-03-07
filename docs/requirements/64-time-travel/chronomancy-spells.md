# Chronomancy Spells

As a player, I want a dedicated school of time-manipulation magic with combat and utility spells, so that chronomancers have a unique and powerful spell toolkit.

## Details

- **Chronomancy Skill Tree**: separate from standard magic schools; learned from temporal sages, ancient ruins, or paradox exposure; 4 tiers of increasing power and paradox risk
- **Tier 1 (Apprentice) Spells**:
  - **Haste**: double movement speed for 5 turns; no paradox risk
  - **Slow**: halve target's movement and attack speed for 5 turns; WIS save to resist
  - **Temporal Sense**: detect time-related anomalies, hidden temporal objects, and chronomancy traps within 10 tiles
  - **Age Object**: rapidly age a non-living object (rust metal, rot wood, crumble stone); useful for breaking barriers and locks
- **Tier 2 (Journeyman) Spells**:
  - **Time Stop (Local)**: freeze time for all entities in a 3-tile radius for 2 turns; caster can move and act freely; attacks during stop deal double damage but generate paradox
  - **Rewind Self**: undo the last 3 turns of damage/movement for yourself; heals HP lost in those turns; costs heavy mana + 5 paradox
  - **Accelerate Ally**: grant an ally an extra action per turn for 3 turns; powerful but generates 3 paradox
  - **Decay Aura**: enemies near you age rapidly; -1 STR and DEX per turn while in range; undead are immune
- **Tier 3 (Expert) Spells**:
  - **Temporal Clone**: summon a copy of yourself from 1 turn in the future; clone acts independently for 5 turns then vanishes; if clone dies, you take 50% of the damage; 10 paradox
  - **Age Creature**: age a living target by decades; massive CON save or suffer stat drain (-3 STR, -3 DEX, -3 CON); doesn't work on immortals; 8 paradox
  - **Chrono Trap**: place a time bubble trap; anything entering is frozen for 5 turns; one-time use; 5 paradox
- **Tier 4 (Master) Spells**:
  - **Full Time Stop**: freeze everything in the current area for 5 turns; caster acts alone; 20 paradox; exhaustion after
  - **Temporal Exile**: banish a target to a time loop prison; target removed from combat permanently (boss-tier enemies get a save); 25 paradox
  - **Rewrite History**: undo the last major decision/event; essentially a "redo" for one quest outcome; once per playthrough; 50 paradox

## Acceptance Criteria

- [ ] All spells function with correct effects and durations
- [ ] Paradox generation scales with spell tier
- [ ] Time stop mechanics correctly freeze entities and allow caster actions
- [ ] Temporal clone AI acts independently and damage transfer works
- [ ] Rewrite History correctly reverts quest state once per playthrough
