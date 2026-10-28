export type Verdict = "Prime Imaging Window" | "Visual / Narrowband Only" | "Clouded Out";

export type HourPoint = {
  index: number;
  localIso: string;
  utcMs: number;
  localHour: string;
  utcHour: string;
  localDateKey: string;
  utcDateKey: string;
  temperatureC: number | null;
  humidity: number | null;
  dewPointC: number | null;
  dewDeltaC: number | null;
  dewRisk: boolean;
  cloud: number | null;
  cloudLow: number | null;
  cloudMid: number | null;
  cloudHigh: number | null;
  windMs: number | null;
  windKmh: number | null;
  windMph: number | null;
  gustKmh: number | null;
  visibilityKm: number | null;
  precipProb: number | null;
  jetMs: number | null;
  isNight: boolean;
  seeingScore: number | null;
  seeingArcsec: number | null;
  seeingLabel: string;
  transparencyMag: number | null;
  transparencyLabel: string;
  score: number | null;
  verdict: Verdict | null;
};

export type NightSummary = {
  id: string;
  label: string;
  startUtc: string;
  endUtc: string;
  hours: number;
  meanScore: number;
  meanCloud: number;
  meanSeeing: number;
  bestWindowLabel: string;
  bestWindowScore: number;
  verdict: Verdict;
  dewHours: number;
  maxWindKmh: number;
  sunsetLabel: string | null;
  sunriseLabel: string | null;
};

export type ForecastModel = {
  source: "open-meteo" | "illustration";
  fetchedAtUtc: string;
  timezone: string;
  offsetSeconds: number;
  offsetLabel: string;
  elevationM: number | null;
  latitude: number;
  longitude: number;
  hours: HourPoint[];
  nights: NightSummary[];
  referenceIndex: number;
  message?: string;
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function formatLongUtc(ms: number): string {
  const date = new Date(ms);
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const mm = String(date.getUTCMinutes()).padStart(2, "0");
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()} · ${hh}:${mm} UTC`;
}

export function formatOffset(seconds: number): string {
  const sign = seconds >= 0 ? "+" : "-";
  const abs = Math.abs(seconds);
  const hours = Math.floor(abs / 3600);
  const minutes = Math.floor((abs % 3600) / 60);
  if (minutes === 0) return `UTC${sign}${hours}`;
  return `UTC${sign}${hours}:${String(minutes).padStart(2, "0")}`;
}

export function localIsoToUtcMs(localIso: string, offsetSeconds: number): number {
  if (/[zZ]|[+-]\d{2}:\d{2}$/.test(localIso)) {
    const parsed = Date.parse(localIso);
    if (Number.isFinite(parsed)) return parsed;
  }
  const [datePart, timePart = "00:00"] = localIso.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  return Date.UTC(year, (month || 1) - 1, day || 1, hour || 0, minute || 0) - offsetSeconds * 1000;
}

export function openMeteoForecastUrl(lat: number, lon: number): string {
  const params = new URLSearchParams({
    latitude: lat.toFixed(4),
    longitude: lon.toFixed(4),
    hourly: [
      "temperature_2m",
      "relative_humidity_2m",
      "dew_point_2m",
      "cloud_cover",
      "cloud_cover_low",
      "cloud_cover_mid",
      "cloud_cover_high",
      "wind_speed_10m",
      "wind_gusts_10m",
      "visibility",
      "precipitation_probability",
      "wind_speed_250hPa",
      "is_day",
    ].join(","),
    daily: "sunrise,sunset",
    forecast_days: "7",
    timezone: "auto",
    wind_speed_unit: "ms",
    timeformat: "iso8601",
  });
  return `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
}

function num(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function seeingFromMeteo(
  jetMs: number | null,
  humidity: number | null,
  tempDelta: number | null,
  windMs: number | null = null,
): {
  score: number;
  arcsec: number;
  label: string;
} {
  let base = 3;
  if (jetMs == null) {
    if (windMs == null) base = 3;
    else if (windMs < 3) base = 4;
    else if (windMs < 6) base = 3.2;
    else if (windMs < 10) base = 2.4;
    else base = 1.6;
  } else if (jetMs < 12) base = 5;
  else if (jetMs < 20) base = 4;
  else if (jetMs < 28) base = 3;
  else if (jetMs < 38) base = 2;
  else base = 1;

  if (humidity != null && humidity >= 90) base -= 0.7;
  else if (humidity != null && humidity >= 80) base -= 0.35;

  if (tempDelta != null && Math.abs(tempDelta) >= 2.5) base -= 0.4;
  else if (tempDelta != null && Math.abs(tempDelta) >= 1.5) base -= 0.2;

  const score = clamp(base, 1, 5);
  const anchors: [number, number][] = [
    [1, 3.0],
    [2, 2.1],
    [3, 1.4],
    [4, 0.9],
    [5, 0.6],
  ];
  let arcsec = 1.4;
  for (let i = 0; i < anchors.length - 1; i += 1) {
    const [s0, a0] = anchors[i];
    const [s1, a1] = anchors[i + 1];
    if (score >= s0 && score <= s1) {
      const t = (score - s0) / (s1 - s0);
      arcsec = a0 + (a1 - a0) * t;
      break;
    }
  }
  const rounded = Math.round(score);
  const label = rounded >= 5 ? "Excellent" : rounded === 4 ? "Good" : rounded === 3 ? "Average" : rounded === 2 ? "Below average" : "Poor";
  return { score, arcsec, label };
}

export function transparencyFromMeteo(
  humidity: number | null,
  highCloud: number | null,
  midCloud: number | null,
  visibilityMeters: number | null,
): { mag: number; label: string } {
  let mag = 6.6;
  if (highCloud != null) mag -= (highCloud / 100) * 1.8;
  if (midCloud != null) mag -= (midCloud / 100) * 0.7;
  if (humidity != null && humidity > 60) mag -= ((humidity - 60) / 40) * 1.3;
  if (visibilityMeters != null) {
    const visKm = visibilityMeters / 1000;
    if (visKm < 30) mag -= ((30 - visKm) / 30) * 1.6;
  }
  mag = clamp(mag, 1.5, 6.8);
  const label = mag >= 6.2 ? "Excellent" : mag >= 5.5 ? "Good" : mag >= 4.5 ? "Average" : mag >= 3.5 ? "Poor" : "Very poor";
  return { mag, label };
}

export function imagingScore(args: {
  cloud: number | null;
  cloudLow: number | null;
  cloudMid: number | null;
  cloudHigh: number | null;
  seeingScore: number | null;
  transparencyMag: number | null;
  precipProb: number | null;
  windKmh: number | null;
}): { score: number; verdict: Verdict } | null {
  if (args.cloud == null || args.seeingScore == null || args.transparencyMag == null) return null;
  const low = args.cloudLow ?? args.cloud;
  const mid = args.cloudMid ?? args.cloud * 0.5;
  const high = args.cloudHigh ?? args.cloud * 0.4;
  const cloudScore = clamp(100 - (0.5 * args.cloud + 0.3 * low + 0.15 * mid + 0.05 * high), 0, 100);
  const seeScore = ((args.seeingScore - 1) / 4) * 100;
  const transScore = clamp(((args.transparencyMag - 2) / 4.6) * 100, 0, 100);
  const precipPenalty = (args.precipProb ?? 0) * 0.35;
  const windPenalty = Math.max(0, (args.windKmh ?? 0) - 20) * 0.45;
  let score = 0.5 * cloudScore + 0.28 * seeScore + 0.22 * transScore - precipPenalty - windPenalty;
  if (args.cloud >= 90) score = Math.min(score, 18);
  score = clamp(score, 0, 100);
  return { score, verdict: verdictFor(score, args.cloud, args.seeingScore) };
}

export function verdictFor(score: number, cloud: number, seeing: number): Verdict {
  if (cloud >= 80 || score < 40) return "Clouded Out";
  if (score >= 72 && cloud <= 25 && seeing >= 3) return "Prime Imaging Window";
  return "Visual / Narrowband Only";
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function hourLabel(ms: number): string {
  const date = new Date(ms);
  return `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`;
}

function dateKey(ms: number): string {
  const date = new Date(ms);
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

type DailyMark = { sunriseMs: number | null; sunsetMs: number | null };

function buildHours(
  times: string[],
  offsetSeconds: number,
  columns: {
    temperature: (number | null)[];
    humidity: (number | null)[];
    dew: (number | null)[];
    cloud: (number | null)[];
    cloudLow: (number | null)[];
    cloudMid: (number | null)[];
    cloudHigh: (number | null)[];
    wind: (number | null)[];
    gust: (number | null)[];
    visibility: (number | null)[];
    precip: (number | null)[];
    jet: (number | null)[];
    isDay: (number | null)[];
  },
): HourPoint[] {
  const points: HourPoint[] = [];
  for (let i = 0; i < times.length; i += 1) {
    const utcMs = localIsoToUtcMs(times[i], offsetSeconds);
    const temperatureC = columns.temperature[i] ?? null;
    const humidity = columns.humidity[i] ?? null;
    const dewPointC = columns.dew[i] ?? null;
    const prevTemp = i > 0 ? columns.temperature[i - 1] : null;
    const tempDelta = temperatureC != null && prevTemp != null ? temperatureC - prevTemp : null;
    const dewDeltaC = temperatureC != null && dewPointC != null ? temperatureC - dewPointC : null;
    const cloud = columns.cloud[i] ?? null;
    const windMs = columns.wind[i] ?? null;
    const windKmh = windMs == null ? null : windMs * 3.6;
    const jetMs = columns.jet[i] ?? null;
    const seeing = seeingFromMeteo(jetMs, humidity, tempDelta, windMs);
    const transparency = transparencyFromMeteo(humidity, columns.cloudHigh[i] ?? null, columns.cloudMid[i] ?? null, columns.visibility[i] ?? null);
    const scored = imagingScore({
      cloud,
      cloudLow: columns.cloudLow[i] ?? null,
      cloudMid: columns.cloudMid[i] ?? null,
      cloudHigh: columns.cloudHigh[i] ?? null,
      seeingScore: seeing.score,
      transparencyMag: transparency.mag,
      precipProb: columns.precip[i] ?? null,
      windKmh,
    });
    const localDate = times[i].slice(0, 10);
    const localTime = times[i].split("T")[1]?.slice(0, 5) ?? hourLabel(utcMs);
    points.push({
      index: i,
      localIso: times[i],
      utcMs,
      localHour: localTime,
      utcHour: hourLabel(utcMs),
      localDateKey: localDate,
      utcDateKey: dateKey(utcMs),
      temperatureC,
      humidity,
      dewPointC,
      dewDeltaC,
      dewRisk: dewDeltaC != null && dewDeltaC <= 2.5,
      cloud,
      cloudLow: columns.cloudLow[i] ?? null,
      cloudMid: columns.cloudMid[i] ?? null,
      cloudHigh: columns.cloudHigh[i] ?? null,
      windMs,
      windKmh,
      windMph: windMs == null ? null : windMs * 2.23694,
      gustKmh: columns.gust[i] == null ? null : (columns.gust[i] as number) * 3.6,
      visibilityKm: columns.visibility[i] == null ? null : (columns.visibility[i] as number) / 1000,
      precipProb: columns.precip[i] ?? null,
      jetMs,
      isNight: columns.isDay[i] === 0,
      seeingScore: seeing.score,
      seeingArcsec: seeing.arcsec,
      seeingLabel: seeing.label,
      transparencyMag: transparency.mag,
      transparencyLabel: transparency.label,
      score: scored?.score ?? null,
      verdict: scored?.verdict ?? null,
    });
  }
  return points;
}

function mean(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function nightLabel(startMs: number, endMs: number): string {
  const start = new Date(startMs);
  const end = new Date(endMs);
  const sameMonth = start.getUTCMonth() === end.getUTCMonth() && start.getUTCFullYear() === end.getUTCFullYear();
  if (sameMonth) {
    return `${MONTHS[start.getUTCMonth()]} ${start.getUTCDate()}–${end.getUTCDate()}, ${end.getUTCFullYear()}`;
  }
  return `${MONTHS[start.getUTCMonth()]} ${start.getUTCDate()} – ${MONTHS[end.getUTCMonth()]} ${end.getUTCDate()}, ${end.getUTCFullYear()}`;
}

function closestMark(
  daily: DailyMark[],
  targetMs: number,
  key: "sunriseMs" | "sunsetMs",
  minDelta: number,
  maxDelta: number,
): DailyMark | null {
  let best: DailyMark | null = null;
  let bestAbs = Infinity;
  for (const mark of daily) {
    const value = mark[key];
    if (value == null) continue;
    const delta = value - targetMs;
    if (delta < minDelta || delta > maxDelta) continue;
    const abs = Math.abs(delta);
    if (abs < bestAbs) {
      best = mark;
      bestAbs = abs;
    }
  }
  return best;
}

export function summarizeNights(hours: HourPoint[], daily: DailyMark[], referenceMs: number, count = 7): NightSummary[] {
  const groups: HourPoint[][] = [];
  let current: HourPoint[] = [];
  for (const hour of hours) {
    if (hour.isNight) current.push(hour);
    else if (current.length) {
      groups.push(current);
      current = [];
    }
  }
  if (current.length) groups.push(current);

  return groups
    .filter((group) => group.length >= 2 && group[group.length - 1].utcMs >= referenceMs - 60 * 60 * 1000)
    .slice(0, count)
    .map((group, index) => {
      const scores = group.map((hour) => hour.score).filter((value): value is number => value != null);
      const clouds = group.map((hour) => hour.cloud).filter((value): value is number => value != null);
      const seeings = group.map((hour) => hour.seeingScore).filter((value): value is number => value != null);
      const winds = group.map((hour) => hour.windKmh).filter((value): value is number => value != null);
      let bestScore = -1;
      let bestStart = 0;
      const window = Math.min(3, group.length);
      for (let i = 0; i <= group.length - window; i += 1) {
        const slice = group.slice(i, i + window).map((hour) => hour.score ?? 0);
        const avg = mean(slice);
        if (avg > bestScore) {
          bestScore = avg;
          bestStart = i;
        }
      }
      const best = group.slice(bestStart, bestStart + window);
      const bestEndMs = best[best.length - 1].utcMs + 60 * 60 * 1000;
      const nightStart = group[0].utcMs;
      const nightEnd = group[group.length - 1].utcMs + 60 * 60 * 1000;
      const sunset = closestMark(daily, nightStart, "sunsetMs", -4 * 3600 * 1000, 2 * 3600 * 1000);
      const sunrise = closestMark(daily, nightEnd, "sunriseMs", -2 * 3600 * 1000, 4 * 3600 * 1000);
      const meanScore = mean(scores);
      const meanCloud = mean(clouds);
      const meanSeeing = mean(seeings);
      return {
        id: `${group[0].utcMs}-${index}`,
        label: nightLabel(group[0].utcMs, group[group.length - 1].utcMs),
        startUtc: formatLongUtc(group[0].utcMs),
        endUtc: formatLongUtc(group[group.length - 1].utcMs + 60 * 60 * 1000),
        hours: group.length,
        meanScore,
        meanCloud,
        meanSeeing,
        bestWindowLabel: `${best[0].localHour}–${hourLabel(bestEndMs)} local · ${best[0].utcHour}–${hourLabel(bestEndMs)} UTC`,
        bestWindowScore: bestScore,
        verdict: verdictFor(meanScore, meanCloud, meanSeeing || 1),
        dewHours: group.filter((hour) => hour.dewRisk).length,
        maxWindKmh: winds.length ? Math.max(...winds) : 0,
        sunsetLabel: sunset?.sunsetMs ? formatLongUtc(sunset.sunsetMs) : null,
        sunriseLabel: sunrise?.sunriseMs ? formatLongUtc(sunrise.sunriseMs) : null,
      };
    });
}

function referenceIndex(hours: HourPoint[], referenceMs: number): number {
  let best = 0;
  let bestDelta = Infinity;
  hours.forEach((hour, index) => {
    const delta = Math.abs(hour.utcMs - referenceMs);
    if (hour.utcMs <= referenceMs + 30 * 60 * 1000 && delta < bestDelta) {
      bestDelta = delta;
      best = index;
    }
  });
  return best;
}

function asNumberList(value: unknown): (number | null)[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => num(item));
}

export function parseOpenMeteo(payload: unknown, fetchedAtMs: number): ForecastModel {
  const data = payload as {
    latitude?: number;
    longitude?: number;
    elevation?: number;
    timezone?: string;
    utc_offset_seconds?: number;
    hourly?: Record<string, unknown>;
    daily?: Record<string, unknown>;
  };
  const offsetSeconds = data.utc_offset_seconds ?? 0;
  const hourly = data.hourly ?? {};
  const times = Array.isArray(hourly.time) ? (hourly.time as string[]) : [];
  const hours = buildHours(times, offsetSeconds, {
    temperature: asNumberList(hourly.temperature_2m),
    humidity: asNumberList(hourly.relative_humidity_2m),
    dew: asNumberList(hourly.dew_point_2m),
    cloud: asNumberList(hourly.cloud_cover),
    cloudLow: asNumberList(hourly.cloud_cover_low),
    cloudMid: asNumberList(hourly.cloud_cover_mid),
    cloudHigh: asNumberList(hourly.cloud_cover_high),
    wind: asNumberList(hourly.wind_speed_10m),
    gust: asNumberList(hourly.wind_gusts_10m),
    visibility: asNumberList(hourly.visibility),
    precip: asNumberList(hourly.precipitation_probability),
    jet: asNumberList(hourly.wind_speed_250hPa),
    isDay: asNumberList(hourly.is_day),
  });
  const dailyTimes = Array.isArray(data.daily?.time) ? (data.daily?.time as string[]) : [];
  const sunrises = Array.isArray(data.daily?.sunrise) ? (data.daily?.sunrise as string[]) : [];
  const sunsets = Array.isArray(data.daily?.sunset) ? (data.daily?.sunset as string[]) : [];
  const daily: DailyMark[] = dailyTimes.map((_, index) => ({
    sunriseMs: sunrises[index] ? localIsoToUtcMs(sunrises[index], offsetSeconds) : null,
    sunsetMs: sunsets[index] ? localIsoToUtcMs(sunsets[index], offsetSeconds) : null,
  }));
  const ref = referenceIndex(hours, fetchedAtMs);
  return {
    source: "open-meteo",
    fetchedAtUtc: formatLongUtc(fetchedAtMs),
    timezone: data.timezone || "UTC",
    offsetSeconds,
    offsetLabel: formatOffset(offsetSeconds),
    elevationM: num(data.elevation),
    latitude: data.latitude ?? 0,
    longitude: data.longitude ?? 0,
    hours,
    nights: summarizeNights(hours, daily, fetchedAtMs),
    referenceIndex: ref,
  };
}

export function illustrateForecast(lat: number, lon: number, fetchedAtMs: number): ForecastModel {
  const start = Math.floor(fetchedAtMs / 3600000) * 3600000;
  const times: string[] = [];
  const columns = {
    temperature: [] as (number | null)[],
    humidity: [] as (number | null)[],
    dew: [] as (number | null)[],
    cloud: [] as (number | null)[],
    cloudLow: [] as (number | null)[],
    cloudMid: [] as (number | null)[],
    cloudHigh: [] as (number | null)[],
    wind: [] as (number | null)[],
    gust: [] as (number | null)[],
    visibility: [] as (number | null)[],
    precip: [] as (number | null)[],
    jet: [] as (number | null)[],
    isDay: [] as (number | null)[],
  };
  for (let i = 0; i < 168; i += 1) {
    const ms = start + i * 3600000;
    const date = new Date(ms);
    const iso = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}T${String(date.getUTCHours()).padStart(2, "0")}:00`;
    times.push(iso);
    const hour = date.getUTCHours();
    const diurnal = Math.cos(((hour - 14) / 24) * Math.PI * 2);
    const wave = Math.sin((i + lat) / 9) * 25 + Math.cos((lon + i) / 13) * 15;
    const cloud = clamp(45 + wave + diurnal * 8, 0, 100);
    const temp = 12 + diurnal * 6 - Math.abs(lat) / 15;
    columns.temperature.push(temp);
    columns.humidity.push(clamp(55 + wave * 0.4 - diurnal * 8, 20, 98));
    columns.dew.push(temp - 6);
    columns.cloud.push(cloud);
    columns.cloudLow.push(clamp(cloud * 0.45, 0, 100));
    columns.cloudMid.push(clamp(cloud * 0.3, 0, 100));
    columns.cloudHigh.push(clamp(cloud * 0.35, 0, 100));
    columns.wind.push(4 + Math.abs(Math.sin(i / 5)) * 5);
    columns.gust.push(7 + Math.abs(Math.sin(i / 5)) * 6);
    columns.visibility.push(25000);
    columns.precip.push(clamp(cloud - 40, 0, 80));
    columns.jet.push(18 + Math.sin((i + lon) / 8) * 10);
    const isDay = hour >= 6 && hour < 18 ? 1 : 0;
    columns.isDay.push(isDay);
  }
  const hours = buildHours(times, 0, columns);
  return {
    source: "illustration",
    fetchedAtUtc: formatLongUtc(fetchedAtMs),
    timezone: "UTC",
    offsetSeconds: 0,
    offsetLabel: "UTC+0",
    elevationM: null,
    latitude: lat,
    longitude: lon,
    hours,
    nights: summarizeNights(hours, [], fetchedAtMs),
    referenceIndex: 0,
    message: `Open-Meteo was unreachable at ${formatLongUtc(fetchedAtMs)}. The grid is a coordinate-seeded illustration, not a meteorological forecast.`,
  };
}

export function matrixSlice(model: ForecastModel, length = 48): HourPoint[] {
  const start = model.referenceIndex;
  return model.hours.slice(start, start + length);
}
