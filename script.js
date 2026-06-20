/**
 * Umar Farooq Portfolio — script.js (UPGRADED)
 * Features:
 *  - Hamburger mobile menu toggle
 *  - Navbar scroll shadow
 *  - Active nav link on scroll (IntersectionObserver)
 *  - Back-to-top button visibility
 *  - Scroll-reveal animation for section cards
 *  - Theme Toggle (Dark/Light)
 *  - Scroll Progress Bar
 *  - Hero Particles Animation
 *  - Typing Effect
 *  - Counter Animation
 *  - Close mobile menu on nav link click
 */

/* ──────────────────────────────────────
   DOM references
────────────────────────────────────── */
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const navMenu     = document.getElementById('navMenu');
const navLinks    = document.querySelectorAll('.nav-link');
const backToTop   = document.getElementById('backToTop');
const themeToggle = document.getElementById('themeToggle');
const scrollProgress = document.getElementById('scrollProgress');

/* ──────────────────────────────────────
   1. THEME TOGGLE (Dark/Light)
────────────────────────────────────── */
// Check saved theme or system preference
const getPreferredTheme = () => {
  const saved = localStorage.getItem('theme');
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

const setTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  updateThemeIcon(theme);
};

const updateThemeIcon = (theme) => {
  if (!themeToggle) return;
  themeToggle.innerHTML = theme === 'light' 
    ? '<i class="fa-solid fa-sun"></i>' 
    : '<i class="fa-solid fa-moon"></i>';
};

// Initialize theme
const initialTheme = getPreferredTheme();
setTheme(initialTheme);

// Theme toggle click
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    setTheme(next);
  });
}

/* ──────────────────────────────────────
   2. SCROLL PROGRESS BAR
────────────────────────────────────── */
if (scrollProgress) {
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  }, { passive: true });
}

/* ──────────────────────────────────────
   3. HERO PARTICLES
────────────────────────────────────── */
function createParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  
  // Clear existing particles
  container.innerHTML = '';
  
  const particleCount = window.innerWidth < 640 ? 15 : 30;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    const size = Math.random() * 4 + 2;
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.animationDuration = (Math.random() * 20 + 10) + 's';
    particle.style.animationDelay = (Math.random() * 10) + 's';
    particle.style.opacity = Math.random() * 0.4 + 0.1;
    container.appendChild(particle);
  }
}

// Create particles on load and resize
createParticles();
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(createParticles, 500);
});

/* ──────────────────────────────────────
   4. TYPING EFFECT (Hero)
────────────────────────────────────── */
function initTypingEffect() {
  const cursor = document.querySelector('.cursor');
  if (!cursor) return;
  
  // Simple typing effect: just blink cursor
  // For more advanced, you can add text rotation here
  const roles = ['Web Developer', 'Android Developer', 'UI/UX Designer', 'Freelancer'];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const heroRole = document.querySelector('.hero-role');
  if (!heroRole) return;
  
  // Store original text if any
  const originalText = heroRole.textContent;
  
  // Simple typewriter effect
  function typeEffect() {
    const currentRole = roles[roleIndex];
    
    if (!isDeleting) {
      // Typing
      heroRole.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      
      if (charIndex === currentRole.length) {
        isDeleting = true;
        setTimeout(typeEffect, 2000);
        return;
      }
    } else {
      // Deleting
      heroRole.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      
      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeEffect, 500);
        return;
      }
    }
    
    setTimeout(typeEffect, isDeleting ? 50 : 100);
  }
  
  // Start typing after 1.5 seconds
  setTimeout(typeEffect, 1500);
}

initTypingEffect();

/* ──────────────────────────────────────
   5. COUNTER ANIMATION (Stats)
────────────────────────────────────── */
function animateCounters() {
  const stats = document.querySelectorAll('.stat-num');
  
  stats.forEach(stat => {
    const targetText = stat.textContent;
    const targetNum = parseInt(targetText);
    if (isNaN(targetNum)) return;
    
    // Store original text with + sign
    const hasPlus = targetText.includes('+');
    const duration = 1500;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * targetNum);
      
      stat.textContent = current + (hasPlus ? '+' : '');
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        stat.textContent = targetText;
      }
    }
    
    // Start counter when in viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          requestAnimationFrame(updateCounter);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(stat);
  });
}

animateCounters();

/* ──────────────────────────────────────
   6. Hamburger menu toggle
────────────────────────────────────── */
if (hamburger) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navMenu.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
}

/* Close menu when any nav link is clicked */
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* ──────────────────────────────────────
   7. Navbar: add shadow/bg on scroll
────────────────────────────────────── */
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* ──────────────────────────────────────
   8. Back-to-top button visibility
────────────────────────────────────── */
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}, { passive: true });

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ──────────────────────────────────────
   9. Active nav link (IntersectionObserver)
────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');

const observerOptions = {
  root: null,
  rootMargin: '-40% 0px -55% 0px',
  threshold: 0,
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, observerOptions);

sections.forEach(section => sectionObserver.observe(section));

/* ──────────────────────────────────────
   10. Scroll-reveal animation
────────────────────────────────────── */

/* Add CSS for reveal animation dynamically */
const revealStyle = document.createElement('style');
revealStyle.textContent = `
  .reveal {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), 
                transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(revealStyle);

/* Which elements should animate? */
const revealSelectors = [
  '.trait-card',
  '.skill-badge',
  '.service-card',
  '.project-card',
  '.cert-card',
  '.testimonial-card',
  '.contact-card',
  '.about-text',
  '.hero-stats .stat',
];

const revealElements = document.querySelectorAll(revealSelectors.join(', '));

/* Add the reveal class and a stagger delay */
revealElements.forEach((el, i) => {
  el.classList.add('reveal');
  
  // Stagger siblings inside same parent (max 5 siblings)
  const siblings = el.parentElement
    ? Array.from(el.parentElement.children).filter(c => c.classList.contains('reveal'))
    : [];
  const sibIndex = siblings.indexOf(el);
  if (sibIndex > 0 && sibIndex < 6) {
    el.style.transitionDelay = `${sibIndex * 80}ms`;
  }
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  root: null,
  rootMargin: '0px 0px -60px 0px',
  threshold: 0.1,
});

revealElements.forEach(el => revealObserver.observe(el));

/* ──────────────────────────────────────
   11. Keyboard: close menu on Escape
────────────────────────────────────── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navMenu.classList.contains('open')) {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    hamburger.focus();
  }
});

/* ──────────────────────────────────────
   12. Close menu if clicking outside it
────────────────────────────────────── */
document.addEventListener('click', (e) => {
  if (
    navMenu.classList.contains('open') &&
    !navMenu.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

/* ──────────────────────────────────────
   13. SMOOTH SCROLL for anchor links
────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

/* ──────────────────────────────────────
   14. Performance: Debounced resize
────────────────────────────────────── */
let debounceTimeout;
window.addEventListener('resize', () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    // Recalculate any dynamic elements if needed
  }, 250);
}, { passive: true });

/* ──────────────────────────────────────
   15. Console greeting (optional)
────────────────────────────────────── */
console.log('%c🚀 Umar Farooq Portfolio', 'font-size:20px; font-weight:bold; color:#00d4ff;');
console.log('%cWeb & Android App Developer', 'font-size:14px; color:#8898b3;');
console.log('%c📬 Contact: umarfarooq360official@gmail.com', 'font-size:12px; color:#4d6080;');

/* ──────────────────────────────────────
   16. Page load animation
────────────────────────────────────── */
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});