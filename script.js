/* Dark Mode */
const DARK_KEY = 'ryp-dark-mode';

function applyTheme(dark) {
  document.body.classList.toggle('dark-mode', dark);
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = dark ? '☀️' : '🌙';
}

const savedDark = localStorage.getItem(DARK_KEY) === 'true';
applyTheme(savedDark);

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

/* Navbar */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 30
      ? '0 2px 10px rgba(0,0,0,.08)'
      : 'none';
  });
}

/* Hamburger Menu */
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

/* Active Nav on Scroll */
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

/* Scroll Reveal */
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

/* Smooth Scroll */
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

/* Form Validation */
const form     = document.getElementById('contact-form');
const sendBtn  = document.getElementById('send-btn');
const errorMsg = document.getElementById('form-error-msg');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput  = document.getElementById('cf-name').value.trim();
    const emailInput = document.getElementById('cf-email').value.trim();
    const msgInput   = document.getElementById('cf-msg').value.trim();

    if (nameInput === '' || emailInput === '' || msgInput === '') {
      errorMsg.innerText = 'Peringatan: Seluruh form wajib diisi sebelum dikirim!';
      errorMsg.style.display = 'block';
      return;
    }

    errorMsg.style.display = 'none';
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

/* Project Filter */
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

if (filterBtns.length && projectCards.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        if (filterValue === 'all' || card.classList.contains(filterValue)) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}
