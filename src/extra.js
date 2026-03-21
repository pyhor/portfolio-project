import { t } from './i18n.js';

let currentContributionYear = new Date().getFullYear();

export async function loadGitHubContributions(year = currentContributionYear) {
    const container = document.getElementById('contributions-container');
    if (!container) return;

    try {
        const username = 'pyhor';
        // Switching to a more robust SVG service that supports year selection
        // We'll use the user's preferred color scheme (standard GitHub green for clarity, but the filter will adjust it for themes)
        const chartUrl = `https://github-contributions-api.deno.dev/${username}.svg?year=${year}&no-legend=true&no-total=true`;

        // Calculate years for selection (last 5 years)
        const currentYear = new Date().getFullYear();
        let yearOptions = '';
        for (let y = currentYear; y >= currentYear - 4; y--) {
            yearOptions += `<option value="${y}" ${y === year ? 'selected' : ''}>${y}</option>`;
        }

        container.innerHTML = `
            <div class="contributions-card story-text">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <h3 style="margin: 0; font-size: 1.2rem; font-weight: 600; letter-spacing: -0.5px;">GitHub Contributions</h3>
                    <div class="year-selector-wrapper">
                        <select id="contribution-year-select" class="year-select">
                            ${yearOptions}
                        </select>
                    </div>
                </div>
                
                <div class="calendar-wrapper" style="width: 100%; overflow-x: auto; padding-bottom: 10px;">
                    <div class="chart-loading-overlay" id="chart-loader" style="display:none; position:absolute; inset:0; background:var(--glass-bg); backdrop-filter:blur(4px); align-items:center; justify-content:center; border-radius:12px; z-index:5;">
                        <span style="font-size:0.9rem; font-weight:600; opacity:0.7;">Updating...</span>
                    </div>
                    <img id="contribution-chart" src="${chartUrl}" alt="${username}'s GitHub Contributions" 
                         style="width: 100%; min-width: 700px; transition: opacity 0.3s ease;" 
                         onload="document.getElementById('chart-loader').style.display='none'; this.style.opacity='1';" />
                </div>
                
                <div style="margin-top: 15px; display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; opacity: 0.6;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span>Less</span>
                        <div style="display: flex; gap: 3px;">
                            <div style="width: 10px; height: 10px; background: #ebedf0; border-radius: 2px;"></div>
                            <div style="width: 10px; height: 10px; background: #9be9a8; border-radius: 2px;"></div>
                            <div style="width: 10px; height: 10px; background: #40c463; border-radius: 2px;"></div>
                            <div style="width: 10px; height: 10px; background: #30a14e; border-radius: 2px;"></div>
                            <div style="width: 10px; height: 10px; background: #216e39; border-radius: 2px;"></div>
                        </div>
                        <span>More</span>
                    </div>
                    <a href="https://github.com/pyhor" target="_blank" style="color: inherit; text-decoration: none; border-bottom: 1px solid currentColor;">@pyhor &rarr;</a>
                </div>
            </div>
        `;

        // Re-attach event listener
        const select = document.getElementById('contribution-year-select');
        if (select) {
            select.addEventListener('change', (e) => {
                const selectedYear = parseInt(e.target.value);
                const chartImg = document.getElementById('contribution-chart');
                const loader = document.getElementById('chart-loader');

                if (chartImg && loader) {
                    loader.style.display = 'flex';
                    chartImg.style.opacity = '0.3';
                    currentContributionYear = selectedYear;
                    // Append a cache-busting timestamp to force a fresh fetch
                    const timestamp = new Date().getTime();
                    chartImg.src = `https://github-contributions-api.deno.dev/${username}.svg?year=${selectedYear}&no-legend=true&no-total=true&_=${timestamp}`;
                }
            });
        }
    } catch (error) {
        container.innerHTML = `<div style="opacity: 0.5;">${t('contributions_error', 'Unable to load contribution data.')}</div>`;
        console.error('Error loading contributions:', error);
    }
}

export function initClock() {
    const clockElements = document.querySelectorAll('.current-time');

    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });

        clockElements.forEach(el => {
            el.textContent = timeString;
        });
    }

    updateClock();
    setInterval(updateClock, 1000);
}

// Initial calls
loadGitHubContributions();
initClock();

window.addEventListener('languageChanged', () => {
    loadGitHubContributions(currentContributionYear);
});
