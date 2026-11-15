"use client";

import Image from "next/image";
import { useState, type PointerEvent, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type Variants,
} from "framer-motion";
import { INTRO_SECONDS, introPending } from "@/lib/intro";
import { LINK_CARDS, LINK_COUPONS, LINK_PROFILE, LINK_SOCIALS, type Coupon, type LinkCard } from "@/lib/links";

const EASE = [0.22, 1, 0.36, 1] as const;

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE } },
};

function Arrow({ className = "" }: { className?: string }) {
  return (
    <span className={`lt-arrow ${className}`} aria-hidden>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 17 17 7M8 7h9v9" />
      </svg>
    </span>
  );
}

/**
 * Pressable link card: a spotlight follows the finger or cursor, a mouse tilts
 * it in 3D, and a press gives a short haptic tick on Android.
 */
function Card({ card, className, children }: { card: LinkCard; className: string; children: ReactNode }) {
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 220, damping: 18 });
  const rotateY = useSpring(ry, { stiffness: 220, damping: 18 });

  const track = (e: PointerEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    e.currentTarget.style.setProperty("--mx", `${x * 100}%`);
    e.currentTarget.style.setProperty("--my", `${y * 100}%`);
    if (e.pointerType === "mouse" && !reduce) {
      rx.set((0.5 - y) * 8);
      ry.set((x - 0.5) * 8);
    }
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  const external = !card.href.startsWith("https://rodrigoscharp.com");

  return (
    <motion.a
      href={card.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`lt-card ${className}`}
      variants={item}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      whileTap={{ scale: 0.965 }}
      onPointerMove={track}
      onPointerDown={(e) => {
        track(e);
        navigator.vibrate?.(8);
      }}
      onPointerLeave={reset}
    >
      <span className="lt-spot" aria-hidden />
      {children}
    </motion.a>
  );
}

function FeaturedCard({ card }: { card: LinkCard }) {
  const tags = card.tags ?? [];
  return (
    <Card card={card} className="lt-featured">
      {card.image && (
        <span className="lt-featured__photo" aria-hidden>
          <Image src={card.image} alt="" fill sizes="280px" priority draggable={false} />
        </span>
      )}
      <span className="lt-featured__glow" aria-hidden />
      <span className="lt-featured__top">
        <span className="lt-eyebrow">
          <span className="lt-dot" />
          {card.eyebrow}
        </span>
        <Arrow />
      </span>
      <span className="lt-featured__title">
        {card.title}
        <span className="lt-featured__period">?</span>
      </span>
      <span className="lt-sub">{card.subtitle}</span>
      <span className="lt-marquee" aria-hidden>
        <span className="lt-marquee__track">
          {[...tags, ...tags].map((t, i) => (
            <span key={i} className="lt-marquee__item">
              {t}
            </span>
          ))}
        </span>
      </span>
    </Card>
  );
}

function ProductCard({ card }: { card: LinkCard }) {
  return (
    <Card card={card} className="lt-product">
      <span className="lt-product__bg" style={{ background: card.bg }} aria-hidden>
        {card.glow && (
          <>
            <span className="lt-product__glow lt-product__glow--a" style={{ background: `radial-gradient(closest-side, ${card.glow[0]}, transparent)` }} />
            <span className="lt-product__glow lt-product__glow--b" style={{ background: `radial-gradient(closest-side, ${card.glow[1]}, transparent)` }} />
          </>
        )}
        {card.mark && (
          <span
            className="lt-product__mark"
            style={{ maskImage: `url(${card.mark})`, WebkitMaskImage: `url(${card.mark})` }}
          />
        )}
        <span className="lt-product__dots" />
      </span>
      <span className="lt-product__top">
        <span className="lt-pill" style={{ color: card.accent }}>
          {card.eyebrow}
        </span>
        <Arrow />
      </span>
      <span className="lt-product__title">{card.title}</span>
      <span className="lt-product__sub">{card.subtitle}</span>
      {card.image && (
        <span className="lt-product__phone" aria-hidden>
          <span className="lt-product__screen" style={{ aspectRatio: card.aspect }}>
            <Image src={card.image} alt="" fill sizes="(max-width: 480px) 45vw, 200px" draggable={false} />
            <span className="lt-product__island" />
          </span>
        </span>
      )}
    </Card>
  );
}

const SOCIAL_ICONS: Record<(typeof LINK_SOCIALS)[number]["id"], ReactNode> = {
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.5h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1v5.46h-4v-4.84c0-1.16-.02-2.64-1.61-2.64-1.61 0-1.86 1.26-1.86 2.56v4.92h-3.93v-11Z" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23 7.2a3.6 3.6 0 0 0-2.5-2.6C18.3 4 12 4 12 4s-6.3 0-8.5.6A3.6 3.6 0 0 0 1 7.2 37 37 0 0 0 .5 12a37 37 0 0 0 .5 4.8 3.6 3.6 0 0 0 2.5 2.6C5.7 20 12 20 12 20s6.3 0 8.5-.6a3.6 3.6 0 0 0 2.5-2.6 37 37 0 0 0 .5-4.8 37 37 0 0 0-.5-4.8ZM9.7 15.1V8.9L15.2 12l-5.5 3.1Z" />
    </svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  ),
};

/* Partner coupon: tapping the card opens the store, tapping the code copies it. */
function CouponCard({ c }: { c: Coupon }) {
  const [copied, setCopied] = useState(false);
  const dark = c.bg !== "#f2f0ea";
  const copy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(c.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };
  return (
    <motion.a
      variants={item}
      href={c.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`lt-coupon ${dark ? "" : "is-light"}`}
      style={{ background: c.bg, ["--coupon-accent" as string]: c.accent }}
    >
      <span className="lt-coupon__info">
        <span className="lt-coupon__tag">Cupom de desconto</span>
        <span className="lt-coupon__brand">{c.brand}</span>
        <span className="lt-coupon__what">{c.what}</span>
      </span>
      <span className="lt-coupon__cut" aria-hidden />
      <button type="button" className="lt-coupon__code" onClick={copy} aria-label={`Copiar cupom ${c.code}`}>
        <span className="lt-coupon__value">{c.code}</span>
        <span className="lt-coupon__copy">{copied ? "Copiado ✓" : "Copiar"}</span>
      </button>
    </motion.a>
  );
}

function Socials() {
  return (
    <motion.ul className="lt-socials" variants={item}>
      {LINK_SOCIALS.map((s) => (
        <li key={s.id}>
          <a
            href={s.href}
            target={s.id === "email" ? undefined : "_blank"}
            rel={s.id === "email" ? undefined : "noopener noreferrer"}
            className="lt-social"
            aria-label={s.label}
          >
            {SOCIAL_ICONS[s.id]}
          </a>
        </li>
      ))}
    </motion.ul>
  );
}

function ShareButton() {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const data = { title: LINK_PROFILE.name, url: LINK_PROFILE.shareUrl };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(data.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Share sheet dismissed: nothing to do.
    }
  };

  return (
    <button type="button" className="lt-share" onClick={share} aria-label="Compartilhar página">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 3v12M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
      </svg>
      <span className={`lt-toast ${copied ? "is-on" : ""}`} role="status">
        {copied ? "Link copiado" : ""}
      </span>
    </button>
  );
}

export default function LinkTree() {
  const [featured, ...products] = LINK_CARDS;

  return (
    <main className="lt">
      <div className="lt-bg" aria-hidden>
        <span className="lt-blob lt-blob--a" />
        <span className="lt-blob lt-blob--b" />
        <span className="lt-blob lt-blob--c" />
        <span className="lt-grid" />
        <span className="lt-grain" />
      </div>

      <motion.div
        className="lt-shell"
        variants={list}
        initial="hidden"
        animate="show"
        // Cards come in right after the opening animation when it plays.
        transition={{ staggerChildren: 0.08, delayChildren: introPending() ? INTRO_SECONDS - 0.35 : 0.15 }}
      >
        <motion.header className="lt-top" variants={item}>
          <span className="lt-mark" aria-hidden>
            S<span>.</span>
          </span>
          <ShareButton />
        </motion.header>

        <nav className="lt-cards" aria-label="Links">
          <FeaturedCard card={featured} />
          <motion.div className="lt-duo" variants={list}>
            {products.map((p) => (
              <ProductCard key={p.id} card={p} />
            ))}
          </motion.div>
        </nav>

        <motion.section className="lt-coupons" variants={list} aria-label="Cupons de desconto">
          {LINK_COUPONS.map((c) => (
            <CouponCard key={c.id} c={c} />
          ))}
        </motion.section>

        <Socials />

        <motion.footer className="lt-foot" variants={item}>
          <span>© {new Date().getFullYear()} Rodrigo Scharp</span>
        </motion.footer>
      </motion.div>
    </main>
  );
}
