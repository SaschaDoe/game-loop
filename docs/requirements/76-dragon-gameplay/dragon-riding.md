# Dragon Riding

As a player, I want to bond with and ride a dragon as the ultimate mount, with aerial combat and dragon growth mechanics, so that dragon-riding is the pinnacle of the mount system.

## Details

- **Dragon Bond**: requires: finding a dragon egg (extremely rare — one per world region), hatching it (fire magic + 50 turns of incubation), and raising the hatchling (100 turns of daily feeding + bonding interactions); bond is permanent and exclusive (one dragon per character)
- **Dragon Growth Stages**:
  - **Hatchling (0-200 turns)**: cat-sized; can't ride; follows player; learns commands; breath weapon = tiny spark (cosmetic); needs constant feeding
  - **Juvenile (201-1000 turns)**: dog-sized; can carry small items; basic breath weapon (5 damage); can scout independently; learning to fly (short hops)
  - **Young (1001-3000 turns)**: horse-sized; rideable; flight unlocked; breath weapon (15 damage); can fight in combat alongside player; 1 rider
  - **Adult (3001-8000 turns)**: large; powerful flight; breath weapon (30 damage); can carry 2 riders; intimidation aura; NPCs react with awe/fear
  - **Ancient (8001+ turns)**: massive; devastating breath weapon (50 damage); can carry 4 riders; castle-tier HP; legendary creature; reshapes the political landscape (kingdoms ally with or against you)
- **Aerial Combat**: while riding, player and dragon act as a unit; dragon handles movement (flight), player handles tactics (choose targets, direct breath weapon, use ranged attacks/spells from dragonback); enemy aerial threats: other dragons, flying monsters, siege weapons (ballistae aimed at the sky)
- **Dragon Commands**: attack target, breath weapon, fly higher (avoid ground attacks, can't target ground), dive bomb (massive charge from altitude, slam damage), hover (stationary, player can use abilities freely), retreat (fly away from combat)
- **Dragon Personality**: each dragon develops personality traits based on how it's raised (aggressive if raised in combat, gentle if raised with care, scholarly if exposed to magic/books); personality affects combat behavior and NPC reactions
- **Dragon Lair**: as the dragon grows, it instinctively seeks a lair; player chooses lair location (mountain cave, volcanic caldera, forest clearing); lair becomes a fast-travel base and storage location; dragon guards the lair when not with you
- **Dragon Death**: if the bonded dragon dies, player suffers "Bond Severance" (-5 all stats for 500 turns, permanent -1 CHA scar); cannot bond with another dragon for 2000 turns; devastating loss

## Acceptance Criteria

- [ ] Dragon growth stages progress on correct turn timers
- [ ] Each growth stage unlocks correct abilities and rideable status
- [ ] Aerial combat allows correct player actions from dragonback
- [ ] Dragon personality develops based on player raising choices
- [ ] Bond Severance applies correct penalties on dragon death
