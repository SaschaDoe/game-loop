# LLM API Integration

As a developer, I want a clean abstraction layer for LLM API calls from the client, so that NPC dialogue works seamlessly and the provider can be swapped without rewriting game logic.

## Details

- LLM provider abstraction: support Anthropic Claude, OpenAI, and local/self-hosted models
- API key stored in browser localStorage; entered by the player in settings
- Request/response caching: identical prompts return cached responses (IndexedDB cache)
- Rate limiting on the client side to prevent excessive API costs
- Streaming responses for real-time dialogue display (typewriter effect)
- Graceful fallback to pre-written dialogue when no API key is configured or API is unreachable
- Context window management: trim older conversation history to stay within token limits
- Cost estimation display: show approximate token usage per conversation

## Technical Constraints

- API calls made directly from the browser (CORS must be supported by the provider)
- No proxy server; all requests are client-to-API
- API keys never leave the client device
- Must handle network errors, timeouts, and rate limits gracefully

## Acceptance Criteria

- [ ] LLM calls work from the browser with a configured API key
- [ ] Response caching prevents duplicate API calls
- [ ] Fallback dialogue works without an API key
- [ ] Provider can be switched in settings without code changes
