import { t } from './i18n.js';

let cachedProjects = null;

export async function loadGitHubProjects() {
  const container = document.getElementById('projects-container');
  if (!container) return;

  try {
    if (!cachedProjects) {
        const response = await fetch('https://api.github.com/users/pyhor/repos?sort=updated&per_page=6');
        cachedProjects = await response.json();
    }
    const repos = cachedProjects;

    if (repos.length === 0) {
      container.innerHTML = `<div style="opacity: 0.5;">${t('work_empty', 'No public projects found.')}</div>`;
      return;
    }
    
    let html = '';
    repos.forEach(repo => {
      // Create a minimalist card for each repo
      html += `
        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-card">
          <div>
            <h3 style="margin: 0 0 8px 0; font-size: 1.1rem; font-weight: 600; letter-spacing: -0.5px;">${repo.name}</h3>
            <p style="margin: 0 0 16px 0; font-size: 0.85rem; opacity: 0.6; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 2.55rem;">${repo.description || 'No description provided.'}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; opacity: 0.5;">
              <span>${repo.language || t('stat_code', 'Code')}</span>
              <span>⭐ ${repo.stargazers_count}</span>
            </div>
          </div>
        </a>
      `;
    });

    container.innerHTML = html;
  } catch (error) {
    container.innerHTML = `<div style="color: red; opacity: 0.8;">${t('work_error', 'Failed to load projects.')}</div>`;
    console.error('Error fetching GitHub repos:', error);
  }
}

window.addEventListener('languageChanged', () => {
    if (document.getElementById('projects-container')) {
        loadGitHubProjects();
    }
});

loadGitHubProjects();
