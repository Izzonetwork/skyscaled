"use client";

import React, { useEffect, useRef } from "react";

function mix(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t);
}

const SKY_STOPS: { t: number; rgb: [number, number, number] }[] = [
  { t: 0, rgb: [2, 6, 18] },
  { t: 0.18, rgb: [8, 16, 36] },
  { t: 0.36, rgb: [24, 22, 46] },
  { t: 0.55, rgb: [58, 40, 42] },
  { t: 0.75, rgb: [112, 74, 48] },
  { t: 1, rgb: [168, 118, 74] },
];

function skyColor(sqm: number): string {
  const t = Math.min(1, Math.max(0, (22 - sqm) / (22 - 16.5)));
  let lower = SKY_STOPS[0];
  let upper = SKY_STOPS[SKY_STOPS.length - 1];
  for (let i = 0; i < SKY_STOPS.length - 1; i += 1) {
    if (t >= SKY_STOPS[i].t && t <= SKY_STOPS[i + 1].t) {
      lower = SKY_STOPS[i];
      upper = SKY_STOPS[i + 1];
      break;
    }
  }
  const span = upper.t - lower.t || 1;
  const local = (t - lower.t) / span;
  const r = mix(lower.rgb[0], upper.rgb[0], local);
  const g = mix(lower.rgb[1], upper.rgb[1], local);
  const b = mix(lower.rgb[2], upper.rgb[2], local);
  return `rgb(${r}, ${g}, ${b})`;
}

const ORION: { name: string; x: number; y: number; mag: number; color: string }[] = [
  { name: "Betelgeuse", x: 0.58, y: 0.34, mag: 0.5, color: "#fda4af" },
  { name: "Bellatrix", x: 0.7, y: 0.32, mag: 1.6, color: "#ffffff" },
  { name: "Mintaka", x: 0.6, y: 0.46, mag: 2.2, color: "#ffffff" },
  { name: "Alnilam", x: 0.645, y: 0.48, mag: 1.7, color: "#ffffff" },
  { name: "Alnitak", x: 0.69, y: 0.5, mag: 1.8, color: "#ffffff" },
  { name: "Saiph", x: 0.62, y: 0.64, mag: 2.1, color: "#ffffff" },
  { name: "Rigel", x: 0.74, y: 0.62, mag: 0.13, color: "#bfdbfe" },
];

const LINES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 4],
  [2, 3],
  [3, 4],
  [2, 5],
  [4, 6],
  [5, 6],
];

export default function NightSkyPreview({ bortle, sqm, nelm }: { bortle: number; sqm: number; nelm: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = skyColor(sqm);
    ctx.fillRect(0, 0, width, height);

    const milkyWay = Math.max(0, 1 - (bortle - 1) / 6.5);
    if (milkyWay > 0.04) {
      ctx.save();
      ctx.translate(width * 0.48, height * 0.42);
      ctx.rotate(-0.65);
      const band = ctx.createLinearGradient(0, -110, 0, 110);
      band.addColorStop(0, "rgba(186, 200, 255, 0)");
      band.addColorStop(0.5, `rgba(226, 214, 255, ${0.5 * milkyWay})`);
      band.addColorStop(1, "rgba(186, 200, 255, 0)");
      ctx.fillStyle = band;
      ctx.fillRect(-width, -120, width * 2, 240);
      ctx.restore();
    }

    let seed = 20261028;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < 520; i += 1) {
      const mag = random() * 7.4;
      if (mag > nelm) continue;
      const x = random() * width;
      const y = random() * height * 0.84;
      const alpha = Math.min(1, (nelm - mag) / 3.5 + 0.12);
      const radius = mag < 1.2 ? 2.3 : mag < 2.8 ? 1.45 : 0.75;
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    const visible = ORION.map((star) => star.mag <= nelm + 0.4);
    ctx.strokeStyle = `rgba(186, 230, 253, ${Math.max(0.15, 0.55 - bortle * 0.04)})`;
    ctx.lineWidth = 1.25;
    LINES.forEach(([a, b]) => {
      if (!visible[a] || !visible[b]) return;
      ctx.beginPath();
      ctx.moveTo(ORION[a].x * width, ORION[a].y * height);
      ctx.lineTo(ORION[b].x * width, ORION[b].y * height);
      ctx.stroke();
    });

    if (bortle <= 6) {
      const glow = ctx.createRadialGradient(0.66 * width, 0.55 * height, 2, 0.66 * width, 0.55 * height, 28);
      glow.addColorStop(0, `rgba(196, 214, 255, ${Math.max(0, 0.55 - bortle * 0.07)})`);
      glow.addColorStop(1, "rgba(196, 214, 255, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.ellipse(0.66 * width, 0.55 * height, 16, 26, 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    ORION.forEach((star) => {
      if (star.mag > nelm + 0.4) return;
      ctx.fillStyle = star.color;
      ctx.beginPath();
      ctx.arc(star.x * width, star.y * height, star.mag < 1 ? 3.1 : 2.1, 0, Math.PI * 2);
      ctx.fill();
    });

    const dome = Math.min(1, Math.max(0, (bortle - 1) / 8));
    const horizon = ctx.createLinearGradient(0, height * 0.62, 0, height);
    horizon.addColorStop(0, "rgba(251, 146, 60, 0)");
    horizon.addColorStop(0.55, `rgba(251, 146, 60, ${0.05 + dome * 0.35})`);
    horizon.addColorStop(1, `rgba(234, 88, 12, ${0.12 + dome * 0.72})`);
    ctx.fillStyle = horizon;
    ctx.fillRect(0, height * 0.55, width, height * 0.45);

    ctx.fillStyle = "#020617";
    ctx.fillRect(0, height * 0.9, width, height * 0.1);
    ctx.fillStyle = "rgba(248, 250, 252, 0.8)";
    ctx.font = "22px ui-monospace, monospace";
    ctx.fillText(`Bortle ${bortle}`, 28, 42);
    ctx.font = "16px ui-monospace, monospace";
    ctx.fillStyle = "rgba(226, 232, 240, 0.75)";
    ctx.fillText("Orion schematic · zenith view", 28, 68);
  }, [bortle, nelm, sqm]);

  return (
    <canvas
      ref={ref}
      width={960}
      height={540}
      className="h-auto w-full rounded-2xl border border-slate-800 bg-slate-950"
      aria-label={`Simulated night sky at Bortle class ${bortle}`}
    />
  );
}
