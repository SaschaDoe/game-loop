# Ritual Integration Design

**Date:** 2026-03-09
**Epic:** 79 — Magic System
**User Story:** US-MS-51 — Ritual Magic (integration layer)
**Status:** Approved

---

## Overview

Integrate the ritual system into the broader game — save/load persistence, NPC teaching, reagent drops, quest rewards, and discoverable ritual tomes. Makes rituals feel like a natural part of the world rather than a standalone subsystem.

## 5 Integration Points

### 1. Save/Load Fix (Critical)
Add all 6 ritual GameState fields to SerializedState in save.ts. Serialize in serializeState(), deserialize with safe defaults in deserializeState(). Without this, ritual progress is lost on reload.

### 2. NPC Dialogue Teaching
Add `learnRitual?: string` to DialogueEffect. Wire up in engine dialogue handler (same pattern as learnLanguage). Create dialogue nodes on 3-4 existing NPCs to teach rituals through conversation.

### 3. Reagents in Dungeon Containers
Add ~20% reagent chance to container item generation. Scale reagent rarity with dungeon level:
- Levels 1-3: arcane_dust, starfern
- Levels 4-6: moonwater_vial, dreamleaf
- Levels 7+: void_salt, lightning_shard

### 4. Quest Rewards
Add `learnRitual?: string` to QuestReward. Wire up in quest completion handler. Add ritual rewards to 2-3 existing quests.

### 5. Ritual Tomes
Create 6 "Ritual Tome" items (one per ritual) in item catalog. Type: 'ritual_tome'. Consumed on use to teach the ritual. Placed in dungeon containers with ~5% drop rate, scaling with level.

## Files to Modify
- `save.ts` — serialize/deserialize 6 ritual fields
- `types.ts` — add learnRitual to DialogueEffect and QuestReward
- `engine.ts` — dialogue handler, quest handler, container generation, tome usage
- `items.ts` — 6 ritual tome item definitions
- `rituals.test.ts` — integration tests
