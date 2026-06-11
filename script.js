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

// WhatsApp quote form
const WHATSAPP_NUMBER = '34000000000'; // TODO: înlocuiește cu numărul real, fără + sau spații
const quoteForm = document.getElementById('quoteForm');
const submitQuote = document.querySelector('.btn-submit');

function setFieldError(el, message = '') {
  const group = el.closest('.form-group');
  let errEl = group.querySelector('.form-error-msg');
  if (!errEl) {
    errEl = document.createElement('span');
    errEl.className = 'form-error-msg';
    group.appendChild(errEl);
  }
  el.classList.toggle('error', Boolean(message));
  group.classList.toggle('invalid', Boolean(message));
  errEl.textContent = message;
}

function cleanValue(id) {
  return document.getElementById(id)?.value.trim() || '';
}

submitQuote.addEventListener('click', () => {
  const requiredFields = [
    { el: document.getElementById('quoteName'), msg: 'Introduce tu nombre' },
    { el: document.getElementById('quotePhone'), msg: 'Introduce tu teléfono' },
    { el: document.getElementById('quoteService'), msg: 'Selecciona un servicio', validate: v => v !== '' },
  ];

  let valid = true;
  requiredFields.forEach(f => {
    const val = f.el.value.trim();
    const ok = f.validate ? f.validate(val) : val.length > 0;
    setFieldError(f.el, ok ? '' : f.msg);
    if (!ok) valid = false;
  });

  const email = cleanValue('quoteEmail');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setFieldError(document.getElementById('quoteEmail'), 'Email no válido');
    valid = false;
  } else {
    setFieldError(document.getElementById('quoteEmail'), '');
  }

  if (!valid) {
    showToast('Completa los campos obligatorios', true);
    return;
  }

  const lines = [
    'Hola, quiero solicitar presupuesto para:',
    '',
    `Servicio: ${cleanValue('quoteService')}`,
    `Nombre: ${cleanValue('quoteName')}`,
    `Teléfono: ${cleanValue('quotePhone')}`,
    email ? `Email: ${email}` : null,
    cleanValue('quoteLocation') ? `Localidad / obra: ${cleanValue('quoteLocation')}` : null,
    cleanValue('quoteDate') ? `Fecha aproximada: ${cleanValue('quoteDate')}` : null,
    cleanValue('quoteMessage') ? `Detalles: ${cleanValue('quoteMessage')}` : null,
  ].filter(Boolean);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
  window.open(whatsappUrl, '_blank', 'noopener');
  showToast('✓ Abriendo WhatsApp con tu solicitud preparada');
});
