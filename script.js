const DARK_KEY = 'ryp-dark-mode';

function applyTheme(light) {
  document.body.classList.toggle('light-mode', light);
  const button = document.getElementById('theme-toggle');
  if (button) {
    button.textContent = light ? '☾' : '☼';
    button.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
    button.title = light ? 'Switch to dark theme' : 'Switch to light theme';
  }
}

let savedLight = false;
try {
  const storedTheme = localStorage.getItem(DARK_KEY);
  savedLight = storedTheme !== null && storedTheme !== 'true';
} catch {}
applyTheme(savedLight);

document.addEventListener('DOMContentLoaded', () => {
  const themeButton = document.getElementById('theme-toggle');
  if (themeButton) {
    themeButton.addEventListener('click', () => {
      const light = !document.body.classList.contains('light-mode');
      applyTheme(light);
      try {
        localStorage.setItem(DARK_KEY, light ? 'false' : 'true');
      } catch {}
    });
  }
});

const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

const hamburger = document.getElementById('hamburger');
const mobileDrawer = document.getElementById('mobile-drawer');

function setMenuOpen(open) {
  if (!hamburger || !mobileDrawer) return;
  hamburger.setAttribute('aria-expanded', String(open));
  hamburger.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  hamburger.classList.toggle('open', open);
  mobileDrawer.hidden = !open;
  mobileDrawer.classList.toggle('open', open);
}

if (hamburger && mobileDrawer) {
  hamburger.addEventListener('click', () => setMenuOpen(hamburger.getAttribute('aria-expanded') !== 'true'));
  mobileDrawer.querySelectorAll('.mob-link').forEach(link => link.addEventListener('click', () => setMenuOpen(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !mobileDrawer.hidden) {
      setMenuOpen(false);
      hamburger.focus();
    }
  });
}

const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link');
if ('IntersectionObserver' in window && sections.length && navLinks.length) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          const active = link.dataset.section === entry.target.id;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach(section => sectionObserver.observe(section));
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', event => {
    const id = anchor.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.getElementById(id.slice(1));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    if (history.replaceState) history.replaceState(null, '', id);
  });
});

const form = document.getElementById('contact-form');
const sendButton = document.getElementById('send-btn');
const errorMessage = document.getElementById('form-error-msg');

function showToast(message, isError = false) {
  const toast = document.createElement('div');
  toast.className = `toast${isError ? ' toast-error' : ''}`;
  toast.setAttribute('role', isError ? 'alert' : 'status');
  toast.textContent = message;
  document.body.appendChild(toast);
  window.setTimeout(() => toast.remove(), 4300);
}

if (form && sendButton && errorMessage) {
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const nameInput = document.getElementById('cf-name');
    const emailInput = document.getElementById('cf-email');
    const messageInput = document.getElementById('cf-msg');
    if (!nameInput || !emailInput || !messageInput) return;

    if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
      errorMessage.textContent = 'Please complete all fields before sending.';
      errorMessage.hidden = false;
      return;
    }

    errorMessage.hidden = true;
    sendButton.textContent = 'Sending…';
    sendButton.disabled = true;
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error('Message delivery failed');
      showToast('Message sent. Thank you for reaching out.');
      form.reset();
    } catch {
      showToast('Could not send the message. Please try again later.', true);
    } finally {
      sendButton.textContent = 'Send message';
      sendButton.disabled = false;
    }
  });
}

const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
if (filterButtons.length && projectCards.length) {
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach(item => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      projectCards.forEach(card => {
        card.hidden = filter !== 'all' && !card.classList.contains(filter);
      });
    });
  });
}
