# Testing Strategy

As a developer, I want a comprehensive testing strategy covering unit, integration, and end-to-end tests, so that changes don't break existing functionality.

## Details

- **Unit tests** (Vitest): game engine logic, map generation, combat calculations, state management
- **Component tests** (Vitest + Testing Library): Svelte component rendering, user interaction
- **End-to-end tests** (Playwright): full gameplay flows, character creation, combat, dialogue
- **Visual regression tests**: ASCII map rendering consistency
- Test coverage target: 80% for game engine logic, 60% overall
- Tests run in CI on every pull request (GitHub Actions or Netlify build)
- Test data fixtures for reproducible game states (seeded random)

## Technical Constraints

- Tests must run headlessly in CI
- E2E tests must complete within 5 minutes
- No flaky tests: use deterministic seeds for random-dependent tests

## Acceptance Criteria

- [ ] Unit tests cover core game engine functions
- [ ] Component tests verify UI rendering
- [ ] E2E tests cover critical gameplay paths
- [ ] CI runs all tests on every PR
