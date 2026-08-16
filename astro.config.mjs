import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';

const modeFlagIndex = process.argv.indexOf('--mode');
const modeFlag = process.argv.find((arg) => arg.startsWith('--mode='));
const modeFromFlag = modeFlagIndex >= 0 ? process.argv[modeFlagIndex + 1] : modeFlag?.split('=')[1];
const mode = modeFromFlag || (process.argv.includes('build') || process.argv.includes('preview') ? 'production' : 'development');
const env = loadEnv(mode, process.cwd(), '');
const site = env.PUBLIC_SITE_URL || 'https://richmedia.ma';
const host = env.ASTRO_HOST || '127.0.0.1';
const parsedPort = Number.parseInt(env.ASTRO_PORT || '4321', 10);
const port = Number.isFinite(parsedPort) ? parsedPort : 4321;

// Domaine actif — sert au sitemap, aux URLs canoniques et au JSON-LD.
export default defineConfig({
  site,
  devToolbar: { enabled: false },
  server: { host, port },
  // FR par défaut (marché marocain), EN en miroir sous /en/. Pas de préfixe pour le FR.
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [mdx(), sitemap()],
  vite: { plugins: [tailwindcss()] },
});
