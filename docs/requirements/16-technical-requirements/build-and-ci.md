# Build and CI Pipeline

As a developer, I want an automated CI pipeline that builds, tests, and deploys the application, so that quality is enforced and deployment is hands-free.

## Details

- GitHub Actions workflow triggered on push and pull request
- Pipeline steps: install dependencies, lint, type-check, unit tests, build, E2E tests
- Lint: ESLint + Prettier for code consistency
- Type-check: `svelte-check` for TypeScript errors
- Build must succeed with zero warnings treated as errors
- Deploy to Netlify on successful main branch build
- PR preview deploys via Netlify deploy previews
- Build cache for `node_modules` to speed up CI

## Technical Constraints

- CI must complete within 10 minutes
- Node.js LTS version (20.x or latest LTS)
- npm as the package manager (consistent with existing setup)

## Acceptance Criteria

- [ ] CI pipeline runs on every push and PR
- [ ] Lint, type-check, tests, and build all pass before deploy
- [ ] Netlify deploy triggers automatically on main branch
- [ ] PR deploy previews are accessible
