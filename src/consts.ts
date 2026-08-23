// Source unique de vérité pour la marque : utilisée par le JSON-LD, le SEO et le footer.
export const SITE = {
  name: 'Richmedia',
  url: import.meta.env.PUBLIC_SITE_URL ?? 'https://richmedia.ma',
  tagline: 'We build digital growth',
  description:
    "Richmedia accompagne les marques au Maroc depuis Casablanca : stratégie, média, SEO/GEO, contenus, web, CRM et IA pour une croissance mesurable.",
  defaultLocale: 'fr' as const,
  locales: ['fr', 'en'] as const,
};

export const BRAND_ASSETS = {
  logo: {
    path: '/assets/richmedia-whatsapp-lp/hero-logo.png',
    width: 240,
    height: 72,
    alt: 'Logo Richmedia',
  },
  image: {
    path: '/og-default.jpg',
    width: 1200,
    height: 630,
    alt: 'Richmedia - agence de performance digitale',
  },
} as const;

export const BUSINESS_ADDRESS = {
  street: "64 Avenue de l'Hermitage",
  city: 'Casablanca',
  postalCode: '20540',
  country: 'MA',
} as const;

export const BUSINESS = {
  legalName: 'Richmedia',
  email: 'contact@richmedia.ma',
  tels: ['+212661172885', '+212661768009'],
  adresse: `${BUSINESS_ADDRESS.street}, ${BUSINESS_ADDRESS.city} ${BUSINESS_ADDRESS.postalCode}, ${BUSINESS_ADDRESS.country}`,
  address: BUSINESS_ADDRESS,
  geo: {
    latitude: 33.5731,
    longitude: -7.5898,
  },
  foundingDate: '2012',
  priceRange: '$$$',
  areaServed: ['Casablanca', 'Dubaï', 'Montréal', 'Strasbourg'],
  sameAs: [
    'https://linkedin.com/company/richmediadigitalagency',
    'http://instagram.com/richmedia.agency/',
    'https://www.facebook.com/richmedia.ma/?locale=fr_FR',
  ],
  accreditations: [
    { name: 'Google Partner', category: 'Certification', issuer: 'Google' },
    { name: 'Google Analytics Certification', category: 'Certification', issuer: 'Google' },
    { name: 'Meta Blueprint Certification', category: 'Certification', issuer: 'Meta' },
    { name: 'HubSpot Certification', category: 'Certification', issuer: 'HubSpot' },
    { name: 'IAB Rich Media Certification', category: 'Accreditation', issuer: 'IAB' },
    { name: 'Semrush Certification', category: 'Certification', issuer: 'Semrush' },
  ],
};

export const CONTACT_FORM = {
  recipient: 'sd.mimouni@richmedia.ma',
  action: 'https://formsubmit.co/sd.mimouni@richmedia.ma',
  ajaxAction: 'https://formsubmit.co/ajax/sd.mimouni@richmedia.ma',
} as const;

export const EDITORIAL_AUTHOR = {
  name: 'Salah Eddine MIMOUNI',
  slug: 'salah-eddine-mimouni',
  image: '/assets/richmedia-home/team-carousel/salah.webp',
  portrait: '/assets/richmedia-home/team-carousel/salah.webp',
  linkedIn: 'https://www.linkedin.com/company/richmedia-ma/',
  email: BUSINESS.email,
  role: {
    fr: 'Fondateur & CEO de Richmedia',
    en: 'Founder & CEO of Richmedia',
  },
  hero: {
    fr:
      'Stratège de la croissance digitale, Salah Eddine accompagne les marques au Maroc et à l’international sur des dispositifs performants et durables : média, SEO/GEO, WhatsApp, CRM, data et automatisation.',
    en:
      'A digital growth strategist, Salah Eddine supports brands in Morocco and internationally across durable performance systems: media, SEO/GEO, WhatsApp, CRM, data and automation.',
  },
  bio: {
    fr:
      'Salah Eddine MIMOUNI, fondateur et CEO de Richmedia, accompagne les marques au Maroc et à l’international sur la stratégie digitale, le média, le SEO/GEO, les contenus, WhatsApp, CRM et l’automatisation.',
    en:
      'Salah Eddine MIMOUNI, founder and CEO of Richmedia, supports brands in Morocco and internationally across digital strategy, media, SEO/GEO, content, WhatsApp, CRM and automation.',
  },
  about: {
    fr: [
      'Passionné par la data, la technologie et l’impact business, Salah Eddine MIMOUNI a fondé Richmedia pour aider les entreprises à accélérer leur croissance digitale avec des stratégies solides, des canaux bien choisis et une exécution rigoureuse.',
      'Il intervient régulièrement sur des sujets de marketing digital moderne, de tendances SEO & GEO, de marketing conversationnel et de mesure de la performance.',
      'Sa conviction : la croissance durable repose sur la combinaison d’une stratégie claire, de la donnée bien exploitée et d’équipes alignées autour d’objectifs mesurables.',
    ],
    en: [
      'Driven by data, technology and business impact, Salah Eddine MIMOUNI founded Richmedia to help companies accelerate digital growth with solid strategies, well-chosen channels and disciplined execution.',
      'He regularly works on modern digital marketing, SEO & GEO trends, conversational marketing and performance measurement.',
      'His belief: durable growth comes from a clear strategy, well-used data and teams aligned around measurable objectives.',
    ],
  },
  credentials: {
    fr: [
      'Ingénieur d’état en informatique',
      'Doctorant en intelligence artificielle',
      'Fondateur de l’agence Richmedia digital',
      'Co-fondateur de Lemon Mind Agency',
      'Co-fondateur et CTO de Hypeo',
      'Co-fondateur de InTalks',
      'Co-fondateur de Oxima AI school',
      'Expert certifié Meta Ads, Google Ads et Google Analytics',
      'Écrivain et conférencier',
    ],
    en: [
      'State engineer in computer science',
      'PhD candidate in artificial intelligence',
      'Founder of Richmedia digital agency',
      'Co-founder of Lemon Mind Agency',
      'Co-founder and CTO of Hypeo',
      'Co-founder of InTalks',
      'Co-founder of Oxima AI school',
      'Certified expert in Meta Ads, Google Ads and Google Analytics',
      'Writer and speaker',
    ],
  },
  expertise: {
    fr: ['Stratégie digitale', 'Média & performance', 'SEO / GEO', 'WhatsApp & automation', 'Data & CRM', 'IA & automatisation'],
    en: ['Digital strategy', 'Media & performance', 'SEO / GEO', 'WhatsApp & automation', 'Data & CRM', 'AI & automation'],
  },
  topics: {
    fr: ['Stratégie digitale', 'Média & performance', 'SEO / GEO', 'WhatsApp & automation', 'Data & CRM'],
    en: ['Digital strategy', 'Media & performance', 'SEO / GEO', 'WhatsApp & automation', 'Data & CRM'],
  },
  experience: '15+',
} as const;

export const EDITORIAL_AUTHORS = {
  [EDITORIAL_AUTHOR.name]: EDITORIAL_AUTHOR,
  'Amal AMAZOUZ': {
    name: 'Amal AMAZOUZ',
    slug: 'amal-amazouz',
    image: '/assets/richmedia-home/team-carousel/amal.webp',
    portrait: '/assets/richmedia-home/team-carousel/amal.webp',
    linkedIn: 'https://www.linkedin.com/company/richmedia-ma/',
    email: BUSINESS.email,
    role: {
      fr: 'COO & CDO de Richmedia',
      en: 'COO & CDO at Richmedia',
    },
    hero: {
      fr:
        'Amal structure les stratégies digitales, les contenus et les dispositifs social media pour transformer les idées en plans d’action mesurables.',
      en:
        'Amal structures digital strategy, content and social media programs to turn ideas into measurable action plans.',
    },
    bio: {
      fr:
        'Amal AMAZOUZ accompagne la structuration des stratégies digitales, des contenus et des dispositifs social media pour transformer les idées en plans d’action mesurables.',
      en:
        'Amal AMAZOUZ supports digital strategy, content and social media programs to turn ideas into measurable action plans.',
    },
    about: {
      fr: [
        'Amal AMAZOUZ accompagne les équipes dans la transformation des objectifs marketing en dispositifs éditoriaux clairs, activables et mesurables.',
        'Son travail relie la stratégie de contenu, le social media, l’influence et la coordination opérationnelle pour garder une cohérence entre idée, message et exécution.',
        'Elle privilégie les formats qui clarifient le positionnement d’une marque et facilitent la lecture de ses preuves par ses audiences.',
      ],
      en: [
        'Amal AMAZOUZ helps teams turn marketing objectives into clear, actionable and measurable editorial systems.',
        'Her work connects content strategy, social media, influence and operational coordination to keep ideas, messages and execution consistent.',
        'She favors formats that clarify a brand position and make its proof easier for audiences to understand.',
      ],
    },
    credentials: {
      fr: ['Stratégie de contenu', 'Coordination social media', 'Pilotage éditorial', 'Structuration de plans d’action'],
      en: ['Content strategy', 'Social media coordination', 'Editorial planning', 'Action plan structuring'],
    },
    expertise: {
      fr: ['Stratégie digitale', 'Influence & social media', 'Brand content', 'Planning éditorial', 'Activation de marque', 'Pilotage opérationnel'],
      en: ['Digital strategy', 'Influence & social media', 'Brand content', 'Editorial planning', 'Brand activation', 'Operations'],
    },
    topics: {
      fr: ['Influence & social media', 'Brand content', 'Stratégie digitale', 'Activation de marque'],
      en: ['Influence & social media', 'Brand content', 'Digital strategy', 'Brand activation'],
    },
    experience: '10+',
  },
  'Tarik EL ABBADI': {
    name: 'Tarik EL ABBADI',
    slug: 'tarik-el-abbadi',
    image: '/assets/richmedia-home/team-carousel/tarik.webp',
    portrait: '/assets/richmedia-home/team-carousel/tarik.webp',
    linkedIn: 'https://www.linkedin.com/company/richmedia-ma/',
    email: BUSINESS.email,
    role: {
      fr: 'Directeur Communication & Event de Richmedia',
      en: 'Communication & Event Director at Richmedia',
    },
    hero: {
      fr:
        'Tarik pilote les sujets communication, événementiel et marque employeur pour aligner message, expérience et impact terrain.',
      en:
        'Tarik leads communication, events and employer-brand topics to align message, experience and field impact.',
    },
    bio: {
      fr:
        'Tarik EL ABBADI pilote les sujets communication, événementiel et marque employeur, avec une attention particulière portée à la cohérence des messages et des expériences.',
      en:
        'Tarik EL ABBADI leads communication, events and employer-brand topics, with a strong focus on message and experience consistency.',
    },
    about: {
      fr: [
        'Tarik EL ABBADI travaille sur les dispositifs où la communication doit être tangible : événements, marque employeur, prises de parole et expériences de marque.',
        'Il veille à la cohérence entre la promesse, les supports, le déroulé terrain et la perception des publics internes ou externes.',
        'Son approche privilégie les messages simples, les expériences maîtrisées et les preuves visibles plutôt que les effets de style isolés.',
      ],
      en: [
        'Tarik EL ABBADI works on systems where communication must become tangible: events, employer brand, public speaking and brand experiences.',
        'He keeps the promise, assets, field execution and internal or external perception consistent.',
        'His approach favors simple messages, controlled experiences and visible proof over isolated stylistic effects.',
      ],
    },
    credentials: {
      fr: ['Communication de marque', 'Événementiel', 'Marque employeur', 'Expérience terrain'],
      en: ['Brand communication', 'Events', 'Employer brand', 'Field experience'],
    },
    expertise: {
      fr: ['Communication', 'Événementiel', 'Marque employeur', 'Brand content', 'Expérience de marque', 'Activation terrain'],
      en: ['Communication', 'Events', 'Employer brand', 'Brand content', 'Brand experience', 'Field activation'],
    },
    topics: {
      fr: ['Marque employeur', 'Communication', 'Événementiel', 'Brand content'],
      en: ['Employer brand', 'Communication', 'Events', 'Brand content'],
    },
    experience: '12+',
  },
} as const;

export const EDITORIAL_AUTHOR_LIST = Object.values(EDITORIAL_AUTHORS);

export type EditorialAuthor = (typeof EDITORIAL_AUTHOR_LIST)[number];

export const getEditorialAuthorMaybe = (value?: string) => {
  if (!value) return undefined;
  if (value in EDITORIAL_AUTHORS) return EDITORIAL_AUTHORS[value as keyof typeof EDITORIAL_AUTHORS];
  return EDITORIAL_AUTHOR_LIST.find((author) => author.slug === value);
};

export const getEditorialAuthor = (value?: string) => getEditorialAuthorMaybe(value) ?? EDITORIAL_AUTHOR;

export const getEditorialAuthorBySlug = (slug?: string) =>
  EDITORIAL_AUTHOR_LIST.find((author) => author.slug === slug) ?? EDITORIAL_AUTHOR;

export const getEditorialAuthorStrict = (value?: string, context?: string) => {
  const author = getEditorialAuthorMaybe(value);
  if (!author) {
    console.warn(`[Richmedia authors] Unknown author "${value ?? 'undefined'}"${context ? ` in ${context}` : ''}`);
  }
  return author;
};

export const getEditorialAuthorPath = (name?: string, lang: 'fr' | 'en' = 'fr') => {
  const author = getEditorialAuthor(name);
  return lang === 'en' ? `/en/authors/${author.slug}/` : `/auteurs/${author.slug}/`;
};
