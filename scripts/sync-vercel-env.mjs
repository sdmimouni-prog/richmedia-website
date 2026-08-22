import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const targets = {
  development: {
    file: '.env.development',
    required: [
      'PUBLIC_SITE_URL',
      'PUBLIC_OG_IMAGE_URL',
      'CONTACT_TO_EMAIL',
      'CONTACT_FROM_EMAIL',
    ],
  },
  preview: {
    file: '.env.production',
    required: [
      'PUBLIC_SITE_URL',
      'PUBLIC_OG_IMAGE_URL',
      'CONTACT_TO_EMAIL',
      'CONTACT_FROM_EMAIL',
    ],
  },
  production: {
    file: '.env.production',
    required: [
      'PUBLIC_SITE_URL',
      'PUBLIC_OG_IMAGE_URL',
      'CONTACT_TO_EMAIL',
      'CONTACT_FROM_EMAIL',
    ],
  },
};

const optionalKeys = [
  'RESEND_API_KEY',
  'PUBLIC_GTM_ID',
  'PUBLIC_GA4_ID',
  'PUBLIC_META_PIXEL_ID',
  'PUBLIC_LINKEDIN_PARTNER_ID',
];
const sensitiveKeys = new Set(['RESEND_API_KEY']);
const selected = process.argv[2] || 'all';
const targetNames = selected === 'all' ? Object.keys(targets) : [selected];

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

function addEnv(key, value, target) {
  const args = [
    'exec',
    'vercel',
    '--',
    'env',
    'add',
    key,
    target,
    '--force',
    '--yes',
    sensitiveKeys.has(key) ? '--sensitive' : '--no-sensitive',
  ];

  const result = spawnSync('npm', args, {
    cwd: process.cwd(),
    input: `${value}\n`,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || '').trim();
    throw new Error(`Could not sync ${key} for ${target}.${detail ? `\n${detail}` : ''}`);
  }
}

for (const target of targetNames) {
  const config = targets[target];
  if (!config) {
    console.error(`Unknown target "${target}". Use development, preview, production or all.`);
    process.exit(1);
  }

  const envPath = resolve(process.cwd(), config.file);
  if (!existsSync(envPath)) {
    console.error(`Missing ${config.file}.`);
    process.exit(1);
  }

  const values = parseEnv(readFileSync(envPath, 'utf8'));
  const keys = [...config.required, ...optionalKeys];
  const missing = config.required.filter((key) => !values[key]);

  if (missing.length) {
    console.error(`${target}: missing required values in ${config.file}: ${missing.join(', ')}`);
    process.exit(1);
  }

  for (const key of keys) {
    if (!values[key]) continue;
    addEnv(key, values[key], target);
    console.log(`${target}: synced ${key}${sensitiveKeys.has(key) ? ' as secret' : ''}`);
  }

  if (!values.RESEND_API_KEY && target !== 'development') {
    console.warn(`${target}: skipped RESEND_API_KEY because it is empty in ${config.file}`);
  }
}
