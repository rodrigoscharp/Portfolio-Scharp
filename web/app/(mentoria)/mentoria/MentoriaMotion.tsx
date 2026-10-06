"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

// Port of the static site's motion.js + mentoria.js, trimmed to what the LP uses.
// Works on the server-rendered markup by selector, like the original scripts did.
export default function MentoriaMotion() {
  useEffect(() => {
    const cleanups: (() => void)[] = [];
    const on = <K extends keyof HTMLElementEventMap>(
      el: HTMLElement | Document,
      type: K,
      fn: (e: HTMLElementEventMap[K]) => void,
    ) => {
      el.addEventListener(type, fn as EventListener);
      cleanups.push(() => el.removeEventListener(type, fn as EventListener));
    };

    /* menu */
    const overlay = document.getElementById("menu-overlay");
    const openBtn = document.getElementById("menu-toggle");
    const closeBtn = document.getElementById("menu-close");
    if (overlay && openBtn && closeBtn) {
      on(openBtn, "click", () => overlay.classList.add("open"));
      on(closeBtn, "click", () => overlay.classList.remove("open"));
      overlay.querySelectorAll<HTMLElement>("nav a").forEach((a) =>
        on(a, "click", () => overlay.classList.remove("open")),
      );
    }

    /* photos are decoration: a click-drag must never navigate to the image file */
    on(document, "dragstart", (e) => {
      if (e.target instanceof HTMLImageElement) e.preventDefault();
    });

    /* mobile sticky CTA: shows after the hero, hides while the offer or the
       final CTA is on screen. IntersectionObserver, not GSAP, so it still
       works with reduced motion on. */
    const sticky = document.getElementById("m-sticky");
    const hero = document.getElementById("hero");
    const oferta = document.getElementById("oferta");
    const final = document.getElementById("cta-final");
    if (sticky && hero && oferta && final && "IntersectionObserver" in window) {
      let heroOut = false, ofertaIn = false, finalIn = false;
      const sync = () => sticky.classList.toggle("is-on", heroOut && !ofertaIn && !finalIn);
      const observers = [
        new IntersectionObserver(([e]) => { heroOut = !e.isIntersecting; sync(); }),
        new IntersectionObserver(([e]) => { ofertaIn = e.isIntersecting; sync(); }),
        new IntersectionObserver(([e]) => { finalIn = e.isIntersecting; sync(); }),
      ];
      observers[0].observe(hero);
      observers[1].observe(oferta);
      observers[2].observe(final);
      cleanups.push(() => observers.forEach((o) => o.disconnect()));
    }

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return () => cleanups.forEach((fn) => fn()); // content is fully visible without motion

    gsap.registerPlugin(ScrollTrigger);

    /* smooth scroll */
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    cleanups.push(() => { gsap.ticker.remove(raf); lenis.destroy(); });

    const ctx = gsap.context(() => {
      /* headline / item reveals. fromTo, not from(): a ScrollTrigger.refresh()
         before the tween plays makes from() re-capture its end state from the
         already-offset element, freezing items below their slot. */
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        const items = el.querySelectorAll<HTMLElement>(".hl-line, .reveal-item");
        if (!items.length) return;
        gsap.fromTo(items,
          { y: (_i: number, item: HTMLElement) => item.offsetHeight * 0.6, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.09,
            scrollTrigger: { trigger: el, start: "top 82%" },
          });
      });

      /* scribble draw-on */
      document.querySelectorAll<SVGPathElement>(".scribble path").forEach((p) => {
        gsap.fromTo(p, { strokeDashoffset: 1 }, {
          strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut",
          scrollTrigger: { trigger: p.closest("svg"), start: "top 85%" },
        });
      });

      /* auto-reveal: everything not already covered by [data-reveal] */
      const AUTO_REVEAL = [
        ".label", ".lead", ".btn-pill", ".marquee", ".signature",
        ".site-footer__cols > div", ".site-footer__cta", ".site-footer__legal",
      ].join(",");
      document.querySelectorAll<HTMLElement>(AUTO_REVEAL).forEach((el) => {
        if (el.closest("[data-reveal]") || el.classList.contains("reveal-item") ||
            el.closest(".site-header") || el.closest(".menu-overlay") || el.closest(".m-sticky")) return;
        gsap.fromTo(el, { y: 44, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top bottom" },
        });
      });

      /* headline drift: big titles keep moving while they cross the viewport */
      document.querySelectorAll("main .headline").forEach((h) => {
        gsap.fromTo(h, { yPercent: 8 }, {
          yPercent: -8, ease: "none",
          scrollTrigger: { trigger: h, start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      /* header slides away scrolling down, returns scrolling up */
      const header = document.querySelector(".site-header");
      if (header) {
        ScrollTrigger.create({
          start: "top top", end: "max",
          onUpdate: (self) => {
            gsap.to(header, {
              yPercent: self.direction === 1 && self.scroll() > 140 ? -110 : 0,
              duration: 0.35, ease: "power2.out", overwrite: "auto",
            });
          },
        });
      }
    });
    cleanups.push(() => ctx.revert());

    /* magnetic buttons: the pill leans toward the cursor. Drives the `translate`
       property so CSS hover transforms and entrance tweens are left alone. */
    if (matchMedia("(pointer: fine)").matches) {
      document.querySelectorAll<HTMLElement>(".btn-pill").forEach((btn) => {
        const pull = { x: 0, y: 0 };
        const apply = () => { btn.style.translate = `${pull.x}px ${pull.y}px`; };
        const pullX = gsap.quickTo(pull, "x", { duration: 0.35, ease: "power2.out", onUpdate: apply });
        const pullY = gsap.quickTo(pull, "y", { duration: 0.35, ease: "power2.out", onUpdate: apply });
        on(btn, "pointermove", (e) => {
          if (e.pointerType !== "mouse") return;
          const r = btn.getBoundingClientRect();
          pullX((e.clientX - (r.left + r.width / 2)) * 0.3);
          pullY((e.clientY - (r.top + r.height / 2)) * 0.3);
        });
        on(btn, "pointerleave", () => { pullX(0); pullY(0); });
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
