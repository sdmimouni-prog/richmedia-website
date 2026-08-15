import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Frontmatter SEO / GEO partagé par toutes les pages de contenu.
 * Chaque champ sert un objectif précis de référencement ou de citation IA.
 */
const seo = z.object({
  // — Balises —
  title: z.string(),                          // <h1> de la page
  metaTitle: z.string().optional(),           // <title> (fallback: title)
  metaDescription: z.string().max(160),       // meta description
  slug: z.string().optional(),                // override d'URL (sinon = nom de fichier)

  // — Ciblage SEO (1 mot-clé principal par page, règle anti-cannibalisation) —
  keywordPrincipal: z.string(),
  keywordsSecondaires: z.array(z.string()).default([]),
  intention: z.enum(['commerciale', 'transactionnelle', 'informationnelle', 'navigationnelle']),

  // — GEO : bloc « réponse d'abord » (les 150-200 premiers tokens pèsent le plus) —
  quickAnswer: z.string(),

  // — Fraîcheur (signal fort pour SEO et citation IA) —
  datePublication: z.coerce.date(),
  dateModification: z.coerce.date(),

  // — i18n / états —
  lang: z.enum(['fr', 'en']).default('fr'),
  draft: z.boolean().default(false),

  // — Social —
  ogImage: z.string().optional(),

  // — GEO : FAQ extractible (alimente FAQPage + featured snippets) —
  faq: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
});

/** EXPERTISES — piliers (terme large) + clusters (requête d'achat précise). */
const expertises = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/expertises' }),
  schema: ({ image }) =>
    seo.extend({
      type: z.enum(['pilier', 'cluster']),
      parent: reference('expertises').optional(), // un cluster pointe vers son pilier
      ordre: z.number().default(0),
      accroche: z.string(),
      services: z.array(z.string()).default([]),
      casLies: z.array(reference('cas')).default([]),
      heroImage: image().optional(),
    }),
});

/** RÉALISATIONS — 1 page par cas client, structurée contexte → dispositif → résultats. */
const cas = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/cas' }),
  schema: ({ image }) =>
    seo.extend({
      client: z.string(),
      secteur: reference('secteurs').optional(),
      expertises: z.array(reference('expertises')).default([]),
      resume: z.string(),
      kpis: z.array(z.object({ valeur: z.string(), libelle: z.string() })).default([]),
      couverture: image().optional(),
    }),
});

/** SECTEURS — longue traîne verticale (éducation, retail, banque…). */
const secteurs = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/secteurs' }),
  schema: seo.extend({
    clients: z.array(z.string()).default([]),
  }),
});

/** RESSOURCES — blog informationnel qui alimente les piliers. */
const articles = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/articles' }),
  schema: ({ image }) =>
    seo.extend({
      categorie: z.enum(['SEO', 'Media', 'Social', 'Growth', 'Secteur']),
      auteur: z.string().default('Richmedia'),
      expertiseLiee: reference('expertises').optional(), // article -> page commerciale
      tempsLecture: z.number().optional(),
      couverture: image().optional(),
    }),
});

export const collections = { expertises, cas, secteurs, articles };
