import type { SiloLink } from './seo-silos';

export type ServiceLanding = {
  slug: string;
  keywordPrincipal: string;
  keywordsSecondaires: readonly string[];
  title: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  intro: string;
  heroImage: string;
  heroAlt: string;
  parent: SiloLink;
  proof: readonly { value: string; label: string }[];
  problems: readonly string[];
  services: readonly { title: string; text: string; items: readonly string[] }[];
  methodology: readonly { step: string; title: string; text: string }[];
  useCases: readonly SiloLink[];
  kpis: readonly { label: string; text: string }[];
  caseStudy?: {
    title: string;
    text: string;
    href: string;
    label: string;
  };
  relatedInsights: readonly SiloLink[];
  relatedSectors: readonly SiloLink[];
  relatedServices: readonly SiloLink[];
  faq: readonly { question: string; answer: string }[];
};

export const serviceLandings = [
  {
    slug: 'google-ads-maroc',
    keywordPrincipal: 'agence google ads maroc',
    keywordsSecondaires: ['google ads maroc', 'agence adwords maroc', 'agence sea maroc', 'campagne google ads maroc'],
    title: 'Google Ads Maroc',
    metaTitle: 'Agence Google Ads au Maroc | Richmedia',
    metaDescription: 'Pilotez vos campagnes Google Ads au Maroc avec stratégie, tracking, landing pages, optimisation CPL/CPA et reporting Richmedia.',
    eyebrow: 'Search, PMax & acquisition',
    h1: 'Agence Google Ads au Maroc, orientée performance.',
    intro:
      "Richmedia structure Google Ads comme un canal d'acquisition complet : intentions de recherche, mots-clés, annonces, landing pages, GA4, tracking, CRM et optimisation. L'objectif n'est pas seulement d'acheter des clics, mais de transformer les recherches utiles en demandes qualifiées.",
    heroImage: '/assets/richmedia-achat-media/achat-media-hero.webp',
    heroAlt: 'Pilotage de campagnes Google Ads au Maroc avec dashboards et optimisation média',
    parent: { href: '/expertises/media-performance', label: 'Média & performance', text: 'Page pilier acquisition, paid media, tracking et ROI.' },
    proof: [
      { value: 'Search', label: 'Intentions actives' },
      { value: 'PMax', label: 'Structure et garde-fous' },
      { value: 'GA4', label: 'Conversions suivies' },
      { value: 'CRM', label: 'Qualité des leads' },
    ],
    problems: [
      'Budget dépensé sans leads exploitables.',
      'CPC élevé sur des mots-clés trop larges.',
      'Performance Max lancée sans signaux ni exclusions.',
      'Tracking incomplet entre formulaire, WhatsApp et CRM.',
      'Landing page trop lente ou trop générale pour convertir.',
    ],
    services: [
      {
        title: 'Search Ads',
        text: "Structure mots-clés, groupes d'annonces, exclusions, extensions et messages alignés sur l'intention.",
        items: ['Mots-clés', 'Annonces', 'Exclusions', 'Extensions'],
      },
      {
        title: 'Performance Max & YouTube',
        text: 'Flux, assets, audiences, signaux, vidéos et garde-fous pour éviter les campagnes opaques.',
        items: ['PMax', 'YouTube', 'Assets', 'Audiences'],
      },
      {
        title: 'Tracking & landing pages',
        text: 'GA4, GTM, conversions, UTMs, formulaires, WhatsApp et pages pensées pour la demande.',
        items: ['GA4', 'GTM', 'UTM', 'Landing pages'],
      },
      {
        title: 'Optimisation business',
        text: 'Lecture CPC, CPL, CPA, taux de conversion, ROAS et qualité commerciale des prospects.',
        items: ['CPC', 'CPL', 'CPA', 'ROAS'],
      },
    ],
    methodology: [
      { step: '01', title: 'Audit', text: 'Compte, historique, mots-clés, tracking, pages, concurrence et qualité des conversions.' },
      { step: '02', title: 'Structure', text: 'Séparation des intentions, campagnes, audiences, exclusions, assets et objectifs.' },
      { step: '03', title: 'Activation', text: 'Lancement contrôlé, QA tracking, budget pacing et premières lectures de recherche.' },
      { step: '04', title: 'Optimisation', text: 'Arbitrage mots-clés, enchères, annonces, pages, requêtes et signaux CRM.' },
      { step: '05', title: 'Reporting', text: 'Tableau de bord clair : dépense, conversion, coût, qualité, décision suivante.' },
    ],
    useCases: [
      { href: '/secteurs/education', label: 'Éducation', text: 'Admissions, programmes, concours et demandes d’information.' },
      { href: '/secteurs/immobilier', label: 'Immobilier', text: 'Requêtes projet, budget, ville, typologie et rendez-vous.' },
      { href: '/secteurs/automobile', label: 'Automobile', text: 'Essais, offres, concessions, pièces et services.' },
    ],
    kpis: [
      { label: 'CTR', text: 'Qualité annonce/intention.' },
      { label: 'CPC', text: 'Coût du trafic utile.' },
      { label: 'CPL / CPA', text: 'Coût de la demande ou action.' },
      { label: 'ROAS', text: 'Valeur attribuée aux dépenses.' },
    ],
    caseStudy: {
      title: 'UIR : acquisition reliée à un dispositif long terme',
      text: "Le cas UIR illustre une logique où notoriété, acquisition, contenus, tracking et optimisation servent les temps forts d'admission. Ce n'est pas un benchmark de coût, mais une preuve de méthode.",
      href: '/realisations/uir-campagnes-digitales',
      label: 'Voir le cas UIR',
    },
    relatedInsights: [
      { href: '/insights/cout-campagne-google-ads-maroc', label: 'Combien coûte une campagne Google Ads au Maroc ?', text: 'Budget, enchères, tracking et variables de coût.' },
      { href: '/insights/data-decision-strategie-performance', label: 'Data & performance', text: 'Transformer la mesure en décisions.' },
      { href: '/insights/plan-acquisition-digital-2026', label: 'Plan d’acquisition digital 2026', text: 'Construire le dispositif complet.' },
    ],
    relatedSectors: [
      { href: '/secteurs/education', label: 'Éducation' },
      { href: '/secteurs/immobilier', label: 'Immobilier' },
      { href: '/secteurs/automobile', label: 'Automobile' },
    ],
    relatedServices: [
      { href: '/expertises/media-performance', label: 'Média & performance' },
      { href: '/expertises/generation-leads-maroc', label: 'Génération de leads' },
      { href: '/expertises/referencement-seo', label: 'SEO / GEO' },
    ],
    faq: [
      { question: 'Quel budget prévoir pour Google Ads au Maroc ?', answer: "Le budget dépend du secteur, de la zone, de l'intention, de la concurrence, de la page et de la valeur commerciale du lead. Richmedia distingue toujours budget média, honoraires et coûts de production éventuels." },
      { question: 'Google Ads ou Meta Ads : que choisir ?', answer: "Google Ads capte une intention active. Meta Ads crée et relance la demande. Le bon choix dépend de votre offre, du cycle de décision, du volume recherché et de la capacité commerciale à traiter les demandes." },
      { question: 'Comment mesurez-vous les conversions ?', answer: "Nous relions les conversions utiles à GA4, GTM, UTMs, formulaires, WhatsApp et CRM. Le suivi doit distinguer clic, lead brut, lead qualifié, rendez-vous et vente quand la donnée commerciale existe." },
    ],
  },
  {
    slug: 'meta-ads-maroc',
    keywordPrincipal: 'agence meta ads maroc',
    keywordsSecondaires: ['facebook ads maroc', 'instagram ads maroc', 'publicité meta maroc'],
    title: 'Meta Ads Maroc',
    metaTitle: 'Agence Meta Ads au Maroc | Richmedia',
    metaDescription: 'Structurez Facebook Ads et Instagram Ads avec créas, audiences, Pixel, CAPI, retargeting, CRM et optimisation Richmedia.',
    eyebrow: 'Facebook, Instagram & conversion',
    h1: 'Agence Meta Ads au Maroc pour générer une demande plus qualifiée.',
    intro:
      "Meta Ads fonctionne quand le média, la création et le suivi commercial avancent ensemble. Richmedia conçoit des campagnes Facebook et Instagram qui testent les angles, fiabilisent les événements, relient les leads au CRM et optimisent la qualité plutôt que le volume brut.",
    heroImage: '/assets/richmedia-achat-media/media-creative-tests.webp',
    heroAlt: 'Tests créatifs Meta Ads et lecture de performance publicitaire',
    parent: { href: '/expertises/media-performance', label: 'Média & performance' },
    proof: [
      { value: 'Créa', label: 'Angles et hooks testés' },
      { value: 'Pixel', label: 'Événements fiabilisés' },
      { value: 'CAPI', label: 'Signal renforcé' },
      { value: 'CRM', label: 'Qualité vérifiée' },
    ],
    problems: [
      'Leads nombreux mais faibles ou injoignables.',
      'Créatifs répétés sans apprentissage clair.',
      'Retargeting générique qui fatigue les audiences.',
      'Pixel et Conversions API mal configurés.',
      'Optimisation centrée sur le CPL brut plutôt que la qualité.',
    ],
    services: [
      { title: 'Facebook & Instagram Ads', text: 'Campagnes acquisition, trafic, conversion, lead ads, messages et retargeting.', items: ['Lead Ads', 'Reels', 'Stories', 'Conversion'] },
      { title: 'Créatifs social-first', text: 'Hooks, formats courts, UGC, carrousels, preuves et variations par intention.', items: ['Hooks', 'UGC', 'Carrousel', 'Vidéo'] },
      { title: 'Donnée & audiences', text: 'Pixel, CAPI, UTMs, audiences first-party, exclusions, retargeting et lookalikes quand pertinent.', items: ['Pixel', 'CAPI', 'UTM', 'Audiences'] },
      { title: 'Optimisation qualité', text: 'Lecture par CPL qualifié, contact établi, rendez-vous, vente ou étape commerciale.', items: ['CPL', 'CPA', 'ROAS', 'Sales feedback'] },
    ],
    methodology: [
      { step: '01', title: 'Cadrage', text: 'Offre, audience, messages, preuves, formats et objectifs de conversion.' },
      { step: '02', title: 'Plan créatif', text: 'Angles, hooks, formats, UGC, séquences et tests par phase du funnel.' },
      { step: '03', title: 'Tracking', text: 'Pixel, CAPI, UTMs, événements, formulaire, WhatsApp et CRM.' },
      { step: '04', title: 'Lancement', text: 'Structure simple, budget pacing, audiences propres et QA des événements.' },
      { step: '05', title: 'Arbitrage', text: 'Créatifs gagnants, qualité des leads, retargeting, exclusions et reporting.' },
    ],
    useCases: [
      { href: '/secteurs/retail-ecommerce', label: 'Retail & e-commerce', text: 'Offres, catalogues, social commerce et trafic magasin.' },
      { href: '/secteurs/education', label: 'Éducation', text: 'Admissions, portes ouvertes, programmes et relances.' },
      { href: '/secteurs/immobilier', label: 'Immobilier', text: 'Lancements, visites, typologies et prospects chauds.' },
    ],
    kpis: [
      { label: 'CPM', text: 'Coût de visibilité utile.' },
      { label: 'CTR / CPC', text: 'Attraction et coût du trafic.' },
      { label: 'CPL / CPA', text: 'Coût de la demande utile.' },
      { label: 'ROAS', text: 'Valeur des conversions attribuées.' },
    ],
    relatedInsights: [
      { href: '/insights/campagnes-meta-2026-bonnes-pratiques', label: 'Campagnes Meta 2026', text: 'Créatifs, tracking, CAPI et qualité de leads.' },
      { href: '/insights/data-decision-strategie-performance', label: 'Data marketing', text: 'Relier les signaux à la décision.' },
      { href: '/insights/plan-acquisition-digital-2026', label: 'Plan d’acquisition', text: 'Organiser les canaux autour du funnel.' },
    ],
    relatedSectors: [
      { href: '/secteurs/retail-ecommerce', label: 'Retail & e-commerce' },
      { href: '/secteurs/education', label: 'Éducation' },
      { href: '/secteurs/fmcg', label: 'FMCG' },
    ],
    relatedServices: [
      { href: '/expertises/media-performance', label: 'Média & performance' },
      { href: '/expertises/tiktok-ads-maroc', label: 'TikTok Ads Maroc' },
      { href: '/expertises/generation-leads-maroc', label: 'Génération de leads' },
    ],
    faq: [
      { question: 'Quel budget prévoir sur Meta Ads ?', answer: "Le budget dépend du volume à tester, du nombre d'offres, des formats créatifs, de la concurrence et de l'objectif. Richmedia évite les budgets dispersés qui ne permettent aucun apprentissage fiable." },
      { question: 'Facebook Ads ou Instagram Ads ?', answer: "Le choix dépend de l'audience, du format, du message et du parcours. Les campagnes Meta peuvent diffuser sur plusieurs placements, mais les créas doivent rester adaptées aux usages Reels, Stories, Feed ou messages." },
      { question: 'Comment améliorer la qualité des leads Meta ?', answer: "Il faut clarifier l'offre, filtrer le formulaire, suivre les sources, relier le CRM, analyser les motifs de perte et optimiser sur les leads qualifiés plutôt que sur le CPL brut." },
    ],
  },
  {
    slug: 'generation-leads-maroc',
    keywordPrincipal: 'agence génération leads maroc',
    keywordsSecondaires: ['génération de leads maroc', 'lead generation maroc', 'leads qualifiés maroc'],
    title: 'Génération de leads Maroc',
    metaTitle: 'Agence génération de leads au Maroc | Richmedia',
    metaDescription: 'Créez un système de génération de leads qualifiés au Maroc : trafic, landing page, tracking, CRM, WhatsApp et relance.',
    eyebrow: 'Lead generation system',
    h1: 'Agence génération de leads au Maroc : du trafic au lead qualifié.',
    intro:
      "La génération de leads ne se limite pas à une campagne publicitaire. Richmedia construit le système complet : trafic, page, formulaire, tracking, CRM, qualification, relance et reporting. Le but est de distinguer le volume de contacts de la vraie opportunité commerciale.",
    heroImage: '/assets/richmedia-case-study/proof-landing.webp',
    heroAlt: 'Landing page et génération de leads connectées au CRM',
    parent: { href: '/expertises/media-performance', label: 'Média & performance' },
    proof: [
      { value: 'Traffic', label: 'Sources priorisées' },
      { value: 'Landing', label: 'Conversion cadrée' },
      { value: 'CRM', label: 'Qualification suivie' },
      { value: 'Relance', label: 'Perte réduite' },
    ],
    problems: [
      'Leads bruts trop nombreux et peu qualifiés.',
      'Formulaires qui collectent peu de contexte utile.',
      'Sources média impossibles à comparer.',
      'Relances lentes ou non documentées.',
      'Reporting qui s’arrête au CPL sans mesurer la suite.',
    ],
    services: [
      { title: 'Acquisition multicanale', text: 'Google Ads, Meta Ads, TikTok et contenus selon l’intention et le volume disponible.', items: ['Google', 'Meta', 'TikTok', 'SEO'] },
      { title: 'Landing pages & formulaires', text: 'Pages dédiées, promesse claire, champs utiles, WhatsApp, preuves et friction maîtrisée.', items: ['Page', 'Formulaire', 'WhatsApp', 'Preuves'] },
      { title: 'CRM & qualification', text: 'Statuts, scoring, routing, relance, MQL, SQL et feedback commercial.', items: ['MQL', 'SQL', 'Scoring', 'Routing'] },
      { title: 'Reporting commercial', text: 'Lecture CPL, taux de contact, rendez-vous, conversion, CAC et motifs de perte.', items: ['CPL', 'Contact', 'RDV', 'CAC'] },
    ],
    methodology: [
      { step: '01', title: 'Offre', text: 'Définir l’action attendue et la valeur réelle d’un lead qualifié.' },
      { step: '02', title: 'Traffic', text: 'Choisir les canaux selon intention, volume, coût et maturité.' },
      { step: '03', title: 'Conversion', text: 'Créer la landing page, le formulaire, WhatsApp et les preuves utiles.' },
      { step: '04', title: 'Qualification', text: 'Statuts CRM, lead scoring, assignation et relance contextualisée.' },
      { step: '05', title: 'Amélioration', text: 'Comparer sources, qualité, délai de réponse, conversion et coût final.' },
    ],
    useCases: [
      { href: '/secteurs/education', label: 'Éducation', text: 'Admissions, brochures, portes ouvertes et formations continues.' },
      { href: '/secteurs/immobilier', label: 'Immobilier', text: 'Demandes d’information, rendez-vous et visites.' },
      { href: '/secteurs/automobile', label: 'Automobile', text: 'Essais, devis, offres et relances concession.' },
    ],
    kpis: [
      { label: 'CPL', text: 'Coût du contact.' },
      { label: 'MQL / SQL', text: 'Niveau de qualification.' },
      { label: 'Taux de contact', text: 'Capacité à joindre le prospect.' },
      { label: 'CAC', text: 'Coût réel d’acquisition client.' },
    ],
    caseStudy: {
      title: 'UIR : relier acquisition, contenu et admission',
      text: "La page UIR documente un dispositif long terme autour des campagnes digitales et des temps forts d'admission, sans transformer ce cas en benchmark générique.",
      href: '/realisations/uir-campagnes-digitales',
      label: 'Voir le cas UIR',
    },
    relatedInsights: [
      { href: '/insights/plan-acquisition-digital-2026', label: 'Plan d’acquisition digital', text: 'Construire le funnel complet.' },
      { href: '/insights/crm-automation-aligner-marketing-sales', label: 'CRM & automation', text: 'Aligner marketing et sales.' },
      { href: '/insights/cout-campagne-google-ads-maroc', label: 'Coût Google Ads', text: 'Comprendre les variables de coût.' },
    ],
    relatedSectors: [
      { href: '/secteurs/education', label: 'Éducation' },
      { href: '/secteurs/immobilier', label: 'Immobilier' },
      { href: '/secteurs/automobile', label: 'Automobile' },
    ],
    relatedServices: [
      { href: '/expertises/google-ads-maroc', label: 'Google Ads Maroc' },
      { href: '/expertises/meta-ads-maroc', label: 'Meta Ads Maroc' },
      { href: '/expertises/marketing-automation-crm-maroc', label: 'Marketing Automation & CRM' },
    ],
    faq: [
      { question: 'Quelle différence entre lead et lead qualifié ?', answer: "Un lead est un contact. Un lead qualifié correspond à une demande qui présente un besoin, un contexte, une intention ou une maturité suffisante pour être traitée sérieusement par l’équipe commerciale." },
      { question: 'Quels canaux utiliser pour générer des leads ?', answer: "Google Ads capte l’intention active, Meta et TikTok créent la demande, le SEO installe la visibilité durable, et WhatsApp ou le CRM réduisent la perte après le premier contact." },
      { question: 'Pourquoi le CPL seul ne suffit pas ?', answer: "Un CPL bas peut masquer des prospects peu sérieux ou injoignables. Il faut mesurer la qualité, le taux de contact, les rendez-vous, les ventes et les motifs de perte." },
    ],
  },
  {
    slug: 'social-media-maroc',
    keywordPrincipal: 'agence social media maroc',
    keywordsSecondaires: ['agence community management maroc', 'community management maroc', 'agence réseaux sociaux maroc'],
    title: 'Social Media Maroc',
    metaTitle: 'Agence Social Media au Maroc | Richmedia',
    metaDescription: 'Structurez votre présence social media au Maroc avec stratégie éditoriale, contenus, community management, social care et performance.',
    eyebrow: 'Contenu, communauté & performance',
    h1: 'Agence Social Media au Maroc pour des communautés utiles, pas seulement actives.',
    intro:
      "Richmedia aborde le social media comme un système : stratégie éditoriale, formats social-first, calendrier, modération, social care, amplification paid et reporting. L’objectif n’est pas de publier plus, mais de créer une présence cohérente qui nourrit la marque, les campagnes et la conversion.",
    heroImage: '/assets/richmedia-home/story-social.webp',
    heroAlt: 'Production de contenus social media et animation de communautés',
    parent: { href: '/expertises/influence', label: 'Influence & social media' },
    proof: [
      { value: 'Stratégie', label: 'Ligne éditoriale claire' },
      { value: 'Content', label: 'Formats adaptés' },
      { value: 'Care', label: 'Communauté suivie' },
      { value: 'Paid', label: 'Amplification utile' },
    ],
    problems: [
      'Calendrier de posts sans rôle business clair.',
      'Contenus déconnectés des campagnes et du terrain.',
      'Commentaires et messages traités sans process.',
      'Reporting limité aux likes et impressions.',
      'Ton de marque incohérent entre plateformes.',
    ],
    services: [
      { title: 'Stratégie éditoriale', text: 'Territoires, piliers, tonalité, formats, calendrier et rôle par plateforme.', items: ['Piliers', 'Tonalité', 'Calendrier', 'Formats'] },
      { title: 'Création social-first', text: 'Reels, TikTok, carrousels, stories, visuels, scripts courts et contenus réutilisables.', items: ['Reels', 'TikTok', 'Stories', 'Carrousels'] },
      { title: 'Community management', text: 'Publication, modération, réponses, social care, alertes et remontées utiles.', items: ['Modération', 'Réponses', 'Alertes', 'Social care'] },
      { title: 'Performance & reporting', text: 'Lecture des contenus, amplification paid, insights audience et apprentissages créatifs.', items: ['Paid', 'Insights', 'Reporting', 'Tests'] },
    ],
    methodology: [
      { step: '01', title: 'Diagnostic', text: 'Audit marque, plateformes, contenus, concurrence, communauté et attentes business.' },
      { step: '02', title: 'Architecture', text: 'Piliers éditoriaux, formats, rythme, validation et objectifs par contenu.' },
      { step: '03', title: 'Production', text: 'Scripts, design, montage, shooting, UGC, publication et QA.' },
      { step: '04', title: 'Animation', text: 'Modération, social care, remontées, réponses et opportunités de conversation.' },
      { step: '05', title: 'Amélioration', text: 'Reporting, contenus gagnants, signaux faibles et briefs de la prochaine vague.' },
    ],
    useCases: [
      { href: '/secteurs/fmcg', label: 'FMCG', text: 'Lancement produit, preuve d’usage, moments de consommation.' },
      { href: '/secteurs/retail-ecommerce', label: 'Retail', text: 'Promotions, nouveautés, UGC et trafic magasin.' },
      { href: '/secteurs/tourisme-hotellerie', label: 'Tourisme', text: 'Inspiration, expérience, réservation et contenus immersifs.' },
    ],
    kpis: [
      { label: 'Reach utile', text: 'Diffusion auprès des bonnes audiences.' },
      { label: 'Engagement qualitatif', text: 'Commentaires, sauvegardes, partages.' },
      { label: 'Trafic', text: 'Passage vers site, landing page ou WhatsApp.' },
      { label: 'Apprentissage créatif', text: 'Formats et angles à renforcer.' },
    ],
    relatedInsights: [
      { href: '/insights/createurs-marques-collaborations-durables', label: 'Créateurs & marques', text: 'Collaborations et contenus réutilisables.' },
      { href: '/insights/contenu-qualite-seo-perenne', label: 'Contenu de qualité', text: 'Rendre les contenus utiles et structurés.' },
      { href: '/insights/priorites-digitales-2026-croissance-rentable', label: 'Priorités digitales', text: 'Relier contenu, média et data.' },
    ],
    relatedSectors: [
      { href: '/secteurs/fmcg', label: 'FMCG' },
      { href: '/secteurs/retail-ecommerce', label: 'Retail & e-commerce' },
      { href: '/secteurs/tourisme-hotellerie', label: 'Tourisme / hôtellerie' },
    ],
    relatedServices: [
      { href: '/gestion-reseaux-sociaux-maroc', label: 'Gestion des réseaux sociaux au Maroc' },
      { href: '/expertises/brand-content', label: 'Brand content' },
      { href: '/expertises/influence-marketing-maroc', label: 'Influence Marketing Maroc' },
      { href: '/expertises/meta-ads-maroc', label: 'Meta Ads Maroc' },
    ],
    faq: [
      { question: 'Une agence social media fait-elle seulement du community management ?', answer: "Non. Le community management est une partie du dispositif. Une approche complète relie stratégie éditoriale, production, animation, social care, amplification paid et lecture business des contenus." },
      { question: 'Quels réseaux sociaux faut-il prioriser ?', answer: "Le choix dépend de la cible, du contenu disponible, du cycle d’achat et des ressources. Instagram, TikTok, Facebook ou LinkedIn n’ont pas le même rôle ni le même niveau d’exigence créative." },
      { question: 'Comment mesurer le social media ?', answer: "On mesure la portée utile, l’engagement qualitatif, les messages, le trafic, les conversions assistées, les contenus gagnants et les signaux remontés par la communauté." },
    ],
  },
  {
    slug: 'tiktok-ads-maroc',
    keywordPrincipal: 'agence tiktok ads maroc',
    keywordsSecondaires: ['tiktok ads maroc', 'publicité tiktok maroc', 'spark ads maroc'],
    title: 'TikTok Ads Maroc',
    metaTitle: 'Agence TikTok Ads au Maroc | Richmedia',
    metaDescription: 'Activez TikTok Ads au Maroc avec contenus natifs, Spark Ads, UGC, tracking, retargeting, testing créatif et optimisation.',
    eyebrow: 'Creative-first performance',
    h1: 'Agence TikTok Ads au Maroc pour transformer le contenu natif en performance.',
    intro:
      "TikTok Ads demande une logique différente : la publicité doit d’abord ressembler à un contenu que l’audience accepte de regarder. Richmedia relie créateurs, UGC, Spark Ads, formats courts, tracking et retargeting pour tester vite et apprendre proprement.",
    heroImage: '/assets/richmedia-influence/creator-urban.webp',
    heroAlt: 'Créateur contenu court pour campagne TikTok Ads au Maroc',
    parent: { href: '/expertises/media-performance', label: 'Média & performance' },
    proof: [
      { value: 'Hooks', label: 'Arrêt scroll' },
      { value: 'UGC', label: 'Contenus natifs' },
      { value: 'Spark', label: 'Amplification créateur' },
      { value: 'Test', label: 'Apprentissage rapide' },
    ],
    problems: [
      'Publicités trop classiques pour le rythme TikTok.',
      'Créatifs produits sans hook ni preuve rapide.',
      'Absence de retargeting ou de tracking post-clic.',
      'Tests créatifs trop faibles pour apprendre.',
      'Confusion entre vues et performance commerciale.',
    ],
    services: [
      { title: 'TikTok Ads & Spark Ads', text: 'Campagnes d’acquisition, trafic, conversion, retargeting et amplification de contenus créateurs.', items: ['TikTok Ads', 'Spark Ads', 'Retargeting', 'Conversion'] },
      { title: 'Créatifs natifs', text: 'Hooks, scripts, UGC, démonstrations, avis, formats verticaux et variations rapides.', items: ['Hooks', 'Scripts', 'UGC', 'Vertical'] },
      { title: 'Testing & audiences', text: 'Angles, formats, audiences, exclusions, séquences et comparaison des signaux.', items: ['Angles', 'Formats', 'Audiences', 'Exclusions'] },
      { title: 'Mesure', text: 'UTMs, événements, pages, CRM et lecture des conversions réelles.', items: ['UTM', 'Events', 'CRM', 'CPA'] },
    ],
    methodology: [
      { step: '01', title: 'Objectif', text: 'Clarifier notoriété, trafic, lead, vente ou apprentissage créatif.' },
      { step: '02', title: 'Créa', text: 'Produire plusieurs hooks et formats natifs avant de scaler.' },
      { step: '03', title: 'Setup', text: 'Paramétrage campagne, tracking, audiences, budget et landing page.' },
      { step: '04', title: 'Test', text: 'Comparer watch signals, CTR, CPC, CPA et qualité des réponses.' },
      { step: '05', title: 'Scale', text: 'Renforcer les contenus gagnants, retargeter et produire de nouvelles variantes.' },
    ],
    useCases: [
      { href: '/secteurs/retail-ecommerce', label: 'Retail', text: 'Offres, démonstrations, produits visibles et social commerce.' },
      { href: '/secteurs/fmcg', label: 'FMCG', text: 'Usage produit, recettes, preuve d’essai et UGC.' },
      { href: '/secteurs/tourisme-hotellerie', label: 'Tourisme', text: 'Expériences courtes, lieux, moments et inspiration.' },
    ],
    kpis: [
      { label: 'CPM / CPC', text: 'Coût de diffusion et trafic.' },
      { label: 'View rate', text: 'Capacité du contenu à retenir.' },
      { label: 'CTR', text: 'Passage vers l’action.' },
      { label: 'CPA', text: 'Coût de conversion suivie.' },
    ],
    relatedInsights: [
      { href: '/insights/createurs-marques-collaborations-durables', label: 'Créateurs & marques', text: 'Organiser les contenus créateurs.' },
      { href: '/insights/campagnes-meta-2026-bonnes-pratiques', label: 'Campagnes Meta 2026', text: 'Comparer paid social et logique créative.' },
      { href: '/insights/plan-acquisition-digital-2026', label: 'Plan d’acquisition', text: 'Intégrer TikTok dans le mix.' },
    ],
    relatedSectors: [
      { href: '/secteurs/retail-ecommerce', label: 'Retail & e-commerce' },
      { href: '/secteurs/fmcg', label: 'FMCG' },
      { href: '/secteurs/tourisme-hotellerie', label: 'Tourisme / hôtellerie' },
    ],
    relatedServices: [
      { href: '/expertises/meta-ads-maroc', label: 'Meta Ads Maroc' },
      { href: '/expertises/influence-marketing-maroc', label: 'Influence Marketing Maroc' },
      { href: '/expertises/generation-leads-maroc', label: 'Génération de leads' },
    ],
    faq: [
      { question: 'TikTok Ads convient-il seulement aux marques jeunes ?', answer: "Non. TikTok fonctionne surtout quand le format, le message et l’offre sont adaptés à une consommation rapide. La pertinence dépend plus du contenu et de l’objectif que d’un âge supposé." },
      { question: 'Quelle différence entre TikTok Ads et une publicité classique ?', answer: "Une publicité classique impose souvent un message. Sur TikTok, le contenu doit capter vite, sembler natif, raconter une preuve et donner envie d’agir sans casser le flux de consultation." },
      { question: 'Peut-on mesurer les conversions TikTok ?', answer: "Oui, à condition de configurer les événements, UTMs, pages et CRM. La mesure doit suivre la conversion utile, pas seulement les vues ou l’engagement." },
    ],
  },
  {
    slug: 'whatsapp-marketing-maroc',
    keywordPrincipal: 'whatsapp marketing maroc',
    keywordsSecondaires: ['campagne whatsapp maroc', 'whatsapp business maroc', 'marketing whatsapp business'],
    title: 'WhatsApp Marketing Maroc',
    metaTitle: 'WhatsApp Marketing au Maroc | Richmedia',
    metaDescription: 'Déployez WhatsApp Marketing au Maroc avec opt-in, templates, segmentation, CRM, chatbots, automation et reporting Richmedia.',
    eyebrow: 'Conversation, CRM & conversion',
    h1: 'WhatsApp Marketing au Maroc, relié au CRM et à la conversion.',
    intro:
      "WhatsApp devient performant quand il est traité comme un canal relationnel mesurable. Richmedia conçoit les parcours avec opt-in, templates, segmentation, boutons, médias, chatbots, CRM, relances et reporting, dans le respect des règles plateforme et du cadre données.",
    heroImage: '/assets/richmedia-ia-automation/whatsapp-agent.webp',
    heroAlt: 'Parcours WhatsApp Marketing connecté au CRM et aux campagnes',
    parent: { href: '/expertises/ia-automation', label: 'IA & automation' },
    proof: [
      { value: 'Opt-in', label: 'Consentement cadré' },
      { value: 'CRM', label: 'Contexte conservé' },
      { value: 'Bot', label: 'Qualification simple' },
      { value: 'Data', label: 'Reporting utile' },
    ],
    problems: [
      'Bouton WhatsApp sans contexte de campagne.',
      'Relances manuelles difficiles à suivre.',
      'Base de contacts non segmentée.',
      'Absence de statut CRM après conversation.',
      'Messages marketing lancés sans cadre clair.',
    ],
    services: [
      { title: 'WhatsApp Business Platform', text: 'Parcours, templates, boutons, médias, segmentation et scénarios de conversation.', items: ['Templates', 'Boutons', 'Médias', 'Segmentation'] },
      { title: 'Chatbots & qualification', text: 'Questions utiles, routing, horaires, escalade humaine et récupération du besoin.', items: ['Bot', 'Routing', 'Qualification', 'Escalade'] },
      { title: 'CRM & automation', text: 'Source, statut, historique, relance, assignation et reporting commercial.', items: ['CRM', 'Statuts', 'Relance', 'Historique'] },
      { title: 'Mesure', text: 'Origine, réponse, qualification, rendez-vous, vente et motifs de perte.', items: ['Source', 'Réponse', 'RDV', 'Vente'] },
    ],
    methodology: [
      { step: '01', title: 'Parcours', text: 'Définir la source, l’objectif, le consentement, le message et la suite commerciale.' },
      { step: '02', title: 'Scénarios', text: 'Créer accueil, qualification, relance, templates et passage humain.' },
      { step: '03', title: 'Connexion', text: 'Relier WhatsApp au CRM, aux campagnes, aux formulaires et aux dashboards.' },
      { step: '04', title: 'Activation', text: 'Lancer les points d’entrée : site, Ads, QR, landing page, email ou terrain.' },
      { step: '05', title: 'Pilotage', text: 'Lire réponses, délais, qualification, conversions et améliorations de scénario.' },
    ],
    useCases: [
      { href: '/secteurs/automobile', label: 'Automobile', text: 'Demandes d’essai, disponibilité, offres et relances.' },
      { href: '/secteurs/immobilier', label: 'Immobilier', text: 'Qualification budget, typologie et rendez-vous.' },
      { href: '/secteurs/retail-ecommerce', label: 'Retail', text: 'Coupons, disponibilité, promotions et suivi client.' },
    ],
    kpis: [
      { label: 'Délai de réponse', text: 'Vitesse de prise en charge.' },
      { label: 'Qualification', text: 'Besoin, source, statut.' },
      { label: 'Rendez-vous', text: 'Étape commerciale validée.' },
      { label: 'Conversion', text: 'Résultat relié au CRM.' },
    ],
    relatedInsights: [
      { href: '/insights/whatsapp-business-canal-conversion', label: 'WhatsApp Business : canal de conversion', text: 'Structurer conversations et mesure.' },
      { href: '/insights/crm-automation-aligner-marketing-sales', label: 'CRM & automation', text: 'Aligner relance et sales.' },
      { href: '/insights/data-decision-strategie-performance', label: 'Data marketing', text: 'Lire les conversations comme un signal.' },
    ],
    relatedSectors: [
      { href: '/secteurs/automobile', label: 'Automobile' },
      { href: '/secteurs/immobilier', label: 'Immobilier' },
      { href: '/secteurs/retail-ecommerce', label: 'Retail & e-commerce' },
    ],
    relatedServices: [
      { href: '/agence-ia-maroc', label: 'Agence IA au Maroc' },
      { href: '/expertises/ia-automation', label: 'IA & automation' },
      { href: '/expertises/marketing-automation-crm-maroc', label: 'Marketing Automation & CRM' },
      { href: '/expertises/generation-leads-maroc', label: 'Génération de leads' },
    ],
    faq: [
      { question: 'Comment fonctionne WhatsApp Business Marketing ?', answer: "Le canal permet d’envoyer et recevoir des conversations liées à un parcours : point d’entrée, opt-in, template, réponse, qualification, relance et suivi CRM. La valeur vient de l’organisation du système." },
      { question: 'Faut-il un opt-in ?', answer: "Oui, l’usage marketing doit respecter les règles WhatsApp et le cadre des données personnelles. Richmedia structure les parcours pour documenter l’origine, le contexte et les demandes d’arrêt." },
      { question: 'Quels formats peut-on envoyer ?', answer: "Les parcours peuvent intégrer texte, images, vidéos, documents, boutons et listes selon les cas d’usage et les règles applicables. Les formats doivent rester utiles et contextualisés." },
    ],
  },
  {
    slug: 'marketing-automation-crm-maroc',
    keywordPrincipal: 'agence marketing automation maroc',
    keywordsSecondaires: ['crm marketing maroc', 'marketing automation maroc', 'agence crm maroc'],
    title: 'Marketing Automation & CRM Maroc',
    metaTitle: 'Marketing Automation & CRM au Maroc | Richmedia',
    metaDescription: 'Connectez acquisition, CRM, scoring, WhatsApp, workflows, relances et dashboards avec Richmedia au Maroc.',
    eyebrow: 'CRM, scoring & workflows',
    h1: 'Agence Marketing Automation & CRM au Maroc pour mieux convertir les leads.',
    intro:
      "Richmedia relie les campagnes à la suite commerciale : capture, CRM, qualification, scoring, routing, relance, conversion et reporting. L’automation n’a de valeur que si elle réduit les pertes, clarifie les priorités et donne aux équipes une donnée exploitable.",
    heroImage: '/assets/richmedia-ia-automation/crm-automation.webp',
    heroAlt: 'Workflows CRM et marketing automation connectés aux campagnes',
    parent: { href: '/expertises/ia-automation', label: 'IA & automation' },
    proof: [
      { value: 'Capture', label: 'Sources unifiées' },
      { value: 'Score', label: 'Priorité commerciale' },
      { value: 'Route', label: 'Assignation claire' },
      { value: 'Report', label: 'Décisions lisibles' },
    ],
    problems: [
      'Leads répartis entre formulaires, WhatsApp et fichiers.',
      'Aucun statut commun entre marketing et sales.',
      'Relances oubliées ou non contextualisées.',
      'Scoring absent ou trop théorique.',
      'Reporting qui ne relie pas source, qualité et conversion.',
    ],
    services: [
      { title: 'CRM & pipeline', text: 'Statuts, champs, sources, responsables, pipeline et conventions de données.', items: ['Statuts', 'Sources', 'Pipeline', 'Responsables'] },
      { title: 'Workflows', text: 'Relances, notifications, assignation, nurturing, email, WhatsApp et alertes sales.', items: ['Relance', 'Email', 'WhatsApp', 'Alertes'] },
      { title: 'Lead scoring', text: 'Critères de maturité, priorité, segmentation, MQL, SQL et feedback.', items: ['Scoring', 'MQL', 'SQL', 'Feedback'] },
      { title: 'Dashboards', text: 'Sources, coûts, qualité, délai, conversion et motifs de perte.', items: ['Sources', 'Coûts', 'Qualité', 'Conversion'] },
    ],
    methodology: [
      { step: '01', title: 'Capture', text: 'Identifier toutes les sources de leads et les données minimales nécessaires.' },
      { step: '02', title: 'Structuration', text: 'Définir champs, statuts, scoring, pipeline et règles d’assignation.' },
      { step: '03', title: 'Automation', text: 'Créer workflows de relance, notifications, nurturing et passage humain.' },
      { step: '04', title: 'Connexion', text: 'Relier formulaires, WhatsApp, campagnes, CRM et dashboards.' },
      { step: '05', title: 'Optimisation', text: 'Analyser les délais, conversions, pertes et qualité par source.' },
    ],
    useCases: [
      { href: '/secteurs/education', label: 'Éducation', text: 'Admissions, relances, brochures et priorisation des candidats.' },
      { href: '/secteurs/immobilier', label: 'Immobilier', text: 'Budget, typologie, rendez-vous et suivi commercial.' },
      { href: '/secteurs/automobile', label: 'Automobile', text: 'Essais, offres, concession, disponibilité et rappel.' },
    ],
    kpis: [
      { label: 'MQL / SQL', text: 'Qualification partagée.' },
      { label: 'Taux de contact', text: 'Prospects réellement joints.' },
      { label: 'Délai de réponse', text: 'Vitesse de traitement.' },
      { label: 'Conversion', text: 'Passage vers rendez-vous ou vente.' },
    ],
    relatedInsights: [
      { href: '/insights/crm-automation-aligner-marketing-sales', label: 'CRM & automation', text: 'Aligner marketing et sales.' },
      { href: '/insights/data-decision-strategie-performance', label: 'Data marketing', text: 'Fiabiliser les décisions.' },
      { href: '/insights/whatsapp-business-canal-conversion', label: 'WhatsApp Business', text: 'Relier conversation et conversion.' },
    ],
    relatedSectors: [
      { href: '/secteurs/education', label: 'Éducation' },
      { href: '/secteurs/immobilier', label: 'Immobilier' },
      { href: '/secteurs/automobile', label: 'Automobile' },
    ],
    relatedServices: [
      { href: '/agence-ia-maroc', label: 'Agence IA au Maroc' },
      { href: '/expertises/ia-automation', label: 'IA & automation' },
      { href: '/expertises/whatsapp-marketing-maroc', label: 'WhatsApp Marketing Maroc' },
      { href: '/expertises/generation-leads-maroc', label: 'Génération de leads' },
    ],
    faq: [
      { question: 'À quoi sert le marketing automation ?', answer: "Il sert à traiter les contacts plus vite, relancer au bon moment, prioriser les demandes, nourrir les prospects et donner aux équipes commerciales une information exploitable." },
      { question: 'Faut-il déjà avoir un CRM ?', answer: "Pas forcément. Richmedia peut auditer un CRM existant ou cadrer une structure simple avant d’automatiser. L’essentiel est de clarifier les statuts, sources, responsabilités et objectifs." },
      { question: 'Quelle différence entre automation et chatbot ?', answer: "Un chatbot gère une partie de la conversation. L’automation couvre un système plus large : capture, scoring, routing, relance, notifications, CRM et reporting." },
    ],
  },
  {
    slug: 'influence-marketing-maroc',
    keywordPrincipal: 'agence influence maroc',
    keywordsSecondaires: ['agence influence marketing maroc', 'influenceurs maroc', 'campagne influence maroc'],
    title: 'Influence Marketing Maroc',
    metaTitle: 'Agence Influence Marketing au Maroc | Richmedia',
    metaDescription: 'Pilotez vos campagnes influence au Maroc : stratégie, casting, brief, UGC, amplification paid, géolocalisation et mesure.',
    eyebrow: 'Créateurs, UGC & amplification',
    h1: 'Agence Influence Marketing au Maroc pour des collaborations utiles et mesurables.',
    intro:
      "Richmedia structure l’influence comme un dispositif complet : objectif, audience, casting, brief, négociation, production, droits UGC, amplification paid et reporting. Le bon créateur n’est pas seulement visible ; il est crédible pour la marque et utile au parcours.",
    heroImage: '/assets/richmedia-influence/influence-hero.webp',
    heroAlt: 'Campagne influence marketing avec créateurs et contenus social-first',
    parent: { href: '/expertises/influence', label: 'Influence & social media' },
    proof: [
      { value: 'Casting', label: 'Brand fit vérifié' },
      { value: 'UGC', label: 'Assets réutilisables' },
      { value: 'Paid', label: 'Amplification contrôlée' },
      { value: 'Geo', label: 'Activation locale' },
    ],
    problems: [
      'Choix d’influenceurs basé uniquement sur la taille d’audience.',
      'Briefs trop fermés ou trop flous.',
      'Droits d’usage UGC non cadrés.',
      'Mesure limitée aux likes.',
      'Pas de lien entre influence, paid media et conversion.',
    ],
    services: [
      { title: 'Stratégie influence', text: 'Objectif, audience, rôle dans le funnel, budget, messages et critères de sélection.', items: ['Objectif', 'Audience', 'Budget', 'KPI'] },
      { title: 'Casting créateurs', text: 'Nano, micro, macro, brand fit, qualité de contenu, crédibilité et brand safety.', items: ['Nano', 'Micro', 'Macro', 'Brand fit'] },
      { title: 'Production & droits', text: 'Brief, hooks, scripts, livrables, validation, droits d’usage et réutilisation UGC.', items: ['Brief', 'UGC', 'Droits', 'Validation'] },
      { title: 'Amplification & mesure', text: 'Paid boost, géolocalisation, UTMs, codes, trafic, leads et reporting.', items: ['Paid', 'Geo', 'UTM', 'Reporting'] },
    ],
    methodology: [
      { step: '01', title: 'Objectif', text: 'Clarifier notoriété, contenu, trafic, lead, vente ou activation locale.' },
      { step: '02', title: 'Audience', text: 'Définir communautés, territoires, plateformes, zones et contraintes.' },
      { step: '03', title: 'Casting', text: 'Shortlist, scoring qualitatif, négociation, disponibilité et droits.' },
      { step: '04', title: 'Production', text: 'Brief, liberté éditoriale maîtrisée, validation et publication.' },
      { step: '05', title: 'Mesure', text: 'Reach utile, engagement, trafic, conversions, contenus gagnants et learnings.' },
    ],
    useCases: [
      { href: '/secteurs/fmcg', label: 'FMCG', text: 'Lancement, usage produit, retail et preuve sociale.' },
      { href: '/secteurs/retail-ecommerce', label: 'Retail', text: 'Promotions, magasin, e-commerce et social commerce.' },
      { href: '/secteurs/tourisme-hotellerie', label: 'Tourisme', text: 'Expérience, destination, lieu et réservation.' },
    ],
    kpis: [
      { label: 'Reach utile', text: 'Diffusion auprès de l’audience visée.' },
      { label: 'Engagement', text: 'Qualité des interactions.' },
      { label: 'Trafic / leads', text: 'Passage vers un parcours mesurable.' },
      { label: 'Assets UGC', text: 'Contenus réutilisables en paid.' },
    ],
    relatedInsights: [
      { href: '/insights/createurs-marques-collaborations-durables', label: 'Créateurs & marques', text: 'Collaborations durables et UGC.' },
      { href: '/insights/campagnes-meta-2026-bonnes-pratiques', label: 'Campagnes Meta 2026', text: 'Amplifier les meilleurs contenus.' },
      { href: '/insights/priorites-digitales-2026-croissance-rentable', label: 'Priorités digitales', text: 'Relier création, média et data.' },
    ],
    relatedSectors: [
      { href: '/secteurs/fmcg', label: 'FMCG' },
      { href: '/secteurs/retail-ecommerce', label: 'Retail & e-commerce' },
      { href: '/secteurs/tourisme-hotellerie', label: 'Tourisme / hôtellerie' },
    ],
    relatedServices: [
      { href: '/expertises/influence', label: 'Influence' },
      { href: '/expertises/social-media-maroc', label: 'Social Media Maroc' },
      { href: '/expertises/geofencing-drive-to-store-maroc', label: 'Géofencing & drive-to-store' },
    ],
    faq: [
      { question: 'Comment choisir les bons influenceurs au Maroc ?', answer: "Il faut croiser audience réelle, qualité du contenu, cohérence avec la marque, crédibilité, zone, historique, capacité de production et niveau de risque. La taille d’audience seule ne suffit pas." },
      { question: 'Nano, micro ou macro-influence : que choisir ?', answer: "Les nano et micro-profils apportent souvent proximité et crédibilité. Les macro-profils apportent de la portée. Le bon mix dépend de l’objectif, du budget, de la marque et du besoin de contenu." },
      { question: 'Peut-on amplifier une campagne influence en paid media ?', answer: "Oui, lorsque les droits et formats sont cadrés. Les meilleurs contenus créateurs peuvent nourrir Meta, TikTok ou des activations géolocalisées avec un suivi plus précis." },
    ],
  },
  {
    slug: 'social-listening-maroc',
    keywordPrincipal: 'social listening maroc',
    keywordsSecondaires: ['veille réseaux sociaux maroc', 'analyse sentiment maroc', 'social monitoring maroc'],
    title: 'Social Listening Maroc',
    metaTitle: 'Social Listening au Maroc | Richmedia',
    metaDescription: 'Transformez conversations, réputation, tendances, concurrents et signaux sociaux en insights actionnables avec Richmedia.',
    eyebrow: 'Signal, insight & décision',
    h1: 'Social Listening au Maroc : écouter les conversations pour décider mieux.',
    intro:
      "Le social listening ne se limite pas à surveiller des mentions. Richmedia transforme conversations, sentiment, tendances, concurrents, créateurs et signaux faibles en décisions : contenu, produit, réputation, campagne, influence ou relation client.",
    heroImage: '/assets/richmedia-case-study/proof-dashboard.webp',
    heroAlt: 'Dashboard social listening et analyse des conversations de marque',
    parent: { href: '/expertises/influence', label: 'Influence & social media' },
    proof: [
      { value: 'Signal', label: 'Conversations détectées' },
      { value: 'Insight', label: 'Lecture utile' },
      { value: 'Action', label: 'Décision concrète' },
      { value: 'Report', label: 'Synthèse exploitable' },
    ],
    problems: [
      'Marque surveillée seulement quand une crise apparaît.',
      'Commentaires lus sans analyse des sujets récurrents.',
      'Tendances repérées trop tard pour produire.',
      'Influenceurs identifiés sans contexte de conversation.',
      'Reporting social déconnecté des décisions business.',
    ],
    services: [
      { title: 'Écoute marque & réputation', text: 'Mentions, sentiment, irritants, questions, risques et opportunités éditoriales.', items: ['Marque', 'Sentiment', 'Risques', 'Questions'] },
      { title: 'Analyse concurrentielle', text: 'Messages, contenus, réactions, territoires et signaux d’écart.', items: ['Concurrents', 'Territoires', 'Réactions', 'Différences'] },
      { title: 'Tendances & consommateurs', text: 'Sujets émergents, usages, besoins, objections et angles de contenu.', items: ['Tendances', 'Usages', 'Objections', 'Angles'] },
      { title: 'Reporting actionnable', text: 'Signal, insight, décision, action et suivi des effets dans la durée.', items: ['Signal', 'Insight', 'Décision', 'Action'] },
    ],
    methodology: [
      { step: '01', title: 'Périmètre', text: 'Définir marques, concurrents, langues, plateformes, mots-clés et sujets sensibles.' },
      { step: '02', title: 'Collecte', text: 'Suivre mentions, conversations publiques, contenus, hashtags et communautés.' },
      { step: '03', title: 'Lecture', text: 'Classer sentiment, thèmes, signaux, risques, opportunités et influenceurs.' },
      { step: '04', title: 'Décision', text: 'Transformer les observations en recommandations contenu, média, produit ou care.' },
      { step: '05', title: 'Suivi', text: 'Mesurer l’évolution des sujets et l’impact des actions.' },
    ],
    useCases: [
      { href: '/secteurs/fmcg', label: 'FMCG', text: 'Usages, irritants, lancements et perception produit.' },
      { href: '/secteurs/retail-ecommerce', label: 'Retail', text: 'Promotions, expérience magasin, disponibilité et service.' },
      { href: '/secteurs/institutionnel', label: 'Institutionnel', text: 'Réputation, pédagogie, crise et perception publique.' },
    ],
    kpis: [
      { label: 'Volume de mentions', text: 'Niveau de conversation.' },
      { label: 'Sentiment', text: 'Lecture qualitative.' },
      { label: 'Thèmes', text: 'Sujets récurrents.' },
      { label: 'Actions', text: 'Décisions déclenchées.' },
    ],
    relatedInsights: [
      { href: '/insights/data-decision-strategie-performance', label: 'Data & décision', text: 'Transformer un signal en décision.' },
      { href: '/insights/contenu-qualite-seo-perenne', label: 'Contenu utile', text: 'Créer à partir des vraies questions.' },
      { href: '/insights/priorites-digitales-2026-croissance-rentable', label: 'Priorités digitales', text: 'Piloter avec les bons signaux.' },
    ],
    relatedSectors: [
      { href: '/secteurs/fmcg', label: 'FMCG' },
      { href: '/secteurs/retail-ecommerce', label: 'Retail & e-commerce' },
      { href: '/secteurs/institutionnel', label: 'Institutionnel' },
    ],
    relatedServices: [
      { href: '/expertises/social-media-maroc', label: 'Social Media Maroc' },
      { href: '/expertises/influence-marketing-maroc', label: 'Influence Marketing Maroc' },
      { href: '/expertises/brand-content', label: 'Brand content' },
    ],
    faq: [
      { question: 'Quelle différence entre social monitoring et social listening ?', answer: "Le social monitoring suit les mentions et alertes. Le social listening analyse les conversations pour comprendre les thèmes, sentiments, tendances, risques et opportunités qui doivent guider une action." },
      { question: 'À quoi sert le social listening pour une marque ?', answer: "Il aide à détecter les irritants, comprendre les attentes, suivre la réputation, comparer les concurrents, identifier des créateurs et produire des contenus plus proches des conversations réelles." },
      { question: 'Le social listening remplace-t-il les études ?', answer: "Non. Il complète les études en apportant des signaux publics et continus. Les résultats doivent être contextualisés et transformés en décisions concrètes, pas pris comme une vérité absolue." },
    ],
  },
  {
    slug: 'geofencing-drive-to-store-maroc',
    keywordPrincipal: 'geofencing maroc',
    keywordsSecondaires: ['drive to store maroc', 'géociblage maroc', 'campagne drive-to-store maroc'],
    title: 'Géofencing & Drive-to-store Maroc',
    metaTitle: 'Géofencing & Drive-to-store au Maroc | Richmedia',
    metaDescription: 'Activez géofencing, audiences locales, campagnes drive-to-store, contenus, WhatsApp et reporting par zone avec Richmedia.',
    eyebrow: 'Local media & activation magasin',
    h1: 'Géofencing et drive-to-store au Maroc pour relier campagne et point de vente.',
    intro:
      "Richmedia conçoit des dispositifs locaux qui relient zone de chalandise, audience, contenu, campagne, point de vente et reporting. Le géofencing et le drive-to-store servent à rendre une activation plus précise, plus locale et plus mesurable sans promettre une technologie miracle.",
    heroImage: '/assets/richmedia-phygital/phygital-hero.webp',
    heroAlt: 'Activation drive-to-store et ciblage géographique autour de points de vente',
    parent: { href: '/expertises/phygital', label: 'Phygital' },
    proof: [
      { value: 'Zone', label: 'Chalandise définie' },
      { value: 'Local', label: 'Message adapté' },
      { value: 'Store', label: 'Parcours magasin' },
      { value: 'Report', label: 'Lecture par zone' },
    ],
    problems: [
      'Campagnes nationales trop larges pour des points de vente locaux.',
      'Promotions magasin sans ciblage autour de la zone utile.',
      'Messages identiques malgré des contextes différents.',
      'Pas de suivi par ville, magasin ou opération.',
      'Activation terrain déconnectée du média et du CRM.',
    ],
    services: [
      { title: 'Géociblage & zones', text: 'Zones de chalandise, rayons, villes, quartiers, points de vente et audiences locales.', items: ['Rayon', 'Ville', 'Quartier', 'PDV'] },
      { title: 'Campagnes locales', text: 'Meta, TikTok, Google, influence locale, contenus et séquences drive-to-store.', items: ['Meta', 'TikTok', 'Google', 'Influence'] },
      { title: 'Parcours magasin', text: 'Offres, coupons, QR, WhatsApp, landing pages, itinéraires et disponibilité.', items: ['Coupon', 'QR', 'WhatsApp', 'Itinéraire'] },
      { title: 'Reporting local', text: 'Lecture par zone, campagne, créatif, interaction, conversion ou signal magasin disponible.', items: ['Zone', 'Créa', 'Interaction', 'PDV'] },
    ],
    methodology: [
      { step: '01', title: 'Point de vente', text: 'Identifier les zones, contraintes, objectifs, offres et moments commerciaux.' },
      { step: '02', title: 'Audience locale', text: 'Définir critères géographiques, comportements utiles et exclusions.' },
      { step: '03', title: 'Contenu', text: 'Adapter les messages selon zone, offre, disponibilité, urgence ou expérience.' },
      { step: '04', title: 'Campagne', text: 'Activer les canaux, formats, budget pacing et liens vers parcours magasin.' },
      { step: '05', title: 'Mesure', text: 'Comparer zones, créas, interactions, coupons, WhatsApp et signaux disponibles.' },
    ],
    useCases: [
      { href: '/secteurs/retail-ecommerce', label: 'Retail', text: 'Promotions locales, trafic magasin et offres saisonnières.' },
      { href: '/secteurs/gms', label: 'GMS', text: 'Catalogues, opérations commerciales et zones de chalandise.' },
      { href: '/secteurs/automobile', label: 'Automobile', text: 'Showroom, essais, offres locales et rendez-vous.' },
    ],
    kpis: [
      { label: 'Reach local', text: 'Diffusion sur zone utile.' },
      { label: 'Interactions', text: 'Clics, messages, itinéraires, coupons.' },
      { label: 'Coût par action', text: 'Lecture par opération.' },
      { label: 'Signal PDV', text: 'Donnée disponible par point de vente.' },
    ],
    relatedInsights: [
      { href: '/insights/plan-acquisition-digital-2026', label: 'Plan d’acquisition', text: 'Relier canaux et parcours.' },
      { href: '/insights/campagnes-meta-2026-bonnes-pratiques', label: 'Meta Ads 2026', text: 'Ciblage, créas et retargeting.' },
      { href: '/insights/data-decision-strategie-performance', label: 'Data & décision', text: 'Lire les signaux locaux.' },
    ],
    relatedSectors: [
      { href: '/secteurs/retail-ecommerce', label: 'Retail & e-commerce' },
      { href: '/secteurs/gms', label: 'GMS' },
      { href: '/secteurs/automobile', label: 'Automobile' },
    ],
    relatedServices: [
      { href: '/expertises/phygital', label: 'Phygital' },
      { href: '/expertises/meta-ads-maroc', label: 'Meta Ads Maroc' },
      { href: '/expertises/influence-marketing-maroc', label: 'Influence Marketing Maroc' },
    ],
    faq: [
      { question: 'Qu’est-ce que le géofencing marketing ?', answer: "C’est l’usage de zones géographiques définies pour adapter une campagne à un territoire, un point de vente ou une zone de chalandise. La précision dépend des plateformes et des données disponibles." },
      { question: 'Comment mesurer une campagne drive-to-store ?', answer: "On suit les signaux disponibles : portée locale, clics, itinéraires, messages, coupons, visites déclarées, ventes remontées ou comparaison par zone. Il faut éviter de promettre une attribution parfaite si la donnée n’existe pas." },
      { question: 'Quels secteurs utilisent le drive-to-store ?', answer: "Retail, GMS, automobile, restauration, événementiel, tourisme et services locaux peuvent l’utiliser lorsque l’objectif est de relier audience locale, offre, contenu et point de vente." },
    ],
  },
] as const satisfies readonly ServiceLanding[];

export const getServiceLandingBySlug = (slug: string) =>
  serviceLandings.find((landing) => landing.slug === slug);
