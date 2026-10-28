"use client";

import React, { useState, useMemo } from "react";
import { EXPLAINERS_AND_SHORTS, CHANNEL_INFO, EpisodeItem } from "@/data/skyscaledData";
import { Play, ExternalLink, CheckCircle2, Filter, BookOpen, Youtube } from "lucide-react";

const FORMAT_FILTERS = [
  "All Formats",
  "3-Min Explainer",
  "Cosmic Paradox Short",
] as const;

const CATEGORY_FILTERS = [
  "All Topics",
  "Deep Space & Cosmology",
  "Orbital Engineering",
  "Planetary Physics",
  "Global Sky Guides",
] as const;

export default function EpisodeArchive() {
  const [selectedFormat, setSelectedFormat] = useState<string>("All Formats");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Topics");
  const [expandedEpisodeId, setExpandedEpisodeId] = useState<string | null>("ep01-universe-scale");

  const filteredEpisodes = useMemo(() => {
    return EXPLAINERS_AND_SHORTS.filter((ep) => {
      const matchesFormat =
        selectedFormat === "All Formats" || ep.format === selectedFormat;
      const matchesCategory =
        selectedCategory === "All Topics" || ep.category === selectedCategory;
      return matchesFormat && matchesCategory;
    });
  }, [selectedFormat, selectedCategory]);

  return (
    <section
      id="explainers"
      className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <hr className="section-divider mb-16" />
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="telemetry-chip inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/15 border border-red-400/40 text-red-200 text-xs font-semibold mb-3">
            <Youtube className="w-3.5 h-3.5" />
            Sourced Video Library • {CHANNEL_INFO.youtubeHandle}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Featured 3-Minute Explainers &amp; Daily Paradox Shorts
          </h2>
          <p className="mt-2 text-slate-300 max-w-3xl text-sm sm:text-base">
            Every episode pairs a physical scale model with primary NASA, ESA, JPL, IMO, or orbital telemetry sources and exact UTC calendar dates.
          </p>
        </div>

        <a
          href={CHANNEL_INFO.youtubeSubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/25 transition-all shrink-0"
        >
          <Play className="w-4 h-4 fill-current" />
          Subscribe on YouTube {CHANNEL_INFO.youtubeHandle}
        </a>
      </div>

      {/* Filter Bar */}
      <div className="hud-card rounded-2xl p-4 sm:p-5 mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            Format:
          </span>
          {FORMAT_FILTERS.map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => setSelectedFormat(fmt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedFormat === fmt
                  ? "bg-cyan-500 text-slate-950"
                  : "bg-slate-950 text-slate-300 hover:text-white border border-slate-800"
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 mr-1">
            Topic:
          </span>
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-indigo-500 text-white"
                  : "bg-slate-950 text-slate-300 hover:text-white border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEpisodes.map((ep: EpisodeItem) => {
          const isExpanded = expandedEpisodeId === ep.id;
          return (
            <article
              key={ep.id}
              className="group hud-card rounded-2xl hover:border-cyan-300/70 transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative aspect-video bg-slate-950 overflow-hidden">
                  <img
                    src={ep.thumbnail}
                    alt={ep.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/15 to-slate-950/10" />
                  <svg className="constellation-overlay" viewBox="0 0 200 112" aria-hidden="true">
                    <g fill="none" stroke="rgba(165,243,252,0.85)" strokeWidth="0.7">
                      <path d="M18 22 L46 30 L38 54 L62 48" />
                      <path d="M150 18 L176 36 L158 58" />
                      <path d="M96 16 L104 40 L88 62" />
                    </g>
                    <g fill="#fde68a">
                      <circle cx="18" cy="22" r="1.4" />
                      <circle cx="46" cy="30" r="1.1" />
                      <circle cx="38" cy="54" r="1.2" />
                      <circle cx="62" cy="48" r="1" />
                      <circle cx="150" cy="18" r="1.3" />
                      <circle cx="176" cy="36" r="1.1" />
                      <circle cx="158" cy="58" r="1.2" />
                      <circle cx="96" cy="16" r="1.5" />
                      <circle cx="104" cy="40" r="1" />
                    </g>
                  </svg>
                  <div className="reticle-overlay opacity-40" aria-hidden="true" />

                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="telemetry-chip px-2.5 py-1 rounded-md bg-slate-950/90 border border-cyan-400/40 text-cyan-100 text-[11px] font-bold">
                      {ep.code}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                        ep.format === "3-Min Explainer"
                          ? "bg-red-600/90 text-white"
                          : "bg-indigo-600/90 text-white"
                      }`}
                    >
                      {ep.format}
                    </span>
                  </div>

                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-slate-950/90 text-slate-200 font-mono text-xs font-semibold border border-slate-800">
                    {ep.duration}
                  </span>
                </div>

                {/* Body */}
                <div className="p-5">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                    <span>{ep.publishedDateUtc}</span>
                    <span className="telemetry-chip text-cyan-200">{ep.category}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white leading-snug group-hover:text-cyan-300 transition-colors">
                    {ep.title}
                  </h3>

                  <p className="mt-2.5 text-xs sm:text-sm text-amber-200/90 font-medium bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                    “{ep.hookQuestion}”
                  </p>

                  <div className="mt-3 text-xs text-slate-300 leading-relaxed">
                    <span className="font-semibold text-cyan-300">Scale Model: </span>
                    {ep.scaleModelSummary}
                  </div>

                  {/* Key Facts */}
                  <ul className="mt-4 space-y-2 border-t border-slate-800/80 pt-3">
                    {ep.keyFacts.map((fact, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Expandable Primary Sources */}
                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-slate-800 bg-slate-950/60 rounded-xl p-3">
                      <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2">
                        Verified Primary Source Sheet:
                      </div>
                      <ul className="space-y-1.5">
                        {ep.sources.map((src, idx) => (
                          <li key={idx}>
                            <a
                              href={src.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
                            >
                              {src.label}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 pb-5 pt-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedEpisodeId(isExpanded ? null : ep.id)
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  {isExpanded ? "Hide Sources" : `Sources (${ep.sources.length})`}
                </button>

                <a
                  href={ep.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  {ep.youtubeId ? "Watch Video on YouTube" : "Watch on @skyscaled"}
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
