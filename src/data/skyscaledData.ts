export interface SourceLink {
  label: string;
  url: string;
}

export interface EpisodeItem {
  id: string;
  code: string;
  title: string;
  format: "3-Min Explainer" | "Cosmic Paradox Short" | "Global Sky Short";
  category:
    | "Deep Space & Cosmology"
    | "Orbital Engineering"
    | "Global Sky Guides"
    | "Planetary Physics";
  publishedDateUtc: string;
  duration: string;
  hookQuestion: string;
  scaleModelSummary: string;
  keyFacts: string[];
  thumbnail: string;
  youtubeUrl: string;
  youtubeId?: string;
  featured?: boolean;
  sources: SourceLink[];
}

export interface SkyEventItem {
  id: string;
  title: string;
  dateUtc: string;
  peakWindowUtc: string;
  category: "Meteor Shower" | "Planetary Alignment" | "Lunar Phase" | "Deep-Space Milestone";
  constellation: string;
  scaleComparison: string;
  northernHemisphere: string;
  southernHemisphere: string;
  opticalEquipment: string;
  thumbnail: string;
  youtubeUrl: string;
  sources: SourceLink[];
}

export interface CosmicScaleStop {
  id: string;
  name: string;
  subtitle: string;
  realDistanceKm: number;
  realDistanceLabel: string;
  realDiameterKm: string;
  lightTravelTime: string;
  sandScaleSize: string;
  sandScaleDistance: string;
  voyagerTravelTime: string;
  keyFact: string;
  sourceLabel: string;
  sourceUrl: string;
}

export const CHANNEL_INFO = {
  name: "Skyscaled",
  tagline: "The Universe, Scaled to Human Understanding",
  mission:
    "Polished 3-minute explainers and daily vertical Shorts on astrophysics, cosmology, orbital engineering, and global sky events. Every big number is converted into a physical human-scale model, and every claim traces to a primary scientific source.",
  domain: "https://skyscaled.com",
  youtubeHandle: "@skyscaled",
  youtubeUrl: "https://www.youtube.com/@skyscaled",
  youtubeVideosUrl: "https://www.youtube.com/@skyscaled/videos",
  youtubeShortsUrl: "https://www.youtube.com/@skyscaled/shorts",
  youtubeSubUrl: "https://www.youtube.com/@skyscaled?sub_confirmation=1",
  youtubeChannelId: "UCyAn6JTDfmDBt8tcTQ-FEsA",
  instagramUrl: "https://www.instagram.com/skyscaled/",
  facebookUrl: "https://www.facebook.com/profile.php?id=61595040335544",
};

export const COSMIC_SCALE_STOPS: CosmicScaleStop[] = [
  {
    id: "earth",
    name: "Earth",
    subtitle: "Our Baseline Reference Sphere",
    realDistanceKm: 0,
    realDistanceLabel: "0 km (Origin)",
    realDiameterKm: "12,742 km equatorial diameter",
    lightTravelTime: "0.042 seconds around equator",
    sandScaleSize: "1.0 mm grain of sand",
    sandScaleDistance: "0 mm (Starting point)",
    voyagerTravelTime: "Origin",
    keyFact:
      "Earth orbits the Sun at 29.78 km/s, carrying every observer approximately 5,360 km through space during a single 3-minute explainer.",
    sourceLabel: "NASA GSFC Earth Fact Sheet",
    sourceUrl: "https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html",
  },
  {
    id: "moon",
    name: "The Moon",
    subtitle: "Tidally Locked Planetary Companion",
    realDistanceKm: 384400,
    realDistanceLabel: "384,400 km mean orbital distance",
    realDiameterKm: "3,475 km diameter",
    lightTravelTime: "1.28 light-seconds",
    sandScaleSize: "0.27 mm dust speck",
    sandScaleDistance: "3.0 cm from the 1 mm Earth grain",
    voyagerTravelTime: "6.2 hours at 17 km/s",
    keyFact:
      "The Moon completes one full axial rotation in the exact time it takes to complete one orbit around Earth (27.32 Earth days), keeping the same hemisphere facing Earth.",
    sourceLabel: "NASA Moon Fact Sheet",
    sourceUrl: "https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html",
  },
  {
    id: "sun",
    name: "The Sun",
    subtitle: "G-Type Main-Sequence Star (1 AU)",
    realDistanceKm: 149597870,
    realDistanceLabel: "149,597,870 km (1 Astronomical Unit)",
    realDiameterKm: "1,392,700 km (109.2 Earth diameters)",
    lightTravelTime: "8 minutes 20 seconds",
    sandScaleSize: "10.9 cm grapefruit",
    sandScaleDistance: "11.7 meters away",
    voyagerTravelTime: "102 days at 17 km/s",
    keyFact:
      "Sunlight crosses vacuum from the solar photosphere to Earth in 8 minutes 20 seconds, after photons spend 10,000 to 170,000 years scattering out from the solar core.",
    sourceLabel: "NASA Solar System Exploration — The Sun",
    sourceUrl: "https://science.nasa.gov/sun/facts/",
  },
  {
    id: "voyager-1",
    name: "Voyager 1 at One Light-Day",
    subtitle: "November 18, 2026 Milestone (10:16:07 UTC)",
    realDistanceKm: 25902068371,
    realDistanceLabel: "25.90 billion km (173.1 AU)",
    realDiameterKm: "3.7 m high-gain antenna dish",
    lightTravelTime: "24 hours 00 minutes 00 seconds (1.0 light-day)",
    sandScaleSize: "Sub-microscopic probe",
    sandScaleDistance: "2.03 kilometers from the 1 mm Earth grain",
    voyagerTravelTime: "49 years, 2 months, 11 days (Launched September 5, 1977)",
    keyFact:
      "Scheduled for November 18, 2026 at 10:16:07 UTC, Voyager 1 reaches a distance where a radio signal traveling at 299,792 km/s takes a full 24 hours one way.",
    sourceLabel: "NASA Voyager 1 — What Is a Light-Day?",
    sourceUrl:
      "https://science.nasa.gov/mission/voyager/voyager-1/voyager-1-what-is-a-light-day/",
  },
  {
    id: "proxima-centauri",
    name: "Proxima Centauri",
    subtitle: "Nearest Known Star Beyond the Sun",
    realDistanceKm: 40140000000000,
    realDistanceLabel: "40.14 trillion km (4.246 light-years)",
    realDiameterKm: "214,550 km (Red Dwarf)",
    lightTravelTime: "4.246 light-years (1,551 light-days)",
    sandScaleSize: "1.68 cm cherry",
    sandScaleDistance: "3,150 kilometers (New York to Denver)",
    voyagerTravelTime: "approx. 75,000 years at Voyager 1 speed",
    keyFact:
      "Even after 49 years of interstellar flight, Voyager 1 covers less than 1/1,500th of the distance to the nearest neighboring star system.",
    sourceLabel: "NASA / ESA Proxima Centauri Reference",
    sourceUrl: "https://science.nasa.gov/exoplanets/",
  },
  {
    id: "boomerang-nebula",
    name: "Boomerang Nebula",
    subtitle: "Coldest Known Natural Object in the Cosmos (1 K)",
    realDistanceKm: 47300000000000000,
    realDistanceLabel: "47.3 quadrillion km (5,000 light-years)",
    realDiameterKm: "approx. 1.4 light-years bipolar outflow",
    lightTravelTime: "5,000 light-years",
    sandScaleSize: "1,040 km bipolar cloud",
    sandScaleDistance: "3.71 million km (9.6x Earth–Moon distance)",
    voyagerTravelTime: "approx. 88 million years",
    keyFact:
      "Located 5,000 light-years away in Centaurus, gas expanding at 164 km/s cools the Boomerang Nebula to 1 Kelvin (-272.15 °C), colder than the 2.7 K cosmic microwave background.",
    sourceLabel: "NASA / ESA Hubble Boomerang Nebula Release",
    sourceUrl: "https://science.nasa.gov/missions/hubble/boomerang-nebula/",
  },
  {
    id: "pillars-of-creation",
    name: "Pillars of Creation (Eagle Nebula M16)",
    subtitle: "Star-Forming Molecular Hydrogen Columns",
    realDistanceKm: 61500000000000000,
    realDistanceLabel: "61.5 quadrillion km (6,500 light-years)",
    realDiameterKm: "Leftmost pillar spans ~4 to 5 light-years tall",
    lightTravelTime: "6,500 light-years",
    sandScaleSize: "3,300 km tall column",
    sandScaleDistance: "4.82 million km from the 1 mm Earth grain",
    voyagerTravelTime: "approx. 114 million years",
    keyFact:
      "Imaged in infrared by the James Webb Space Telescope, individual finger-like projections at the tops of the pillars exceed the diameter of our entire solar system.",
    sourceLabel: "NASA / ESA / CSA James Webb Space Telescope",
    sourceUrl: "https://science.nasa.gov/mission/webb/",
  },
  {
    id: "andromeda-galaxy",
    name: "Andromeda Galaxy (Messier 31)",
    subtitle: "Nearest Major Spiral Galaxy to the Milky Way",
    realDistanceKm: 23650000000000000000,
    realDistanceLabel: "23.65 quintillion km (2.5 million light-years)",
    realDiameterKm: "approx. 152,000 to 220,000 light-years across",
    lightTravelTime: "2.5 million light-years",
    sandScaleSize: "1.85 billion km disk (wider than Saturn's orbit)",
    sandScaleDistance: "1.85 billion km (or 6 meters away if the Milky Way is a 25 cm dinner plate)",
    voyagerTravelTime: "approx. 44 billion years",
    keyFact:
      "Shrink the entire 100,000-light-year Milky Way down to a 25 cm dinner plate and Andromeda sits as another large plate only 6 meters across the room — visible to the unaided human eye.",
    sourceLabel: "NASA Hubble Messier 31 Catalog",
    sourceUrl:
      "https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/messier-31/",
  },
  {
    id: "observable-universe",
    name: "The Observable Universe",
    subtitle: "Cosmic Horizon Expanded Over 13.8 Billion Years",
    realDistanceKm: 880000000000000000000000,
    realDistanceLabel: "93 billion light-years diameter (46.5 billion ly radius)",
    realDiameterKm: "8.8 × 10²³ km comoving diameter",
    lightTravelTime: "13.8 billion years lookback time",
    sandScaleSize: "7.3 light-years wide sphere",
    sandScaleDistance: "3.65 light-years radius from the 1 mm Earth grain",
    voyagerTravelTime: "Exceeds stellar lifetimes",
    keyFact:
      "Even when Earth is compressed to a 1 mm grain of sand, the observable universe remains 7.3 light-years across — wider than the real physical distance from Earth to Alpha Centauri.",
    sourceLabel: "NASA WMAP & ESA Planck Cosmology",
    sourceUrl: "https://science.nasa.gov/universe/overview/",
  },
];

export const EXPLAINERS_AND_SHORTS: EpisodeItem[] = [
  {
    id: "ep01-universe-scale",
    code: "EP01 • PILOT",
    title: "How Big Is the Universe, Really?",
    format: "3-Min Explainer",
    category: "Deep Space & Cosmology",
    publishedDateUtc: "October 6, 2026 • 14:00 UTC",
    duration: "3:08",
    hookQuestion:
      "If you shrink the entire Earth down to a 1 mm grain of sand, how wide does the observable universe remain?",
    scaleModelSummary:
      "Earth = 1 mm grain of sand → Sun = 10.9 cm grapefruit 11.7 m away → Milky Way = 74 million km → Observable Universe = 7.3 light-years wide.",
    keyFacts: [
      "Light travels at 299,792 km/s: 1.28 seconds from the Moon and 8 minutes 20 seconds from the Sun.",
      "Voyager 1 reaches 1 light-day (25.9 billion km) on November 18, 2026 at 10:16:07 UTC.",
      "Because space expands while photons travel, the 13.8-billion-year-old observable universe spans 93 billion light-years across.",
    ],
    thumbnail: "/thumbnails/ep01-universe-scale.jpg",
    youtubeUrl: "https://youtu.be/nmhP2Z7zKN8",
    youtubeId: "nmhP2Z7zKN8",
    featured: true,
    sources: [
      {
        label: "NASA Voyager 1 Light-Day Milestone",
        url: "https://science.nasa.gov/mission/voyager/voyager-1/voyager-1-what-is-a-light-day/",
      },
      {
        label: "NASA Hubble Messier 31 (Andromeda)",
        url: "https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/messier-31/",
      },
    ],
  },
  {
    id: "ep02-starship-orbit",
    code: "EP02 • ORBITAL",
    title: "Starship Finally Reached Orbit: What Flight 14 Changed",
    format: "3-Min Explainer",
    category: "Orbital Engineering",
    publishedDateUtc: "October 9, 2026 • 15:00 UTC",
    duration: "3:04",
    hookQuestion:
      "How did adding the final 1% of velocity on September 28, 2026 turn a suborbital test into a full orbital deployment?",
    scaleModelSummary:
      "124 meters tall (taller than the Statue of Liberty) accelerating to ~27,600 km/h — equivalent to crossing from New York to Los Angeles in 8.5 minutes.",
    keyFacts: [
      "On September 28, 2026, Starship Flight 14 achieved full orbital velocity and deployed 26 Starlink V3 satellites.",
      "Each Starlink V3 unit masses roughly 2 tonnes, delivering ~50 tonnes in a single launch.",
      "Starship completed its first orbital deorbit burn before a targeted splashdown in the Pacific Ocean north of Hawaii.",
    ],
    thumbnail: "/thumbnails/ep02-starship-orbit.jpg",
    youtubeUrl: "https://youtu.be/SzQe6SKwP0U",
    youtubeId: "SzQe6SKwP0U",
    featured: true,
    sources: [
      {
        label: "SpaceX Starship Flight 14 Mission Report",
        url: "https://www.spacex.com/launches/starship-flight-14",
      },
      {
        label: "SpaceX Starship Vehicle Overview",
        url: "https://www.spacex.com/vehicles/starship/",
      },
    ],
  },
  {
    id: "ep06-big-bang-calendar",
    code: "EP06 • COSMOLOGY",
    title: "The Big Bang in One Calendar Year",
    format: "3-Min Explainer",
    category: "Deep Space & Cosmology",
    publishedDateUtc: "October 21, 2026 • 15:00 UTC",
    duration: "3:12",
    hookQuestion:
      "If all 13.8 billion years of cosmic history are compressed into one 365-day calendar year, on what date do the Sun and Earth form?",
    scaleModelSummary:
      "13.8 billion years = 365 days → 1 calendar second = 438 years → 1 calendar day = 37.8 million years.",
    keyFacts: [
      "January 1 at 00:00 UTC marks the Big Bang ('Everywhere Stretch'); atoms form 380,000 years later (~14 minutes into January 1), releasing the Cosmic Microwave Background.",
      "The Sun and solar system condense around September 1 on the cosmic calendar.",
      "Anatomically modern humans appear at approximately 23:49 UTC on December 31 — the final 11 minutes of the year.",
    ],
    thumbnail: "/thumbnails/ep06-big-bang-calendar.jpg",
    youtubeUrl: "https://youtu.be/p82cVukjiB4",
    youtubeId: "p82cVukjiB4",
    featured: true,
    sources: [
      {
        label: "NASA WMAP Cosmology & CMB",
        url: "https://map.gsfc.nasa.gov/",
      },
      {
        label: "ESA Planck 2018 Cosmological Parameters",
        url: "https://www.esa.int/Science_Exploration/Space_Science/Planck",
      },
    ],
  },
  {
    id: "ep03-andromeda",
    code: "EP03 • SKY GUIDE",
    title: "How to Find the Andromeda Galaxy (Naked Eye & Beginner Scope)",
    format: "3-Min Explainer",
    category: "Global Sky Guides",
    publishedDateUtc: "October 9, 2026 • 15:00 UTC",
    duration: "3:02",
    hookQuestion:
      "How can you locate a spiral galaxy 2.5 million light-years away in four star hops from both the Northern and Southern Hemispheres?",
    scaleModelSummary:
      "If the Milky Way is a 25 cm dinner plate, Andromeda (M31) is a slightly larger dinner plate only 6 meters away.",
    keyFacts: [
      "Start at the Great Square of Pegasus (Alpheratz), hop two stars northeast along Andromeda to Mirach, then step two stars perpendicular to Messier 31.",
      "Northern Hemisphere (mid-latitudes ~40°N): rises in the east-northeast after dusk and passes nearly overhead in October and November 2026.",
      "Southern Hemisphere (~30°S): reaches roughly 19° above the northern horizon around local midnight; remains below the horizon south of 49°S.",
    ],
    thumbnail: "/thumbnails/ep03-andromeda.jpg",
    youtubeUrl: "https://www.youtube.com/@skyscaled",
    sources: [
      {
        label: "NASA Night Sky Network — Catch Andromeda Rising",
        url: "https://science.nasa.gov/solar-system/skywatching/night-sky-network/catch-andromeda-rising/",
      },
      {
        label: "NASA Hubble Messier 31 Fact Sheet",
        url: "https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/messier-31/",
      },
    ],
  },
  {
    id: "ep04-earth-motion",
    code: "EP04 • PHYSICS",
    title: "How Fast Is Earth Moving Through Space?",
    format: "3-Min Explainer",
    category: "Planetary Physics",
    publishedDateUtc: "October 11, 2026 • 15:00 UTC",
    duration: "3:00",
    hookQuestion:
      "When you sit completely still for 3 minutes, how many kilometers does Earth carry you through the cosmos?",
    scaleModelSummary:
      "4 stacked velocity frames: Equatorial spin (1,670 km/h) + Solar orbit (107,200 km/h) + Galactic orbit (~792,000 km/h) + CMB drift (~1.3 million km/h).",
    keyFacts: [
      "Earth's equator rotates at ~460 m/s (1,670 km/h), dropping to 0 km/h at the geographic poles.",
      "Earth orbits the Sun at 29.78 km/s — covering ~5,360 km during one 180-second explainer.",
      "The solar system orbits the Milky Way center at ~220 km/s (~792,000 km/h), taking ~225–250 million years per galactic lap.",
    ],
    thumbnail: "/thumbnails/ep04-earth-motion.jpg",
    youtubeUrl: "https://www.youtube.com/@skyscaled",
    sources: [
      {
        label: "NASA GSFC Earth Fact Sheet",
        url: "https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html",
      },
      {
        label: "NASA JPL Night Sky Network — How Fast Are You Moving?",
        url: "https://nightsky.jpl.nasa.gov/media/documents/resources/HowFast.pdf",
      },
    ],
  },
  {
    id: "ep05-starship-reusable",
    code: "EP05 • ORBITAL",
    title: "Why Starship Has to Be Fully Reusable",
    format: "3-Min Explainer",
    category: "Orbital Engineering",
    publishedDateUtc: "October 13, 2026 • 15:00 UTC",
    duration: "3:05",
    hookQuestion:
      "Imagine flying a Boeing 747 across the ocean once and scrapping the entire aircraft upon arrival — how does full two-stage reusability change orbital physics?",
    scaleModelSummary:
      "Super Heavy booster (33 Raptor engines) + Starship upper stage (6 Raptor engines) engineered for tower catch and rapid orbital tanker refilling.",
    keyFacts: [
      "Traditional expendable rockets discard multi-million-dollar stages after a single 8-minute ascent.",
      "Catching the Super Heavy booster with launch-tower mechanical arms ('Mechazilla') eliminates landing-leg mass penalties.",
      "Deep-space Artemis lunar landings require orbital propellant transfer in low Earth orbit.",
    ],
    thumbnail: "/thumbnails/ep05-starship-reusable.jpg",
    youtubeUrl: "https://www.youtube.com/@skyscaled",
    sources: [
      {
        label: "SpaceX Starship Architecture",
        url: "https://www.spacex.com/vehicles/starship/",
      },
      {
        label: "NASA Artemis Program Overview",
        url: "https://www.nasa.gov/humans-in-space/artemis/",
      },
    ],
  },
  {
    id: "ep07-orionids-long",
    code: "EP07 • SKY GUIDE",
    title: "The Orionids: Meteors From Halley's Comet (Peak October 21–22, 2026)",
    format: "3-Min Explainer",
    category: "Global Sky Guides",
    publishedDateUtc: "October 18, 2026 • 15:00 UTC",
    duration: "3:01",
    hookQuestion:
      "How can you watch vaporizing dust grains shed by Comet 1P/Halley centuries ago without waiting until Halley returns in 2061?",
    scaleModelSummary:
      "Sand-grain-sized cometary particles striking Earth's upper atmosphere ~100 km up at 66 km/s (237,600 km/h).",
    keyFacts: [
      "Active from October 2 to November 7, 2026, with the International Meteor Organization (IMO) peak on October 21–22, 2026 (ZHR ~20).",
      "The radiant sits at RA 95°, Dec +16° near Betelgeuse in Orion, making the shower visible across both Northern and Southern Hemispheres.",
      "On October 21–22, 2026, the ~78–80% waxing gibbous Moon sets around 02:00–03:00 local time at mid-latitudes, leaving dark pre-dawn skies.",
    ],
    thumbnail: "/thumbnails/ep07-orionids-long.jpg",
    youtubeUrl: "https://www.youtube.com/@skyscaled",
    sources: [
      {
        label: "International Meteor Organization 2026 Calendar",
        url: "https://www.imo.net/resources/calendar/2026/",
      },
      {
        label: "NASA Solar System Exploration — Orionids",
        url: "https://science.nasa.gov/solar-system/meteors-meteorites/orionids/",
      },
    ],
  },
  {
    id: "ep08-black-hole",
    code: "EP08 • ASTROPHYSICS",
    title: "What Would Happen If You Fell Into a Black Hole?",
    format: "3-Min Explainer",
    category: "Deep Space & Cosmology",
    publishedDateUtc: "October 22, 2026 • 15:00 UTC",
    duration: "3:06",
    hookQuestion:
      "Why does falling into a stellar-mass black hole shred an astronaut before the event horizon, while a supermassive black hole lets you cross unharmed?",
    scaleModelSummary:
      "Stellar black hole (~10 solar masses, ~30 km horizon radius) vs. Supermassive black hole (millions of solar masses, horizon wider than planetary orbits).",
    keyFacts: [
      "Tidal force scales inversely with the cube of distance: near a small black hole, gravity pulls far harder on your feet than on your head ('spaghettification').",
      "Across the vast event horizon of a supermassive black hole (such as Sagittarius A* or M87*), the tidal gradient at the boundary is gentle.",
      "Once inside any event horizon, all future-directed paths in spacetime curve inward toward the central singularity.",
    ],
    thumbnail: "/thumbnails/ep08-black-hole.jpg",
    youtubeUrl: "https://www.youtube.com/@skyscaled",
    sources: [
      {
        label: "NASA — What Happens When Something Gets Too Close to a Black Hole?",
        url: "https://science.nasa.gov/universe/what-happens-when-something-gets-too-close-to-a-black-hole/",
      },
      {
        label: "NASA Goddard Supermassive Black Hole Visualization",
        url: "https://science.nasa.gov/universe/black-holes/supermassive-black-holes/new-nasa-black-hole-visualization-takes-viewers-beyond-the-brink/",
      },
    ],
  },
  {
    id: "ep09-starlink-v3",
    code: "EP09 • ORBITAL",
    title: "How Starlink Works (and Why V3 Needs Starship)",
    format: "3-Min Explainer",
    category: "Orbital Engineering",
    publishedDateUtc: "October 23, 2026 • 15:00 UTC",
    duration: "3:03",
    hookQuestion:
      "Why does low-Earth-orbit satellite internet beat geostationary latency by more than 10x, and why do V3 satellites require Starship?",
    scaleModelSummary:
      "LEO altitude (~550 km) vs. Geostationary orbit (35,786 km): a 65x shorter signal path for phased-array radio and optical space lasers.",
    keyFacts: [
      "Geostationary satellites sit at 35,786 km, creating a minimum ~477 ms round-trip light-speed delay; LEO satellites at ~550 km cut latency to ~25–35 ms.",
      "Optical inter-satellite laser links route data across vacuum between spacecraft without touching intermediate ground stations.",
      "Starship Flight 14 deployed 26 full-scale Starlink V3 satellites (~2 tonnes each) on September 28, 2026.",
    ],
    thumbnail: "/thumbnails/ep09-starlink-v3.jpg",
    youtubeUrl: "https://www.youtube.com/@skyscaled",
    sources: [
      {
        label: "Starlink Technology Specifications",
        url: "https://www.starlink.com/technology",
      },
      {
        label: "SpaceX Starship Flight 14 Report",
        url: "https://www.spacex.com/launches/starship-flight-14/",
      },
    ],
  },
  {
    id: "ep10-webb-brown-dwarfs",
    code: "EP10 • WEBB DISCOVERY",
    title: "Webb Finds Brown Dwarfs Only Twice Jupiter's Mass",
    format: "3-Min Explainer",
    category: "Deep Space & Cosmology",
    publishedDateUtc: "October 25, 2026 • 15:00 UTC",
    duration: "3:04",
    hookQuestion:
      "How small can a free-floating object form like a star in space before it is no heavier than a giant planet?",
    scaleModelSummary:
      "Sun = 1,047 Jupiters → Typical brown dwarf = 13 to 80 Jupiters → Webb's smallest IC 348 object = ~2 Jupiter masses (0.19% of the Sun's mass).",
    keyFacts: [
      "In star cluster IC 348 (~1,000 light-years away in Perseus), JWST identified free-floating brown dwarfs down to roughly two Jupiter masses.",
      "One planetary-mass brown dwarf exhibits hydrocarbon spectral signatures and a surrounding disk capable of forming moons or miniature planets.",
      "Observations challenge theoretical models of the minimum mass required for collapsing molecular clouds.",
    ],
    thumbnail: "/thumbnails/ep10-webb-brown-dwarfs.jpg",
    youtubeUrl: "https://www.youtube.com/@skyscaled",
    sources: [
      {
        label: "NASA Webb IC 348 Star Formation Release",
        url: "https://science.nasa.gov/missions/webb/nasas-webb-reveals-dynamic-panorama-of-star-formation/",
      },
      {
        label: "ESA/Webb Science Release weic2619 (CC BY 4.0)",
        url: "https://esawebb.org/news/weic2619/",
      },
    ],
  },
  {
    id: "ep12-boomerang-nebula",
    code: "EP12 • DEEP SPACE",
    title: "The Coldest Place in the Universe: The Boomerang Nebula",
    format: "3-Min Explainer",
    category: "Deep Space & Cosmology",
    publishedDateUtc: "October 29, 2026 • 15:00 UTC",
    duration: "3:02",
    hookQuestion:
      "Deep space sits at 2.7 Kelvin from the afterglow of the Big Bang — so how did a dying star 5,000 light-years away cool a nebula down to 1 Kelvin?",
    scaleModelSummary:
      "Absolute zero = 0 K (-273.15 °C) → Boomerang Nebula = 1 K (-272.15 °C) → Deep Space CMB = 2.725 K (-270.4 °C).",
    keyFacts: [
      "Located 5,000 light-years from Earth in the constellation Centaurus, the Boomerang Nebula is a protoplanetary nebula.",
      "Gas ejected from its central dying star expands outward at ~164 km/s (over 590,000 km/h).",
      "Rapid adiabatic expansion acts like a cosmic refrigerator, dropping the gas temperature below the 2.7 K Cosmic Microwave Background.",
    ],
    thumbnail: "/thumbnails/ep12-boomerang-nebula.jpg",
    youtubeUrl: "https://www.youtube.com/@skyscaled",
    sources: [
      {
        label: "NASA Hubble — Boomerang Nebula",
        url: "https://science.nasa.gov/missions/hubble/boomerang-nebula/",
      },
      {
        label: "ESA/Hubble Release heic0301 (CC BY 4.0)",
        url: "https://esahubble.org/news/heic0301/",
      },
    ],
  },
  {
    id: "ep14-voyager-light-day",
    code: "EP14 • MILESTONE",
    title: "Voyager 1 Reaches One Light-Day on November 18, 2026",
    format: "3-Min Explainer",
    category: "Deep Space & Cosmology",
    publishedDateUtc: "November 2, 2026 • 15:00 UTC",
    duration: "3:07",
    hookQuestion:
      "After launching on September 5, 1977, what happens on November 18, 2026 at 10:16:07 UTC when Voyager 1 crosses 25.9 billion kilometers from Earth?",
    scaleModelSummary:
      "Moon = 1.28 light-seconds → Sun = 8.3 light-minutes → Voyager 1 on November 18, 2026 = 24 light-hours (1 full light-day).",
    keyFacts: [
      "One light-day equals approximately 25.9 billion km (16.1 billion miles), or 173.1 Astronomical Units.",
      "NASA calculates Voyager 1 crosses the 1-light-day threshold on November 18, 2026 at 10:16:07 UTC — 49 years, 2 months, and 11 days after launch.",
      "A two-way radio handshake via NASA's Deep Space Network (Goldstone, Madrid, Canberra) requires 48 hours round-trip.",
    ],
    thumbnail: "/thumbnails/ep14-voyager-light-day.jpg",
    youtubeUrl: "https://www.youtube.com/@skyscaled",
    sources: [
      {
        label: "NASA Voyager 1 — What Is a Light-Day?",
        url: "https://science.nasa.gov/mission/voyager/voyager-1/voyager-1-what-is-a-light-day/",
      },
      {
        label: "NASA Deep Space Network",
        url: "https://www.nasa.gov/communicating-with-missions/dsn/",
      },
    ],
  },
  {
    id: "short-vy-canis-majoris",
    code: "SHORT • SCALE",
    title: "This Star Would Swallow Jupiter's Orbit (VY Canis Majoris)",
    format: "Cosmic Paradox Short",
    category: "Deep Space & Cosmology",
    publishedDateUtc: "October 19, 2026 • 23:00 UTC",
    duration: "0:48",
    hookQuestion:
      "Light circles our Sun in 14.5 seconds — why would a beam of light need nearly 6 hours to circle the red hypergiant VY Canis Majoris?",
    scaleModelSummary:
      "VY Canis Majoris radius ≈ 1,420 solar radii (~9.88 × 10⁸ km), extending past Jupiter's 5.2 AU orbit.",
    keyFacts: [
      "Placed at the center of our solar system, VY Canis Majoris would engulf Mercury, Venus, Earth, Mars, and Jupiter.",
      "Located ~3,900 light-years away in Canis Major, its extreme size rivals hypergiants such as Stephenson 2-18 and WOH G64.",
    ],
    thumbnail: "/thumbnails/short-vy-canis-majoris.jpg",
    youtubeUrl: "https://youtu.be/g0Hn32TGsR0",
    youtubeId: "g0Hn32TGsR0",
    featured: true,
    sources: [
      {
        label: "NASA/ESA Hubble VY Canis Majoris Observations",
        url: "https://science.nasa.gov/missions/hubble/",
      },
    ],
  },
  {
    id: "short-ton-618",
    code: "SHORT • PARADOX",
    title: "A 66-Billion-Solar-Mass Black Hole Thinner Than Air (TON 618)",
    format: "Cosmic Paradox Short",
    category: "Deep Space & Cosmology",
    publishedDateUtc: "October 20, 2026 • 15:00 UTC",
    duration: "0:46",
    hookQuestion:
      "How can an ultramassive black hole weighing 66 billion Suns have an average density inside its event horizon lower than Earth's atmosphere at sea level?",
    scaleModelSummary:
      "Schwarzschild radius scales linearly with mass (R ∝ M), so volume scales with M³ — making giant black holes surprisingly low in average density.",
    keyFacts: [
      "TON 618's event horizon spans roughly 390 billion km across (~2,600 AU, or more than 40x Neptune's orbital radius).",
      "Because volume grows with the cube of radius, dividing 66 billion solar masses by that enormous sphere yields a mean density lower than sea-level air (~1.2 kg/m³).",
    ],
    thumbnail: "/thumbnails/short-ton-618.jpg",
    youtubeUrl: "https://www.youtube.com/@skyscaled/shorts",
    sources: [
      {
        label: "NASA Black Hole Fundamentals",
        url: "https://science.nasa.gov/universe/black-holes/",
      },
    ],
  },
  {
    id: "short-venus-day-year",
    code: "SHORT • PARADOX",
    title: "A Day on Venus Lasts Longer Than Its Year (And the Sun Rises in the West)",
    format: "Cosmic Paradox Short",
    category: "Planetary Physics",
    publishedDateUtc: "October 21, 2026 • 23:00 UTC",
    duration: "0:42",
    hookQuestion:
      "How can a planet take 243 Earth days to spin once on its axis, yet complete a full orbit around the Sun in 225 Earth days?",
    scaleModelSummary:
      "Venus equatorial rotation = 6.5 km/h (walking pace) vs. Earth's 1,670 km/h equatorial spin.",
    keyFacts: [
      "Venus rotates retrograde (east to west) once every 243.02 Earth days while orbiting the Sun in 224.7 Earth days.",
      "Combined with its orbital motion, one solar day on Venus (sunrise to sunrise) lasts 116.75 Earth days, with the Sun rising in the west.",
      "Venus passes inferior conjunction between Earth and the Sun on October 24, 2026 at approximately 03:44 UTC.",
    ],
    thumbnail: "/thumbnails/short-venus-day-year.jpg",
    youtubeUrl: "https://www.youtube.com/@skyscaled/shorts",
    sources: [
      {
        label: "NASA GSFC Venus Fact Sheet",
        url: "https://nssdc.gsfc.nasa.gov/planetary/factsheet/venusfact.html",
      },
      {
        label: "NASA Solar System Exploration — Venus Facts",
        url: "https://science.nasa.gov/venus/venus-facts/",
      },
    ],
  },
  {
    id: "short-saturn-float",
    code: "SHORT • PARADOX",
    title: "Could Saturn Really Float in Water?",
    format: "Cosmic Paradox Short",
    category: "Planetary Physics",
    publishedDateUtc: "October 22, 2026 • 23:00 UTC",
    duration: "0:44",
    hookQuestion:
      "More than 760 Earths fit inside Saturn by volume — so how is Saturn the only planet in our solar system less dense than liquid water?",
    scaleModelSummary:
      "Saturn mean bulk density = 0.687 g/cm³ vs. liquid water = 1.000 g/cm³ vs. Earth = 5.514 g/cm³.",
    keyFacts: [
      "Composed predominantly of molecular hydrogen and helium, Saturn has only ~95 times Earth's mass spread across ~764 times Earth's volume.",
      "At 687 kg/m³, Saturn carries roughly two-thirds the density of water.",
    ],
    thumbnail: "/thumbnails/short-saturn-float.jpg",
    youtubeUrl: "https://www.youtube.com/@skyscaled/shorts",
    sources: [
      {
        label: "NASA GSFC Saturn Fact Sheet",
        url: "https://nssdc.gsfc.nasa.gov/planetary/factsheet/saturnfact.html",
      },
    ],
  },
  {
    id: "short-ancient-sunlight",
    code: "SHORT • PARADOX",
    title: "Is Sunlight 8 Minutes Old… or 100,000 Years Old?",
    format: "Cosmic Paradox Short",
    category: "Planetary Physics",
    publishedDateUtc: "October 23, 2026 • 23:00 UTC",
    duration: "0:47",
    hookQuestion:
      "Light crosses the 149.6 million km from the Sun's surface to Earth in 8 minutes 20 seconds — why did that energy take thousands of years to escape the Sun's interior?",
    scaleModelSummary:
      "Vacuum flight across 1 AU = 500 seconds vs. Radiative-zone random walk across 700,000 km = 10,000 to 170,000 years.",
    keyFacts: [
      "Gamma-ray photons forged by core hydrogen fusion are absorbed and re-emitted trillions of times in random directions through the dense radiative zone.",
      "NASA solar physics models place the average photon diffusion time from core to surface between 10,000 and 170,000 years.",
    ],
    thumbnail: "/thumbnails/short-ancient-sunlight.jpg",
    youtubeUrl: "https://www.youtube.com/@skyscaled/shorts",
    sources: [
      {
        label: "NASA Sun Facts & Radiative Diffusion",
        url: "https://science.nasa.gov/sun/facts/",
      },
    ],
  },
  {
    id: "short-astronauts-float",
    code: "SHORT • PARADOX",
    title: "Why Do Astronauts Float When Gravity at the Space Station Is 90% as Strong?",
    format: "Cosmic Paradox Short",
    category: "Orbital Engineering",
    publishedDateUtc: "October 24, 2026 • 23:00 UTC",
    duration: "0:45",
    hookQuestion:
      "At 400 km above Earth, gravity still pulls with ~89% of its surface strength — so why do astronauts inside the International Space Station float weightlessly?",
    scaleModelSummary:
      "Orbital free-fall at 7.66 km/s (27,600 km/h): falling toward Earth at the exact rate Earth's curved surface drops away beneath you.",
    keyFacts: [
      "Microgravity in low Earth orbit is not the absence of gravity; at 400 km altitude, gravitational acceleration is ~8.7 m/s² (vs. 9.8 m/s² on the ground).",
      "The station and crew travel sideways at ~7.66 km/s, completing 16 orbits per 24 hours in continuous free-fall.",
    ],
    thumbnail: "/thumbnails/short-astronauts-float.jpg",
    youtubeUrl: "https://www.youtube.com/@skyscaled/shorts",
    sources: [
      {
        label: "NASA — What Is Microgravity?",
        url: "https://www.nasa.gov/centers-and-facilities/glenn/what-is-microgravity/",
      },
    ],
  },
  {
    id: "short-moon-one-side",
    code: "SHORT • PARADOX",
    title: "The Moon Spins on Its Axis — So Why Do We Only Ever See One Side?",
    format: "Cosmic Paradox Short",
    category: "Planetary Physics",
    publishedDateUtc: "October 25, 2026 • 23:00 UTC",
    duration: "0:46",
    hookQuestion:
      "If the Moon did not rotate on its axis at all, we would see both sides over a month — how does synchronous tidal locking keep the far side hidden from Earth?",
    scaleModelSummary:
      "1 axial spin = 27.3217 Earth days = 1 sidereal orbit around Earth.",
    keyFacts: [
      "Earth's gravitational tidal pull slowed the Moon's early rotation until its spin period matched its orbital period (1:1 synchronous rotation).",
      "Lunar libration (slight orbital eccentricity and axial tilt) lets observers on Earth peek across ~59% of the lunar surface over time.",
    ],
    thumbnail: "/thumbnails/short-moon-one-side.jpg",
    youtubeUrl: "https://www.youtube.com/@skyscaled/shorts",
    sources: [
      {
        label: "NASA Scientific Visualization Studio — Tidal Locking",
        url: "https://science.nasa.gov/moon/tidal-locking/",
      },
    ],
  },
  {
    id: "short-closest-sun-winter",
    code: "SHORT • PARADOX",
    title: "Earth Is Closest to the Sun in Early January — So Why Is It Winter in the North?",
    format: "Cosmic Paradox Short",
    category: "Planetary Physics",
    publishedDateUtc: "October 26, 2026 • 23:00 UTC",
    duration: "0:44",
    hookQuestion:
      "Earth reaches perihelion on January 3, 2027 at 02:33 UTC — about 5 million km closer to the Sun than in July. Why doesn't distance control the seasons?",
    scaleModelSummary:
      "Perihelion (January 3, 2027): 147.1 million km vs. Aphelion (July 2026): 152.1 million km — driven by Earth's 23.44° axial tilt.",
    keyFacts: [
      "Seasons are governed by Earth's 23.44° axial tilt, which controls solar elevation angle and daylight duration across each hemisphere.",
      "In January, the Northern Hemisphere tilts away from the Sun (winter) while the Southern Hemisphere tilts toward the Sun (summer).",
    ],
    thumbnail: "/thumbnails/short-closest-sun-winter.jpg",
    youtubeUrl: "https://www.youtube.com/@skyscaled/shorts",
    sources: [
      {
        label: "NASA Space Place — What Causes the Seasons?",
        url: "https://spaceplace.nasa.gov/seasons/en/",
      },
    ],
  },
  {
    id: "short-space-cold-stay-cool",
    code: "SHORT • PARADOX",
    title: "Space Is −270 °C — So Why Do Astronauts Struggle to Stay Cool?",
    format: "Cosmic Paradox Short",
    category: "Orbital Engineering",
    publishedDateUtc: "October 27, 2026 • 23:00 UTC",
    duration: "0:46",
    hookQuestion:
      "Deep space sits near −270 °C, colder than any freezer on Earth — why is overheating one of the biggest thermal dangers for spacewalkers and spacecraft?",
    scaleModelSummary:
      "Vacuum acts like the insulated wall of a thermos flask: zero air molecules for conduction or convection, leaving only infrared radiation.",
    keyFacts: [
      "On Earth, air carries body heat away by convection; in the vacuum of space, heat can only escape slowly as infrared radiation.",
      "EVA astronauts wear Liquid Cooling and Ventilation Garments laced with ~90 meters of water tubing, while the ISS deploys giant ammonia radiator panels.",
    ],
    thumbnail: "/thumbnails/short-space-cold-stay-cool.jpg",
    youtubeUrl: "https://www.youtube.com/@skyscaled/shorts",
    sources: [
      {
        label: "NASA — Cooling the International Space Station",
        url: "https://www.nasa.gov/international-space-station/",
      },
    ],
  },
];

export const GLOBAL_SKY_EVENTS: SkyEventItem[] = [
  {
    id: "sky-saturn-opposition-2026",
    title: "Saturn at Opposition & Peak October Visibility",
    dateUtc: "October 4–31, 2026 (Opposition: October 4, 2026 • 12:21 UTC)",
    peakWindowUtc: "Visible Sunset to Sunrise All October 2026 (70.1 Light-Minutes Away)",
    category: "Planetary Alignment",
    constellation: "Cetus (near the Pisces border)",
    scaleComparison:
      "Distance: 8.43 AU (1.262 billion km). Shrink Saturn's 10-meter-thick main rings to a 0.1 mm sheet of paper and the ring system spans 2.8 km across.",
    northernHemisphere:
      "Rises in the east-southeast around sunset and climbs high into the southern sky around local midnight. Shines at magnitude +0.3 as a steady golden point.",
    southernHemisphere:
      "Rises in the east-northeast at dusk and transits high across the northern sky around local midnight, well placed across all southern latitudes.",
    opticalEquipment:
      "Naked eye sees a bright golden star-like point; any beginner telescope at 30x–50x resolves the rings and largest moon Titan.",
    thumbnail: "/thumbnails/sky-saturn-opposition.jpg",
    youtubeUrl: "https://www.youtube.com/@skyscaled",
    sources: [
      {
        label: "NASA Saturn Facts & Ephemeris",
        url: "https://science.nasa.gov/saturn/facts/",
      },
    ],
  },
  {
    id: "sky-orionids-2026",
    title: "Orionid Meteor Shower Peak (Halley's Comet Debris)",
    dateUtc: "October 21–22, 2026 (Active October 2 – November 7, 2026)",
    peakWindowUtc: "Pre-Dawn Hours After ~02:30 Local Time on October 21 & 22, 2026",
    category: "Meteor Shower",
    constellation: "Orion (Radiant RA 95°, Dec +16°)",
    scaleComparison:
      "Dust grains shed by Comet 1P/Halley strike the atmosphere at 66 km/s (237,600 km/h), vaporizing ~100 km above Earth's surface.",
    northernHemisphere:
      "Wait until the ~79% waxing gibbous Moon sets around 02:00–03:00 local time, then look toward the southeast and overhead before dawn.",
    southernHemisphere:
      "Because the radiant near Orion's club sits at Dec +16°, Southern Hemisphere observers enjoy dark pre-dawn views looking north-northeast after moonset.",
    opticalEquipment:
      "Naked eye only — lie back with a wide view of the sky and allow 20 minutes for dark adaptation.",
    thumbnail: "/thumbnails/ep07-orionids-long.jpg",
    youtubeUrl: "https://www.youtube.com/@skyscaled",
    sources: [
      {
        label: "IMO 2026 Meteor Shower Calendar",
        url: "https://www.imo.net/resources/calendar/2026/",
      },
      {
        label: "NASA Orionids Overview",
        url: "https://science.nasa.gov/solar-system/meteors-meteorites/orionids/",
      },
    ],
  },
  {
    id: "sky-full-moon-oct-2026",
    title: "October Full Moon: Geometry of Sunset Moonrise",
    dateUtc: "October 26, 2026 • 04:12 UTC",
    peakWindowUtc: "Moonrise at Local Sunset on October 25–26, 2026",
    category: "Lunar Phase",
    constellation: "Aries / Pisces border",
    scaleComparison:
      "384,400 km mean distance (1.28 light-seconds). A full Moon occurs when the Moon sits 180° opposite the Sun in ecliptic longitude.",
    northernHemisphere:
      "Rises in the east-northeast as the Sun sets in the west-southwest, climbing high across the southern sky at local midnight.",
    southernHemisphere:
      "Rises in the east as the Sun sets in the west, arcing across the northern sky throughout the night.",
    opticalEquipment:
      "Naked eye or 7x–10x binoculars (best along the terminator on the nights before and after October 26, 2026).",
    thumbnail: "/thumbnails/short-moon-one-side.jpg",
    youtubeUrl: "https://www.youtube.com/@skyscaled",
    sources: [
      {
        label: "NASA GSFC Six Millennium Catalog of Phases of the Moon",
        url: "https://eclipse.gsfc.nasa.gov/phase/phases2001.html",
      },
    ],
  },
  {
    id: "sky-new-moon-nov-2026",
    title: "November New Moon: Dark-Sky Window for Andromeda (M31)",
    dateUtc: "November 9, 2026 • 07:02 UTC",
    peakWindowUtc: "Darkest Skies Worldwide: November 7–11, 2026",
    category: "Lunar Phase",
    constellation: "Andromeda / Pegasus (Deep-Sky Window)",
    scaleComparison:
      "With zero lunar glare, photons that left the Andromeda Galaxy 2.5 million years ago can register directly on the dark-adapted human retina.",
    northernHemisphere:
      "Look high in the east to overhead during evening hours on November 7–11, 2026; trace two star hops from Alpheratz and Mirach to M31.",
    southernHemisphere:
      "Face due north 2–3 hours after sunset; from 30°S, Andromeda reaches ~19° altitude above the northern horizon.",
    opticalEquipment:
      "Naked eye from a dark site, or 8x42 / 10x50 binoculars to reveal the bright galactic core and elongated disk.",
    thumbnail: "/thumbnails/ep03-andromeda.jpg",
    youtubeUrl: "https://www.youtube.com/@skyscaled",
    sources: [
      {
        label: "NASA GSFC Moon Phases Catalog",
        url: "https://eclipse.gsfc.nasa.gov/phase/phases2001.html",
      },
      {
        label: "NASA Night Sky Network — Catch Andromeda Rising",
        url: "https://science.nasa.gov/solar-system/skywatching/night-sky-network/catch-andromeda-rising/",
      },
    ],
  },
  {
    id: "sky-leonids-2026",
    title: "Leonid Meteor Shower Peak (Comet 55P/Tempel-Tuttle)",
    dateUtc: "November 17, 2026 • 23:45 UTC (Night of November 17–18, 2026)",
    peakWindowUtc: "November 17, 2026 • 23:45 UTC (IMO Predicted Maximum)",
    category: "Meteor Shower",
    constellation: "Leo (Radiant inside the Sickle of Leo)",
    scaleComparison:
      "Fastest major annual meteors: Comet Tempel-Tuttle debris hits Earth head-on at 71 km/s (255,600 km/h).",
    northernHemisphere:
      "The first-quarter Moon sets around local midnight on November 17–18, 2026, leaving dark skies from midnight until dawn as Leo climbs high in the east and south.",
    southernHemisphere:
      "Look northeast after local midnight once the Sickle of Leo rises and the first-quarter Moon has set; best between 02:00 and dawn.",
    opticalEquipment:
      "Naked eye — wide field of view away from city lights after local midnight.",
    thumbnail: "/thumbnails/ep01-universe-scale.jpg",
    youtubeUrl: "https://www.youtube.com/@skyscaled",
    sources: [
      {
        label: "International Meteor Organization 2026 Calendar",
        url: "https://www.imo.net/resources/calendar/2026/",
      },
      {
        label: "NASA Solar System Exploration — Leonids",
        url: "https://science.nasa.gov/solar-system/meteors-meteorites/leonids/",
      },
    ],
  },
  {
    id: "sky-voyager-1-light-day",
    title: "Voyager 1 Crosses One Light-Day From Earth",
    dateUtc: "November 18, 2026 • 10:16:07 UTC",
    peakWindowUtc: "Exact Milestone: November 18, 2026 at 10:16:07 UTC (NASA Ephemeris)",
    category: "Deep-Space Milestone",
    constellation: "Ophiuchus (Interstellar Space, Heliopause Crossed 2012)",
    scaleComparison:
      "25,902,068,371 km (173.1 AU) from Earth — the first human-built spacecraft in history to reach a distance of 24 light-hours.",
    northernHemisphere:
      "Ophiuchus sits in the western evening twilight in mid-November; NASA's Deep Space Network stations in Goldstone (35°N) and Madrid (40°N) track the 24-hour radio signal.",
    southernHemisphere:
      "NASA's Canberra Deep Space Communication Complex in Australia (35°S) completes the 360° global tracking ring as Earth rotates.",
    opticalEquipment:
      "Radio telemetry only (tracked via 70-meter Deep Space Network antennas at S-band and X-band frequencies).",
    thumbnail: "/thumbnails/ep14-voyager-light-day.jpg",
    youtubeUrl: "https://www.youtube.com/@skyscaled",
    sources: [
      {
        label: "NASA Voyager 1 — What Is a Light-Day?",
        url: "https://science.nasa.gov/mission/voyager/voyager-1/voyager-1-what-is-a-light-day/",
      },
    ],
  },
];
