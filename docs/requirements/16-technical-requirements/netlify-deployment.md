# Netlify Deployment

As a developer, I want the application deployed to Netlify with continuous deployment from the main branch, so that every merge automatically publishes the latest version.

## Details

- SvelteKit configured with `@sveltejs/adapter-static` for Netlify compatibility
- `netlify.toml` configuration file in the repo root with build settings
- Build command: `cd ascii-rpg && npm install && npm run build`
- Publish directory: `ascii-rpg/build`
- Automatic deploys triggered on push to `main`
- Deploy previews for pull requests
- Custom headers for caching: static assets cached aggressively, HTML never cached
- Redirects configured for SPA fallback (`/* /index.html 200`)
- Environment variables for any API keys managed via Netlify dashboard (not committed)
- Netlify Functions available for optional serverless endpoints (cloud save, leaderboards)

## Technical Constraints

- Build must complete within Netlify's 15-minute build timeout
- Bundle size should stay under 5 MB for fast deploys and loads
- No server-side rendering; static adapter only

## Acceptance Criteria

- [ ] `netlify.toml` is present and correctly configured
- [ ] SvelteKit uses `adapter-static`
- [ ] Pushes to `main` trigger automatic deployment
- [ ] Deploy previews work for pull requests
- [ ] Site is accessible at the Netlify URL after deploy
