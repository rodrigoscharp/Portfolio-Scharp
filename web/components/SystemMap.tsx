"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/i18n";

type Node = { id: string; label: string; detail: string; detailPt: string; x: number; y: number; href?: string; wide?: boolean };

/* The systems I build, laid out around the hero. Coordinates are 0..1 of the
   hero box; "wide" nodes only show on wide screens. */
const NODES: Node[] = [
  { id: "muno", label: "Muno", detail: "120+ restaurants · multi-tenant", detailPt: "120+ restaurantes · multi-tenant", x: 0.035, y: 0.1, href: "/work/muno" },
  { id: "pg", label: "PostgreSQL", detail: "RLS · event store · ledgers", detailPt: "RLS · event store · ledgers", x: 0.33, y: 0.075 },
  { id: "campo", label: "Campo", detail: "franchise diagnosis engine", detailPt: "motor de diagnóstico de franquias", x: 0.6, y: 0.075, href: "/work/campo", wide: true },
  { id: "orbz", label: "Orbz", detail: "5 AI agents · voice + Telegram", detailPt: "5 agentes de IA · voz + Telegram", x: 0.965, y: 0.12, href: "/#team" },
  { id: "myhub", label: "MyHub", detail: "8 modules · one dashboard", detailPt: "8 módulos · um só dashboard", x: 0.965, y: 0.47, href: "/work/myhub", wide: true },
  { id: "kafka", label: "Kafka", detail: "trade stream · Athena", detailPt: "stream de negociações · Athena", x: 0.9, y: 0.66, href: "/work/athena" },
  { id: "pixlab", label: "PixLab", detail: "p99 16.5 ms @ 500 req/s", detailPt: "p99 16,5 ms @ 500 req/s", x: 0.9, y: 0.9, href: "/work/pixlab" },
  { id: "spring", label: "Spring Boot", detail: "Java 21 services", detailPt: "serviços em Java 21", x: 0.62, y: 0.965 },
  { id: "aws", label: "AWS", detail: "where it runs", detailPt: "onde tudo roda", x: 0.36, y: 0.975, wide: true },
  { id: "wallet", label: "WalletCore", detail: "double-entry ledger", detailPt: "ledger de partidas dobradas", x: 0.03, y: 0.76, href: "/work/walletcore" },
  { id: "gov", label: "Ubatuba", detail: "100k+ citizens · health systems", detailPt: "100 mil+ cidadãos · sistemas de saúde", x: 0.03, y: 0.43 },
];

const EDGES: [string, string][] = [
  ["muno", "pg"], ["campo", "pg"], ["pg", "spring"], ["spring", "aws"], ["aws", "wallet"],
  ["wallet", "pg"], ["gov", "spring"], ["gov", "muno"], ["orbz", "myhub"], ["myhub", "pg"],
  ["orbz", "campo"], ["kafka", "spring"], ["kafka", "pixlab"], ["pixlab", "spring"], ["orbz", "kafka"],
];

type Packet = { e: number; t: number; dur: number; dir: 1 | -1 };
type Dust = { x: number; y: number; vx: number; vy: number; r: number; a: number };

/* Hero background: a live map of the systems I build. Requests (packets) flow
   along the edges, more of them near the cursor; hovering a node names it and
   clicking opens its case study. Canvas 2D at ~30 fps, paused off screen. */
export default function SystemMap({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const { lang } = useLang();
  // Read from the draw loop, so switching language doesn't rebuild the canvas.
  const langRef = useRef(lang);
  useEffect(() => {
    langRef.current = lang;
  }, [lang]);

  useEffect(() => {
    const cv = ref.current;
    const g = cv?.getContext("2d");
    if (!cv || !g) return;
    const canvas = cv;
    const ctx = g;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    let w = 0;
    let h = 0;
    let nodes: (Node & { px: number; py: number })[] = [];
    let edges: { a: number; b: number }[] = [];
    let dust: Dust[] = [];
    const packets: Packet[] = [];
    const mouse = { x: -9999, y: -9999 };
    let hover = -1;
    let raf = 0;
    let visible = true;
    let last = performance.now();
    let spawn = 0;

    const css = (name: string, fb: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fb;
    let ink = css("--ink-soft", "#222");
    let accent = css("--accent", "#fd601a");
    let paper = css("--paper", "#fff");
    const themeObs = new MutationObserver(() => {
      ink = css("--ink-soft", "#222");
      accent = css("--accent", "#fd601a");
      paper = css("--paper", "#fff");
    });
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const wide = w >= 900;
      nodes = NODES.filter((n) => wide || !n.wide).map((n) => ({ ...n, px: n.x * w, py: n.y * h }));
      const idx = Object.fromEntries(nodes.map((n, i) => [n.id, i]));
      edges = EDGES.filter(([a, b]) => a in idx && b in idx).map(([a, b]) => ({ a: idx[a], b: idx[b] }));
      packets.length = 0;
      let s = 7;
      const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
      dust = Array.from({ length: wide ? 70 : 35 }, () => ({
        x: rnd() * w,
        y: rnd() * h,
        vx: (rnd() - 0.5) * 6,
        vy: (rnd() - 0.5) * 6,
        r: 0.8 + rnd() * 1.2,
        a: 0.25 + rnd() * 0.35,
      }));
    };

    const addPacket = (e: number) => {
      if (packets.length > 60) return;
      packets.push({ e, t: 0, dur: 1.1 + Math.random() * 1.2, dir: Math.random() < 0.5 ? 1 : -1 });
    };

    // Distance from the cursor to an edge, to send more traffic where the visitor is.
    const nearEdge = (e: { a: number; b: number }) => {
      const A = nodes[e.a];
      const B = nodes[e.b];
      const dx = B.px - A.px;
      const dy = B.py - A.py;
      const t = Math.max(0, Math.min(1, ((mouse.x - A.px) * dx + (mouse.y - A.py) * dy) / (dx * dx + dy * dy)));
      return Math.hypot(A.px + dx * t - mouse.x, A.py + dy * t - mouse.y);
    };

    const roundRect = (x: number, y: number, rw: number, rh: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + rw, y, x + rw, y + rh, r);
      ctx.arcTo(x + rw, y + rh, x, y + rh, r);
      ctx.arcTo(x, y + rh, x, y, r);
      ctx.arcTo(x, y, x + rw, y, r);
      ctx.closePath();
    };

    const draw = (t: number) => {
      if (!reduce && visible && t - last < 32) {
        raf = requestAnimationFrame(draw);
        return;
      }
      const dt = Math.min((t - last) / 1000, 0.06);
      last = t;
      ctx.clearRect(0, 0, w, h);

      // dust
      ctx.fillStyle = ink;
      for (const d of dust) {
        if (!reduce) {
          d.x = (d.x + d.vx * dt + w) % w;
          d.y = (d.y + d.vy * dt + h) % h;
        }
        ctx.globalAlpha = d.a;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // edges
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1;
      edges.forEach((e) => {
        const on = hover >= 0 && (e.a === hover || e.b === hover);
        ctx.globalAlpha = on ? 0.55 : 0.13;
        ctx.setLineDash(on ? [] : [3, 5]);
        ctx.beginPath();
        ctx.moveTo(nodes[e.a].px, nodes[e.a].py);
        ctx.lineTo(nodes[e.b].px, nodes[e.b].py);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // traffic: a steady trickle, plus bursts on edges near the cursor
      if (!reduce) {
        spawn -= dt;
        if (spawn <= 0) {
          spawn = 0.22;
          addPacket((Math.random() * edges.length) | 0);
          edges.forEach((e, k) => {
            if (nearEdge(e) < 140 && Math.random() < 0.55) addPacket(k);
          });
          if (hover >= 0) edges.forEach((e, k) => (e.a === hover || e.b === hover) && addPacket(k));
        }
      }
      ctx.fillStyle = accent;
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.t += dt / p.dur;
        if (p.t >= 1) {
          packets.splice(i, 1);
          continue;
        }
        const e = edges[p.e];
        if (!e) continue;
        const A = nodes[p.dir === 1 ? e.a : e.b];
        const B = nodes[p.dir === 1 ? e.b : e.a];
        for (let k = 0; k < 4; k++) {
          const u = Math.max(0, p.t - k * 0.025);
          ctx.globalAlpha = (1 - k / 4) * Math.sin(Math.PI * p.t) * 0.95;
          ctx.beginPath();
          ctx.arc(A.px + (B.px - A.px) * u, A.py + (B.py - A.py) * u, 2.4 - k * 0.45, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // nodes
      ctx.font = "500 11px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.textBaseline = "middle";
      nodes.forEach((n, i) => {
        const on = i === hover;
        const pulse = reduce ? 0 : (Math.sin(t / 700 + i) + 1) / 2;
        ctx.globalAlpha = 0.12 + pulse * 0.1;
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(n.px, n.py, on ? 14 : 9 + pulse * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = on ? accent : ink;
        ctx.beginPath();
        ctx.arc(n.px, n.py, on ? 5 : 3.5, 0, Math.PI * 2);
        ctx.fill();

      });

      // tooltip
      if (hover >= 0) {
        const n = nodes[hover];
        ctx.font = "400 12px ui-sans-serif, system-ui, sans-serif";
        const text = `${n.label} · ${langRef.current === "pt" ? n.detailPt : n.detail}${n.href ? "  →" : ""}`;
        const tw = ctx.measureText(text).width + 22;
        const tx = Math.min(Math.max(n.px - tw / 2, 8), w - tw - 8);
        // Beside the node, away from the cursor lens that sits on top of it.
        const ty = n.py + (n.y > 0.7 ? -62 : 34);
        ctx.globalAlpha = 0.96;
        ctx.fillStyle = ink;
        roundRect(tx, ty, tw, 28, 14);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = paper;
        ctx.textAlign = "left";
        ctx.fillText(text, tx + 11, ty + 14);
      }
      ctx.globalAlpha = 1;

      if (!reduce && visible) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      let best = -1;
      let bd = 26;
      nodes.forEach((n, i) => {
        const d = Math.hypot(n.px - mouse.x, n.py - mouse.y);
        if (d < bd) {
          bd = d;
          best = i;
        }
      });
      // Text and buttons sit above the map; only claim the pointer over empty space.
      const over = (e.target as Element | null)?.closest("a,button,h1,p,[role=switch]");
      hover = over ? -1 : best;
      // The site cursor is a frosted lens that would cover the tooltip; hide it over a node.
      if (hover >= 0) document.documentElement.dataset.cursor = "off";
      else delete document.documentElement.dataset.cursor;
      canvas.parentElement?.style.setProperty("cursor", hover >= 0 && nodes[hover].href ? "pointer" : "");
      if (reduce) requestAnimationFrame(draw);
    };
    const onLeave = () => {
      mouse.x = mouse.y = -9999;
      hover = -1;
      delete document.documentElement.dataset.cursor;
    };
    const onClick = () => {
      const n = hover >= 0 ? nodes[hover] : null;
      if (n?.href) router.push(n.href);
    };

    build();
    raf = requestAnimationFrame(draw);

    const ro = new ResizeObserver(() => {
      build();
      if (reduce) requestAnimationFrame(draw);
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible && !reduce) {
        last = performance.now();
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(draw);
      }
    });
    io.observe(canvas);

    if (finePointer) window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    const section = canvas.parentElement;
    section?.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      themeObs.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      section?.removeEventListener("click", onClick);
    };
  }, [router]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
