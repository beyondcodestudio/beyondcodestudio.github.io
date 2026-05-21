/* Animations Controller - BeyondCode Studio */

/* Scroll Trigger reveals using Intersection Observer */
export function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-item');
  
  if (revealElements.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // trigger when 15% of the element is visible
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target); // stop observing once animated
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));

  // Initialize Hero Interactive Mouse Follow Light Tracker
  initHeroGlowTracker();
}

/* Mouse-follow glow effect for the Hero Card */
function initHeroGlowTracker() {
  const card = document.querySelector('.hero-card');
  if (!card) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position inside element
    const y = e.clientY - rect.top;  // y position inside element
    
    // Set variables to CSS for dynamic glow gradients
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
}

/* Animate numerical counters for Stats Section */
export function initStatsCounter() {
  const statValues = document.querySelectorAll('.stat-item h3');
  
  if (statValues.length === 0) return;

  const observerOptions = {
    threshold: 0.5 // trigger when 50% of the section is visible
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        obs.unobserve(entry.target); // only count up once
      }
    });
  }, observerOptions);

  // Observe the parent container
  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    observer.observe(statsSection);
  }

  function animateCounters() {
    statValues.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 2000; // 2 seconds
      const stepTime = Math.abs(Math.floor(duration / target));
      
      let current = 0;
      
      const timer = setInterval(() => {
        current += Math.ceil(target / 40); // increment size
        if (current >= target) {
          counter.textContent = target + (counter.parentElement.id === 'stat-rating' ? '%' : '+');
          clearInterval(timer);
        } else {
          counter.textContent = current + '+';
        }
      }, 30);
    });
  }
}
