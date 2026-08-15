import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Domaine de production — sert au sitemap, aux URLs canoniques et au JSON-LD.
export default defineConfig({
  site: 'https://richmedia.ma',
  // FR par défaut (marché marocain), EN en miroir sous /en/. Pas de préfixe pour le FR.
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [mdx(), sitemap()],
  vite: { plugins: [tailwindcss()] },
});
