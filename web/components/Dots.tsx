/* Deterministic scatter of tiny dots (seeded so server and client markup match). */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(90210);
const DOTS = Array.from({ length: 150 }, () => ({
  x: (rand() * 100).toFixed(2),
  y: (rand() * 100).toFixed(2),
  r: (2 + rand() * 2.4).toFixed(1),
  o: (0.25 + rand() * 0.4).toFixed(2),
}));

export default function Dots({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
      {DOTS.map((d, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-ink-soft"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: `${d.r}px`,
            height: `${d.r}px`,
            opacity: d.o,
          }}
        />
      ))}
    </div>
  );
}
