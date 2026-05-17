import { useEffect, useState } from 'react'
import { loadGitHubDashboard } from '../lib/githubApi'

export function useGithubData(limit = 12) {
  const [state, setState] = useState({
    profile: null,
    repos: [],
    loading: true,
    error: null,
    rateLimit: null,
    fromCache: false,
    source: null,
  })

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const result = await loadGitHubDashboard(limit)
        if (cancelled) return
        setState({
          profile: result.profile,
          repos: result.repos,
          loading: false,
          error: result.error || null,
          rateLimit: result.rateLimit ?? null,
          fromCache: result.fromCache ?? false,
          source: result.source ?? null,
        })
      } catch (error) {
        if (!cancelled) {
          setState((current) => ({
            ...current,
            loading: false,
            error: error.message === 'rate_limit' ? 'rate_limit' : error.message,
            rateLimit: error.remaining,
          }))
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [limit])

  return state
}
