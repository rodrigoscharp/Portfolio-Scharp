/* ===== MENTORIA — só o que é exclusivo da LP.
   Reveals, menu, marquee e header ficam com motion.js, igual às outras páginas. ===== */
(() => {
  'use strict';

  /* CTA fixo do mobile: aparece depois do hero e some quando a oferta ou o
     CTA final já estão na tela — dois botões iguais empilhados confundem.
     IntersectionObserver, não GSAP: precisa funcionar com reduced-motion
     ligado e mesmo se o CDN do GSAP cair. */
  const sticky = document.getElementById('m-sticky');
  const hero = document.getElementById('hero');
  const oferta = document.getElementById('oferta');
  const final = document.getElementById('cta-final');
  if (!sticky || !hero || !oferta || !final || !('IntersectionObserver' in window)) return;

  let heroOut = false, ofertaIn = false, finalIn = false;
  const sync = () => sticky.classList.toggle('is-on', heroOut && !ofertaIn && !finalIn);

  new IntersectionObserver(([e]) => { heroOut = !e.isIntersecting; sync(); }).observe(hero);
  new IntersectionObserver(([e]) => { ofertaIn = e.isIntersecting; sync(); }).observe(oferta);
  new IntersectionObserver(([e]) => { finalIn = e.isIntersecting; sync(); }).observe(final);
})();
