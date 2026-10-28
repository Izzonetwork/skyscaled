"use client";

import React, { useEffect, useRef } from "react";

export default function HeroBackdrop() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = layerRef.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const onMove = (event: MouseEvent) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      node.style.setProperty("--px", `${x * -22}px`);
      node.style.setProperty("--py", `${y * -14}px`);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div ref={layerRef} className="hero-backdrop" aria-hidden="true">
      <img
        src="/images/space/hero-cosmic-cliffs.jpg"
        alt=""
        className="hero-nebula"
      />
      <div className="hero-stars hero-stars-far" />
      <div className="hero-stars hero-stars-mid" />
      <div className="hero-stars hero-stars-near" />
      <div className="reticle-overlay opacity-50" />
      <div className="hero-scrim" />
    </div>
  );
}
