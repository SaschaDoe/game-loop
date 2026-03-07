# Ancient Tomes

As a player, I want to discover and study ancient tomes that grant knowledge, spells, and lore, so that reading and scholarship provide tangible gameplay rewards.

## Details

- **Tome Discovery**: found in libraries, dungeons, bookshops, wizard towers, and hidden alcoves; some are quest rewards
- **Tome Types**:
  - **Spell Tomes**: learn a new spell permanently; consumed on use; rarity determines spell power tier
  - **Skill Books**: +1 permanent bonus to a skill (e.g., Alchemy, Persuasion); limited to 3 skill books per skill
  - **Lore Tomes**: reveal world history, faction secrets, map locations, or NPC backstories; unlock codex entries
  - **Cursed Grimoires**: powerful knowledge at a cost; reading inflicts a curse (stat drain, hallucinations, hunted by demons) but grants forbidden spells or abilities
  - **Prophecy Scrolls**: cryptic hints about future events, hidden locations, or player destiny; LLM generates interpretations based on current game state
  - **Technical Manuals**: blueprints for crafting advanced items, building structures, or operating ancient technology
- **Reading Mechanics**: reading takes 5-20 turns depending on tome length; INT check determines comprehension (partial success = incomplete knowledge); can be interrupted by combat
- **Language Barriers**: some tomes written in ancient languages; requires linguistics skill or translation item; partial translation gives fragmented info
- **Tome Condition**: tomes degrade (pristine > worn > damaged > crumbling); damaged tomes may have missing pages (incomplete spells, partial maps); restoration possible with bookbinding skill
- **Library Collections**: gathering a complete set of related tomes (e.g., all 5 volumes of "The Arcane Foundations") unlocks a bonus reward (unique spell, hidden location reveal, title)
- **Forbidden Section**: some libraries have restricted areas; requires high reputation, lockpicking, or disguise to access; contains the most powerful and dangerous tomes

## Acceptance Criteria

- [ ] All tome types provide correct rewards when read
- [ ] Reading takes appropriate turns and uses INT checks
- [ ] Language barriers block comprehension without proper skills
- [ ] Tome condition affects information completeness
- [ ] Library collections track progress and grant set bonuses
