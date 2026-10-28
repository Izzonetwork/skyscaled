"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Cloud, Droplets, LocateFixed, Search, Wind } from "lucide-react";
import { OBSERVATORY_SITES } from "@/data/observerPresets";
import {
  type ForecastModel,
  type HourPoint,
  type Verdict,
  illustrateForecast,
  matrixSlice,
  openMeteoForecastUrl,
  parseOpenMeteo,
} from "@/lib/astroWeather";
import { reversePlaceLabel, useObserverLocation } from "@/components/observer/ObserverLocation";

type GeoHit = {
  id: number;
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
};

function verdictClass(verdict: Verdict | null): string {
  if (verdict === "Prime Imaging Window") return "bg-emerald-400 text-slate-950";
  if (verdict === "Visual / Narrowband Only") return "bg-amber-400 text-slate-950";
  return "bg-rose-500 text-white";
}

function cloudClass(value: number): string {
  if (value <= 15) return "bg-emerald-500 text-slate-950";
  if (value <= 35) return "bg-lime-400 text-slate-950";
  if (value <= 55) return "bg-yellow-300 text-slate-950";
  if (value <= 75) return "bg-orange-500 text-slate-950";
  return "bg-rose-600 text-white";
}

function seeingClass(score: number): string {
  if (score >= 4.5) return "bg-emerald-500 text-slate-950";
  if (score >= 3.5) return "bg-lime-400 text-slate-950";
  if (score >= 2.5) return "bg-yellow-300 text-slate-950";
  if (score >= 1.5) return "bg-orange-500 text-slate-950";
  return "bg-rose-600 text-white";
}

function transparencyClass(mag: number): string {
  if (mag >= 6.2) return "bg-emerald-500 text-slate-950";
  if (mag >= 5.5) return "bg-lime-400 text-slate-950";
  if (mag >= 4.5) return "bg-yellow-300 text-slate-950";
  if (mag >= 3.5) return "bg-orange-500 text-slate-950";
  return "bg-rose-600 text-white";
}

function dewClass(delta: number): string {
  if (delta <= 2.5) return "bg-rose-600 text-white";
  if (delta <= 5) return "bg-amber-400 text-slate-950";
  return "bg-emerald-500 text-slate-950";
}

function windClass(kmh: number): string {
  if (kmh < 15) return "bg-emerald-500 text-slate-950";
  if (kmh < 25) return "bg-lime-400 text-slate-950";
  if (kmh < 35) return "bg-yellow-300 text-slate-950";
  if (kmh < 45) return "bg-orange-500 text-slate-950";
  return "bg-rose-600 text-white";
}

function scoreClass(score: number): string {
  if (score >= 72) return "bg-emerald-500 text-slate-950";
  if (score >= 40) return "bg-amber-400 text-slate-950";
  return "bg-rose-600 text-white";
}

function fmt(value: number | null, digits = 0): string {
  if (value == null || !Number.isFinite(value)) return "—";
  return value.toFixed(digits);
}

export default function AstroWeather() {
  const { location, setLocation } = useObserverLocation();
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<GeoHit[]>([]);
  const [searchNote, setSearchNote] = useState("");
  const [latInput, setLatInput] = useState(location.lat.toFixed(4));
  const [lonInput, setLonInput] = useState(location.lon.toFixed(4));
  const [model, setModel] = useState<ForecastModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [geoNote, setGeoNote] = useState("");

  useEffect(() => {
    setLatInput(location.lat.toFixed(4));
    setLonInput(location.lon.toFixed(4));
  }, [location.lat, location.lon]);

  useEffect(() => {
    const controller = new AbortController();
    const term = query.trim();
    if (term.length < 2) {
      setHits([]);
      setSearchNote("");
      return () => controller.abort();
    }
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(term)}&count=5&language=en&format=json`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error("search failed");
        const payload = (await response.json()) as { results?: GeoHit[] };
        const results = payload.results ?? [];
        setHits(results);
        setSearchNote(results.length ? "" : "No matching place in the Open-Meteo gazetteer.");
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        setHits([]);
        setSearchNote("Place search is unreachable.");
      }
    }, 280);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    const fetchedAt = Date.now();
    fetch(openMeteoForecastUrl(location.lat, location.lon), { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = await response.json();
        setModel(parseOpenMeteo(payload, fetchedAt));
      })
      .catch((error: Error) => {
        if (error.name === "AbortError") return;
        setModel(illustrateForecast(location.lat, location.lon, fetchedAt));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [location.lat, location.lon]);

  const hours = useMemo(() => (model ? matrixSlice(model, 48) : []), [model]);
  const reference = model ? model.hours[model.referenceIndex] : null;
  const dewCount = hours.filter((hour) => hour.dewRisk).length;

  function applyCoordinates() {
    const lat = Number(latInput);
    const lon = Number(lonInput);
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      setGeoNote("Enter latitude from -90 to 90 and longitude from -180 to 180.");
      return;
    }
    setGeoNote("");
    setLocation({
      lat,
      lon,
      label: `${lat.toFixed(4)}°, ${lon.toFixed(4)}°`,
      source: "manual",
    });
    void reversePlaceLabel(lat, lon).then((label) => {
      if (!label) return;
      setLocation({ lat, lon, label, source: "manual" });
    });
  }

  function useBrowserLocation() {
    if (!navigator.geolocation) {
      setGeoNote("Geolocation is unavailable in this browser.");
      return;
    }
    setGeoNote("Requesting a position fix…");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setLocation({ lat, lon, label: "Browser geolocation", source: "geolocation" });
        setGeoNote("");
        void reversePlaceLabel(lat, lon).then((label) => {
          if (!label) return;
          setLocation({ lat, lon, label, source: "geolocation" });
        });
      },
      (error) => setGeoNote(error.message || "The browser declined the location request."),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 },
    );
  }

  return (
    <section id="astro-weather" className="scroll-mt-32 border-t border-slate-800/80 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-sky-200">
              <Cloud className="h-3.5 w-3.5" />
              Open-Meteo · Hourly astronomical forecast
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Live Astro Weather Forecast</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
              Cloud layers, a jet-stream seeing index, transparency, dew-point spread, and a go / no-go imaging score for any coordinates. The same pin drives the light-pollution map.
            </p>
          </div>
          {reference?.verdict ? (
            <div className={`rounded-2xl px-4 py-3 text-sm font-extrabold ${verdictClass(reference.verdict)}`}>{reference.verdict}</div>
          ) : null}
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
            <div className="relative lg:col-span-5">
              <label className="mb-1 block text-xs font-semibold text-slate-300" htmlFor="place-search">
                City search
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  id="place-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Tucson, Nairobi, Reykjavík"
                  className="w-full bg-transparent py-2.5 text-sm text-white outline-none"
                />
              </div>
              {hits.length > 0 ? (
                <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-xl">
                  {hits.map((hit) => (
                    <button
                      key={hit.id}
                      type="button"
                      onClick={() => {
                        setLocation({
                          lat: hit.latitude,
                          lon: hit.longitude,
                          label: [hit.name, hit.admin1, hit.country].filter(Boolean).join(", "),
                          source: "search",
                        });
                        setQuery("");
                        setHits([]);
                      }}
                      className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-900"
                    >
                      {[hit.name, hit.admin1, hit.country].filter(Boolean).join(", ")}
                      <span className="mt-0.5 block font-mono text-[10px] text-slate-500">
                        {hit.latitude.toFixed(2)}°, {hit.longitude.toFixed(2)}°
                      </span>
                    </button>
                  ))}
                </div>
              ) : null}
              {searchNote ? <p className="mt-1 text-[11px] text-slate-400">{searchNote}</p> : null}
            </div>
            <div className="grid grid-cols-2 gap-2 lg:col-span-4">
              <label className="text-xs font-semibold text-slate-300">
                Latitude
                <input
                  type="number"
                  value={latInput}
                  step="0.0001"
                  onChange={(event) => setLatInput(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm text-white"
                />
              </label>
              <label className="text-xs font-semibold text-slate-300">
                Longitude
                <input
                  type="number"
                  value={lonInput}
                  step="0.0001"
                  onChange={(event) => setLonInput(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm text-white"
                />
              </label>
            </div>
            <div className="flex flex-col gap-2 lg:col-span-3">
              <button type="button" onClick={applyCoordinates} className="cursor-pointer rounded-xl bg-cyan-400 px-3 py-2 text-sm font-bold text-slate-950">
                Use coordinates
              </button>
              <button
                type="button"
                onClick={useBrowserLocation}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-cyan-500/40 px-3 py-2 text-sm font-semibold text-cyan-100"
              >
                <LocateFixed className="h-4 w-4" />
                Use My Current Location
              </button>
            </div>
          </div>
          {geoNote ? <p className="mt-2 text-xs text-amber-200">{geoNote}</p> : null}

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {OBSERVATORY_SITES.map((site) => (
              <button
                key={site.id}
                type="button"
                onClick={() => setLocation({ lat: site.lat, lon: site.lon, label: site.name, source: "preset" })}
                className={`shrink-0 cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  location.label === site.name
                    ? "border-cyan-300 bg-cyan-400 text-slate-950"
                    : "border-slate-700 bg-slate-950 text-slate-200"
                }`}
              >
                {site.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 font-mono text-xs text-cyan-200">
          {location.label} · {location.lat.toFixed(4)}°, {location.lon.toFixed(4)}°
          {model ? ` · ${model.timezone} (${model.offsetLabel})` : ""}
          {model?.elevationM != null ? ` · elevation ${Math.round(model.elevationM)} m` : ""}
          {model ? ` · fetched ${model.fetchedAtUtc}` : ""}
        </div>
        {model?.message ? (
          <p className="mt-3 rounded-xl border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">{model.message}</p>
        ) : null}
        {loading ? <p className="mt-4 text-sm text-slate-400">Fetching the Open-Meteo hourly series…</p> : null}

        {reference && model ? (
          <>
            <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-6">
              <Metric icon={<Cloud className="h-4 w-4" />} label="Total cloud" value={`${fmt(reference.cloud)}%`} detail={`H ${fmt(reference.cloudHigh)} · M ${fmt(reference.cloudMid)} · L ${fmt(reference.cloudLow)}`} />
              <Metric icon={<Wind className="h-4 w-4" />} label="Seeing" value={reference.seeingScore == null ? "—" : `${Math.round(reference.seeingScore)}/5 ${reference.seeingLabel}`} detail={reference.seeingArcsec == null ? "Jet stream unavailable" : `${reference.seeingArcsec.toFixed(1)}″ estimate · jet ${fmt(reference.jetMs, 1)} m/s`} />
              <Metric icon={<Cloud className="h-4 w-4" />} label="Transparency" value={reference.transparencyMag == null ? "—" : `${reference.transparencyMag.toFixed(1)} mag`} detail={reference.transparencyLabel} />
              <Metric icon={<Droplets className="h-4 w-4" />} label="Dew ΔT" value={reference.dewDeltaC == null ? "—" : `${reference.dewDeltaC.toFixed(1)}°C`} detail={reference.dewRisk ? "Dew-heater strap" : `${fmt(reference.temperatureC, 1)}°C air · dew ${fmt(reference.dewPointC, 1)}°C`} />
              <Metric icon={<Wind className="h-4 w-4" />} label="Ground wind" value={reference.windKmh == null ? "—" : `${reference.windKmh.toFixed(0)} km/h`} detail={reference.windMph == null ? "" : `${reference.windMph.toFixed(0)} mph · gust ${fmt(reference.gustKmh, 0)} km/h`} />
              <Metric icon={<Cloud className="h-4 w-4" />} label="Imaging score" value={reference.score == null ? "—" : `${Math.round(reference.score)}`} detail={reference.verdict ?? ""} />
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Reference hour {model.hours[model.referenceIndex] ? new Date(model.hours[model.referenceIndex].utcMs).toISOString().slice(0, 16).replace("T", " ") : ""} UTC
              {reference.isNight ? " · Sun below the horizon." : " · Sun above the horizon. The score still describes the air mass."}
              {reference.windKmh != null && reference.windKmh >= 30 ? " Ground wind is high enough to shake a long-focal-length mount." : ""}
              {dewCount > 0 ? ` Dew-heater alert on ${dewCount} of the next 48 hours (ΔT ≤ 2.5°C).` : " Dew spread stays above 2.5°C across the 48-hour matrix."}
            </p>

            <h3 className="mt-8 text-lg font-bold text-white">48-hour matrix</h3>
            <p className="mt-1 text-xs text-slate-400">
              {hours[0] ? `${hours[0].utcDateKey} ${hours[0].utcHour} UTC` : ""}
              {hours.length ? ` through ${hours[hours.length - 1].utcDateKey} ${hours[hours.length - 1].utcHour} UTC` : ""}. Local clock is {model.timezone}. Night columns are marked.
            </p>
            <HourMatrix hours={hours} />

            <h3 className="mt-8 text-lg font-bold text-white">7-night observing forecast</h3>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {model.nights.length === 0 ? <p className="text-sm text-slate-400">The series did not include a dark interval.</p> : null}
              {model.nights.map((night) => (
                <article key={night.id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-white">{night.label}</div>
                      <div className="mt-1 font-mono text-[10px] text-slate-400">
                        {night.startUtc} – {night.endUtc}
                      </div>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${verdictClass(night.verdict)}`}>{night.verdict}</span>
                  </div>
                  <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-300">
                    <div>Mean score <strong className="text-white">{night.meanScore.toFixed(0)}</strong></div>
                    <div>Mean cloud <strong className="text-white">{night.meanCloud.toFixed(0)}%</strong></div>
                    <div>Mean seeing <strong className="text-white">{night.meanSeeing.toFixed(1)}/5</strong></div>
                    <div>Dew hours <strong className="text-white">{night.dewHours}</strong></div>
                    <div className="col-span-2">
                      Best window <strong className="text-white">{night.bestWindowLabel}</strong> · {night.bestWindowScore.toFixed(0)}
                    </div>
                    <div className="col-span-2">Peak wind <strong className="text-white">{night.maxWindKmh.toFixed(0)} km/h</strong></div>
                    {night.sunsetLabel ? <div className="col-span-2">Sunset {night.sunsetLabel}</div> : null}
                    {night.sunriseLabel ? <div className="col-span-2">Sunrise {night.sunriseLabel}</div> : null}
                  </dl>
                </article>
              ))}
            </div>

            <details className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/50 p-4 text-sm text-slate-300">
              <summary className="cursor-pointer font-semibold text-white">How the seeing, transparency, and imaging score are estimated</summary>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-xs leading-relaxed">
                <li>250 hPa wind is the jet-stream proxy. Under 12 m/s maps to 5/5, then 12–20, 20–28, 28–38, and above 38 m/s step down to 1/5. Humidity above 80% and an hour-to-hour temperature jump above 1.5°C reduce the score. Arcseconds run from about 0.6″ at 5/5 to 3.0″ at 1/5. If the 250 hPa wind is missing, surface wind is used instead.</li>
                <li>Transparency starts at magnitude 6.6 and falls with high cloud, mid cloud, humidity above 60%, and visibility under 30 km.</li>
                <li>The 0–100 score weights cloud 50% (low cloud counted again inside that share), seeing 28%, and transparency 22%, then subtracts precipitation probability and ground wind above 20 km/h.</li>
                <li>Prime Imaging Window requires a score of at least 72, total cloud at or below 25%, and seeing of at least 3/5. Clouded Out is total cloud of 80% or more, or a score under 40. Everything else is Visual / Narrowband Only.</li>
                <li>Dew risk is temperature minus dew point of 2.5°C or less.</li>
              </ul>
            </details>
          </>
        ) : null}
      </div>
    </section>
  );
}

function Metric({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-lg font-extrabold text-white">{value}</div>
      <div className="text-[11px] leading-snug text-slate-400">{detail}</div>
    </div>
  );
}

function HourMatrix({ hours }: { hours: HourPoint[] }) {
  const rows: { label: string; cell: (hour: HourPoint) => React.ReactNode }[] = [
    {
      label: "Cloud %",
      cell: (hour) => <Cell className={hour.cloud == null ? "bg-slate-800 text-slate-400" : cloudClass(hour.cloud)} value={fmt(hour.cloud)} />,
    },
    {
      label: "High %",
      cell: (hour) => <Cell className={hour.cloudHigh == null ? "bg-slate-800 text-slate-400" : cloudClass(hour.cloudHigh)} value={fmt(hour.cloudHigh)} />,
    },
    {
      label: "Mid %",
      cell: (hour) => <Cell className={hour.cloudMid == null ? "bg-slate-800 text-slate-400" : cloudClass(hour.cloudMid)} value={fmt(hour.cloudMid)} />,
    },
    {
      label: "Low %",
      cell: (hour) => <Cell className={hour.cloudLow == null ? "bg-slate-800 text-slate-400" : cloudClass(hour.cloudLow)} value={fmt(hour.cloudLow)} />,
    },
    {
      label: "Seeing",
      cell: (hour) => (
        <Cell
          className={hour.seeingScore == null ? "bg-slate-800 text-slate-400" : seeingClass(hour.seeingScore)}
          value={hour.seeingScore == null ? "—" : `${Math.round(hour.seeingScore)}/5`}
          title={hour.seeingArcsec == null ? "" : `${hour.seeingArcsec.toFixed(1)} arcsec · ${hour.seeingLabel}`}
        />
      ),
    },
    {
      label: "Transparency",
      cell: (hour) => (
        <Cell
          className={hour.transparencyMag == null ? "bg-slate-800 text-slate-400" : transparencyClass(hour.transparencyMag)}
          value={hour.transparencyMag == null ? "—" : hour.transparencyMag.toFixed(1)}
          title={hour.transparencyLabel}
        />
      ),
    },
    {
      label: "Dew ΔT",
      cell: (hour) => (
        <Cell
          className={hour.dewDeltaC == null ? "bg-slate-800 text-slate-400" : dewClass(hour.dewDeltaC)}
          value={hour.dewDeltaC == null ? "—" : hour.dewDeltaC.toFixed(1)}
          title={hour.dewRisk ? "Dew-heater strap" : "Spread above 2.5°C"}
        />
      ),
    },
    {
      label: "Wind km/h",
      cell: (hour) => (
        <Cell
          className={hour.windKmh == null ? "bg-slate-800 text-slate-400" : windClass(hour.windKmh)}
          value={fmt(hour.windKmh)}
          title={hour.windMph == null ? "" : `${hour.windMph.toFixed(0)} mph`}
        />
      ),
    },
    {
      label: "250 hPa",
      cell: (hour) => <Cell className="bg-slate-900 text-cyan-100" value={hour.jetMs == null ? "—" : hour.jetMs.toFixed(0)} title="Jet-stream wind, m/s" />,
    },
    {
      label: "Score",
      cell: (hour) => <Cell className={hour.score == null ? "bg-slate-800 text-slate-400" : scoreClass(hour.score)} value={fmt(hour.score)} title={hour.verdict ?? ""} />,
    },
  ];

  return (
    <div className="mt-3 overflow-x-auto rounded-2xl border border-slate-800">
      <div className="flex min-w-max">
        <div className="sticky left-0 z-10 w-28 shrink-0 bg-slate-950">
          <div className="flex h-14 items-end border-b border-slate-800 px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Hour</div>
          {rows.map((row) => (
            <div key={row.label} className="flex h-7 items-center border-b border-slate-900 px-2 text-[10px] font-semibold text-slate-300">
              {row.label}
            </div>
          ))}
        </div>
        {hours.map((hour) => (
          <div key={hour.utcMs} className={`w-11 shrink-0 ${hour.isNight ? "bg-indigo-950/40" : "bg-slate-950"}`}>
            <div className="flex h-14 flex-col items-center justify-end border-b border-slate-800 pb-1 text-[9px] font-mono leading-tight text-slate-300">
              <span>{hour.localDateKey.slice(5)}</span>
              <span className="text-white">{hour.localHour}</span>
              <span className="text-slate-500">{hour.utcHour}z</span>
            </div>
            {rows.map((row) => (
              <div key={row.label} className="h-7 border-b border-slate-900">
                {row.cell(hour)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Cell({ value, className, title }: { value: string; className: string; title?: string }) {
  return (
    <div title={title} className={`flex h-full items-center justify-center text-[10px] font-mono font-semibold ${className}`}>
      {value}
    </div>
  );
}
