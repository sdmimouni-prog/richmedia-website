import { BRAND_ASSETS, BUSINESS, SITE } from '../consts';

/**
 * Fabriques de nodes schema.org (JSON-LD).
 * On empile plusieurs schemas par page (« triple schema stacking ») :
 * LocalBusiness + Service/Article + FAQPage + BreadcrumbList.
 */

const absoluteUrl = (source: string) => (source.startsWith('http') ? source : `${SITE.url}${source}`);
const withTrailingSlash = (url: string) => (url.endsWith('/') ? url : `${url}/`);
const ORGANIZATION_ID = `${SITE.url}/#organization`;

type LocalizedText = { fr: string; en: string };
type AuthorSchemaSource = {
  slug: string;
  name: string;
  role: LocalizedText;
  bio: LocalizedText;
  portrait?: string;
  image?: string;
  linkedIn?: string;
  expertise: { fr: readonly string[]; en: readonly string[] };
};

type ArticleAuthorEntity = {
  '@type'?: 'Person' | 'Organization';
  '@id'?: string;
  name: string;
  url?: string;
  image?: string;
};

export const authorCanonicalUrl = (slug: string) => `${SITE.url}/auteurs/${slug}/`;
export const authorPersonId = (slug: string) => `${authorCanonicalUrl(slug)}#person`;
export const authorProfilePageId = (slug: string, lang: 'fr' | 'en' = 'fr') =>
  `${lang === 'en' ? `${SITE.url}/en/authors/${slug}/` : authorCanonicalUrl(slug)}#profilepage`;

const isPersonalLinkedIn = (url?: string) => Boolean(url && /^https?:\/\/(www\.)?linkedin\.com\/in\//i.test(url));

export function authorProfileSchema(opts: {
  author: AuthorSchemaSource;
  lang: 'fr' | 'en';
  profileUrl?: string;
  profileName?: string;
}) {
  const profileUrl = withTrailingSlash(
    opts.profileUrl ?? (opts.lang === 'en' ? `${SITE.url}/en/authors/${opts.author.slug}` : authorCanonicalUrl(opts.author.slug)),
  );
  const image = absoluteUrl(opts.author.portrait ?? opts.author.image ?? BRAND_ASSETS.image.path);
  const sameAs = isPersonalLinkedIn(opts.author.linkedIn) ? [opts.author.linkedIn] : undefined;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${profileUrl}#profilepage`,
        url: profileUrl,
        name:
          opts.profileName ??
          (opts.lang === 'en' ? `${opts.author.name} | Richmedia author` : `${opts.author.name} | Auteur Richmedia`),
        inLanguage: opts.lang,
        mainEntity: { '@id': authorPersonId(opts.author.slug) },
      },
      {
        '@type': 'Person',
        '@id': authorPersonId(opts.author.slug),
        name: opts.author.name,
        url: authorCanonicalUrl(opts.author.slug),
        image,
        jobTitle: opts.author.role[opts.lang],
        description: opts.author.bio[opts.lang],
        knowsAbout: opts.author.expertise[opts.lang],
        worksFor: { '@id': ORGANIZATION_ID },
        ...(sameAs ? { sameAs } : {}),
      },
    ],
  };
}

export function localBusiness() {
  const logoUrl = absoluteUrl(BRAND_ASSETS.logo.path);
  const imageUrl = absoluteUrl(BRAND_ASSETS.image.path);

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': ORGANIZATION_ID,
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
    publisher: { '@id': ORGANIZATION_ID },
  };
}

export function serviceSchema(opts: { name: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    provider: { '@id': ORGANIZATION_ID },
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
    publisher: { '@id': ORGANIZATION_ID },
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
  author: string | ArticleAuthorEntity;
  authorType?: 'Person' | 'Organization';
  authorImage?: string;
  datePublished: Date;
  dateModified: Date;
  image?: string;
  citation?: string[];
}) {
  const pageUrl = withTrailingSlash(opts.url);
  let author: Record<string, unknown>;

  if (typeof opts.author === 'string') {
    author =
      opts.authorType === 'Person'
        ? {
            '@type': 'Person',
            name: opts.author,
            ...(opts.authorImage ? { image: absoluteUrl(opts.authorImage) } : {}),
          }
        : { '@type': 'Organization', name: opts.author };
  } else {
    author = {
      '@type': opts.author['@type'] ?? 'Person',
      ...(opts.author['@id'] ? { '@id': opts.author['@id'] } : {}),
      name: opts.author.name,
      ...(opts.author.url ? { url: absoluteUrl(opts.author.url) } : {}),
      ...(opts.author.image ? { image: absoluteUrl(opts.author.image) } : {}),
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${pageUrl}#article`,
    headline: opts.title,
    description: opts.description,
    url: pageUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    author,
    publisher: { '@id': ORGANIZATION_ID },
    datePublished: opts.datePublished.toISOString(),
    dateModified: opts.dateModified.toISOString(),
    ...(opts.image ? { image: absoluteUrl(opts.image) } : {}),
    ...(opts.citation?.length ? { citation: opts.citation.map(absoluteUrl) } : {}),
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
