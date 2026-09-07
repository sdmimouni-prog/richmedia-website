import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import {
  BAROMETER_FOLLOW_UP_TEMPLATE_ID,
  buildBarometerFollowUpEmail,
  getBarometerFollowUpIdempotencyKey,
} from '../api/barometer-follow-up-email.js';
import { updateLeadRecords } from '../api/lead-store.js';

const DEFAULT_INTERVAL_MS = 5 * 60 * 1000;
const DEFAULT_BATCH_SIZE = 10;
const DEFAULT_CLAIM_TIMEOUT_MS = 30 * 60 * 1000;
const DEFAULT_IDEMPOTENCY_RETRY_WINDOW_MS = 23 * 60 * 60 * 1000;
const MIN_INTERVAL_MS = 10 * 1000;
const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const PROCESSOR_ID = `richmedia-follow-up-scheduler:${process.pid}:${randomUUID()}`;

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function parsePositiveInteger(value, fallback, { min = 1, max = Number.MAX_SAFE_INTEGER } = {}) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
}

function normalizeValue(value) {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeValue(value));
}

function cloneRecord(record) {
  return JSON.parse(JSON.stringify(record));
}

function isDueBarometerLead(record, nowMs) {
  const followUp = record?.followUp;
  if (record?.type !== 'lead') return false;
  if (followUp?.templateId !== BAROMETER_FOLLOW_UP_TEMPLATE_ID) return false;

  const scheduledAt = Date.parse(followUp.scheduledAt || '');
  return Number.isFinite(scheduledAt) && scheduledAt <= nowMs;
}

function getClaimedAtMs(followUp) {
  const claimedAt = Date.parse(followUp?.claimedAt || '');
  return Number.isFinite(claimedAt) ? claimedAt : NaN;
}

function needsDuplicateReview(followUp, nowMs, idempotencyRetryWindowMs) {
  if (followUp?.status !== 'sending') return false;

  const claimedAt = getClaimedAtMs(followUp);
  return !Number.isFinite(claimedAt) || nowMs - claimedAt > idempotencyRetryWindowMs;
}

function isRetryableStaleSending(followUp, nowMs, claimTimeoutMs, idempotencyRetryWindowMs) {
  if (followUp?.status !== 'sending') return false;

  const claimedAt = getClaimedAtMs(followUp);
  if (!Number.isFinite(claimedAt)) return false;

  const elapsedMs = nowMs - claimedAt;
  return elapsedMs > claimTimeoutMs && elapsedMs <= idempotencyRetryWindowMs;
}

function shouldClaimLead(record, nowMs, claimTimeoutMs, idempotencyRetryWindowMs) {
  const followUp = record?.followUp;
  if (!isDueBarometerLead(record, nowMs)) return false;

  return (
    followUp.status === 'scheduled'
    || isRetryableStaleSending(followUp, nowMs, claimTimeoutMs, idempotencyRetryWindowMs)
  );
}

function ensureFollowUpDeliveryIdentity(record) {
  record.id ||= randomUUID();

  const idempotencyKey = record.followUp?.idempotencyKey || getBarometerFollowUpIdempotencyKey(record.id);
  record.followUp = {
    ...record.followUp,
    idempotencyKey,
  };

  return idempotencyKey;
}

async function claimDueFollowUps({
  now = new Date(),
  batchSize = DEFAULT_BATCH_SIZE,
  claimTimeoutMs = DEFAULT_CLAIM_TIMEOUT_MS,
  idempotencyRetryWindowMs = DEFAULT_IDEMPOTENCY_RETRY_WINDOW_MS,
} = {}) {
  const nowMs = now.getTime();
  const claimedAt = now.toISOString();
  const claimed = [];
  let invalid = 0;
  let reviewRequired = 0;

  const storeResult = await updateLeadRecords((records) => {
    records.forEach((record) => {
      if (!isDueBarometerLead(record, nowMs)) return;
      if (!['scheduled', 'sending'].includes(record.followUp?.status)) return;

      ensureFollowUpDeliveryIdentity(record);

      if (needsDuplicateReview(record.followUp, nowMs, idempotencyRetryWindowMs)) {
        record.followUp = {
          ...record.followUp,
          status: 'review_required',
          reviewRequiredAt: claimedAt,
          reason: 'IDEMPOTENCY_WINDOW_EXPIRED_AFTER_SENDING',
        };
        delete record.followUp.claimedBy;
        reviewRequired += 1;
        return;
      }

      if (!shouldClaimLead(record, nowMs, claimTimeoutMs, idempotencyRetryWindowMs)) return;

      if (!isValidEmail(record.email)) {
        record.followUp = {
          ...record.followUp,
          status: 'failed',
          failedAt: claimedAt,
          reason: 'INVALID_EMAIL',
        };
        invalid += 1;
        return;
      }

      if (claimed.length >= batchSize) return;

      record.followUp = {
        ...record.followUp,
        status: 'sending',
        claimedAt,
        claimedBy: PROCESSOR_ID,
        attempts: Number.parseInt(record.followUp?.attempts || 0, 10) + 1,
      };
      delete record.followUp.reason;
      delete record.followUp.failedAt;

      claimed.push(cloneRecord(record));
    });

    return {
      result: {
        claimed: claimed.length,
        invalid,
        reviewRequired,
      },
    };
  });

  return {
    storeOk: storeResult.ok,
    storeReason: storeResult.reason,
    parseErrors: storeResult.parseErrors || 0,
    claimed,
    invalid,
    reviewRequired,
  };
}

async function updateClaimedFollowUp(leadId, updater) {
  return updateLeadRecords((records) => {
    const record = records.find((candidate) => candidate?.id === leadId);

    if (!record) {
      return {
        result: {
          updated: false,
          reason: 'LEAD_NOT_FOUND',
        },
      };
    }

    if (record.followUp?.claimedBy !== PROCESSOR_ID) {
      return {
        result: {
          updated: false,
          reason: 'LEAD_CLAIMED_BY_ANOTHER_PROCESS',
        },
      };
    }

    updater(record);

    return {
      result: {
        updated: true,
      },
    };
  });
}

async function updateClaimedFollowUpWithRetry(leadId, updater) {
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      return await updateClaimedFollowUp(leadId, updater);
    } catch (error) {
      lastError = error;
      await sleep(150 * attempt);
    }
  }

  throw lastError;
}

async function sendResendEmail(email, idempotencyKey) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY_MISSING');
  }

  const payload = {
    from: process.env.FOLLOW_UP_FROM_EMAIL || email.from,
    to: [email.to],
    subject: email.subject,
    html: email.html,
    text: email.text,
    reply_to: process.env.FOLLOW_UP_REPLY_TO_EMAIL || email.replyTo,
  };

  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
    },
    body: JSON.stringify(payload),
  });

  const rawBody = await response.text();
  let body;

  try {
    body = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    body = { rawBody };
  }

  if (!response.ok) {
    throw new Error(`RESEND_ERROR: ${rawBody.slice(0, 1000)}`);
  }

  return {
    id: body?.id || '',
    to: payload.to,
    from: payload.from,
    subject: payload.subject,
    idempotencyKey,
  };
}

async function markFollowUpSent(lead, delivery) {
  const sentAt = new Date().toISOString();

  return updateClaimedFollowUpWithRetry(lead.id, (record) => {
    record.followUp = {
      ...record.followUp,
      status: 'sent',
      sentAt,
      resendId: delivery.id,
      idempotencyKey: delivery.idempotencyKey || record.followUp?.idempotencyKey,
      deliveredTo: delivery.to,
      from: delivery.from,
      subject: delivery.subject,
    };
    delete record.followUp.claimedBy;
    delete record.followUp.reason;
  });
}

async function markFollowUpFailed(lead, error) {
  const failedAt = new Date().toISOString();

  return updateClaimedFollowUpWithRetry(lead.id, (record) => {
    record.followUp = {
      ...record.followUp,
      status: 'failed',
      failedAt,
      reason: error?.message || 'FOLLOW_UP_SEND_FAILED',
    };
    delete record.followUp.claimedBy;
  });
}

export async function processDueFollowUps(options = {}) {
  if (!process.env.RESEND_API_KEY) {
    return {
      ok: true,
      skipped: 'RESEND_API_KEY_MISSING',
      claimed: 0,
      sent: 0,
      failed: 0,
      reviewRequired: 0,
    };
  }

  const batchSize = parsePositiveInteger(options.batchSize || process.env.FOLLOW_UP_BATCH_SIZE, DEFAULT_BATCH_SIZE);
  const claimTimeoutMs = parsePositiveInteger(
    options.claimTimeoutMs || process.env.FOLLOW_UP_CLAIM_TIMEOUT_MS,
    DEFAULT_CLAIM_TIMEOUT_MS,
  );
  const idempotencyRetryWindowMs = parsePositiveInteger(
    options.idempotencyRetryWindowMs || process.env.FOLLOW_UP_IDEMPOTENCY_RETRY_WINDOW_MS,
    DEFAULT_IDEMPOTENCY_RETRY_WINDOW_MS,
  );
  const claimResult = await claimDueFollowUps({
    now: options.now || new Date(),
    batchSize,
    claimTimeoutMs,
    idempotencyRetryWindowMs,
  });

  if (!claimResult.storeOk) {
    return {
      ok: false,
      skipped: claimResult.storeReason || 'CONTACT_LEADS_FILE_UNAVAILABLE',
      claimed: 0,
      sent: 0,
      failed: 0,
      reviewRequired: 0,
    };
  }

  const summary = {
    ok: true,
    claimed: claimResult.claimed.length,
    sent: 0,
    failed: claimResult.invalid,
    reviewRequired: claimResult.reviewRequired,
    parseErrors: claimResult.parseErrors,
    errors: [],
  };

  for (const lead of claimResult.claimed) {
    try {
      const email = buildBarometerFollowUpEmail(lead, {
        siteUrl: process.env.PUBLIC_SITE_URL || 'https://www.richmedia.ma',
      });
      const idempotencyKey = lead.followUp?.idempotencyKey || getBarometerFollowUpIdempotencyKey(lead.id);
      const delivery = await sendResendEmail(email, idempotencyKey);
      const markResult = await markFollowUpSent(lead, delivery);

      if (markResult.result?.updated) {
        summary.sent += 1;
      } else {
        summary.failed += 1;
        summary.errors.push({ leadId: lead.id, reason: markResult.result?.reason || 'SENT_MARK_UPDATE_FAILED' });
      }
    } catch (error) {
      summary.failed += 1;
      summary.errors.push({ leadId: lead.id, reason: error?.message || 'FOLLOW_UP_SEND_FAILED' });

      try {
        await markFollowUpFailed(lead, error);
      } catch (markError) {
        summary.errors.push({ leadId: lead.id, reason: markError?.message || 'FAILED_MARK_UPDATE_FAILED' });
      }
    }
  }

  return summary;
}

function shouldLogSummary(summary, previousSkipped) {
  return (
    summary.claimed
    || summary.sent
    || summary.failed
    || summary.reviewRequired
    || summary.skipped !== previousSkipped
  );
}

async function startScheduler() {
  const intervalMs = parsePositiveInteger(
    process.env.FOLLOW_UP_SCHEDULER_INTERVAL_MS,
    DEFAULT_INTERVAL_MS,
    { min: MIN_INTERVAL_MS },
  );
  let running = false;
  let previousSkipped = '';

  const tick = async () => {
    if (running) return;
    running = true;

    try {
      const summary = await processDueFollowUps();
      if (shouldLogSummary(summary, previousSkipped)) {
        console.log(`[follow-up-scheduler] ${JSON.stringify(summary)}`);
      }
      previousSkipped = summary.skipped || '';
    } catch (error) {
      console.error('[follow-up-scheduler]', error);
    } finally {
      running = false;
    }
  };

  console.log(`[follow-up-scheduler] started interval=${intervalMs}ms processor=${PROCESSOR_ID}`);
  await tick();
  const interval = setInterval(tick, intervalMs);

  const shutdown = () => {
    clearInterval(interval);
    console.log('[follow-up-scheduler] stopped');
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv.includes('--once')) {
    processDueFollowUps()
      .then((summary) => {
        console.log(JSON.stringify(summary, null, 2));
        process.exit(summary.ok ? 0 : 1);
      })
      .catch((error) => {
        console.error(error);
        process.exit(1);
      });
  } else {
    startScheduler();
  }
}
