# Lycanthropy

As a player, I want to contract lycanthropy from werewolf bites and transform uncontrollably during full moons, so that curses create ongoing character drama and gameplay challenges.

## Details

- Contracted by: werewolf bite (10% chance per hit), drinking cursed blood, quest event
- Stages:
  - **Stage 1 (Infected)**: subtle stat changes (+1 STR, -1 CHA), occasional hunger pangs, 50 turns to cure easily
  - **Stage 2 (Turning)**: transformation during full moons (every 300 turns), uncontrollable rampage for 10 turns, wake up confused with no memory
  - **Stage 3 (Full Werewolf)**: can transform at will, massive combat bonuses in wolf form, but NPCs flee on sight, Silver weapons deal 3x damage to you
- Werewolf form: +8 STR, +5 DEX, +4 CON, claws deal 2x weapon damage, cannot use items/spells/talk, see in the dark
- During uncontrolled transformation: player watches as the character attacks everything nearby (including allies)
- Cure: rare wolfsbane potion + temple ritual (expensive), or complete the Moonhunter questline
- Embrace the curse: a hidden questline to master lycanthropy, gaining full control permanently
- Other lycanthrope types (rare): werebear (tanky), werecat (stealthy), wererat (disease aura)
- NPCs with high Wisdom can detect your condition and react with fear or hostility
- **Pack Mechanics** (Stage 3+): other werewolves recognize you; option to join a werewolf pack (faction with its own quests, safe house, moonlit rituals)
- **Lunar Calendar Integration**: full moons are predictable; player can prepare (lock themselves in a cage, go to wilderness, take wolfsbane suppressant)
- **Wolf Senses** (passive, all stages): enhanced smell (detect hidden enemies within 5 tiles), night vision (reduced fog of war at night), hear distant sounds (message feed shows sounds from further away)
- **Hybrid Form** (mastery questline reward): half-wolf form that allows using items and limited speech while retaining combat bonuses; controllable at all times
- **Silver Vulnerability**: in all lycanthrope forms, silver weapons and silver-tipped arrows deal 3x damage and prevent HP regeneration
- **Territory Marking**: in wolf form, mark territory (scares away low-level enemies from the area for 100 turns)
- **Werewolf Encounters**: other werewolves in the world; alliance or combat depending on pack politics; alpha challenges for pack leadership

## Acceptance Criteria

- [ ] Lycanthropy is contractable and progresses through stages
- [ ] Uncontrolled transformation plays out autonomously
- [ ] Cure methods are functional
- [ ] Mastery questline grants permanent control
