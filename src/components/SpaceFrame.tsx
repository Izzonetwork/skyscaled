import React from "react";

type SpaceFrameProps = {
  src: string;
  alt: string;
  credit?: string;
  kicker?: string;
  fit?: "cover" | "contain";
  className?: string;
  imgClassName?: string;
  priority?: boolean;
};

export default function SpaceFrame({
  src,
  alt,
  credit,
  kicker,
  fit = "cover",
  className = "",
  imgClassName = "",
  priority = false,
}: SpaceFrameProps) {
  return (
    <figure className={`relative overflow-hidden bg-slate-950 ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"} ${imgClassName}`}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
      <div className="reticle-overlay" aria-hidden="true" />
      <div className="corner-brackets" aria-hidden="true" />
      {kicker ? (
        <span className="telemetry-chip absolute left-3 top-3 max-w-[70%] rounded-md border border-cyan-300/40 bg-slate-950/85 px-2.5 py-1 text-[10px] font-bold text-cyan-100">
          {kicker}
        </span>
      ) : null}
      {credit ? (
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/88 to-transparent px-3 pb-2.5 pt-10 text-[10px] font-mono leading-snug text-slate-100 sm:text-[11px]">
          {credit}
        </figcaption>
      ) : null}
    </figure>
  );
}
