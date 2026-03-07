# Foraging and Water

As a player, I want to forage for food and find water sources in the wilderness with identification challenges and seasonal availability, so that wilderness survival rewards knowledge and preparation.

## Details

- **Foraging Mechanics**: search the current area (3 turns); Survival skill + WIS determines what you find and how much; biome determines available resources; season affects availability
- **Forageable Food by Biome**:
  - **Forest**: berries (common, safe), mushrooms (common, some poisonous), nuts (autumn), wild herbs, bird eggs (spring), honey (rare, requires smoking bees)
  - **Plains**: wild grain (autumn), root vegetables, edible flowers, rabbit tracks (leads to hunting opportunity), wild onions
  - **Mountain**: mountain berries (rare), lichens (emergency food, low nutrition), alpine herbs (valuable alchemy ingredient), mountain goat tracks
  - **Desert**: cactus fruit (requires careful extraction — DEX check or spine damage), desert tubers (buried, Perception to find), insects (reliable protein), rare oasis plants
  - **Swamp**: cattail roots (safe), swamp berries (50% poisonous), frog legs (catch first), medicinal moss, leeches (not food, but alchemy ingredient)
  - **Coast**: seaweed (nutritious), shellfish (common), coconuts (tropical coasts), salt (preservative), tide pool creatures
- **Plant Identification**: unidentified plants require Herbalism check to determine safety; failure = eat and hope (25% chance of poison, nausea, or hallucination); success = know if edible, poisonous, or medicinal; once identified, plants of that type are always recognized
- **Water Sources**: rivers (flowing = safe), ponds (still = risk of contamination, CON save or sickness), rain collection (safe, slow), morning dew (tiny amount), snow melt (safe but requires fire); wells in ruins (unknown quality); purification: boiling (5 turns + fire), purification tablet (consumable), magic
- **Hunting Integration**: foraging may reveal animal tracks; follow tracks to hunting opportunity; Survival check to track; successful hunt provides large food supply (1 deer = 10 meals)
- **Preservation**: raw food spoils in 50 turns; cooked food lasts 100 turns; dried/smoked food lasts 300 turns (requires fire + time); salted food lasts 500 turns (requires salt)
- **Seasonal Availability**: spring = new growth (herbs, eggs); summer = abundance (berries, vegetables); autumn = harvest (nuts, grain, mushrooms); winter = scarcity (bark, lichens, stored food essential)

## Acceptance Criteria

- [ ] Foraging produces correct resources per biome
- [ ] Plant identification uses correct Herbalism checks with appropriate consequences
- [ ] Water source safety varies correctly by type
- [ ] Food preservation timers apply correctly by method
- [ ] Seasonal availability modifies forageable resources
