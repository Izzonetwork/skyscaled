export const ARCSEC_PER_RADIAN = 206.265;

export type SamplingStatus = "Undersampled" | "Well-Sampled" | "Oversampled";

export function clampNumber(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function effectiveOptics(apertureMm: number, focalLengthMm: number, multiplier: number) {
  const effectiveFocalLengthMm = focalLengthMm * multiplier;
  const focalRatio = apertureMm > 0 ? effectiveFocalLengthMm / apertureMm : 0;
  return { effectiveFocalLengthMm, focalRatio };
}

/** Exact angular field: 2 · atan(sensor / (2 · EFL)), in degrees. */
export function fieldOfViewDegrees(sensorMm: number, effectiveFocalLengthMm: number): number {
  if (effectiveFocalLengthMm <= 0 || sensorMm <= 0) return 0;
  return (2 * Math.atan(sensorMm / (2 * effectiveFocalLengthMm)) * 180) / Math.PI;
}

/** Image scale in arcseconds per pixel. pixelµm is the unbinned pitch. */
export function imageScaleArcsecPerPixel(pixelUm: number, effectiveFocalLengthMm: number, binning: number): number {
  if (effectiveFocalLengthMm <= 0) return 0;
  return (ARCSEC_PER_RADIAN * pixelUm * binning) / effectiveFocalLengthMm;
}

/**
 * Well-sampled when the scale sits in the overlap of the general
 * 0.67–2.0″/px window and the Nyquist band for the selected seeing
 * (FWHM/3 to FWHM/2). If those windows do not overlap, the seeing
 * band is used on its own.
 */
export function samplingStatus(arcsecPerPixel: number, seeingFwhm: number): {
  status: SamplingStatus;
  bandLow: number;
  bandHigh: number;
  pixelsAcrossFwhm: number;
  inGeneralWindow: boolean;
  usedSeeingBandOnly: boolean;
} {
  const nyquistLow = seeingFwhm / 3;
  const nyquistHigh = seeingFwhm / 2;
  const overlapLow = Math.max(0.67, nyquistLow);
  const overlapHigh = Math.min(2.0, nyquistHigh);
  const usedSeeingBandOnly = overlapLow >= overlapHigh;
  const bandLow = usedSeeingBandOnly ? nyquistLow : overlapLow;
  const bandHigh = usedSeeingBandOnly ? nyquistHigh : overlapHigh;
  let status: SamplingStatus = "Well-Sampled";
  if (arcsecPerPixel > bandHigh) status = "Undersampled";
  else if (arcsecPerPixel < bandLow) status = "Oversampled";
  return {
    status,
    bandLow,
    bandHigh,
    pixelsAcrossFwhm: arcsecPerPixel > 0 ? seeingFwhm / arcsecPerPixel : 0,
    inGeneralWindow: arcsecPerPixel >= 0.67 && arcsecPerPixel <= 2.0,
    usedSeeingBandOnly,
  };
}

export function visualOptics(apertureMm: number, effectiveFocalLengthMm: number, eyepieceMm: number, afovDeg: number) {
  const magnification = eyepieceMm > 0 ? effectiveFocalLengthMm / eyepieceMm : 0;
  const trueFieldDeg = magnification > 0 ? afovDeg / magnification : 0;
  const exitPupilMm = magnification > 0 ? apertureMm / magnification : 0;
  const dawesArcsec = apertureMm > 0 ? 116 / apertureMm : 0;
  const minUsefulMagnification = apertureMm / 7;
  const maxUsefulMagnification = apertureMm * 2;
  const lightGraspVsEye = (apertureMm / 7) ** 2;
  return {
    magnification,
    trueFieldDeg,
    exitPupilMm,
    dawesArcsec,
    minUsefulMagnification,
    maxUsefulMagnification,
    lightGraspVsEye,
  };
}

/** NPF rule at the celestial equator, plus the 500 rule with a full-frame crop factor. */
export function untrackedExposure(args: {
  effectiveFocalLengthMm: number;
  focalRatio: number;
  pixelUm: number;
  binning: number;
  sensorWidthMm: number;
  sensorHeightMm: number;
}) {
  const pixel = args.pixelUm * args.binning;
  const npfSeconds =
    args.effectiveFocalLengthMm > 0 ? (35 * args.focalRatio + 30 * pixel) / args.effectiveFocalLengthMm : 0;
  const diagonal = Math.hypot(args.sensorWidthMm, args.sensorHeightMm);
  const cropFactor = diagonal > 0 ? 43.266 / diagonal : 1;
  const rule500Seconds =
    args.effectiveFocalLengthMm > 0 && cropFactor > 0 ? 500 / (args.effectiveFocalLengthMm * cropFactor) : 0;
  return { npfSeconds, rule500Seconds, cropFactor };
}

export function formatDegrees(degrees: number): string {
  if (!Number.isFinite(degrees)) return "—";
  return Math.abs(degrees) >= 10 ? `${degrees.toFixed(1)}°` : `${degrees.toFixed(2)}°`;
}

export function formatArcmin(arcmin: number): string {
  if (!Number.isFinite(arcmin)) return "—";
  if (arcmin >= 100) return `${arcmin.toFixed(0)}′`;
  if (arcmin >= 10) return `${arcmin.toFixed(1)}′`;
  return `${arcmin.toFixed(2)}′`;
}
