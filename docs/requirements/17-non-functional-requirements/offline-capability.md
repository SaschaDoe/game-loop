# Offline Capability

As a player, I want to play the game without an internet connection after the first load, so that I can play on planes, subways, or anywhere without Wi-Fi.

## Details

- Service worker caches all static assets on first visit
- Full game playable offline: movement, combat, inventory, quests, exploration
- LLM-powered features gracefully degrade to pre-written fallback dialogue
- Save/load works offline via IndexedDB
- Clear indicator when offline: "Offline mode - NPC conversations limited"
- When connection returns, LLM features resume automatically
- No data loss if the connection drops mid-session

## Non-Functional Targets

- 100% of core gameplay features work offline
- Transition between online/offline is seamless (no reload required)

## Acceptance Criteria

- [ ] Game is fully playable after disconnecting from the internet
- [ ] Fallback dialogue replaces LLM responses when offline
- [ ] Offline indicator is displayed
- [ ] Reconnection restores LLM features without page reload
