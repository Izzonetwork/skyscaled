"use client";

import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Map as MapIcon } from "lucide-react";
import { BORTLE_PRESETS, bortleProfile, formatHours, formatRatio, type BortleClass } from "@/lib/bortle";
import { fetchLightSample, type LightSample } from "@/lib/lightPollution";
import { SKY_SITES, type SkySite } from "@/data/observerPresets";
import { useObserverLocation } from "@/components/observer/ObserverLocation";
import NightSkyPreview from "@/components/observer/NightSkyPreview";

const LightPollutionMapView = dynamic(() => import("@/components/observer/LightPollutionMapView"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-slate-900" />,
});

export default function LightPollutionMap() {
  const { location, setLocation } = useObserverLocation();
  const [sample, setSample] = useState<LightSample | null>(null);
  const [loading, setLoading] = useState(true);
  const [manual, setManual] = useState(false);
  const [slider, setSlider] = useState(21.86);
  const [opacity, setOpacity] = useState(0.68);

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    setManual(false);
    fetchLightSample(location.lat, location.lon).then((next) => {
      if (cancel) return;
      setSample(next);
      setSlider(Math.min(22, Math.max(16.5, next.sqm)));
      setLoading(false);
    });
    return () => {
      cancel = true;
    };
  }, [location.lat, location.lon]);

  const sqm = manual ? slider : (sample?.sqm ?? slider);
  const artificial = manual || !sample?.ok ? undefined : sample.artificialRatio;
  const profile = useMemo(() => bortleProfile(sqm, artificial), [artificial, sqm]);

  function chooseSite(site: SkySite) {
    setLocation({ lat: site.lat, lon: site.lon, label: site.name, source: "preset" });
  }

  function chooseMap(lat: number, lon: number) {
    setLocation({
      lat,
      lon,
      label: `Map selection · ${lat.toFixed(3)}°, ${lon.toFixed(3)}°`,
      source: "map",
    });
  }

  return (
    <section id="light-pollution-map" className="scroll-mt-32 border-t border-slate-800/80 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-violet-200">
            <MapIcon className="h-3.5 w-3.5" />
            VIIRS atlas · Bortle 1–9 · SQM
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Light Pollution &amp; Bortle Dark-Sky Map</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
            Click the map, search a place in Astro Weather, or slide the Sky Quality Meter. Zenith brightness comes from the 2025 Lorenz VIIRS atlas, then the Bortle class, naked-eye limit, and broadband exposure multiplier follow.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="h-[520px] overflow-hidden rounded-3xl border border-violet-400/30">
              <LightPollutionMapView
                lat={location.lat}
                lon={location.lon}
                sites={SKY_SITES}
                opacity={opacity}
                onPick={chooseMap}
                onSite={chooseSite}
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <label className="flex items-center gap-2">
                Overlay opacity
                <input
                  type="range"
                  min={0.15}
                  max={1}
                  step={0.01}
                  value={opacity}
                  onChange={(event) => setOpacity(Number(event.target.value))}
                  className="accent-violet-400"
                />
              </label>
              <span className="font-mono text-slate-400">{Math.round(opacity * 100)}%</span>
              <a
                href="https://djlorenz.github.io/astronomy/lp/colors.html"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-300 underline underline-offset-2"
              >
                Atlas color key
              </a>
            </div>
            <div className="mt-2 flex flex-wrap gap-1 text-[10px] text-slate-400">
              <span className="rounded bg-black px-2 py-0.5 text-slate-200">Dark</span>
              <span className="rounded bg-blue-800 px-2 py-0.5 text-white">Low</span>
              <span className="rounded bg-green-700 px-2 py-0.5 text-white">Rural</span>
              <span className="rounded bg-yellow-500 px-2 py-0.5 text-slate-950">Suburban</span>
              <span className="rounded bg-orange-500 px-2 py-0.5 text-slate-950">Bright</span>
              <span className="rounded bg-rose-500 px-2 py-0.5 text-white">Urban</span>
              <span className="rounded bg-slate-200 px-2 py-0.5 text-slate-950">Inner city</span>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
              Gold pins are observatory presets shared with Astro Weather. Violet pins are dark-sky reserves. The cyan marker is the inspector.
              {loading ? " Sampling the atlas…" : ""}
            </p>
          </div>

          <div className="space-y-4 lg:col-span-5">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
              <div className="text-xs font-mono uppercase tracking-wider text-violet-200">
                {location.label} · {location.lat.toFixed(3)}°, {location.lon.toFixed(3)}°
              </div>
              <div className="mt-2 flex items-end justify-between gap-3">
                <div>
                  <div className="text-4xl font-black text-white">Bortle {profile.bortle}</div>
                  <div className="text-sm text-slate-300">{profile.title}</div>
                </div>
                <div className="text-right font-mono text-sm text-cyan-200">
                  {profile.sqm.toFixed(2)}
                  <div className="text-[10px] text-slate-400">mag/arcsec²</div>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-300">{profile.appearance}</p>
              <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
                  <dt className="text-slate-400">NELM</dt>
                  <dd className="font-bold text-white">{profile.nelm.toFixed(1)} mag</dd>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
                  <dt className="text-slate-400">Artificial / natural</dt>
                  <dd className="font-bold text-white">{formatRatio(profile.artificialRatio)}×</dd>
                </div>
                <div className="col-span-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
                  <dt className="text-slate-400">Total zenith vs 22.00 mag/arcsec²</dt>
                  <dd className="font-bold text-white">{formatRatio(profile.totalRatio)}× the natural night sky</dd>
                </div>
              </dl>
              <p className="mt-3 text-[11px] leading-relaxed text-slate-400">{sample?.message}</p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
              <label htmlFor="sqm-slider" className="text-xs font-semibold text-slate-200">
                Sky Quality Meter · 22.00 to 17.50 mag/arcsec²
              </label>
              <input
                id="sqm-slider"
                type="range"
                min={16.5}
                max={22}
                step={0.01}
                value={slider}
                onChange={(event) => {
                  setManual(true);
                  setSlider(Number(event.target.value));
                }}
                className="mt-3 w-full accent-violet-400"
              />
              <div className="mt-1 flex justify-between font-mono text-[10px] text-slate-500">
                <span>22.00</span>
                <span>21.00</span>
                <span>19.50</span>
                <span>17.50</span>
                <span>16.50</span>
              </div>
              <p className="mt-2 text-[11px] text-slate-400">
                {manual
                  ? `Slider override ${slider.toFixed(2)}. The atlas sample remains ${sample ? sample.sqm.toFixed(2) : "—"}.`
                  : "The slider follows the atlas until it is moved. The track extends to 16.50 so inner-city readings stay on the scale."}
              </p>
              <div className="mt-3 grid grid-cols-9 gap-1">
                {BORTLE_PRESETS.map((item) => (
                  <button
                    key={item.bortle}
                    type="button"
                    onClick={() => {
                      setManual(true);
                      setSlider(item.sqm);
                    }}
                    className={`cursor-pointer rounded-lg border py-2 text-xs font-bold ${
                      profile.bortle === item.bortle
                        ? "border-cyan-300 bg-cyan-400 text-slate-950"
                        : "border-slate-700 text-slate-200"
                    }`}
                  >
                    {item.bortle}
                  </button>
                ))}
              </div>
            </div>

            <NightSkyPreview bortle={profile.bortle} sqm={profile.sqm} nelm={profile.nelm} />
            <p className="text-[11px] leading-relaxed text-slate-400">
              Simulated zenith view of Orion and the winter Milky Way. Star count follows the naked-eye limit. The orange dome is horizon skyglow. It is a class illustration, not a planetarium.
            </p>

            <div className="rounded-3xl border border-amber-400/30 bg-amber-500/10 p-4">
              <div className="text-xs font-mono uppercase tracking-wider text-amber-200">Integration time vs Bortle 2</div>
              <div className="mt-1 text-2xl font-black text-white">{formatHours(profile.hoursVsBortle2)} broadband</div>
              <p className="mt-1 text-sm leading-relaxed text-amber-50">
                {formatHours(profile.hoursVsBortle2)} of broadband integration here matches 1 hour at SQM {21.94.toFixed(2)} (Bortle 2). Sky-noise-limited time scales with sky brightness.
              </p>
              <div className="mt-3 text-sm font-bold text-white">{profile.filter}</div>
              <p className="mt-1 text-xs leading-relaxed text-slate-200">{profile.filterDetail}</p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full min-w-[28rem] text-left text-xs">
                <thead className="bg-slate-950 text-[10px] uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-2 py-2">Class</th>
                    <th className="px-2 py-2">SQM</th>
                    <th className="px-2 py-2">NELM</th>
                    <th className="px-2 py-2">Hours / 1 h B2</th>
                    <th className="px-2 py-2">Filter</th>
                  </tr>
                </thead>
                <tbody>
                  {BORTLE_PRESETS.map((item) => {
                    const row = bortleProfile(item.sqm);
                    const active = row.bortle === profile.bortle;
                    return (
                      <tr key={item.bortle} className={active ? "bg-cyan-400/15 text-white" : "text-slate-300"}>
                        <td className="px-2 py-1.5 font-bold">{row.bortle as BortleClass}</td>
                        <td className="px-2 py-1.5 font-mono">{row.sqm.toFixed(2)}</td>
                        <td className="px-2 py-1.5 font-mono">{row.nelm.toFixed(1)}</td>
                        <td className="px-2 py-1.5 font-mono">{formatHours(row.hoursVsBortle2)}</td>
                        <td className="px-2 py-1.5">{row.filter}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
