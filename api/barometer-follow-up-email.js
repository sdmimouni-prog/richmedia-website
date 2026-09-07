export const BAROMETER_FOLLOW_UP_TEMPLATE_ID = 'barometer-follow-up-v1';
export const BAROMETER_FOLLOW_UP_EVENT_TYPE = 'barometer-follow-up';

const DEFAULT_SITE_URL = 'https://www.richmedia.ma';
const AUTHOR_NAME = 'Salah Eddine MIMOUNI';
const AUTHOR_ROLE = 'Fondateur & CEO de Richmedia';
const AUTHOR_EMAIL = 'sd.mimouni@richmedia.ma';
const AUTHOR_PHONE = '+212661172885';
const AUTHOR_PHONE_DISPLAY = '+212 661 17 28 85';

const ASSETS = {
  logo: '/assets/richmedia-brand/logo-richmedia-wordmark.png',
  portrait: '/assets/richmedia-email/salah-eddine-mimouni.jpg',
  brochure: '/assets/documents/plaquette-richmedia-agency.pdf',
};

function normalizeValue(value) {
  if (value === null || value === undefined) return '';
  return String(value).trim().slice(0, 4000);
}

export function getBarometerFollowUpIdempotencyKey(leadId) {
  const normalizedLeadId = normalizeValue(leadId);
  return normalizedLeadId ? `${BAROMETER_FOLLOW_UP_EVENT_TYPE}/${normalizedLeadId}` : '';
}

function escapeHtml(value) {
  return normalizeValue(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getSiteUrl(siteUrl = process.env.PUBLIC_SITE_URL || DEFAULT_SITE_URL) {
  return normalizeValue(siteUrl).replace(/\/+$/, '') || DEFAULT_SITE_URL;
}

function absoluteUrl(path, siteUrl) {
  const value = normalizeValue(path);
  if (/^https?:\/\//i.test(value)) return value;
  return `${getSiteUrl(siteUrl)}${value.startsWith('/') ? value : `/${value}`}`;
}

function getLeadFirstName(lead) {
  const firstName = normalizeValue(lead?.firstName);
  if (firstName) return firstName;

  const fullName = normalizeValue(lead?.fullName);
  return fullName.split(/\s+/).filter(Boolean)[0] || '';
}

function getLanguage(lead) {
  return normalizeValue(lead?.language).toLowerCase().startsWith('en') ? 'en' : 'fr';
}

function getCopy(language) {
  if (language === 'en') {
    return {
      subject: 'Your 2026 Barometer + a proposal to exchange',
      eyebrow: 'MOROCCO DIGITAL MARKETING BAROMETER 2026',
      title: 'Your 2026 Barometer + a proposal to exchange',
      intro:
        'Thank you for your interest. Here are a few useful benchmarks to read acquisition costs, media channels and lead quality in Morocco.',
      greetingFallback: 'Hello,',
      greeting: (firstName) => `Hello ${firstName},`,
      body:
        'Thanks for downloading the Morocco Digital Marketing Barometer 2026. It gives practical references on acquisition costs, Meta Ads, Google Ads, WhatsApp, lead generation and performance reading.',
      nextStepKicker: 'NEXT STEP',
      nextStepTitle: 'Want to interpret these benchmarks for your brand?',
      nextStepText:
        'I can help you compare these references with your campaigns, your market and your actual conversion path.',
      callCta: 'Call now',
      meetingCta: 'Book an exchange',
      brochureLabel: 'Richmedia agency deck',
      brochureText:
        'You can also review the Richmedia agency deck to see how we connect strategy, media, content, CRM and automation.',
      brochureCta: 'Open the agency deck',
      closing: 'Speak soon,',
      signatureRole: 'Founder & CEO of Richmedia',
      signatureLine: 'Digital strategy, media performance, SEO/GEO, WhatsApp, CRM and automation.',
      meetingPath: '/en/book-audit/',
    };
  }

  return {
    subject: 'Votre Baromètre 2026 + proposition d’échange',
    eyebrow: 'BAROMÈTRE MARKETING DIGITAL MAROC 2026',
    title: 'Votre Baromètre 2026 + proposition d’échange',
    intro:
      'Merci pour votre intérêt. Voici quelques repères utiles pour lire vos coûts d’acquisition, vos canaux média et la qualité de vos leads au Maroc.',
    greetingFallback: 'Bonjour,',
    greeting: (firstName) => `Bonjour ${firstName},`,
    body:
      'Merci pour votre intérêt pour le Baromètre du Marketing Digital au Maroc 2026. Il donne des repères utiles sur les coûts d’acquisition, Meta Ads, Google Ads, WhatsApp, la génération de leads et la lecture de performance.',
    nextStepKicker: 'NEXT STEP',
    nextStepTitle: 'Vous voulez interpréter ces benchmarks pour votre marque ?',
    nextStepText:
      'Je peux vous aider à comparer ces repères avec vos campagnes, votre marché et votre parcours réel de conversion.',
    callCta: 'Appeler maintenant',
    meetingCta: 'Réserver un échange',
    brochureLabel: 'Plaquette Richmedia',
    brochureText:
      'Vous pouvez aussi consulter la plaquette Richmedia pour voir comment nous relions stratégie, média, contenu, CRM et automation.',
    brochureCta: 'Voir la plaquette',
    closing: 'À très vite,',
    signatureRole: AUTHOR_ROLE,
    signatureLine: 'Stratégie digitale, média performance, SEO/GEO, WhatsApp, CRM et automation.',
    meetingPath: '/reserver-un-audit/',
  };
}

export function buildBarometerFollowUpEmail(lead, options = {}) {
  const language = getLanguage(lead);
  const copy = getCopy(language);
  const firstName = getLeadFirstName(lead);
  const greeting = firstName ? copy.greeting(firstName) : copy.greetingFallback;
  const siteUrl = getSiteUrl(options.siteUrl);
  const logoUrl = absoluteUrl(ASSETS.logo, siteUrl);
  const portraitUrl = absoluteUrl(ASSETS.portrait, siteUrl);
  const brochureUrl = absoluteUrl(ASSETS.brochure, siteUrl);
  const meetingUrl = absoluteUrl(copy.meetingPath, siteUrl);
  const callUrl = `tel:${AUTHOR_PHONE}`;

  const html = `<!doctype html>
<html lang="${language}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(copy.subject)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f3effb;font-family:Inter,Arial,sans-serif;color:#171421;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;background:#f3effb;margin:0;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="680" cellspacing="0" cellpadding="0" style="width:100%;max-width:680px;border-collapse:separate;border-spacing:0;">
            <tr>
              <td style="background:#140721;background-image:linear-gradient(135deg,#05040a 0%,#160828 48%,#2d1256 100%);border-radius:18px 18px 0 0;padding:38px 34px 34px;">
                <img src="${escapeHtml(logoUrl)}" width="190" alt="Richmedia" style="display:block;width:190px;max-width:62%;height:auto;border:0;margin:0 0 34px;" />
                <div style="font-size:13px;line-height:1.35;font-weight:800;letter-spacing:5px;text-transform:uppercase;color:#a985ff;margin:0 0 18px;">${escapeHtml(copy.eyebrow)}</div>
                <h1 style="font-size:36px;line-height:1.12;font-weight:900;color:#ffffff;margin:0 0 22px;">${escapeHtml(copy.title)}</h1>
                <p style="font-size:17px;line-height:1.65;color:#ded8ec;margin:0;max-width:560px;">${escapeHtml(copy.intro)}</p>
              </td>
            </tr>
            <tr>
              <td style="background:#ffffff;padding:34px;border-left:1px solid #ebe6f5;border-right:1px solid #ebe6f5;">
                <p style="font-size:18px;line-height:1.65;color:#2b2638;margin:0 0 22px;">${escapeHtml(greeting)}</p>
                <p style="font-size:18px;line-height:1.65;color:#2b2638;margin:0 0 28px;">${escapeHtml(copy.body)}</p>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;border:1px solid #ece5fa;border-radius:16px;background:#faf7ff;margin:0 0 28px;">
                  <tr>
                    <td style="padding:26px 26px 28px;">
                      <div style="font-size:12px;line-height:1.35;font-weight:900;letter-spacing:4px;text-transform:uppercase;color:#8b48ff;margin:0 0 12px;">${escapeHtml(copy.nextStepKicker)}</div>
                      <h2 style="font-size:28px;line-height:1.18;font-weight:900;color:#171421;margin:0 0 12px;">${escapeHtml(copy.nextStepTitle)}</h2>
                      <p style="font-size:16px;line-height:1.62;color:#5d576c;margin:0 0 24px;">${escapeHtml(copy.nextStepText)}</p>
                      <table role="presentation" cellspacing="0" cellpadding="0" style="border-collapse:separate;border-spacing:0;">
                        <tr>
                          <td style="padding:0 10px 10px 0;">
                            <a href="${escapeHtml(callUrl)}" style="display:inline-block;background:#7c3cff;color:#ffffff;text-decoration:none;font-size:15px;font-weight:800;line-height:1;padding:15px 20px;border-radius:999px;">${escapeHtml(copy.callCta)}</a>
                          </td>
                          <td style="padding:0 0 10px;">
                            <a href="${escapeHtml(meetingUrl)}" style="display:inline-block;background:#171421;color:#ffffff;text-decoration:none;font-size:15px;font-weight:800;line-height:1;padding:15px 20px;border-radius:999px;">${escapeHtml(copy.meetingCta)}</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;border:1px solid #eeeaf7;border-radius:14px;margin:0 0 30px;">
                  <tr>
                    <td style="padding:20px 22px;">
                      <div style="font-size:12px;line-height:1.35;font-weight:900;letter-spacing:3px;text-transform:uppercase;color:#8b48ff;margin:0 0 10px;">${escapeHtml(copy.brochureLabel)}</div>
                      <p style="font-size:16px;line-height:1.6;color:#5d576c;margin:0 0 14px;">${escapeHtml(copy.brochureText)}</p>
                      <a href="${escapeHtml(brochureUrl)}" style="color:#6c2cff;font-size:16px;font-weight:800;text-decoration:none;">${escapeHtml(copy.brochureCta)} →</a>
                    </td>
                  </tr>
                </table>

                <p style="font-size:17px;line-height:1.6;color:#2b2638;margin:0 0 18px;">${escapeHtml(copy.closing)}</p>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;">
                  <tr>
                    <td width="86" valign="top" style="width:86px;padding:0 18px 0 0;">
                      <img src="${escapeHtml(portraitUrl)}" width="72" height="72" alt="${escapeHtml(AUTHOR_NAME)}" style="display:block;width:72px;height:72px;border-radius:50%;object-fit:cover;border:0;" />
                    </td>
                    <td valign="top" style="padding:0;">
                      <div style="font-size:18px;line-height:1.35;font-weight:900;color:#171421;margin:0;">${escapeHtml(AUTHOR_NAME)}</div>
                      <div style="font-size:14px;line-height:1.45;font-weight:700;color:#6b6478;margin:2px 0 8px;">${escapeHtml(copy.signatureRole)}</div>
                      <div style="font-size:14px;line-height:1.55;color:#6b6478;margin:0 0 8px;">${escapeHtml(copy.signatureLine)}</div>
                      <div style="font-size:14px;line-height:1.7;color:#6b6478;">
                        <a href="mailto:${escapeHtml(AUTHOR_EMAIL)}" style="color:#6c2cff;text-decoration:none;">${escapeHtml(AUTHOR_EMAIL)}</a><br />
                        <a href="${escapeHtml(callUrl)}" style="color:#6c2cff;text-decoration:none;">${escapeHtml(AUTHOR_PHONE_DISPLAY)}</a><br />
                        <a href="${escapeHtml(siteUrl)}" style="color:#6c2cff;text-decoration:none;">richmedia.ma</a>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="background:#ffffff;border-radius:0 0 18px 18px;border-left:1px solid #ebe6f5;border-right:1px solid #ebe6f5;border-bottom:1px solid #ebe6f5;padding:0 34px 30px;">
                <div style="height:1px;background:#eeeaf7;margin:0 0 18px;"></div>
                <p style="font-size:12px;line-height:1.55;color:#9b94aa;margin:0;">Richmedia - 64 Avenue de l'Hermitage, Casablanca 20540, Maroc</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = `${greeting}

${copy.body}

${copy.nextStepTitle}
${copy.nextStepText}

${copy.callCta}: ${AUTHOR_PHONE_DISPLAY}
${copy.meetingCta}: ${meetingUrl}
${copy.brochureCta}: ${brochureUrl}

${copy.closing}
${AUTHOR_NAME}
${copy.signatureRole}
${copy.signatureLine}
${AUTHOR_EMAIL}
${AUTHOR_PHONE_DISPLAY}
${siteUrl}`;

  return {
    templateId: BAROMETER_FOLLOW_UP_TEMPLATE_ID,
    language,
    to: normalizeValue(lead?.email),
    from: `${AUTHOR_NAME} <${AUTHOR_EMAIL}>`,
    replyTo: AUTHOR_EMAIL,
    subject: copy.subject,
    html,
    text,
    links: {
      call: callUrl,
      meeting: meetingUrl,
      brochure: brochureUrl,
      portrait: portraitUrl,
      logo: logoUrl,
    },
  };
}
