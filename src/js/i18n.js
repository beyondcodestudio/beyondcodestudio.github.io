/**
 * I18n (Internationalization) Module
 * Handles language switching and content translation
 */

// Supported languages
export const SUPPORTED_LANGUAGES = {
  id: { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  en: { code: 'en', name: 'English', flag: '🇬🇧' }
};

// Default language
const DEFAULT_LANG = 'id';

// Current translations cache
let translations = {};
let currentLang = DEFAULT_LANG;

/**
 * Get translations for a specific language
 * @param {string} lang - Language code ('id' or 'en')
 * @returns {Promise<Object>} Translation object
 */
export async function loadTranslations(lang) {
  if (translations[lang]) {
    return translations[lang];
  }

  try {
    const response = await fetch(`/locales/${lang}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load translations for ${lang}`);
    }
    translations[lang] = await response.json();
    return translations[lang];
  } catch (error) {
    console.error(`Error loading translations for ${lang}:`, error);
    // Fallback to default language
    if (lang !== DEFAULT_LANG) {
      return loadTranslations(DEFAULT_LANG);
    }
    return {};
  }
}

/**
 * Get nested object value by path
 * @param {Object} obj - Object to traverse
 * @param {string} path - Dot-separated path (e.g., 'nav.home')
 * @returns {string} Value at path or key if not found
 */
function getByPath(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
}

/**
 * Get translation for a key
 * @param {string} key - Translation key (dot-separated)
 * @param {Object} fallback - Fallback value if key not found
 * @returns {string} Translated text
 */
export function t(key, fallback = key) {
  // Get the current language's translations
  const langTranslations = translations[currentLang];
  if (!langTranslations) {
    return fallback;
  }
  const value = getByPath(langTranslations, key);
  return value !== null ? value : fallback;
}

/**
 * Get current language
 * @returns {string} Current language code
 */
export function getCurrentLang() {
  return currentLang;
}

/**
 * Detect user's preferred language
 * @returns {string} Detected language code
 */
function detectLanguage() {
  // Check localStorage first
  const savedLang = localStorage.getItem('preferredLanguage');
  if (savedLang && SUPPORTED_LANGUAGES[savedLang]) {
    return savedLang;
  }

  // Check URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  if (urlLang && SUPPORTED_LANGUAGES[urlLang]) {
    return urlLang;
  }

  // Check browser language
  const browserLang = navigator.language || navigator.userLanguage;
  if (browserLang.startsWith('id')) {
    return 'id';
  }
  if (browserLang.startsWith('en')) {
    return 'en';
  }

  // Default to Indonesian
  return DEFAULT_LANG;
}

/**
 * Save language preference
 * @param {string} lang - Language code to save
 */
function saveLanguagePreference(lang) {
  localStorage.setItem('preferredLanguage', lang);
}

/**
 * Update HTML lang attribute and meta tags
 * @param {string} lang - Language code
 */
function updateHtmlAttributes(lang) {
  document.documentElement.lang = lang === 'id' ? 'id' : 'en';

  // Update meta tags for SEO
  const metaDescription = document.querySelector('meta[name="description"]');
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  const ogImageAlt = document.querySelector('meta[property="og:image:alt"]');
  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  const twitterDescription = document.querySelector('meta[name="twitter:description"]');

  if (translations[lang]) {
    if (metaDescription) metaDescription.content = t('meta.description');
    if (metaKeywords) metaKeywords.content = t('meta.keywords');
    if (ogTitle) ogTitle.content = t('meta.ogTitle');
    if (ogDescription) ogDescription.content = t('meta.ogDescription');
    if (ogImageAlt) ogImageAlt.content = t('meta.ogImageAlt');
    if (twitterTitle) twitterTitle.content = t('meta.ogTitle');
    if (twitterDescription) twitterDescription.content = t('meta.ogDescription');
  }
}

/**
 * Update all translatable elements in the DOM
 */
function updateDOM() {
  // Update elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const value = t(key);

    if (value) {
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = value;
      } else {
        element.textContent = value;
      }
    }
  });

  // Update elements with data-i18n-attr (for attributes)
  document.querySelectorAll('[data-i18n-attr]').forEach(element => {
    const attrMap = JSON.parse(element.getAttribute('data-i18n-attr'));
    Object.keys(attrMap).forEach(attr => {
      const key = attrMap[attr];
      const value = t(key);
      if (value) {
        element.setAttribute(attr, value);
      }
    });
  });

  // Update elements with data-i18n-html (for HTML content)
  document.querySelectorAll('[data-i18n-html]').forEach(element => {
    const key = element.getAttribute('data-i18n-html');
    const value = t(key);
    if (value) {
      element.innerHTML = value;
    }
  });

  // Update hero title with highlight
  const heroTitle = document.querySelector('.hero-content h1');
  if (heroTitle) {
    const titleBase = t('hero.title');
    const titleHighlight = t('hero.titleHighlight');
    const titleSuffix = t('hero.titleSuffix');

    // Only update if we have valid translations
    if (titleBase && titleHighlight && titleSuffix) {
      heroTitle.innerHTML = `${titleBase}<br /><span class="text-gradient">${titleHighlight}</span>${titleSuffix}`;
    }
  }

  // Update hero description
  const heroDescription = document.querySelector('.hero-description');
  if (heroDescription) {
    const description = t('hero.description');
    if (description) {
      heroDescription.textContent = description;
    }
  }

  // Update elements with data-i18n-placeholder attribute
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    const value = t(key);
    if (value) {
      element.placeholder = value;
    }
  });

  // Update current language button in language switcher
  const currentLangBtn = document.getElementById('current-lang-btn');
  if (currentLangBtn && SUPPORTED_LANGUAGES[currentLang]) {
    const langInfo = SUPPORTED_LANGUAGES[currentLang];
    currentLangBtn.innerHTML = `${langInfo.flag} ${langInfo.name}
      <svg class="dropdown-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>`;
    currentLangBtn.setAttribute('data-lang', currentLang);
  }

  // Update active state in language dropdown
  document.querySelectorAll('.lang-option').forEach(option => {
    const lang = option.getAttribute('data-lang');
    if (lang === currentLang) {
      option.classList.add('active');
    } else {
      option.classList.remove('active');
    }
  });
}

/**
 * Switch language
 * @param {string} lang - Language code to switch to
 * @returns {Promise<void>}
 */
export async function switchLanguage(lang) {
  if (!SUPPORTED_LANGUAGES[lang]) {
    console.error(`Unsupported language: ${lang}`);
    return;
  }

  if (lang === currentLang) {
    return;
  }

  currentLang = lang;
  saveLanguagePreference(lang);

  // Load translations if not already loaded
  if (!translations[lang]) {
    await loadTranslations(lang);
  }

  updateHtmlAttributes(lang);
  updateDOM();

  // Dispatch custom event for other scripts to listen
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

/**
 * Initialize i18n system
 * @returns {Promise<void>}
 */
export async function initI18n() {
  currentLang = detectLanguage();
  await loadTranslations(currentLang);
  updateHtmlAttributes(currentLang);
  updateDOM();
}

// Export for use in other modules
export default {
  initI18n,
  switchLanguage,
  t,
  getCurrentLang,
  SUPPORTED_LANGUAGES
};
