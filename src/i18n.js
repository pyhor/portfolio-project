export let i18nDict = {};

export async function loadLanguage(lang) {
    try {
        const response = await fetch(`./locales/${lang}.json`);
        if (!response.ok) throw new Error('Locale not found');

        i18nDict = await response.json();

        // Update DOM elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (i18nDict[key]) {
                el.innerHTML = i18nDict[key];
            }
        });

        // Store user preference
        localStorage.setItem('lang', lang);
        document.documentElement.setAttribute('lang', lang);

        // Update active state on language pickers
        document.querySelectorAll('.lang-btn').forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.style.opacity = '1';
                btn.style.color = '#aa55ff'; // subtle indicator color
            } else {
                btn.style.opacity = '0.5';
                btn.style.color = 'var(--text-color)';
            }
        });

        // Notify dynamic JS modules (GitHub / Projects) to re-render
        window.dispatchEvent(new Event('languageChanged'));

    } catch (e) {
        console.error('Failed to load language', lang, e);
        if (lang !== 'en') return loadLanguage('en'); // fallback
    }
}

// Getter for dynamic scripts
export function t(key, fallback = '') {
    return i18nDict[key] || fallback;
}

export function initI18n() {
    const savedLang = localStorage.getItem('lang') || 'en';
    loadLanguage(savedLang);

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = e.target.getAttribute('data-lang');
            loadLanguage(lang);
        });
    });
}
