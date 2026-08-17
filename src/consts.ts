// Source unique de vérité pour la marque : utilisée par le JSON-LD, le SEO et le footer.
export const SITE = {
  name: 'Richmedia',
  url: import.meta.env.PUBLIC_SITE_URL ?? 'https://richmedia.ma',
  tagline: 'We build digital growth',
  description:
    "Agence de marketing digital et de performance à Casablanca : stratégie, media performance, développement web et IA. Nous générons une croissance mesurable.",
  defaultLocale: 'fr' as const,
  locales: ['fr', 'en'] as const,
};

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
  areaServed: ['Casablanca', 'Dubaï', 'Montréal', 'Strasbourg'],
  sameAs: [
    'https://linkedin.com/company/richmediadigitalagency',
    'http://instagram.com/richmedia.agency/',
    'https://www.facebook.com/richmedia.ma/?locale=fr_FR',
  ],
  accreditations: ['Google Partner', 'Google Analytics', 'Meta Blueprint', 'HubSpot', 'IAB Rich Media'],
};
