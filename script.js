// ─── GOOGLE ANALYTICS + CONSENT MODE V2 ───
const GA_ID = 'G-XXXXXXXXXX'; // <-- se înlocuiește cu ID-ul real

window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }

// Default consent: tot refuzat până la acțiunea utilizatorului
gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500
});
gtag('js', new Date());
gtag('config', GA_ID, { anonymize_ip: true });

function loadGA() {
  if (document.getElementById('ga-script')) return;
  const s = document.createElement('script');
  s.id = 'ga-script';
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}

function grantAnalytics() {
  gtag('consent', 'update', { analytics_storage: 'granted' });
  loadGA();
}

function revokeAnalytics() {
  gtag('consent', 'update', { analytics_storage: 'denied' });
}

// ─── COOKIE CONSENT LOGIC ───
const COOKIE_KEY = 'cristaby_consent';

function getConsent() {
  try { return JSON.parse(localStorage.getItem(COOKIE_KEY)); } catch { return null; }
}

function saveConsent(analytics) {
  localStorage.setItem(COOKIE_KEY, JSON.stringify({ analytics, ts: Date.now() }));
}

function hideBanner() {
  document.getElementById('cookieBanner').classList.remove('show');
  document.getElementById('cookieOverlay').classList.remove('active');
}

function acceptAll() {
  saveConsent(true);
  grantAnalytics();
  hideBanner();
}

function rejectAll() {
  saveConsent(false);
  revokeAnalytics();
  hideBanner();
}

// Inițializare la load
window.addEventListener('DOMContentLoaded', () => {
  const consent = getConsent();
  if (consent === null) {
    // Prima vizită — arată banner-ul
    setTimeout(() => {
      document.getElementById('cookieBanner').classList.add('show');
    }, 800);
  } else if (consent.analytics) {
    grantAnalytics();
  }

  // Butoane banner
  document.getElementById('cookieBtnAccept').addEventListener('click', acceptAll);
  document.getElementById('cookieBtnReject').addEventListener('click', rejectAll);
  document.getElementById('cookieBtnConfig').addEventListener('click', () => {
    const consent = getConsent();
    const toggle = document.getElementById('toggleAnalytics');
    const isOn = consent?.analytics === true;
    toggle.dataset.on = isOn ? 'true' : 'false';
    toggle.textContent = isOn ? 'ON' : 'OFF';
    toggle.classList.toggle('on', isOn);
    document.getElementById('cookieModal').classList.add('show');
    document.getElementById('cookieOverlay').classList.add('active');
  });

  // Toggle analytics in modal
  const toggleBtn = document.getElementById('toggleAnalytics');
  toggleBtn.addEventListener('click', () => {
    const on = toggleBtn.dataset.on === 'true';
    toggleBtn.dataset.on = (!on).toString();
    toggleBtn.textContent = !on ? 'ON' : 'OFF';
    toggleBtn.classList.toggle('on', !on);
  });

  document.getElementById('cookieModalReject').addEventListener('click', () => {
    rejectAll();
    document.getElementById('cookieModal').classList.remove('show');
  });

  document.getElementById('cookieModalSave').addEventListener('click', () => {
    const analyticsOn = document.getElementById('toggleAnalytics').dataset.on === 'true';
    saveConsent(analyticsOn);
    if (analyticsOn) grantAnalytics(); else revokeAnalytics();
    document.getElementById('cookieModal').classList.remove('show');
    hideBanner();
    showToast(analyticsOn ? '✓ Preferencias guardadas' : '✓ Solo cookies necesarias activadas');
  });
});

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(r => observer.observe(r));

// Scroll progress bar
const progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
  progressBar.style.transform = `scaleX(${pct})`;
});

// Back to top
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
});
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Active nav on scroll
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
const activateNav = () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
};
window.addEventListener('scroll', activateNav);

// Counter animation
const counters = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const text = el.textContent;
    const num = parseInt(text.replace(/\D/g, ''));
    const suffix = text.replace(/[\d]/g, '');
    let start = 0;
    const duration = 1800;
    const step = Math.ceil(num / (duration / 16));
    const tick = () => {
      start = Math.min(start + step, num);
      el.textContent = start + suffix;
      if (start < num) requestAnimationFrame(tick);
    };
    tick();
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

// Toast helper
function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.style.borderColor = isError ? 'rgba(224,82,82,0.5)' : 'rgba(201,168,76,0.4)';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// Form validation + submit
document.querySelector('.btn-submit').addEventListener('click', () => {
  const fields = [
    { el: document.querySelector('input[type="text"]'), msg: 'Introduce tu nombre' },
    { el: document.querySelector('input[type="email"]'), msg: 'Email no válido', validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
    { el: document.querySelector('select'), msg: 'Selecciona un servicio', validate: v => v !== '' },
  ];

  let valid = true;
  fields.forEach(f => {
    const group = f.el.closest('.form-group');
    let errEl = group.querySelector('.form-error-msg');
    if (!errEl) {
      errEl = document.createElement('span');
      errEl.className = 'form-error-msg';
      group.appendChild(errEl);
    }
    const val = f.el.value.trim();
    const ok = f.validate ? f.validate(val) : val.length > 0;
    f.el.classList.toggle('error', !ok);
    group.classList.toggle('invalid', !ok);
    errEl.textContent = f.msg;
    if (!ok) valid = false;
  });

  if (valid) {
    showToast('✓ Solicitud enviada — te contactamos en menos de 24h');
  } else {
    showToast('Completa los campos obligatorios', true);
  }
});
