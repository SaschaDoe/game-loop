# Escape Routes

As a player, I want multiple ways to escape from prison requiring different skills and preparation, so that prison breaks are exciting multi-step challenges.

## Details

- **Escape Methods**:
  - **Tunnel**: dig a tunnel from your cell over multiple days (10+ turns); hide the entrance behind a poster/furniture; requires a digging tool (spoon, shiv, smuggled pickaxe); risk: guards find the tunnel during cell inspections
  - **Lockpick**: pick your cell lock at night, sneak past guards to an exit; requires lockpick (crafted or smuggled) + high stealth; fast but high detection risk
  - **Disguise**: steal a guard uniform during laundry duty; walk out the front gate; requires Charisma check at each checkpoint; blown if a guard who knows the real owner sees you
  - **Riot**: incite a prison riot (requires high reputation with inmates); escape during chaos; violent, guards may be killed, some inmates escape too (consequences in the world)
  - **Bribe**: accumulate enough contraband currency to bribe a guard to look the other way; safest method but expensive and slow
  - **Rescue**: if companions have high loyalty, they stage a breakout from outside (assault on the prison); player must fight their way out from inside
  - **Legal**: hire a lawyer NPC to appeal your sentence; LLM-powered court dialogue; success = early release; failure = extended sentence
  - **Magic**: if the player has spells, some prisons have anti-magic wards; dispelling the ward first allows teleportation/phasing; high-security prisons are ward-proof
- **Escape Preparation**: each method requires gathering items, building alliances, learning guard patrol patterns, and timing the attempt
- **Failed Escape Consequences**: solitary confinement (30 turns alone, sanity drain), extended sentence, loss of privileges, moved to higher-security wing
- **Post-Escape**: wanted level increases by 1 star; player is a fugitive from that town; equipment must be recovered from the prison evidence room or replaced
- **Perfect Escape**: escape without anyone knowing = no wanted level increase (tunnel or disguise, done perfectly)

## Acceptance Criteria

- [ ] All eight escape methods are functional with unique requirements
- [ ] Preparation phase requires gathering correct items and intel
- [ ] Failed escape triggers appropriate consequences
- [ ] Post-escape wanted level adjusts correctly
- [ ] Perfect escape avoids wanted level increase
