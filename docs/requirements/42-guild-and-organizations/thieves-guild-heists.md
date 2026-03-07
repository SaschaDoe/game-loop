# Thieves Guild Heists

As a player, I want to plan and execute multi-step heists with the Thieves Guild, so that stealing has elaborate mission-style gameplay.

## Details

- **Heist Structure**:
  1. **Contract**: Guild offers a target (bank vault, noble's treasury, museum artifact, merchant caravan)
  2. **Reconnaissance**: scout the target; learn guard patrols, security measures, entry points, alarm systems
  3. **Planning**: choose approach (stealth infiltration, disguise, tunnel, distraction, inside man); assemble a crew
  4. **Execution**: play through the heist in real-time; improvise when things go wrong
  5. **Extraction**: escape with the loot; evade pursuit; reach the safe house
- **Heist Roles** (assigned to crew members):
  - Lockpick: handles locks and safes
  - Lookout: warns of approaching guards (extends detection range)
  - Muscle: handles unexpected combat encounters
  - Face: talks through social checkpoints (disguise, bluffing)
  - Tech: disables magical alarms and traps
- **Heist Complications** (random, one per heist):
  - Guard rotation changed unexpectedly
  - An alarm you didn't know about
  - A rival thief crew is hitting the same target
  - Insider contact double-crosses you
  - The loot is trapped/cursed
  - A witness who wasn't supposed to be there
- **Heist Difficulty**: small job (1-2 complications) → medium (2-3) → grand heist (4-5, legendary loot)
- **Payout Split**: guild takes 40%; player gets 30%; crew gets 30%; negotiable with high reputation
- **Heist Failure**: getting caught during a heist = prison (see prison-gameplay); loot confiscated; guild reputation drop
- **Perfect Heist**: no alarms, no witnesses, no combat = bonus 50% payout + "Ghost" reputation
- **Legendary Heists**: 3 one-of-a-kind targets (Crown Jewels, Dragon's Hoard while the dragon sleeps, Mage Tower's arcane vault); completing all 3 grants Guildmaster of Thieves status

## Acceptance Criteria

- [ ] All heist phases are playable (recon through extraction)
- [ ] Crew roles provide correct bonuses during execution
- [ ] Complications trigger randomly and require improvisation
- [ ] Payout calculation splits correctly based on reputation
- [ ] Legendary heists unlock with appropriate difficulty and rewards
