# Reputation Consequences

As a player, I want my reputation in each town and faction to have tangible gameplay consequences, so that being famous or infamous meaningfully changes how I play.

## Details

- **Reputation Scale** (per town and per faction): -100 (Hated) to +100 (Revered)
  - -100 to -50: **Hated** — attack on sight, bounty hunters sent, shops refuse service
  - -49 to -20: **Disliked** — higher prices (+30%), guards watch you, some NPCs refuse to talk
  - -19 to +19: **Neutral** — standard behavior
  - +20 to +49: **Liked** — lower prices (-10%), NPCs share rumors freely, minor favors
  - +50 to +79: **Respected** — significant discounts (-20%), free inn stays, guards help in nearby combat, invited to events
  - +80 to +100: **Revered** — free items from grateful NPCs, statues erected, named successor to leaders, ultimate quest access
- **Reputation Sources**: quest completion (+), helping NPCs (+), defeating threats (+), crimes (-), breaking promises (-), faction alignment (±)
- **Reputation Spread**: neighboring towns hear about you — actions in one town affect nearby towns at 50% rate
- **Disguise Interaction**: wearing a disguise temporarily hides your reputation; NPCs treat you as Neutral until the disguise is broken
- **Infamy Benefits**: being Hated unlocks dark questlines (assassin contracts, villain alliances, fear-based intimidation that auto-succeeds)
- **Reputation Recovery**: perform acts of service, pay reparations, complete redemption quests; slow process (faster with Charisma)
- **Rival System**: at high positive reputation, envious NPCs may try to sabotage you (frame for crimes, challenge to duels, spread slander)
- **Legacy Reputation**: new characters inherit 25% of predecessor's reputation in towns (see legacy-system)

## Acceptance Criteria

- [ ] Reputation tiers trigger correct NPC behaviors
- [ ] Reputation spreads to neighboring towns at reduced rate
- [ ] Disguises temporarily override reputation
- [ ] Both positive and negative extremes unlock exclusive content
- [ ] Reputation recovery methods function correctly
