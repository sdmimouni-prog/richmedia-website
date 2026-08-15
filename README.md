# richmedia.ma — squelette Astro (contenu-as-code, SEO/GEO)

Stack : **Astro 5** (Content Layer) + **MDX** + **Tailwind v4** + **sitemap**.
Pas de CMS : le contenu vit dans `src/content/**.mdx` et s'édite via prompt sur Codex.

## Démarrer
```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # génère du HTML statique (idéal SEO/GEO)
npm run check      # vérifie les types + le frontmatter
```

## Arborescence
```
src/
  content.config.ts      # Schémas typés (Zod) : le contrat de chaque type de contenu
  consts.ts              # NAP, accréditations, tagline (source unique de vérité)
  lib/schema.ts          # Builders JSON-LD (LocalBusiness, Service, Article, FAQ, Breadcrumb)
  components/            # JsonLd, Seo, QuickAnswer, Faq, Header (méga-menu), Footer
  layouts/BaseLayout.astro
  pages/                 # Routes (les [...slug] se génèrent depuis les collections)
  content/
    expertises/          # piliers + clusters (type: pilier|cluster, parent: <pilier>)
    cas/                 # 1 fichier = 1 étude de cas
    secteurs/            # longue traîne verticale
    articles/            # blog / ressources
public/
  robots.txt             # autorise les bots IA (on VEUT être cité)
  llms.txt               # routage agentique
```

## Le contrat de contenu (frontmatter)
Tout fichier de contenu partage le socle SEO/GEO défini dans `content.config.ts` :
`title`, `metaDescription`, `keywordPrincipal` (1 seul par page — anti-cannibalisation),
`intention`, `quickAnswer` (bloc réponse-d'abord pour l'IA), `dateModification`, `faq`, etc.
Chaque collection ajoute ses champs propres (ex : `type` + `parent` pour les expertises).

Si un champ requis manque, `npm run check` échoue : le schéma protège la qualité SEO.

## Ajouter du contenu via Codex — prompts types

**Nouveau cluster d'expertise :**
> Crée `src/content/expertises/community-management.mdx`. Respecte le schéma `expertises`
> de `content.config.ts` : `type: cluster`, `parent: social-media`, `keywordPrincipal:
> "community management Maroc"`, `intention: transactionnelle`. Rédige un `quickAnswer`
> qui ouvre par une phrase définitionnelle, 4 `services`, 3 entrées de `faq` calquées
> sur des questions réelles, et un corps MDX structuré problème → approche → preuve → CTA.

**Nouveau cas client :**
> Crée `src/content/cas/amana-tramway-casablanca.mdx` selon le schéma `cas` :
> `client: "Amana"`, `secteur: agroalimentaire`, `expertises: [strategie-branding]`,
> des `kpis` chiffrés attribués, et un corps contexte → objectifs → dispositif → résultats.

**Nouvel article de blog :**
> Crée un article `articles` ciblant "budget community management Maroc",
> `categorie: Social`, `expertiseLiee: community-management`, avec des statistiques
> sourcées et un CTA vers la page expertise.

## Rappels SEO/GEO câblés dans le squelette
- HTML 100 % statique (les chiffres sont dans le HTML, jamais injectés en JS).
- JSON-LD empilé par page (Organization + Service/Article + FAQPage + Breadcrumb).
- `quickAnswer` en tête de page = réponse extractible par les moteurs IA.
- Densité factuelle : mettez toujours vos chiffres clients **attribués** dans le corps.
- Fraîcheur : tenez `dateModification` à jour (impacte SEO et citation IA).
- Reste à faire côté produit : og-image par défaut, miroir EN sous `/pages/en/`,
  Google Business Profile, et présence hors-site (le GEO est un sport d'équipe).
