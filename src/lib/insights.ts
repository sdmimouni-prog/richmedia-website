import type { CollectionEntry } from 'astro:content';

type InsightArticle = CollectionEntry<'articles'>;
type CaseStudy = CollectionEntry<'cas'>;
export type InsightFilter = 'Growth' | 'Media' | 'SEO' | 'Social' | 'Secteur' | 'Automation' | 'Case';

const insightFilters: InsightFilter[] = ['Growth', 'Media', 'SEO', 'Social', 'Secteur', 'Automation', 'Case'];
const automationPattern = /\b(whatsapp|automation|automatisation|crm)\b/i;

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');

export function matchesWhatsAppAutomation(article: InsightArticle) {
  const fields = [
    article.data.title,
    article.data.metaDescription,
    article.data.keywordPrincipal,
    ...article.data.keywordsSecondaires,
  ];

  return automationPattern.test(normalize(fields.join(' ')));
}

export function getInsightFilters(article: InsightArticle) {
  return [article.data.categorie, ...(matchesWhatsAppAutomation(article) ? ['Automation'] : [])];
}

export function getInsightTopicCounts(articles: InsightArticle[], caseStudies: CaseStudy[]) {
  const counts = Object.fromEntries(insightFilters.map((filter) => [filter, 0])) as Record<InsightFilter, number>;

  articles.forEach((article) => {
    counts[article.data.categorie] += 1;
    if (matchesWhatsAppAutomation(article)) counts.Automation += 1;
  });

  counts.Case = caseStudies.length;

  return counts;
}
