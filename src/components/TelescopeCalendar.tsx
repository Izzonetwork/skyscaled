"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  CALENDAR_MONTHS,
  EQUIPMENT_FILTERS,
  HEMISPHERE_FILTERS,
  TARGET_FILTERS,
  TELESCOPE_EVENTS,
  eventsOnDate,
  type EquipmentId,
  type HemisphereId,
  type TargetTypeId,
  type TelescopeEvent,
} from "@/data/telescopeCalendar";
import { moonOn, moonPhaseName } from "@/data/moonIllumination";
import MoonPhaseIcon from "@/components/MoonPhaseIcon";
import EyepieceSimulator, { type SimulatorMode } from "@/components/EyepieceSimulator";
import { CalendarDays, Crosshair, Filter, Globe2, Telescope } from "lucide-react";

type MonthId = (typeof CALENDAR_MONTHS)[number]["id"] | "span";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatUtcDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function monthCells(year: number, monthIndex: number) {
  const firstWeekday = new Date(Date.UTC(year, monthIndex, 1)).getUTCDay();
  const count = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const cells: { date: string | null; day: number | null }[] = [];
  for (let i = 0; i < firstWeekday; i += 1) cells.push({ date: null, day: null });
  for (let day = 1; day <= count; day += 1) {
    const month = String(monthIndex + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    cells.push({ date: `${year}-${month}-${dd}`, day });
  }
  while (cells.length % 7 !== 0) cells.push({ date: null, day: null });
  return cells;
}

function shortTitle(title: string): string {
  return title.split("—")[0].trim();
}

export default function TelescopeCalendar() {
  const [monthId, setMonthId] = useState<MonthId>("2026-12");
  const [view, setView] = useState<"grid" | "timeline">("grid");
  const [equipment, setEquipment] = useState<"all" | EquipmentId>("all");
  const [hemisphere, setHemisphere] = useState<"both" | HemisphereId>("both");
  const [target, setTarget] = useState<"all" | TargetTypeId>("all");
  const [selectedId, setSelectedId] = useState("m42-orion-2026-12-09");
  const [selectedDate, setSelectedDate] = useState("2026-12-09");
  const [mode, setMode] = useState<SimulatorMode>("eyepiece");

  const filtered = useMemo(() => {
    return TELESCOPE_EVENTS.filter((event) => {
      if (equipment !== "all" && !event.equipment.includes(equipment)) return false;
      if (hemisphere !== "both" && !event.hemispheres.includes(hemisphere)) return false;
      if (target !== "all" && !event.targetTypes.includes(target)) return false;
      return true;
    });
  }, [equipment, hemisphere, target]);

  useEffect(() => {
    if (selectedId && filtered.some((event) => event.id === selectedId)) return;
    if (filtered[0]) {
      setSelectedId(filtered[0].id);
      setSelectedDate(filtered[0].date);
    }
  }, [filtered, selectedId]);

  const selected = TELESCOPE_EVENTS.find((event) => event.id === selectedId) ?? null;
  const activeMonth = CALENDAR_MONTHS.find((month) => month.id === monthId) ?? CALENDAR_MONTHS[2];
  const timelineEvents = filtered.filter((event) => monthId === "span" || event.dates.some((date) => date.startsWith(monthId)));
  const dateEvents = eventsOnDate(selectedDate, filtered);

  function openDate(date: string) {
    setSelectedDate(date);
    const matches = eventsOnDate(date, filtered);
    if (matches[0]) setSelectedId(matches[0].id);
    else setSelectedId("");
  }

  function openEvent(event: TelescopeEvent) {
    setSelectedId(event.id);
    setSelectedDate(event.date);
    const month = CALENDAR_MONTHS.find((item) => item.id === event.date.slice(0, 7));
    if (month && view === "grid") setMonthId(month.id);
  }

  return (
    <section id="telescope-calendar" className="relative scroll-mt-20 border-t border-cyan-500/20 py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.08),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.1),transparent_40%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-200">
              <Telescope className="h-3.5 w-3.5" />
              Interactive Telescope Observing Calendar
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Astronomical Calendar for Telescopes
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
              A UTC observing planner for October 2026 through March 2027. Every target carries catalog coordinates, lunar illumination from JPL DE421, and separate horizon notes for the Northern and Southern Hemispheres.
            </p>
          </div>
          <div className="flex rounded-xl border border-slate-700 bg-slate-950/80 p-1">
            <button
              type="button"
              onClick={() => setView("grid")}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold ${
                view === "grid" ? "bg-cyan-400 text-slate-950" : "text-slate-300 hover:text-white"
              }`}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              Monthly Grid
            </button>
            <button
              type="button"
              onClick={() => setView("timeline")}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold ${
                view === "timeline" ? "bg-cyan-400 text-slate-950" : "text-slate-300 hover:text-white"
              }`}
            >
              <Crosshair className="h-3.5 w-3.5" />
              Observing Schedule
            </button>
          </div>
        </div>

        <div className="mt-8 space-y-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 sm:p-5">
          <FilterRow label="Equipment" icon>
            {EQUIPMENT_FILTERS.map((item) => (
              <FilterChip key={item.id} active={equipment === item.id} onClick={() => setEquipment(item.id)}>
                {item.label}
              </FilterChip>
            ))}
          </FilterRow>
          <FilterRow label="Hemisphere">
            {HEMISPHERE_FILTERS.map((item) => (
              <FilterChip key={item.id} active={hemisphere === item.id} onClick={() => setHemisphere(item.id)}>
                {item.label}
              </FilterChip>
            ))}
          </FilterRow>
          <FilterRow label="Target">
            {TARGET_FILTERS.map((item) => (
              <FilterChip key={item.id} active={target === item.id} onClick={() => setTarget(item.id)}>
                {item.label}
              </FilterChip>
            ))}
          </FilterRow>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {view === "timeline" ? (
            <FilterChip active={monthId === "span"} onClick={() => setMonthId("span")}>
              Entire Span
            </FilterChip>
          ) : null}
          {CALENDAR_MONTHS.map((month) => (
            <FilterChip key={month.id} active={monthId === month.id} onClick={() => setMonthId(month.id)}>
              {month.label}
            </FilterChip>
          ))}
        </div>

        {view === "grid" ? (
          <div className="mt-4 overflow-x-auto rounded-2xl border border-cyan-500/20 bg-slate-950/80">
            <div className="min-w-[760px] p-3 sm:p-4">
              <div className="grid grid-cols-7 gap-2">
                {WEEKDAYS.map((day) => (
                  <div key={day} className="px-1 text-center font-mono text-[10px] uppercase tracking-widest text-cyan-300/80">
                    {day}
                  </div>
                ))}
                {monthCells(activeMonth.year, activeMonth.month).map((cell, index) => {
                  if (!cell.date || !cell.day) {
                    return <div key={`empty-${index}`} className="min-h-[104px] rounded-xl bg-slate-900/30" />;
                  }
                  const moon = moonOn(cell.date);
                  const dayEvents = eventsOnDate(cell.date, filtered);
                  const active = cell.date === selectedDate;
                  return (
                    <button
                      key={cell.date}
                      type="button"
                      onClick={() => openDate(cell.date as string)}
                      className={`flex min-h-[104px] cursor-pointer flex-col rounded-xl border p-2 text-left transition-colors ${
                        active
                          ? "border-cyan-300 bg-cyan-400/10 shadow-[0_0_24px_rgba(34,211,238,0.15)]"
                          : "border-slate-800 bg-slate-900/70 hover:border-cyan-500/40"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono text-sm font-bold text-white">{cell.day}</span>
                        <span title={`${Math.round(moon.illumination)}% ${moonPhaseName(moon.phaseAngle)} at 00:00 UTC`}>
                          <MoonPhaseIcon phaseAngle={moon.phaseAngle} size={16} />
                        </span>
                      </div>
                      <div className="mt-1.5 space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <span key={event.id} className="flex items-center gap-1">
                            <img src={event.image} alt="" className="h-5 w-5 rounded object-cover" />
                            <span className="truncate text-[10px] font-semibold text-slate-200">{shortTitle(event.title)}</span>
                          </span>
                        ))}
                        {dayEvents.length > 2 ? (
                          <span className="font-mono text-[10px] text-cyan-300">+{dayEvents.length - 2} more</span>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {timelineEvents.length === 0 ? (
              <p className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-6 text-sm text-slate-300">
                No targets match these filters in the selected span.
              </p>
            ) : (
              timelineEvents.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => openEvent(event)}
                  className={`flex w-full cursor-pointer gap-4 rounded-2xl border p-3 text-left transition-colors sm:p-4 ${
                    event.id === selectedId
                      ? "border-cyan-300 bg-cyan-400/10"
                      : "border-slate-800 bg-slate-950/80 hover:border-cyan-500/40"
                  }`}
                >
                  <img src={event.image} alt="" className="h-20 w-28 shrink-0 rounded-xl object-cover sm:h-24 sm:w-36" />
                  <span className="min-w-0">
                    <span className="block font-mono text-[11px] text-amber-200">{event.timeWindowUtc}</span>
                    <span className="mt-1 block text-base font-bold text-white">{event.title}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-slate-300">{event.summary}</span>
                  </span>
                </button>
              ))
            )}
          </div>
        )}

        <div id="target-inspector" className="mt-8 scroll-mt-24">
          {selected ? (
            <ObservingBrief
              event={selected}
              siblings={dateEvents}
              onPick={setSelectedId}
              mode={mode}
              onModeChange={setMode}
            />
          ) : (
            <DateOnlyBrief date={selectedDate} />
          )}
        </div>
      </div>
    </section>
  );
}

function FilterRow({
  label,
  icon = false,
  children,
}: {
  label: string;
  icon?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-start">
      <div className="flex w-28 shrink-0 items-center gap-1 pt-1 font-mono text-[10px] uppercase tracking-wider text-slate-400">
        {icon ? <Filter className="h-3.5 w-3.5 text-cyan-300" /> : <Globe2 className="h-3.5 w-3.5 text-cyan-300" />}
        {label}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-semibold leading-snug transition-colors ${
        active
          ? "border-cyan-300 bg-cyan-400 text-slate-950"
          : "border-slate-700 bg-slate-900 text-slate-300 hover:border-cyan-500/40 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function ObservingBrief({
  event,
  siblings,
  onPick,
  mode,
  onModeChange,
}: {
  event: TelescopeEvent;
  siblings: TelescopeEvent[];
  onPick: (id: string) => void;
  mode: SimulatorMode;
  onModeChange: (mode: SimulatorMode) => void;
}) {
  return (
    <div className="hud-frame rounded-3xl border border-cyan-500/30 bg-slate-950/90 p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-300">Telescope Observing Briefing</div>
          <h3 className="mt-1 text-2xl font-bold text-white">{event.title}</h3>
          <p className="mt-1 font-mono text-sm text-amber-200">{event.timeWindowUtc}</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-100">
          <MoonPhaseIcon phaseAngle={event.phaseAngle} size={18} />
          {event.moonSummary}
        </div>
      </div>

      {siblings.length > 1 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {siblings.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onPick(item.id)}
              className={`cursor-pointer rounded-lg border px-2.5 py-1 text-[11px] font-semibold ${
                item.id === event.id
                  ? "border-cyan-300 bg-cyan-400/15 text-cyan-100"
                  : "border-slate-700 text-slate-300 hover:text-white"
              }`}
            >
              {shortTitle(item.title)}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <EyepieceSimulator
            mode={mode}
            onModeChange={onModeChange}
            image={event.image}
            alt={event.imageAlt}
            credit={event.imageCredit}
            fovArcmin={event.fovArcmin}
            objectArcmin={event.objectArcmin}
            visualKind={event.visualKind}
            targetName={shortTitle(event.title)}
          />
        </div>
        <div className="lg:col-span-7">
          <p className="text-sm leading-relaxed text-slate-200">{event.summary}</p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            <Stat label="Constellation" value={event.constellation} />
            <Stat label="Right Ascension" value={event.ra} />
            <Stat label="Declination" value={event.dec} />
            <Stat label="Magnitude" value={event.magnitude} />
            <Stat label="Angular Size" value={event.angularSize} />
            <Stat label="Surface / Distance" value={`${event.surfaceBrightness} · ${event.distance}`} />
          </div>
          <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs text-slate-300">
            <span className="font-semibold text-cyan-200">Recommended sky: </span>
            {event.bortle}
          </div>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Stat label="Minimum aperture" value={event.minApertureMm} />
            <Stat label="Magnification" value={event.magnification} />
            <Stat label="Eyepiece" value={event.eyepiece} />
            <Stat label="Filters" value={event.filters} />
          </div>
          <p className="mt-3 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-xs leading-relaxed text-indigo-100">
            <span className="font-semibold">Camera exposure guide: </span>
            {event.exposureGuide}
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-cyan-500/25 bg-slate-950 p-3">
              <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-300">Northern Hemisphere</div>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">{event.northernHemisphere}</p>
            </div>
            <div className="rounded-xl border border-indigo-500/25 bg-slate-950 p-3">
              <div className="font-mono text-[10px] uppercase tracking-wider text-indigo-300">Southern Hemisphere</div>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">{event.southernHemisphere}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs">
            {event.sources.map((source) => (
              <a
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300 underline underline-offset-2 hover:text-white"
              >
                {source.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DateOnlyBrief({ date }: { date: string }) {
  const moon = moonOn(date);
  const nearby = TELESCOPE_EVENTS.filter((event) => event.dates.includes(date));
  return (
    <div className="hud-frame rounded-3xl border border-slate-700 bg-slate-950/90 p-5 sm:p-6">
      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-300">UTC date briefing</div>
      <h3 className="mt-1 text-2xl font-bold text-white">{formatUtcDate(date)}</h3>
      <div className="mt-4 flex items-center gap-3">
        <MoonPhaseIcon phaseAngle={moon.phaseAngle} size={42} />
        <div>
          <div className="text-sm font-semibold text-amber-100">
            {Math.round(moon.illumination)}% {moonPhaseName(moon.phaseAngle)} at 00:00 UTC
          </div>
          <p className="text-xs text-slate-400">
            No prime telescope target in the current filters falls on this UTC date.
            {nearby.length > 0 ? " Clear a filter to reveal targets scheduled on this date." : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2">
      <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-0.5 text-xs font-semibold leading-snug text-slate-100">{value}</div>
    </div>
  );
}
