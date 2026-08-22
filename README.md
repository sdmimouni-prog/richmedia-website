# richmedia.ma — squelette Astro (contenu-as-code, SEO/GEO)

Stack : **Astro 5** (Content Layer) + **MDX** + **Tailwind v4** + **sitemap**.
Pas de CMS : le contenu vit dans `src/content/**.mdx` et s'édite via prompt sur Codex.

## Démarrer
```bash
npm install
npm run dev            # environnement dev : http://localhost:4321
npm run env:check      # vérifie les variables dev + prod locales
npm run prod           # build production vers dist/
npm run prod:preview   # build + preview prod locale : http://localhost:4322
npm run preview        # preview prod sur http://localhost:4321 si le dev est arrêté
npm run check          # vérifie les types + le frontmatter
npm run verify         # check + build, à lancer avant livraison
```

Le port `4321` est réservé au développement local. La preview production utilise `4322`
pour pouvoir comparer dev/prod en parallèle sans couper le serveur Astro actif.

## Environnements
Les variables locales sont dans `.env.development` et `.env.production` :

```bash
ASTRO_HOST=127.0.0.1
ASTRO_PORT=4321                            # dev
ASTRO_PORT=4322                            # preview prod locale
PUBLIC_SITE_URL=http://localhost:4321        # dev
PUBLIC_OG_IMAGE_URL=http://localhost:4321/og-default.jpg
PUBLIC_SITE_URL=https://richmedia.ma         # prod
PUBLIC_OG_IMAGE_URL=https://richmedia.ma/og-default.jpg
```

`PUBLIC_SITE_URL` alimente les URLs canoniques, le sitemap et le JSON-LD. `ASTRO_HOST`
et `ASTRO_PORT` pilotent `astro dev` et `astro preview`.

Pour les formulaires et tags marketing, garder en local :

```bash
CONTACT_TO_EMAIL=sd.mimouni@richmedia.ma
CONTACT_FROM_EMAIL="Richmedia <noreply@richmedia.ma>"
RESEND_API_KEY=
CONTACT_LEADS_FILE=
PUBLIC_GTM_ID=
PUBLIC_GA4_ID=
PUBLIC_META_PIXEL_ID=
PUBLIC_LINKEDIN_PARTNER_ID=
```

En production Vercel, ces valeurs doivent être ajoutées dans les variables
d'environnement du projet, car `.env.*` est volontairement exclu du déploiement.
Le projet contient aussi un script de synchronisation qui pousse les valeurs locales
vers Vercel sans afficher les secrets :

```bash
npm run env:sync:vercel        # development + preview + production
npm run env:sync:vercel:prod   # production uniquement
npm exec vercel -- env add RESEND_API_KEY production --sensitive
```

`npm run env:check:prod` reste strict : il échoue tant que `RESEND_API_KEY` est vide,
car le formulaire de contact serveur en dépend.

Sur le VPS, le workflow GitHub Actions déploie aussi `/api/contact` comme service Node
`richmedia-contact-api.service`, proxifié par Nginx sur `location = /api/contact`.
La clé `RESEND_API_KEY` doit être ajoutée dans les secrets GitHub pour envoyer les leads
par email. Si elle est absente, le service reste actif et enregistre les demandes dans
`$VPS_WEBROOT/shared/contact-leads.ndjson` afin de ne pas perdre les conversions.

```bash
npm run contact:check              # vérifie que /api/contact ne redirige plus
npm run contact:check -- --send-smoke # envoie une soumission test
```

## Production
```bash
npm run vercel:pull      # récupère les settings + env preview Vercel
npm run vercel:build     # simule le build Vercel localement
npm run vercel:build:prod # simule le build Vercel production
npm run deploy:preview   # déploie une preview Vercel
npm run deploy:prod      # déploie richmedia.ma en production
```

Le projet est déjà relié à Vercel via `.vercel/project.json`; `vercel.json` déclare
Astro, le dossier `dist/` et les redirections historiques. Le projet Vercel distant
utilise Node `24.x`; la contrainte Astro locale accepte Node `>=22.12.0 <27`.

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
