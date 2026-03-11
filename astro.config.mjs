// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	integrations: [mdx(), sitemap()],
	image: {
		domains: ['pub-f961630767af4c0ea45eb8ae6ca8cc3a.r2.dev'],
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
