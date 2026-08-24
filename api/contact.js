import { appendFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const DEFAULT_TO_EMAIL = 'sd.mimouni@richmedia.ma';
const DEFAULT_FROM_EMAIL = 'Richmedia <noreply@richmedia.ma>';
const MAX_BODY_BYTES = 64 * 1024;
const HONEYPOT_FIELD = 'company_url';

const FIELD_LABELS = {
  _form: 'Formulaire',
  _page: 'Page',
};

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function normalizeValue(value) {
  if (Array.isArray(value)) return value.map(normalizeValue).filter(Boolean).join(', ');
  if (value === null || value === undefined) return '';
  return String(value).trim().slice(0, 4000);
}

async function readRawBody(req) {
  if (req.body && typeof req.body !== 'string') return req.body;
  if (typeof req.body === 'string') return req.body;

  let rawBody = '';
  let size = 0;

  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      throw new Error('PAYLOAD_TOO_LARGE');
    }
    rawBody += chunk.toString('utf8');
  }

  return rawBody;
}

async function parseRequestBody(req) {
  const body = await readRawBody(req);
  if (body && typeof body === 'object' && !Buffer.isBuffer(body)) return body;

  const contentType = String(req.headers['content-type'] || '');
  const rawBody = String(body || '');

  if (contentType.includes('application/json')) {
    return rawBody ? JSON.parse(rawBody) : {};
  }

  const params = new URLSearchParams(rawBody);
  return Object.fromEntries(params.entries());
}

function wantsJson(req) {
  return String(req.headers.accept || '').includes('application/json');
}

function sendResponse(req, res, statusCode, payload) {
  res.setHeader('Cache-Control', 'no-store');

  if (wantsJson(req)) {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(payload));
    return;
  }

  const title = payload.ok ? 'Demande envoyée' : 'Erreur d’envoi';
  const message = payload.message || (payload.ok ? 'Votre demande a bien été envoyée.' : 'Merci de réessayer.');

  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(`<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)} - Richmedia</title>
    <style>
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #05060b; color: #fff; font-family: Inter, Arial, sans-serif; }
      main { width: min(100% - 2rem, 560px); border: 1px solid rgba(255,255,255,.14); border-radius: 16px; padding: 2rem; background: rgba(255,255,255,.06); }
      a { color: #a985ff; }
    </style>
  </head>
  <body>
    <main>
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(message)}</p>
      <a href="/">Retour au site</a>
    </main>
  </body>
</html>`);
}

function findField(fields, candidates) {
  const normalized = Object.entries(fields).map(([key, value]) => [
    key.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
    normalizeValue(value),
  ]);

  for (const candidate of candidates) {
    const normalizedCandidate = candidate.toLowerCase();
    const match = normalized.find(([key, value]) => key.includes(normalizedCandidate) && value);
    if (match) return match[1];
  }

  return '';
}

function buildEmail(fields, req) {
  const submittedAt = new Date().toISOString();
  const formName = normalizeValue(fields._form) || 'Formulaire site web';
  const page = normalizeValue(fields._page) || String(req.headers.referer || '');
  const userAgent = String(req.headers['user-agent'] || '');
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();

  const visibleFields = Object.entries(fields)
    .map(([key, value]) => [key, normalizeValue(value)])
    .filter(([key, value]) => value && key !== HONEYPOT_FIELD)
    .filter(([key]) => !key.startsWith('_'));

  const systemFields = [
    ['Formulaire', formName],
    ['Page', page],
    ['Date', submittedAt],
    ['IP', ip],
    ['User-Agent', userAgent],
  ].filter(([, value]) => value);

  const rows = [...systemFields, ...visibleFields].map(([key, value]) => {
    const label = FIELD_LABELS[key] || key;
    return `<tr>
      <th style="padding:10px 12px;text-align:left;border-bottom:1px solid #e7e7ee;color:#5b5570;width:180px;">${escapeHtml(label)}</th>
      <td style="padding:10px 12px;border-bottom:1px solid #e7e7ee;color:#171421;">${escapeHtml(value).replaceAll('\n', '<br />')}</td>
    </tr>`;
  });

  const textLines = [...systemFields, ...visibleFields].map(([key, value]) => `${FIELD_LABELS[key] || key}: ${value}`);

  return {
    formName,
    html: `<div style="font-family:Inter,Arial,sans-serif;color:#171421;">
      <h1 style="margin:0 0 12px;font-size:22px;">Nouvelle demande Richmedia</h1>
      <p style="margin:0 0 20px;color:#5b5570;">Un formulaire du site vient d’être soumis.</p>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e7e7ee;border-radius:12px;overflow:hidden;">${rows.join('')}</table>
    </div>`,
    text: `Nouvelle demande Richmedia\n\n${textLines.join('\n')}`,
  };
}

async function saveLeadToFile({ subject, text, replyTo, reason }) {
  const leadsFile = process.env.CONTACT_LEADS_FILE;
  if (!leadsFile) return false;

  await mkdir(dirname(leadsFile), { recursive: true });
  await appendFile(
    leadsFile,
    `${JSON.stringify({
      createdAt: new Date().toISOString(),
      subject,
      replyTo,
      reason,
      text,
    })}\n`,
    { mode: 0o600 },
  );

  console.warn(`[contact-form] lead saved to CONTACT_LEADS_FILE: ${reason}`);
  return true;
}

async function sendEmail({ subject, html, text, replyTo }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (await saveLeadToFile({ subject, text, replyTo, reason: 'RESEND_API_KEY_MISSING' })) {
      return;
    }

    throw new Error('RESEND_API_KEY_MISSING');
  }

  const to = (process.env.CONTACT_TO_EMAIL || DEFAULT_TO_EMAIL)
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean);
  const from = process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM_EMAIL;

  const payload = {
    from,
    to,
    subject,
    html,
    text,
    ...(replyTo ? { reply_to: replyTo } : {}),
  };

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detail = await response.text();
    if (await saveLeadToFile({ subject, text, replyTo, reason: `RESEND_ERROR: ${detail}` })) {
      return;
    }

    throw new Error(`RESEND_ERROR: ${detail}`);
  }
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Allow', 'POST, OPTIONS');
    res.setHeader('Cache-Control', 'no-store');
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    sendResponse(req, res, 405, { ok: false, message: 'Méthode non autorisée.' });
    return;
  }

  try {
    const fields = await parseRequestBody(req);

    if (normalizeValue(fields[HONEYPOT_FIELD])) {
      sendResponse(req, res, 200, { ok: true, message: 'Votre demande a bien été envoyée.' });
      return;
    }

    const email = findField(fields, ['email', 'e-mail', 'courriel']);
    const phone = findField(fields, ['telephone', 'téléphone', 'phone']);
    const message = findField(fields, ['message', 'objectif', 'objective']);

    if (!email && !phone) {
      sendResponse(req, res, 400, {
        ok: false,
        message: 'Merci de renseigner au moins un email ou un téléphone.',
      });
      return;
    }

    const replyTo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : '';
    const { formName, html, text } = buildEmail(fields, req);

    await sendEmail({
      subject: `[Richmedia] Nouvelle demande - ${formName}`,
      html,
      text: message ? `${text}\n\nMessage principal:\n${message}` : text,
      replyTo,
    });

    sendResponse(req, res, 200, { ok: true, message: 'Votre demande a bien été envoyée.' });
  } catch (error) {
    const isConfigError = error?.message === 'RESEND_API_KEY_MISSING';
    const statusCode = isConfigError ? 503 : 500;
    const message = isConfigError
      ? 'Le service email doit être configuré côté serveur.'
      : 'L’envoi n’a pas abouti. Merci de réessayer ou de nous contacter directement.';

    console.error('[contact-form]', error);
    sendResponse(req, res, statusCode, { ok: false, message });
  }
}
