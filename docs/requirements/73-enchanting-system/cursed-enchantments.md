# Cursed Enchantments

As a player, I want some enchanted items to carry hidden curses that activate after use, creating risk in picking up unknown magical items, so that enchanted loot isn't always a blessing.

## Details

- **Curse Discovery**: cursed items appear as normal enchanted items until equipped/used; Identify spell or Arcana check (DC based on curse strength) reveals the curse before equipping; without identification, the curse activates on first use
- **Curse Types**:
  - **Binding Curse**: item can't be removed once equipped; stays equipped until Remove Curse is cast; the item works normally but you can't replace it with better gear
  - **Drain Curse**: item slowly drains a stat (-1 per 100 turns); stat loss is permanent unless the curse is removed and stat is restored via other means; insidious because the drain is slow enough to miss initially
  - **Berserker Curse**: weapon forces you to attack the nearest creature (friend or foe) when drawn; can't sheathe without WIS save; the weapon itself is powerful (+5 damage)
  - **Paranoia Curse**: armor causes paranoia; NPC dialogue options become suspicious/accusatory; companions lose approval; player sees phantom enemies on the map (not real but you don't know that)
  - **Greed Curse**: ring compels you to pick up all gold and items; can't leave loot behind (auto-pickup); encumbrance becomes a serious problem; dropping items requires WIS save
  - **Transformation Curse**: amulet slowly transforms the wearer into a creature (frog, pig, rat); cosmetic changes every 100 turns; full transformation at 500 turns (lose the character unless cured)
  - **Bad Luck Curse**: all skill checks have -3 penalty; critical fumble chance doubles; "accidents" happen more often (traps trigger more, NPCs misunderstand you); subtle and hard to identify
  - **Soul Bind Curse**: on death, soul is trapped in the item instead of going to afterlife; resurrection impossible while soul is bound; the item gains power from trapped souls (stronger with each death)
- **Curse Removal**: Remove Curse spell (requires caster level > curse level); temple service (expensive gold cost); quest-based removal (find a specific NPC or item); some curses require specific conditions (submerge in holy water under moonlight)
- **Intentional Cursing**: player enchanters can create cursed items deliberately; useful for: trapping enemies (gift a cursed item), creating powerful-but-risky personal gear (the berserker sword is genuinely strong), sabotage
- **Curse Resistance**: WIS modifier reduces curse severity; some races have innate curse resistance; Protection from Evil provides temporary immunity

## Acceptance Criteria

- [ ] Cursed items appear as normal enchanted items until identified or activated
- [ ] All curse types apply correct effects with correct timers
- [ ] Curse removal methods work based on curse level and method used
- [ ] Player can intentionally create cursed items through enchanting
- [ ] WIS modifier correctly reduces curse severity
