import React from "react";
import CosmicScaleExplorer from "@/components/CosmicScaleExplorer";
import DeepSpaceGallery from "@/components/DeepSpaceGallery";
import EpisodeArchive from "@/components/EpisodeArchive";
import Starfield, { OrbitalRings } from "@/components/Starfield";
import TelescopeCalendar from "@/components/TelescopeCalendar";
import {
  CHANNEL_INFO,
  GLOBAL_SKY_EVENTS,
  EXPLAINERS_AND_SHORTS,
} from "@/data/skyscaledData";
import {
  Play,
  Globe2,
  Compass,
  ShieldCheck,
  ExternalLink,
  Telescope,
  Sparkles,
  Clock,
  BookOpen,
  Youtube,
} from "lucide-react";

const SKY_EVENT_IMAGES: Record<string, { src: string; alt: string }> = {
  "sky-saturn-opposition-2026": {
    src: "/images/space/saturn-cassini.jpg",
    alt: "Saturn and its rings from the Cassini spacecraft",
  },
  "sky-orionids-2026": {
    src: "/images/space/orionids-meteor.jpg",
    alt: "An Orionid meteor crossing a star field",
  },
  "sky-full-moon-oct-2026": {
    src: "/images/space/moon-galileo.jpg",
    alt: "The Moon's near side from the Galileo spacecraft",
  },
  "sky-new-moon-nov-2026": {
    src: "/images/space/andromeda-m31.jpg",
    alt: "The Andromeda Galaxy, the deep-sky target of the November 9, 2026 New Moon",
  },
  "sky-leonids-2026": {
    src: "/images/space/geminids-kitt-peak.jpg",
    alt: "Meteors above Kitt Peak, the wide-field way a Leonid watch is photographed",
  },
  "sky-voyager-1-light-day": {
    src: "/images/space/voyager-1.jpg",
    alt: "Voyager spacecraft photographed during testing at JPL in November 1976",
  },
};

export default function HomePage() {
  const flagshipVideos = EXPLAINERS_AND_SHORTS.filter((ep) => ep.youtubeId);

  return (
    <div className="min-h-screen flex flex-col text-slate-100">
      {/* Top Global Banner */}
      <div className="bg-gradient-to-r from-cyan-950/90 via-slate-900 to-indigo-950/90 border-b border-cyan-500/20 px-4 py-2 text-center text-xs sm:text-sm">
        <span className="font-mono uppercase tracking-wider text-cyan-300 font-semibold mr-2">
          MILESTONE COUNTDOWN:
        </span>
        <span className="text-slate-200">
          Voyager 1 crosses <strong>One Light-Day (25.9 billion km)</strong> from Earth on{" "}
          <strong>November 18, 2026 at 10:16:07 UTC</strong>.
        </span>
        <a
          href="https://youtu.be/nmhP2Z7zKN8"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-3 inline-flex items-center gap-1 text-cyan-300 hover:text-white font-semibold underline underline-offset-4"
        >
          Watch the 3-Min Scale Model
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <a href="#" className="flex items-center gap-3 group">
            <img
              src="/images/logo-mark.png"
              alt="Skyscaled logo mark"
              className="w-9 h-9 rounded-lg border border-cyan-500/30 object-cover"
            />
            <div>
              <span className="text-lg font-black tracking-wider text-white group-hover:text-cyan-300 transition-colors">
                SKYSCALED
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/20">
                {CHANNEL_INFO.youtubeHandle}
              </span>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-300">
            <a href="#telescope-calendar" className="text-cyan-200 hover:text-white transition-colors">
              Telescope Calendar
            </a>
            <a href="#scale-explorer" className="hover:text-cyan-300 transition-colors">
              Scale Explorer
            </a>
            <a href="#deep-space-gallery" className="hover:text-cyan-300 transition-colors">
              Deep Space Gallery
            </a>
            <a href="#explainers" className="hover:text-cyan-300 transition-colors">
              Explainers
            </a>
            <a href="#sky-events" className="hover:text-cyan-300 transition-colors">
              Sky Guide
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href={CHANNEL_INFO.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-red-600/25 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Watch on YouTube {CHANNEL_INFO.youtubeHandle}</span>
            </a>
          </div>
        </div>
        <nav className="flex gap-4 overflow-x-auto border-t border-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-300 lg:hidden">
          <a href="#telescope-calendar" className="shrink-0 text-cyan-200">Telescope Calendar</a>
          <a href="#scale-explorer" className="shrink-0">Scale Explorer</a>
          <a href="#deep-space-gallery" className="shrink-0">Deep Space Gallery</a>
          <a href="#explainers" className="shrink-0">Explainers</a>
          <a href="#sky-events" className="shrink-0">Sky Guide</a>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-cyan-500/15 pt-12 pb-20 sm:pt-16 sm:pb-24">
          <img
            src="/images/space/carina-cosmic-cliffs.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/35 via-slate-950/78 to-slate-950" />
          <Starfield dense className="absolute inset-0" />
          <OrbitalRings />
          <div className="pointer-events-none absolute left-6 top-6 hidden font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-200/80 sm:block">
            RA 10h 37m · Dec −58° 38′ · NGC 3324 · Webb NIRCam
          </div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono uppercase tracking-widest mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                3-Minute Sourced Space &amp; Frontier Tech Explainers
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
                SKYSCALED —{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-400">
                  The Universe, Scaled to Human Understanding
                </span>
              </h1>

              <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                {CHANNEL_INFO.mission} Shrink Earth to a 1 mm grain of sand and the observable universe still spans{" "}
                <strong className="text-white">7.3 light-years across</strong>.
              </p>

              {/* Primary CTA Stack */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href={CHANNEL_INFO.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-red-600/30 transition-all"
                >
                  <Youtube className="w-5 h-5" />
                  Watch on YouTube @skyscaled
                </a>

                <a
                  href="#telescope-calendar"
                  className="inline-flex items-center gap-2 px-5 py-4 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-sm sm:text-base shadow-lg shadow-cyan-500/25 transition-all"
                >
                  <Telescope className="w-4 h-4" />
                  Open Telescope Calendar
                </a>

                <a
                  href="#scale-explorer"
                  className="inline-flex items-center gap-2 px-5 py-4 rounded-2xl bg-slate-950/80 hover:bg-slate-900 text-cyan-300 border border-cyan-500/30 font-bold text-sm sm:text-base transition-all"
                >
                  <Compass className="w-4 h-4" />
                  Launch Scale Explorer
                </a>
              </div>

              {/* Secondary Socials & Verification */}
              <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Primary NASA / ESA / JPL / IMO Citations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-indigo-400" />
                  <span>Global UTC Times &amp; Both-Hemisphere Sky Guides</span>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={CHANNEL_INFO.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-cyan-300 underline underline-offset-4"
                  >
                    Instagram @skyscaled
                  </a>
                  <span>•</span>
                  <a
                    href={CHANNEL_INFO.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-cyan-300 underline underline-offset-4"
                  >
                    Facebook Page
                  </a>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="lg:col-span-5 space-y-4">
              <a
                href="#telescope-calendar"
                className="hud-frame block overflow-hidden rounded-3xl border border-cyan-400/40 bg-slate-950/80 shadow-2xl shadow-cyan-500/10"
              >
                <div className="relative h-36">
                  <img
                    src="/images/space/pillars-of-creation.jpg"
                    alt="Webb near-infrared view of the Pillars of Creation"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-200">
                      Observatory preview · M16
                    </div>
                    <div className="text-sm font-bold text-white">Pillars of Creation · 6,500 light-years</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-px bg-slate-800 text-center">
                  <div className="bg-slate-950 px-2 py-2">
                    <div className="font-mono text-[10px] text-cyan-300">RA 18h 18m</div>
                    <div className="text-[11px] font-semibold text-white">Eagle Nebula</div>
                  </div>
                  <div className="bg-slate-950 px-2 py-2">
                    <div className="font-mono text-[10px] text-amber-300">Dec −13° 49′</div>
                    <div className="text-[11px] font-semibold text-white">Serpens</div>
                  </div>
                  <div className="bg-slate-950 px-2 py-2">
                    <div className="font-mono text-[10px] text-indigo-300">Webb NIRCam</div>
                    <div className="text-[11px] font-semibold text-white">Open Calendar</div>
                  </div>
                </div>
              </a>
              <div className="rounded-3xl bg-slate-950/90 border border-cyan-500/30 overflow-hidden shadow-2xl shadow-cyan-500/10">
                <div className="relative aspect-video bg-slate-950">
                  <img
                    src="/thumbnails/ep01-universe-scale.jpg"
                    alt="How Big Is the Universe, Really? — Skyscaled Pilot Explainer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <a
                    href="https://youtu.be/nmhP2Z7zKN8"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Play How Big Is the Universe, Really? on YouTube"
                    className="absolute inset-0 flex items-center justify-center group"
                  >
                    <span className="w-16 h-16 rounded-full bg-red-600/95 group-hover:bg-red-500 group-hover:scale-110 transition-all flex items-center justify-center shadow-2xl shadow-red-600/50">
                      <Play className="w-7 h-7 text-white fill-current ml-0.5" />
                    </span>
                  </a>
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/90 border border-cyan-400/40 text-cyan-300 font-mono text-xs font-bold">
                    FEATURED PILOT • 3:08
                  </span>
                </div>

                <div className="p-6">
                  <div className="text-xs font-mono text-slate-400">
                    Published October 6, 2026 • YouTube @skyscaled
                  </div>
                  <h2 className="mt-1 text-xl font-bold text-white">
                    How Big Is the Universe, Really?
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Shrink Earth to a 1 mm grain of sand: the Sun becomes a grapefruit 11.7 meters away, Voyager 1 sits 2.03 km out on November 18, 2026, and the observable universe spans 7.3 light-years across.
                  </p>

                  <div className="mt-5 grid grid-cols-3 gap-2 pt-4 border-t border-slate-800 text-center">
                    <div className="bg-slate-950/70 rounded-xl p-2.5 border border-slate-800/80">
                      <div className="text-xs font-mono text-cyan-400">1 mm Earth</div>
                      <div className="text-sm font-bold text-white mt-0.5">Grain of Sand</div>
                    </div>
                    <div className="bg-slate-950/70 rounded-xl p-2.5 border border-slate-800/80">
                      <div className="text-xs font-mono text-amber-400">Nov 18, 2026</div>
                      <div className="text-sm font-bold text-white mt-0.5">1 Light-Day</div>
                    </div>
                    <div className="bg-slate-950/70 rounded-xl p-2.5 border border-slate-800/80">
                      <div className="text-xs font-mono text-indigo-400">93B Light-Yrs</div>
                      <div className="text-sm font-bold text-white mt-0.5">7.3 ly Scaled</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Direct YouTube Releases Strip */}
          <div className="mt-14 pt-10 border-t border-slate-800/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <h2 className="text-sm font-mono uppercase tracking-widest text-cyan-300 font-bold">
                Direct YouTube Releases on {CHANNEL_INFO.youtubeHandle}
              </h2>
              <a
                href={CHANNEL_INFO.youtubeVideosUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-slate-300 hover:text-cyan-300 inline-flex items-center gap-1"
              >
                Open Full Channel on YouTube
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {flagshipVideos.map((vid) => (
                <a
                  key={vid.id}
                  href={vid.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-red-500/50 p-3.5 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 mb-3">
                      <img
                        src={vid.thumbnail}
                        alt={vid.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-slate-950/90 text-[10px] font-mono text-white">
                        {vid.duration}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-cyan-400">{vid.publishedDateUtc}</div>
                    <h3 className="mt-1 text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2">
                      {vid.title}
                    </h3>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-red-400">
                    <span>youtu.be/{vid.youtubeId}</span>
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </div>
                </a>
              ))}
            </div>
          </div>
          </div>
        </section>

        <TelescopeCalendar />

        {/* Interactive Cosmic Scale Explorer */}
        <CosmicScaleExplorer />

        <DeepSpaceGallery />

        {/* Filterable Explainers & Daily Shorts Archive */}
        <EpisodeArchive />

        {/* Global Sky Events Guide (UTC + Both Hemispheres) */}
        <section
          id="sky-events"
          className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-3">
                <Globe2 className="w-3.5 h-3.5" />
                Worldwide Observational Ephemeris • All Times UTC
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Global Sky Events Guide: Northern &amp; Southern Hemispheres
              </h2>
              <p className="mt-2 text-slate-300 max-w-3xl text-sm sm:text-base">
                Computed against NASA JPL DE421 and International Meteor Organization (IMO) ephemerides. Every guide lists exact calendar dates, UTC timestamps, and separate horizon directions for Northern and Southern Hemisphere observers.
              </p>
            </div>

            <a
              href={CHANNEL_INFO.youtubeShortsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs sm:text-sm font-bold shrink-0 transition-all"
            >
              <Telescope className="w-4 h-4" />
              Watch Sky Guides on {CHANNEL_INFO.youtubeHandle}
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {GLOBAL_SKY_EVENTS.map((ev) => (
              <div
                key={ev.id}
                className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden flex flex-col justify-between"
              >
                <img
                  src={SKY_EVENT_IMAGES[ev.id]?.src ?? "/images/space/hubble-ultra-deep-field.jpg"}
                  alt={SKY_EVENT_IMAGES[ev.id]?.alt ?? ev.title}
                  className="h-40 w-full object-cover"
                />
                <div className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-mono text-xs font-semibold">
                      {ev.category}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md">
                      <Clock className="w-3.5 h-3.5" />
                      {ev.dateUtc}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white">{ev.title}</h3>
                  <div className="mt-1 text-xs font-mono text-cyan-400">
                    Constellation / Region: {ev.constellation} • Window: {ev.peakWindowUtc}
                  </div>

                  <p className="mt-3 text-xs sm:text-sm text-slate-200 bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 leading-relaxed">
                    <strong className="text-cyan-300">Scale Context: </strong>
                    {ev.scaleComparison}
                  </p>

                  {/* Both-Hemisphere Directions */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-950/90 border border-cyan-500/25 p-3.5">
                      <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-300 font-bold mb-1">
                        Northern Hemisphere Viewing
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {ev.northernHemisphere}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-950/90 border border-indigo-500/25 p-3.5">
                      <div className="text-[11px] font-mono uppercase tracking-wider text-indigo-300 font-bold mb-1">
                        Southern Hemisphere Viewing
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {ev.southernHemisphere}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mx-6 mb-6 mt-0 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-slate-400">
                    <strong className="text-slate-200">Optics: </strong>
                    {ev.opticalEquipment}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {ev.sources.map((s, idx) => (
                      <a
                        key={idx}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 underline underline-offset-2 font-medium"
                      >
                        {s.label}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Scientific Rigor & Methodology Section */}
        <section
          id="methodology"
          className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80"
        >
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/40 border border-slate-800 p-8 sm:p-12">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold uppercase tracking-widest mb-3">
                <BookOpen className="w-3.5 h-3.5" />
                Editorial &amp; Scientific Verification Standard
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                How Skyscaled Builds Every 3-Minute Explainer
              </h2>
              <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
                Inspired by research-first science communication, every Skyscaled script begins with a verified primary source sheet before a single frame is animated.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-5">
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
                  01 • Primary Sources Only
                </div>
                <h3 className="mt-2 text-base font-bold text-white">
                  Statement-by-Statement Citations
                </h3>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  Every physical constant, orbital velocity, and astronomical distance traces directly to NASA GSFC Fact Sheets, JPL Horizons, ESA Planck/Webb releases, or peer-reviewed journals.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-5">
                <div className="text-xs font-mono text-amber-400 uppercase tracking-wider font-bold">
                  02 • Human-Scale Models
                </div>
                <h3 className="mt-2 text-base font-bold text-white">
                  Original Dimensional Math
                </h3>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  Instead of repeating raw trillions of kilometers, every video translates cosmic magnitudes into everyday physical objects — from a 1 mm sand grain to a 25 cm dinner plate.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-5">
                <div className="text-xs font-mono text-indigo-400 uppercase tracking-wider font-bold">
                  03 • Global &amp; Exact Dates
                </div>
                <h3 className="mt-2 text-base font-bold text-white">
                  UTC Timestamps &amp; Both Hemispheres
                </h3>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  Sky events are computed with Skyfield/DE421 ephemerides in Coordinated Universal Time (UTC) with explicit viewing geometry for both Northern and Southern Hemispheres.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-5">
                <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold">
                  04 • Authentic Optics
                </div>
                <h3 className="mt-2 text-base font-bold text-white">
                  Real Astrophotography &amp; Clear Credits
                </h3>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  Combines Hristo Stefanov&apos;s telescope captures with NASA public-domain imagery and on-screen CC BY 4.0 attribution for ESA/Webb and ESA/Hubble observations.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/90 bg-slate-950 py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/images/logo-mark.png"
                alt="Skyscaled logo"
                className="w-8 h-8 rounded-lg border border-cyan-500/30"
              />
              <span className="text-lg font-black tracking-wider text-white">
                SKYSCALED
              </span>
              <span className="text-xs font-mono text-cyan-400">
                skyscaled.com
              </span>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-xl">
              The Universe, Scaled to Human Understanding. Created by Hristo Stefanov. All sky-event times are stated in UTC with Northern and Southern Hemisphere viewing guidance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={CHANNEL_INFO.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              YouTube @skyscaled
            </a>
            <a
              href={CHANNEL_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 transition-colors"
            >
              Instagram @skyscaled
            </a>
            <a
              href={CHANNEL_INFO.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 transition-colors"
            >
              Facebook Page
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 Skyscaled ({CHANNEL_INFO.youtubeHandle}). Channel ID: {CHANNEL_INFO.youtubeChannelId}.
          </div>
          <div className="flex items-center gap-4">
            <a href="/sitemap.xml" className="hover:text-slate-300">
              Sitemap
            </a>
            <a href="/robots.txt" className="hover:text-slate-300">
              Robots
            </a>
            <a
              href="https://www.youtube.com/@skyscaled"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300"
            >
              youtube.com/@skyscaled
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
