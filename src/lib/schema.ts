import { BUSINESS, SITE } from '../consts';

/**
 * Fabriques de nodes schema.org (JSON-LD).
 * On empile plusieurs schemas par page (« triple schema stacking ») :
 * LocalBusiness + Service/Article + FAQPage + BreadcrumbList.
 */

export function localBusiness() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE.url}/#organization`,
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    email: BUSINESS.email,
    telephone: BUSINESS.tels[0],
    slogan: SITE.tagline,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.address.street,
      addressLocality: BUSINESS.address.city,
      postalCode: BUSINESS.address.postalCode,
      addressCountry: BUSINESS.address.country,
    },
    areaServed: BUSINESS.areaServed,
    sameAs: BUSINESS.sameAs,
    hasCredential: BUSINESS.accreditations,
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
