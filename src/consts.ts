// Source unique de vérité pour la marque : utilisée par le JSON-LD, le SEO et le footer.
export const SITE = {
  name: 'Richmedia',
  url: import.meta.env.PUBLIC_SITE_URL ?? 'https://richmedia.ma',
  tagline: 'We build digital growth',
  description:
    "Agence de performance digitale au Maroc basée à Casablanca : stratégie, média, SEO/GEO, social ads, web, CRM et IA pour générer une croissance mesurable.",
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

export const EDITORIAL_AUTHOR = {
  name: 'Salah Eddine MIMOUNI',
  image: '/assets/richmedia-home/team-carousel/salah.webp',
  role: {
    fr: 'Fondateur & CEO de Richmedia',
    en: 'Founder & CEO of Richmedia',
  },
  bio: {
    fr:
      'Salah Eddine MIMOUNI, fondateur et CEO de Richmedia, accompagne les marques au Maroc et à l’international sur la stratégie digitale, le média, le SEO/GEO, les contenus, WhatsApp, CRM et l’automatisation.',
    en:
      'Salah Eddine MIMOUNI, founder and CEO of Richmedia, supports brands in Morocco and internationally across digital strategy, media, SEO/GEO, content, WhatsApp, CRM and automation.',
  },
} as const;

export const EDITORIAL_AUTHORS = {
  [EDITORIAL_AUTHOR.name]: EDITORIAL_AUTHOR,
  'Amal AMAZOUZ': {
    name: 'Amal AMAZOUZ',
    image: '/assets/richmedia-home/team-carousel/amal.webp',
    role: {
      fr: 'COO & CDO de Richmedia',
      en: 'COO & CDO at Richmedia',
    },
    bio: {
      fr:
        'Amal AMAZOUZ accompagne la structuration des stratégies digitales, des contenus et des dispositifs social media pour transformer les idées en plans d’action mesurables.',
      en:
        'Amal AMAZOUZ supports digital strategy, content and social media programs to turn ideas into measurable action plans.',
    },
  },
  'Tarik EL ABBADI': {
    name: 'Tarik EL ABBADI',
    image: '/assets/richmedia-home/team-carousel/tarik.webp',
    role: {
      fr: 'Directeur Communication & Event de Richmedia',
      en: 'Communication & Event Director at Richmedia',
    },
    bio: {
      fr:
        'Tarik EL ABBADI pilote les sujets communication, événementiel et marque employeur, avec une attention particulière portée à la cohérence des messages et des expériences.',
      en:
        'Tarik EL ABBADI leads communication, events and employer-brand topics, with a strong focus on message and experience consistency.',
    },
  },
} as const;

export const getEditorialAuthor = (name?: string) =>
  name && name in EDITORIAL_AUTHORS ? EDITORIAL_AUTHORS[name as keyof typeof EDITORIAL_AUTHORS] : EDITORIAL_AUTHOR;
