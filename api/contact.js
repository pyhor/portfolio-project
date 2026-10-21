import contact from '../server/contact.cjs';

const handleContact = contact.createContactHandler();

export default async function handler(req, res) {
  // Vercel parses JSON lazily; malformed JSON makes this getter throw.
  // An absent body lets the shared handler return its normal validation response.
  let body;
  try { body = req.body; } catch { body = undefined; }
  const request = {
    method: req.method,
    origin: req.headers.origin || '',
    contentType: req.headers['content-type'] || '',
    // Vercel owns this header. Do not use forwarded headers in the standalone server.
    ip: String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim(),
    body,
  };
  return contact.sendContactResult(res, await handleContact(request));
}
