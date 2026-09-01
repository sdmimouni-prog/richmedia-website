import { BRAND_ASSETS, BUSINESS, SITE } from '../consts';

/**
 * Fabriques de nodes schema.org (JSON-LD).
 * On empile plusieurs schemas par page (« triple schema stacking ») :
 * LocalBusiness + Service/Article + FAQPage + BreadcrumbList.
 */

const SITE_HOME_URL = new URL(SITE.url).origin + '/';
const SITE_ORIGIN = new URL(SITE.url).origin;
const ORGANIZATION_ID = `${SITE_HOME_URL}#organization`;
const WEBSITE_ID = `${SITE_HOME_URL}#website`;
const ORGANIZATION_TYPES = ['Organization', 'ProfessionalService'];

const hasFileExtension = (pathname: string) => /\/[^/?#]+\.[^/?#]+$/.test(pathname);
const toAbsoluteUrl = (source: string) => new URL(source, SITE_HOME_URL).href;
const absoluteUrl = (source: string) => toAbsoluteUrl(source);
const withTrailingSlash = (source: string) => {
  const url = new URL(source, SITE_HOME_URL);

  if (url.origin === SITE_ORIGIN && url.pathname !== '/' && !url.pathname.endsWith('/') && !hasFileExtension(url.pathname)) {
    url.pathname = `${url.pathname}/`;
  }

  return url.href;
};

const organizationReference = () => {
  const logoUrl = absoluteUrl(BRAND_ASSETS.logo.path);

  return {
    '@type': ORGANIZATION_TYPES,
    '@id': ORGANIZATION_ID,
    name: SITE.name,
    legalName: BUSINESS.legalName,
    url: SITE_HOME_URL,
    logo: {
      '@type': 'ImageObject',
      '@id': `${SITE_HOME_URL}#logo`,
      url: logoUrl,
      contentUrl: logoUrl,
      width: BRAND_ASSETS.logo.width,
      height: BRAND_ASSETS.logo.height,
      caption: BRAND_ASSETS.logo.alt,
    },
  };
};

const offerSchema = (url: string, itemId: string) => ({
  '@type': 'Offer',
  url,
  price: 0,
  priceCurrency: 'MAD',
  availability: 'https://schema.org/InStock',
  itemOffered: { '@id': itemId },
});

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

export const authorCanonicalUrl = (slug: string) => `${SITE_HOME_URL}auteurs/${slug}/`;
export const authorPersonId = (slug: string) => `${authorCanonicalUrl(slug)}#person`;
export const authorProfilePageId = (slug: string, lang: 'fr' | 'en' = 'fr') =>
  `${lang === 'en' ? `${SITE_HOME_URL}en/authors/${slug}/` : authorCanonicalUrl(slug)}#profilepage`;

const isPersonalLinkedIn = (url?: string) => Boolean(url && /^https?:\/\/(www\.)?linkedin\.com\/in\//i.test(url));

export function authorProfileSchema(opts: {
  author: AuthorSchemaSource;
  lang: 'fr' | 'en';
  profileUrl?: string;
  profileName?: string;
}) {
  const profileUrl = withTrailingSlash(
    opts.profileUrl ?? (opts.lang === 'en' ? `${SITE_HOME_URL}en/authors/${opts.author.slug}` : authorCanonicalUrl(opts.author.slug)),
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
    '@type': ORGANIZATION_TYPES,
    '@id': ORGANIZATION_ID,
    name: SITE.name,
    legalName: BUSINESS.legalName,
    description: SITE.description,
    url: SITE_HOME_URL,
    logo: {
      '@type': 'ImageObject',
      '@id': `${SITE_HOME_URL}#logo`,
      url: logoUrl,
      contentUrl: logoUrl,
      width: BRAND_ASSETS.logo.width,
      height: BRAND_ASSETS.logo.height,
      caption: BRAND_ASSETS.logo.alt,
    },
    image: {
      '@type': 'ImageObject',
      '@id': `${SITE_HOME_URL}#primaryimage`,
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
    '@id': WEBSITE_ID,
    name: SITE.name,
    alternateName: ['Richmedia.ma', 'Richmedia Digital Agency'],
    description: SITE.description,
    url: SITE_HOME_URL,
    inLanguage: [...SITE.locales],
    publisher: organizationReference(),
  };
}

export function serviceSchema(opts: { name: string; description: string; url: string }) {
  const url = withTrailingSlash(opts.url);

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name: opts.name,
    description: opts.description,
    url,
    provider: organizationReference(),
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
  const url = withTrailingSlash(opts.url);

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#webpage`,
    name: opts.name,
    description: opts.description,
    url,
    isPartOf: { '@id': WEBSITE_ID },
    publisher: organizationReference(),
    ...(opts.inLanguage ? { inLanguage: opts.inLanguage } : {}),
    mainEntity: {
      '@type': 'ItemList',
      '@id': `${url}#itemlist`,
      itemListElement: opts.items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'WebPage',
          name: item.name,
          url: withTrailingSlash(item.url),
        },
      })),
    },
  };
}

export function webPageSchema(opts: { name: string; description: string; url: string; inLanguage: 'fr' | 'en' }) {
  const url = withTrailingSlash(opts.url);

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    name: opts.name,
    description: opts.description,
    url,
    inLanguage: opts.inLanguage,
    isPartOf: { '@id': WEBSITE_ID },
    publisher: organizationReference(),
  };
}

export function digitalDocumentSchema(opts: {
  id: string;
  name: string;
  description: string;
  url: string;
  encodingFormat: string;
  inLanguage: 'fr' | 'en';
  downloadUrl?: string;
  image?: string;
  datePublished?: Date;
  dateModified?: Date;
}) {
  const url = withTrailingSlash(opts.url);
  const documentId = `${url}#${opts.id}`;
  const imageUrl = opts.image ? absoluteUrl(opts.image) : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'DigitalDocument',
    '@id': documentId,
    name: opts.name,
    headline: opts.name,
    description: opts.description,
    url,
    inLanguage: opts.inLanguage,
    encodingFormat: opts.encodingFormat,
    isAccessibleForFree: true,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
    },
    author: organizationReference(),
    publisher: organizationReference(),
    provider: organizationReference(),
    creator: organizationReference(),
    ...(imageUrl
      ? {
          image: {
            '@type': 'ImageObject',
            '@id': `${documentId}-image`,
            url: imageUrl,
            contentUrl: imageUrl,
          },
          thumbnailUrl: imageUrl,
        }
      : {}),
    ...(opts.downloadUrl
      ? {
          encoding: {
            '@type': 'MediaObject',
            contentUrl: absoluteUrl(opts.downloadUrl),
            encodingFormat: opts.encodingFormat,
          },
        }
      : {}),
    ...(opts.datePublished ? { datePublished: opts.datePublished.toISOString() } : {}),
    ...(opts.dateModified ? { dateModified: opts.dateModified.toISOString() } : {}),
    offers: offerSchema(url, documentId),
  };
}

export function webApplicationSchema(opts: {
  id: string;
  name: string;
  description: string;
  url: string;
  inLanguage: 'fr' | 'en';
  featureList?: string[];
  applicationCategory?: string;
}) {
  const url = withTrailingSlash(opts.url);
  const applicationId = `${url}#${opts.id}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': applicationId,
    name: opts.name,
    description: opts.description,
    url,
    inLanguage: opts.inLanguage,
    applicationCategory: opts.applicationCategory ?? 'BusinessApplication',
    operatingSystem: 'Web browser',
    browserRequirements: 'Requires JavaScript and a modern web browser.',
    isAccessibleForFree: true,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
    },
    publisher: organizationReference(),
    provider: organizationReference(),
    creator: organizationReference(),
    maintainer: organizationReference(),
    ...(opts.featureList?.length ? { featureList: opts.featureList } : {}),
    offers: offerSchema(url, applicationId),
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
  const imageUrl = opts.image ? absoluteUrl(opts.image) : undefined;
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
      ...(opts.author.url ? { url: withTrailingSlash(opts.author.url) } : {}),
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
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
    },
    author,
    publisher: organizationReference(),
    datePublished: opts.datePublished.toISOString(),
    dateModified: opts.dateModified.toISOString(),
    ...(imageUrl
      ? {
          image: {
            '@type': 'ImageObject',
            '@id': `${pageUrl}#primaryimage`,
            url: imageUrl,
            contentUrl: imageUrl,
          },
        }
      : {}),
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
      item: withTrailingSlash(it.url),
    })),
  };
}

export function definedTerm(opts: {
  name: string; description: string; url: string;
  acronym?: string; synonyms?: string[];
}) {
  const url = withTrailingSlash(opts.url);

  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': `${url}#term`,
    name: opts.name,
    description: opts.description,
    url,
    ...(opts.acronym ? { termCode: opts.acronym } : {}),
    ...(opts.synonyms?.length ? { alternateName: opts.synonyms } : {}),
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      '@id': `${SITE_HOME_URL}glossaire/#set`,
      name: 'Glossaire marketing digital — Richmedia',
      url: `${SITE_HOME_URL}glossaire/`,
    },
  };
}

export function definedTermSet(terms: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': `${SITE_HOME_URL}glossaire/#set`,
    name: 'Glossaire marketing digital — Richmedia',
    url: `${SITE_HOME_URL}glossaire/`,
    hasDefinedTerm: terms.map((t) => ({ '@type': 'DefinedTerm', name: t.name, url: withTrailingSlash(t.url) })),
  };
}
