# Flee from Combat

As a player, I want to attempt to flee from combat encounters, so that I can escape when overwhelmed rather than facing certain death.

## Details

- Flee is an action that costs the player's turn
- Success chance based on player Dexterity vs enemy speed
- Failed flee: player loses their turn, enemies still act
- Successful flee: player moves 2 tiles away from the nearest enemy
- Some enemies (bosses, ambushes) prevent fleeing entirely
- Fleeing drops a random item from inventory (panic penalty)

## Acceptance Criteria

- [ ] Flee action is available during combat
- [ ] Success rate scales with Dexterity
- [ ] Failed flee costs the turn without movement
- [ ] Boss encounters block flee attempts
