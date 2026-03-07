# Card Game System

As a player, I want to play an in-game collectible card game against NPCs in taverns, so that there's a rich minigame with its own collectible progression.

## Details

- **Game Name**: "Realm's Fate" — a strategic card game played throughout the world
- **Card Types**:
  - **Creature Cards**: summon units to the board (attack/defense values, abilities); based on in-game monsters
  - **Spell Cards**: one-time effects (damage, heal, buff, debuff); based on in-game magic
  - **Trap Cards**: placed face-down, trigger when opponent meets a condition
  - **Hero Cards**: powerful unique cards representing legendary heroes; one per deck
- **Deck Building**: collect cards from: buying booster packs at shops, winning against opponents, quest rewards, finding rare cards in dungeons, crafting (combine duplicate commons into a rare)
- **Board**: 3x3 grid; each player places cards on their side; creatures attack opposing creatures or the opponent's HP directly
- **Rules**:
  - Each player starts with 20 HP and draws 5 cards
  - Each turn: draw 1, play up to 2 cards, creatures attack
  - Elemental advantage system mirrors the main game (fire > nature > water > fire)
  - First to reduce opponent to 0 HP wins
- **Opponents**: tavern regulars (easy), traveling merchants (medium), city champions (hard), Grandmaster (endgame, one per region)
- **Stakes**: bet gold, items, or rare cards on matches; higher stakes = opponents play better decks
- **Card Rarity**: Common (gray), Uncommon (green), Rare (blue), Epic (purple), Legendary (gold); 200+ unique cards total
- **Tournament**: card game tournament in the capital city; multi-round bracket; grand prize: unique legendary card + title "Card Master"
- **Card Art**: each card has ASCII art of the creature/spell it represents
- **NPC Card Traders**: specific NPCs trade cards; some only appear at certain times or after quest completion

## Acceptance Criteria

- [ ] Card game rules execute correctly with all card types
- [ ] Deck building allows customization from collected cards
- [ ] AI opponents play competently at their difficulty tier
- [ ] Card collection tracks owned cards with rarity display
- [ ] Tournament bracket progresses with correct rewards
