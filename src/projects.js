import { t } from './i18n.js'
import { enrichRepo, fetchGitHubRepos } from './lib/githubApi.js'

let cachedProjects = null

export async function loadGitHubProjects() {
  const container = document.getElementById('projects-container')
  if (!container) return

  try {
    if (!cachedProjects) {
      const repos = await fetchGitHubRepos(6)
      cachedProjects = await Promise.all(repos.map((repo) => enrichRepo(repo)))
    }

    const repos = cachedProjects

    if (repos.length === 0) {
      container.innerHTML = `<p class="projects-empty">${t('work_empty', 'No public projects found.')}</p>`
      return
    }

    container.innerHTML = repos
      .map((repo) => {
        const languages =
          repo.languages && Object.keys(repo.languages).length > 0
            ? Object.keys(repo.languages).join(', ')
            : repo.language || t('stat_code', 'Code')

        return `
        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-card">
          <h3>${repo.name}</h3>
          <p>${repo.description || 'No description provided.'}</p>
          <footer>
            <span>${languages}</span>
            <span>⭐ ${repo.stargazers_count}</span>
          </footer>
        </a>
      `
      })
      .join('')
  } catch (error) {
    const message =
      error.message === 'rate_limit'
        ? t('github_rate_limit', 'GitHub API rate limit reached. Please try again later.')
        : t('work_error', 'Failed to load projects.')
    container.innerHTML = `<p class="projects-error">${message}</p>`
    console.error('Error fetching GitHub repos:', error)
  }
}

window.addEventListener('languageChanged', () => {
  if (document.getElementById('projects-container')) {
    cachedProjects = null
    loadGitHubProjects()
  }
})

loadGitHubProjects()
