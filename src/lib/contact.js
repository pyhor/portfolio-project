const EMAIL = /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i

export function validateContactForm(form) {
  const errors = {}
  for (const [field, min, max] of [['name', 2, 100], ['email', 3, 254], ['subject', 3, 160], ['message', 10, 5000]]) {
    const value = (form[field] || '').trim()
    if (!value) errors[field] = 'required'
    else if (value.length > max) errors[field] = 'too_long'
    else if (field === 'email' && !EMAIL.test(value)) errors[field] = 'invalid'
    else if (value.length < min) errors[field] = 'too_short'
    else if (field !== 'message' && /[\u0000-\u001f\u007f]/.test(form[field])) errors[field] = 'invalid'
    else if (field === 'message' && /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) errors[field] = 'invalid'
  }
  return errors
}

export async function submitContact(form, { endpoint = '/api/contact', fetchImpl = globalThis.fetch, signal } = {}) {
  try {
    const response = await fetchImpl(endpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form), signal, credentials: 'omit',
    })
    const data = await response.json().catch(() => null)
    if (response.ok && data?.ok === true) return { ok: true }
    if ([404, 405, 503].includes(response.status)) return { ok: false, code: 'not_configured' }
    const codes = ['validation_error', 'rate_limited', 'origin_not_allowed', 'delivery_timeout', 'spam_detected', 'not_configured']
    return { ok: false, code: codes.includes(data?.code) ? data.code : 'delivery_failed', fields: data?.fields }
  } catch (error) {
    return { ok: false, code: error.name === 'AbortError' ? 'delivery_timeout' : 'network_error' }
  }
}
