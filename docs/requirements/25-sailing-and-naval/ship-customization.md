# Ship Customization

As a player, I want to upgrade and customize my ship with weapons, cargo holds, crew quarters, and magical enhancements, so that my vessel is a reflection of my playstyle.

## Details

- **Ship Types** (base vessels):
  - **Rowboat**: 1-person; no customization; starter vessel; slow; lake/river only
  - **Sloop**: 1-3 crew; 2 upgrade slots; fast, maneuverable; light cargo; good for coastal exploration
  - **Brigantine**: 5-15 crew; 4 upgrade slots; balanced speed/cargo; medium weapons; standard trade ship
  - **Galleon**: 20-50 crew; 6 upgrade slots; heavy cargo capacity; strong weapons; slow; the merchant king
  - **War Galley**: 30-80 crew; 5 upgrade slots; fast; heavy weapons; ramming capability; low cargo; military vessel
  - **Ghost Ship**: undead crew (don't need food); 4 upgrade slots; phasing ability (pass through obstacles briefly); only obtainable through dark quest; feared by all
- **Upgrade Categories**:
  - **Weapons**: cannons (broadside fire), ballistae (accurate, single target), catapults (lobbed fire/stones, AoE), harpoon launchers (hook enemy ships, reel in), Greek fire siphon (fire spray, devastating but dangerous)
  - **Defense**: reinforced hull (+HP), ram prow (collision damage), armor plating (reduce incoming damage), magical shields (absorb N hits), anti-boarding spikes
  - **Sails**: standard canvas (balanced), silk sails (speed +20%, fragile), enchanted sails (wind control, never becalmed), shadow sails (stealth at night, reduced visibility)
  - **Cargo**: expanded hold (more capacity), refrigerated hold (perishables last longer), hidden compartments (smuggling), treasure vault (secure storage, locked)
  - **Crew**: improved quarters (morale +, crew efficiency +), training room (crew levels up faster), infirmary (heal injured crew), brig (hold prisoners)
  - **Special**: crow's nest (Perception bonus, spot land/ships earlier), diving bell (underwater exploration from ship), teleport beacon (recall to ship from shore), magical figurehead (grants ship a special ability based on figure — dragon = fire breath, mermaid = speed in storms, kraken = tentacle attack)
- **Ship Naming**: name your ship; the name becomes known as your reputation grows; legendary ships are referenced in NPC dialogue
- **Ship Damage and Repair**: ships take damage from combat, storms, and reefs; damaged systems stop working; repair at dry dock (expensive, full repair) or at sea (Carpentry skill, partial repair with materials)

## Acceptance Criteria

- [ ] All ship types have correct base stats and upgrade slot counts
- [ ] Upgrades correctly modify ship capabilities
- [ ] Magical figureheads grant correct special abilities
- [ ] Ship damage disables correct systems based on damage location
- [ ] Ship naming persists and appears in NPC dialogue at high reputation
