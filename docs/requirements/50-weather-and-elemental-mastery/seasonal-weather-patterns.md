# Seasonal Weather Patterns

As a player, I want weather to follow realistic seasonal patterns that affect gameplay, travel, and combat, so that the world feels alive and time of year matters strategically.

## Details

- **Season Cycle**: 4 seasons, each lasting 200 turns; world seed determines seasonal intensity (tropical worlds have mild seasons, northern worlds have extreme seasons)
- **Spring Weather**:
  - Common: light rain, fog, warm breeze; moderate visibility
  - Uncommon: thunderstorms (lightning hazard, muddy roads slow travel); flooding (low areas become impassable, underwater areas expand)
  - Effect: crops grow fastest; muddy terrain slows overland travel by 25%; rivers swell (crossing harder)
- **Summer Weather**:
  - Common: clear skies, heat waves, dry wind; excellent visibility
  - Uncommon: drought (water sources dry up, fire risk increases), sandstorms in desert regions (visibility near zero, damage per turn outdoors)
  - Effect: fire spells +10% damage; ice spells -10%; heat exhaustion if traveling without water (CON save every 20 turns); longest daylight hours (shortest nights = less stealth opportunity)
- **Autumn Weather**:
  - Common: cool wind, falling leaves (cosmetic), overcast; good visibility
  - Uncommon: early frost (delicate crops die), violent storms (tree falls block roads), dense fog (visibility reduced to 3 tiles)
  - Effect: harvest season (best crop yields); foraging produces most food; migration events (herds of animals move, some monsters relocate)
- **Winter Weather**:
  - Common: snow, cold temperatures, short days; moderate visibility
  - Uncommon: blizzard (visibility 1 tile, damage per turn outdoors without cold protection), ice storms (treacherous footing, DEX save or fall), avalanche in mountains (instant kill if caught, warning signs available)
  - Effect: ice spells +15% damage; fire keeps at bay; frozen water (walk across rivers/lakes, but ice can crack under heavy weight); reduced NPC activity in towns; snow tracks reveal creature movements
- **Weather Forecasting**: Survival skill allows reading weather signs 10-20 turns in advance; NPCs comment on incoming weather; barometric items provide precise forecasts
- **Weather Manipulation**: weather mages can shift weather within a local area (clear storms, summon rain, create fog); powerful but draws attention from weather spirits

## Acceptance Criteria

- [ ] Seasons cycle correctly on 200-turn schedule
- [ ] Weather probability distributions match season profiles
- [ ] Gameplay effects apply correctly for each weather type
- [ ] Forecasting reveals upcoming weather based on skill level
- [ ] World seed correctly modifies seasonal intensity
