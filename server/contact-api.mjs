import http from 'node:http';
import contactHandler from '../api/contact.js';

const host = process.env.CONTACT_API_HOST || '127.0.0.1';
const port = Number.parseInt(process.env.CONTACT_API_PORT || '8787', 10);

if (!Number.isFinite(port)) {
  throw new Error('CONTACT_API_PORT must be a valid number.');
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (requestUrl.pathname === '/healthz') {
    res.statusCode = 200;
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ ok: true, service: 'richmedia-contact-api' }));
    return;
  }

  if (requestUrl.pathname !== '/api/contact') {
    res.statusCode = 404;
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ ok: false, message: 'Not found.' }));
    return;
  }

  try {
    await contactHandler(req, res);
  } catch (error) {
    console.error('[contact-api]', error);

    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }

    if (!res.writableEnded) {
      res.end(JSON.stringify({ ok: false, message: 'Erreur serveur.' }));
    }
  }
});

server.listen(port, host, () => {
  console.log(`Richmedia contact API listening on http://${host}:${port}`);
});

const shutdown = () => {
  server.close(() => process.exit(0));
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
