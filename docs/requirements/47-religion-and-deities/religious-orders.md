# Religious Orders

As a player, I want to join religious orders with unique vows, rituals, and divine abilities, so that devotion to a deity provides a structured progression path with meaningful restrictions.

## Details

- **Order Types**:
  - **Paladins of the Dawn**: holy warriors; vow: never flee from undead, protect the innocent; abilities: smite evil (bonus damage vs evil creatures), lay on hands (heal touch), divine shield (absorb damage); restriction: can't use poison, can't attack surrendering enemies
  - **Monks of Silence**: contemplative monks; vow: no spoken dialogue (player can only use gestures/written communication with NPCs); abilities: inner peace (immune to fear/charm), meditative heal (slow self-heal over time), ki strike (unarmed attacks count as magical); restriction: no armor, no edged weapons
  - **Sisters/Brothers of Mercy**: healer order; vow: never deal lethal damage (all damage is non-lethal); abilities: mass heal, purify (cure all status effects), sanctuary (enemies can't target you for 5 turns); restriction: can't use offensive magic, can't initiate combat
  - **Inquisitors**: hunter order; vow: destroy all heretics and undead; abilities: detect evil, bind creature (magical chains, immobilize), truth compulsion (NPC must answer honestly); restriction: must attack evil creatures on sight, can't ally with undead/demon NPCs
  - **Druids of the Wild**: nature order; vow: protect natural places, never use metal; abilities: speak with animals, plant growth (create barriers), nature's wrath (entangle enemies); restriction: no metal equipment, must intervene against environmental destruction
  - **Death Priests**: order of the death god; vow: guide souls to the afterlife, never resurrect the dead; abilities: death ward (survive one lethal blow), speak with dead, soul sight (see ghosts); restriction: must destroy undead, can't use resurrection magic
- **Advancement**: 5 ranks within each order (initiate, acolyte, priest, high priest, chosen); advance by completing order-specific quests, maintaining vows, and tithing (10% of gold earned)
- **Vow Breaking**: violating your vow causes divine punishment (stat drain, ability lockout for 100 turns, reputation loss within the order); 3 violations = expulsion (lose all order abilities permanently)
- **Interfaith Conflict**: opposing orders may conflict; order quests occasionally pit you against members of rival orders; choosing sides affects divine politics

## Acceptance Criteria

- [ ] All orders have correct vows, abilities, and restrictions
- [ ] Vow violations trigger correct punishments
- [ ] Rank advancement tracks quest completion and tithing
- [ ] Expulsion correctly removes all order abilities
- [ ] Interfaith conflict quests present meaningful faction choices
