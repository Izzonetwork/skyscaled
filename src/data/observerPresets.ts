export type TelescopePreset = {
  id: string;
  name: string;
  apertureMm: number;
  focalLengthMm: number;
  nativeRatio: string;
};

export type CameraPreset = {
  id: string;
  name: string;
  widthMm: number;
  heightMm: number;
  pixelUm: number;
  resX: number;
  resY: number;
};

export type EyepiecePreset = {
  id: string;
  name: string;
  focalMm: number;
  afov: number;
};

export type SkyTarget = {
  id: string;
  name: string;
  short: string;
  arcminW: number;
  arcminH: number;
  sizeLabel: string;
  image: string;
  alt: string;
  credit: string;
  fit: "cover" | "contain";
};

export type SkySite = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  note: string;
  kind: "observatory" | "reserve";
};

export const MULTIPLIERS: { id: string; label: string; value: number }[] = [
  { id: "r063", label: "0.63x Reducer", value: 0.63 },
  { id: "r070", label: "0.7x Reducer", value: 0.7 },
  { id: "r080", label: "0.8x Flattener/Reducer", value: 0.8 },
  { id: "native", label: "1.0x Native", value: 1 },
  { id: "b15", label: "1.5x Barlow", value: 1.5 },
  { id: "b20", label: "2.0x Barlow", value: 2 },
  { id: "b30", label: "3.0x Planetary Barlow", value: 3 },
  { id: "b50", label: "5.0x Powermate", value: 5 },
];

export const TELESCOPE_PRESETS: TelescopePreset[] = [
  { id: "redcat51", name: "RedCat 51", apertureMm: 51, focalLengthMm: 250, nativeRatio: "f/4.9" },
  { id: "ed80", name: "80mm ED APO Refractor", apertureMm: 80, focalLengthMm: 480, nativeRatio: "f/6" },
  { id: "apo102", name: "102mm APO Refractor", apertureMm: 102, focalLengthMm: 714, nativeRatio: "f/7" },
  { id: "newt130", name: "130mm Newtonian / Astrograph", apertureMm: 130, focalLengthMm: 650, nativeRatio: "f/5" },
  { id: "dob8", name: '8" Dobsonian', apertureMm: 203, focalLengthMm: 1200, nativeRatio: "f/5.9" },
  { id: "c8", name: "Celestron C8 SCT", apertureMm: 203, focalLengthMm: 2032, nativeRatio: "f/10" },
  { id: "edge11", name: '11" EdgeHD SCT', apertureMm: 279, focalLengthMm: 2800, nativeRatio: "f/10" },
  { id: "seestar", name: "Seestar S50 Smart Scope", apertureMm: 50, focalLengthMm: 250, nativeRatio: "f/5" },
];

export const CAMERA_PRESETS: CameraPreset[] = [
  { id: "asi2600", name: "ZWO ASI2600MC / MM Pro", widthMm: 23.5, heightMm: 15.7, pixelUm: 3.76, resX: 6248, resY: 4176 },
  { id: "asi533", name: "ZWO ASI533MC / MM Pro", widthMm: 11.31, heightMm: 11.31, pixelUm: 3.76, resX: 3008, resY: 3008 },
  { id: "asi585", name: "ZWO ASI585MC Pro", widthMm: 11.14, heightMm: 6.26, pixelUm: 2.9, resX: 3840, resY: 2160 },
  { id: "asi294", name: "ZWO ASI294MC / MM Pro", widthMm: 19.1, heightMm: 13.0, pixelUm: 4.63, resX: 4144, resY: 2822 },
  { id: "asi6200", name: "ZWO ASI6200MC / MM Pro", widthMm: 36.0, heightMm: 24.0, pixelUm: 3.76, resX: 9576, resY: 6388 },
  { id: "asi678", name: "ZWO ASI678MC Planetary", widthMm: 7.68, heightMm: 4.32, pixelUm: 2.0, resX: 3840, resY: 2160 },
  { id: "fullframe", name: "Full Frame DSLR / Mirrorless", widthMm: 36.0, heightMm: 24.0, pixelUm: 4.3, resX: 8372, resY: 5581 },
  { id: "apsc", name: "APS-C DSLR / Mirrorless", widthMm: 22.3, heightMm: 14.9, pixelUm: 3.72, resX: 5995, resY: 4005 },
  { id: "mft", name: "Micro Four Thirds", widthMm: 17.3, heightMm: 13.0, pixelUm: 3.3, resX: 5242, resY: 3939 },
];

export const EYEPIECE_PRESETS: EyepiecePreset[] = [
  { id: "ploss40", name: "40mm Plössl 52°", focalMm: 40, afov: 52 },
  { id: "wide24", name: "24mm Widefield 68°", focalMm: 24, afov: 68 },
  { id: "ultra14", name: "14mm Ultra-Wide 82°", focalMm: 14, afov: 82 },
  { id: "ethos9", name: "9mm Nagler/Ethos 100°", focalMm: 9, afov: 100 },
  { id: "planet5", name: "5mm Planetary 60°", focalMm: 5, afov: 60 },
];

export const SKY_TARGETS: SkyTarget[] = [
  {
    id: "m31",
    name: "M31 Andromeda Galaxy",
    short: "M31",
    arcminW: 190,
    arcminH: 60,
    sizeLabel: "190′ × 60′",
    image: "/images/space/andromeda-m31.jpg",
    alt: "The Andromeda Galaxy spanning a wide field",
    credit: "Public-domain astronomical photograph via Wikimedia Commons. Frame scaled to a 190′ × 60′ catalog field.",
    fit: "cover",
  },
  {
    id: "m42",
    name: "M42 Orion Nebula",
    short: "M42",
    arcminW: 85,
    arcminH: 60,
    sizeLabel: "85′ × 60′",
    image: "/images/space/orion-nebula-m42.jpg",
    alt: "Hubble mosaic of the Orion Nebula",
    credit: "NASA, ESA, M. Robberto (STScI) — Hubble, public domain. Frame scaled to an 85′ × 60′ catalog field.",
    fit: "cover",
  },
  {
    id: "m45",
    name: "M45 Pleiades",
    short: "M45",
    arcminW: 110,
    arcminH: 110,
    sizeLabel: "110′ × 110′",
    image: "/images/space/pleiades-m45.jpg",
    alt: "The Pleiades star cluster",
    credit: "Reference photograph scaled to a 110′ × 110′ catalog field.",
    fit: "cover",
  },
  {
    id: "m16",
    name: "M16 Pillars / Eagle Nebula",
    short: "M16",
    arcminW: 35,
    arcminH: 28,
    sizeLabel: "35′ × 28′",
    image: "/images/space/pillars-of-creation.jpg",
    alt: "James Webb Space Telescope near-infrared view of the Pillars of Creation",
    credit: "NASA, ESA, CSA, STScI — Webb NIRCam, public domain. Frame scaled to a 35′ × 28′ Eagle Nebula field.",
    fit: "cover",
  },
  {
    id: "m51",
    name: "M51 Whirlpool Galaxy",
    short: "M51",
    arcminW: 11,
    arcminH: 7,
    sizeLabel: "11′ × 7′",
    image: "/images/space/whirlpool-m51.jpg",
    alt: "The Whirlpool Galaxy, Messier 51",
    credit: "Reference photograph scaled to an 11′ × 7′ catalog field.",
    fit: "cover",
  },
  {
    id: "moon",
    name: "The Moon",
    short: "Moon",
    arcminW: 31,
    arcminH: 31,
    sizeLabel: "31′ × 31′",
    image: "/images/space/moon-galileo.jpg",
    alt: "The near side of the Moon from the Galileo spacecraft",
    credit: "NASA / JPL / USGS — Galileo, public domain. Disc scaled to a mean 31′ × 31′.",
    fit: "contain",
  },
  {
    id: "saturn",
    name: "Saturn",
    short: "Saturn",
    arcminW: 44.7 / 60,
    arcminH: 19.7 / 60,
    sizeLabel: "44.7″ rings · 19.7″ disk",
    image: "/images/space/saturn-cassini.jpg",
    alt: "Saturn and its rings in natural color from Cassini",
    credit:
      "NASA / JPL-Caltech / SSI — Cassini, public domain. Box is the October 4, 2026 opposition: rings 44.7″ across, disk 19.7″.",
    fit: "contain",
  },
  {
    id: "jupiter",
    name: "Jupiter",
    short: "Jupiter",
    arcminW: 45.2 / 60,
    arcminH: 42.3 / 60,
    sizeLabel: "45.2″ × 42.3″ disk",
    image: "/images/space/jupiter-grs.jpg",
    alt: "Jupiter with the Great Red Spot",
    credit:
      "NASA / ESA Hubble — Jupiter reference portrait, public domain. Disc scaled to the February 11, 2027 opposition size, 45.2″.",
    fit: "contain",
  },
];

export const SKY_SITES: SkySite[] = [
  { id: "maunakea", name: "Mauna Kea, Hawaiʻi", lat: 19.8207, lon: -155.4681, note: "Summit observatories · 4,207 m", kind: "observatory" },
  { id: "paranal", name: "Paranal Observatory, Atacama, Chile", lat: -24.6272, lon: -70.4044, note: "ESO Very Large Telescope", kind: "observatory" },
  { id: "mcdonald", name: "McDonald Observatory, Texas", lat: 30.6714, lon: -104.0224, note: "Davis Mountains", kind: "observatory" },
  { id: "cherry", name: "Cherry Springs State Park, Pennsylvania", lat: 41.7256, lon: -77.8275, note: "Dark-sky park", kind: "observatory" },
  { id: "wharton", name: "Wharton State Forest, New Jersey", lat: 39.725, lon: -74.716, note: "Pine Barrens", kind: "observatory" },
  { id: "lapalma", name: "Roque de los Muchachos, La Palma", lat: 28.7636, lon: -17.8947, note: "Canary Islands", kind: "observatory" },
  { id: "siding", name: "Siding Spring Observatory, Australia", lat: -31.2733, lon: 149.0709, note: "Coonabarabran, NSW", kind: "observatory" },
  { id: "namibrand", name: "NamibRand Dark Sky Reserve", lat: -25.03, lon: 15.99, note: "Namibia", kind: "reserve" },
  { id: "aoraki", name: "Aoraki Mackenzie Dark Sky Reserve", lat: -43.99, lon: 170.46, note: "New Zealand", kind: "reserve" },
  { id: "natural-bridges", name: "Natural Bridges National Monument", lat: 37.603, lon: -110.003, note: "Utah, USA", kind: "reserve" },
  { id: "big-bend", name: "Big Bend National Park", lat: 29.25, lon: -103.25, note: "Texas, USA", kind: "reserve" },
  { id: "death-valley", name: "Death Valley National Park", lat: 36.505, lon: -117.079, note: "California, USA", kind: "reserve" },
  { id: "jasper", name: "Jasper National Park", lat: 52.873, lon: -118.082, note: "Alberta, Canada", kind: "reserve" },
  { id: "bannau", name: "Bannau Brycheiniog Dark Sky Reserve", lat: 51.88, lon: -3.44, note: "Wales", kind: "reserve" },
  { id: "picdumidi", name: "Pic du Midi", lat: 42.9364, lon: 0.1411, note: "French Pyrenees", kind: "reserve" },
  { id: "megantic", name: "Mont-Mégantic Dark Sky Reserve", lat: 45.455, lon: -71.152, note: "Québec, Canada", kind: "reserve" },
  { id: "hortobagy", name: "Hortobágy Starry Sky Park", lat: 47.59, lon: 21.15, note: "Hungary", kind: "reserve" },
  { id: "kerry", name: "Kerry International Dark Sky Reserve", lat: 51.95, lon: -10.05, note: "Ireland", kind: "reserve" },
  { id: "westhavelland", name: "Westhavelland Dark Sky Reserve", lat: 52.69, lon: 12.45, note: "Germany", kind: "reserve" },
  { id: "flagstaff", name: "Flagstaff", lat: 35.198, lon: -111.651, note: "Arizona, USA", kind: "reserve" },
  { id: "great-basin", name: "Great Basin National Park", lat: 39.005, lon: -114.22, note: "Nevada, USA", kind: "reserve" },
  { id: "alqueva", name: "Alqueva Dark Sky Reserve", lat: 38.2, lon: -7.5, note: "Portugal", kind: "reserve" },
  { id: "aotea", name: "Aotea / Great Barrier Island", lat: -36.2, lon: 175.42, note: "New Zealand", kind: "reserve" },
];

export const OBSERVATORY_SITES = SKY_SITES.filter((site) => site.kind === "observatory");

/** Approximate zenith SQM anchors used only when the VIIRS atlas tile cannot be fetched. */
export const SQM_REFERENCE_POINTS: { lat: number; lon: number; sqm: number }[] = [
  { lat: 19.82, lon: -155.47, sqm: 21.9 },
  { lat: -24.63, lon: -70.4, sqm: 21.98 },
  { lat: 30.67, lon: -104.02, sqm: 21.6 },
  { lat: 41.73, lon: -77.83, sqm: 21.75 },
  { lat: 39.73, lon: -74.72, sqm: 20.6 },
  { lat: 28.76, lon: -17.89, sqm: 21.7 },
  { lat: -31.27, lon: 149.07, sqm: 21.9 },
  { lat: -25.0, lon: 16.0, sqm: 21.85 },
  { lat: -43.99, lon: 170.46, sqm: 21.6 },
  { lat: 37.6, lon: -110.0, sqm: 21.7 },
  { lat: 36.5, lon: -117.1, sqm: 21.5 },
  { lat: 40.71, lon: -74.01, sqm: 17.2 },
  { lat: 34.05, lon: -118.24, sqm: 17.6 },
  { lat: 41.88, lon: -87.63, sqm: 17.7 },
  { lat: 51.51, lon: -0.13, sqm: 17.4 },
  { lat: 48.86, lon: 2.35, sqm: 17.7 },
  { lat: 35.68, lon: 139.69, sqm: 17.3 },
  { lat: 31.23, lon: 121.47, sqm: 16.9 },
  { lat: -33.87, lon: 151.21, sqm: 18.0 },
  { lat: -37.81, lon: 144.96, sqm: 18.3 },
  { lat: 19.43, lon: -99.13, sqm: 18.0 },
  { lat: -23.55, lon: -46.63, sqm: 17.8 },
  { lat: 28.61, lon: 77.21, sqm: 17.6 },
  { lat: 25.2, lon: 55.27, sqm: 17.4 },
  { lat: 1.35, lon: 103.82, sqm: 17.3 },
  { lat: 55.76, lon: 37.62, sqm: 17.9 },
  { lat: 52.52, lon: 13.4, sqm: 18.3 },
  { lat: 41.01, lon: 28.98, sqm: 18.1 },
  { lat: 30.04, lon: 31.24, sqm: 18.2 },
  { lat: -26.2, lon: 28.05, sqm: 18.4 },
  { lat: 64.15, lon: -21.94, sqm: 20.9 },
  { lat: 78.22, lon: 15.63, sqm: 21.3 },
  { lat: -77.84, lon: 166.67, sqm: 21.4 },
];
