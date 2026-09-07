import { appendFile, mkdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const LOCK_RETRY_MS = 50;
const LOCK_TIMEOUT_MS = 5000;
const STALE_LOCK_MS = 2 * 60 * 1000;

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getLeadsFile(options = {}) {
  return options.leadsFile || process.env.CONTACT_LEADS_FILE || '';
}

async function readFileIfExists(filePath) {
  try {
    return await readFile(filePath, 'utf8');
  } catch (error) {
    if (error?.code === 'ENOENT') return '';
    throw error;
  }
}

function parseStoreEntries(rawContent) {
  return rawContent
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => {
      try {
        return { kind: 'json', record: JSON.parse(line) };
      } catch {
        return { kind: 'raw', line };
      }
    });
}

function serializeStoreEntries(entries) {
  if (!entries.length) return '';
  return `${entries
    .map((entry) => (entry.kind === 'json' ? JSON.stringify(entry.record) : entry.line))
    .join('\n')}\n`;
}

async function acquireLeadStoreLock(leadsFile, options = {}) {
  const lockDir = `${leadsFile}.lock`;
  const startedAt = Date.now();
  const timeoutMs = Number.parseInt(options.lockTimeoutMs || LOCK_TIMEOUT_MS, 10);
  const staleLockMs = Number.parseInt(options.staleLockMs || STALE_LOCK_MS, 10);

  await mkdir(dirname(leadsFile), { recursive: true });

  while (true) {
    try {
      await mkdir(lockDir);
      await writeFile(
        `${lockDir}/owner.json`,
        `${JSON.stringify({
          pid: process.pid,
          createdAt: new Date().toISOString(),
        })}\n`,
        { mode: 0o600 },
      );

      return async () => {
        await rm(lockDir, { recursive: true, force: true });
      };
    } catch (error) {
      if (error?.code !== 'EEXIST') throw error;

      try {
        const lockStat = await stat(lockDir);
        if (Date.now() - lockStat.mtimeMs > staleLockMs) {
          await rm(lockDir, { recursive: true, force: true });
          continue;
        }
      } catch (statError) {
        if (statError?.code !== 'ENOENT') throw statError;
      }

      if (Date.now() - startedAt > timeoutMs) {
        throw new Error(`CONTACT_LEADS_FILE_LOCK_TIMEOUT: ${leadsFile}`);
      }

      await sleep(LOCK_RETRY_MS);
    }
  }
}

export async function appendLeadRecord(leadRecord, options = {}) {
  const leadsFile = getLeadsFile(options);
  if (!leadsFile) return false;

  const releaseLock = await acquireLeadStoreLock(leadsFile, options);

  try {
    await appendFile(leadsFile, `${JSON.stringify(leadRecord)}\n`, { mode: 0o600 });
    return true;
  } finally {
    await releaseLock();
  }
}

export async function updateLeadRecords(updater, options = {}) {
  const leadsFile = getLeadsFile(options);
  if (!leadsFile) {
    return {
      ok: false,
      reason: 'CONTACT_LEADS_FILE_MISSING',
      result: undefined,
    };
  }

  const releaseLock = await acquireLeadStoreLock(leadsFile, options);

  try {
    const rawContent = await readFileIfExists(leadsFile);
    const entries = parseStoreEntries(rawContent);
    const jsonEntries = entries.filter((entry) => entry.kind === 'json');
    const records = jsonEntries.map((entry) => entry.record);
    const parseErrors = entries.filter((entry) => entry.kind === 'raw').length;
    const updateResult = await updater(records, { leadsFile, parseErrors });

    if (updateResult?.write !== false) {
      records.forEach((record, index) => {
        jsonEntries[index].record = record;
      });

      const tempFile = `${leadsFile}.tmp.${process.pid}.${Date.now()}`;
      await writeFile(tempFile, serializeStoreEntries(entries), { mode: 0o600 });
      await rename(tempFile, leadsFile);
    }

    return {
      ok: true,
      parseErrors,
      result: updateResult?.result ?? updateResult,
    };
  } finally {
    await releaseLock();
  }
}

export async function readLeadRecords(options = {}) {
  const leadsFile = getLeadsFile(options);
  if (!leadsFile) return [];

  const releaseLock = await acquireLeadStoreLock(leadsFile, options);

  try {
    const rawContent = await readFileIfExists(leadsFile);
    return parseStoreEntries(rawContent)
      .filter((entry) => entry.kind === 'json')
      .map((entry) => entry.record);
  } finally {
    await releaseLock();
  }
}
