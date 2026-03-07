# Serverless Architecture

As a developer, I want the application to be fully serverless with no backend server, so that it can be deployed as a static site with minimal infrastructure cost and zero server maintenance.

## Details

- No traditional backend server; all game logic runs client-side in the browser
- SvelteKit configured with a static adapter for pre-rendered/static output
- LLM calls made directly from the client to the API provider (API key stored in browser localStorage, never on a server)
- Multiplayer features (if implemented) use peer-to-peer WebRTC or a serverless signaling service
- Save data stored in browser IndexedDB/localStorage
- Optional: cloud save sync via a serverless function (Netlify Functions) for cross-device play
- No database required; all state lives in the client

## Technical Constraints

- Build output must be a static site (HTML/CSS/JS)
- No server-side rendering at runtime
- No long-running processes or websocket servers
- All third-party API calls originate from the browser

## Acceptance Criteria

- [ ] `npm run build` produces a fully static output
- [ ] Application runs without any backend server
- [ ] Game is fully playable offline after initial load (except LLM features)
- [ ] No server-side dependencies at runtime
