# Mechanical Companions

As a player, I want to build and customize mechanical companions from scavenged parts, so that engineering offers an alternative to magic-based pet systems.

## Details

- **Companion Chassis** (determines base stats and size):
  - **Scout Drone**: tiny, flying, fast, low HP; excels at scouting and triggering traps safely
  - **Combat Automaton**: medium, bipedal, balanced stats; equips weapons and simple armor
  - **Siege Engine**: large, slow, massive HP and damage; cannot enter small spaces; ranged cannon attack
  - **Medical Bot**: medium, no combat ability; auto-heals the player 3 HP per turn when adjacent; removes poison/bleed
  - **Utility Spider**: small, climbs walls, carries items (extra inventory), can pick locks mechanically
- **Component System** (mix and match):
  - Power Core: steam (reliable, needs fuel), arcane (mana-powered, stronger), clockwork (wind-up, no fuel but needs rewinding)
  - Arms: claws (melee), crossbow mount (ranged), manipulators (lockpick, carry), shield arm (defense)
  - Sensors: basic (5 tile vision), thermal (see through walls, detect heat), arcane (detect magic, see invisible)
  - Plating: iron (balanced), mithril (light, fast), adamantine (heavy, armored)
- **Crafting**: requires workbench + components + Artificer skill; higher skill = more complex builds, fewer failed attempts
- **Upgrades**: add modules over time (flight module, invisibility field, explosive self-destruct, elemental weapon coating)
- **Maintenance**: mechanical companions degrade with use; need oil, spare parts, and repair time; neglect = malfunction (random failures in combat)
- **Personality Module** (optional): install an AI crystal to give the companion basic personality and LLM dialogue capability; they develop quirks over time
- Mechanical companions are immune to poison, disease, charm, fear but vulnerable to lightning (overload) and water (rust)

## Acceptance Criteria

- [ ] All chassis types are buildable with correct base stats
- [ ] Component system allows meaningful customization
- [ ] Upgrades install and function correctly
- [ ] Maintenance system degrades performance when neglected
- [ ] Personality module enables LLM dialogue
