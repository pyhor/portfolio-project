const EMAIL = /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i;
const SINGLE_LINE_CONTROLS = /[\u0000-\u001f\u007f]/;
const WINDOW_MS = 15 * 60 * 1000;

function validateContact(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { errors: { name: 'required', email: 'required', subject: 'required', message: 'required' } };
  const values = {};
  const errors = {};
  for (const [field, min, max] of [['name', 2, 100], ['email', 3, 254], ['subject', 3, 160], ['message', 10, 5000]]) {
    const raw = body[field];
    const value = typeof raw === 'string' ? raw.trim() : '';
    values[field] = value;
    if (!value) errors[field] = 'required';
    else if (value.length < min) errors[field] = 'too_short';
    else if (value.length > max) errors[field] = 'too_long';
    else if (field !== 'message' && SINGLE_LINE_CONTROLS.test(raw)) errors[field] = 'invalid';
    else if (field === 'message' && /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) errors[field] = 'invalid';
    else if (field === 'email' && !EMAIL.test(value)) errors[field] = 'invalid';
  }
  return { values, errors };
}

function validOrigin(value) {
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.origin !== value) return null;
    return url.origin;
  } catch { return null; }
}

function createContactHandler({ env = process.env, fetchImpl = globalThis.fetch, now = Date.now, timeoutMs = 8000 } = {}) {
  // This map is deliberately process-local. Serverless replicas need an external WAF/shared limiter.
  const attempts = new Map();
  const allowed = new Set((env.CONTACT_ALLOWED_ORIGINS || '').split(',').map((item) => validOrigin(item.trim())).filter(Boolean));
  for (const host of [env.VERCEL_URL, env.VERCEL_PROJECT_PRODUCTION_URL]) {
    if (host && /^[a-z0-9.-]+$/i.test(host)) {
      const origin = validOrigin(`https://${host}`);
      if (origin) allowed.add(origin);
    }
  }
  const recipient = (env.CONTACT_TO_EMAIL || '').trim();
  const sender = (env.CONTACT_FROM_EMAIL || '').trim();
  const senderAddress = sender.match(/<([^<>]+)>$/)?.[1] || sender;
  const configured = Boolean(env.RESEND_API_KEY && EMAIL.test(recipient) && EMAIL.test(senderAddress) && !SINGLE_LINE_CONTROLS.test(sender) && allowed.size);

  return async function handleContact(request) {
    const headers = { 'Cache-Control': 'no-store', Vary: 'Origin', 'X-Content-Type-Options': 'nosniff' };
    const result = (status, code, extra = {}) => ({ status, headers: { ...headers, ...extra }, body: status === 204 ? null : (code ? { ok: false, code } : { ok: true }) });
    if (allowed.has(request.origin)) {
      headers['Access-Control-Allow-Origin'] = request.origin;
      headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
      headers['Access-Control-Allow-Headers'] = 'Content-Type';
    }
    if (!configured) return result(503, 'not_configured');
    if (!allowed.has(request.origin)) return result(403, 'origin_not_allowed');
    if (request.method === 'OPTIONS') return result(204);
    if (request.method !== 'POST') return result(405, 'method_not_allowed', { Allow: 'POST, OPTIONS' });
    if (!/^application\/json(?:\s*;|$)/i.test(request.contentType || '')) return result(415, 'unsupported_media_type');

    const timestamp = now();
    for (const [key, value] of attempts) if (value.resetAt <= timestamp) attempts.delete(key);
    const key = String(request.ip || 'unknown').slice(0, 128);
    let attempt = attempts.get(key);
    if (!attempt && attempts.size >= 10000) return result(429, 'rate_limited', { 'Retry-After': '900' });
    if (!attempt) { attempt = { count: 0, resetAt: timestamp + WINDOW_MS }; attempts.set(key, attempt); }
    if (attempt.count >= 5) return result(429, 'rate_limited', { 'Retry-After': String(Math.max(1, Math.ceil((attempt.resetAt - timestamp) / 1000))) });
    attempt.count++;
    if (request.body && request.body.website !== undefined && (typeof request.body.website !== 'string' || request.body.website.trim())) return result(400, 'spam_detected');
    if (JSON.stringify(request.body ?? '').length > 20000) return result(413, 'payload_too_large');
    const { values, errors } = validateContact(request.body);
    if (Object.keys(errors).length) return { ...result(400, 'validation_error'), body: { ok: false, code: 'validation_error', fields: errors } };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          from: sender, to: [recipient], reply_to: values.email,
          subject: `[Portfolio] ${values.subject}`,
          text: `Name: ${values.name}\nEmail: ${values.email}\nSubject: ${values.subject}\nTimestamp: ${new Date(timestamp).toISOString()}\nSubmitted from: ${request.origin}\n\n${values.message}`,
        }),
      });
      if (!response.ok) return result(502, 'delivery_failed');
      const receipt = await response.json();
      if (!receipt || typeof receipt.id !== 'string' || !receipt.id) return result(502, 'delivery_failed');
      return result(200);
    } catch {
      return result(controller.signal.aborted ? 504 : 502, controller.signal.aborted ? 'delivery_timeout' : 'delivery_failed');
    } finally { clearTimeout(timer); }
  };
}

function sendContactResult(res, result) {
  for (const [name, value] of Object.entries(result.headers)) res.setHeader(name, value);
  res.status(result.status);
  if (result.body === null) return res.end();
  return res.json(result.body);
}

module.exports = { createContactHandler, sendContactResult };
