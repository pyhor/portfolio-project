import test from 'node:test'
import assert from 'node:assert/strict'
import { readThemePreference, resolveTheme } from './theme.js'

test('system is the default, including unavailable or invalid storage', () => {
  assert.equal(readThemePreference({ getItem: () => null }), 'system')
  assert.equal(readThemePreference({ getItem: () => 'other' }), 'system')
  assert.equal(readThemePreference({ getItem() { throw new Error('blocked') } }), 'system')
})
test('explicit preference overrides the OS and system follows it', () => {
  assert.equal(resolveTheme('system', true), 'dark')
  assert.equal(resolveTheme('system', false), 'light')
  assert.equal(resolveTheme('light', true), 'light')
  assert.equal(resolveTheme('dark', false), 'dark')
  assert.equal(readThemePreference({ getItem: () => 'dark' }), 'dark')
})
