# Clockwork Traps

As a player, I want to build and deploy intricate clockwork traps with programmable triggers and chain reactions, so that artificer trap-making is more sophisticated than standard traps.

## Details

- **Clockwork Trap Components**:
  - **Trigger Module**: pressure plate, tripwire, proximity sensor (detects movement within 3 tiles), timed delay (activates after N turns), sound trigger (activates on loud noise)
  - **Mechanism**: spring-loaded (fast, single use), gear-driven (slower but reusable 3x), steam-powered (powerful but noisy), magnetic (silent, pulls metal objects/armor)
  - **Payload**: blades (slashing damage), darts (piercing + optional poison), net (entangle), cage (capture), alarm (loud noise alerts), shock coil (lightning damage), gas canister (poison cloud)
- **Trap Assembly**: combine trigger + mechanism + payload at a workbench; INT + Artificer skill determines quality; higher quality = harder to detect, more damage, more reliable
- **Chain Reactions**: place multiple traps in sequence; first trap's activation can trigger the next (connect with trip wires or timed relays); chain up to 5 traps for elaborate kill corridors
- **Programmable Logic**: advanced artificers can add logic gates:
  - AND gate: trap activates only when two conditions are met simultaneously (pressure plate + proximity)
  - OR gate: trap activates from either condition
  - NOT gate: trap deactivates when condition is met (safe passage for allies who carry a specific item)
  - Timer: delay activation by N turns after trigger
- **Trap Maintenance**: clockwork traps degrade over time (gears wear, springs lose tension); unmaintained traps have increasing misfire chance; maintenance takes 3 turns per trap
- **Trap Recovery**: disassemble deployed traps to recover 50% of components; failed disassembly triggers the trap (ouch)
- **Anti-Trap Traps**: traps designed to counter other traps; magnetic traps pull apart mechanical enemies; EMP-like devices disable other clockwork

## Acceptance Criteria

- [ ] All component types combine correctly into functional traps
- [ ] Chain reactions trigger in correct sequence
- [ ] Logic gates evaluate conditions correctly
- [ ] Trap degradation increases misfire chance on schedule
- [ ] Trap recovery returns correct component percentages
