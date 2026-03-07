# Faction Morality

As a player, I want factions to have their own moral codes that may conflict with mine, so that alliance choices feel meaningful and no faction is purely good or evil.

## Details

- **Faction Moral Spectrums**: each faction has positions on key issues:
  - Magic: embrace (Mages Guild) vs restrict (Templars) vs weaponize (Crimson Pact)
  - Commerce: free trade (Merchants Guild) vs regulated (Crown) vs black market (Thieves Guild)
  - Justice: rehabilitation (Healers Circle) vs punishment (Crown Guard) vs vigilante (Rangers)
  - Outsiders: welcoming (Bards) vs isolationist (Dwarven Holds) vs xenophobic (some human kingdoms)
  - Nature: preservation (Druids) vs exploitation (Miners Guild) vs transformation (Clockwork Creed)
- **Moral Conflicts**: faction questlines will ask the player to do things that conflict with other factions' values:
  - Mages Guild asks you to study forbidden magic → Templars view this as heresy
  - Thieves Guild asks you to steal from merchants → Merchants Guild reputation drops
  - Crown asks you to enforce an unjust law → Resistance fighters lose trust in you
- **No Perfect Alignment**: it's impossible to max reputation with all factions; every major choice gains one and costs another
- **Faction Debates**: LLM-powered dialogue where faction leaders argue their positions; player can mediate or take sides
- **Moral Consequences**: faction morality choices affect which endings are available, which areas are accessible, which NPCs help or hinder
- **Gray Areas**: quests where both sides have valid points — there is no "right" answer, only consequences
- Player can create their own faction at max level with custom moral code

## Acceptance Criteria

- [ ] Each faction has defined positions on all moral axes
- [ ] Cross-faction conflicts trigger from quest choices
- [ ] Reputation tradeoffs prevent maxing all factions
- [ ] LLM faction debates respond to player arguments
- [ ] Moral choices affect endings and NPC availability
