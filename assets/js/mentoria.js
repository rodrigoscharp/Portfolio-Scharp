/* ===== MENTORIA — motion e CTA sticky. Independente de motion.js ===== */
(() => {
  'use strict';

  // Reveals. Só rodam quando o <head> marcou has-motion e o GSAP carregou.
  function initMotion() {
    if (!document.documentElement.classList.contains('has-motion')) return;
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      // GSAP não carregou (CDN fora do ar): revela tudo para não deixar a página em branco.
      document.documentElement.classList.remove('has-motion');
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    if (typeof Lenis !== 'undefined') {
      const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    // SEMPRE fromTo: from() recaptura o estado no refresh e congela os itens deslocados.
    document.querySelectorAll('[data-reveal]').forEach(block => {
      const items = block.querySelectorAll('.reveal');
      if (!items.length) return;
      gsap.fromTo(items,
        { y: 28, opacity: 0 },
        {
          y: 0, opacity: 1, duration: .8, ease: 'power3.out', stagger: .07,
          scrollTrigger: { trigger: block, start: 'top bottom' }
        });
    });
  }

  // CTA sticky do mobile. Usa IntersectionObserver para funcionar mesmo sem GSAP
  // e com prefers-reduced-motion ligado.
  function initStickyCta() {
    const sticky = document.getElementById('m-sticky');
    const hero = document.getElementById('hero');
    const oferta = document.getElementById('oferta');
    if (!sticky || !hero || !oferta || !('IntersectionObserver' in window)) return;

    let heroOut = false, ofertaIn = false;
    const sync = () => sticky.classList.toggle('is-on', heroOut && !ofertaIn);

    new IntersectionObserver(([e]) => { heroOut = !e.isIntersecting; sync(); }).observe(hero);
    new IntersectionObserver(([e]) => { ofertaIn = e.isIntersecting; sync(); }).observe(oferta);
  }

  initMotion();
  initStickyCta();
})();
