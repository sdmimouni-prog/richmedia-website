import { randomInt, randomUUID } from 'node:crypto';
import {
  BAROMETER_FOLLOW_UP_TEMPLATE_ID,
  getBarometerFollowUpIdempotencyKey,
} from './barometer-follow-up-email.js';
import { appendLeadRecord } from './lead-store.js';

const DEFAULT_TO_EMAIL = 'sd.mimouni@richmedia.ma';
const BAROMETER_CC_EMAILS = ['a.amazouz@richmedia.ma', 't.elabbadi@richmedia.ma'];
const DEFAULT_FROM_EMAIL = 'Richmedia <noreply@richmedia.ma>';
const MAX_BODY_BYTES = 64 * 1024;
const HONEYPOT_FIELD = 'company_url';
const FOLLOW_UP_TIME_ZONE = 'Africa/Casablanca';
const FOLLOW_UP_WINDOW_START_HOUR = 10;
const FOLLOW_UP_WINDOW_END_HOUR = 18;

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

function normalizeSearchText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
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
  const normalizedCandidates = candidates.map(normalizeSearchText).filter(Boolean);
  const normalized = Object.entries(fields).map(([key, value]) => [
    normalizeSearchText(key),
    normalizeValue(value),
  ]);

  for (const normalizedCandidate of normalizedCandidates) {
    const match = normalized.find(([key, value]) => key.includes(normalizedCandidate) && value);
    if (match) return match[1];
  }

  return '';
}

function getVisibleFieldEntries(fields) {
  return Object.entries(fields)
    .map(([key, value]) => [key, normalizeValue(value)])
    .filter(([key, value]) => value && key !== HONEYPOT_FIELD)
    .filter(([key]) => !key.startsWith('_'));
}

function parseEmailList(value) {
  return String(value || '')
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean);
}

function mergeEmailLists(...lists) {
  const seen = new Set();
  const emails = [];

  lists.flat().forEach((email) => {
    const normalizedEmail = String(email || '').trim();
    const key = normalizedEmail.toLowerCase();
    if (!normalizedEmail || seen.has(key)) return;
    seen.add(key);
    emails.push(normalizedEmail);
  });

  return emails;
}

function isBarometerForm(fields) {
  const formName = normalizeSearchText(fields._form);
  return formName.includes('barometre') || formName.includes('barometer');
}

function getCcRecipients(fields) {
  if (isBarometerForm(fields)) {
    return BAROMETER_CC_EMAILS;
  }

  return [];
}

function getSourcePage(fields, req) {
  return (
    normalizeValue(fields._page)
    || normalizeValue(fields.Source)
    || normalizeValue(fields.source)
    || String(req.headers.referer || '')
  );
}

function detectLanguage(fields, sourcePage) {
  const explicitLanguage = normalizeSearchText(fields._language || fields.language || fields.Langue);
  if (explicitLanguage.startsWith('en')) return 'en';
  if (explicitLanguage.startsWith('fr')) return 'fr';

  try {
    const pathname = new URL(sourcePage).pathname;
    if (pathname === '/en' || pathname.startsWith('/en/')) return 'en';
  } catch {
    if (String(sourcePage || '').includes('/en/')) return 'en';
  }

  const formName = normalizeSearchText(fields._form);
  if (formName.includes('morocco') || formName.includes('download')) return 'en';

  return 'fr';
}

function splitFullName(fullName) {
  const cleanedName = normalizeValue(fullName).replace(/\s+/g, ' ');
  if (!cleanedName) return { firstName: '', lastName: '' };

  if (cleanedName.includes(',')) {
    const [lastName, ...firstNameParts] = cleanedName.split(',').map((part) => part.trim()).filter(Boolean);
    return {
      firstName: firstNameParts.join(' '),
      lastName: lastName || '',
    };
  }

  const parts = cleanedName.split(' ');
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' '),
  };
}

function getTimeZoneParts(date, timeZone) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);

  return Object.fromEntries(
    parts
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, Number.parseInt(part.value, 10)]),
  );
}

function padNumber(value) {
  return String(value).padStart(2, '0');
}

function formatLocalDateTime(date, timeZone) {
  const parts = getTimeZoneParts(date, timeZone);
  return `${parts.year}-${padNumber(parts.month)}-${padNumber(parts.day)}T${padNumber(parts.hour)}:${padNumber(parts.minute)}:${padNumber(parts.second)}`;
}

function addDaysToPlainDate({ year, month, day }, days) {
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  };
}

function getTimeZoneOffsetMs(date, timeZone) {
  const parts = getTimeZoneParts(date, timeZone);
  const localAsUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  return localAsUtc - date.getTime();
}

function zonedTimeToUtc({ year, month, day, hour, minute, second }, timeZone) {
  let utcTimestamp = Date.UTC(year, month - 1, day, hour, minute, second);

  for (let index = 0; index < 3; index += 1) {
    const offset = getTimeZoneOffsetMs(new Date(utcTimestamp), timeZone);
    utcTimestamp = Date.UTC(year, month - 1, day, hour, minute, second) - offset;
  }

  return new Date(utcTimestamp);
}

function getRandomFollowUpLocalTime() {
  const windowStartMinute = FOLLOW_UP_WINDOW_START_HOUR * 60;
  const windowEndMinute = FOLLOW_UP_WINDOW_END_HOUR * 60;
  const scheduledMinute = randomInt(windowStartMinute, windowEndMinute);

  return {
    hour: Math.floor(scheduledMinute / 60),
    minute: scheduledMinute % 60,
    second: randomInt(0, 60),
  };
}

function getFollowUpSchedule(submittedAt, leadId) {
  const submittedLocalDate = getTimeZoneParts(submittedAt, FOLLOW_UP_TIME_ZONE);
  const scheduledPlainDate = addDaysToPlainDate(submittedLocalDate, 1);
  const scheduledLocalTime = getRandomFollowUpLocalTime();
  const scheduledAt = zonedTimeToUtc(
    {
      ...scheduledPlainDate,
      ...scheduledLocalTime,
    },
    FOLLOW_UP_TIME_ZONE,
  );

  return {
    status: 'scheduled',
    templateId: BAROMETER_FOLLOW_UP_TEMPLATE_ID,
    idempotencyKey: getBarometerFollowUpIdempotencyKey(leadId),
    scheduledAt: scheduledAt.toISOString(),
    scheduledLocal: `${scheduledPlainDate.year}-${padNumber(scheduledPlainDate.month)}-${padNumber(scheduledPlainDate.day)}T${padNumber(scheduledLocalTime.hour)}:${padNumber(scheduledLocalTime.minute)}:${padNumber(scheduledLocalTime.second)}`,
    windowStart: `${padNumber(FOLLOW_UP_WINDOW_START_HOUR)}:00`,
    windowEnd: `${padNumber(FOLLOW_UP_WINDOW_END_HOUR)}:00`,
    timeZone: FOLLOW_UP_TIME_ZONE,
    randomized: true,
  };
}

function buildLeadRecord(fields, req, { submittedAt, sourcePage, replyTo, cc }) {
  const id = randomUUID();
  const fullName = findField(fields, ['nom et prenom', 'nom complet', 'full name', 'name']);
  const { firstName, lastName } = splitFullName(fullName);
  const email = findField(fields, ['email professionnel', 'professional email', 'email', 'e mail', 'courriel']);
  const company = findField(fields, ['societe', 'company', 'organisation', 'organization']);
  const language = detectLanguage(fields, sourcePage);
  const barometerLead = isBarometerForm(fields);

  return {
    type: 'lead',
    schemaVersion: 1,
    id,
    formName: normalizeValue(fields._form) || 'Formulaire site web',
    language,
    submittedAt: submittedAt.toISOString(),
    submittedAtLocal: formatLocalDateTime(submittedAt, FOLLOW_UP_TIME_ZONE),
    sourcePage,
    fullName,
    firstName,
    lastName,
    email,
    company,
    replyTo,
    followUp: barometerLead
      ? getFollowUpSchedule(submittedAt, id)
      : { status: 'not_applicable', reason: 'NOT_BAROMETER_FORM' },
    internalAlert: {
      to: mergeEmailLists(parseEmailList(process.env.CONTACT_TO_EMAIL || DEFAULT_TO_EMAIL)),
      cc: mergeEmailLists(cc),
      status: 'pending',
    },
    fields: Object.fromEntries(getVisibleFieldEntries(fields)),
    userAgent: String(req.headers['user-agent'] || ''),
    ip: String(req.headers['x-forwarded-for'] || '').split(',')[0].trim(),
  };
}

function buildEmail(fields, req, { submittedAt, sourcePage }) {
  const submittedAtIso = submittedAt.toISOString();
  const formName = normalizeValue(fields._form) || 'Formulaire site web';
  const subject = normalizeValue(fields._subject) || `[Richmedia] Nouvelle demande - ${formName}`;
  const page = sourcePage;
  const userAgent = String(req.headers['user-agent'] || '');
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();

  const visibleFields = getVisibleFieldEntries(fields);

  const systemFields = [
    ['Formulaire', formName],
    ['Page', page],
    ['Date', submittedAtIso],
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
    subject,
    html: `<div style="font-family:Inter,Arial,sans-serif;color:#171421;">
      <h1 style="margin:0 0 12px;font-size:22px;">Nouvelle demande Richmedia</h1>
      <p style="margin:0 0 20px;color:#5b5570;">Un formulaire du site vient d’être soumis.</p>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e7e7ee;border-radius:12px;overflow:hidden;">${rows.join('')}</table>
    </div>`,
    text: `Nouvelle demande Richmedia\n\n${textLines.join('\n')}`,
  };
}

async function saveLeadToFile(leadRecord) {
  const saved = await appendLeadRecord(leadRecord);
  if (!saved) return false;

  console.warn('[contact-form] lead saved to CONTACT_LEADS_FILE');
  return true;
}

async function trySaveLeadToFile(leadRecord) {
  try {
    return await saveLeadToFile(leadRecord);
  } catch (error) {
    console.error('[contact-form] lead persistence failed', error);
    return false;
  }
}

async function sendEmail({ subject, html, text, replyTo, cc = [] }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY_MISSING');
  }

  const to = mergeEmailLists(parseEmailList(process.env.CONTACT_TO_EMAIL || DEFAULT_TO_EMAIL));
  const from = process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM_EMAIL;
  const copyRecipients = mergeEmailLists(cc);

  const payload = {
    from,
    to,
    ...(copyRecipients.length ? { cc: copyRecipients } : {}),
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
    const submittedAt = new Date();
    const sourcePage = getSourcePage(fields, req);
    const cc = getCcRecipients(fields);
    const leadRecord = buildLeadRecord(fields, req, { submittedAt, sourcePage, replyTo, cc });
    const { subject, html, text } = buildEmail(fields, req, { submittedAt, sourcePage });
    const emailText = message ? `${text}\n\nMessage principal:\n${message}` : text;
    let internalAlertError = null;

    leadRecord.internalAlert.subject = subject;

    try {
      await sendEmail({
        subject,
        html,
        text: emailText,
        replyTo,
        cc,
      });

      leadRecord.internalAlert.status = 'sent';
    } catch (emailError) {
      leadRecord.internalAlert.status = 'failed';
      leadRecord.internalAlert.reason = emailError?.message || 'EMAIL_SEND_FAILED';
      internalAlertError = emailError;
    }

    const leadSaved = await trySaveLeadToFile(leadRecord);

    if (internalAlertError) {
      if (leadSaved) {
        console.error('[contact-form] internal alert failed, lead persisted', internalAlertError);
        sendResponse(req, res, 200, { ok: true, message: 'Votre demande a bien été envoyée.' });
        return;
      }

      throw internalAlertError;
    }

    if (!leadSaved) {
      console.warn('[contact-form] CONTACT_LEADS_FILE is not configured; lead was not persisted.');
    }

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
