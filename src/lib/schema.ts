import { BRAND_ASSETS, BUSINESS, SITE } from '../consts';

/**
 * Fabriques de nodes schema.org (JSON-LD).
 * On empile plusieurs schemas par page (« triple schema stacking ») :
 * LocalBusiness + Service/Article + FAQPage + BreadcrumbList.
 */

const absoluteUrl = (source: string) => (source.startsWith('http') ? source : `${SITE.url}${source}`);

export function localBusiness() {
  const logoUrl = absoluteUrl(BRAND_ASSETS.logo.path);
  const imageUrl = absoluteUrl(BRAND_ASSETS.image.path);

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE.url}/#organization`,
    name: SITE.name,
    legalName: BUSINESS.legalName,
    description: SITE.description,
    url: SITE.url,
    logo: {
      '@type': 'ImageObject',
      '@id': `${SITE.url}/#logo`,
      url: logoUrl,
      contentUrl: logoUrl,
      width: BRAND_ASSETS.logo.width,
      height: BRAND_ASSETS.logo.height,
      caption: BRAND_ASSETS.logo.alt,
    },
    image: {
      '@type': 'ImageObject',
      '@id': `${SITE.url}/#primaryimage`,
      url: imageUrl,
      contentUrl: imageUrl,
      width: BRAND_ASSETS.image.width,
      height: BRAND_ASSETS.image.height,
      caption: BRAND_ASSETS.image.alt,
    },
    email: BUSINESS.email,
    telephone: BUSINESS.tels[0],
    slogan: SITE.tagline,
    foundingDate: BUSINESS.foundingDate,
    priceRange: BUSINESS.priceRange,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.address.street,
      addressLocality: BUSINESS.address.city,
      postalCode: BUSINESS.address.postalCode,
      addressCountry: BUSINESS.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.geo.latitude,
      longitude: BUSINESS.geo.longitude,
    },
    areaServed: BUSINESS.areaServed,
    sameAs: BUSINESS.sameAs,
    hasCredential: BUSINESS.accreditations.map((credential) => ({
      '@type': 'EducationalOccupationalCredential',
      name: credential.name,
      credentialCategory: credential.category,
      recognizedBy: {
        '@type': 'Organization',
        name: credential.issuer,
      },
    })),
  };
}

export function webSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    name: SITE.name,
    alternateName: ['Richmedia.ma', 'Richmedia Digital Agency'],
    description: SITE.description,
    url: SITE.url,
    inLanguage: [...SITE.locales],
    publisher: { '@id': `${SITE.url}/#organization` },
  };
}

export function serviceSchema(opts: { name: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    provider: { '@id': `${SITE.url}/#organization` },
    areaServed: BUSINESS.areaServed,
  };
}

export function collectionPageSchema(opts: {
  name: string;
  description: string;
  url: string;
  items: { name: string; url: string }[];
  inLanguage?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    publisher: { '@id': `${SITE.url}/#organization` },
    ...(opts.inLanguage ? { inLanguage: opts.inLanguage } : {}),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: opts.items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: item.url,
      })),
    },
  };
}

export function articleSchema(opts: {
  title: string;
  description: string;
  url: string;
  author: string;
  authorType?: 'Person' | 'Organization';
  authorImage?: string;
  datePublished: Date;
  dateModified: Date;
  image?: string;
}) {
  const author =
    opts.authorType === 'Person'
      ? {
          '@type': 'Person',
          name: opts.author,
          ...(opts.authorImage ? { image: opts.authorImage } : {}),
        }
      : { '@type': 'Organization', name: opts.author };

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    url: opts.url,
    author,
    publisher: { '@id': `${SITE.url}/#organization` },
    datePublished: opts.datePublished.toISOString(),
    dateModified: opts.dateModified.toISOString(),
    ...(opts.image ? { image: opts.image } : {}),
  };
}

export function faqSchema(faq: { question: string; answer: string }[]) {
  if (!faq.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export function breadcrumbs(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function definedTerm(opts: {
  name: string; description: string; url: string;
  acronym?: string; synonyms?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': `${opts.url}#term`,
    name: opts.name,
    description: opts.description,
    url: opts.url,
    ...(opts.acronym ? { termCode: opts.acronym } : {}),
    ...(opts.synonyms?.length ? { alternateName: opts.synonyms } : {}),
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      '@id': `${SITE.url}/glossaire/#set`,
      name: 'Glossaire marketing digital — Richmedia',
      url: `${SITE.url}/glossaire`,
    },
  };
}

export function definedTermSet(terms: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': `${SITE.url}/glossaire/#set`,
    name: 'Glossaire marketing digital — Richmedia',
    url: `${SITE.url}/glossaire`,
    hasDefinedTerm: terms.map((t) => ({ '@type': 'DefinedTerm', name: t.name, url: t.url })),
  };
}
