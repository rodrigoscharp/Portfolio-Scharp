/* The opening animation plays once per browser session on the home page.
   Hero and Beto read this to start their own entrances after it. */

const KEY = "intro-seen";
/* 00 + name reveal + zoom; the hero and Beto enter right after. */
export const INTRO_SECONDS = 3;

// Decided once per page load, so React's double-run of effects in dev and
// re-renders all agree while the intro is playing.
let pending: boolean | undefined;

export function introPending(): boolean {
  if (typeof window === "undefined") return false;
  if (pending !== undefined) return pending;
  pending = decide();
  return pending;
}

function decide(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return sessionStorage.getItem(KEY) !== "1";
  } catch {
    return false;
  }
}

/* The home page holds the intro behind a "click to enter" screen (browsers
   only allow sound after a click), so entrances are timed from the moment the
   intro actually starts, not from page load. */
let started = false;
const waiters = new Set<() => void>();

export function onIntroStart(cb: () => void) {
  if (started || !introPending()) {
    cb();
    return () => {};
  }
  waiters.add(cb);
  return () => {
    waiters.delete(cb);
  };
}

export function startIntro() {
  started = true;
  waiters.forEach((cb) => cb());
  waiters.clear();
}

/* After the intro: later client navigations back to home skip the delays. */
export function introDone() {
  pending = false;
}

export function markIntroSeen() {
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {}
}
