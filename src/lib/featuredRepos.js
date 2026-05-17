export const FEATURED_REPO_NAMES = [
  'vet-mgmt-system-2024',
  'hotel-website-2023',
  'cinema-mgmt-system-2020',
]

export const REPO_LIVE_URLS = {
  'hotel-website-2023': 'https://pyhor.github.io/hotel-website-2023/',
}

export function pickFeaturedRepos(repos, limit = 3) {
  const byName = new Map(repos.map((repo) => [repo.name, repo]))
  const picked = []

  for (const name of FEATURED_REPO_NAMES) {
    const repo = byName.get(name)
    if (repo) {
      picked.push(repo)
      byName.delete(name)
    }
  }

  for (const repo of repos) {
    if (picked.length >= limit) break
    if (!picked.some((item) => item.id === repo.id)) picked.push(repo)
  }

  return picked.slice(0, limit)
}

export function repoLanguageList(repo) {
  const fromMap = Object.keys(repo.languages || {})
  if (fromMap.length) return fromMap.slice(0, 6)
  return repo.language ? [repo.language] : []
}
