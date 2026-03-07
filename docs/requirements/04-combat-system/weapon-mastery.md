# Weapon Mastery

As a player, I want using a weapon type repeatedly to unlock mastery levels with new combat techniques, so that weapon choice leads to deep specialization over time.

## Details

- **Mastery Tracking**: each weapon category tracks kills and hits separately; XP-like system (hit = 1 mastery point, kill = 5 points, critical hit kill = 10 points)
- **Weapon Categories**: swords, axes, maces/hammers, spears/polearms, daggers, bows, crossbows, staves, unarmed, thrown weapons, whips, flails
- **Mastery Levels** (per category):
  - **Novice (0 points)**: basic attack only; fumble chance 5%
  - **Trained (100 points)**: fumble chance 2%; unlock basic technique (see below)
  - **Skilled (500 points)**: +5% damage; unlock intermediate technique
  - **Expert (1500 points)**: +10% damage; +2% crit chance; unlock advanced technique
  - **Master (5000 points)**: +15% damage; +5% crit chance; fumble immune; unlock master technique
  - **Grandmaster (15000 points)**: +20% damage; +8% crit chance; unlock legendary technique; weapon category title ("Sword Saint", "Axe Lord", "Arrow Maven")
- **Category Techniques (examples)**:
  - **Swords**: Trained = Riposte (counter after parry); Skilled = Whirlwind (hit all adjacent); Expert = Blade Dance (+2 attacks per turn); Master = Decapitate (instant kill under 15% HP); Grandmaster = Phantom Blade (ranged sword slash, 5 tiles)
  - **Axes**: Trained = Cleave (hit through to second target); Skilled = Sunder (destroy enemy shield/armor); Expert = Berserker Swing (+50% damage, -20% accuracy); Master = Executioner's Arc (AoE half-circle); Grandmaster = Worldsplitter (terrain-destroying mega swing)
  - **Bows**: Trained = Quick Shot (shoot twice, reduced damage); Skilled = Pinning Shot (immobilize target); Expert = Piercing Arrow (hits all in a line); Master = Trick Shot (ricochet off walls); Grandmaster = Rain of Arrows (AoE barrage, 8-tile radius)
  - **Daggers**: Trained = Quick Slash (bonus attack when moving); Skilled = Kidney Shot (stun from behind); Expert = Poison Mastery (apply poison without check); Master = Death's Whisper (silent instant kill from stealth); Grandmaster = Thousand Cuts (10 rapid strikes in 1 turn)
- **Multi-Weapon Mastery**: mastering 3+ weapon categories grants "Weapon Sage" passive (+5% damage with all weapons); mastering all categories grants "Arsenal" title + unique ability (switch weapons mid-combo without losing a turn)

## Acceptance Criteria

- [ ] Mastery points track correctly per weapon category
- [ ] Each mastery level applies correct damage and crit bonuses
- [ ] Techniques unlock at correct levels with correct effects
- [ ] Multi-weapon mastery bonuses apply at correct thresholds
- [ ] Grandmaster titles display correctly for each category
