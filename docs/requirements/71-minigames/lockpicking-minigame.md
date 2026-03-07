# Lockpicking Minigame

As a player, I want lockpicking to be an interactive skill-based minigame rather than a simple dice roll, so that thief gameplay has a hands-on mechanical challenge.

## Details

- **Minigame Mechanics**: lock displayed as a series of pin tumblers (3-7 pins based on lock difficulty); each pin must be set to the correct height; player moves a pick left/right between pins and up/down to set height
- **Pin Setting**: each pin has a "sweet spot"; move the pick up slowly; when you feel resistance (visual indicator: pin changes color), that's the sweet spot; confirm the pin; if you push too far, the pin resets and you must try again
- **Lock Complexity**:
  - **Simple (3 pins)**: wide sweet spots; no time pressure; practice locks, basic chests, simple doors
  - **Standard (4 pins)**: moderate sweet spots; pins may have false sets (feels right but isn't); residential doors, merchant chests
  - **Complex (5 pins)**: narrow sweet spots; security pins that reset adjacent pins if set wrong; noble houses, guild vaults
  - **Master (6 pins)**: very narrow sweet spots; trapped pins (setting wrong = damage or alarm); bank vaults, royal chambers
  - **Legendary (7 pins)**: tiny sweet spots; all security features; unique locks on legendary chests; only master lockpickers can attempt
- **Lockpick Quality**: basic picks break easily (20% break chance per failed pin); quality picks (stronger, break 10%); masterwork picks (nearly unbreakable, 2%); magical picks (unbreakable, bonus to sweet spot detection)
- **Skill Integration**: DEX modifier widens the sweet spot; Lockpicking skill level reduces pin reset severity; high skill reveals sweet spot faster (color changes sooner)
- **Time Pressure**: some locks have patrols nearby; a timer shows when guards return; failing to open in time = caught; can abandon attempt and try later
- **Auto-Pick Option**: for players who prefer not to do the minigame, an auto-pick option rolls skill checks instead; reduced success chance compared to manual play (incentivizes the minigame)
- **Lock Types**: pin tumbler (standard), warded (requires matching key shape — puzzle variant), combination (number dial — memory puzzle), magical (rune sequence — arcana check)

## Acceptance Criteria

- [ ] Pin tumbler minigame functions with correct physics-feel
- [ ] Lock complexity scales correctly with pin count and security features
- [ ] Lockpick breakage occurs at correct rates by quality
- [ ] DEX and skill modifiers widen sweet spots correctly
- [ ] Auto-pick option provides fair but reduced success alternative
