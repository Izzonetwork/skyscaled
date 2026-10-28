import { SQM_REFERENCE_POINTS } from "@/data/observerPresets";
import { artificialRatioFromSqm } from "@/lib/bortle";

export type LightSample = {
  ok: boolean;
  sqm: number;
  artificialRatio: number;
  year: number | null;
  source: "lorenz-atlas" | "reference-network" | "outside-atlas";
  message: string;
};

export function lonLatToTile(lat: number, lon: number): {
  tilex: number;
  tiley: number;
  ix: number;
  iy: number;
  inBounds: boolean;
} {
  const lonFromDateLine = ((lon + 180) % 360 + 360) % 360;
  const latFromStart = lat + 65;
  const tilex = Math.floor(lonFromDateLine / 5) + 1;
  const tiley = Math.floor(latFromStart / 5) + 1;
  const ix = Math.round(120 * (lonFromDateLine - 5 * (tilex - 1) + 1 / 240));
  const iy = Math.round(120 * (latFromStart - 5 * (tiley - 1) + 1 / 240));
  const inBounds = tiley >= 1 && tiley <= 28 && tilex >= 1 && tilex <= 72;
  return { tilex, tiley, ix, iy, inBounds };
}

function signedByte(value: number): number {
  return value > 127 ? value - 256 : value;
}

/** Decode one Lorenz atlas binary tile at the nearest 1/120° grid point. */
export function decodeCompressed(bytes: Uint8Array, ix: number, iy: number): {
  artificialRatio: number;
  sqm: number;
} {
  if (bytes.length < 600 * 400) {
    throw new Error("Atlas tile is shorter than expected");
  }
  const ixC = Math.min(599, Math.max(1, ix));
  const iyC = Math.min(599, Math.max(1, iy));
  const first = 128 * bytes[0] + bytes[1];
  let change = 0;
  for (let i = 1; i < iyC; i += 1) change += signedByte(bytes[600 * i + 1]);
  for (let i = 1; i < ixC; i += 1) change += signedByte(bytes[600 * (iyC - 1) + 1 + i]);
  const compressed = first + change;
  const artificialRatio = (5 / 195) * (Math.exp(0.0195 * compressed) - 1);
  const sqm = 22 - (5 * Math.log(1 + artificialRatio)) / Math.log(100);
  return { artificialRatio, sqm };
}

export function atlasTileUrl(year: number, tilex: number, tiley: number): string {
  return `https://djlorenz.github.io/astronomy/binary_tiles/${year}/binary_tile_${tilex}_${tiley}.dat.gz`;
}

export function overlayTileUrl(year = 2025): string {
  return `https://djlorenz.github.io/astronomy/image_tiles/tiles${year}/tile_{z}_{x}_{y}.png`;
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function estimateSqm(lat: number, lon: number): number {
  let weighted = 0;
  let weightSum = 0;
  let nearest = Infinity;
  for (const point of SQM_REFERENCE_POINTS) {
    const distance = Math.max(15, haversineKm(lat, lon, point.lat, point.lon));
    nearest = Math.min(nearest, distance);
    const weight = 1 / (distance * distance);
    weighted += weight * point.sqm;
    weightSum += weight;
  }
  let sqm = weightSum > 0 ? weighted / weightSum : 21.4;
  if (nearest > 400) {
    const blend = Math.min(1, (nearest - 400) / 800);
    sqm = sqm * (1 - blend) + 21.55 * blend;
  }
  return Math.min(22, Math.max(16, sqm));
}

export async function sampleWithLoader(
  lat: number,
  lon: number,
  load: (year: number, tilex: number, tiley: number) => Promise<Uint8Array>,
): Promise<LightSample> {
  const tile = lonLatToTile(lat, lon);
  if (!tile.inBounds) {
    const sqm = estimateSqm(lat, lon);
    return {
      ok: false,
      sqm,
      artificialRatio: artificialRatioFromSqm(sqm),
      year: null,
      source: "outside-atlas",
      message: "This latitude is outside the Lorenz atlas (65°S to 75°N). The SQM shown is a reference-network estimate.",
    };
  }
  let lastError = "Atlas tile request failed";
  for (const year of [2025, 2024]) {
    try {
      const bytes = await load(year, tile.tilex, tile.tiley);
      const decoded = decodeCompressed(bytes, tile.ix, tile.iy);
      return {
        ok: true,
        sqm: decoded.sqm,
        artificialRatio: decoded.artificialRatio,
        year,
        source: "lorenz-atlas",
        message: `Zenith sample from the David Lorenz Light Pollution Atlas ${year} (VIIRS, 1/120°).`,
      };
    } catch (error) {
      lastError = error instanceof Error ? error.message : lastError;
    }
  }
  const sqm = estimateSqm(lat, lon);
  return {
    ok: false,
    sqm,
    artificialRatio: artificialRatioFromSqm(sqm),
    year: null,
    source: "reference-network",
    message: `Atlas tile unavailable (${lastError}). SQM is an inverse-distance estimate from calibrated sites and major cities.`,
  };
}

const browserCache = new Map<string, Uint8Array>();

async function decompressGzip(buffer: ArrayBuffer): Promise<Uint8Array> {
  if (typeof DecompressionStream === "undefined") {
    throw new Error("Gzip decompression is unavailable in this browser");
  }
  const stream = new Blob([buffer]).stream().pipeThrough(new DecompressionStream("gzip"));
  const out = await new Response(stream).arrayBuffer();
  return new Uint8Array(out);
}

async function browserLoadTile(year: number, tilex: number, tiley: number): Promise<Uint8Array> {
  const key = `${year}:${tilex}:${tiley}`;
  const cached = browserCache.get(key);
  if (cached) return cached;
  const response = await fetch(atlasTileUrl(year, tilex, tiley));
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const bytes = await decompressGzip(await response.arrayBuffer());
  if (browserCache.size > 24) {
    const oldest = browserCache.keys().next().value;
    if (oldest) browserCache.delete(oldest);
  }
  browserCache.set(key, bytes);
  return bytes;
}

export async function fetchLightSample(lat: number, lon: number): Promise<LightSample> {
  try {
    return await sampleWithLoader(lat, lon, browserLoadTile);
  } catch {
    try {
      const response = await fetch(`/api/lp-sqm?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return (await response.json()) as LightSample;
    } catch (error) {
      const sqm = estimateSqm(lat, lon);
      return {
        ok: false,
        sqm,
        artificialRatio: artificialRatioFromSqm(sqm),
        year: null,
        source: "reference-network",
        message:
          error instanceof Error
            ? `Atlas lookup failed (${error.message}). Showing a reference-network estimate.`
            : "Atlas lookup failed. Showing a reference-network estimate.",
      };
    }
  }
}
