import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import test from 'node:test'

const root = resolve(import.meta.dirname, '..')
const read = (file) => readFileSync(resolve(root, file), 'utf8')
const en = JSON.parse(read('public/locales/en.json'))
const zh = JSON.parse(read('public/locales/zh-cn.json'))
const placeholders = (value) => [...value.matchAll(/\{\{([^}]+)\}\}/g)].map((match) => match[1]).sort()
function sources(dir) {
  return readdirSync(resolve(root, dir)).flatMap((name) => {
    const file = `${dir}/${name}`
    return statSync(resolve(root, file)).isDirectory() ? sources(file) : /\.(jsx|js)$/.test(name) ? [file] : []
  })
}

test('English and Simplified Chinese have matching, nonempty entries and interpolation tokens', () => {
  assert.deepEqual(Object.keys(en).sort(), Object.keys(zh).sort())
  for (const [key, value] of Object.entries(en)) {
    assert.equal(typeof value, 'string', key)
    assert.ok(value.trim(), `Empty English entry: ${key}`)
    assert.ok(zh[key].trim(), `Empty Chinese entry: ${key}`)
    assert.deepEqual(placeholders(value), placeholders(zh[key]), `Interpolation mismatch: ${key}`)
  }
})

test('literal React translation calls exist in both primary locales', () => {
  for (const file of sources('src').filter((file) => file.endsWith('.jsx'))) {
    for (const [, key] of read(file).matchAll(/\bt\(\s*['"]([^'"]+)['"]/g)) {
      assert.ok(en[key], `Missing English ${key} in ${file}`)
      assert.ok(zh[key], `Missing Chinese ${key} in ${file}`)
    }
  }
})

test('dynamic system and workflow content is complete in both primary locales', () => {
  const keys = []
  for (const view of ['business', 'build', 'quality']) {
    for (const suffix of ['', '_tag', '_title', '_output', '_row_0', '_row_1', '_row_2']) keys.push(`system_${view}${suffix}`)
  }
  for (const stage of ['requirements', 'analysis', 'design', 'development', 'testing', 'release']) {
    for (const suffix of ['', '_question', '_description', '_artifact', '_example', '_check_0', '_check_1']) keys.push(`workflow_${stage}${suffix}`)
  }
  for (const key of keys) {
    assert.ok(en[key], `Missing English ${key}`)
    assert.ok(zh[key], `Missing Chinese ${key}`)
  }
})

test('project and navigation translation references exist in both locales', () => {
  for (const file of ['src/data/featuredProjects.js', 'src/data/showcaseProjects.js', 'src/routes.js', 'src/data/timeline.js']) {
    for (const [, key] of read(file).matchAll(/\b\w+Key:\s*['"]([^'"]+)['"]/g)) {
      assert.ok(en[key], `Missing English ${key} in ${file}`)
      assert.ok(zh[key], `Missing Chinese ${key} in ${file}`)
    }
  }
})

test('all contact field error variants are translated', () => {
  for (const field of ['name', 'email', 'subject', 'message']) {
    for (const error of ['required', 'too_short', 'too_long', 'invalid']) {
      const key = `contact_error_${field}_${error}`
      assert.ok(en[key], `Missing English ${key}`)
      assert.ok(zh[key], `Missing Chinese ${key}`)
    }
  }
})

test('interactive engineering and project reflection states are fully translated', () => {
  const keys = []
  for (const scenario of ['complete', 'missing', 'existing']) {
    keys.push(`engineering_case_${scenario}`, `engineering_${scenario}_response`, `engineering_${scenario}_code`)
    for (let i = 0; i < 3; i++) keys.push(`engineering_${scenario}_node_${i}`)
  }
  for (let i = 0; i < 3; i++) {
    keys.push(`engineering_layer_${i}`, `engineering_node_${i}`, `engineering_detail_${i}_title`, `engineering_detail_${i}_body`, `engineering_detail_${i}_code`)
  }
  for (const project of ['hotel', 'research']) {
    for (const suffix of ['category', 'title', 'source']) keys.push(`ideas_${project}_${suffix}`)
    for (const step of ['problem', 'opportunity', 'approach', 'value']) {
      keys.push(`ideas_step_${step}`, `ideas_${project}_${step}`, `ideas_${project}_${step}_title`)
    }
  }
  for (const key of keys) {
    assert.ok(en[key], `Missing English ${key}`)
    assert.ok(zh[key], `Missing Chinese ${key}`)
  }
})
