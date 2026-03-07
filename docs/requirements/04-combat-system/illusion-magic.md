# Illusion Magic

As a player, I want an illusion spell school focused on deception, misdirection, and psychological warfare, so that I can win fights through trickery rather than raw damage.

## Details

- Illusion spells:
  - **Phantom Image** (Lv2): create a decoy of yourself on an adjacent tile, enemies attack it first, 3 mana
  - **Distort** (Lv4): enemy's next attack has 50% miss chance for 3 turns, 4 mana
  - **Mirage** (Lv7): create an illusory wall or pit — enemies route around it, 6 mana, lasts 10 turns
  - **Doppelganger** (Lv10): create a copy of yourself that attacks with 50% of your damage for 8 turns, 10 mana
  - **Mass Confusion** (Lv13): all enemies in range attack random targets (including each other) for 4 turns, 12 mana
  - **Invisibility** (Lv16): true invisibility for 10 turns, broken by attacking or casting, 15 mana
  - **Phantasmal Killer** (Lv20): target sees their worst fear, Wisdom save or paralyzed for 5 turns, 18 mana
  - **Grand Illusion** (Lv25): reshape a 7x7 area to look like anything (fire, walls, pits) — enemies react as if real, 25 mana, lasts 20 turns
- Illusions are detected by: high Wisdom enemies, truesight ability, dispel magic
- Detected illusions immediately shatter with no effect
- Illusions have no physical substance — they can't deal real damage (except Doppelganger which has temporary physical form)
- Out-of-combat uses: disguise doorways, create fake treasure to lure enemies, illusory bridges over pits

## Acceptance Criteria

- [ ] All illusion spells create appropriate visual deceptions
- [ ] Enemy AI reacts to illusions as if real
- [ ] Detection via Wisdom/truesight dispels illusions
- [ ] Out-of-combat uses function in exploration
