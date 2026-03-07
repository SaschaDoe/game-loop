# Crop Diseases

As a player, I want crops to be vulnerable to diseases, pests, and blights that I must diagnose and treat, so that farming requires ongoing attention and problem-solving.

## Details

- **Disease Types**:
  - **Root Rot**: caused by overwatering; crops wilt and stop growing; cure: reduce watering + apply fungicide (crafted from herbs)
  - **Blight**: spreads from infected crops to adjacent plots; turns leaves black; cure: burn infected crops (prevents spread) or apply blight-cure potion; ignoring it can destroy an entire farm in 50 turns
  - **Pest Infestation**: locusts, caterpillars, or beetles eat crops; reduce yield by 50%; cure: pest repellent (garlic + mint brew), hire pest-control NPC, or attract predator insects
  - **Frost Damage**: occurs during cold seasons/weather; delicate crops die, hardy crops stunted; prevention: build greenhouse, use warming enchantment, or plant frost-resistant varieties
  - **Magical Corruption**: caused by proximity to dark magic sources; crops mutate (sometimes beneficial — new hybrid crop; usually harmful — poisonous produce); cure: purification ritual or relocating the farm
  - **Nutrient Depletion**: soil loses fertility after repeated planting of the same crop; yield decreases over seasons; cure: crop rotation (plant different crops each season), apply fertilizer (compost, manure), let field lie fallow for a season
- **Diagnosis**: inspect crops (Herbalism check) to identify the disease; higher skill = earlier detection = easier cure; some diseases look similar (root rot vs fungal infection) requiring expert diagnosis
- **Prevention**: healthy soil practices reduce disease chance; companion planting (certain crops protect each other); scarecrows deter pest-carrying birds; drainage systems prevent root rot
- **Epidemic Events**: occasionally a regional blight affects all farms in an area; community quest to find the source and cure; contributing to the cure earns major reputation with farmers
- **Organic vs Chemical**: natural remedies are slower but maintain soil health; alchemical pesticides are fast but degrade soil quality over time (future yields reduced)

## Acceptance Criteria

- [ ] All disease types trigger from correct conditions
- [ ] Diseases spread and escalate at correct rates
- [ ] Cures apply correctly based on disease type
- [ ] Crop rotation and prevention mechanics reduce disease probability
- [ ] Regional epidemic events generate community quests
