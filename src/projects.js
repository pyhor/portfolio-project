import { t } from './i18n.js';

let cachedProjects = null;

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function loadGitHubProjects() {
  const container = document.getElementById('projects-container');
  if (!container) return;

  try {
    if (!cachedProjects) {
        const response = await fetch(`${BACKEND_URL}/api/repos`);
        const repos = await response.json();
        
        // Fetch languages for each repo in parallel using our new backend proxy
        cachedProjects = await Promise.all(repos.map(async (repo) => {
            try {
                const owner = repo.owner.login;
                const repoName = repo.name;
                const langRes = await fetch(`${BACKEND_URL}/api/languages?owner=${owner}&repo=${repoName}`);
                const languages = await langRes.json();
                repo.all_languages = Object.keys(languages);
            } catch (e) {
                repo.all_languages = repo.language ? [repo.language] : [];
            }
            return repo;
        }));
    }
    const repos = cachedProjects;

    if (repos.length === 0) {
      container.innerHTML = `<div style="opacity: 0.5;">${t('work_empty', 'No public projects found.')}</div>`;
      return;
    }
    
    let html = '';
    repos.forEach(repo => {
      const languages = repo.all_languages && repo.all_languages.length > 0 
        ? repo.all_languages.join(', ') 
        : (repo.language || t('stat_code', 'Code'));

      // Create a minimalist card for each repo
      html += `
        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-card">
          <div>
            <h3 style="margin: 0 0 8px 0; font-size: 1.1rem; font-weight: 600; letter-spacing: -0.5px;">${repo.name}</h3>
            <p style="margin: 0 0 16px 0; font-size: 0.85rem; opacity: 0.6; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 2.55rem;">${repo.description || 'No description provided.'}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; opacity: 0.5;">
              <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 70%;">${languages}</span>
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
