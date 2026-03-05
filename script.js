/* ThriveOS — Site Scripts */

// ─── Mobile Menu ───
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    const isOpen = mobileMenu.classList.contains('open');
    spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
    spans[1].style.opacity = isOpen ? '0' : '1';
    spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
  });

  // Close menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity = '';
      });
    });
  });
}

// ─── Early Access Form ───
const signupForm = document.getElementById('signupForm');
const formState  = document.getElementById('formState');
const successState = document.getElementById('successState');
const submitBtn  = document.getElementById('submitBtn');

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const email = document.getElementById('email');
    const firstName = document.getElementById('firstName');
    const role = document.getElementById('role');
    const consent = document.getElementById('consent');

    if (!firstName.value.trim() || !email.value.trim() || !role.value || !consent.checked) {
      showFormError('Please fill in all required fields and accept the terms.');
      return;
    }

    if (!isValidEmail(email.value)) {
      showFormError('Please enter a valid email address.');
      return;
    }

    // Simulate submission
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    setTimeout(() => {
      if (formState && successState) {
        formState.style.display = 'none';
        successState.style.display = 'block';
      }
    }, 1000);
  });
}

// ─── Footer Email Form ───
const footerForm = document.getElementById('footerForm');
if (footerForm) {
  footerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = footerForm.querySelector('.email-input');
    const btn   = footerForm.querySelector('.email-submit');
    if (input && isValidEmail(input.value)) {
      btn.textContent = '✓ Done!';
      btn.style.background = '#16a34a';
      btn.disabled = true;
      input.value = '';
      setTimeout(() => {
        btn.textContent = 'Notify Me';
        btn.style.background = '';
        btn.disabled = false;
      }, 4000);
    }
  });
}

// ─── Helpers ───
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormError(msg) {
  let err = document.getElementById('formError');
  if (!err) {
    err = document.createElement('div');
    err.id = 'formError';
    err.style.cssText = 'background:#FEF2F2;border:1px solid #FECACA;color:#DC2626;padding:10px 14px;border-radius:8px;font-size:.88rem;margin-bottom:12px;';
    signupForm.insertBefore(err, signupForm.firstChild);
  }
  err.textContent = msg;
  setTimeout(() => err && err.remove(), 4000);
}

// ─── Smooth scroll for anchor links ───
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── Subtle scroll-based nav shadow ───
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if (nav) {
    nav.style.boxShadow = window.scrollY > 20 ? '0 2px 12px rgba(0,0,0,.06)' : 'none';
  }
});

// ─── Intersection Observer: fade-in on scroll ───
const fadeEls = document.querySelectorAll('.module-card, .cap-card, .value-card, .mission-pillar, .timeline-item');
if ('IntersectionObserver' in window && fadeEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    observer.observe(el);
  });
}
