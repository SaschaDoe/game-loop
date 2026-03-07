# Fey Enemies

As a player, I want to encounter fey creatures that fight with trickery, illusions, and bargains rather than brute force, so that fairy-tale themed enemies require different strategies than standard combat.

## Details

- **Fey Types**:
  - **Pixie Swarm**: tiny flying fey; individually weak (1 HP each); swarm of 20-50; confuse dust (WIS save or attack random target for 2 turns); steal items from inventory (Sleight of Hand vs Perception); disperse when 50% killed; regroup after 10 turns; weak to: iron, AoE
  - **Redcap**: malicious gnome-like fey; blood-soaked cap; incredibly fast; iron boots (kick attack = heavy damage); bloodlust (damage increases as it takes kills); must keep cap wet with blood or weakens; weak to: holy ground, running water
  - **Dryad**: tree spirit; charm gaze (WIS save or approach peacefully — can't attack for 5 turns); merge with trees (untargetable, heal fully); command plants (entangle, animate treants); only fights to protect forest; weak to: fire (but burning forest enrages all fey)
  - **Hag**: ancient twisted fey; disguise as beautiful woman or helpless old lady; curses (random permanent debuff unless lifted); potion brewing (throws poisons and transformations); coven of 3 hags = shared HP pool + amplified magic; bargains (offers magical boons at terrible prices); weak to: cold iron, exposing true form
  - **Will-o'-the-Wisp**: floating light; lures travelers into danger (follows it = walk into traps/hazards); incorporeal (can't be hit by physical attacks); shock touch (lightning damage); feeds on fear and death; vanishes if light spell cast; weak to: magical light, dispel magic
  - **Erlking (Wild Hunt Leader)**: mounted fey lord; appears during special events; summons spectral hounds and mounted hunters; horn blast (all enemies must flee or be hunted); impossible to outrun (matching player speed +1); can be challenged to a contest instead of combat (riddle, race, or duel); defeating earns massive fey reputation
  - **Changeling**: shapeshifter; replaces an NPC (the real one is hidden); perfectly mimics the original; only detected by cold iron touch, true sight, or behavioral inconsistencies; goal: cause chaos in communities; weak to: cold iron (forces true form)
- **Fey Bargains**: some fey offer bargains instead of fighting; always technically fair but with hidden costs (grant a wish but twist the wording; give eternal youth but steal your voice; provide a magic weapon but it belongs to the fey and must be returned — with interest)
- **Iron Vulnerability**: all fey take 2x damage from cold iron weapons; cold iron aura (within 5 tiles) makes fey uncomfortable (-1 to all actions); cold iron cage can imprison any fey
- **Fey Courts**: Seelie (good-ish) and Unseelie (evil-ish); attacking one court's members affects standing with both courts

## Acceptance Criteria

- [ ] All fey types use correct abilities and weaknesses
- [ ] Fey bargains use LLM to generate technically fair but twisted deals
- [ ] Iron vulnerability applies correct damage multiplier and aura effect
- [ ] Changeling detection requires correct methods
- [ ] Fey court reputation tracks independently
