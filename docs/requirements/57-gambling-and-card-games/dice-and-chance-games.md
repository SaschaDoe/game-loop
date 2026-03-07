# Dice and Chance Games

As a player, I want to play dice games and other games of chance in taverns for gold, so that gambling provides an entertaining risk/reward diversion.

## Details

- **Game Types**:
  - **Crown and Anchor**: bet on a symbol; roll 3 dice; payout based on matches (1 match = 1:1, 2 = 2:1, 3 = 3:1); simple, fast
  - **Liar's Dice**: each player rolls dice secretly; bid on total dice showing a face; call "liar" to challenge; last player with dice wins the pot; LLM-powered NPC bluffing
  - **Dragon's Gambit**: strategy dice game; roll 5 dice, keep any, reroll rest up to 2 times; build combinations (pairs, straights, full set); highest combo wins; like poker with dice
  - **Coin Toss**: simplest gamble; double or nothing; player can call heads/tails; Luck stat affects outcome subtly
  - **Arm Wrestling**: STR vs STR contest; mash-input (rapid tap) or stat comparison; bet gold on outcome
  - **Shell Game**: NPC shuffles shells; pick the one with the ball; Perception check to track; higher rounds = faster shuffling
- **Cheating Mechanics**:
  - Loaded dice: Sleight of Hand check to swap in; +30% win rate; if caught = kicked out + reputation loss + possible fight
  - Card marking: mark opponent's cards during a game; see their hand partially; requires Perception to notice being marked yourself
  - Distraction: use a companion to distract the opponent mid-game; creates a window to cheat
  - Magical cheating: subtle Telekinesis to move dice; Telepathy to read opponent's hand; detectable by magically-aware NPCs
- **Gambling Addiction**: repeated gambling triggers the addiction system (see addiction-system); compulsive gambling at high addiction = involuntary bets
- **High Stakes Tables**: VIP rooms in major city taverns; minimum bet 500 gold; best opponents, biggest payouts, highest cheating detection
- **Lucky Streak**: winning 5 games in a row grants "Fortune's Favorite" buff (+1 Luck for 100 turns)
- **Rigged Games**: some NPCs run rigged games; detectable with high Perception; expose them for reputation + reward, or out-cheat them

## Acceptance Criteria

- [ ] All game types play correctly with proper rules
- [ ] LLM-powered bluffing in Liar's Dice feels natural
- [ ] Cheating mechanics carry appropriate risk/reward
- [ ] Gambling addiction integrates with the addiction system
- [ ] Rigged games are detectable and exposable
