"use client";

import React, { useState } from "react";
import { OBSERVATORY_GALLERY } from "@/data/skyscaledData";
import { Telescope } from "lucide-react";
import SpaceFrame from "@/components/SpaceFrame";

export default function ObservatoryGallery() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const activeIndex = hoverIndex ?? selectedIndex;
  const frame = OBSERVATORY_GALLERY[activeIndex];

  return (
    <section id="observatory" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <hr className="section-divider mb-16" />
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="telemetry-chip mb-3 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
              <Telescope className="h-3.5 w-3.5" />
              Deep Space Observatory Gallery
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Iconic Frames, Measured to Scale
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-200 sm:text-base">
              Public-domain NASA, ESA, CSA, and STScI photography, plus Event Horizon Telescope images credited CC BY 4.0. Every frame lists a distance, a light-travel time, the instrument, and a human-scale fact.
            </p>
          </div>
          <div className="telemetry-chip rounded-xl border border-cyan-400/30 bg-slate-950/70 px-3 py-2 text-[11px] text-cyan-100">
            {hoverIndex === null ? "Selected frame" : "Hover preview"} • {String(activeIndex + 1).padStart(2, "0")} / {String(OBSERVATORY_GALLERY.length).padStart(2, "0")}
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="hud-card min-w-0 rounded-3xl p-3 sm:p-4 lg:col-span-7">
            <SpaceFrame
              src={frame.image}
              alt={frame.imageAlt}
              credit={frame.credit}
              kicker={frame.instrument}
              fit={frame.imageFit ?? "cover"}
              className="aspect-[16/10] rounded-2xl"
              priority={activeIndex === 0}
            />
            <div className="px-2 pb-2 pt-4">
              <h3 className="text-2xl font-bold text-white">{frame.title}</h3>
              <p className="mt-3 rounded-xl border border-slate-700/80 bg-slate-950/80 p-4 text-sm leading-relaxed text-slate-100">
                {frame.scaleFact}
              </p>
              <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-cyan-400/25 bg-slate-950/80 p-3">
                  <dt className="telemetry-chip text-[10px] text-cyan-200">Distance</dt>
                  <dd className="mt-1 text-sm font-semibold text-white">{frame.distanceLabel}</dd>
                </div>
                <div className="rounded-xl border border-amber-300/25 bg-slate-950/80 p-3">
                  <dt className="telemetry-chip text-[10px] text-amber-200">Light-travel time</dt>
                  <dd className="mt-1 text-sm font-semibold text-white">{frame.lightTravel}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-2">
            {OBSERVATORY_GALLERY.map((item, index) => {
              const selected = index === selectedIndex;
              const previewing = index === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                  onFocus={() => setHoverIndex(index)}
                  onBlur={() => setHoverIndex(null)}
                  className={`overflow-hidden rounded-2xl border text-left transition ${
                    previewing
                      ? "border-cyan-300 shadow-lg shadow-cyan-500/20"
                      : "border-slate-700/80 hover:border-cyan-400/40"
                  } ${selected ? "ring-1 ring-amber-300/60" : ""}`}
                >
                  <img
                    src={item.image}
                    alt=""
                    className={`h-24 w-full sm:h-28 ${item.imageFit === "contain" ? "object-contain bg-slate-950" : "object-cover"}`}
                    loading="lazy"
                  />
                  <span className="block bg-slate-950/90 px-2.5 py-2 text-[11px] font-semibold leading-snug text-slate-100">
                    {item.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
