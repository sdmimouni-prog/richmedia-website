import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const modeFlagIndex = process.argv.indexOf('--mode');
const modeFlag = process.argv.find((arg) => arg.startsWith('--mode='));
const modeFromFlag = modeFlagIndex >= 0 ? process.argv[modeFlagIndex + 1] : modeFlag?.split('=')[1];
const mode = modeFromFlag || (process.argv.includes('build') || process.argv.includes('preview') ? 'production' : 'development');
const fileEnv = loadEnv(mode, process.cwd(), '');
Object.entries(fileEnv).forEach(([key, value]) => {
  if (process.env[key] === undefined) {
    process.env[key] = value;
  }
});

const env = (key, fallback) => process.env[key] ?? fileEnv[key] ?? fallback;
const site = env('PUBLIC_SITE_URL', 'https://www.richmedia.ma');
const host = env('ASTRO_HOST', '127.0.0.1');
const parsedPort = Number.parseInt(env('ASTRO_PORT', '4321'), 10);
const port = Number.isFinite(parsedPort) ? parsedPort : 4321;
const contactApiUrl = new URL('./api/contact.js', import.meta.url);
const redirectedEnglishInsightSlugs = [
  'creators-brands-durable-collaborations',
  'crm-automation-marketing-sales-alignment',
  'data-for-decisions-performance-strategy',
  'digital-acquisition-plan-2026',
  'digital-priorities-2026-profitable-growth',
  'employer-brand-digital-attractiveness',
  'google-ads-campaign-cost-morocco',
  'how-much-does-an-influencer-cost-in-morocco',
  'cost-per-lead-morocco-industry-benchmarks',
  'meta-campaigns-2026-best-practices',
  'quality-content-durable-seo',
  'seo-vs-geo-2026',
  'whatsapp-business-conversion-channel',
];
const redirectedEnglishInsightUrls = new Set(
  redirectedEnglishInsightSlugs.map((slug) => `${site}/insights/${slug}/`)
);
const collectionRouteTranslations = {
  expertises: {
    'media-performance': 'media-performance',
    'referencement-seo': 'seo-geo',
  },
  secteurs: {
    automobile: 'automotive',
    education: 'education',
    fmcg: 'fmcg',
    gms: 'grocery-retail',
    immobilier: 'real-estate',
    institutionnel: 'institutional',
    'retail-ecommerce': 'retail-ecommerce',
    'tourisme-hotellerie': 'tourism-hospitality',
  },
  cas: {
    'uir-campagnes-digitales': 'uir-digital-campaigns',
  },
};

const stripYamlQuotes = (value) => value.replace(/^["']|["']$/g, '');
const readFrontmatter = (filePath) => {
  const source = readFileSync(filePath, 'utf8');
  const match = source.match(/^---\s*\n([\s\S]*?)\n---/);
  return match?.[1] ?? '';
};
const readFrontmatterValue = (frontmatter, key) => {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, 'm'));
  return match ? stripYamlQuotes(match[1].trim()) : undefined;
};
const listMdxFiles = (dir) => {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(dir, entry.name);
    if (entry.isDirectory()) return listMdxFiles(entryPath);
    return entry.isFile() && entry.name.endsWith('.mdx') ? [entryPath] : [];
  });
};
const toSitemapLastmod = (value) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date.toISOString() : undefined;
};
const toAbsoluteUrl = (pathname) => new URL(pathname, site).toString();
const addLastmodUrl = (map, pathname, lastmod) => {
  if (!lastmod) return;
  const url = toAbsoluteUrl(pathname);
  map.set(url, lastmod);
  map.set(url.endsWith('/') ? url.slice(0, -1) : `${url}/`, lastmod);
};
const getCollectionLastmodMap = () => {
  const map = new Map();
  const contentRoot = join(process.cwd(), 'src/content');
  const addCollection = (collection, routeForEntry) => {
    for (const filePath of listMdxFiles(join(contentRoot, collection))) {
      const frontmatter = readFrontmatter(filePath);
      if (readFrontmatterValue(frontmatter, 'draft') === 'true') continue;

      const fileSlug = filePath.split('/').pop()?.replace(/\.mdx$/, '');
      const slug = readFrontmatterValue(frontmatter, 'slug') ?? fileSlug;
      const lastmod = toSitemapLastmod(readFrontmatterValue(frontmatter, 'dateModification'));
      if (!slug || !lastmod) continue;

      const routes = routeForEntry(slug, frontmatter);
      routes.forEach((route) => addLastmodUrl(map, route, lastmod));
    }
  };

  addCollection('articles', (slug, frontmatter) => [
    `${readFrontmatterValue(frontmatter, 'lang') === 'en' ? '/en' : ''}/insights/${slug}/`,
  ]);
  addCollection('expertises', (slug) => [
    `/expertises/${slug}/`,
    ...(collectionRouteTranslations.expertises[slug] ? [`/en/expertises/${collectionRouteTranslations.expertises[slug]}/`] : []),
  ]);
  addCollection('secteurs', (slug) => [
    `/secteurs/${slug}/`,
    ...(collectionRouteTranslations.secteurs[slug] ? [`/en/sectors/${collectionRouteTranslations.secteurs[slug]}/`] : []),
  ]);
  addCollection('cas', (slug) => [
    `/realisations/${slug}/`,
    ...(collectionRouteTranslations.cas[slug] ? [`/en/case-studies/${collectionRouteTranslations.cas[slug]}/`] : []),
  ]);

  return map;
};
const collectionLastmodByUrl = getCollectionLastmodMap();
const staticLastmod = '2026-08-23T00:00:00.000Z';
const staticLastmodRoutes = [
  '/outils/',
  '/outils/calculateur-budget-media-leads/',
  '/outils/estimateur-campagne-whatsapp/',
  '/outils/template-plan-media-digital/',
  '/outils/template-dashboard-kpi-marketing/',
  '/outils/template-brief-campagne-digitale/',
  '/realisations/uir-campagne-acquisition-2023-2024/',
  '/realisations/chergui-packaging-2021/',
  '/insights/barometre-marketing-digital-maroc-2026/',
  '/expertises/google-ads-maroc/',
  '/expertises/meta-ads-maroc/',
  '/expertises/generation-leads-maroc/',
  '/expertises/social-media-maroc/',
  '/expertises/tiktok-ads-maroc/',
  '/expertises/whatsapp-marketing-maroc/',
  '/expertises/marketing-automation-crm-maroc/',
  '/expertises/influence-marketing-maroc/',
  '/expertises/social-listening-maroc/',
  '/expertises/geofencing-drive-to-store-maroc/',
  '/agence-ia-maroc/',
  '/agence-seo-maroc/',
  '/publicite-en-ligne-maroc/',
  '/creation-site-web-maroc/',
  '/en/tools/',
  '/en/tools/media-budget-leads-calculator/',
  '/en/tools/whatsapp-campaign-estimator/',
  '/en/tools/digital-media-plan-template/',
  '/en/tools/marketing-kpi-dashboard-template/',
  '/en/tools/digital-campaign-brief-template/',
  '/en/case-studies/uir-acquisition-campaign-2023-2024/',
  '/en/case-studies/chergui-packaging-2021/',
  '/en/insights/morocco-digital-marketing-barometer-2026/',
  '/en/expertises/google-ads-morocco/',
  '/en/expertises/meta-ads-morocco/',
  '/en/expertises/lead-generation-morocco/',
  '/en/expertises/social-media-morocco/',
  '/en/expertises/tiktok-ads-morocco/',
  '/en/expertises/whatsapp-marketing-morocco/',
  '/en/expertises/crm-marketing-automation-morocco/',
  '/en/expertises/influencer-marketing-morocco/',
  '/en/expertises/social-listening-morocco/',
  '/en/expertises/geofencing-drive-to-store-morocco/',
  '/en/ai-agency-morocco/',
  '/seo-agency-morocco/',
  '/online-advertising-morocco/',
  '/website-development-morocco/',
];
const staticLastmodByUrl = new Map(
  staticLastmodRoutes.flatMap((route) => {
    const cleanRoute = route.endsWith('/') ? route.slice(0, -1) : route;
    return [
      [toAbsoluteUrl(route), staticLastmod],
      [toAbsoluteUrl(cleanRoute || '/'), staticLastmod],
    ];
  })
);

const contactApiDevPlugin = () => ({
  name: 'richmedia-contact-api-dev',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const pathname = req.url?.split('?')[0] || '';
      if (pathname !== '/api/contact') {
        next();
        return;
      }

      try {
        const { default: handler } = await import(`${contactApiUrl.href}?t=${Date.now()}`);
        await handler(req, res);
      } catch (error) {
        server.ssrFixStacktrace(error);
        next(error);
      }
    });
  },
});

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
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !redirectedEnglishInsightUrls.has(page),
      serialize: (item) => ({
        ...item,
        lastmod: collectionLastmodByUrl.get(item.url) ?? staticLastmodByUrl.get(item.url) ?? item.lastmod,
      }),
    }),
  ],
  vite: { plugins: [tailwindcss(), contactApiDevPlugin()] },
});
