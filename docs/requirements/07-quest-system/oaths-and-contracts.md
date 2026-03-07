# Oaths and Contracts

As a player, I want to swear binding oaths and sign magical contracts with NPCs, so that commitments have supernatural enforcement and breaking them has dire consequences.

## Details

- Oaths: sworn voluntarily for powerful benefits with binding conditions
  - **Oath of Vengeance**: +30% damage against a sworn target, but cannot rest until the target is dead
  - **Oath of Protection**: +5 DEF when near the protected NPC, but take 50% of their damage
  - **Oath of Poverty**: cannot carry more than 50 gold, but +3 to all stats
  - **Oath of Silence**: cannot use dialogue for 500 turns, but +5 Wisdom and can understand all languages
- Contracts: signed with NPC quest givers, magically enforced
  - Contract terms visible in the quest journal
  - Breaking a contract: cursed (stat penalties) until you pay a penalty fee or complete an atonement quest
  - Clever players can negotiate contract terms via LLM dialogue before signing
  - Some NPCs offer exploitative contracts with hidden unfavorable clauses (read carefully!)
- Demon deals: extremely powerful boons with devastating hidden costs revealed later
- Contract lawyer NPC: review contracts for a fee, identifies traps and hidden clauses

## Acceptance Criteria

- [ ] Oaths grant benefits and enforce conditions
- [ ] Breaking oaths/contracts applies curses correctly
- [ ] Contract terms are negotiable via LLM dialogue
- [ ] Hidden clauses in demon deals reveal at the right time
