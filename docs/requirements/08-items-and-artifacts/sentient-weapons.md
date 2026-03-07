# Sentient Weapons

As a player, I want to find rare sentient weapons that have personalities and speak to me, so that my gear becomes a character in the story with its own goals and opinions.

## Details

- Sentient weapons are legendary-tier items with an embedded consciousness
- Each sentient weapon has:
  - A name, voice, and personality (LLM-powered dialogue)
  - An alignment that may conflict with the player's
  - A personal quest (the weapon wants something — revenge, to be reunited with its creator, to absorb souls)
  - Opinions on player actions ("I approve of this kill" / "This mercy disgusts me")
- Weapon grows stronger as its personal quest progresses
- If the player consistently opposes the weapon's alignment, it may:
  - Refuse to activate its special ability
  - Attempt to influence the player's actions (unsolicited "suggestions" in the message feed)
  - In extreme cases, try to take control (Wisdom save or the weapon forces an action)
- Example sentient weapons:
  - **Vex, the Scheming Dagger**: chaotic neutral, obsessed with collecting secrets, bonus damage to unaware targets
  - **Auriel, the Radiant Sword**: lawful good, demands justice, extra damage to evil creatures, refuses to harm innocents
  - **The Hollow Maw**: chaotic evil, a living axe that hungers for souls, grows stronger with each kill but slowly corrupts the wielder

## Acceptance Criteria

- [ ] Sentient weapons have LLM-powered dialogue
- [ ] Weapon alignment affects willingness to cooperate
- [ ] Personal quests advance and strengthen the weapon
- [ ] Conflict mechanics (refusal, influence, control) function
