const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createContactHandler } = require('./contact.cjs');

const config = {
  RESEND_API_KEY: 'test-key', CONTACT_TO_EMAIL: 'owner@example.com',
  CONTACT_FROM_EMAIL: 'Portfolio <contact@example.com>',
  CONTACT_ALLOWED_ORIGINS: 'https://portfolio.example',
};
const payload = { name: ' Ada ', email: 'ada@example.org', subject: 'Project collaboration', message: 'I would like to discuss a software project.', website: '' };
const request = (body = payload, extra = {}) => ({ method: 'POST', origin: 'https://portfolio.example', contentType: 'application/json', ip: '203.0.113.1', body, ...extra });
const accepted = async () => ({ ok: true, json: async () => ({ id: 'email-123' }) });

test('sends validated content to the server recipient with safe reply_to and receipt time', async () => {
  let delivery;
  const handle = createContactHandler({ env: config, now: () => Date.parse('2026-10-21T08:30:00Z'), fetchImpl: async (url, options) => {
    delivery = { url, options, email: JSON.parse(options.body) };
    return accepted();
  } });
  const result = await handle(request({ ...payload, to: 'attacker@example.org', source: 'https://attacker.example', timestamp: 'forged' }));
  assert.equal(result.status, 200);
  assert.deepEqual(result.body, { ok: true });
  assert.equal(delivery.url, 'https://api.resend.com/emails');
  assert.deepEqual(delivery.email.to, ['owner@example.com']);
  assert.equal(delivery.email.reply_to, 'ada@example.org');
  assert.equal(delivery.email.from, 'Portfolio <contact@example.com>');
  assert.match(delivery.email.text, /Name: Ada\nEmail: ada@example.org/);
  assert.match(delivery.email.text, /Timestamp: 2026-10-21T08:30:00.000Z/);
  assert.match(delivery.email.text, /Submitted from: https:\/\/portfolio.example/);
  assert.doesNotMatch(delivery.email.text, /attacker|forged/);
  assert.match(delivery.email.text, /I would like to discuss a software project\./);
  assert.equal(delivery.options.headers.Authorization, 'Bearer test-key');
});

test('rejects malformed and oversized fields before contacting provider', async () => {
  const handle = createContactHandler({ env: config, fetchImpl: async () => assert.fail('must not send') });
  for (const body of [null, [], {}, '{invalid json', '123', { ...payload, name: 'x'.repeat(101) }, { ...payload, email: 'a@b' }, { ...payload, email: 'a@example.org\r\nBcc: x@example.org' }, { ...payload, subject: 'x\nInjected' }, { ...payload, message: 'short' }, { ...payload, message: 'x'.repeat(5001) }]) {
    const result = await handle(request(body, { ip: Math.random().toString() }));
    assert.equal(result.status, 400);
    assert.equal(result.body.code, 'validation_error');
  }
});

test('trusts only configured deployment origins and refuses an untrusted Host header', async () => {
  const handle = createContactHandler({ env: { ...config, VERCEL_URL: 'preview.example.vercel.app', VERCEL_PROJECT_PRODUCTION_URL: 'production.example.vercel.app' }, fetchImpl: accepted });
  for (const origin of ['https://preview.example.vercel.app', 'https://production.example.vercel.app']) {
    assert.equal((await handle(request(payload, { origin }))).status, 200);
  }
  for (const origin of ['https://portfolio.example/', 'https://portfolio.example/path', 'https://portfolio.example:444', 'https://attacker.example.vercel.app', 'https://user:password@portfolio.example']) {
    const response = await handle(request(payload, { origin, host: origin }));
    assert.equal(response.status, 403);
    assert.equal(response.headers['Access-Control-Allow-Origin'], undefined);
  }
});

test('does not report success for provider rejection, malformed receipt, or network errors', async () => {
  for (const fetchImpl of [async () => ({ ok: false, status: 422 }), async () => ({ ok: true, json: async () => ({}) }), async () => { throw new Error('secret provider detail'); }]) {
    const result = await createContactHandler({ env: config, fetchImpl })(request());
    assert.equal(result.status, 502);
    assert.deepEqual(result.body, { ok: false, code: 'delivery_failed' });
  }
});

test('fails visibly when provider configuration or allowed origins are missing', async () => {
  for (const field of ['RESEND_API_KEY', 'CONTACT_TO_EMAIL', 'CONTACT_FROM_EMAIL', 'CONTACT_ALLOWED_ORIGINS']) {
    const env = { ...config, [field]: '' };
    const result = await createContactHandler({ env, fetchImpl: async () => assert.fail('must not send') })(request());
    assert.equal(result.status, 503, field);
    assert.equal(result.body.code, 'not_configured');
  }
});

test('enforces exact origins, JSON content type, method and preflight', async () => {
  const handle = createContactHandler({ env: config, fetchImpl: async () => assert.fail('must not send') });
  for (const origin of ['', 'null', 'https://portfolio.example.attacker.org', 'https://evil.example']) {
    assert.equal((await handle(request(payload, { origin }))).status, 403);
  }
  assert.equal((await handle(request(payload, { method: 'GET' }))).status, 405);
  assert.equal((await handle(request(payload, { contentType: 'text/plain' }))).status, 415);
  const result = await handle(request(undefined, { method: 'OPTIONS' }));
  assert.equal(result.status, 204);
  assert.equal(result.headers['Access-Control-Allow-Origin'], 'https://portfolio.example');
});

test('rejects honeypot submissions without pretending delivery occurred', async () => {
  const handle = createContactHandler({ env: config, fetchImpl: async () => assert.fail('must not send') });
  const result = await handle(request({ ...payload, website: 'https://spam.example' }));
  assert.equal(result.status, 400);
  assert.equal(result.body.code, 'spam_detected');
});

test('limits attempts per IP and permits another window after expiry', async () => {
  let time = 0;
  const handle = createContactHandler({ env: config, now: () => time, fetchImpl: accepted });
  for (let i = 0; i < 5; i++) assert.equal((await handle(request())).status, 200);
  const blocked = await handle(request());
  assert.equal(blocked.status, 429);
  assert.equal(blocked.headers['Retry-After'], '900');
  assert.equal((await handle(request(payload, { ip: '203.0.113.2' }))).status, 200);
  time = 900001;
  assert.equal((await handle(request())).status, 200);
});

test('aborts provider call on timeout and reports uncertain delivery as failure', async () => {
  const handle = createContactHandler({ env: config, timeoutMs: 5, fetchImpl: async (_url, options) => new Promise((_resolve, reject) => {
    options.signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true });
  }) });
  const result = await handle(request());
  assert.equal(result.status, 504);
  assert.equal(result.body.code, 'delivery_timeout');
});
