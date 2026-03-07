# Scribe Profession

As a player, I want to work as a scribe copying texts, forging documents, and creating spell scrolls, so that writing and calligraphy are a profitable profession.

## Details

- **Scribe Training**: learn from a master scribe NPC; requires minimum INT 12 and literacy; 3 skill tiers (apprentice, journeyman, master)
- **Copying Texts**: NPCs commission you to copy books and documents; pays gold per page; accuracy check (DEX + scribe skill) determines quality; poor copies lose reputation
- **Spell Scroll Crafting**: transcribe known spells onto blank scrolls; scrolls are single-use castable items; scroll quality determines spell effectiveness; requires ink + parchment + knowledge of the spell
- **Forgery**: create fake documents (noble titles, merchant permits, guild papers, wanted poster removal); Forgery check vs examiner's Perception; failure = criminal charges; success = access, reputation, gold
- **Ink Crafting**: special inks for different purposes:
  - Standard ink: regular writing
  - Arcane ink (mana crystals + squid ink): required for spell scrolls
  - Invisible ink (ghost flower extract): hidden messages, revealed by heat or magic
  - Blood ink (monster blood + binding agent): required for cursed or forbidden scrolls
  - Living ink (fairy dust + spring water): text that changes over time, used for contracts
- **Calligraphy Art**: create decorative texts that function as minor enchantments when hung on walls (ward scrolls, blessing banners, luck charms)
- **Document Analysis**: examine documents for forgery, hidden messages, or magical traps; skill check reveals information layers

## Acceptance Criteria

- [ ] All scribe activities produce correct outputs and rewards
- [ ] Spell scroll crafting uses correct materials and spell knowledge
- [ ] Forgery system has appropriate risk/reward with detection mechanics
- [ ] Ink types require correct ingredients and enable correct functions
- [ ] Document analysis reveals appropriate information based on skill level
