/* Core Javascript Module - BeyondCode Studio */

import '../style.css';
import { initScrollAnimations, initStatsCounter } from './animations.js';
import { initContactForm } from './contact.js';
import { initI18n, switchLanguage, SUPPORTED_LANGUAGES } from './i18n.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 0. I18n Localization (initialize first so all content is translated)
  await initI18n();
  initLanguageSwitcher();

  // 1. Theme Toggle (run early so no flash of wrong theme)
  initThemeToggle();

  // 2. Navigation Actions
  initNavigation();

  // 3. Scroll-Triggered Animations & Numeric Stats Counter
  initScrollAnimations();
  initStatsCounter();

  // 4. Interactive Testimonials Slider/Carousel
  initTestimonialsSlider();

  // 5. Contact Form Validation
  initContactForm();

  // 6. Portfolio Filtering
  initPortfolioFilter();
});

/* Light / Dark Theme Toggle */
function initThemeToggle() {
  const btn = document.getElementById('theme-toggle-btn');
  if (!btn) return;

  // Apply saved preference immediately (prevents flash)
  const saved = localStorage.getItem('theme');
  if (saved === 'light') {
    document.body.setAttribute('data-theme', 'light');
  } else {
    document.body.removeAttribute('data-theme');
  }

  btn.addEventListener('click', () => {
    const isLight = document.body.getAttribute('data-theme') === 'light';
    if (isLight) {
      document.body.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
      btn.setAttribute('aria-label', 'Switch to Light Mode');
    } else {
      document.body.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      btn.setAttribute('aria-label', 'Switch to Dark Mode');
    }
  });

  // Sync aria-label with initial state
  const current = document.body.getAttribute('data-theme');
  btn.setAttribute('aria-label', current === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode');
}

/* Mobile Menu & Scroll Toggles */
function initNavigation() {
  const navbar = document.getElementById('main-navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky Navbar on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    highlightActiveLink();
  });

  // Toggle Hamburger Menu
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('active');
      
      // Animate Hamburger Icon lines
      const isOpened = navMenu.classList.contains('active');
      navToggle.setAttribute('aria-expanded', isOpened);
    });

    // Close Menu when clicking any Link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });

    // Close Menu when clicking outside navbar area
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navMenu.classList.remove('active');
      }
    });
  }

  // Active Link Highlighter logic on Scroll
  function highlightActiveLink() {
    const sections = document.querySelectorAll('section, footer');
    const scrollPos = window.scrollY + 120; // offset

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (sectionId && scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

/* Testimonials Slider logic */
function initTestimonialsSlider() {
  const slider = document.getElementById('testimonial-slides');
  const dots = document.querySelectorAll('.slider-dot');
  
  if (!slider || dots.length === 0) return;
  
  let currentSlide = 0;
  const slideCount = dots.length;
  let autoplayTimer;

  function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    slider.style.transform = `translateX(-${slideIndex * 100}%)`;
    
    // Update active dot indicators
    dots.forEach((dot, index) => {
      if (index === slideIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  // Manual Trigger via Dot Clicking
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
      resetAutoplay();
    });
  });

  // Autoplay functionality
  function startAutoplay() {
    autoplayTimer = setInterval(() => {
      let nextSlide = (currentSlide + 1) % slideCount;
      goToSlide(nextSlide);
    }, 6000); // changes every 6 seconds
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  startAutoplay();
}

/* Portfolio Filtering Action */
function initPortfolioFilter() {
  const filters = document.querySelectorAll('#portfolio-filters .filter-btn');
  const cards = document.querySelectorAll('#portfolio-container .portfolio-card');

  if (filters.length === 0 || cards.length === 0) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle Active state for filters buttons
      filters.forEach(f => f.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* Language Switcher */
function initLanguageSwitcher() {
  const switcher = document.getElementById('language-switcher');
  if (!switcher) return;

  const currentBtn = switcher.querySelector('#current-lang-btn');
  const dropdown = switcher.querySelector('#lang-dropdown');
  const langOptions = switcher.querySelectorAll('.lang-option');

  // Toggle dropdown
  if (currentBtn) {
    currentBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('active');
      currentBtn.setAttribute('aria-expanded', dropdown.classList.contains('active'));
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!switcher.contains(e.target)) {
      dropdown.classList.remove('active');
      if (currentBtn) {
        currentBtn.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // Handle language selection
  langOptions.forEach(option => {
    option.addEventListener('click', async (e) => {
      const lang = e.currentTarget.getAttribute('data-lang');
      if (lang && SUPPORTED_LANGUAGES[lang]) {
        await switchLanguage(lang);

        // Update current language button
        const langInfo = SUPPORTED_LANGUAGES[lang];
        currentBtn.innerHTML = `${langInfo.flag} ${langInfo.name}`;
        currentBtn.setAttribute('data-lang', lang);

        // Close dropdown
        dropdown.classList.remove('active');
        currentBtn.setAttribute('aria-expanded', 'false');

        // Update active state
        langOptions.forEach(opt => opt.classList.remove('active'));
        e.currentTarget.classList.add('active');
      }
    });
  });
}
