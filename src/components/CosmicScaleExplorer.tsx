"use client";

import React, { useState } from "react";
import { COSMIC_SCALE_STOPS, CHANNEL_INFO } from "@/data/skyscaledData";
import { Compass, ExternalLink, Sparkles, Gauge, Play } from "lucide-react";

type ScalePreset = {
  id: "sand" | "marble" | "plate";
  label: string;
  earthSizeLabel: string;
  multiplier: number;
  description: string;
};

const SCALE_PRESETS: ScalePreset[] = [
  {
    id: "sand",
    label: "Earth = 1 mm Grain of Sand",
    earthSizeLabel: "1.0 mm",
    multiplier: 1,
    description:
      "The signature Skyscaled pilot scale: 1 millimeter equals 12,742 kilometers (1 : 1.274 × 10¹⁰).",
  },
  {
    id: "marble",
    label: "Earth = 1 cm Glass Marble",
    earthSizeLabel: "10.0 mm",
    multiplier: 10,
    description:
      "10x larger than the grain-of-sand model: the Sun becomes a 1.09-meter beach ball 117 meters away.",
  },
  {
    id: "plate",
    label: "Milky Way = 25 cm Dinner Plate",
    earthSizeLabel: "Sub-atomic",
    multiplier: 0.0001,
    description:
      "Galactic neighborhood scale from Episode 03: shrink our 100,000-light-year galaxy to a 25 cm dinner plate, and Andromeda (M31) is another dinner plate 6 meters across the room.",
  },
];

function formatScaledDistance(realKm: number, presetId: "sand" | "marble" | "plate"): string {
  if (realKm === 0) return "0 mm (Origin)";
  if (presetId === "plate") {
    const lightYears = realKm / 9.4607e12;
    const plateMeters = (lightYears / 100000) * 0.25;
    if (plateMeters < 0.000001) return "< 1 nanometer on plate scale";
    if (plateMeters < 0.01) return `${(plateMeters * 1000).toFixed(3)} mm on plate scale`;
    if (plateMeters < 1000) return `${plateMeters.toFixed(2)} meters from Milky Way plate`;
    return `${(plateMeters / 1000).toFixed(1)} km from Milky Way plate`;
  }

  const earthDiameterKm = 12742;
  const scaleMm = (realKm / earthDiameterKm) * (presetId === "sand" ? 1 : 10);

  if (scaleMm < 1000) {
    return `${ (scaleMm / 10).toFixed(1) } cm`;
  }
  const scaleMeters = scaleMm / 1000;
  if (scaleMeters < 1000) {
    return `${scaleMeters.toFixed(1)} meters`;
  }
  const scaleKm = scaleMeters / 1000;
  if (scaleKm < 1e6) {
    return `${scaleKm.toLocaleString("en-US", { maximumFractionDigits: 1 })} km`;
  }
  if (scaleKm < 1e9) {
    return `${(scaleKm / 1e6).toFixed(2)} million km`;
  }
  const scaleLy = scaleKm / 9.4607e12;
  if (scaleLy >= 0.1) {
    return `${scaleLy.toFixed(2)} light-years`;
  }
  return `${(scaleKm / 1e9).toFixed(2)} billion km`;
}

export default function CosmicScaleExplorer() {
  const [selectedIndex, setSelectedIndex] = useState<number>(3); // Default to Voyager 1 at 1 Light-Day
  const [presetId, setPresetId] = useState<"sand" | "marble" | "plate">("sand");

  const activeStop = COSMIC_SCALE_STOPS[selectedIndex];
  const activePreset = SCALE_PRESETS.find((p) => p.id === presetId) || SCALE_PRESETS[0];

  return (
    <section
      id="scale-explorer"
      className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <div className="rounded-3xl border border-cyan-500/25 bg-slate-950/90 backdrop-blur-xl p-6 sm:p-10 shadow-[0_0_80px_-20px_rgba(6,182,212,0.25)]">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-slate-800/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold uppercase tracking-widest mb-3">
              <Compass className="w-3.5 h-3.5" />
              Interactive Cosmic Scale Explorer
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Shrink Earth to a 1 mm Grain of Sand
            </h2>
            <p className="mt-2 text-slate-300 max-w-2xl text-sm sm:text-base leading-relaxed">
              Astronomical distances in kilometers lose human meaning past low Earth orbit. Choose a cosmic landmark below and switch physical reference models to see how far light and spacecraft travel.
            </p>
          </div>

          {/* Preset switcher */}
          <div className="flex flex-wrap gap-2">
            {SCALE_PRESETS.map((preset) => {
              const active = preset.id === presetId;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setPresetId(preset.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer border ${
                    active
                      ? "bg-cyan-500 text-slate-950 border-cyan-400 font-semibold shadow-lg shadow-cyan-500/25"
                      : "bg-slate-900/90 text-slate-300 border-slate-800 hover:border-cyan-500/40 hover:text-white"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        <p className="mt-4 text-xs sm:text-sm text-cyan-300/90 font-mono bg-cyan-950/30 border border-cyan-500/20 rounded-xl px-4 py-2.5">
          Active Model: {activePreset.description}
        </p>

        {/* Stop Selector Track */}
        <div className="mt-8">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">
            <span>Select Cosmic Milestone ({selectedIndex + 1} of {COSMIC_SCALE_STOPS.length})</span>
            <span>Logarithmic Distance Ladder</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2">
            {COSMIC_SCALE_STOPS.map((stop, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={stop.id}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  className={`flex flex-col justify-between p-3 rounded-xl text-left transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-gradient-to-br from-cyan-500/25 via-blue-600/20 to-indigo-900/30 border-cyan-400 text-white shadow-md shadow-cyan-500/15"
                      : "bg-slate-900/70 border-slate-800/90 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                    Stop 0{idx + 1}
                  </span>
                  <span className="mt-1 text-xs font-bold leading-snug line-clamp-2">
                    {stop.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Range Slider */}
          <div className="mt-5 px-1">
            <input
              type="range"
              min={0}
              max={COSMIC_SCALE_STOPS.length - 1}
              value={selectedIndex}
              onChange={(e) => setSelectedIndex(Number(e.target.value))}
              aria-label="Cosmic scale distance slider"
              className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Active Stop Readout Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 rounded-2xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                  {activeStop.subtitle}
                </span>
                <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-800 text-slate-300">
                  Diameter: {activeStop.realDiameterKm}
                </span>
              </div>
              <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-white">
                {activeStop.name}
              </h3>
              <p className="mt-4 text-slate-200 text-sm sm:text-base leading-relaxed bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
                <Sparkles className="w-4 h-4 text-amber-400 inline mr-2 -mt-0.5" />
                {activeStop.keyFact}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
              <a
                href={activeStop.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
              >
                Primary Source: {activeStop.sourceLabel}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://youtu.be/nmhP2Z7zKN8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Watch Pilot Explainer on YouTube {CHANNEL_INFO.youtubeHandle}
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
            <div className="rounded-2xl bg-slate-900/90 border border-cyan-500/30 p-4">
              <div className="text-xs font-mono uppercase tracking-wider text-cyan-300">
                Scaled Distance ({activePreset.label})
              </div>
              <div className="mt-1 text-xl sm:text-2xl font-extrabold text-white">
                {presetId === "sand"
                  ? activeStop.sandScaleDistance
                  : formatScaledDistance(activeStop.realDistanceKm, presetId)}
              </div>
              <div className="mt-1 text-xs text-slate-400">
                Object size on 1 mm Earth scale: <span className="text-slate-200 font-medium">{activeStop.sandScaleSize}</span>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4">
              <div className="text-xs font-mono uppercase tracking-wider text-amber-300">
                Light-Travel Time (at 299,792 km/s)
              </div>
              <div className="mt-1 text-lg sm:text-xl font-bold text-white">
                {activeStop.lightTravelTime}
              </div>
              <div className="mt-1 text-xs text-slate-400">
                Unscaled Distance: {activeStop.realDistanceLabel}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4">
              <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-indigo-300">
                <Gauge className="w-3.5 h-3.5" />
                Voyager 1 Interstellar Transit (~17 km/s)
              </div>
              <div className="mt-1 text-base sm:text-lg font-bold text-white">
                {activeStop.voyagerTravelTime}
              </div>
              <div className="mt-1 text-xs text-slate-400">
                Reference: Voyager 1 crosses 1 light-day on November 18, 2026 at 10:16:07 UTC
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
