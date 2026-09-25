/* Small animation toolkit mirroring the reference's react-spring configs. */

export type Ease = (t: number) => number;

export function cubicBezier(x1: number, y1: number, x2: number, y2: number): Ease {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sx = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sy = (t: number) => ((ay * t + by) * t + cy) * t;
  const dx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 10; i++) {
      const e = sx(t) - x;
      if (Math.abs(e) < 1e-6) break;
      const d = dx(t);
      if (Math.abs(d) < 1e-6) break;
      t -= e / d;
    }
    return sy(Math.min(1, Math.max(0, t)));
  };
}

export const easeOutSine: Ease = (t) => Math.sin((t * Math.PI) / 2);
export const easeOutQuad: Ease = (t) => t * (2 - t);
export const easeInQuad: Ease = (t) => t * t;
export const easeInOutQuart: Ease = (t) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

/** Eases from one number to another over a duration. */
export class Tween {
  value: number;
  private from: number;
  private to: number;
  private t0 = 0;
  private dur = 0;
  private ease: Ease = (t) => t;
  private running = false;

  constructor(v = 0) {
    this.value = v;
    this.from = v;
    this.to = v;
  }

  start(to: number, dur: number, ease: Ease, now: number, delay = 0) {
    this.from = this.value;
    this.to = to;
    this.t0 = now + delay;
    this.dur = dur;
    this.ease = ease;
    this.running = true;
  }

  set(v: number) {
    this.value = this.from = this.to = v;
    this.running = false;
  }

  get active() {
    return this.running;
  }

  update(now: number) {
    if (!this.running) return this.value;
    const p = (now - this.t0) / this.dur;
    if (p <= 0) return this.value;
    if (p >= 1) {
      this.value = this.to;
      this.running = false;
    } else {
      this.value = this.from + (this.to - this.from) * this.ease(p);
    }
    return this.value;
  }
}

/** Animates a record of numeric props toward a target preset. */
export class PropsTween<K extends string> {
  cur: Record<K, number>;
  private from: Record<K, number>;
  private to: Record<K, number>;
  private t0 = 0;
  private dur = 0;
  private ease: Ease = (t) => t;
  private running = false;

  constructor(initial: Record<K, number>) {
    this.cur = { ...initial };
    this.from = { ...initial };
    this.to = { ...initial };
  }

  animate(to: Record<K, number>, dur: number, ease: Ease, now: number, immediate = false) {
    if (immediate) {
      this.cur = { ...to };
      this.from = { ...to };
      this.to = { ...to };
      this.running = false;
      return;
    }
    this.from = { ...this.cur };
    this.to = { ...to };
    this.t0 = now;
    this.dur = dur;
    this.ease = ease;
    this.running = true;
  }

  update(now: number) {
    if (!this.running) return;
    const p = (now - this.t0) / this.dur;
    const keys = Object.keys(this.to) as K[];
    if (p >= 1) {
      this.cur = { ...this.to };
      this.running = false;
      return;
    }
    const e = this.ease(Math.max(0, p));
    for (const k of keys) this.cur[k] = this.from[k] + (this.to[k] - this.from[k]) * e;
  }
}

/** react-spring style damped spring (mass / tension / friction). */
export class Spring {
  x: number;
  v = 0;
  target: number;
  constructor(
    private mass: number,
    private tension: number,
    private friction: number,
    x = 0,
  ) {
    this.x = x;
    this.target = x;
  }

  step(dt: number) {
    const n = Math.max(1, Math.ceil(dt / (1 / 240)));
    const h = dt / n;
    for (let i = 0; i < n; i++) {
      const a = (-this.tension * (this.x - this.target) - this.friction * this.v) / this.mass;
      this.v += a * h;
      this.x += this.v * h;
    }
    return this.x;
  }
}

/** Port of the Lethargy wheel-inertia detector used by the reference. */
export class Lethargy {
  private stability: number;
  private sensitivity: number;
  private tolerance: number;
  private delay: number;
  private up: (number | null)[];
  private down: (number | null)[];
  private stamps: (number | null)[];

  constructor(stability = 10, sensitivity = 2, tolerance = 0.1, delay = 150) {
    this.stability = Math.abs(stability);
    this.sensitivity = 1 + Math.abs(sensitivity);
    this.tolerance = 1 + Math.abs(tolerance);
    this.delay = delay;
    this.up = new Array(this.stability * 2).fill(null);
    this.down = new Array(this.stability * 2).fill(null);
    this.stamps = new Array(this.stability * 2).fill(null);
  }

  /** true while the wheel is being driven by the user, false for inertia tails. */
  check(e: WheelEvent): boolean {
    const raw = (e as WheelEvent & { wheelDelta?: number }).wheelDelta;
    let d: number;
    if (raw != null) d = raw;
    else d = -40 * e.deltaY;
    this.stamps.push(Date.now());
    this.stamps.shift();
    if (d > 0) {
      this.up.push(d);
      this.up.shift();
      return this.isInertia(1);
    }
    this.down.push(d);
    this.down.shift();
    return this.isInertia(-1);
  }

  private isInertia(dir: 1 | -1): boolean {
    const buf = dir === -1 ? this.down : this.up;
    if (buf[0] === null) return true;
    const s = this.stability;
    if (
      (this.stamps[2 * s - 2] as number) + this.delay > Date.now() &&
      buf[0] === buf[2 * s - 1]
    )
      return false;
    const a = buf.slice(0, s) as number[];
    const b = buf.slice(s, 2 * s) as number[];
    const avgA = a.reduce((x, y) => x + y, 0) / a.length;
    const avgB = b.reduce((x, y) => x + y, 0) / b.length;
    return Math.abs(avgA) < Math.abs(avgB * this.tolerance) && this.sensitivity < Math.abs(avgB);
  }
}
