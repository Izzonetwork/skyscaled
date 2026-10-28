"use client";

import React, { useMemo } from "react";
import type { SkyTarget } from "@/data/observerPresets";

function scaleBar(viewArcmin: number): { arcmin: number; label: string } {
  const candidates = [1 / 60, 5 / 60, 10 / 60, 0.5, 1, 2, 5, 10, 15, 30, 60, 120, 240];
  const target = viewArcmin * 0.22;
  let chosen = candidates[0];
  for (const candidate of candidates) {
    if (candidate <= target) chosen = candidate;
  }
  if (chosen < 1) {
    const arcsec = chosen * 60;
    const label = arcsec >= 10 ? `${arcsec.toFixed(0)}″` : `${arcsec.toFixed(1)}″`;
    return { arcmin: chosen, label };
  }
  if (chosen >= 60) return { arcmin: chosen, label: `${chosen / 60}°` };
  return { arcmin: chosen, label: `${chosen}′` };
}

export default function FramingCanvas({
  target,
  sensorArcminW,
  sensorArcminH,
  rotationDeg,
  eyepieceArcmin,
  showSensor,
  showEyepiece,
  emphasize,
}: {
  target: SkyTarget;
  sensorArcminW: number;
  sensorArcminH: number;
  rotationDeg: number;
  eyepieceArcmin: number;
  showSensor: boolean;
  showEyepiece: boolean;
  emphasize: "camera" | "visual";
}) {
  const scene = useMemo(() => {
    const radians = (rotationDeg * Math.PI) / 180;
    const bboxW = Math.abs(sensorArcminW * Math.cos(radians)) + Math.abs(sensorArcminH * Math.sin(radians));
    const bboxH = Math.abs(sensorArcminW * Math.sin(radians)) + Math.abs(sensorArcminH * Math.cos(radians));
    const pad = 1.14;
    const viewW = Math.max(target.arcminW, bboxW, eyepieceArcmin, 0.2) * pad;
    const viewH = Math.max(target.arcminH, bboxH, eyepieceArcmin, 0.2) * pad;
    return { viewW, viewH };
  }, [eyepieceArcmin, rotationDeg, sensorArcminH, sensorArcminW, target.arcminH, target.arcminW]);

  const { viewW, viewH } = scene;
  const cx = viewW / 2;
  const cy = viewH / 2;
  const sensorX = cx - sensorArcminW / 2;
  const sensorY = cy - sensorArcminH / 2;
  const bar = scaleBar(viewW);
  const showInset = target.arcminW / viewW < 0.08;
  const sensorOpacity = showSensor ? (emphasize === "camera" ? 1 : 0.55) : 0;
  const eyeOpacity = showEyepiece ? (emphasize === "visual" ? 1 : 0.55) : 0;

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-cyan-500/30 bg-black"
      style={{ aspectRatio: `${viewW} / ${viewH}` }}
    >
      <div
        className="absolute"
        style={{
          width: `${(target.arcminW / viewW) * 100}%`,
          height: `${(target.arcminH / viewH) * 100}%`,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <img
          src={target.image}
          alt={target.alt}
          className={`h-full w-full ${target.fit === "contain" ? "object-contain" : "object-cover"}`}
        />
      </div>
      <svg viewBox={`0 0 ${viewW} ${viewH}`} className="absolute inset-0 h-full w-full" role="img" aria-label={`${target.name} framing preview`}>
        <g opacity={sensorOpacity} transform={`rotate(${rotationDeg} ${cx} ${cy})`}>
          <rect
            x={sensorX}
            y={sensorY}
            width={sensorArcminW}
            height={sensorArcminH}
            fill="rgba(251, 191, 36, 0.08)"
            stroke="#fbbf24"
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
          />
        </g>
        <circle
          cx={cx}
          cy={cy}
          r={eyepieceArcmin / 2}
          fill="none"
          stroke="#67e8f9"
          strokeWidth={2}
          strokeDasharray="5 4"
          vectorEffect="non-scaling-stroke"
          opacity={eyeOpacity}
        />
        <line x1={cx - viewW * 0.015} y1={cy} x2={cx + viewW * 0.015} y2={cy} stroke="white" strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
        <line x1={cx} y1={cy - viewH * 0.02} x2={cx} y2={cy + viewH * 0.02} stroke="white" strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
        <line
          x1={viewW * 0.04}
          y1={viewH * 0.9}
          x2={viewW * 0.04 + bar.arcmin}
          y2={viewH * 0.9}
          stroke="white"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="pointer-events-none absolute left-3 top-3 flex max-w-[70%] flex-col gap-1 text-[10px] font-mono uppercase tracking-wider">
        <span className="w-fit rounded bg-slate-950/80 px-2 py-1 text-amber-200">
          Sensor {sensorArcminW >= 60 ? `${(sensorArcminW / 60).toFixed(2)}°` : `${sensorArcminW.toFixed(1)}′`} ×{" "}
          {sensorArcminH >= 60 ? `${(sensorArcminH / 60).toFixed(2)}°` : `${sensorArcminH.toFixed(1)}′`} · {rotationDeg.toFixed(0)}°
        </span>
        <span className="w-fit rounded bg-slate-950/80 px-2 py-1 text-cyan-200">
          Eyepiece {eyepieceArcmin >= 60 ? `${(eyepieceArcmin / 60).toFixed(2)}°` : `${eyepieceArcmin.toFixed(1)}′`} TFOV
        </span>
      </div>
      <div className="pointer-events-none absolute bottom-3 left-3 rounded bg-slate-950/80 px-2 py-1 font-mono text-[10px] text-white">
        Scale bar {bar.label}
      </div>
      {showInset ? (
        <div className="absolute bottom-3 right-3 w-28 overflow-hidden rounded-xl border border-white/30 bg-black shadow-lg">
          <img src={target.image} alt="" className="h-24 w-full object-cover" />
          <div className="bg-slate-950/90 px-1.5 py-1 text-[9px] leading-tight text-slate-200">
            Enlarged target. The main frame stays at true angular scale.
          </div>
        </div>
      ) : null}
    </div>
  );
}
