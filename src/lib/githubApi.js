import fallbackData from '../data/fallbackGithub.json'

const GITHUB_API = 'https://api.github.com'
export const GITHUB_USER = import.meta.env.VITE_GITHUB_USER || 'pyhor'
const CACHE_KEY = `github-dashboard:${GITHUB_USER}`
const CACHE_TTL_MS = 6 * 60 * 60 * 1000
const memoryCache = new Map()

const staticDataUrl = `${import.meta.env.BASE_URL}data/github-dashboard.json`

export function getRateLimitMessage(remaining) {
  if (remaining === 0) {
    return 'GitHub API rate limit reached. Showing cached or saved project data until the limit resets.'
  }
  return null
}

function readStorageCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.savedAt || !parsed?.payload) return null
    return parsed
  } catch {
    return null
  }
}

function writeStorageCache(payload) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        savedAt: Date.now(),
        payload,
      }),
    )
  } catch {
    /* quota or private mode */
  }
}

function isFresh(savedAt) {
  return Date.now() - savedAt < CACHE_TTL_MS
}

async function fetchStaticBundle() {
  try {
    const response = await fetch(staticDataUrl, { cache: 'default' })
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

async function githubFetch(url) {
  const key = url
  if (memoryCache.has(key)) return memoryCache.get(key)

  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })

  const remainingHeader = response.headers.get('X-RateLimit-Remaining')
  const remaining = remainingHeader != null ? Number(remainingHeader) : null

  if (response.status === 403 || response.status === 429) {
    const error = new Error('rate_limit')
    error.remaining = remaining
    throw error
  }

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`)
  }

  const data = await response.json()
  const result = { data, remaining }
  memoryCache.set(key, result)
  return result
}

function normalizeRepo(repo) {
  const languages = repo.language ? { [repo.language]: 1 } : repo.languages || {}
  return {
    ...repo,
    languages,
    commitCount: repo.commitCount ?? null,
  }
}

function normalizeDashboard({ profile, repos }) {
  return {
    profile,
    repos: (repos || []).map(normalizeRepo),
  }
}

async function fetchLiveDashboard(limit = 12) {
  const [{ data: profile }, { data: rawRepos, remaining }] = await Promise.all([
    githubFetch(`${GITHUB_API}/users/${GITHUB_USER}`),
    githubFetch(`${GITHUB_API}/users/${GITHUB_USER}/repos?per_page=100&sort=updated`),
  ])

  const repos = rawRepos
    .filter((repo) => !repo.fork)
    .sort((a, b) => {
      const scoreA = a.stargazers_count * 4 + a.forks_count * 2 + new Date(a.updated_at).getTime() / 1e11
      const scoreB = b.stargazers_count * 4 + b.forks_count * 2 + new Date(b.updated_at).getTime() / 1e11
      return scoreB - scoreA
    })
    .slice(0, limit)
    .map(normalizeRepo)

  return { profile, repos, remaining }
}

function withFallback(payload, source) {
  return {
    ...normalizeDashboard(payload),
    source,
    fromCache: source !== 'live',
  }
}

/**
 * Loads GitHub dashboard data with layered fallbacks:
 * 1. Fresh localStorage cache
 * 2. Build-time static JSON
 * 3. Live GitHub API (then cache)
 * 4. Stale localStorage / static / bundled fallback
 */
export async function loadGitHubDashboard(limit = 12, { backgroundRefresh = true } = {}) {
  const stored = readStorageCache()
  if (stored && isFresh(stored.savedAt)) {
    const cached = withFallback(stored.payload, 'localStorage')
    if (backgroundRefresh) {
      refreshGitHubDashboard(limit).catch(() => {})
    }
    return cached
  }

  const staticBundle = await fetchStaticBundle()
  if (staticBundle?.profile) {
    const fromStatic = withFallback(staticBundle, 'static')
    writeStorageCache({ profile: fromStatic.profile, repos: fromStatic.repos })
    if (backgroundRefresh) {
      refreshGitHubDashboard(limit).catch(() => {})
    }
    return fromStatic
  }

  try {
    const live = await fetchLiveDashboard(limit)
    const payload = { profile: live.profile, repos: live.repos }
    writeStorageCache(payload)
    return { ...withFallback(payload, 'live'), remaining: live.remaining, fromCache: false }
  } catch (error) {
    if (stored?.payload) {
      return {
        ...withFallback(stored.payload, 'localStorage-stale'),
        error: error.message,
        rateLimit: error.remaining,
        fromCache: true,
      }
    }

    if (staticBundle?.profile) {
      return {
        ...withFallback(staticBundle, 'static'),
        error: error.message,
        rateLimit: error.remaining,
        fromCache: true,
      }
    }

    return {
      ...withFallback(fallbackData, 'fallback'),
      error: error.message === 'rate_limit' ? 'rate_limit' : error.message,
      rateLimit: error.remaining,
      fromCache: true,
    }
  }
}

export async function refreshGitHubDashboard(limit = 12) {
  try {
    const live = await fetchLiveDashboard(limit)
    const payload = { profile: live.profile, repos: live.repos }
    writeStorageCache(payload)
    return withFallback(payload, 'live')
  } catch {
    return null
  }
}

export async function fetchGitHubProfile() {
  const dashboard = await loadGitHubDashboard(1)
  return dashboard.profile
}
