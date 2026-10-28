import React from "react";

/**
 * Northern-hemisphere convention: the right limb is lit while the phase angle
 * runs from New Moon (0°) through Full Moon (180°). Southern observers see
 * the illuminated limb mirrored.
 */
export default function MoonPhaseIcon({
  phaseAngle,
  size = 22,
  className = "",
}: {
  phaseAngle: number;
  size?: number;
  className?: string;
}) {
  const angle = ((phaseAngle % 360) + 360) % 360;
  const waxing = angle <= 180;
  const towardFull = waxing ? angle : 360 - angle;
  const radians = (towardFull * Math.PI) / 180;
  const cosine = Math.cos(radians);
  const rx = Math.max(0.15, Math.abs(cosine) * 10);
  const crescent = cosine >= 0;
  const limbSweep = waxing ? 0 : 1;
  const terminatorSweep = crescent ? limbSweep : limbSweep === 0 ? 1 : 0;
  const path = `M 12 2 A 10 10 0 0 ${limbSweep} 12 22 A ${rx.toFixed(2)} 10 0 0 ${terminatorSweep} 12 2 Z`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10.2" fill="#020617" stroke="#fbbf24" strokeWidth="1" />
      <path d={path} fill="#fde68a" />
    </svg>
  );
}
