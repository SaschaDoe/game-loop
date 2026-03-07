# Dream Items

As a player, I want to find surreal items in dreams that have impossible properties, so that the dream realm rewards exploration with unique and bizarre loot.

## Details

- **Dream Item Types**:
  - **Dream Dust** (consumable): snort to instantly fall asleep and enter the dream realm; also cures insomnia; sprinkle on an NPC to make them sleep (non-combat)
  - **Nightmare Blade** (weapon): deals psychic damage instead of physical; bonus damage against sleeping or dreaming targets; appears as a shifting, unstable shape
  - **Lucid Potion** (consumable): grants Lucid Dreaming skill +3 for one dream session; allows dream control even without the skill
  - **Dream Catcher** (accessory): prevents nightmares when equipped; absorbs nightmare energy; when full, can be thrown to inflict nightmare on an enemy (fear + confusion 5 turns)
  - **Impossible Object** (trinket): an object that can't exist (a bottle containing itself, a staircase that goes up in all directions); reduces sanity by 1 when looked at; grants +3 INT while carried
  - **Memory Pearl** (quest item): crystallized dream memory; replay a past event to notice something you missed; one-time use; reveals hidden quest clues
  - **Sleepwalker's Boots** (boots): while resting, your body walks on its own (covers distance during sleep); risk: body wanders into danger if not in a safe area
  - **Pillow of Regeneration** (accessory): resting heals 200% normal HP; dreams are always pleasant; takes 2 accessory slots (it's a pillow)
- **Dream Item Properties**:
  - Dream items glow with a shifting iridescent tint in inventory (distinct from normal items)
  - Most dream items only work while the player has slept in the last 100 turns (they're "charged" by dreaming)
  - Some dream items work differently in the dream realm vs waking world
- **Obtaining Dream Items**: found in the dream realm during sleep; some are rewards from dream NPCs; lucid dreamers at high skill can craft dream items
- **Dream Item Limit**: maximum 5 dream items in inventory; excess dream items dissolve when you wake (they can't sustain in reality for long)
- **Selling Dream Items**: most merchants don't recognize them; dream item collectors exist (rare NPC) and pay premium prices

## Acceptance Criteria

- [ ] All dream items have unique properties that function correctly
- [ ] Dream items are visually distinct in inventory
- [ ] Dream charge mechanic gates item functionality to recent sleep
- [ ] Inventory limit enforces maximum 5 dream items
- [ ] Dream items are obtainable through correct dream realm activities
