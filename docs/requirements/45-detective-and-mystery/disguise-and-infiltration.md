# Disguise and Infiltration

As a player, I want to go undercover using disguises to infiltrate restricted areas and gatherings, so that stealth and social deception are viable investigative tools.

## Details

- **Disguise Types**:
  - **Guard Uniform**: access military areas, walk past checkpoints; blown if you don't salute officers or know the password
  - **Noble Attire**: access to noble parties, court, upper-class shops; blown if you lack etiquette (Charisma check)
  - **Servant Clothes**: access kitchens, back rooms, private chambers; blown if you can't answer questions about household routines
  - **Merchant Garb**: access trade guilds, warehouses, caravans; blown if you can't discuss current market prices
  - **Cultist Robes**: access secret society meetings, ritual sites; blown if you don't know the secret handshake/phrase
  - **Enemy Faction Armor**: walk among enemies, overhear plans; blown if an NPC who knows the real owner sees you
- **Disguise Mechanics**:
  - Disguise effectiveness = Charisma + disguise skill + outfit quality
  - Each NPC has a suspicion meter; suspicious actions fill it (wrong dialogue, going to restricted sub-areas, being seen changing clothes)
  - Once blown: combat, flee, or fast-talk your way out (difficult Charisma check)
- **Infiltration Objectives**: steal documents, plant evidence, eavesdrop on conversations, sabotage equipment, poison supplies, rescue prisoners
- **Social Stealth**: blend into crowds, match NPC behavior (if guards stand still, stand still; if servants carry trays, carry a tray)
- **Disguise Acquisition**: buy from costume shops, steal from clotheslines, loot from knocked-out NPCs, crafted by tailor companion

## Acceptance Criteria

- [ ] All disguise types grant access to appropriate areas
- [ ] Suspicion meter fills from contextually appropriate triggers
- [ ] Being blown triggers correct consequences
- [ ] Infiltration objectives are completable while disguised
- [ ] Social stealth behavior-matching provides detection reduction
