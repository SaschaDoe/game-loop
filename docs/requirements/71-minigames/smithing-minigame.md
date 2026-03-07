# Smithing Minigame

As a player, I want weapon and armor crafting to involve an interactive forging minigame with heating, hammering, and quenching steps, so that blacksmithing is a hands-on skill.

## Details

- **Forging Steps**:
  1. **Heat**: place metal in the forge; temperature gauge rises; each metal has an optimal temperature range (iron: medium, steel: high, mithril: very high, adamantine: extreme); too cold = metal won't shape; too hot = metal weakens
  2. **Hammer**: when at correct temperature, hammer the metal; a shaping grid shows the target shape; player hammers tiles to match the pattern; each hammer strike shapes one tile; accuracy matters (hitting the right spot = progress, wrong spot = deformity)
  3. **Cool Check**: metal cools during hammering; must reheat periodically; the balance of heat-hammer-heat is the core rhythm
  4. **Quench**: when shape is complete, plunge into quenching liquid; water (standard), oil (tougher result), magical solution (enchantment-ready); timing matters: quench too hot = brittle, quench too cold = soft
  5. **Finish**: grind, polish, and sharpen; skill check determines final quality; grindstone for blades, burnisher for armor
- **Quality Outcomes**:
  - **Poor**: shape doesn't match well; -10% base stats; looks rough
  - **Standard**: acceptable match; base stats; normal appearance
  - **Fine**: good match; +10% stats; clean lines
  - **Masterwork**: near-perfect; +20% stats; beautiful craftsmanship; small chance of naming the item
  - **Legendary**: perfect execution; +30% stats; unique visual; always gets a name; extremely rare to achieve
- **Metal Types**: each requires different forge temperature and hammering patterns; advanced metals (mithril, adamantine, orichalcum) have narrower optimal ranges
- **Blueprints**: follow a blueprint for guided crafting (target shape shown); or freeform craft for experimental results (may discover new item types)
- **Skill Progression**: Smithing skill widens optimal temperature range, reduces cooling rate, and reveals the sweet spot for quenching; master smiths can craft items impossible for beginners
- **Auto-Smith Option**: skill check roll for players who prefer to skip the minigame; quality scales with skill level but caps at Fine (masterwork and legendary require manual play)

## Acceptance Criteria

- [ ] Temperature gauge responds correctly to forge heating
- [ ] Hammering grid accurately tracks shape progress
- [ ] Quench timing produces correct quality modifiers
- [ ] Quality outcomes apply correct stat bonuses
- [ ] Auto-smith caps at Fine quality with correct skill scaling
