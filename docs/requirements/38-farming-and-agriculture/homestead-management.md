# Homestead Management

As a player, I want to develop a homestead with buildings, workers, and production chains, so that farming grows into a settlement management game.

## Details

- **Homestead Location**: purchase land near any town (price varies by location quality: fertile plains are expensive, swampland is cheap)
- **Buildings** (constructed with resources + gold + time):
  - **Farmhouse**: player residence; bed (rest bonus), storage, cooking station
  - **Barn**: animal housing; capacity determines max livestock
  - **Silo**: crop storage; prevents spoilage; larger silo = more seasonal carry-over
  - **Well**: water source; needed for irrigation; upgradeable to windmill-powered pump
  - **Workshop**: crafting station for farm tools, furniture, and basic items
  - **Market Stall**: sell produce directly to passing NPCs; income scales with road traffic
  - **Guard Tower**: protects homestead from raids (bandits, wolves, goblins); manned by hired guards or companions
  - **Guest House**: attract traveling NPCs who pay rent and may offer quests
- **Workers**: hire NPC farmhands (gold per season); each has stats affecting output:
  - Farmer: tends crops, quality depends on their skill
  - Shepherd: manages livestock, improves animal health
  - Guard: defends against raids
  - Merchant: runs the market stall, better prices with higher CHA
- **Production Chains**: wheat → flour → bread; milk → cheese; wool → cloth → clothes; wood → furniture
- **Homestead Events**: seasonal raids, traveling merchants, lost travelers seeking shelter, pest infestations, NPC workers having personal problems (LLM quests)
- **Revenue**: passive income from crop sales, animal products, and guest rent; income deposited at the nearest bank
- **Upgrades**: irrigation (auto-water), scarecrow (pest reduction), road improvement (more traffic = more sales)

## Acceptance Criteria

- [ ] All buildings construct correctly with resources and provide listed functions
- [ ] Worker NPCs perform assigned roles with skill-based output
- [ ] Production chains convert raw materials to finished goods
- [ ] Homestead events trigger seasonally with appropriate challenges
- [ ] Passive income calculates and deposits correctly
