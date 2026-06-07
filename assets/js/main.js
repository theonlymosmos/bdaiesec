/* AIESEC in Deutschland — main.js */

/* ── Smooth scroll for ALL anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const id = this.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Close mobile menu if open
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
});

/* ── Navbar scroll effect + scroll progress bar ── */
const navbar = document.getElementById('navbar');
const progress = document.getElementById('scrollProgress');
function onScroll() {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 20);
  if (progress) {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
  }
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── Hamburger menu ── */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  document.body.style.overflow = open ? 'hidden' : '';
});

/* ── Scroll reveal animations ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const delay = e.target.style.animationDelay || '0s';
      setTimeout(() => e.target.classList.add('in-view'), parseFloat(delay) * 1000);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.animate-up, .animate-left, .animate-right')
  .forEach(el => observer.observe(el));

/* ── Stats counter animation ── */
function formatNum(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1) + 'M';
  if (n >= 1000) return Math.round(n / 1000) + 'K';
  return Math.round(n).toString();
}
function animateCounter(el) {
  const target = +el.dataset.target;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { el.textContent = formatNum(target); return; }
  const duration = 1800;
  const start = performance.now();
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const tick = (now) => {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = formatNum(target * easeOut(p));
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = formatNum(target);
  };
  requestAnimationFrame(tick);
}
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-num').forEach(animateCounter);
      statsObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.25 });
const statsGrid = document.querySelector('.stats-grid');
if (statsGrid) statsObserver.observe(statsGrid);

/* ── Event tabs (cosmetic) ── */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

/* ════════════ PREMIUM INTERACTION LAYER ════════════ */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* Cursor-follow spotlight + subtle 3D tilt on cards */
(() => {
  const sel = '.stat-card,.feature-card,.event-card,.package-card,.project-card,.story-card,.partner-logo-card';
  const cards = document.querySelectorAll(sel);
  cards.forEach(c => c.classList.add('fx-card'));
  if (reduceMotion || !finePointer) return;
  const MAX = 6; // max tilt in degrees
  cards.forEach(card => {
    let raf = null, px = .5, py = .5;
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      px = (e.clientX - r.left) / r.width;
      py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', (px * 100) + '%');
      card.style.setProperty('--my', (py * 100) + '%');
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const rx = (0.5 - py) * MAX;
        const ry = (px - 0.5) * MAX;
        card.classList.add('is-fx');
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
        raf = null;
      });
    });
    card.addEventListener('pointerleave', () => {
      card.classList.remove('is-fx');
      card.style.transform = '';
    });
  });
})();

/* Magnetic buttons */
if (!reduceMotion && finePointer) {
  document.querySelectorAll('.btn-primary, .btn-white, .btn-outline-white, .btn-white-outline').forEach(btn => {
    const STRENGTH = 0.3, CAP = 7;
    btn.addEventListener('pointermove', e => {
      const r = btn.getBoundingClientRect();
      let x = (e.clientX - r.left - r.width / 2) * STRENGTH;
      let y = (e.clientY - r.top - r.height / 2) * STRENGTH;
      x = Math.max(-CAP, Math.min(CAP, x));
      y = Math.max(-CAP, Math.min(CAP, y));
      btn.style.transform = `translate(${x}px, ${y - 2}px)`;
    });
    btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
  });
}

/* Subtle hero pointer-parallax (stays within the bg overscan) */
if (!reduceMotion && finePointer) {
  const hero = document.querySelector('.hero');
  const heroBg = document.querySelector('.hero-bg');
  if (hero && heroBg) {
    let raf = null;
    hero.addEventListener('pointermove', e => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const r = hero.getBoundingClientRect();
        const dx = ((e.clientX - r.left) / r.width - 0.5) * -16;
        const dy = ((e.clientY - r.top) / r.height - 0.5) * -16;
        heroBg.style.transform = `scale(1.06) translate(${dx}px, ${dy}px)`;
        raf = null;
      });
    });
    hero.addEventListener('pointerleave', () => { heroBg.style.transform = ''; });
  }
}

/* ── Contact form (Web3Forms) ── */
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const original = submitBtn.innerHTML;
    submitBtn.textContent = 'Wird gesendet...';
    submitBtn.disabled = true;
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: new FormData(form)
      });
      const data = await res.json();
      if (data.success) {
        formSuccess.classList.add('visible');
        form.reset();
        submitBtn.textContent = '✓ Erfolgreich gesendet!';
        submitBtn.style.background = '#00C49A';
      } else throw new Error('Failed');
    } catch {
      submitBtn.textContent = 'Fehler – bitte erneut versuchen';
      submitBtn.disabled = false;
      setTimeout(() => {
        submitBtn.innerHTML = original;
        submitBtn.disabled = false;
      }, 3000);
    }
  });
}

/* ── YouTube facade: load the real player only on click (no file:// embed errors) ── */
document.querySelectorAll('.video-facade').forEach((el) => {
  const load = () => {
    if (el.dataset.loaded) return;
    el.dataset.loaded = '1';
    const id = el.dataset.video;
    const start = el.dataset.start ? '&start=' + el.dataset.start : '';
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0' + start;
    iframe.title = el.getAttribute('aria-label') || 'Video';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    el.innerHTML = '';
    el.appendChild(iframe);
  };
  el.addEventListener('click', load);
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); load(); }
  });
});
