import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validateContactForm, submitContact } from './contact.js'

const valid = { name: 'Ada', email: 'ada@example.org', subject: 'A project', message: 'A message about a project.', website: '' }

test('frontend validation returns field errors and accepts a valid form', () => {
  assert.deepEqual(validateContactForm(valid), {})
  assert.deepEqual(validateContactForm({ name: '', email: 'bad', subject: 'a', message: 'short' }), { name: 'required', email: 'invalid', subject: 'too_short', message: 'too_short' })
})

test('submits JSON and requires an explicit success receipt', async () => {
  let request
  assert.deepEqual(await submitContact(valid, { endpoint: '/api/contact', fetchImpl: async (url, options) => {
    request = { url, options }
    return { ok: true, status: 200, json: async () => ({ ok: true }) }
  } }), { ok: true })
  assert.equal(request.url, '/api/contact')
  assert.equal(request.options.method, 'POST')
  assert.equal(request.options.headers['Content-Type'], 'application/json')
  assert.equal(JSON.parse(request.options.body).email, 'ada@example.org')
  const invalidReceipt = await submitContact(valid, { fetchImpl: async () => ({ ok: true, status: 200, json: async () => ({}) }) })
  assert.equal(invalidReceipt.code, 'delivery_failed')
})

test('static host missing API and provider failure remain failures', async () => {
  for (const status of [404, 405, 503]) {
    const result = await submitContact(valid, { fetchImpl: async () => ({ ok: false, status, json: async () => { throw new Error('HTML'); } }) })
    assert.equal(result.ok, false)
    assert.equal(result.code, 'not_configured')
  }
  assert.equal((await submitContact(valid, { fetchImpl: async () => { throw new Error('offline'); } })).code, 'network_error')
})
