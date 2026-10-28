"use client";

import React, { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  z: number;
  r: number;
  phase: number;
  speed: number;
};

export default function ObservatorySky() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stars: Star[] = [];
    let frame = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(80, Math.min(240, Math.floor((window.innerWidth * window.innerHeight) / 11000)));
      stars = Array.from({ length: count }, () => ({
        x: Math.random(),
        y: Math.random(),
        z: Math.random(),
        r: 0.4 + Math.random() * 1.35,
        phase: Math.random() * Math.PI * 2,
        speed: 0.35 + Math.random() * 1.5,
      }));
    };

    const draw = (now: number) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      context.clearRect(0, 0, width, height);
      const t = now / 1000;

      for (const star of stars) {
        const depth = 0.28 + star.z * 0.85;
        const drift = reduced ? 0 : t * (0.003 + star.z * 0.011);
        const x = ((star.x + drift) % 1) * width;
        let y = star.y + (reduced ? 0 : t * 0.002 * (star.z - 0.4));
        y = ((y % 1) + 1) % 1;
        const twinkle = reduced ? 0.75 : 0.4 + 0.6 * Math.abs(Math.sin(t * star.speed + star.phase));
        const alpha = twinkle * (0.28 + star.z * 0.72);
        const gold = star.z > 0.86 && star.phase > 4;
        context.fillStyle = gold
          ? `rgba(253, 224, 138, ${alpha})`
          : `rgba(226, 240, 255, ${alpha})`;
        context.beginPath();
        context.arc(x, y * height, star.r * depth, 0, Math.PI * 2);
        context.fill();
      }

      frame = window.requestAnimationFrame(draw);
    };

    resize();
    frame = window.requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="observatory-sky" aria-hidden="true">
      <div className="nebula-layer nebula-a" />
      <div className="nebula-layer nebula-b" />
      <canvas ref={canvasRef} className="star-canvas" />
      <div className="orbital-grid" />
    </div>
  );
}
