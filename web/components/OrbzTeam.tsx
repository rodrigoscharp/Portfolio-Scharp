"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { useLang, useL } from "@/lib/i18n";

/* The Orbz: five AI agents Rodrigo built to run his day. The 3D stage is the
   embeddable build from the Orbz repo (public/orbz), driven by postMessage. */
const ORBZ = [
  { name: "Beto", role: "Coordinator", image: "/images/orbz/beto.png", line: "Morning! Three things matter today. I moved the rest to tomorrow." },
  { name: "Lume", role: "Research", image: "/images/orbz/lume.png", line: "Your report is ready, with every source linked at the end." },
  { name: "Cifra", role: "Finance", image: "/images/orbz/cifra.png", line: "Spending is under this month's goal. The card bill closes on Friday." },
  { name: "Tico", role: "Calendar", image: "/images/orbz/tico.png", line: "Meeting in 15 minutes. Want me to push lunch to 1 pm?" },
  { name: "Bit", role: "Code", image: "/images/orbz/bit.png", line: "PR reviewed: two comments, nothing blocking, and the tests are green." },
];

const ORBZ_PT: typeof ORBZ = [
  { ...ORBZ[0], role: "Gestão", line: "Bom dia! Três coisas importam hoje. O resto eu passei para amanhã." },
  { ...ORBZ[1], role: "Pesquisa", line: "Seu relatório está pronto, com todas as fontes no final." },
  { ...ORBZ[2], role: "Finanças", line: "Os gastos estão abaixo da meta do mês. A fatura do cartão fecha na sexta." },
  { ...ORBZ[3], role: "Agenda", line: "Reunião em 15 minutos. Quer que eu passe o almoço para as 13h?" },
  { ...ORBZ[4], role: "Código", line: "PR revisado: dois comentários, nada bloqueando, e os testes estão verdes." },
];

/* One soft glow per Orb color, drifting behind the stage. */
const ORB_GLOWS = [
  { color: "#6CCBB0", left: "-6%", top: "-30%", size: "34%", dx: "18%", dy: "12%" },
  { color: "#A68CEB", left: "22%", top: "-45%", size: "30%", dx: "-10%", dy: "20%" },
  { color: "#A9D35A", left: "48%", top: "-35%", size: "26%", dx: "12%", dy: "16%" },
  { color: "#5B8FE0", left: "66%", top: "-40%", size: "30%", dx: "-14%", dy: "18%" },
  { color: "#D97757", left: "84%", top: "-25%", size: "30%", dx: "-16%", dy: "10%" },
];

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* Marker stroke that draws in from the left the first time it is seen. */
function Highlight({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, amount: 1 });
  const reduce = useReducedMotion();
  return (
    <motion.span
      ref={ref}
      className="whitespace-nowrap rounded-[0.15em] bg-no-repeat px-[0.1em] font-semibold [box-decoration-break:clone] max-sm:whitespace-normal"
      style={{
        backgroundImage: "linear-gradient(transparent 55%, color-mix(in srgb, var(--accent) 55%, transparent) 55%)",
        backgroundPosition: "0 100%",
      }}
      initial={false}
      animate={{ backgroundSize: seen || reduce ? "100% 100%" : "0% 100%" }}
      transition={{ duration: 0.9, delay: 0.2, ease: EASE_OUT }}
    >
      {children}
    </motion.span>
  );
}

export default function OrbzTeam() {
  const { t, lang } = useLang();
  const orbz = useL(ORBZ, ORBZ_PT);
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const near = useInView(ref, { margin: "600px 0px", once: true });
  const visible = useInView(ref, { amount: 0.15 });
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [sel, setSel] = useState(-1);

  // Building the 3D stage takes a moment of main-thread work; do it while the
  // browser is idle after load instead of in the middle of the visitor's scroll.
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    if (reduce) return;
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const wait = window.setTimeout(() => {
      id = ric(() => setIdle(true));
    }, 4500);
    let id = 0;
    return () => {
      window.clearTimeout(wait);
      cancel(id);
    };
  }, [reduce]);
  const mounted = (near || idle) && !reduce;

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source !== frame.current?.contentWindow) return;
      if (e.data?.type === "orbz-ready") setReady(true);
      if (e.data?.type === "orbz-select") setSel(e.data.i);
      if (e.data?.type === "orbz-pointer") window.dispatchEvent(new Event("cursor-hide"));
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const send = (msg: Record<string, unknown>) =>
    frame.current?.contentWindow?.postMessage({ type: "orbz", ...msg }, window.location.origin);

  useEffect(() => {
    if (ready) send({ cmd: visible ? "resume" : "pause" });
  }, [ready, visible]);

  // While Beto gives the page tour his seat on the stage stays empty; when the
  // guide flies back, the 3D Beto pops into place and takes over.
  const betoAway = useRef(false);
  const betoLanding = useRef(false);
  const readyRef = useRef(false);
  useEffect(() => {
    readyRef.current = ready;
    if (!ready) return;
    if (betoLanding.current) {
      betoLanding.current = false;
      send({ cmd: "beto-land" });
    } else if (betoAway.current) send({ cmd: "beto-away" });
  }, [ready]);
  useEffect(() => {
    const onAway = () => {
      betoAway.current = true;
      send({ cmd: "beto-away" });
    };
    const onHome = () => {
      if (!betoAway.current) return;
      betoAway.current = false;
      if (!readyRef.current) {
        betoLanding.current = true;
        return;
      }
      send({ cmd: "beto-land" });
      window.setTimeout(() => {
        setSel(0);
        send({ cmd: "select", i: 0 });
      }, 700);
    };
    window.addEventListener("beto-away", onAway);
    window.addEventListener("beto-home", onHome);
    return () => {
      window.removeEventListener("beto-away", onAway);
      window.removeEventListener("beto-home", onHome);
    };
  }, []);

  // Every click plays the next trick of that Orb, so a card never toggles off.
  const pick = (i: number) => {
    setSel(i);
    send({ cmd: "select", i });
  };

  const active = sel >= 0 ? orbz[sel] : null;

  return (
    <section ref={ref} id="team" className="mx-auto max-w-[1434px] px-[clamp(12px,1.5vw,22px)] pb-24 md:pb-40">
      <Reveal>
        <div className="mb-[clamp(14px,2vw,28px)] flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <h2
            className={`display whitespace-nowrap ${
              lang === "pt" ? "text-[clamp(2.2rem,8.4vw,8.6rem)]" : "text-[clamp(2.6rem,10.4vw,10.4rem)]"
            }`}
          >
            {t("My AI Staff", "Meu time de IA")}
          </h2>
          <p className="max-w-[22em] pb-[0.4em] text-[clamp(19px,2vw,30px)] font-light leading-[1.25] tracking-[-0.01em] text-ink">
            {lang === "pt" ? (
              <>
                Conheça os <strong className="font-bold">Orbz</strong>: um time de cinco agentes de IA{" "}
                <Highlight>que eu mesmo arquitetei e construí</Highlight>. Cada um cuida de uma área do meu dia e passa
                tarefas para os outros, por voz, texto e Telegram.
              </>
            ) : (
              <>
                Meet the <strong className="font-bold">Orbz</strong>: a team of five AI agents{" "}
                <Highlight>I architected and built myself</Highlight>. Each one owns an area of my day and hands work to
                the others, by voice, text and Telegram.
              </>
            )}
          </p>
        </div>
      </Reveal>

      <Reveal>
        <div className="overflow-hidden rounded-[clamp(10px,1.95vw,28px)] border border-ink">
          <div className="relative aspect-[2/1] w-full overflow-hidden bg-[#F4EEE4] sm:aspect-[2.4/1]">
            <div aria-hidden className="pointer-events-none absolute inset-0">
              {ORB_GLOWS.map((g, k) => (
                <motion.span
                  key={g.color}
                  className="absolute aspect-square scale-[1.6] opacity-55 will-change-transform"
                  style={{ background: `radial-gradient(closest-side, ${g.color}, transparent)`, left: g.left, top: g.top, width: g.size }}
                  animate={reduce || !visible ? undefined : { x: ["0%", g.dx, "0%"], y: ["0%", g.dy, "0%"] }}
                  transition={{ duration: 14 + k * 3, repeat: Infinity, ease: "easeInOut" }}
                />
              ))}
              <div
                className="absolute inset-0 opacity-[0.35]"
                style={{
                  backgroundImage: "radial-gradient(rgba(30,29,26,0.35) 1px, transparent 1.3px)",
                  backgroundSize: "clamp(14px,1.8vw,24px) clamp(14px,1.8vw,24px)",
                  maskImage: "radial-gradient(70% 60% at 50% 40%, transparent 30%, #000 85%)",
                }}
              />
            </div>

            {/* Poster until the 3D stage is up (and instead of it, for reduced motion). */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={false}
              animate={{ opacity: ready ? 0 : 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex w-[78%] items-end justify-between gap-[2%]">
                {orbz.map((o, k) => (
                  <motion.div
                    key={o.name}
                    className="relative aspect-square w-[17%]"
                    animate={reduce ? undefined : { y: ["0%", "-6%", "0%"] }}
                    transition={{ duration: 2.4, delay: k * 0.18, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Image src={o.image} alt={o.name} fill sizes="160px" className="object-contain" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {mounted && (
              <iframe
                ref={frame}
                src="/orbz/index.html"
                title={t("The Orbz, five animated AI agents", "Os Orbz, cinco agentes de IA animados")}
                className="absolute inset-0 h-full w-full border-0 transition-opacity duration-700"
                style={{ opacity: ready ? 1 : 0, colorScheme: "light" }}
              />
            )}

            <AnimatePresence>
              {active && (
                <motion.div
                  key={active.name}
                  className="pointer-events-none absolute left-1/2 top-[6%] z-10 hidden w-[min(92%,520px)] sm:block -translate-x-1/2 rounded-[18px] bg-[#1E1D1A] px-[1.1em] py-[0.8em] text-[clamp(12px,1.2vw,17px)] text-[#FBF9F5] shadow-[0_18px_40px_-18px_rgba(0,0,0,.6)]"
                  initial={{ opacity: 0, y: -12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: EASE_OUT }}
                >
                  <span className="mr-[0.4em] font-bold">{active.name}:</span>
                  <span className="font-light">&ldquo;{active.line}&rdquo;</span>
                  <span className="mt-[0.3em] block text-[0.72em] uppercase tracking-[0.12em] opacity-55">{t("Sample line", "Fala de exemplo")}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* On phones the line sits under the stage so it never covers the Orbz. */}
          {active && (
            <p className="border-t border-ink bg-[#1E1D1A] px-4 py-3 text-[13px] leading-snug text-[#FBF9F5] sm:hidden">
              <span className="mr-[0.4em] font-bold">{active.name}:</span>
              <span className="font-light">&ldquo;{active.line}&rdquo;</span>
            </p>
          )}

          <ul className="grid grid-cols-5 border-t border-ink bg-bg">
            {orbz.map((o, i) => (
              <li key={o.name} className={i > 0 ? "border-l border-ink" : ""}>
                <button
                  type="button"
                  onClick={() => pick(i)}
                  aria-pressed={sel === i}
                  className={`flex h-full w-full flex-col items-center gap-[0.35em] px-[0.4em] py-[clamp(8px,1.4vw,20px)] text-center transition-colors md:flex-row md:gap-[0.8em] md:px-[clamp(10px,1.4vw,22px)] md:text-left ${
                    sel === i ? "bg-ink text-bg" : "hover:bg-ink/5"
                  }`}
                >
                  <Image src={o.image} alt="" width={120} height={120} className="h-[clamp(30px,3.6vw,52px)] w-auto shrink-0" />
                  <span className="min-w-0">
                    <span className="block text-[clamp(12px,1.4vw,20px)] font-bold leading-tight">{o.name}</span>
                    <span className="block text-[clamp(8px,0.85vw,12px)] uppercase tracking-[0.1em] opacity-60">{o.role}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
