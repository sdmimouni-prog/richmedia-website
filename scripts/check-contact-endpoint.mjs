const endpoint = process.argv[2] || 'https://richmedia.ma/api/contact';
const sendSmoke = process.argv.includes('--send-smoke');
const body = sendSmoke
  ? new URLSearchParams({
      _form: 'Endpoint smoke test',
      Email: process.env.CONTACT_SMOKE_EMAIL || 'audit-smoke@richmedia.ma',
      Message: 'Smoke test automatique de /api/contact.',
    })
  : new URLSearchParams({
      _form: 'Endpoint smoke test',
    });

const response = await fetch(endpoint, {
  method: 'POST',
  redirect: 'manual',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
  },
  body,
});

const contentType = response.headers.get('content-type') || '';
const location = response.headers.get('location') || '';
let payload = {};

if (contentType.includes('application/json')) {
  payload = await response.json().catch(() => ({}));
}

console.log(`endpoint: ${endpoint}`);
console.log(`status: ${response.status}`);
console.log(`content-type: ${contentType || '(missing)'}`);
console.log(`location: ${location || '(missing)'}`);
console.log(`body: ${JSON.stringify(payload)}`);

if ([301, 302, 303, 307, 308].includes(response.status)) {
  console.error('/api/contact must not redirect.');
  process.exit(1);
}

if (!contentType.includes('application/json')) {
  console.error('/api/contact must return JSON for form submissions.');
  process.exit(1);
}

if (sendSmoke) {
  if (response.status !== 200 || payload.ok !== true) {
    console.error('/api/contact smoke test expected a JSON 200 success response.');
    process.exit(1);
  }

  console.log('/api/contact accepts valid submissions.');
} else {
  if (response.status !== 400 || payload.ok !== false) {
    console.error('/api/contact smoke test expected a JSON 400 validation response.');
    process.exit(1);
  }

  console.log('/api/contact is reachable and handled by the contact API.');
}
