# Security

As a player, I want my API keys and game data to be handled securely, so that my sensitive information is not exposed or leaked.

## Details

- API keys stored only in the browser's localStorage (never transmitted to any server except the LLM provider)
- No analytics, tracking, or telemetry without explicit opt-in
- Content Security Policy (CSP) headers configured on Netlify to prevent XSS
- No inline scripts; all JavaScript loaded from trusted sources
- Input sanitization on all user-provided text (character name, custom backstory, chat input)
- No eval() or dynamic code execution
- Dependencies audited regularly with `npm audit`
- No sensitive data in the git repository (`.env` in `.gitignore`)
- HTTPS enforced via Netlify (automatic)

## Non-Functional Targets

- Zero high/critical vulnerabilities in dependencies
- CSP policy blocks all unauthorized script sources
- No data leaves the browser except explicit API calls to configured LLM providers

## Acceptance Criteria

- [ ] API keys never appear in network requests to non-LLM destinations
- [ ] CSP headers are configured and active
- [ ] `npm audit` shows zero high/critical vulnerabilities
- [ ] All user input is sanitized before rendering
