# Court Intrigue

As a player, I want to navigate royal court politics through alliances, betrayals, and power plays, so that political gameplay offers a complex social strategy layer.

## Details

- **Court Access**: requires noble title (earned, purchased, or faked), high reputation with the ruling faction, or invitation from a courtier; entering court without proper standing causes guards to remove you
- **Court NPCs**: king/queen, advisors (military, financial, magical, religious), noble houses (3-5 per kingdom), foreign ambassadors, court jesters, spymasters
- **Political Actions**:
  - **Petition**: request favors from the ruler (land grants, tax breaks, pardons, military aid); success based on reputation + Persuasion + current political favor
  - **Gossip**: spread rumors about rivals; reduces their influence; risk of being caught (reputation penalty); gossip travels through the court over 10-20 turns
  - **Alliance**: form pacts with noble houses; shared enemies, mutual defense, trade agreements; betraying an alliance has severe consequences
  - **Blackmail**: use discovered secrets to force cooperation; very effective but creates a permanent enemy; blackmail targets may hire assassins in retaliation
  - **Assassination Plot**: participate in or foil assassination attempts on court members; massive reputation shifts; can change the entire power structure
- **Court Favor System**: numeric score (-100 to +100) with the ruler; actions in court shift favor; high favor = more requests granted, better trade terms, military support; low favor = restricted access, monitored by spies, potential exile
- **Succession Crisis**: if the ruler dies, court enters crisis mode; player can back a claimant, seize power themselves (if enough military/political support), or stay neutral; outcome reshapes the kingdom's policies
- **Court Events**: seasonal balls, tournaments, diplomatic visits, war councils, trials; each is an opportunity for social maneuvering

## Acceptance Criteria

- [ ] Court access correctly gates on title/reputation
- [ ] Political actions produce appropriate outcomes and risks
- [ ] Court favor tracks correctly and affects available options
- [ ] Succession crisis triggers on ruler death and resolves based on player actions
- [ ] Court events provide meaningful political opportunities
