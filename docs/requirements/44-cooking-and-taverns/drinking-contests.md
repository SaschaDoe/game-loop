# Drinking Contests

As a player, I want to participate in drinking contests against NPCs with escalating intoxication effects, so that tavern social activities have competitive gameplay.

## Details

- **Contest Rules**: player and opponent take turns drinking; each round, choose a drink (ale = mild, whiskey = moderate, dwarven spirits = extreme); CON save each round with increasing difficulty (+2 per round); first to fail 3 saves loses
- **Intoxication Levels** (cumulative during contest):
  - **Tipsy** (1 failed save): -1 DEX, +1 CHA (liquid courage), slight screen wobble effect
  - **Drunk** (2 failed saves): -2 DEX, -1 INT, +2 CHA, dialogue options become slurred (LLM adds drunken speech patterns), movement randomly shifts 1 tile
  - **Hammered** (3 failed saves): contest lost; -4 DEX, -3 INT, -2 WIS, +3 CHA; can barely move; 50% chance to fall over each turn; pass out after 10 turns (wake up somewhere unexpected)
- **Drink Selection Strategy**: stronger drinks increase the difficulty for both players; choosing mild drinks extends the contest (favoring high CON); choosing extreme drinks is high risk/high reward (both may fail quickly)
- **Opponent Types**: lightweight (low CON, easy), seasoned drinker (moderate CON), dwarven champion (very high CON, extremely difficult), undead barkeep (immune to poison — literally can't get drunk, comedy opponent)
- **Side Bets**: spectators bet on the contest; player can bet on themselves; winning earns gold proportional to the odds; losing costs the bet
- **Consequences of Winning**: gold prize, +reputation in the tavern, drinking champion title (local); information from the loser (drunk NPCs spill secrets); rare: the loser's prized possession wagered and lost
- **Consequences of Losing**: gold lost, embarrassing stories spread (-2 local reputation for 100 turns), wake up in a random location (alley, jail cell, another town, on a ship heading to sea)
- **Hangover**: the morning after a heavy drinking session: -2 all stats for 20 turns; bright light = Perception penalty; loud sounds = pain messages; cured by hangover remedy (egg + herb + water) or time

## Acceptance Criteria

- [ ] CON saves escalate correctly each round
- [ ] Intoxication levels apply correct stat modifications
- [ ] Drink selection affects difficulty for both participants
- [ ] Wake-up locations randomize appropriately on loss
- [ ] Hangover effects apply and clear at correct timing
