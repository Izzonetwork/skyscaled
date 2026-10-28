"use client";

import React, { useEffect } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip, useMap, useMapEvents } from "react-leaflet";
import type { SkySite } from "@/data/observerPresets";
import { overlayTileUrl } from "@/lib/lightPollution";
import "leaflet/dist/leaflet.css";

function MapBridge({
  lat,
  lon,
  onPick,
}: {
  lat: number;
  lon: number;
  onPick: (lat: number, lon: number) => void;
}) {
  const map = useMap();
  useMapEvents({
    click(event) {
      onPick(event.latlng.lat, event.latlng.lng);
    },
  });
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const container = map.getContainer();
      if (!container.isConnected) return;
      map.invalidateSize();
      const zoom = Math.max(map.getZoom(), 5);
      map.flyTo([lat, lon], zoom, { duration: 0.6 });
    }, 40);
    return () => window.clearTimeout(timer);
  }, [lat, lon, map]);
  return null;
}

export default function LightPollutionMapView({
  lat,
  lon,
  sites,
  opacity,
  onPick,
  onSite,
}: {
  lat: number;
  lon: number;
  sites: SkySite[];
  opacity: number;
  onPick: (lat: number, lon: number) => void;
  onSite: (site: SkySite) => void;
}) {
  return (
    <MapContainer
      center={[lat, lon]}
      zoom={4}
      minZoom={2}
      maxZoom={12}
      className="h-full w-full"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors &copy; CARTO'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <TileLayer
        url={overlayTileUrl(2025)}
        tileSize={1024}
        zoomOffset={-2}
        minZoom={2}
        maxNativeZoom={8}
        maxZoom={12}
        opacity={opacity}
        errorTileUrl="https://djlorenz.github.io/astronomy/image_tiles/tiles2025/black.png"
        attribution='VIIRS sky brightness &copy; <a href="https://djlorenz.github.io/astronomy/lp/" target="_blank" rel="noreferrer">David Lorenz Light Pollution Atlas</a>'
      />
      <MapBridge lat={lat} lon={lon} onPick={onPick} />
      {sites.map((site) => (
        <CircleMarker
          key={site.id}
          center={[site.lat, site.lon]}
          radius={site.kind === "observatory" ? 7 : 5}
          pathOptions={{
            color: "#67e8f9",
            weight: 2,
            fillColor: site.kind === "observatory" ? "#fbbf24" : "#a78bfa",
            fillOpacity: 0.95,
          }}
          eventHandlers={{
            click: () => onSite(site),
          }}
        >
          <Tooltip direction="top">{site.name}</Tooltip>
          <Popup>
            <strong>{site.name}</strong>
            <div>{site.note}</div>
            <div>
              {site.lat.toFixed(3)}°, {site.lon.toFixed(3)}°
            </div>
          </Popup>
        </CircleMarker>
      ))}
      <CircleMarker
        center={[lat, lon]}
        radius={9}
        pathOptions={{ color: "#ffffff", weight: 2, fillColor: "#22d3ee", fillOpacity: 1 }}
      >
        <Tooltip direction="right">Inspector</Tooltip>
      </CircleMarker>
    </MapContainer>
  );
}
