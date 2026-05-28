// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { VitePWA } from 'vite-plugin-pwa';

// https://astro.build/config
export default defineConfig({
	site: 'https://jeielmiranda.com.br',
	integrations: [mdx(), sitemap()],
	vite: {
		plugins: [
			VitePWA({
				registerType: 'autoUpdate',
				manifest: {
					name: 'Jeiel Miranda | JG',
					short_name: 'JG',
					description: 'Blog pessoal de Jeiel Miranda sobre tecnologia, programação e segurança digital.',
					theme_color: '#2337ff',
					background_color: '#ffffff',
					display: 'standalone',
					start_url: '/',
					icons: [
						{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
						{ src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
					],
				},
				workbox: {
					globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,gif,webp,woff,woff2,ico}'],
				},
			}),
		],
	},
});
