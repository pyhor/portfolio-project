import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const user = process.env.VITE_GITHUB_USER || 'pyhor'
const outPath = resolve(__dirname, '../public/data/github-dashboard.json')

async function main() {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }

  const [profileRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${user}`, { headers }),
    fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=updated`, { headers }),
  ])

  if (!profileRes.ok || !reposRes.ok) {
    console.warn('[fetch-github-data] API request failed; skipping static bundle update.')
    process.exit(0)
  }

  const profile = await profileRes.json()
  const rawRepos = await reposRes.json()

  const repos = rawRepos
    .filter((repo) => !repo.fork)
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 12)
    .map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      html_url: repo.html_url,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      languages: repo.language ? { [repo.language]: 1 } : {},
      commitCount: null,
    }))

  await mkdir(dirname(outPath), { recursive: true })
  await writeFile(outPath, JSON.stringify({ profile, repos }, null, 2))
  console.log(`[fetch-github-data] Wrote ${repos.length} repos to public/data/github-dashboard.json`)
}

main().catch((error) => {
  console.warn('[fetch-github-data]', error.message)
  process.exit(0)
})
