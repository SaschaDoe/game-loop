# Assassination

As a player, I want to perform stealth kills on unaware enemies for massive damage, so that stealth builds have a powerful combat payoff for careful positioning.

## Details

- **Stealth Kill Requirements**: must be hidden (not detected), approach from behind or above, target must be unaware
- **Damage Multiplier**: base 3x damage; increases with:
  - Dagger weapon type: +1x (total 4x)
  - Assassination skill ranks: +0.5x per rank (up to +2.5x)
  - Target is sleeping: +2x
  - Poisoned weapon: poison applies at double potency
- **One-Hit Kill Threshold**: if assassination damage exceeds target's max HP, instant kill with special death message
- **Boss Immunity**: bosses cannot be one-hit killed but still take the multiplied damage; boss assassination deals max 50% of their HP
- **Failed Assassination**: if detection occurs mid-approach, attack still happens but at 1.5x (partial surprise); target immediately alerts nearby enemies
- **Assassination Tools**:
  - Garrote wire: silent kill, no blood (useful for avoiding detection by other enemies)
  - Sleeping darts: put target to sleep first for guaranteed sleeping bonus
  - Shadow step: teleport behind a target within 5 tiles (unlockable ability)
- **Witness System**: if another enemy sees the kill, they raise the alarm; plan kills when targets are isolated
- **Moral Weight**: assassinating innocent NPCs has heavy karma and reputation consequences
- **Contracts**: the Assassins Guild provides kill contracts with specific requirements (weapon type, method, no witnesses)

## Acceptance Criteria

- [ ] Stealth kill damage multiplier calculates correctly
- [ ] One-hit kill threshold works for regular enemies
- [ ] Boss damage cap at 50% max HP is enforced
- [ ] Witness system alerts nearby enemies
- [ ] Assassination contracts provide correct requirements and rewards
