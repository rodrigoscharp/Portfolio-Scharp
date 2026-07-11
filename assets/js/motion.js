(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

  /* menu */
  const overlay = document.getElementById('menu-overlay');
  const openBtn = document.getElementById('menu-toggle');
  const closeBtn = document.getElementById('menu-close');
  if (overlay && openBtn && closeBtn) {
    openBtn.addEventListener('click', () => overlay.classList.add('open'));
    closeBtn.addEventListener('click', () => overlay.classList.remove('open'));
    overlay.querySelectorAll('nav a').forEach(a =>
      a.addEventListener('click', () => overlay.classList.remove('open')));
  }

  if (reduced || !hasGsap) return; // content is fully visible without motion

  gsap.registerPlugin(ScrollTrigger);

  /* smooth scroll */
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* headline / item reveals */
  document.querySelectorAll('[data-reveal]').forEach(el => {
    const items = el.querySelectorAll('.hl-line, .reveal-item');
    if (!items.length) return;
    gsap.from(items, {
      yPercent: 60, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.09,
      scrollTrigger: { trigger: el, start: 'top 82%' }
    });
  });

  /* parallax */
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const speed = parseFloat(el.dataset.parallax) || 0.15;
    gsap.to(el, {
      yPercent: -speed * 100, ease: 'none',
      scrollTrigger: { trigger: el.parentElement, scrub: true }
    });
  });

  /* scribble draw-on */
  document.querySelectorAll('.scribble path').forEach(p => {
    gsap.fromTo(p, { strokeDashoffset: 1 }, {
      strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut',
      scrollTrigger: { trigger: p.closest('svg'), start: 'top 85%' }
    });
  });
})();
