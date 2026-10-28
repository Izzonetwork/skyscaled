import { gunzipSync } from "node:zlib";
import { NextRequest, NextResponse } from "next/server";
import { atlasTileUrl, sampleWithLoader } from "@/lib/lightPollution";

const tileCache = new Map<string, Uint8Array>();

async function loadTile(year: number, tilex: number, tiley: number): Promise<Uint8Array> {
  const key = `${year}:${tilex}:${tiley}`;
  const cached = tileCache.get(key);
  if (cached) return cached;
  const response = await fetch(atlasTileUrl(year, tilex, tiley));
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const packed = Buffer.from(await response.arrayBuffer());
  const bytes = new Uint8Array(gunzipSync(packed));
  if (tileCache.size > 32) {
    const oldest = tileCache.keys().next().value;
    if (oldest) tileCache.delete(oldest);
  }
  tileCache.set(key, bytes);
  return bytes;
}

export async function GET(request: NextRequest) {
  const lat = Number(request.nextUrl.searchParams.get("lat"));
  const lon = Number(request.nextUrl.searchParams.get("lon"));
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return NextResponse.json({ error: "Latitude and longitude are required." }, { status: 400 });
  }
  const sample = await sampleWithLoader(lat, lon, loadTile);
  return NextResponse.json(sample, {
    headers: { "Cache-Control": "public, max-age=86400" },
  });
}
