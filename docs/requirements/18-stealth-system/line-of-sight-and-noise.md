# Line of Sight and Noise

As a player, I want enemies to have realistic sight cones and hearing ranges, so that stealth gameplay has clear, learnable rules I can exploit.

## Details

- Enemies have a facing direction and a vision cone (90-degree arc, 6-8 tiles deep)
- Vision cone is visible in stealth mode as faint highlights on the map
- Peripheral vision: enemies have a shorter detection range to their sides
- Noise propagation: actions generate noise with a radius (walking: 2 tiles, running: 5, combat: 10, doors: 4)
- Noise attracts enemies to investigate the source location
- Noise-dampening items: padded boots, silence spell, moss arrows
- Certain surfaces are louder: gravel, water puddles, broken glass
- Deaf enemies (constructs, some undead) are immune to noise but have wider vision
- Blind enemies (cave worms) rely entirely on noise/vibration

## Acceptance Criteria

- [ ] Enemy vision cones render in stealth mode
- [ ] Noise radius attracts enemies to investigate
- [ ] Surface types affect noise generation
- [ ] Deaf and blind enemies have appropriate sense trade-offs
