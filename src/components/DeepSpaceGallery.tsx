"use client";

import React, { useState } from "react";
import { Orbit } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  image: string;
  alt: string;
  credit: string;
  distance: string;
  telescope: string;
  scaleFact: string;
}

const GALLERY: GalleryItem[] = [
  {
    id: "pillars",
    title: "Pillars of Creation, M16",
    image: "/images/space/pillars-of-creation.jpg",
    alt: "James Webb Space Telescope near-infrared view of the Pillars of Creation",
    credit: "NASA, ESA, CSA, STScI — Webb NIRCam, public domain",
    distance: "6,500 light-years",
    telescope: "JWST NIRCam · 0.6–5 µm",
    scaleFact: "The tallest pillar is about 4–5 light-years high. On the 1 mm Earth scale that column is roughly 3,300 km tall.",
  },
  {
    id: "carina",
    title: "Carina Nebula, Cosmic Cliffs",
    image: "/images/space/carina-cosmic-cliffs.jpg",
    alt: "Webb NIRCam image of the Cosmic Cliffs in the Carina Nebula",
    credit: "NASA, ESA, CSA, STScI — Webb NIRCam, public domain",
    distance: "7,600 light-years",
    telescope: "JWST NIRCam · NGC 3324",
    scaleFact: "The cliff edge is a cavity carved by ultraviolet light from young stars in NGC 3324, inside the Carina complex.",
  },
  {
    id: "andromeda",
    title: "Andromeda Galaxy, M31",
    image: "/images/space/andromeda-m31.jpg",
    alt: "The Andromeda Galaxy spanning a wide field",
    credit: "Public-domain astronomical photograph via Wikimedia Commons",
    distance: "2.5 million light-years",
    telescope: "Wide-field galaxy portrait · mag 3.4",
    scaleFact: "Shrink the Milky Way to a 25 cm dinner plate and M31 sits about 6 meters across the room.",
  },
  {
    id: "orion",
    title: "Orion Nebula, M42",
    image: "/images/space/orion-nebula-m42.jpg",
    alt: "Hubble mosaic of the Orion Nebula",
    credit: "NASA, ESA, M. Robberto (STScI) — Hubble, public domain",
    distance: "1,344 light-years",
    telescope: "Hubble ACS / WFPC2 mosaic",
    scaleFact: "The Huygens region around the Trapezium is the bright core a backyard telescope shows inside an 85′ cloud.",
  },
  {
    id: "saturn",
    title: "Saturn from Cassini",
    image: "/images/space/saturn-cassini.jpg",
    alt: "Saturn and its rings in natural color from Cassini",
    credit: "NASA / JPL-Caltech / SSI — Cassini natural-color mosaic, public domain",
    distance: "8.43 AU at the October 4, 2026 opposition",
    telescope: "Cassini Imaging Science Subsystem",
    scaleFact: "On October 4, 2026 the rings span 44.7″ and open 7.4° toward their south face.",
  },
  {
    id: "crab",
    title: "Crab Nebula, M1",
    image: "/images/space/crab-nebula-m1.jpg",
    alt: "Hubble image of the Crab Nebula",
    credit: "NASA, ESA, J. Hester and A. Loll — Hubble, public domain",
    distance: "6,500 light-years",
    telescope: "Hubble WFPC2 · supernova remnant of 1054",
    scaleFact: "The pulsar at the center spins about 30 times a second. Visually the nebula is a faint 6′ × 4′ oval.",
  },
  {
    id: "deep-field",
    title: "Webb Deep Field, SMACS 0723",
    image: "/images/space/webb-deep-field-smacs0723.jpg",
    alt: "Webb's first deep field of galaxy cluster SMACS 0723",
    credit: "NASA, ESA, CSA, STScI — Webb NIRCam, public domain",
    distance: "Cluster light-travel distance about 4.6 billion light-years",
    telescope: "JWST NIRCam · 12.5-hour exposure",
    scaleFact: "Foreground mass in SMACS 0723 lenses background galaxies into arcs. The field covers a patch smaller than a sand grain held at arm’s length.",
  },
];

export default function DeepSpaceGallery() {
  const [activeId, setActiveId] = useState(GALLERY[0].id);
  const active = GALLERY.find((item) => item.id === activeId) ?? GALLERY[0];

  return (
    <section id="deep-space-gallery" className="scroll-mt-20 border-t border-slate-800/80 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-200">
            <Orbit className="h-3.5 w-3.5" />
            Deep Space Observatory Gallery
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Iconic Cosmos, With the Distances Attached
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
            Public-domain and openly licensed frames from Hubble, Webb, and Cassini. Each stop lists light-travel distance, the instrument that made the picture, and the same human-scale comparison Skyscaled uses in the explainers.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="hud-frame overflow-hidden rounded-3xl border border-cyan-500/30 bg-slate-950 lg:col-span-7">
            <div className="relative aspect-[4/3]">
              <img src={active.image} alt={active.alt} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/20" />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan-300">{active.telescope}</div>
                <h3 className="mt-1 text-2xl font-bold text-white">{active.title}</h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-200">{active.scaleFact}</p>
                <p className="mt-2 text-[11px] text-slate-400">{active.credit}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 border-t border-slate-800 sm:grid-cols-3">
              <Metric label="Distance" value={active.distance} />
              <Metric label="Instrument" value={active.telescope} />
              <Metric label="Archive" value="Local NASA / ESA frame" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:col-span-5">
            {GALLERY.map((item) => {
              const activeTile = item.id === active.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  className={`cursor-pointer overflow-hidden rounded-2xl border text-left transition-colors ${
                    activeTile ? "border-cyan-300" : "border-slate-800 hover:border-cyan-500/40"
                  }`}
                >
                  <img src={item.image} alt="" className="aspect-[4/3] w-full object-cover" />
                  <span className="block px-2.5 py-2">
                    <span className="block text-xs font-bold text-white">{item.title}</span>
                    <span className="block font-mono text-[10px] text-cyan-300">{item.distance}</span>
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-slate-800 px-4 py-3 [&:nth-child(2)]:border-l sm:[&:nth-child(3)]:border-l">
      <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-1 text-xs font-semibold leading-snug text-slate-100">{value}</div>
    </div>
  );
}
