# Dialogue Menu and Choices

## Overview
The core dialogue system provides a full-screen conversation interface that opens when the player interacts with an NPC. It replaces the current bump-to-chat message log approach with an immersive dialogue overlay featuring NPC portraits, branching dialogue trees, and selectable player responses. This is the foundational UI that all other dialogue features (LLM conversations, persuasion, bartering, emotional reactions) build upon.

## User Stories

### Opening and Closing Dialogue
- As a player, when I bump into an NPC, a dialogue overlay opens covering the game map
- As a player, I can press ESC or a "Leave" option to end the conversation and return to gameplay
- As a player, the game is paused while I'm in a dialogue (no enemy turns pass)
- As a player, I cannot open dialogue with an NPC during combat (enemies adjacent to me)

### NPC Presentation
- As a player, I see the NPC's name displayed prominently at the top of the dialogue overlay
- As a player, I see a large ASCII art portrait of the NPC built from their character and color
- As a player, I see the NPC's current dialogue text appear with a typewriter effect (character by character)
- As a player, I can press SPACE or tap to skip the typewriter effect and show the full text immediately
- As a player, the NPC's mood or disposition is shown as a subtle color/text indicator (friendly, neutral, hostile, afraid)

### Player Response Choices
- As a player, after the NPC finishes speaking I see 2-4 selectable response options
- As a player, I can navigate response options with W/S or arrow keys and select with ENTER
- As a player, I can tap/click a response option on mobile to select it
- As a player, I can press number keys (1-4) to quickly select a response
- As a player, response options are color-coded by type:
  - White: neutral/informational responses
  - Yellow: quest-related responses
  - Green: kind/helpful responses
  - Red: aggressive/threatening responses
  - Cyan: farewell/exit responses
- As a player, some response options are locked behind requirements (class, level, items, previous choices) and shown grayed out with a reason tooltip

### Dialogue Trees and Branching
- As a player, my response choice determines what the NPC says next (branching dialogue)
- As a player, I can explore different topics by selecting different response branches
- As a player, dialogue branches can loop back to earlier nodes (e.g., "Tell me about..." menus)
- As a player, some dialogue branches are one-time only and disappear after being chosen
- As a player, some dialogue branches only appear after certain conditions are met (quest progress, items held, reputation)
- As a player, a small indicator shows which dialogue options I've already explored (dimmed text or checkmark)

### Consequences and Effects
- As a player, dialogue choices can trigger game effects:
  - Receive items (potions, weapons, gold)
  - Learn information (quest markers, secret locations revealed on map)
  - Start or advance quests
  - Change NPC disposition toward me (friendly ↔ hostile)
  - Gain or lose reputation with factions
  - Trigger NPC to move, follow me, or leave the area
- As a player, important dialogue choices show a warning indicator when they will have major consequences
- As a player, some dialogue options lead to combat (threatening the wrong NPC)

### NPC Memory and Continuity
- As a player, NPCs remember what we've already discussed (completed branches are tracked)
- As a player, returning to an NPC after a previous conversation starts with a contextual greeting ("Back again?" instead of their intro)
- As a player, NPCs who gave me items don't offer them again
- As a player, NPCs reference my previous dialogue choices ("You said you'd help the village...")
- As a player, quest-giving NPCs show different dialogue based on quest state (not started, in progress, completed)

### Starting Location NPCs (Retrofit)
- As a player, talking to Mother in the village opens a full dialogue with choices like "What should I bring?" / "Tell me about the dungeon" / "Goodbye"
- As a player, talking to Father in the village lets me ask about combat tips or his adventuring past
- As a player, talking to the Barkeep in the tavern lets me ask about rumors, buy a drink, or ask about the dungeon
- As a player, talking to the Hooded Stranger lets me ask about specific dungeon mechanics (bosses, traps, secrets) through dialogue choices
- As a player, talking to the Drunk Patron has humorous dialogue branches that occasionally reveal useful hints

### Accessibility and Mobile
- As a player on mobile, I can tap dialogue options directly to select them
- As a player, the dialogue overlay is responsive and readable on small screens
- As a player, text size in the dialogue overlay is larger than the game map text for readability
- As a player, I can scroll through long dialogue text if it exceeds the visible area

## Acceptance Criteria
- [ ] Dialogue overlay opens on NPC interaction, pausing gameplay
- [ ] NPC name, portrait, and dialogue text displayed clearly
- [ ] Typewriter text effect with skip on SPACE/tap
- [ ] 2-4 selectable response options shown after NPC speaks
- [ ] Keyboard (W/S/ENTER, 1-4) and touch/click navigation for responses
- [ ] Response choices branch to different NPC dialogue nodes
- [ ] Dialogue choices can trigger item gifts, quest updates, and disposition changes
- [ ] Already-explored branches are visually marked
- [ ] NPCs remember previous conversations across visits
- [ ] ESC or "Leave" option closes dialogue and resumes gameplay
- [ ] Starting location NPCs retrofitted with full dialogue trees
- [ ] Responsive layout works on mobile screens
- [ ] Combat-adjacent NPCs cannot be talked to (or dialogue is interrupted)

## Technical Notes
- Dialogue trees defined as data structures (nodes + edges) per NPC, not hardcoded logic
- NPC type extended with `dialogueTree` field alongside existing `dialogue` string array for backwards compatibility
- Dialogue state tracked in GameState (activeDialogue: { npcId, currentNode, visitedNodes })
- UI phase management: 'playing' → 'dialogue' → 'playing' (similar to intro/creation phases)
- Typewriter effect uses requestAnimationFrame, not setInterval
- Dialogue data can be defined inline in locations.ts or loaded from separate dialogue definition files

## Dependencies
- Existing NPC system (bump-to-interact, NPC type, locations.ts)
- This feature is a prerequisite for: LLM-powered conversations, persuasion/intimidation, bartering, emotional reactions, and all other 06-dialogue-system stories
