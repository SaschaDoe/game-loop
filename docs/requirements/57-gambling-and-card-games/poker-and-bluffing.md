# Poker and Bluffing

As a player, I want to play poker-style card games against NPCs using a bluffing system tied to my character's CHA and Deception skills, so that card games are a test of social stats as well as luck.

## Details

- **Game Locations**: taverns, gambling dens, noble parties, pirate ships, bandit camps; each venue has different stakes and player quality
- **Card Game Rules**: simplified poker variant using the game's themed deck (suits: swords, cups, wands, pentacles; ranks: 1-10 + page, knight, queen, king); standard hand rankings (pair, two pair, three of a kind, straight, flush, full house, four of a kind, straight flush)
- **Betting Rounds**: ante, deal, 2 betting rounds, showdown; player can fold, call, raise, or bluff at each round; minimum/maximum bets set by venue
- **Bluffing Mechanic**: when you bet with a weak hand, it's a bluff; CHA + Deception skill vs opponent's WIS + Insight skill; successful bluff = opponents fold; failed bluff = opponents call and you likely lose
- **Tell System**: observe NPC tells (nervous tapping, sweating, confident smirk) by passing Perception checks; tells indicate hand strength; higher Perception reveals more reliable tells
- **NPC Personalities at the Table**:
  - Aggressive: bets high, bluffs often; exploitable by patient play
  - Conservative: only bets with strong hands; folds to large raises
  - Erratic: random strategy; hard to read; unpredictable
  - Shark: skilled player; reads your tells; adjusts strategy; dangerous opponent
- **Cheating**: use Sleight of Hand to swap cards, mark cards, or peek at opponent's hand; if caught (opponent's Perception vs your Sleight of Hand) = banned from venue + reputation loss + possible combat
- **Tournament Mode**: multi-round tournaments with elimination brackets; entry fee + prize pool; final table against the best NPCs; champion earns gold + unique card-themed item
- **Card Counting**: INT-based passive; after 10+ hands at the same table, gain insight into remaining card probabilities; displayed as subtle hints in the UI

## Acceptance Criteria

- [ ] Card game follows correct hand rankings and betting rules
- [ ] Bluffing resolves correctly using CHA/Deception vs WIS/Insight
- [ ] NPC personalities produce distinct playing patterns
- [ ] Cheating has appropriate risk/reward with detection mechanics
- [ ] Tournament mode brackets and prizes function correctly
