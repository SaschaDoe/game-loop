import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { readFileSync } from 'fs';
import { execSync } from 'child_process';

const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));
let buildNumber = 'dev';
try {
	buildNumber = execSync('git rev-list --count HEAD', { encoding: 'utf-8' }).trim();
} catch {
	// not in a git repo or git not available
}

export default defineConfig({
	plugins: [sveltekit()],
	define: {
		__APP_VERSION__: JSON.stringify(pkg.version),
		__BUILD_NUMBER__: JSON.stringify(buildNumber)
	},
	test: {
		include: ['src/**/*.test.ts']
	}
});
