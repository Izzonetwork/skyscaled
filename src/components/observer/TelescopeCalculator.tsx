"use client";

import React, { useMemo, useState } from "react";
import { Aperture, Camera, Eye, Telescope } from "lucide-react";
import {
  CAMERA_PRESETS,
  EYEPIECE_PRESETS,
  MULTIPLIERS,
  SKY_TARGETS,
  TELESCOPE_PRESETS,
} from "@/data/observerPresets";
import {
  ARCSEC_PER_RADIAN,
  clampNumber,
  effectiveOptics,
  fieldOfViewDegrees,
  formatArcmin,
  formatDegrees,
  imageScaleArcsecPerPixel,
  samplingStatus,
  untrackedExposure,
  visualOptics,
} from "@/lib/optics";
import FramingCanvas from "@/components/observer/FramingCanvas";

type Mode = "camera" | "visual";

function SliderField({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  const shown = Number.isInteger(step) ? value.toFixed(0) : value.toFixed(step < 0.1 ? 2 : 1);
  return (
    <label className="block">
      <span className="mb-1 flex items-center justify-between gap-3 text-xs">
        <span className="font-semibold text-slate-200">{label}</span>
        <span className="font-mono text-cyan-200">
          {shown}
          {unit}
        </span>
      </span>
      <span className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={clampNumber(value, min, max)}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-full accent-cyan-400"
        />
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(clampNumber(Number(event.target.value), min, max))}
          className="w-20 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-right font-mono text-xs text-white"
        />
      </span>
    </label>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2.5">
      <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400">{label}</div>
      <div className="mt-1 text-sm font-bold text-white">{value}</div>
      {hint ? <div className="mt-0.5 text-[10px] leading-snug text-slate-400">{hint}</div> : null}
    </div>
  );
}

function formatSeconds(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "—";
  if (seconds < 10) return `${seconds.toFixed(2)} s`;
  if (seconds < 90) return `${seconds.toFixed(1)} s`;
  return `${(seconds / 60).toFixed(1)} min`;
}

function formatMag(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (value >= 100) return `${Math.round(value)}×`;
  return `${value.toFixed(1)}×`;
}

export default function TelescopeCalculator() {
  const [mode, setMode] = useState<Mode>("camera");
  const [telescopeId, setTelescopeId] = useState("redcat51");
  const [apertureMm, setApertureMm] = useState(51);
  const [focalLengthMm, setFocalLengthMm] = useState(250);
  const [multiplier, setMultiplier] = useState(1);
  const [cameraId, setCameraId] = useState("asi2600");
  const [sensorW, setSensorW] = useState(23.5);
  const [sensorH, setSensorH] = useState(15.7);
  const [pixelUm, setPixelUm] = useState(3.76);
  const [resX, setResX] = useState(6248);
  const [resY, setResY] = useState(4176);
  const [rotation, setRotation] = useState(0);
  const [binning, setBinning] = useState<1 | 2 | 3>(1);
  const [seeing, setSeeing] = useState(2);
  const [eyepieceId, setEyepieceId] = useState("ultra14");
  const [eyepieceMm, setEyepieceMm] = useState(14);
  const [afov, setAfov] = useState(82);
  const [targetId, setTargetId] = useState("m31");
  const [showSensor, setShowSensor] = useState(true);
  const [showEyepiece, setShowEyepiece] = useState(true);

  const target = SKY_TARGETS.find((item) => item.id === targetId) ?? SKY_TARGETS[0];

  const optics = useMemo(() => {
    const effective = effectiveOptics(apertureMm, focalLengthMm, multiplier);
    const fovW = fieldOfViewDegrees(sensorW, effective.effectiveFocalLengthMm);
    const fovH = fieldOfViewDegrees(sensorH, effective.effectiveFocalLengthMm);
    const diagonalMm = Math.hypot(sensorW, sensorH);
    const fovD = fieldOfViewDegrees(diagonalMm, effective.effectiveFocalLengthMm);
    const scale = imageScaleArcsecPerPixel(pixelUm, effective.effectiveFocalLengthMm, binning);
    const sampling = samplingStatus(scale, seeing);
    const visual = visualOptics(apertureMm, effective.effectiveFocalLengthMm, eyepieceMm, afov);
    const shutter = untrackedExposure({
      effectiveFocalLengthMm: effective.effectiveFocalLengthMm,
      focalRatio: effective.focalRatio,
      pixelUm,
      binning,
      sensorWidthMm: sensorW,
      sensorHeightMm: sensorH,
    });
    return { effective, fovW, fovH, fovD, scale, sampling, visual, shutter, binnedX: Math.round(resX / binning), binnedY: Math.round(resY / binning) };
  }, [afov, apertureMm, binning, eyepieceMm, focalLengthMm, multiplier, pixelUm, resX, resY, seeing, sensorH, sensorW]);

  function applyTelescope(id: string) {
    const preset = TELESCOPE_PRESETS.find((item) => item.id === id);
    if (!preset) return;
    setTelescopeId(id);
    setApertureMm(preset.apertureMm);
    setFocalLengthMm(preset.focalLengthMm);
  }

  function applyCamera(id: string) {
    const preset = CAMERA_PRESETS.find((item) => item.id === id);
    if (!preset) return;
    setCameraId(id);
    setSensorW(preset.widthMm);
    setSensorH(preset.heightMm);
    setPixelUm(preset.pixelUm);
    setResX(preset.resX);
    setResY(preset.resY);
  }

  function applyEyepiece(id: string) {
    const preset = EYEPIECE_PRESETS.find((item) => item.id === id);
    if (!preset) return;
    setEyepieceId(id);
    setEyepieceMm(preset.focalMm);
    setAfov(preset.afov);
  }

  const statusTone =
    optics.sampling.status === "Well-Sampled"
      ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-200"
      : optics.sampling.status === "Undersampled"
        ? "border-amber-400/40 bg-amber-500/15 text-amber-100"
        : "border-sky-400/40 bg-sky-500/15 text-sky-100";

  const meterMin = 0.15;
  const meterMax = 4;
  const meterPct = (value: number) => `${clampNumber(((value - meterMin) / (meterMax - meterMin)) * 100, 0, 100)}%`;

  return (
    <section id="telescope-calculator" className="scroll-mt-32 border-t border-cyan-500/20 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-cyan-200">
            <Aperture className="h-3.5 w-3.5" />
            Optics · Field of View · Sampling
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Telescope &amp; Camera Calculator</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
            Focal length, focal ratio, sensor geometry, image scale, and eyepiece magnification on one rig. The framing preview draws the camera rectangle and the eyepiece circle at the same angular scale as the target.
          </p>
        </div>

        <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="Calculator mode">
          {([
            ["camera", "Astrophotography Camera Mode", Camera],
            ["visual", "Visual Eyepiece Mode", Eye],
          ] as const).map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={mode === id}
              onClick={() => setMode(id)}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold ${
                mode === id
                  ? "border-cyan-300 bg-cyan-400 text-slate-950"
                  : "border-slate-700 bg-slate-950/70 text-slate-200 hover:border-cyan-500/40"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-5">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="mb-3 flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-300">
                <Telescope className="h-3.5 w-3.5" />
                Telescope
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {TELESCOPE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyTelescope(preset.id)}
                    className={`cursor-pointer rounded-xl border px-3 py-2 text-left ${
                      telescopeId === preset.id
                        ? "border-cyan-300 bg-cyan-400/15"
                        : "border-slate-700 bg-slate-950/70 hover:border-cyan-500/40"
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{preset.name}</div>
                    <div className="font-mono text-[10px] text-slate-400">
                      {preset.apertureMm} mm / {preset.focalLengthMm} mm {preset.nativeRatio}
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-4 space-y-3">
                <SliderField
                  label="Aperture"
                  value={apertureMm}
                  min={20}
                  max={600}
                  step={1}
                  unit=" mm"
                  onChange={(value) => {
                    setTelescopeId("custom");
                    setApertureMm(value);
                  }}
                />
                <SliderField
                  label="Focal Length"
                  value={focalLengthMm}
                  min={50}
                  max={5000}
                  step={1}
                  unit=" mm"
                  onChange={(value) => {
                    setTelescopeId("custom");
                    setFocalLengthMm(value);
                  }}
                />
              </div>
              <div className="mt-4">
                <div className="mb-2 text-xs font-semibold text-slate-200">Barlow / Focal Reducer</div>
                <div className="flex flex-wrap gap-1.5">
                  {MULTIPLIERS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMultiplier(item.value)}
                      className={`cursor-pointer rounded-lg border px-2 py-1 text-[11px] font-semibold ${
                        multiplier === item.value
                          ? "border-cyan-300 bg-cyan-400 text-slate-950"
                          : "border-slate-700 bg-slate-950 text-slate-300 hover:border-cyan-500/40"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {mode === "camera" ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <div className="mb-3 flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-200">
                  <Camera className="h-3.5 w-3.5" />
                  Camera sensor
                </div>
                <div className="max-h-64 space-y-1.5 overflow-y-auto pr-1">
                  {CAMERA_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyCamera(preset.id)}
                      className={`block w-full cursor-pointer rounded-xl border px-3 py-2 text-left ${
                        cameraId === preset.id
                          ? "border-amber-300 bg-amber-400/10"
                          : "border-slate-700 bg-slate-950/70 hover:border-amber-400/40"
                      }`}
                    >
                      <div className="text-xs font-bold text-white">{preset.name}</div>
                      <div className="font-mono text-[10px] text-slate-400">
                        {preset.widthMm}×{preset.heightMm} mm · {preset.pixelUm} µm · {preset.resX}×{preset.resY}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-4 space-y-3">
                  <SliderField
                    label="Sensor Width"
                    value={sensorW}
                    min={2}
                    max={50}
                    step={0.01}
                    unit=" mm"
                    onChange={(value) => {
                      setCameraId("custom");
                      setSensorW(value);
                      setResX(Math.round((value * 1000) / pixelUm));
                    }}
                  />
                  <SliderField
                    label="Sensor Height"
                    value={sensorH}
                    min={2}
                    max={40}
                    step={0.01}
                    unit=" mm"
                    onChange={(value) => {
                      setCameraId("custom");
                      setSensorH(value);
                      setResY(Math.round((value * 1000) / pixelUm));
                    }}
                  />
                  <SliderField
                    label="Pixel Size"
                    value={pixelUm}
                    min={0.8}
                    max={12}
                    step={0.01}
                    unit=" µm"
                    onChange={(value) => {
                      setCameraId("custom");
                      setPixelUm(value);
                      setResX(Math.round((sensorW * 1000) / value));
                      setResY(Math.round((sensorH * 1000) / value));
                    }}
                  />
                  <SliderField label="Camera Rotation" value={rotation} min={0} max={180} step={1} unit="°" onChange={setRotation} />
                  <SliderField label="Seeing FWHM" value={seeing} min={1} max={2.5} step={0.1} unit="″" onChange={setSeeing} />
                </div>
                <div className="mt-3">
                  <div className="mb-2 text-xs font-semibold text-slate-200">Binning</div>
                  <div className="flex gap-2">
                    {([1, 2, 3] as const).map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setBinning(value)}
                        className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-bold ${
                          binning === value ? "border-amber-300 bg-amber-400 text-slate-950" : "border-slate-700 text-slate-300"
                        }`}
                      >
                        {value}×{value}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <div className="mb-3 flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-300">
                  <Eye className="h-3.5 w-3.5" />
                  Eyepiece
                </div>
                <div className="space-y-1.5">
                  {EYEPIECE_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyEyepiece(preset.id)}
                      className={`block w-full cursor-pointer rounded-xl border px-3 py-2 text-left ${
                        eyepieceId === preset.id
                          ? "border-cyan-300 bg-cyan-400/15"
                          : "border-slate-700 bg-slate-950/70 hover:border-cyan-500/40"
                      }`}
                    >
                      <div className="text-xs font-bold text-white">{preset.name}</div>
                      <div className="font-mono text-[10px] text-slate-400">
                        {preset.focalMm} mm · {preset.afov}° AFOV
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-4 space-y-3">
                  <SliderField
                    label="Eyepiece Focal Length"
                    value={eyepieceMm}
                    min={3}
                    max={40}
                    step={0.5}
                    unit=" mm"
                    onChange={(value) => {
                      setEyepieceId("custom");
                      setEyepieceMm(value);
                    }}
                  />
                  <SliderField
                    label="Apparent Field of View"
                    value={afov}
                    min={40}
                    max={110}
                    step={1}
                    unit="°"
                    onChange={(value) => {
                      setEyepieceId("custom");
                      setAfov(value);
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 lg:col-span-7">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Stat label="Effective focal length" value={`${optics.effective.effectiveFocalLengthMm.toFixed(0)} mm`} />
              <Stat label="Effective focal ratio" value={`f/${optics.effective.focalRatio.toFixed(2)}`} />
              <Stat
                label="Camera field"
                value={`${formatDegrees(optics.fovW)} × ${formatDegrees(optics.fovH)}`}
                hint={`${formatArcmin(optics.fovW * 60)} × ${formatArcmin(optics.fovH * 60)}`}
              />
              <Stat label="Image scale" value={`${optics.scale.toFixed(2)}″/px`} hint={`${optics.binnedX} × ${optics.binnedY} @ ${binning}×${binning}`} />
            </div>

            <div className={`rounded-2xl border px-4 py-3 ${statusTone}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-extrabold">{optics.sampling.status}</div>
                <div className="font-mono text-[11px]">
                  Window {optics.sampling.bandLow.toFixed(2)}–{optics.sampling.bandHigh.toFixed(2)}″/px · {optics.sampling.pixelsAcrossFwhm.toFixed(1)} px across {seeing.toFixed(1)}″ FWHM
                </div>
              </div>
              <div className="relative mt-3 h-2.5 rounded-full bg-gradient-to-r from-sky-500 via-emerald-400 to-amber-500">
                <div
                  className="absolute inset-y-0 bg-white/25"
                  style={{ left: meterPct(optics.sampling.bandLow), width: `calc(${meterPct(optics.sampling.bandHigh)} - ${meterPct(optics.sampling.bandLow)})` }}
                />
                <div className="absolute top-1/2 h-4 w-0.5 -translate-y-1/2 bg-white shadow" style={{ left: meterPct(optics.scale) }} />
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-slate-100/80">
                Well-sampled means the scale sits inside both 0.67–2.0″/px and the Nyquist band for the selected seeing (FWHM/3 to FWHM/2).
                {optics.sampling.inGeneralWindow
                  ? " This scale is inside the general 0.67–2.0″/px window."
                  : " This scale is outside the general 0.67–2.0″/px window."}
                {optics.sampling.usedSeeingBandOnly ? " The seeing band is finer than 0.67″/px, so the Nyquist window is used on its own." : ""}
              </p>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400">Live sky target</div>
                <div className="flex gap-3 text-[11px] text-slate-300">
                  <label className="inline-flex items-center gap-1.5">
                    <input type="checkbox" checked={showSensor} onChange={(event) => setShowSensor(event.target.checked)} />
                    Sensor frame
                  </label>
                  <label className="inline-flex items-center gap-1.5">
                    <input type="checkbox" checked={showEyepiece} onChange={(event) => setShowEyepiece(event.target.checked)} />
                    Eyepiece circle
                  </label>
                </div>
              </div>
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                {SKY_TARGETS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTargetId(item.id)}
                    className={`w-28 shrink-0 cursor-pointer overflow-hidden rounded-xl border text-left ${
                      targetId === item.id ? "border-cyan-300" : "border-slate-700"
                    }`}
                  >
                    <img src={item.image} alt="" className="h-14 w-full object-cover" />
                    <span className="block px-2 py-1.5">
                      <span className="block text-[11px] font-bold text-white">{item.short}</span>
                      <span className="block font-mono text-[9px] text-slate-400">{item.sizeLabel}</span>
                    </span>
                  </button>
                ))}
              </div>
              <FramingCanvas
                target={target}
                sensorArcminW={optics.fovW * 60}
                sensorArcminH={optics.fovH * 60}
                rotationDeg={rotation}
                eyepieceArcmin={optics.visual.trueFieldDeg * 60}
                showSensor={showSensor}
                showEyepiece={showEyepiece}
                emphasize={mode}
              />
              <p className="mt-2 text-[11px] leading-relaxed text-slate-400">{target.credit}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Stat label="Diagonal FOV" value={formatDegrees(optics.fovD)} hint={formatArcmin(optics.fovD * 60)} />
              <Stat label="NPF untracked" value={formatSeconds(optics.shutter.npfSeconds)} hint="Equator, worst case" />
              <Stat label="500 rule" value={formatSeconds(optics.shutter.rule500Seconds)} hint={`Crop ${optics.shutter.cropFactor.toFixed(2)}×`} />
              <Stat label="Magnification" value={formatMag(optics.visual.magnification)} />
              <Stat label="True field" value={formatDegrees(optics.visual.trueFieldDeg)} hint={formatArcmin(optics.visual.trueFieldDeg * 60)} />
              <Stat label="Exit pupil" value={`${optics.visual.exitPupilMm.toFixed(2)} mm`} />
              <Stat label="Dawes limit" value={`${optics.visual.dawesArcsec.toFixed(2)}″`} />
              <Stat
                label="Useful magnification"
                value={`${formatMag(optics.visual.minUsefulMagnification)} – ${formatMag(optics.visual.maxUsefulMagnification)}`}
                hint="7 mm exit pupil to 2× per mm"
              />
              <Stat
                label="Light grasp vs eye"
                value={`${Math.round(optics.visual.lightGraspVsEye).toLocaleString("en-US")}×`}
                hint="Compared with a 7 mm pupil"
              />
            </div>

            {optics.visual.exitPupilMm > 7 ? (
              <p className="rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
                The exit pupil is larger than a 7 mm dark-adapted eye, so part of the light beam misses the pupil.
              </p>
            ) : null}
            {optics.visual.magnification > optics.visual.maxUsefulMagnification ? (
              <p className="rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
                Magnification is above the practical maximum for this aperture. The view gets dimmer without more detail.
              </p>
            ) : null}

            <p className="font-mono text-[11px] leading-relaxed text-slate-400">
              Image scale = {ARCSEC_PER_RADIAN} × {pixelUm.toFixed(2)} µm × {binning} / {optics.effective.effectiveFocalLengthMm.toFixed(0)} mm = {optics.scale.toFixed(2)}″/px.
              NPF seconds = (35 × f/{optics.effective.focalRatio.toFixed(2)} + 30 × {(pixelUm * binning).toFixed(2)} µm) / {optics.effective.effectiveFocalLengthMm.toFixed(0)} mm.
              Field angles use 2·atan(sensor / 2·EFL). Dawes limit = 116 / aperture mm.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
