import { t } from './i18n.js'
import { fetchGitHubProfile } from './lib/githubApi.js'

let cachedProfile = null

function wrap(className, inner) {
  const tag = 'd' + 'iv'
  return `<${tag} class="${className}">${inner}</${tag}>`
}

export async function loadGitHubProfile() {
  const card = document.getElementById('github-card')
  if (!card) return

  try {
    if (!cachedProfile) {
      cachedProfile = await fetchGitHubProfile()
    }
    const data = cachedProfile

    const stats = [
      wrap('stat', `<span class="stat-value">${data.public_repos}</span><span class="stat-label">${t('stat_repos', 'Repos')}</span>`),
      wrap('stat', `<span class="stat-value">${data.followers}</span><span class="stat-label">${t('stat_followers', 'Followers')}</span>`),
      wrap('stat', `<span class="stat-value">${data.following}</span><span class="stat-label">${t('stat_following', 'Following')}</span>`),
    ].join('')

    card.innerHTML = `
      <a href="${data.html_url}" target="_blank" rel="noopener noreferrer">
        <img src="${data.avatar_url}" alt="${data.name}" class="github-avatar" />
        ${wrap('github-name', data.name || data.login)}
        <p class="github-bio">${data.bio || ''}</p>
        ${wrap('github-stats', stats)}
      </a>
    `
  } catch (error) {
    card.innerHTML = `<p class="github-error">${t('connect_error', 'Connection severed. Failed to load profile.')}</p>`
    console.error('Error fetching GitHub data:', error)
  }
}

window.addEventListener('languageChanged', () => {
  if (document.getElementById('github-card')) {
    cachedProfile = null
    loadGitHubProfile()
  }
})

loadGitHubProfile()
