import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function isValidPort(value) {
  const port = Number.parseInt(value, 10);
  return String(port) === value && port > 0 && port <= 65535;
}

const profiles = {
  development: {
    file: '.env.development',
    required: [
      'ASTRO_HOST',
      'ASTRO_PORT',
      'PUBLIC_SITE_URL',
      'PUBLIC_OG_IMAGE_URL',
      'CONTACT_TO_EMAIL',
      'CONTACT_FROM_EMAIL',
    ],
    optional: [
      'CONTACT_LEADS_FILE',
      'CONTACT_API_HOST',
      'CONTACT_API_PORT',
      'RESEND_API_KEY',
      'PUBLIC_GTM_ID',
      'PUBLIC_GA4_ID',
      'PUBLIC_META_PIXEL_ID',
      'PUBLIC_LINKEDIN_PARTNER_ID',
    ],
    checks: {
      ASTRO_PORT: (value) => value === '4321',
      CONTACT_API_PORT: isValidPort,
      PUBLIC_SITE_URL: (value) => value === 'http://localhost:4321',
    },
  },
  production: {
    file: '.env.production',
    required: [
      'PUBLIC_SITE_URL',
      'PUBLIC_OG_IMAGE_URL',
      'CONTACT_TO_EMAIL',
      'CONTACT_FROM_EMAIL',
    ],
    optional: [
      'ASTRO_HOST',
      'ASTRO_PORT',
      'CONTACT_LEADS_FILE',
      'CONTACT_API_HOST',
      'CONTACT_API_PORT',
      'RESEND_API_KEY',
      'PUBLIC_GTM_ID',
      'PUBLIC_GA4_ID',
      'PUBLIC_META_PIXEL_ID',
      'PUBLIC_LINKEDIN_PARTNER_ID',
    ],
    checks: {
      CONTACT_API_PORT: isValidPort,
      PUBLIC_SITE_URL: (value) => value === 'https://www.richmedia.ma',
      PUBLIC_OG_IMAGE_URL: (value) => value.startsWith('https://www.richmedia.ma/'),
    },
  },
};

const profileName = process.argv[2] || 'development';
const profile = profiles[profileName];

if (!profile) {
  console.error(`Unknown environment "${profileName}". Use development or production.`);
  process.exit(1);
}

const envPath = resolve(process.cwd(), profile.file);

if (!existsSync(envPath)) {
  console.error(`Missing ${profile.file}.`);
  process.exit(1);
}

function parseEnv(source) {
  const values = {};

  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const separatorIndex = line.indexOf('=');
    if (separatorIndex < 0) continue;

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    values[key] = value;
  }

  return values;
}

const values = parseEnv(readFileSync(envPath, 'utf8'));
const missing = profile.required.filter((key) => !values[key]);
const invalid = Object.entries(profile.checks || {})
  .filter(([key, check]) => values[key] && !check(values[key]))
  .map(([key]) => key);
const warnings = [];

if (profileName === 'production' && !values.RESEND_API_KEY && !values.CONTACT_LEADS_FILE) {
  missing.push('RESEND_API_KEY or CONTACT_LEADS_FILE');
}

if (profileName === 'production' && !values.RESEND_API_KEY && values.CONTACT_LEADS_FILE) {
  warnings.push('RESEND_API_KEY is empty; contact leads will be saved to CONTACT_LEADS_FILE until email delivery is configured.');
}

if (profileName === 'development' && !values.RESEND_API_KEY && !values.CONTACT_LEADS_FILE) {
  warnings.push('RESEND_API_KEY is empty and CONTACT_LEADS_FILE is not set; local contact submissions will return a configuration error.');
}

if (missing.length || invalid.length) {
  if (missing.length) console.error(`Missing required values: ${missing.join(', ')}`);
  if (invalid.length) console.error(`Invalid values: ${invalid.join(', ')}`);
  process.exit(1);
}

const configured = [...profile.required, ...profile.optional].filter((key) => values[key]);
console.log(`${profileName} environment OK: ${configured.length} variable(s) configured in ${profile.file}.`);
warnings.forEach((warning) => console.warn(`${profileName} warning: ${warning}`));
