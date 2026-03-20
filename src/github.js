export async function loadGitHubProfile() {
  const card = document.getElementById('github-card');
  if (!card) return;

  try {
    const response = await fetch('https://api.github.com/users/pyhor');
    const data = await response.json();

    card.innerHTML = `
      <a href="${data.html_url}" target="_blank" rel="noopener noreferrer">
        <img src="${data.avatar_url}" alt="${data.name}" class="github-avatar" />
        <div style="margin-top: 15px; font-size: 1.8rem; font-weight: 700; letter-spacing: -0.5px; color: #111;">${data.name || data.login}</div>
        <p style="margin: 8px 0 0 0; font-size: 1rem; color: #555; max-width: 300px; line-height: 1.5; font-weight: 400;">${data.bio || ''}</p>
        <div style="font-size: 0.9rem; color: #777; margin-top: 8px; display: flex; align-items: center; justify-content: center; gap: 6px; font-weight: 500;">
          <svg style="width: 14px; height: 14px; fill: currentColor;" viewBox="0 0 16 16"><path d="m8 0a6.5 6.5 0 0 1 6.5 6.5c0 4.546-4.786 8.948-6.14 10.16a.49.49 0 0 1 -.72 0c-1.354-1.212-6.14-5.614-6.14-10.16a6.5 6.5 0 0 1 6.5-6.5zm0 9.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path></svg>
          ${data.location || 'Earth'}
        </div>
        <div class="github-stats">
          <div class="stat">
            <span class="stat-value">${data.public_repos}</span>
            <span class="stat-label">Repos</span>
          </div>
          <div class="stat">
            <span class="stat-value">${data.followers}</span>
            <span class="stat-label">Followers</span>
          </div>
          <div class="stat">
            <span class="stat-value">${data.following}</span>
            <span class="stat-label">Following</span>
          </div>
        </div>
      </a>
    `;
  } catch (error) {
    card.innerHTML = `<div style="color: #ff3366; padding: 20px;">Connection severed. Failed to load profile.</div>`;
    console.error('Error fetching GitHub data:', error);
  }
}

loadGitHubProfile();
