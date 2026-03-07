# Pit Fighting Bets

As a player, I want to bet on underground pit fights between NPCs and monsters, so that gambling extends to spectating violent combat.

## Details

- **Pit Fight Locations**: underground fight clubs in major city slums; accessed through back alleys or NPC introductions; guards don't patrol here
- **Fight Types**:
  - **NPC vs NPC**: two fighters; player bets on the winner; stats-based outcome with random variance; upset victories happen
  - **NPC vs Monster**: a brave (or desperate) fighter against a caged monster; higher risk = higher payout; monster usually favored
  - **Monster vs Monster**: exotic creatures pit against each other; rare, high-stakes; spectacle-focused
  - **Player Entry**: option to fight in the pit yourself; bet on yourself; opponents scale to your level; losing = KO (not death), embarrassment, lost bet
- **Betting Mechanics**:
  - Odds posted before each fight (e.g., Fighter A: 2:1, Fighter B: 3:1)
  - Bet gold before the fight; payout = bet × odds if your pick wins
  - Insider information: befriend the fight promoter or fighters for tips (who's injured, who's been drugged, which monster is starved)
  - Rigging fights: pay a fighter to throw the match; bribe the monster handler to weaken a beast; use subtle magic to influence outcome; risk: if caught, banned + all bets voided + possible combat
- **Fight Commentary**: an NPC announcer provides play-by-play through the message feed; entertaining and informative
- **Fighter Favorites**: recurring named fighters with win/loss records; develop reputations; some become companions if befriended
- **Championship Nights**: special events with higher stakes, unique fighters, and legendary monster matches; entry fee + minimum bet; grand prize pot for correct predictions across all fights
- **Moral Implications**: some fights are cruel (forced monsters, enslaved fighters); option to expose the operation for reputation + justice karma, or profit from the system

## Acceptance Criteria

- [ ] All fight types produce stats-based outcomes with appropriate randomness
- [ ] Betting odds calculate correct payouts
- [ ] Insider information and fight rigging function with risk
- [ ] Player entry fights scale to character level
- [ ] Moral choice to expose or exploit the operation has consequences
