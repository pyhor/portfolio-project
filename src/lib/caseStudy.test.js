import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
const read = path => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'))
const data = read('../data/jomgoCaseStudy.json')
const en = read('../../public/locales/en.json')
const zh = read('../../public/locales/zh-cn.json')

test('every lifecycle resolves to its actual requirement, story, and unexecuted UAT', () => {
  for (const path of data.paths) {
    const requirement = data.requirements.find(item => item.id === path.requirement)
    const story = data.stories.find(item => item.id === path.story)
    const uat = data.uat.find(item => item.id === path.uat)
    assert.ok(data.requirements.some(item => item.id === path.business && item.type === 'business'))
    assert.equal(requirement.story, story.id)
    assert.equal(story.requirement, requirement.id)
    assert.equal(requirement.uat, uat.id)
    assert.equal(uat.requirement, requirement.id)
    assert.equal(uat.status, 'notrun')
  }
})
test('implemented requirements have source references and proposals cannot imply executed UAT', () => {
  const ids = data.requirements.map(item => item.id)
  assert.equal(new Set(ids).size, ids.length)
  for (const requirement of data.requirements) {
    assert.ok(['implemented', 'proposed', 'planned', 'in-progress', 'out-of-scope'].includes(requirement.status))
    assert.ok(requirement.source && !requirement.source.startsWith('/'))
    if (requirement.uat) assert.ok(data.uat.some(item => item.id === requirement.uat))
  }
  assert.equal(data.requirements.find(item => item.id === 'NFR-02').status, 'proposed')
  assert.equal(data.requirements.find(item => item.id === 'FR-04').status, 'proposed')
  assert.ok(data.uat.every(item => item.status === 'notrun'))
})
test('all case study copy resolves in English and Simplified Chinese', () => {
  const visit = value => {
    if (typeof value === 'string' && value.startsWith('bsa_')) {
      assert.ok(en[value]?.trim(), `English: ${value}`)
      assert.ok(zh[value]?.trim(), `Chinese: ${value}`)
    } else if (Array.isArray(value)) value.forEach(visit)
    else if (value && typeof value === 'object') Object.values(value).forEach(visit)
  }
  visit(data)
  for (const key of Object.keys(en).filter(key => key.startsWith('bsa_') || key.startsWith('theme_'))) {
    assert.ok(zh[key]?.trim(), key)
  }
})
