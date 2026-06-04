/* =============================================
   script.js — Portfolio JavaScript
   ============================================= */

// =============================================
// 1. DARK MODE (runs first, before render)
// =============================================
const DARK_KEY = 'ryp-dark-mode';

function applyTheme(dark) {
  document.body.classList.toggle('dark-mode', dark);
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = dark ? '☀️' : '🌙';
}

// Apply saved preference immediately
const savedDark = localStorage.getItem(DARK_KEY) === 'true';
applyTheme(savedDark);

// Toggle handler (set up after DOM ready)
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-mode');
      localStorage.setItem(DARK_KEY, isDark);
      btn.textContent = isDark ? '☀️' : '🌙';
    });
  }
});

// =============================================
// 2. NAVBAR SCROLL STATE
// =============================================
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 30
      ? '0 2px 10px rgba(0,0,0,.08)'
      : 'none';
  });
}

// =============================================
// 3. HAMBURGER MENU
// =============================================
const hamburger    = document.getElementById('hamburger');
const mobileDrawer = document.getElementById('mobile-drawer');

if (hamburger && mobileDrawer) {
  hamburger.addEventListener('click', () => {
    const open = mobileDrawer.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });
  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });
}

// =============================================
// 4. ACTIVE NAV LINK ON SCROLL
// =============================================
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

if (sections.length && navLinks.length) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active',
            link.getAttribute('data-section') === entry.target.id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach(s => obs.observe(s));
}

// =============================================
// 5. SCROLL REVEAL
// =============================================
const reveals = document.querySelectorAll('.reveal');
if (reveals.length) {
  const ro = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        ro.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => ro.observe(el));
}

// =============================================
// 6. SMOOTH SCROLL
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// =============================================
// 7. CONTACT FORM SIMULATION
// =============================================
const form    = document.getElementById('contact-form');
const sendBtn = document.getElementById('send-btn');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    sendBtn.textContent = 'Sending...';
    sendBtn.disabled = true;
    setTimeout(() => {
      alert('✅ Pesan berhasil dikirim secara simulasi.\n\nTerima kasih! Rifki akan segera merespons.');
      form.reset();
      sendBtn.textContent = 'Send Message';
      sendBtn.disabled = false;
    }, 800);
  });
}
