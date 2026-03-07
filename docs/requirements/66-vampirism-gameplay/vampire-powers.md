# Vampire Powers

As a player, I want becoming a vampire to grant a full suite of dark powers that grow with my vampire age, so that vampirism is a deep alternate progression system.

## Details

- **Becoming a Vampire**: bitten by a vampire lord and not cured within 24 hours (game turns); or seek out a vampire to be turned voluntarily; transformation is a 3-turn cinematic sequence (LLM narrates the death and rebirth)
- **Vampire Age Tiers** (time since turning):
  - **Fledgling (0-500 turns)**: basic vampire; thirst is strongest; weaknesses most severe; unlocks: Night Vision, Bite Attack (drain HP), Enhanced Speed (+2 DEX)
  - **Mature (501-2000 turns)**: thirst manageable; unlocks: Bat Form (fly, scout, can't attack), Mesmerize (charm NPC for 10 turns, CHA check), Mist Form (intangible, pass through walls, can't attack)
  - **Elder (2001-5000 turns)**: powerful presence; unlocks: Dominate (control NPC permanently until released, WIS save), Blood Magic (use HP as mana), Create Thrall (turn an NPC into a vampire minion, max 2)
  - **Ancient (5001+ turns)**: near-godlike; unlocks: Daywalker (sunlight weakness halved), Mass Mesmerize (charm all NPCs in area), Blood Storm (AoE drain attack), Immortal Resilience (auto-revive once per 500 turns)
- **Blood Thirst**: must feed every 100 turns; feeding on NPCs restores "blood pool" (vampire mana); not feeding causes progressive stat drain and eventually frenzy (uncontrollable feeding on the nearest living creature)
- **Feeding Options**: attack civilians (easy, evil karma, wanted status), hunt animals (less nourishing, neutral karma), blood vials (purchased from black market, expensive), willing NPCs (romance partners, thralls)
- **Vampire Weaknesses**: sunlight (-5 all stats during daytime outdoor; burns 1 HP/turn without protection), garlic (nausea debuff in proximity), holy symbols (can't enter temples, holy water deals 3x damage), running water (can't cross rivers without a bridge), must be invited to enter private homes
- **Daylight Protection**: enchanted ring (reduces sunlight penalty), dark cloak (blocks direct sunlight, still weakened), parasol item (silly but functional)
- **Cure**: possible but difficult; requires holy water + garlic + sunflower extract + master priest ritual; curing removes all vampire powers and weaknesses; can't become a vampire again for 1000 turns

## Acceptance Criteria

- [ ] Transformation sequence triggers correctly from bite or voluntary turning
- [ ] Powers unlock at correct vampire age thresholds
- [ ] Blood thirst depletes and causes correct consequences when unfed
- [ ] All weaknesses apply correct penalties in correct conditions
- [ ] Cure removes all vampire traits and prevents re-turning
