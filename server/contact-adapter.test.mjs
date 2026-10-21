import { test } from 'node:test';
import assert from 'node:assert/strict';

test('Vercel adapter handles malformed JSON safely and relays only genuine provider acceptance', async (t) => {
  const envNames = ['RESEND_API_KEY', 'CONTACT_TO_EMAIL', 'CONTACT_FROM_EMAIL', 'CONTACT_ALLOWED_ORIGINS'];
  const previous = Object.fromEntries(envNames.map((key) => [key, process.env[key]]));
  Object.assign(process.env, { RESEND_API_KEY: 'test-key', CONTACT_TO_EMAIL: 'owner@example.com', CONTACT_FROM_EMAIL: 'contact@example.com', CONTACT_ALLOWED_ORIGINS: 'https://portfolio.example' });
  const originalFetch = globalThis.fetch;
  let sends = 0;
  let providerAccepts = true;
  globalThis.fetch = async () => { sends++; return { ok: providerAccepts, json: async () => ({ id: 'receipt-123' }) }; };
  try {
    const { default: handler } = await import('../api/contact.js');
    const response = () => ({ headers: {}, setHeader(name, value) { this.headers[name] = value; }, status(value) { this.statusCode = value; return this; }, json(value) { this.body = value; }, end() {} });
    const request = (body, origin = 'https://portfolio.example') => ({ method: 'POST', headers: { origin, 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.1' }, body });
    await t.test('malformed JSON is a CORS-enabled 400 instead of an unhandled 500', async () => {
      const req = request();
      Object.defineProperty(req, 'body', { get() { throw new SyntaxError('Malformed JSON'); } });
      const res = response();
      await handler(req, res);
      assert.equal(res.statusCode, 400);
      assert.equal(res.body.code, 'validation_error');
      assert.equal(res.headers['Access-Control-Allow-Origin'], 'https://portfolio.example');
      assert.equal(sends, 0);
    });
    await t.test('valid request succeeds only after accepted provider response', async () => {
      const body = { name: 'Ada', email: 'ada@example.org', subject: 'A project', message: 'Discussing a software project.', website: '' };
      const success = response();
      await handler(request(body), success);
      assert.equal(success.statusCode, 200);
      assert.deepEqual(success.body, { ok: true });
      providerAccepts = false;
      const failure = response();
      await handler(request(body), failure);
      assert.equal(failure.statusCode, 502);
      assert.deepEqual(failure.body, { ok: false, code: 'delivery_failed' });
      assert.equal(sends, 2);
    });
    await t.test('invalid origin reaches no provider and receives no CORS permission', async () => {
      const res = response();
      await handler(request({}, 'https://evil.example'), res);
      assert.equal(res.statusCode, 403);
      assert.equal(res.headers['Access-Control-Allow-Origin'], undefined);
      assert.equal(sends, 2);
    });
  } finally {
    globalThis.fetch = originalFetch;
    for (const key of envNames) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  }
});
