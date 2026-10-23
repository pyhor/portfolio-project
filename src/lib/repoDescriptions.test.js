import test from 'node:test'
import assert from 'node:assert/strict'
import { repoDescription } from './repoDescriptions.js'

const t = key => `translated:${key}`
test('known repository summaries use curated translations in every language', () => {
  for (const lang of ['en', 'zh-cn', 'zh-tw', 'yue-hk', 'ms']) {
    assert.equal(repoDescription({ name: 'hotel-website-2023', description: 'Raw English' }, t, lang), 'translated:repo_hotel_desc')
  }
})
test('unknown external summaries never leak English into another selected language', () => {
  const repo = { name: 'new-project', description: 'Untranslated remote description' }
  assert.equal(repoDescription(repo, t, 'en'), repo.description)
  for (const lang of ['zh-cn', 'zh-tw', 'yue-hk', 'ms']) assert.equal(repoDescription(repo, t, lang), 'translated:repo_fallback_desc')
  assert.equal(repoDescription({ name: 'empty' }, t, 'en'), 'translated:repo_fallback_desc')
})
