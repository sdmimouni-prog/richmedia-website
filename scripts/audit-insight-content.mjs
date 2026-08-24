import fs from 'node:fs';
import path from 'node:path';

const articleFiles = [
  'campagnes-meta-2026-bonnes-pratiques.mdx',
  'comment-choisir-agence-communication.mdx',
  'contenu-qualite-seo-perenne.mdx',
  'cout-campagne-google-ads-maroc.mdx',
  'createurs-marques-collaborations-durables.mdx',
  'crm-automation-aligner-marketing-sales.mdx',
  'data-decision-strategie-performance.mdx',
  'marque-employeur-attractivite-digitale.mdx',
  'plan-acquisition-digital-2026.mdx',
  'priorites-digitales-2026-croissance-rentable.mdx',
  'seo-vs-geo-enjeux-2026.mdx',
  'whatsapp-business-canal-conversion.mdx',
];

const contentDir = path.join(process.cwd(), 'src', 'content', 'articles');

function splitContent(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  return {
    frontmatter: match?.[1] ?? '',
    body: match?.[2] ?? text,
  };
}

function frontmatterValue(frontmatter, key) {
  return frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]?.replace(/^["']|["']$/g, '') ?? '';
}

function countSources(frontmatter) {
  return frontmatter.includes('\nsources:\n') ? (frontmatter.match(/^\s+- label:/gm) ?? []).length : 0;
}

function countFaq(frontmatter) {
  return frontmatter.includes('\nfaq:\n') ? (frontmatter.match(/^\s+- question:/gm) ?? []).length : 0;
}

function countWords(body) {
  const cleaned = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[[^\]]+\]\([^)]+\)/g, ' ');

  return (cleaned.match(/[A-Za-z0-9À-ÖØ-öø-ÿ]+(?:[’'-][A-Za-z0-9À-ÖØ-öø-ÿ]+)*/g) ?? []).length;
}

function markdownLinks(body) {
  return [...body.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map((match) => match[1]);
}

const rows = articleFiles.map((file) => {
  const filePath = path.join(contentDir, file);
  const text = fs.readFileSync(filePath, 'utf8');
  const { frontmatter, body } = splitContent(text);
  const links = markdownLinks(body);

  return {
    Fichier: file,
    Mots: countWords(body),
    H2: (body.match(/^##\s+/gm) ?? []).length,
    'Liens internes': links.filter((href) => href.startsWith('/')).length,
    'Liens externes': links.filter((href) => /^https?:\/\//.test(href)).length,
    Sources: countSources(frontmatter),
    FAQ: countFaq(frontmatter),
    'Date modification': frontmatterValue(frontmatter, 'dateModification'),
  };
});

console.table(rows);
