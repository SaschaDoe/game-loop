# Lockpicking

As a player, I want to pick locks on doors and chests using a skill-based minigame, so that locked areas are accessible through finesse rather than just finding keys.

## Details

- Lockpicking triggered when interacting with a locked door or chest
- Minigame: sequence of directional inputs that must be entered correctly (shown as tumbler positions)
- Lock difficulty levels: simple (3 inputs), standard (5), complex (7), master (10)
- Lockpicks are consumable; breaking on failed attempts (quality affects durability)
- Dexterity stat gives hints (highlights correct positions for high-Dex characters)
- Rogue class starts with lockpicking proficiency and bonus picks
- Failed attempts can trigger alarms or traps on high-security locks
- Alternative: bash open with Strength (noisy, may destroy contents)

## Acceptance Criteria

- [ ] Lockpicking minigame is functional and skill-based
- [ ] Lockpick durability degrades on failure
- [ ] Dexterity provides appropriate hints
- [ ] Failed attempts have consequences on trapped locks
