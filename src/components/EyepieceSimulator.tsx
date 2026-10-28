"use client";

import React from "react";
import type { VisualKind } from "@/data/telescopeCalendar";

export type SimulatorMode = "eyepiece" | "camera" | "reference";

const MODES: { id: SimulatorMode; label: string }[] = [
  { id: "eyepiece", label: "Eyepiece Simulator" },
  { id: "camera", label: "Long-Exposure Astro-Camera" },
  { id: "reference", label: "NASA/Webb Reference" },
];

function formatField(arcmin: number): string {
  if (arcmin >= 60) {
    const degrees = arcmin / 60;
    return degrees >= 10 ? `${degrees.toFixed(0)}°` : `${degrees.toFixed(1)}°`;
  }
  if (arcmin >= 10) return `${Math.round(arcmin)}′`;
  return `${arcmin.toFixed(1)}′`;
}

function eyepieceFilter(kind: VisualKind): string {
  if (kind === "planet" || kind === "eclipse-moon") return "saturate(0.9) contrast(1.12) brightness(0.95)";
  if (kind === "eclipse-sun") return "saturate(1.05) contrast(1.15)";
  if (kind === "meteor" || kind === "cluster") return "saturate(0.55) contrast(1.15) brightness(0.8)";
  return "grayscale(0.72) sepia(0.35) contrast(1.25) brightness(0.72)";
}

export default function EyepieceSimulator({
  mode,
  onModeChange,
  image,
  alt,
  credit,
  fovArcmin,
  objectArcmin,
  visualKind,
  targetName,
}: {
  mode: SimulatorMode;
  onModeChange: (mode: SimulatorMode) => void;
  image: string;
  alt: string;
  credit: string;
  fovArcmin: number;
  objectArcmin: number;
  visualKind: VisualKind;
  targetName: string;
}) {
  const fill = Math.max(0.08, Math.min(1, objectArcmin / fovArcmin));
  const fieldLabel = formatField(fovArcmin);
  const objectLabel = formatField(objectArcmin);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Target view mode">
        {MODES.map((item) => {
          const active = item.id === mode;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onModeChange(item.id)}
              className={`cursor-pointer rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                active
                  ? "border-cyan-300 bg-cyan-400 text-slate-950"
                  : "border-slate-700 bg-slate-950/80 text-slate-300 hover:border-cyan-500/40 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="relative mt-3 overflow-hidden rounded-2xl border border-cyan-500/30 bg-black">
        {mode === "eyepiece" ? (
          <div className="relative flex aspect-square items-center justify-center bg-[radial-gradient(circle_at_center,#020617_0%,#000_72%)] sm:aspect-[5/4]">
            <div className="relative aspect-square h-[86%] max-h-full">
              <div className="absolute inset-[6%] overflow-hidden rounded-full bg-black shadow-[inset_0_0_40px_rgba(0,0,0,0.85)]">
                <img
                  src={image}
                  alt={alt}
                  className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 object-cover"
                  style={{
                    width: `${fill * 100}%`,
                    height: `${fill * 100}%`,
                    filter: eyepieceFilter(visualKind),
                  }}
                />
              </div>
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
                <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(103,232,249,0.85)" strokeWidth="0.6" />
                <circle cx="50" cy="50" r="29" fill="none" stroke="rgba(103,232,249,0.35)" strokeWidth="0.35" />
                <circle cx="50" cy="50" r="15" fill="none" stroke="rgba(103,232,249,0.35)" strokeWidth="0.35" />
                <line x1="50" y1="4" x2="50" y2="96" stroke="rgba(103,232,249,0.55)" strokeWidth="0.35" />
                <line x1="4" y1="50" x2="96" y2="50" stroke="rgba(103,232,249,0.55)" strokeWidth="0.35" />
                <circle cx="50" cy="50" r="1.1" fill="none" stroke="#fde68a" strokeWidth="0.45" />
                <text x="73" y="49" fill="#a5f3fc" fontSize="3.2" fontFamily="ui-monospace, monospace">
                  {fieldLabel}
                </text>
              </svg>
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-wider text-cyan-100">
              <span className="rounded bg-slate-950/80 px-2 py-1">Field {fieldLabel}</span>
              <span className="rounded bg-slate-950/80 px-2 py-1">Object {objectLabel}</span>
            </div>
          </div>
        ) : null}

        {mode === "camera" ? (
          <div className="relative aspect-[4/3] bg-slate-950">
            <img
              src={image}
              alt={alt}
              className="h-full w-full object-cover"
              style={{ filter: "saturate(1.18) contrast(1.06)" }}
            />
            <div className="pointer-events-none absolute inset-3 border border-cyan-200/50">
              <span className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-amber-300" />
              <span className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-amber-300" />
              <span className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-amber-300" />
              <span className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-amber-300" />
            </div>
            <div className="absolute left-3 top-3 rounded bg-slate-950/80 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-amber-200">
              Long-exposure stack · {targetName}
            </div>
          </div>
        ) : null}

        {mode === "reference" ? (
          <div className="relative aspect-[4/3] bg-slate-950">
            <img src={image} alt={alt} className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent px-4 pb-3 pt-10">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-300">NASA / ESA / Webb reference</div>
              <p className="mt-1 text-xs leading-relaxed text-slate-200">{credit}</p>
            </div>
          </div>
        ) : null}
      </div>

      {mode !== "reference" ? (
        <p className="mt-2 text-[11px] leading-relaxed text-slate-400">{credit}</p>
      ) : null}
      {visualKind === "eclipse-sun" ? (
        <p className="mt-2 rounded-xl border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-xs leading-relaxed text-amber-100">
          Solar filters stay on for the entire eclipse, including annularity. A certified full-aperture filter belongs on the front of the telescope. The photosphere remains exposed at magnitude 0.928.
        </p>
      ) : null}
    </div>
  );
}
