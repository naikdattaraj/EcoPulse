// script.js — General enhancements for navigation and accessibility on all EcoPulse Goa pages

// 1. Navigation active link highlighting
document.addEventListener('DOMContentLoaded', function () {
  const navLinks = document.querySelectorAll('.navbar ul li a');
  const page = window.location.pathname.split('/').pop().replace('.html', '');

  navLinks.forEach(link => {
    // Remove all 'active' first
    link.classList.remove('active');
    // Highlight active link by comparing href
    const href = link.getAttribute('href').replace('.html', '');
    if ((!page && href === 'index') || (page && page === href)) {
      link.classList.add('active');
    }
  });
});

// 2. Keyboard navigation for primary CTA buttons
document.querySelectorAll('.cta').forEach(btn => {
  btn.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });
});

// 3. Smooth scroll for internal links (for one-page flows or better UX)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// 4. Focus outline and slight scaling for elements on tab navigation (accessibility touch)
document.body.addEventListener('keyup', function (e) {
  if (e.key === 'Tab') {
    const active = document.activeElement;
    if (active && (active.matches('.cta') || active.matches('.card'))) {
      active.style.boxShadow = '0 0 0 3px lightseagreen';
      active.style.transform = 'scale(1.03)';
      active.addEventListener('blur', function () {
        active.style.boxShadow = '';
        active.style.transform = '';
      }, { once: true });
    }
  }
});

// 5. (Optional) Hero section animation/light fade-in for hackathon "wow"
document.addEventListener('DOMContentLoaded', function() {
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.style.opacity = 0;
    hero.style.transition = 'opacity 1.2s';
    setTimeout(() => { hero.style.opacity = 1; }, 250);
  }
});
