const nav = document.getElementById('navlinks');
const menuButton = document.getElementById('hamb');

if (nav && menuButton) {
  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.textContent = isOpen ? 'x' : 'Menu';
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.textContent = 'Menu';
  }));
}

document.querySelectorAll('#year').forEach((year) => {
  year.textContent = new Date().getFullYear();
});

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  }), { threshold: 0.13 });
  document.querySelectorAll('.reveal, .reveal-left').forEach((element, index) => {
    element.style.transitionDelay = `${(index % 3) * 75}ms`;
    revealObserver.observe(element);
  });

  const counters = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const node = entry.target;
    const end = Number(node.dataset.count);
    const suffix = end === 100 || end === 400 ? 'K+' : end === 90 ? '%' : '+';
    const started = performance.now();
    const duration = 1250;
    function animate(now) {
      const progress = Math.min((now - started) / duration, 1);
      node.textContent = `${Math.round(end * (1 - Math.pow(1 - progress, 3)))}${suffix}`;
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
    counters.unobserve(node);
  }), { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach((node) => counters.observe(node));
} else {
  document.querySelectorAll('.reveal, .reveal-left').forEach((element) => element.classList.add('visible'));
}

const subscribeForm = document.getElementById('subscribe');
const toast = document.getElementById('toast');
let toastTimer;
if (subscribeForm && toast) {
  subscribeForm.addEventListener('submit', (event) => {
    event.preventDefault();
    toast.textContent = 'Thanks for subscribing. You are on the list!';
    toast.classList.add('show');
    subscribeForm.reset();
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
  });
}

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const fields = new FormData(contactForm);
    const subject = `PayPath support: ${fields.get('topic')}`;
    const body = [
      `Name: ${fields.get('name')}`,
      `Reply email: ${fields.get('email')}`,
      `Topic: ${fields.get('topic')}`,
      '',
      fields.get('message')
    ].join('\n');
    window.location.href = `mailto:support@paypath.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

const authForm = document.querySelector('.auth-form');
if (authForm) {
  authForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!authForm.reportValidity()) return;

    if (authForm.dataset.authMode === 'signup') {
      const password = authForm.elements.password.value;
      const confirmation = authForm.elements.confirmPassword.value;
      if (password !== confirmation) {
        authForm.elements.confirmPassword.setCustomValidity('Passwords do not match.');
        authForm.reportValidity();
        authForm.elements.confirmPassword.addEventListener('input', () => {
          authForm.elements.confirmPassword.setCustomValidity('');
        }, { once: true });
        return;
      }
    }

    const role = authForm.elements.dashboardRole.value;
    try {
      localStorage.setItem('stacklyDashboardRole', role);
    } catch (error) {
      // The dashboard preview can still open if browser storage is unavailable.
    }
    window.location.href = role === 'admin' ? 'admin-dashboard.html' : 'user-dashboard.html';
  });
}

document.querySelectorAll('[data-logout]').forEach((link) => {
  link.addEventListener('click', () => {
    try {
      localStorage.removeItem('stacklyDashboardRole');
    } catch (error) {
      // Sign-out navigation remains available if browser storage is unavailable.
    }
  });
});
