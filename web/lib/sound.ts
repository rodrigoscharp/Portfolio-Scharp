/* Site sound: every effect and the background music are synthesised with the Web
   Audio API, so there are no files to load. Browsers only allow audio after a
   gesture, so sound turns on with the visitor's first click or key unless they
   muted it before (remembered in localStorage). */

export type Sfx = "hover" | "click" | "on" | "off" | "open" | "close" | "node" | "edge" | "scan" | "whoosh" | "intro" | "hi" | "poke";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let music: GainNode | null = null;
let noise: AudioBuffer | null = null;
let enabled = false;
let unlocked = false;
const last: Partial<Record<Sfx, number>> = {};
const listeners = new Set<() => void>();

// Minimum gap between two plays of the same effect, so fast mouse moves don't buzz.
const GAP: Partial<Record<Sfx, number>> = { hover: 60, node: 120, edge: 120, scan: 400, whoosh: 700, intro: 3000, hi: 1500 };

const pref = () => {
  try {
    return localStorage.getItem("sound");
  } catch {
    return null;
  }
};

function audio() {
  if (ctx) return ctx;
  ctx = new AudioContext();
  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);
  noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const d = noise.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  document.addEventListener("visibilitychange", () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend();
    else if (enabled) ctx.resume();
  });
  return ctx;
}

/* Background music: a slow lo-fi loop (Cmaj7, Am7, Fmaj7, G6) played on a soft
   electric-piano voice, with a bass note, a quiet chord bed and a few random
   pentatonic notes per bar through a tape-style echo. Scheduled one bar ahead. */
const BAR = 4.8;
const PROG = [
  { bass: 36, chord: [60, 64, 67, 71] },
  { bass: 33, chord: [57, 60, 64, 67] },
  { bass: 29, chord: [57, 60, 64, 65] },
  { bass: 31, chord: [55, 59, 62, 64] },
];
const MELODY = [72, 74, 76, 79, 81, 84];
const hz = (m: number) => 440 * 2 ** ((m - 69) / 12);

function startMusic(a: AudioContext) {
  if (music || !master) return;
  music = a.createGain();
  music.gain.value = 0;
  music.gain.linearRampToValueAtTime(1, a.currentTime + 3);
  music.connect(master);
  // Echo with a darkening feedback loop, like an old tape delay.
  const echo = a.createDelay(1);
  echo.delayTime.value = BAR / 8;
  const fb = a.createGain();
  fb.gain.value = 0.32;
  const tape = a.createBiquadFilter();
  tape.type = "lowpass";
  tape.frequency.value = 1800;
  echo.connect(tape).connect(fb).connect(echo);
  tape.connect(music);
  const out = music;

  const key = (m: number, t: number, dur: number, vol: number, wet = 0.5) => {
    const g = a.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    const send = a.createGain();
    send.gain.value = wet;
    g.connect(out);
    g.connect(send).connect(echo);
    // Fundamental plus a faint octave gives the bell-like electric-piano tone.
    [[1, 1], [2, 0.18]].forEach(([mul, lvl]) => {
      const o = a.createOscillator();
      const og = a.createGain();
      o.frequency.value = hz(m) * mul;
      og.gain.value = lvl;
      o.connect(og).connect(g);
      o.start(t);
      o.stop(t + dur + 0.05);
    });
  };

  const bed = (notes: number[], t: number) => {
    const lp = a.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 900;
    const g = a.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.012, t + 1.2);
    g.gain.linearRampToValueAtTime(0, t + BAR + 0.4);
    lp.connect(g).connect(out);
    notes.forEach((m) => {
      const o = a.createOscillator();
      o.type = "triangle";
      o.frequency.value = hz(m);
      o.connect(lp);
      o.start(t);
      o.stop(t + BAR + 0.5);
    });
  };

  let bar = 0;
  let next = a.currentTime + 0.1;
  setInterval(() => {
    // After a stalled timer, start from now instead of playing every missed bar at once.
    if (next < a.currentTime) next = a.currentTime + 0.05;
    while (next < a.currentTime + 1) {
      // Muted: keep the clock moving without building any nodes.
      if (enabled) {
        const { bass, chord } = PROG[bar % PROG.length];
        bed(chord, next);
        key(bass, next, BAR, 0.07, 0);
        chord.forEach((m, i) => key(m, next + i * 0.06, 2.6, 0.022, 0.3));
        for (let s = 2; s < 8; s++) {
          if (Math.random() < 0.4) key(MELODY[(Math.random() * MELODY.length) | 0], next + (s * BAR) / 8, 1.8, 0.03);
        }
      }
      next += BAR;
      bar++;
    }
  }, 250);
}

function tone(freq: number, dur: number, vol: number, type: OscillatorType = "sine", to?: number, delay = 0) {
  const a = ctx;
  if (!a || !master) return;
  const t = a.currentTime + delay;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + dur + 0.02);
}

function sweep(from: number, to: number, dur: number, vol: number, type: BiquadFilterType = "bandpass") {
  const a = ctx;
  if (!a || !master || !noise) return;
  const t = a.currentTime;
  const src = a.createBufferSource();
  src.buffer = noise;
  const f = a.createBiquadFilter();
  f.type = type;
  f.Q.value = type === "bandpass" ? 6 : 0.8;
  f.frequency.setValueAtTime(from, t);
  f.frequency.exponentialRampToValueAtTime(to, t + dur * 0.6);
  f.frequency.exponentialRampToValueAtTime(from, t + dur);
  const g = a.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + dur * 0.4);
  g.gain.linearRampToValueAtTime(0, t + dur);
  src.connect(f).connect(g).connect(master);
  src.start(t);
  src.stop(t + dur);
}

export function play(name: Sfx) {
  if (!enabled || !ctx) return;
  const now = performance.now();
  if (now - (last[name] ?? 0) < (GAP[name] ?? 30)) return;
  last[name] = now;
  switch (name) {
    case "hover":
      return tone(1760, 0.05, 0.025);
    case "click":
      tone(540, 0.09, 0.07, "triangle", 320);
      return sweep(3000, 5000, 0.03, 0.04, "highpass");
    case "on":
      tone(660, 0.1, 0.06, "triangle");
      return tone(990, 0.16, 0.06, "triangle", undefined, 0.07);
    case "off":
      tone(990, 0.1, 0.06, "triangle");
      return tone(660, 0.16, 0.06, "triangle", undefined, 0.07);
    case "open":
      return tone(440, 0.2, 0.06, "sine", 880);
    case "close":
      return tone(880, 0.16, 0.05, "sine", 440);
    case "node":
      tone(1320, 0.14, 0.05);
      return tone(1980, 0.18, 0.025, "sine", undefined, 0.06);
    case "edge":
      return tone(880, 0.07, 0.035, "sine", 1100);
    case "scan":
      return sweep(400, 3200, 0.4, 0.05);
    case "whoosh":
      return sweep(250, 1400, 0.7, 0.07, "lowpass");
    case "intro":
      // The "wow": a rising swell, a low hit and a bright chord that blooms open.
      sweep(200, 4000, 0.9, 0.08);
      tone(110, 1.2, 0.14, "sine", 55, 0.45);
      [523.3, 659.3, 784, 987.8, 1318.5].forEach((f, i) => tone(f, 2.4, 0.045, "triangle", undefined, 0.5 + i * 0.05));
      return;
    case "poke":
      // Being pushed: a soft thump on his fur, a squish and a rubbery boing back.
      tone(130, 0.14, 0.13, "sine", 60);
      sweep(250, 900, 0.14, 0.05);
      tone(240, 0.32, 0.06, "sine", 480, 0.08);
      return tone(470, 0.22, 0.03, "sine", 360, 0.22);
    case "hi":
      // A cheerful two-syllable chirp, Beto's "o-i".
      tone(520, 0.14, 0.06, "triangle", 760);
      return tone(700, 0.22, 0.06, "triangle", 1050, 0.16);
  }
}

export function setSound(on: boolean, remember = true) {
  if (remember) {
    try {
      localStorage.setItem("sound", on ? "on" : "off");
    } catch {}
  }
  enabled = on;
  unlocked = true;
  if (on) {
    const a = audio();
    a.resume();
    startMusic(a);
    master?.gain.setTargetAtTime(1, a.currentTime, 0.2);
  } else if (ctx && master) {
    master.gain.setTargetAtTime(0, ctx.currentTime, 0.15);
  }
  listeners.forEach((l) => l());
}

/* Called on the first gesture anywhere on the page. */
export function unlockSound() {
  if (unlocked) return;
  unlocked = true;
  if (pref() !== "off") {
    setSound(true, false);
    play("intro");
  }
}

export const soundOn = () => enabled;
export function subscribeSound(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
