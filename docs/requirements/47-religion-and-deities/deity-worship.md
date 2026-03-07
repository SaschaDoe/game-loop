# Deity Worship

As a player, I want to choose a deity to worship and receive divine blessings based on my devotion, so that religion adds a meaningful progression system with unique powers.

## Details

- **Pantheon** (8 deities, each with a domain):
  - **Solaris** (Sun/Light): healing, holy damage, undead bane; favors: helping the weak, honesty, daytime prayer
  - **Noctis** (Moon/Shadow): stealth, illusion, shadow magic; favors: secrecy, nighttime action, protecting outcasts
  - **Ferrum** (War/Forge): weapon buffs, armor, berserker rage; favors: honorable combat, crafting, never fleeing
  - **Verdana** (Nature/Growth): druid magic, animal allies, terrain control; favors: protecting nature, herbalism, no undead use
  - **Mortis** (Death/Undeath): necromancy, soul magic, fear aura; favors: bringing death to the living, collecting souls, visiting graveyards
  - **Fortuna** (Luck/Chaos): critical hit bonuses, random effects, gambling luck; favors: taking risks, gambling, unpredictable behavior
  - **Lexis** (Knowledge/Magic): spell power boost, mana regen, identify items; favors: reading books, solving puzzles, discovering secrets
  - **Mercatus** (Trade/Wealth): better prices, appraisal, gold-finding; favors: successful trades, wealth accumulation, economic quests
- **Devotion System**: perform favored actions to gain devotion points; devotion unlocks tiers of divine power
  - Tier 1 (100 pts): minor blessing (small stat buff in deity's domain)
  - Tier 2 (500 pts): deity prayer (activatable ability, 1x per day)
  - Tier 3 (1500 pts): divine champion (permanent passive + unique spell)
  - Tier 4 (5000 pts): avatar (temporary transformation into deity's aspect, extremely powerful, 1x per week)
- **Sin System**: actions opposing your deity's values reduce devotion; severe sins cause divine punishment (curse, stat drain, deity abandonment)
- **Deity Switching**: possible but costly — abandonment curse for 200 turns, start at 0 with new deity, old deity becomes hostile
- **Holy Sites**: temples, shrines, sacred groves specific to each deity; praying there boosts devotion gain
- **Divine Quests**: each deity has a questline at Tier 2+; completing it deepens lore and unlocks unique items

## Acceptance Criteria

- [ ] All eight deities have distinct domains and favored actions
- [ ] Devotion tiers unlock correct powers
- [ ] Sin system reduces devotion for opposing actions
- [ ] Deity switching applies abandonment penalties
- [ ] Divine quests are completable per deity
