"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

export type ObserverLocation = {
  lat: number;
  lon: number;
  label: string;
  source: "preset" | "search" | "geolocation" | "map" | "manual";
};

type ObserverLocationContextValue = {
  location: ObserverLocation;
  setLocation: (next: ObserverLocation) => void;
};

const ObserverLocationContext = createContext<ObserverLocationContextValue | null>(null);

const INITIAL: ObserverLocation = {
  lat: 19.8207,
  lon: -155.4681,
  label: "Mauna Kea, Hawaiʻi",
  source: "preset",
};

export function ObserverLocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<ObserverLocation>(INITIAL);
  const value = useMemo(() => ({ location, setLocation }), [location]);
  return <ObserverLocationContext.Provider value={value}>{children}</ObserverLocationContext.Provider>;
}

export function useObserverLocation(): ObserverLocationContextValue {
  const value = useContext(ObserverLocationContext);
  if (!value) {
    throw new Error("useObserverLocation must be used inside ObserverLocationProvider");
  }
  return value;
}

export async function reversePlaceLabel(lat: number, lon: number): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
    );
    if (!response.ok) return null;
    const data = (await response.json()) as {
      city?: string;
      locality?: string;
      principalSubdivision?: string;
      countryName?: string;
    };
    const parts = [data.city || data.locality, data.principalSubdivision, data.countryName].filter(
      (part, index, all): part is string => Boolean(part) && all.indexOf(part) === index,
    );
    return parts.slice(0, 3).join(", ") || null;
  } catch {
    return null;
  }
}
