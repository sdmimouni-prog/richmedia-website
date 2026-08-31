import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const siteUrl = process.env.PUBLIC_SITE_URL ?? 'https://www.richmedia.ma';
const organizationId = `${siteUrl}/#organization`;

const typeIncludes = (node, type) => {
  const value = node?.['@type'];
  return Array.isArray(value) ? value.includes(type) : value === type;
};

const listSlugs = (dir) => {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, 'fr'));
};

const decodeJson = (value) =>
  value
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

const flattenSchema = (schema) => {
  if (Array.isArray(schema)) return schema.flatMap(flattenSchema);
  if (schema?.['@graph']) return [schema, ...flattenSchema(schema['@graph'])];
  return schema ? [schema] : [];
};

const readSchemas = (file) => {
  if (!existsSync(file)) return [];
  const html = readFileSync(file, 'utf8');
  const matches = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g)];
  return matches.flatMap((match) => {
    try {
      return flattenSchema(JSON.parse(decodeJson(match[1].trim())));
    } catch (error) {
      throw new Error(`Invalid JSON-LD in ${file}: ${error.message}`);
    }
  });
};

const collectArticleFiles = (dir) =>
  listSlugs(dir)
    .map((slug) => ({ slug, file: path.join(dir, slug, 'index.html') }))
    .filter(({ file }) => existsSync(file));

const errors = [];
const warnings = [];
const authorDir = path.join(distDir, 'auteurs');
const englishAuthorDir = path.join(distDir, 'en', 'authors');
const authorSlugs = listSlugs(authorDir);
const authors = authorSlugs.map((slug) => {
  const file = path.join(authorDir, slug, 'index.html');
  const schemas = readSchemas(file);
  const profilePages = schemas.filter((node) => typeIncludes(node, 'ProfilePage'));
  const persons = schemas.filter((node) => typeIncludes(node, 'Person'));
  const profilePage = profilePages[0];
  const person = persons[0];

  if (!profilePage) errors.push(`Missing ProfilePage on /auteurs/${slug}/`);
  if (!person) errors.push(`Missing Person on /auteurs/${slug}/`);
  if (profilePages.length > 1) errors.push(`Duplicate ProfilePage nodes on /auteurs/${slug}/`);
  if (persons.length > 1) errors.push(`Duplicate Person nodes on /auteurs/${slug}/`);
  if (person?.worksFor?.['@id'] !== organizationId) errors.push(`Invalid worksFor on /auteurs/${slug}/`);
  if (person?.image && !person.image.startsWith('http')) errors.push(`Relative Person image on /auteurs/${slug}/`);
  if (!Array.isArray(person?.knowsAbout) || person.knowsAbout.length === 0) {
    errors.push(`Missing knowsAbout on /auteurs/${slug}/`);
  }

  const englishFile = path.join(englishAuthorDir, slug, 'index.html');
  const englishPerson = readSchemas(englishFile).find((node) => typeIncludes(node, 'Person'));
  if (!existsSync(englishFile)) errors.push(`Missing EN author page /en/authors/${slug}/`);
  if (englishPerson?.['@id'] && person?.['@id'] && englishPerson['@id'] !== person['@id']) {
    errors.push(`EN Person @id differs from FR Person @id for ${slug}`);
  }

  return {
    slug,
    name: person?.name ?? slug,
    page: `/auteurs/${slug}/`,
    personId: person?.['@id'],
    linkedIn: Array.isArray(person?.sameAs) && person.sameAs.length > 0 ? person.sameAs.join(', ') : 'absent',
    expertise: Array.isArray(person?.knowsAbout) ? person.knowsAbout.length : 0,
    articles: 0,
    sampleArticle: undefined,
  };
});

if (authors.length !== 3) {
  errors.push(`Expected 3 author pages, found ${authors.length}`);
}

const authorsByPersonId = new Map(authors.filter((author) => author.personId).map((author) => [author.personId, author]));
const articleFiles = [
  ...collectArticleFiles(path.join(distDir, 'insights')),
  ...collectArticleFiles(path.join(distDir, 'en', 'insights')),
];

for (const { slug, file } of articleFiles) {
  const article = readSchemas(file).find((node) => typeIncludes(node, 'Article'));
  if (!article) continue;

  if (!article.mainEntityOfPage?.['@id']) errors.push(`Missing mainEntityOfPage on article ${slug}`);
  if (article.publisher?.['@id'] !== organizationId) errors.push(`Invalid publisher on article ${slug}`);
  if (article.image && !String(article.image).startsWith('http')) errors.push(`Relative image on article ${slug}`);

  const author = article.author;
  const personId = author?.['@id'];
  if (!personId || !authorsByPersonId.has(personId)) {
    warnings.push(`Unknown or unlinked author on article ${slug}: ${author?.name ?? 'missing author'}`);
    continue;
  }
  if (!author.url || !author.url.startsWith(`${siteUrl}/auteurs/`)) {
    errors.push(`Invalid author.url on article ${slug}`);
  }

  const matchedAuthor = authorsByPersonId.get(personId);
  matchedAuthor.articles += 1;
  matchedAuthor.sampleArticle ??= slug;
}

for (const author of authors) {
  if (author.articles === 0) warnings.push(`No Article JSON-LD found for ${author.name}`);
}

console.log('\n## Audit auteurs Richmedia\n');
console.log('| Auteur | Slug | Page | Articles | LinkedIn | Expertise |');
console.log('| --- | --- | --- | ---: | --- | ---: |');
for (const author of authors) {
  console.log(`| ${author.name} | ${author.slug} | ${author.page} | ${author.articles} | ${author.linkedIn} | ${author.expertise} |`);
}

console.log('\n## Articles contrôlés\n');
for (const author of authors) {
  console.log(`- ${author.name}: ${author.sampleArticle ?? 'aucun article détecté'}`);
}

if (warnings.length) {
  console.log('\n## Warnings\n');
  for (const warning of warnings) console.log(`- ${warning}`);
}

if (errors.length) {
  console.log('\n## Erreurs\n');
  for (const error of errors) console.log(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`\nOrganization @id: ${organizationId}`);
  console.log('Audit schema auteurs: OK');
}
