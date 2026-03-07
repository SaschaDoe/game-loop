# Temperature System

As a player, I want environmental temperature to affect my character with heat and cold exposure, so that biome travel requires preparation and gear choices matter.

## Details

- **Temperature Scale**: Freezing → Cold → Cool → Comfortable → Warm → Hot → Scorching
- **Temperature Sources**: biome base temperature + weather + time of day + altitude + proximity to fire/ice
- **Cold Effects** (below Cool):
  - Cold: -1 DEX, minor stamina drain
  - Freezing: -3 DEX, -2 movement speed, stamina drain doubled, risk of frostbite (permanent -1 to extremity stats if prolonged)
  - Lethal Cold: 2 HP damage per turn, frozen solid if HP reaches 0
- **Heat Effects** (above Warm):
  - Hot: -1 CON, increased thirst rate
  - Scorching: -3 CON, -2 WIS (heat delirium), dehydration accelerated, metal armor deals 1 damage per turn to wearer
  - Lethal Heat: 2 HP damage per turn, heatstroke at 0 HP
- **Temperature Gear**:
  - Cold: fur cloak, heated boots, warming enchantment, campfire proximity
  - Heat: desert robes, cooling charm, water flask (drink to temporarily reduce heat level)
  - Universal: climate control amulet (rare, maintains Comfortable in all conditions)
- **Campfire Mechanics**: build a fire to create a warm zone (5 tile radius); requires fuel (wood, coal, oil); fire lasts 50 turns per fuel unit
- **Shelter**: being indoors or in a tent normalizes temperature by 2 levels toward Comfortable
- **NPC Temperature**: NPCs and enemies are also affected; frost trolls thrive in cold, desert bandits resist heat
- **Cooking Bonus**: hot food temporarily raises cold resistance; cold drinks temporarily raise heat resistance
- Temperature displayed in HUD as a small thermometer icon next to health

## Acceptance Criteria

- [ ] Temperature calculates correctly from all sources
- [ ] Cold and heat effects apply at correct thresholds
- [ ] Temperature gear modifies effective temperature
- [ ] Campfire creates a functional warm zone
- [ ] HUD temperature display updates in real-time
