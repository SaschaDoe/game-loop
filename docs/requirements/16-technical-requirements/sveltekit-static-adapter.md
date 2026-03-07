# SvelteKit Static Adapter

As a developer, I want SvelteKit configured with the static adapter, so that the build output is a plain static site compatible with any CDN or static hosting provider.

## Details

- Replace `@sveltejs/adapter-auto` with `@sveltejs/adapter-static`
- Configure `svelte.config.js` with `adapter-static` and `fallback: 'index.html'` for SPA mode
- All routes must be client-side rendered (no `+page.server.ts` or `+server.ts` files)
- Prerender the shell page; all dynamic content rendered in the browser
- Ensure `+layout.ts` exports `prerender = true` and `ssr = false`

## Technical Constraints

- No server-side load functions
- No form actions (use client-side state management instead)
- No server-only modules in route files

## Acceptance Criteria

- [ ] `adapter-static` is installed and configured
- [ ] `npm run build` outputs to a static directory
- [ ] The built site works when served from a plain HTTP server (e.g., `npx serve build`)
- [ ] No SSR-related errors in the build
