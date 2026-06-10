// ─── SITE CONFIG: înlocuiește manual datele reale la final ───
const SITE_CONFIG = {
  whatsappNumber: '34XXXXXXXXX', // ex: 34600111222, fără +, spații sau paranteze
  analyticsId: '', // ex: G-XXXXXXXXXX; lasă gol dacă nu folosești Google Analytics
};

const GA_ID = SITE_CONFIG.analyticsId;
window.dataLayer = window.dataLayer || [];
function gtag() { window.dataLayer.push(arguments); }
if (GA_ID) {
  gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', wait_for_update: 500 });
  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });
}
function loadGA() { if (!GA_ID || document.getElementById('ga-script')) return; const s=document.createElement('script'); s.id='ga-script'; s.async=true; s.src=`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`; document.head.appendChild(s); }
function grantAnalytics() { if (!GA_ID) return; gtag('consent', 'update', { analytics_storage: 'granted' }); loadGA(); }
function revokeAnalytics() { if (!GA_ID) return; gtag('consent', 'update', { analytics_storage: 'denied' }); }

const COOKIE_KEY = 'cristaby_consent';
function getConsent() { try { return JSON.parse(localStorage.getItem(COOKIE_KEY)); } catch { return null; } }
function saveConsent(analytics) { localStorage.setItem(COOKIE_KEY, JSON.stringify({ analytics, ts: Date.now() })); }
function hideBanner() { document.getElementById('cookieBanner')?.classList.remove('show'); document.getElementById('cookieOverlay')?.classList.remove('active'); }
function acceptAll() { saveConsent(Boolean(GA_ID)); grantAnalytics(); hideBanner(); }
function rejectAll() { saveConsent(false); revokeAnalytics(); hideBanner(); }

window.addEventListener('DOMContentLoaded', () => {
  const consent = getConsent();
  if (consent === null) setTimeout(() => document.getElementById('cookieBanner')?.classList.add('show'), 800);
  else if (consent.analytics) grantAnalytics();
  document.getElementById('cookieBtnAccept')?.addEventListener('click', acceptAll);
  document.getElementById('cookieBtnReject')?.addEventListener('click', rejectAll);
  document.getElementById('cookieBtnConfig')?.addEventListener('click', () => {
    const toggle = document.getElementById('toggleAnalytics');
    const isOn = Boolean(GA_ID && getConsent()?.analytics === true);
    if (toggle) { toggle.dataset.on = isOn ? 'true':'false'; toggle.textContent = isOn ? 'ON':'OFF'; toggle.classList.toggle('on', isOn); toggle.disabled = !GA_ID; }
    document.getElementById('cookieModal')?.classList.add('show'); document.getElementById('cookieOverlay')?.classList.add('active');
  });
  const toggleBtn = document.getElementById('toggleAnalytics');
  toggleBtn?.addEventListener('click', () => { if (!GA_ID) return showToast('Analítica no configurada todavía'); const on=toggleBtn.dataset.on==='true'; toggleBtn.dataset.on=(!on).toString(); toggleBtn.textContent=!on?'ON':'OFF'; toggleBtn.classList.toggle('on', !on); });
  document.getElementById('cookieModalReject')?.addEventListener('click', () => { rejectAll(); document.getElementById('cookieModal')?.classList.remove('show'); });
  document.getElementById('cookieModalSave')?.addEventListener('click', () => { const analyticsOn = Boolean(GA_ID && document.getElementById('toggleAnalytics')?.dataset.on === 'true'); saveConsent(analyticsOn); if (analyticsOn) grantAnalytics(); else revokeAnalytics(); document.getElementById('cookieModal')?.classList.remove('show'); hideBanner(); showToast(analyticsOn ? '✓ Preferencias guardadas' : '✓ Solo cookies necesarias activadas'); });
});

const reveals = document.querySelectorAll('.reveal');
const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (motionReduced) reveals.forEach(r => r.classList.add('visible'));
else { const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }), { threshold: 0.1 }); reveals.forEach(r => observer.observe(r)); }

const progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => { const max=document.documentElement.scrollHeight-window.innerHeight; const pct=max>0?window.scrollY/max:0; if(progressBar) progressBar.style.transform=`scaleX(${pct})`; }, { passive:true });
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => backToTop?.classList.toggle('visible', window.scrollY > 400), { passive:true });
backToTop?.addEventListener('click', () => window.scrollTo({ top:0, behavior: motionReduced ? 'auto':'smooth' }));

const hamburger = document.getElementById('hamburger'); const navLinks = document.getElementById('navLinks');
hamburger?.setAttribute('aria-expanded','false');
hamburger?.addEventListener('click', () => { hamburger.classList.toggle('open'); navLinks?.classList.toggle('open'); hamburger.setAttribute('aria-expanded', hamburger.classList.contains('open') ? 'true':'false'); });
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { hamburger?.classList.remove('open'); navLinks.classList.remove('open'); hamburger?.setAttribute('aria-expanded','false'); }));

const sections = document.querySelectorAll('section[id]'); const navAnchors = document.querySelectorAll('.nav-links a');
const activateNav = () => { let current=''; sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current=s.id; }); navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current)); };
window.addEventListener('scroll', activateNav, { passive:true }); activateNav();

const counters = document.querySelectorAll('.stat-num');
if (!motionReduced) { const counterObserver = new IntersectionObserver(entries => entries.forEach(e => { if (!e.isIntersecting || e.target.dataset.done) return; const el=e.target; el.dataset.done='true'; const text=el.textContent; const num=parseInt(text.replace(/\D/g,''),10); const suffix=text.replace(/[\d]/g,''); let start=0; const step=Math.max(1,Math.ceil(num/(1800/16))); const tick=()=>{ start=Math.min(start+step,num); el.textContent=start+suffix; if(start<num) requestAnimationFrame(tick); }; tick(); counterObserver.unobserve(el); }), { threshold:0.5 }); counters.forEach(c => counterObserver.observe(c)); }

function showToast(msg, isError=false) { const toast=document.getElementById('toast'); if(!toast) return; toast.textContent=msg; toast.style.borderColor=isError?'rgba(224,82,82,0.5)':'rgba(201,168,76,0.4)'; toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'),3500); }

const quoteForm = document.getElementById('quoteForm');
quoteForm?.addEventListener('submit', event => {
  event.preventDefault();
  const fields=[{el:quoteForm.querySelector('input[name="nombre"]'),msg:'Introduce tu nombre'},{el:quoteForm.querySelector('input[name="email"]'),msg:'Email no válido',validate:v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)},{el:quoteForm.querySelector('select[name="servicio"]'),msg:'Selecciona un servicio',validate:v=>v!==''}];
  let valid=true;
  fields.forEach(f=>{ if(!f.el) return; const group=f.el.closest('.form-group'); let errEl=group?.querySelector('.form-error-msg'); if(group&&!errEl){ errEl=document.createElement('span'); errEl.className='form-error-msg'; group.appendChild(errEl); } const val=f.el.value.trim(); const ok=f.validate?f.validate(val):val.length>0; f.el.classList.toggle('error',!ok); group?.classList.toggle('invalid',!ok); if(errEl) errEl.textContent=f.msg; if(!ok) valid=false; });
  if(!valid) return showToast('Completa los campos obligatorios', true);
  if(!/^\d{8,15}$/.test(SITE_CONFIG.whatsappNumber)) return showToast('WhatsApp pendiente de configurar', true);
  const data=new FormData(quoteForm);
  const message=['Hola, me gustaría solicitar un presupuesto para Cristaby Trans.','',`Nombre: ${data.get('nombre')||''}`,`Email: ${data.get('email')||''}`,`Teléfono: ${data.get('telefono')||''}`,`Servicio: ${data.get('servicio')||''}`,`Mensaje: ${data.get('mensaje')||''}`].join('\n');
  window.open(`https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`,'_blank','noopener'); showToast('✓ Abriendo WhatsApp con tu solicitud');
});
