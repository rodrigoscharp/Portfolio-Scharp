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

  /* auto-reveal: everything not already covered by [data-reveal] animates in on scroll */
  const AUTO_REVEAL = [
    '.label', '.lead', '.btn-pill', '.split__link', '.photo-card', '.marquee',
    '.events-marquee', '.story__img', '.script-overlay', '.signature', '.partner-card',
    '.site-footer__cols > div', '.site-footer__cta', '.site-footer__legal'
  ].join(',');
  document.querySelectorAll(AUTO_REVEAL).forEach(el => {
    if (el.closest('[data-reveal]') || el.classList.contains('reveal-item') ||
        el.closest('.site-header') || el.closest('.menu-overlay') ||
        el.classList.contains('hero__scroll-hint')) return;
    gsap.from(el, {
      y: 44, opacity: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top bottom' }
    });
  });

  /* headline drift: every big title keeps moving while it crosses the viewport */
  document.querySelectorAll('main .headline:not(.hero__name)').forEach(h => {
    gsap.fromTo(h, { yPercent: 8 }, {
      yPercent: -8, ease: 'none',
      scrollTrigger: { trigger: h, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  /* home hero choreography */
  const heroImg = document.querySelector('#hero .hero__img');
  if (heroImg) {
    const heroIntro = gsap.from(heroImg, { y: 90, opacity: 0, duration: 1.1, ease: 'power3.out', delay: 0.25 });
    gsap.from('.hero__widget', { y: 28, duration: 1, ease: 'power3.out', delay: 0.55 });

    /* pinned outro: the page holds while the photo recedes into the background,
       the signature pops in and the statement passes across — landonorris.com style */
    gsap.set(heroImg, { transformOrigin: '50% 100%' });
    const outro = gsap.timeline({
      scrollTrigger: {
        trigger: '#hero', start: 'top top', end: '+=130%',
        scrub: true, pin: true, anticipatePin: 1,
        /* the scrub owns the photo once scrolling starts — finish the intro tween
           so the two never fight over opacity */
        onUpdate: self => { if (self.progress > 0 && heroIntro.isActive()) heroIntro.progress(1); }
      }
    });
    outro
      .to('#hero .hero__title', { yPercent: -50, autoAlpha: 0, ease: 'none', duration: 0.5 }, 0)
      .to('.hero__widget, .hero__scroll-hint, .hero__shadow', { autoAlpha: 0, ease: 'none', duration: 0.3 }, 0)
      /* explicit start values: a scrubbed .to() captures whatever opacity the intro
         happened to be at on first render, so scrolling back to the top could leave
         the photo invisible and the fade jumped instead of easing */
      .fromTo(heroImg, { scale: 1, yPercent: 0, autoAlpha: 1 },
        { scale: 0.68, yPercent: 10, autoAlpha: 0.55, ease: 'none', duration: 1, immediateRender: false }, 0)
      .fromTo('.hero__signature',
        { autoAlpha: 0, scale: 0.3, rotate: -22, yPercent: 40 },
        { autoAlpha: 1, scale: 1, rotate: -8, yPercent: 0, ease: 'none', duration: 0.65 }, 0.25)
      .fromTo('.hero-marquee', { autoAlpha: 0 }, { autoAlpha: 1, ease: 'none', duration: 0.4 }, 0.45);

    /* cast shadow behind the photo: runs away from the cursor like a real shadow,
       and wanders on its own while the mouse is still or absent */
    const shadow = document.querySelector('#hero .hero__shadow');
    if (shadow) {
      gsap.set(shadow, { scale: 1.06, transformOrigin: '50% 100%' });
      gsap.from(shadow, { opacity: 0, duration: 1.4, ease: 'power3.out', delay: 0.4 });
      const xTo = gsap.quickTo(shadow, 'x', { duration: 1.3, ease: 'power3.out' });
      const yTo = gsap.quickTo(shadow, 'y', { duration: 1.3, ease: 'power3.out' });
      let idleT, wander;
      const wanderStep = () => {
        wander = gsap.to(shadow, {
          x: gsap.utils.random(-150, 150), y: gsap.utils.random(-24, 24),
          duration: gsap.utils.random(2.8, 4.5), ease: 'sine.inOut', onComplete: wanderStep
        });
      };
      wanderStep();
      const heroEl = document.getElementById('hero');
      heroEl.addEventListener('pointermove', e => {
        if (e.pointerType !== 'mouse') return;
        if (wander) { wander.kill(); wander = null; }
        const r = heroEl.getBoundingClientRect();
        xTo((r.left + r.width / 2 - e.clientX) * 0.26);
        yTo((r.top + r.height * 0.4 - e.clientY) * 0.07);
        clearTimeout(idleT);
        idleT = setTimeout(() => { if (!wander) wanderStep(); }, 2200);
      });
    }

    /* 3D tilt: the photo leans a few degrees toward the cursor (mouse only);
       rotationX/Y are untouched by the outro, so the two never fight */
    if (matchMedia('(pointer: fine)').matches) {
      gsap.set(heroImg, { transformPerspective: 1100 });
      const tiltY = gsap.quickTo(heroImg, 'rotationY', { duration: 0.9, ease: 'power3.out' });
      const tiltX = gsap.quickTo(heroImg, 'rotationX', { duration: 0.9, ease: 'power3.out' });
      const heroSection = document.getElementById('hero');
      heroSection.addEventListener('mousemove', e => {
        tiltY((e.clientX / innerWidth * 2 - 1) * 6);
        tiltX((e.clientY / innerHeight * 2 - 1) * -3);
      });
      heroSection.addEventListener('mouseleave', () => { tiltY(0); tiltX(0); });
    }
  }

  /* projects: pinned horizontal gallery — vertical scroll drives the cards sideways */
  const projTrack = document.querySelector('.projects-track');
  if (projTrack) {
    projTrack.parentElement.style.overflow = 'hidden';
    const dist = () => Math.max(0, projTrack.scrollWidth - document.documentElement.clientWidth + 60);
    gsap.to(projTrack, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: '#projects', start: 'top top', end: () => '+=' + (dist() + 400),
        scrub: true, pin: true, anticipatePin: 1, invalidateOnRefresh: true
      }
    });
  }

  /* experience timeline: drifts slowly on its own, pauses while the user interacts,
     and can be dragged with the mouse (touch scrolls natively) */
  const timeline = document.querySelector('.timeline');
  if (timeline) {
    let dir = 1, paused = false, resumeT, dragging = false, dragX = 0, dragLeft = 0;
    let active = false, activateT, pos = 0;
    /* only start drifting once the whole timeline is on screen, after a short grace,
       so "Where I started" is always seen first; reset when scrolling back above it */
    ScrollTrigger.create({
      trigger: timeline, start: 'bottom 96%',
      onEnter: () => { clearTimeout(activateT); activateT = setTimeout(() => { active = true; }, 1500); },
      onLeaveBack: () => {
        clearTimeout(activateT); active = false;
        dir = 1; pos = 0; timeline.scrollLeft = 0;
      }
    });
    const pause = () => { paused = true; clearTimeout(resumeT); };
    const resume = () => { clearTimeout(resumeT); resumeT = setTimeout(() => { paused = false; }, 1600); };
    timeline.addEventListener('pointerenter', pause);
    timeline.addEventListener('pointerleave', () => { dragging = false; resume(); });
    timeline.addEventListener('touchstart', pause, { passive: true });
    timeline.addEventListener('touchend', resume);
    timeline.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse') return;
      dragging = true; dragX = e.clientX; dragLeft = timeline.scrollLeft;
      timeline.setPointerCapture(e.pointerId);
      pause();
    });
    timeline.addEventListener('pointermove', e => {
      if (dragging) timeline.scrollLeft = dragLeft - (e.clientX - dragX);
    });
    ['pointerup', 'pointercancel'].forEach(ev =>
      timeline.addEventListener(ev, () => { dragging = false; resume(); }));
    /* float accumulator: scrollLeft rounds to whole pixels, so += sub-pixel steps would stall */
    gsap.ticker.add(() => {
      if (!active || paused) { pos = timeline.scrollLeft; return; }
      const max = timeline.scrollWidth - timeline.clientWidth;
      if (max <= 0) return;
      pos = Math.min(Math.max(pos + 0.4 * dir, 0), max);
      timeline.scrollLeft = pos;
      if (pos >= max - 1) dir = -1;
      else if (pos <= 1) dir = 1;
    });
  }

  /* stacks marquee: drifts in a loop on its own, pauses while the user interacts,
     and can be scrolled/dragged back to revisit skills that already passed */
  const marquee = document.querySelector('#stacks .marquee');
  if (marquee) {
    marquee.classList.add('is-manual');
    const track = marquee.querySelector('.marquee__track');
    /* one extra loop of content must always fit past the wrap point,
       otherwise wide screens would hit the end of the scroll area */
    while (marquee.scrollWidth < track.offsetWidth + marquee.clientWidth + 1 &&
           marquee.children.length < 6) {
      const clone = track.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      marquee.appendChild(clone);
    }
    let paused = false, resumeT, dragging = false, dragX = 0, dragLeft = 0, pos = 0;
    const pause = () => { paused = true; clearTimeout(resumeT); };
    const resume = () => { clearTimeout(resumeT); resumeT = setTimeout(() => { paused = false; }, 1600); };
    marquee.addEventListener('pointerenter', pause);
    marquee.addEventListener('pointerleave', () => { dragging = false; resume(); });
    marquee.addEventListener('touchstart', pause, { passive: true });
    marquee.addEventListener('touchend', resume);
    marquee.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse') return;
      dragging = true; dragX = e.clientX; dragLeft = marquee.scrollLeft;
      marquee.setPointerCapture(e.pointerId);
      pause();
    });
    marquee.addEventListener('pointermove', e => {
      if (dragging) marquee.scrollLeft = dragLeft - (e.clientX - dragX);
    });
    ['pointerup', 'pointercancel'].forEach(ev =>
      marquee.addEventListener(ev, () => { dragging = false; resume(); }));
    /* float accumulator (scrollLeft rounds to whole px); wrapping back by one
       track width is invisible because the content repeats */
    gsap.ticker.add(() => {
      if (paused || dragging) { pos = marquee.scrollLeft; return; }
      const w = track.offsetWidth;
      if (w <= 0) return;
      pos += 0.6;
      if (pos >= w) pos -= w;
      marquee.scrollLeft = pos;
    });
  }

  /* scroll hint keeps bobbing */
  gsap.to('.hero__scroll-hint', { y: 8, duration: 0.9, repeat: -1, yoyo: true, ease: 'sine.inOut' });

  /* header slides away scrolling down, returns scrolling up */
  const header = document.querySelector('.site-header');
  if (header) {
    ScrollTrigger.create({
      start: 'top top', end: 'max',
      onUpdate: self => {
        gsap.to(header, {
          yPercent: self.direction === 1 && self.scroll() > 140 ? -110 : 0,
          duration: 0.35, ease: 'power2.out', overwrite: 'auto'
        });
      }
    });
  }
})();
