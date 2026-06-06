/* =====================================================
   CodeArtist v2 — ca-script.js
   
   1.  Page load animation
   2.  Custom cursor + glow trail
   3.  Navbar scroll + hamburger
   4.  Active nav link highlight
   5.  Typing animation (hero)
   6.  Hero parallax
   7.  Scroll reveal (IntersectionObserver)
   8.  WhatsApp form + validation
   9.  Pricing card WhatsApp buttons
===================================================== */

/* ─────────────────────────────────────────────
   1. PAGE LOAD ANIMATION
   Fills a progress bar from 0→100%,
   then fades out the loader overlay.
────────────────────────────────────────────── */
const loader     = document.getElementById('loader');
const loaderFill = document.getElementById('loaderFill');
const loaderText = document.getElementById('loaderText');

const loadMessages = ['Loading…', 'Setting up…', 'Almost there…', 'Welcome ✦'];
let loadProgress = 0;
let msgIndex = 0;

const loadInterval = setInterval(() => {
  // Speed up near the end
  const increment = loadProgress < 70 ? Math.random() * 8 + 4 : Math.random() * 14 + 6;
  loadProgress = Math.min(loadProgress + increment, 100);
  loaderFill.style.width = loadProgress + '%';

  // Cycle through messages
  const newMsgIndex = Math.floor((loadProgress / 100) * loadMessages.length);
  if (newMsgIndex !== msgIndex && newMsgIndex < loadMessages.length) {
    msgIndex = newMsgIndex;
    loaderText.textContent = loadMessages[msgIndex];
  }

  if (loadProgress >= 100) {
    clearInterval(loadInterval);
    loaderText.textContent = 'Welcome ✦';
    setTimeout(() => {
      loader.classList.add('done');
      // Fire hero reveal animations AFTER loader hides
      document.querySelectorAll('.reveal-load').forEach(el => el.classList.add('fired'));
      // Start typing animation
      startTyping();
    }, 400);
  }
}, 60);


/* ─────────────────────────────────────────────
   2. CUSTOM CURSOR
   - Small gold dot follows mouse exactly
   - Larger ring trails behind with CSS transition
   - Both grow when hovering interactive elements
────────────────────────────────────────────── */
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

// Trail follows with slight lag using requestAnimationFrame
function animateTrail() {
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top  = trailY + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

// Enlarge cursor on hoverable elements
const hoverables = 'a, button, .service-card, .work-card, .pricing-card, .why-point, input, select, textarea';
document.querySelectorAll(hoverables).forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('hover');
    cursorTrail.style.opacity = '0.15';
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('hover');
    cursorTrail.style.opacity = '0.5';
  });
});

// Hide cursor when it leaves the window
document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; cursorTrail.style.opacity = '0'; });
document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; cursorTrail.style.opacity = '0.5'; });


/* ─────────────────────────────────────────────
   3. NAVBAR — SCROLL + HAMBURGER
────────────────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveLink();
  parallaxHero();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(l => {
  l.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});


/* ─────────────────────────────────────────────
   4. ACTIVE NAV LINK
   Highlights the nav link for the
   section currently in view.
────────────────────────────────────────────── */
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + current);
  });
}


/* ─────────────────────────────────────────────
   5. TYPING ANIMATION
   Cycles through phrases in the hero title.
   Called after loader finishes.
────────────────────────────────────────────── */
const typedEl = document.getElementById('typedText');
const phrases = [
  'Startups.',
  'Students.',
  'Creators.',
  'Local Businesses.',
  'Gyms & Salons.',
  'Founders.',
];
let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;
let typingTimer;

function startTyping() {
  if (!typedEl) return;
  typeLoop();
}

function typeLoop() {
  const current = phrases[phraseIndex];

  if (isDeleting) {
    typedEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 45 : 85;

  if (!isDeleting && charIndex === current.length) {
    // Pause at end of phrase
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 400;
  }

  typingTimer = setTimeout(typeLoop, delay);
}


/* ─────────────────────────────────────────────
   6. HERO PARALLAX
   Background moves at 25% of scroll speed
   creating a subtle depth effect.
────────────────────────────────────────────── */
const heroBgEl = document.getElementById('heroBg');

function parallaxHero() {
  if (!heroBgEl || window.scrollY > 900) return;
  heroBgEl.style.transform = `translateY(${window.scrollY * 0.25}px)`;
}


/* ─────────────────────────────────────────────
   7. SCROLL REVEAL
   Uses IntersectionObserver to add .visible
   to elements with class .reveal when
   they enter the viewport.
────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ─────────────────────────────────────────────
   8. CONTACT FORM + WHATSAPP
   Validates name (min 2 chars) and phone
   (exactly 10 digits), then builds and opens
   a pre-filled wa.me URL.
────────────────────────────────────────────── */
const WA_OWNER = '919137079995'; // CodeArtist owner, with 91 country prefix

// Strip non-numeric from phone as user types
document.getElementById('c-phone')?.addEventListener('input', e => {
  e.target.value = e.target.value.replace(/\D/g, '');
});

function setErr(id, msg) {
  const el = document.getElementById(id);
  const inp = document.getElementById(id === 'cn-err' ? 'c-name' : 'c-phone');
  if (el) { el.textContent = msg; el.classList.add('visible'); }
  if (inp) inp.classList.add('err');
}
function clearErr(id) {
  const el = document.getElementById(id);
  const inp = document.getElementById(id === 'cn-err' ? 'c-name' : 'c-phone');
  if (el) { el.textContent = ''; el.classList.remove('visible'); }
  if (inp) inp.classList.remove('err');
}

document.getElementById('c-name')?.addEventListener('input',  () => clearErr('cn-err'));
document.getElementById('c-phone')?.addEventListener('input', () => clearErr('cp-err'));

// ── Build the messages ────────────────────
let lastPayload = null; // cached so "Open WhatsApp Again" can re-fire

function buildOwnerMsg(d) {
  return encodeURIComponent(
    `🔔 *New CodeArtist Enquiry*\n\n` +
    `*Name:* ${d.name}\n` +
    `*Phone:* +91 ${d.phone}\n` +
    `*Business:* ${d.biz || '—'}\n` +
    `*Type:* ${d.type}\n` +
    `*Service:* ${d.service}\n` +
    `*Budget:* ${d.budget}\n` +
    (d.msg ? `\n*Message:*\n${d.msg}` : '') +
    `\n\n— via codeartist.in`
  );
}
function buildUserMsg(d) {
  return encodeURIComponent(
    `Hi ${d.name.split(' ')[0]}! 👋\n\n` +
    `Thanks for reaching out to *CodeArtist*.\n\n` +
    `We've received your enquiry for a *${d.service}* ` +
    `(budget ${d.budget}) and will get back to you within 1 hour.\n\n` +
    `If you need anything urgent, just reply to this chat.\n\n` +
    `— Aniket, CodeArtist.in`
  );
}

document.getElementById('sendBtn')?.addEventListener('click', () => {
  const name    = document.getElementById('c-name').value.trim();
  const phone   = document.getElementById('c-phone').value.replace(/\D/g, '');
  const biz     = document.getElementById('c-biz').value.trim();
  const type    = document.getElementById('c-type').value;
  const service = document.getElementById('c-service').value;
  const budget  = document.getElementById('c-budget').value;
  const msg     = document.getElementById('c-msg').value.trim();

  let valid = true;
  if (!name || name.length < 2) {
    setErr('cn-err', 'Please enter your full name (min 2 characters).');
    valid = false;
  } else clearErr('cn-err');

  if (!phone || phone.length !== 10) {
    setErr('cp-err', `10 digits required — you entered ${phone.length}.`);
    valid = false;
  } else clearErr('cp-err');

  if (!valid) return;

  const data = { name, phone, biz, type, service, budget, msg };
  lastPayload = data;

  // 1. Show success state in place of the form
  document.getElementById('contactForm').hidden = true;
  document.getElementById('formSuccess').hidden = false;

  // 2. Open WhatsApp to the USER (with confirmation)
  const userUrl = `https://wa.me/91${phone}?text=${buildUserMsg(data)}`;
  const win1 = window.open(userUrl, '_blank', 'noopener,noreferrer');

  // 3. After a short delay, open WhatsApp to the OWNER (with the lead)
  setTimeout(() => {
    const ownerUrl = `https://wa.me/${WA_OWNER}?text=${buildOwnerMsg(data)}`;
    const win2 = window.open(ownerUrl, '_blank', 'noopener,noreferrer');
    if (!win1 && !win2) {
      console.warn('Popup blocked — user can tap "Open WhatsApp Again".');
    }
  }, 600);
});

// ── "Open WhatsApp Again" fallback ────────
document.getElementById('resendBtn')?.addEventListener('click', () => {
  if (!lastPayload) return;
  const d = lastPayload;
  window.open(`https://wa.me/${WA_OWNER}?text=${buildOwnerMsg(d)}`, '_blank', 'noopener,noreferrer');
});

// ── "Send another enquiry" — reset the form ──
document.getElementById('resetBtn')?.addEventListener('click', () => {
  document.getElementById('contactForm').reset();
  document.getElementById('formSuccess').hidden = true;
  document.getElementById('contactForm').hidden = false;
  clearErr('cn-err');
  clearErr('cp-err');
  lastPayload = null;
  document.getElementById('c-name').focus();
});


/* ─────────────────────────────────────────────
   9. PRICING BUTTONS
   Each opens WhatsApp with the plan name
   pre-filled in the message.
────────────────────────────────────────────── */
function openWA(plan) {
  const text = encodeURIComponent(
    `Hi CodeArtist! 👋\n\n` +
    `I'm interested in the *${plan}* package.\n\n` +
    `Can you share more details?`
  );
  window.open(`https://wa.me/${WA_NUM}?text=${text}`, '_blank');
}


/* ─────────────────────────────────────────────
   INIT
────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  updateActiveLink();
  console.log('CodeArtist v2 — loaded ✓');
});
