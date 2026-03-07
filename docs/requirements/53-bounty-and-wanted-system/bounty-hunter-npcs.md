# Bounty Hunter NPCs

As a player, I want named bounty hunters to pursue me when I'm wanted, with escalating skill and persistence, so that being a criminal feels dangerous and dramatic.

## Details

- **Hunter Tiers** (dispatched based on wanted level):
  - 2 Stars: **Local Tracker** — low-level, follows obvious trails, gives up if you leave town; beatable in combat
  - 3 Stars: **Professional Hunter** — mid-level, tracks across regions, sets traps, waits at town gates; will fight or negotiate
  - 4 Stars: **Elite Manhunter** — high-level, has a team (2-3 assistants), uses informants, cuts off escape routes; persistent across save/load
  - 5 Stars: **Legendary Hunter** — unique named NPC with backstory, custom abilities, level scales to be 2 above the player; appears at dramatic moments; LLM dialogue offers deals ("Come quietly and I'll speak for you at trial")
- **Hunter Behaviors**:
  - Track via NPC informants (ask around in towns where the player was last seen)
  - Set ambushes on roads between towns the player frequents
  - Stake out quest objectives (hunters know which quests the player is likely pursuing)
  - Hire local mercenaries or bribe NPCs to betray the player's location
  - Camp outside dungeon exits and wait for the player to emerge
- **Confrontation Options**:
  - Fight: kill or incapacitate the hunter; higher-tier hunters are tough fights
  - Surrender: go to trial; hunter escorts you peacefully
  - Bribe: pay 2x the bounty amount directly to the hunter; they fake your death
  - Convince: LLM dialogue — argue your case, offer a deal, threaten, appeal to their morals; success depends on argument quality and Charisma
  - Flee: outrun or outmaneuver them; they'll be back later with better preparation
- **Hunter Memory**: defeated hunters remember you; they come back stronger, with new tactics, and a personal grudge
- **Anti-Hero Path**: befriend a legendary hunter through repeated encounters; they may eventually become an ally or offer bounty hunting work

## Acceptance Criteria

- [ ] Correct hunter tiers are dispatched based on wanted level
- [ ] Hunter tracking behaviors create meaningful pursuit gameplay
- [ ] All confrontation options (fight, surrender, bribe, convince, flee) function
- [ ] LLM dialogue for negotiation responds contextually
- [ ] Hunter memory persists and influences future encounters
