import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const TITLE_MIN = 25;
const TITLE_MAX = 60;
const DESCRIPTION_MIN = 80;
const DESCRIPTION_MAX = 160;

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return entry.isFile() && entry.name.endsWith('.html') ? [fullPath] : [];
  });
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCharCode(Number.parseInt(code, 16)))
    .trim();
}

function parseAttributes(tag) {
  const attributes = {};
  for (const match of tag.matchAll(/([:\w-]+)\s*=\s*(['"])(.*?)\2/gis)) {
    attributes[match[1].toLowerCase()] = decodeHtml(match[3]);
  }
  return attributes;
}

function getMetaContent(html, key, value) {
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attrs = parseAttributes(match[0]);
    if ((attrs[key] ?? '').toLowerCase() === value.toLowerCase()) {
      return attrs.content ?? '';
    }
  }
  return '';
}

function fileToUrl(file) {
  const relative = path.relative(distDir, file).replaceAll(path.sep, '/');
  if (relative === 'index.html') return '/';
  if (relative.endsWith('/index.html')) return `/${relative.slice(0, -'index.html'.length)}`;
  return `/${relative.replace(/\.html$/, '')}`;
}

function getLang(html, url) {
  const htmlTag = html.match(/<html\b[^>]*>/i)?.[0] ?? '';
  const lang = parseAttributes(htmlTag).lang;
  if (lang) return lang.startsWith('en') ? 'en' : 'fr';
  return url.startsWith('/en/') || url === '/en/' ? 'en' : 'fr';
}

const files = walk(distDir);
if (!files.length) {
  console.log('⚠ dist/ introuvable ou vide. Lancez npm run build avant npm run seo:audit.');
  process.exit(0);
}

const pages = files.map((file) => {
  const html = fs.readFileSync(file, 'utf8');
  const url = fileToUrl(file);
  const title = decodeHtml(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '');
  const description = getMetaContent(html, 'name', 'description');
  const robots = getMetaContent(html, 'name', 'robots').toLowerCase();
  const canonical = html.match(/<link\b[^>]*rel=(['"])canonical\1[^>]*>/i)?.[0] ?? '';
  return {
    url,
    lang: getLang(html, url),
    title,
    description,
    titleLength: title.length,
    descriptionLength: description.length,
    robots,
    canonical: parseAttributes(canonical).href ?? '',
    indexable: !robots.includes('noindex') && !title.toLowerCase().startsWith('redirecting to'),
    warnings: [],
  };
});

const indexablePages = pages.filter((page) => page.indexable);

for (const page of indexablePages) {
  if (!page.title) page.warnings.push('⚠ title absent');
  if (!page.description) page.warnings.push('⚠ description absente');
  if (page.title && page.titleLength > TITLE_MAX) page.warnings.push(`⚠ title potentiellement trop long (${page.titleLength})`);
  if (page.title && page.titleLength < TITLE_MIN) page.warnings.push(`⚠ title potentiellement trop court (${page.titleLength})`);
  if (page.description && page.descriptionLength > DESCRIPTION_MAX) page.warnings.push(`⚠ description > 160 (${page.descriptionLength})`);
  if (page.description && page.descriptionLength < DESCRIPTION_MIN) page.warnings.push(`⚠ description très courte (${page.descriptionLength})`);
}

function addDuplicateWarnings(field, label) {
  const groups = new Map();
  for (const page of indexablePages) {
    const value = page[field];
    if (!value) continue;
    groups.set(value, [...(groups.get(value) ?? []), page]);
  }
  for (const group of groups.values()) {
    if (group.length < 2) continue;
    for (const page of group) {
      page.warnings.push(`⚠ ${label} dupliqué (${group.length} pages)`);
    }
  }
}

addDuplicateWarnings('title', 'title');
addDuplicateWarnings('description', 'description');

const warningPages = indexablePages.filter((page) => page.warnings.length);
const counts = indexablePages.reduce(
  (acc, page) => {
    acc.total += 1;
    acc[page.lang] += 1;
    return acc;
  },
  { total: 0, fr: 0, en: 0 },
);

console.log('SEO meta audit');
console.log(`Pages indexables analysées : ${counts.total} (FR: ${counts.fr}, EN: ${counts.en})`);
console.log(`Pages noindex ignorées : ${pages.length - indexablePages.length}`);
console.log(`Pages avec warnings : ${warningPages.length}`);

if (warningPages.length) {
  console.log('\nWarnings');
  for (const page of warningPages) {
    console.log(`- ${page.url} [${page.lang}]`);
    for (const warning of page.warnings) console.log(`  ${warning}`);
    console.log(`  title (${page.titleLength}): ${page.title || '—'}`);
    console.log(`  description (${page.descriptionLength}): ${page.description || '—'}`);
  }
}
