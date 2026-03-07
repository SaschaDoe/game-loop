# Tournament Circuit

As a player, I want to compete in a circuit of tournaments across different towns with escalating difficulty and prizes, so that I have a structured competitive progression outside the main story.

## Details

- **Tournament Tiers**: Local (village) → Regional (town) → National (city) → Grand Championship (capital)
- **Tournament Types**:
  - **Melee Tournament**: 1v1 bracket fights, non-lethal (reduced to 1 HP = yield); 8-16 combatants
  - **Archery Contest**: hit targets at increasing distance; moving targets, wind conditions; highest score wins
  - **Mage Duel**: spell-only combat in a warded arena; no physical attacks allowed
  - **Jousting**: mounted lance combat on a track; timing-based hit + shield positioning
  - **Battle Royale**: free-for-all, last fighter standing; 8 combatants, arena shrinks over time
  - **Team Tournament**: 3v3 fights; recruit companions or hire mercenaries for your team
- **Tournament NPCs**: recurring rival combatants with names, personalities, and evolving grudges/friendships
- **Betting**: spectators and the player can bet on matches; odds based on fighter stats and reputation
- **Prizes**: gold, rare equipment, titles ("Champion of Ironhold"), exclusive abilities, sponsorship offers
- **Cheating**: option to sabotage opponents (poison their drink, bribe the referee, use forbidden items) — risky, disqualification + ban if caught
- **Crowd Favor**: flashy moves and dramatic comebacks increase crowd reaction; high crowd favor = bonus prize gold
- **Season System**: tournaments run on a seasonal calendar; missing a tournament means waiting for the next season

## Acceptance Criteria

- [ ] All tournament types are playable with correct rules
- [ ] Bracket progression works through all tiers
- [ ] Rival NPCs recur across tournaments with memory
- [ ] Betting system calculates odds and payouts correctly
- [ ] Cheating mechanics carry appropriate risk/reward
