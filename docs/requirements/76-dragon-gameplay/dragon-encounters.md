# Dragon Encounters

As a player, I want dragon fights to be multi-phase boss encounters with unique mechanics per dragon type, so that facing a dragon is the most epic combat experience in the game.

## Details

- **Dragon Types**:
  - **Red Dragon (Fire)**: breath weapon = fire cone (5-tile cone, 40 fire damage); lair in volcanic caverns; hoards gold obsessively; immune to fire; weakness: ice; personality: arrogant, wrathful; will monologue before fighting
  - **Blue Dragon (Lightning)**: breath weapon = lightning line (8 tiles, 35 lightning damage); lair in desert cliff faces; hunts with ambush from sandstorms; immune to lightning; weakness: earth; personality: cunning, patient strategist
  - **Green Dragon (Poison)**: breath weapon = poison cloud (4-tile radius, 25 poison + 10/turn for 5 turns); lair in deep forest; master manipulator, prefers trickery over direct combat; immune to poison; weakness: fire; personality: deceptive, will negotiate then betray
  - **White Dragon (Ice)**: breath weapon = ice blast (6-tile cone, 30 ice damage + slow); lair in glaciers and tundra; least intelligent dragon type, most bestial; immune to cold; weakness: fire; personality: feral, territorial
  - **Black Dragon (Acid)**: breath weapon = acid spray (3-tile cone, 35 acid + armor degradation); lair in swamps and underground pools; cruelest dragon, tortures prey; immune to acid; weakness: lightning; personality: sadistic, hates all living things
  - **Shadow Dragon**: breath weapon = shadow breath (5-tile cone, 30 necrotic + sanity drain); lair in dimensional rifts; partially exists in another plane; phases in and out of reality; immune to necrotic; weakness: radiant; personality: alien, unknowable
  - **Ancient Wyrm**: no specific element; all elements at reduced power; the oldest dragon; lair beneath the oldest mountain; knows all languages, all spells; WIS 25; near-divine; can only be challenged, not ambushed; personality: wise, weary, judges mortals
- **Multi-Phase Combat**:
  - **Phase 1 (Airborne)**: dragon flies, strafing with breath weapon; must use ranged attacks or force it to land (destroy wings, use chains, gravity magic)
  - **Phase 2 (Grounded)**: melee combat; tail sweep (AoE behind), claw attacks, bite (grapple + damage), breath weapon on cooldown (5 turns)
  - **Phase 3 (Desperate, below 25% HP)**: dragon becomes frenzied; all attacks +50% damage; breath weapon cooldown reduced; may collapse part of the lair; fight-or-flight — some dragons try to flee
- **Dragon Hoard**: defeating a dragon reveals their hoard; gold, gems, magical items, and one unique dragon-specific artifact; hoard size scales with dragon age
- **Dragon Speech**: all dragons can speak; LLM generates dragon dialogue with personality-appropriate speech patterns; negotiation possible with some dragons (Green, Ancient Wyrm) before or during combat

## Acceptance Criteria

- [ ] All dragon types have correct breath weapons, immunities, and weaknesses
- [ ] Multi-phase combat transitions at correct HP thresholds
- [ ] Airborne phase requires correct methods to ground the dragon
- [ ] Dragon hoards scale with dragon age and type
- [ ] LLM generates personality-appropriate dragon dialogue
