const soft = process.argv.includes('--soft');
const maxAllowedAge = Number(process.env.SEO_CACHE_MAX_AGE ?? 3600);

const targets = [
  'https://richmedia.ma/robots.txt',
  'https://richmedia.ma/sitemap-index.xml',
  'https://richmedia.ma/sitemap-0.xml',
];

const extractMaxAges = (cacheControl) =>
  [...cacheControl.matchAll(/(?:^|,\s*)s?-?max-age=(\d+)/gi)].map((match) =>
    Number(match[1]),
  );

let failures = 0;

for (const url of targets) {
  const response = await fetch(url, {
    method: 'HEAD',
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
  });

  const cacheControl = response.headers.get('cache-control') ?? '';
  const expires = response.headers.get('expires') ?? '';
  const cfCacheStatus = response.headers.get('cf-cache-status') ?? '';
  const age = response.headers.get('age') ?? '';
  const maxAges = extractMaxAges(cacheControl);
  const hasImmutable = /\bimmutable\b/i.test(cacheControl);
  const hasLongMaxAge = maxAges.some((maxAge) => maxAge > maxAllowedAge);
  const ok = response.ok && !hasImmutable && !hasLongMaxAge;

  if (!ok) {
    failures += 1;
  }

  console.log(`${ok ? 'OK' : 'FAIL'} ${url}`);
  console.log(`  status: ${response.status}`);
  console.log(`  cache-control: ${cacheControl || '(missing)'}`);
  console.log(`  expires: ${expires || '(missing)'}`);
  console.log(`  cf-cache-status: ${cfCacheStatus || '(missing)'}`);
  console.log(`  age: ${age || '(missing)'}`);
}

if (failures > 0) {
  console.error(
    `SEO cache check failed for ${failures} URL(s): remove immutable and keep max-age <= ${maxAllowedAge}s.`,
  );

  if (!soft) {
    process.exit(1);
  }
}
