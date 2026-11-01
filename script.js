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

/* Form Submit with FormSubmit */
const form     = document.getElementById('contact-form');
const sendBtn  = document.getElementById('send-btn');
const errorMsg = document.getElementById('form-error-msg');

function showToast(message, isError = false) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    padding: 14px 22px;
    border-radius: 10px;
    background: ${isError ? '#ef4444' : '#22c55e'};
    color: #fff;
    font-size: 0.9rem;
    font-weight: 600;
    box-shadow: 0 4px 16px rgba(0,0,0,.15);
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

if (form) {
  form.addEventListener('submit', async (e) => {
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
    sendBtn.textContent = 'Mengirim...';
    sendBtn.disabled = true;

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        showToast('✅ Pesan terkirim! Saya akan membalas segera.');
        form.reset();
      } else {
        throw new Error('Gagal mengirim');
      }
    } catch (err) {
      showToast('❌ Gagal mengirim. Coba lagi nanti.', true);
    } finally {
      sendBtn.textContent = 'Send Message';
      sendBtn.disabled = false;
    }
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
