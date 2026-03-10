# Ley Lines Overworld Design

**Date**: 2026-03-10
**Status**: Approved

## Summary

Two great ley lines cross the 200x200 overworld map (N-S and W-E), meeting at the academy. They are invisible by default and revealed by divination spells (True Sight, Reveal Secrets). Tiles on ley lines get elevated ley line levels affecting mana regen and spell damage. The convergence point at the academy center grants instant full mana restore. Two new quests tie into the system: an academy practical exam and a troubled farm side quest in Hearthlands.

## Overworld Ley Line Generation

### Placement
- Two lines generated during `generateWorldMap()` in `overworld.ts`
- Both pass through the academy settlement position (convergence point)
- N-S line: runs from top edge to bottom edge through the academy
- W-E line: runs from left edge to right edge through the academy
- Lines use Perlin/simplex noise for slight organic wobble (amplitude ~3-5 tiles) so they don't look ruler-straight
- Lines are geological — they ignore region boundaries

### Tile Data
- New field on `OverworldTile` (or parallel data structure): `leyLine: 'core' | 'aura' | null`
- Core: the 1-tile-wide line itself
- Aura: 2 tiles on each side of the core
- Convergence: ~3x3 area at the academy center where both lines cross

### Ley Line Levels (overworld movement)
- **Core tiles**: ley line level 3 (Strong) — 1.1x spell damage, 150% mana regen
- **Aura tiles**: ley line level 2 (Normal) — 1.0x damage, 100% regen (baseline, no change)
- **Convergence (3x3)**: ley line level 4 — 1.25x damage, 200% regen + **instant full mana restore on step**
- **Off ley line**: region default (currently 2)

Update `enterOverworldTile()` or equivalent in `overworld-handler.ts` to set `state.leyLineLevel` based on tile ley line status.

## Visibility System

### Hidden by Default
- Ley line tiles look like normal terrain when not revealed
- No new terrain characters — existing terrain stays as-is

### True Sight Reveals Ley Lines
- While True Sight buff is active, ley line tiles render with a color tint overlay:
  - Core: cyan (#4ff) tint on the terrain character
  - Aura: dim cyan (#2aa) tint
  - Convergence: bright gold (#fc4) tint
- Player sees the lines as they move around the overworld
- Extend existing True Sight implementation to check tile ley line data

### Reveal Secrets Pings Ley Lines
- When cast, ley line tiles within the 5-tile radius are briefly highlighted
- Works as a one-shot reveal (see them on the current screen, fades when you move)

### Future Extensibility
- Add a `magicalFeatures` array or flags to tiles/positions for future hidden content (warded areas, enchanted objects, cursed ground)
- True Sight / Reveal Secrets check this same system

## Terrain Flavor Text

When examining (look command) ley line tiles with True Sight active:
- Farmland: "The crops grow unnaturally tall here, fed by unseen energy."
- Forest: "The trees hum faintly, leaves trembling without wind."
- Grass: "The ground pulses with faint warmth beneath your feet."
- Rock: "Veins of light trace through the stone."
- Water: "The surface shimmers with an inner glow."
- Generic fallback: "You sense raw magical energy flowing through this place."

## Academy Quest: "Threads of Power"

### Prerequisites
- Player is enrolled at the academy
- Available after lesson 2 (Elemental Weaknesses) or as standalone side quest

### Quest Giver
- Prof. Ignis (existing NPC), new dialogue branch about ley lines

### Objectives
1. **Learn True Sight** — Prof. Ignis teaches it as part of the quest (free, no talent point cost since it's quest-granted)
2. **Cast True Sight at the convergence point** — stand at academy center, cast spell, see the glowing intersection
3. **Walk the ley line** — follow one line outward until reaching the "Strong" zone (leave convergence area), observe with True Sight active
4. **Return to convergence** — step back on the convergence point, experience instant mana restore

### Rewards
- 100 XP
- `book_ley_lines` (the existing ley line lore book)
- Dialogue flag `knows_ley_lines` — unlocks ley line dialogue topics with NPCs across the world

### Dialogue
- Prof. Ignis: "The Academy was built here for a reason. Two great ley lines cross beneath our feet — rivers of raw mana flowing through the earth. I want you to see them for yourself."
- On casting True Sight at convergence: "The ground erupts with light. Two brilliant streams of energy cross beneath you, stretching to the horizon in four directions."
- On reaching Strong zone: "The glow dims but persists — the ley line continues, weaker but steady."
- On returning to convergence: "Power floods through you as you step onto the crossing point. Your mana surges to full." (instant restore triggers)
- Turn in: "Now you understand why we built here. The convergence is the finest place in the world to study magic."

## Farm Side Quest: "Blighted Harvest"

### Location
- Small farm settlement/POI in Hearthlands region, placed on the W-E ley line during world generation
- Named: "Thornfield Farm" (or generated name)
- Contains: farmhouse, field (farmland tiles), well, small barn

### NPCs
- **Farmer Edric** — scared, desperate, doesn't understand magic

### Problem (discovered through dialogue + investigation)
- Ley line runs directly through the field and the well
- Crops mutating: growing too fast, twisted shapes, some glow at night
- Well water causes vivid hallucinations/visions in anyone who drinks it
- Livestock won't graze on certain strips of the field
- Farmer's child is sick after drinking the well water

### Investigation Phase
- Talk to Farmer Edric — learn the symptoms
- Use True Sight or Reveal Secrets in the field — see the ley line running through the property
- Examine the well — detect concentrated ley energy
- Optional: drink the well water — brief vision (lore hint about ancient times, subtle god-related imagery, never explained)

### Resolution Options

**Option A: Ward the Well** (easier)
- Requires: Ward of Protection ritual OR completion of "Protective Wards" academy lesson
- Player places a ward on the well to filter raw mana
- Result: well water becomes safe, but crops still grow strangely (partial fix)
- Farmer is relieved but worried about the field

**Option B: Redirect the Flow** (harder, better outcome)
- Requires: `knows_ley_lines` flag (from academy quest) + INT check (DC 14)
- Player uses arcane knowledge to deflect ley energy around the farm
- Result: well and crops return to normal, farm is safe
- Farmer is deeply grateful

### Rewards
- 150 XP (Option A) or 250 XP (Option B)
- Unique item: **Ley Water Vial** — consumable, restores 50% mana but applies 3-turn confusion effect
- Farmer reputation / gratitude flag
- If player drinks well water: lore snippet added to story discoveries

### Lore Hook
The well visions show: a flash of seven figures standing in a circle of light, one of them weeping. No context given. If player has advanced in main quest, they might connect it to the gods' ascension. Never explained by any NPC.

## Technical Changes

### Files to Modify
- `overworld.ts` — ley line generation during world map creation
- `overworld-handler.ts` — ley line level assignment on tile entry, convergence instant restore
- `types.ts` — add ley line data to OverworldTile or WorldMap
- `spells.ts` — extend True Sight / Reveal Secrets to reveal ley lines
- `renderer.ts` or `+page.svelte` — color overlay rendering when ley lines revealed
- `dialogue.ts` — Prof. Ignis ley line quest dialogue, Farmer Edric dialogue
- `quests.ts` — two new quest definitions
- `overworld.ts` — place Thornfield Farm on the ley line in Hearthlands

### Files NOT Changed
- `combat.ts` — no combat changes
- `engine.ts` — minimal, maybe route new quest triggers
- `spells.ts` spell catalog — no new spells (extending existing ones)
- `academy.ts` — quest is dialogue/quest-driven, not a formal lesson

### New Data
- 2 quest definitions (threads_of_power, blighted_harvest)
- ~20 dialogue nodes (Prof. Ignis quest, Farmer Edric quest)
- 1 new NPC (Farmer Edric)
- 1 new item (Ley Water Vial)
- 1 new POI or settlement (Thornfield Farm)
- Ley line coordinate data on WorldMap
