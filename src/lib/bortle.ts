export type BortleClass = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type BortleProfile = {
  bortle: BortleClass;
  title: string;
  appearance: string;
  nelm: number;
  sqm: number;
  artificialRatio: number;
  totalRatio: number;
  hoursVsBortle2: number;
  filter: string;
  filterDetail: string;
};

export const BORTLE2_REFERENCE_SQM = 21.94;
export const NATURAL_SKY_SQM = 22.0;

const CLASS_META: Record<BortleClass, { title: string; appearance: string }> = {
  1: {
    title: "Excellent dark-sky site",
    appearance: "The Milky Way casts a faint shadow. Zodiacal light is obvious, and the sky is crowded with stars down to the horizon.",
  },
  2: {
    title: "Typical truly dark site",
    appearance: "The Milky Way shows rich structure. A faint glow may touch one horizon, and M33 is an averted-vision object.",
  },
  3: {
    title: "Rural sky",
    appearance: "The Milky Way is still complex overhead. Light domes sit along one or two horizons, and clouds look like dark holes.",
  },
  4: {
    title: "Rural / suburban transition",
    appearance: "The Milky Way is washed out near the horizon and still visible overhead. Constellations are obvious, the zodiacal light is weak.",
  },
  5: {
    title: "Suburban sky",
    appearance: "The Milky Way is faint or only overhead on the best nights. Clouds are brighter than the sky behind them.",
  },
  6: {
    title: "Bright suburban sky",
    appearance: "The Milky Way is gone except for a hint at the zenith. Only the brighter constellations read clearly.",
  },
  7: {
    title: "Suburban / urban transition",
    appearance: "The sky is gray-blue overhead. The Milky Way is invisible and clouds are brightly lit.",
  },
  8: {
    title: "City sky",
    appearance: "Constellations are missing their fainter stars. Familiar patterns have to be picked out of the glow.",
  },
  9: {
    title: "Inner-city sky",
    appearance: "Only the brightest stars punch through. The zenith is orange or gray and the Milky Way is absent.",
  },
};

const NELM_STOPS: [number, number][] = [
  [22.0, 7.8],
  [21.99, 7.6],
  [21.89, 7.1],
  [21.69, 6.6],
  [20.49, 6.1],
  [19.5, 5.6],
  [18.94, 5.1],
  [18.38, 4.6],
  [17.8, 4.1],
  [17.5, 3.8],
  [16.0, 2.8],
];

export const BORTLE_PRESETS: { bortle: BortleClass; sqm: number }[] = [
  { bortle: 1, sqm: 22.0 },
  { bortle: 2, sqm: 21.94 },
  { bortle: 3, sqm: 21.79 },
  { bortle: 4, sqm: 21.09 },
  { bortle: 5, sqm: 20.0 },
  { bortle: 6, sqm: 19.22 },
  { bortle: 7, sqm: 18.66 },
  { bortle: 8, sqm: 18.09 },
  { bortle: 9, sqm: 17.5 },
];

export function bortleClass(sqm: number): BortleClass {
  if (sqm >= 21.99) return 1;
  if (sqm >= 21.89) return 2;
  if (sqm >= 21.69) return 3;
  if (sqm >= 20.49) return 4;
  if (sqm >= 19.5) return 5;
  if (sqm >= 18.94) return 6;
  if (sqm >= 18.38) return 7;
  if (sqm >= 17.8) return 8;
  return 9;
}

export function nakedEyeLimitingMagnitude(sqm: number): number {
  if (sqm >= NELM_STOPS[0][0]) return NELM_STOPS[0][1];
  const last = NELM_STOPS[NELM_STOPS.length - 1];
  if (sqm <= last[0]) return last[1];
  for (let i = 0; i < NELM_STOPS.length - 1; i += 1) {
    const [sqmHi, nelmHi] = NELM_STOPS[i];
    const [sqmLo, nelmLo] = NELM_STOPS[i + 1];
    if (sqm <= sqmHi && sqm >= sqmLo) {
      const span = sqmHi - sqmLo;
      const t = span === 0 ? 0 : (sqmHi - sqm) / span;
      return nelmHi + (nelmLo - nelmHi) * t;
    }
  }
  return last[1];
}

export function totalBrightnessRatio(sqm: number): number {
  return 10 ** ((NATURAL_SKY_SQM - sqm) / 2.5);
}

export function artificialRatioFromSqm(sqm: number): number {
  return Math.max(0, totalBrightnessRatio(sqm) - 1);
}

export function hoursToMatchBortle2(sqm: number): number {
  return 10 ** ((BORTLE2_REFERENCE_SQM - sqm) / 2.5);
}

export function filterGuide(bortle: BortleClass): { filter: string; filterDetail: string } {
  if (bortle <= 3) {
    return {
      filter: "No Filter / UV-IR Cut",
      filterDetail:
        "Broadband RGB and one-shot color are at home under a Bortle 1–3 sky. A UV/IR-cut filter is enough to keep stars tight on a refractor.",
    };
  }
  if (bortle <= 5) {
    return {
      filter: "Optolong L-Pro / Broadband CLS",
      filterDetail:
        "A broadband light-pollution filter such as an Optolong L-Pro or a CLS-style filter pulls down the mercury and sodium lines while leaving galaxy color intact.",
    };
  }
  return {
    filter: "Dual-Band Hα/O-III 7nm–3nm or SHO Narrowband",
    filterDetail:
      "Under a Bortle 6–9 sky, dual-band Hα/O-III at 7 nm to 3 nm, or a full SHO narrowband set, rejects the urban continuum. Broadband galaxy work needs long integration or a darker site.",
  };
}

export function bortleProfile(sqm: number, artificialRatio?: number): BortleProfile {
  const bortle = bortleClass(sqm);
  const meta = CLASS_META[bortle];
  const guide = filterGuide(bortle);
  const totalRatio = totalBrightnessRatio(sqm);
  return {
    bortle,
    title: meta.title,
    appearance: meta.appearance,
    nelm: nakedEyeLimitingMagnitude(sqm),
    sqm,
    artificialRatio: artificialRatio ?? artificialRatioFromSqm(sqm),
    totalRatio,
    hoursVsBortle2: hoursToMatchBortle2(sqm),
    filter: guide.filter,
    filterDetail: guide.filterDetail,
  };
}

export function formatHours(hours: number): string {
  if (!Number.isFinite(hours)) return "—";
  if (hours < 0.1) return `${(hours * 60).toFixed(0)} min`;
  if (hours < 10) return `${hours.toFixed(1)} h`;
  return `${hours.toFixed(0)} h`;
}

export function formatRatio(ratio: number): string {
  if (!Number.isFinite(ratio)) return "—";
  if (ratio < 0.1) return ratio.toFixed(3);
  if (ratio < 10) return ratio.toFixed(2);
  return ratio.toFixed(1);
}
