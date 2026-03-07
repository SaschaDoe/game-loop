# Exotic Mounts

As a player, I want to tame and ride exotic creatures beyond standard horses, each with unique traversal abilities, so that mount choice affects exploration strategy.

## Details

- **Exotic Mount Types**:
  - **Giant Spider**: wall climbing (traverse vertical surfaces and ceilings); web trail (slows pursuers); forest/cave mount; creepy but effective; NPCs react with fear; Taming difficulty: Hard
  - **Griffin**: flight (true flying mount); fast aerial travel; can carry 1 passenger + rider; requires large landing area; expensive to feed (meat); Taming difficulty: Very Hard
  - **Dire Wolf**: fast overland; pack bonus (+2 attack when near other wolves); scent tracking (follow trails while mounted); intimidating presence; cold resistant; Taming difficulty: Medium
  - **Giant Lizard**: desert specialist; heat immune; wall climbing (slower than spider); tail swipe attack from mount; can carry heavy loads; Taming difficulty: Medium
  - **Wyvern**: flight (combat-capable); poison stinger attack from mount; aggressive (may attack NPCs unprompted); requires constant handling checks; Taming difficulty: Extreme
  - **Mechanical Horse (Artificer)**: no feeding, no rest needed; never tires; moderate speed; requires maintenance (oil every 100 turns); steam burst (short speed boost); crafted, not tamed
  - **Nightmare (Demonic Horse)**: fire hooves (leaves burning trail); shadow step (short-range teleport); immune to fire; only bondable by evil-aligned characters; emanates fear; Taming difficulty: Extreme + evil alignment
  - **Giant Tortoise**: very slow; massive carrying capacity (500 weight units); platform on back (acts as mobile camp — rest while traveling); nearly impervious shell (takes almost no damage while mounted); Taming difficulty: Easy
  - **Seahorse (Giant)**: aquatic mount; fast underwater movement; water breathing aura (rider can breathe underwater); useless on land; found near merfolk cities; Taming difficulty: Medium
- **Taming Process**: requires Animal Handling skill; approach creature without hostility (Stealth or CHA check); offer appropriate food; spend 10-30 turns bonding; success = permanent mount; failure = creature flees or attacks
- **Mount Stabling**: exotic mounts require appropriate stables (spider needs a cave, griffin needs a high perch, seahorse needs a dock); standard stables refuse exotic mounts
- **Mount Equipment**: exotic saddles crafted for each mount type; mount armor (barding) available for combat mounts; mount accessories (saddlebags, lantern hooks, weapon racks)

## Acceptance Criteria

- [ ] All mount types provide correct traversal abilities
- [ ] Taming process uses correct skill checks and bonding duration
- [ ] Mount-specific stabling requirements enforce correct location types
- [ ] Mount equipment correctly fits mount types
- [ ] Alignment restrictions prevent wrong-alignment bonding
