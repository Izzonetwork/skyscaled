import React from "react";

function mulberry32(seed: number) {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Star = {
  left: string;
  top: string;
  size: number;
  delay: string;
  duration: string;
  opacity: number;
};

function makeStars(count: number, seed: number, size: number, duration: number): Star[] {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, () => ({
    left: `${(rand() * 100).toFixed(3)}%`,
    top: `${(rand() * 100).toFixed(3)}%`,
    size,
    delay: `${(rand() * duration).toFixed(2)}s`,
    duration: `${(duration + rand() * 2.5).toFixed(2)}s`,
    opacity: 0.25 + rand() * 0.75,
  }));
}

const FAR = makeStars(70, 101, 1, 4.8);
const MID = makeStars(42, 202, 1.6, 3.4);
const NEAR = makeStars(22, 303, 2.2, 2.6);

function Layer({ stars, className }: { stars: Star[]; className: string }) {
  return (
    <div className={className}>
      {stars.map((star, index) => (
        <span
          key={index}
          className="star-dot"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
            animationDuration: star.duration,
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  );
}

export default function Starfield({
  className = "",
  dense = false,
}: {
  className?: string;
  dense?: boolean;
}) {
  return (
    <div className={`pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      <Layer stars={dense ? FAR : FAR.slice(0, 36)} className="star-depth star-depth-far" />
      <Layer stars={dense ? MID : MID.slice(0, 18)} className="star-depth star-depth-mid" />
      {dense ? <Layer stars={NEAR} className="star-depth star-depth-near" /> : null}
    </div>
  );
}

export function OrbitalRings() {
  return (
    <div className="pointer-events-none absolute -right-16 top-8 hidden h-[540px] w-[540px] lg:block" aria-hidden="true">
      <div className="orbital-spin absolute inset-0">
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <circle cx="100" cy="100" r="78" fill="none" stroke="rgba(34,211,238,0.45)" strokeWidth="0.4" strokeDasharray="1.2 2.4" />
          <circle cx="100" cy="100" r="62" fill="none" stroke="rgba(129,140,248,0.4)" strokeWidth="0.35" strokeDasharray="0.4 2.8" />
          <circle cx="100" cy="100" r="46" fill="none" stroke="rgba(251,191,36,0.35)" strokeWidth="0.35" />
          <circle cx="178" cy="100" r="1.7" fill="#67e8f9" />
          <circle cx="38" cy="100" r="1.15" fill="#fbbf24" />
          <circle cx="100" cy="22" r="1.3" fill="#a5b4fc" />
        </svg>
      </div>
      <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/80 shadow-[0_0_18px_rgba(34,211,238,0.8)]" />
    </div>
  );
}
