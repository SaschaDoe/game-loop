# Holy and Unholy Ground

As a player, I want certain locations to be consecrated or desecrated, affecting combat and magic on those tiles, so that terrain has a spiritual dimension.

## Details

- **Holy Ground** (temples, shrines, blessed battlefields):
  - +20% healing effectiveness for all characters
  - Undead take 2 damage per turn standing on holy ground
  - Necromancy spells fail on holy ground
  - Holy spells cost 25% less mana
  - Resting on holy ground prevents nightmares and guarantees peaceful sleep
- **Unholy Ground** (graveyards, dark ritual sites, cursed ruins):
  - Undead gain +2 to all stats on unholy ground
  - Necromancy spells are 50% more powerful
  - Healing spells are 30% less effective
  - Corpses on unholy ground may spontaneously reanimate
  - Shadow creatures can spawn at night on unholy ground
- **Consecration/Desecration**: clerics can consecrate unholy ground (requires holy water + prayer ritual, 10 turns); necromancers can desecrate holy ground (requires bone dust + dark ritual, 10 turns)
- **Contested Ground**: areas where holy and unholy energies clash produce wild magic effects (random spell triggers, stat fluctuations, visual distortions)
- **Neutral Ground**: druid groves, nature temples — neither holy nor unholy; immune to consecration/desecration; all nature magic boosted
- Visual indicators: holy ground has a subtle golden tint to tile backgrounds; unholy ground has a dark purple tint
- Holy/unholy status persists permanently unless actively changed

## Acceptance Criteria

- [ ] Holy ground bonuses and penalties apply correctly
- [ ] Unholy ground effects work for undead and necromancy
- [ ] Consecration and desecration rituals function
- [ ] Contested ground produces wild magic effects
- [ ] Visual indicators distinguish ground types
