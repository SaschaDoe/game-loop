# Trap Detection and Disarming

As a player, I want to detect and disarm traps placed in dungeons, so that I can avoid damage through careful exploration and Rogue-like skills.

## Details

- Trap types: spike, pit, poison dart, alarm (alerts enemies), teleport, explosion
- Traps are hidden until detected or triggered
- Detection: passive Perception check when adjacent, or active Search action
- Disarming: Dexterity check; success removes the trap, failure triggers it
- Rogues and high-Dexterity characters have bonuses to both detection and disarming
- Disarmed traps can be collected and redeployed as offensive tools
- Traps can be deliberately triggered by throwing items onto them

## Acceptance Criteria

- [ ] Traps are hidden and trigger on contact
- [ ] Detection reveals traps within range
- [ ] Disarming succeeds or fails based on stat check
- [ ] Collected traps can be redeployed
