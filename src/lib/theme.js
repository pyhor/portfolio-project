export function readThemePreference(storage) {
  try {
    const stored = storage.getItem('theme')
    return ['system', 'light', 'dark'].includes(stored) ? stored : 'system'
  } catch { return 'system' }
}

export function resolveTheme(preference, prefersDark) {
  return preference === 'system' ? (prefersDark ? 'dark' : 'light') : preference
}
