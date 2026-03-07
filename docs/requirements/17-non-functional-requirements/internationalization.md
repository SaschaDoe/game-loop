# Internationalization

As a non-English-speaking player, I want the game UI to be translatable, so that the game can reach a global audience.

## Details

- All UI strings extracted into translation files (JSON format, one per locale)
- Default language: English
- Translation-ready structure: no hardcoded strings in components
- LLM dialogue stays in the player's configured language (system prompt instructs the model)
- Right-to-left (RTL) language support for the UI layout
- Date and number formatting respects locale
- Language selection in settings; persists across sessions
- Community contribution: translation files can be submitted via GitHub

## Non-Functional Targets

- 100% of UI strings are in translation files (no hardcoded text)
- Adding a new language requires only a new JSON file, no code changes

## Acceptance Criteria

- [ ] All UI text comes from translation files
- [ ] Switching language updates all visible text
- [ ] LLM responses match the selected language
- [ ] RTL layout renders correctly for RTL languages
