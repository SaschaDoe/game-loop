# Disease Mechanics

As a player, I want a detailed disease system with infection vectors, symptoms, progression stages, and cures, so that illness is a strategic threat requiring medical knowledge to overcome.

## Details

- **Infection Vectors**:
  - **Contact**: touching infected NPCs, contaminated objects, or diseased corpses; gloves reduce risk
  - **Airborne**: entering plague zones, enclosed spaces with infected; masks reduce risk
  - **Waterborne**: drinking contaminated water, swimming in polluted areas; purification spell/item prevents
  - **Vector-borne**: insect bites in swamps, rat bites in sewers; insect repellent and armor cover reduce risk
  - **Magical**: curse-based diseases from dark magic, cursed items, or demon contact; only magical cures work
- **Disease Examples**:
  - **Rattlecough**: airborne; mild; -1 CON, -1 CHA (constant coughing); cured with herbal tea (10 turns); untreated lasts 50 turns then resolves
  - **Swamp Fever**: vector-borne; moderate; -2 CON, -1 STR, periodic hallucinations; requires alchemical cure; untreated has 20% chance of escalating to critical
  - **Bloodrot**: contact (wounds); severe; -1 HP per 5 turns (slow bleed), -2 STR, infected limb becomes useless; requires surgeon NPC or advanced healing magic; untreated = limb loss after 200 turns
  - **Mindworm**: magical; severe; -3 INT, -2 WIS, voice in your head (LLM generates the worm's whispers); requires exorcism or Remove Curse; untreated = permanent INT loss
  - **The Grey Plague**: airborne; critical; -1 to all stats per 50 turns, skin turns grey, NPC fear/avoidance; requires legendary cure (quest to find ingredients); untreated = death at 0 CON; highly contagious
  - **Lycanthropic Virus**: contact (bite); special; leads to lycanthropy transformation if untreated for 72 hours (game turns); cure: wolfsbane potion within the window
- **Symptom Progression**: diseases have stages (incubation > mild > moderate > severe > critical); each stage adds symptoms and penalties; early treatment is easier/cheaper
- **Immunity**: surviving a disease grants immunity to that specific disease; vaccination items (pre-made from weakened disease samples) grant immunity without suffering the disease
- **Epidemic Events**: when enough NPCs are infected, a regional epidemic triggers; quarantine zones, closed shops, panic; player can help by delivering cures, finding the source, or containing the spread

## Acceptance Criteria

- [ ] All infection vectors trigger from correct exposure types
- [ ] Disease progression advances through stages on correct timing
- [ ] Cures apply correctly based on disease type and stage
- [ ] Immunity grants after recovery from each specific disease
- [ ] Epidemic events trigger when infection reaches threshold
