import { useEffect, useRef, useState, useCallback } from "react";
import * as maplibregl from "maplibre-gl";
import type { RoadFeature, RiskLevel, RouteOption } from "../types";
import { buildMapStyle, isMapConfigured } from "../lib/mapStyle";
import { roadsToGeoJSON } from "../lib/geojson";
import { floodedAreas, riskZones, rainfallOverlay, waterLevelPoints } from "../lib/zones";
import MapSetupNotice from "./MapSetupNotice";

export type RiskFilterValue = "all" | "accessible" | "atRisk" | "inaccessible";
export type LayerKey = "accessibility" | "flooded" | "waterLevel" | "rainfall" | "riskZones";

const RISK_COLOR: Record<RiskLevel, string> = {
  clear: "#2f8f5b",
  caution: "#c98a2c",
  severe: "#b3402f",
};

function riskMatchesFilter(risk: RiskLevel, filter: RiskFilterValue): boolean {
  if (filter === "all") return true;
  if (filter === "accessible") return risk === "clear";
  if (filter === "atRisk") return risk === "caution";
  return risk === "severe";
}

import type { CitizenHazard } from "../utils/persistence";

interface FlyTarget {
  center: [number, number];
  zoom: number;
  key: number;
}

interface MapViewProps {
  roads: RoadFeature[];
  flyTo: FlyTarget | null;
  riskFilter: RiskFilterValue;
  activeLayers: Set<LayerKey>;
  selectedRoadId: string | null;
  onSelectRoad: (roadId: string | null) => void;
  userLocation: [number, number] | null;
  areaMarker?: { coords: [number, number]; name: string } | null;
  previewRoutes?: RouteOption[] | null;
  hazards?: CitizenHazard[] | null;
  onMapClickCoords?: (coords: [number, number]) => void;
  onSelectHazard?: (hazard: CitizenHazard) => void;
  activePinCoords?: [number, number] | null;
  className?: string;
}

export default function MapView({
  roads,
  flyTo,
  riskFilter,
  activeLayers,
  selectedRoadId,
  onSelectRoad,
  userLocation,
  areaMarker,
  previewRoutes,
  hazards,
  onMapClickCoords,
  onSelectHazard,
  activePinCoords,
  className,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);
  const areaMarkerRef = useRef<maplibregl.Marker | null>(null);
  const activePinMarkerRef = useRef<maplibregl.Marker | null>(null);
  const hazardMarkersRef = useRef<maplibregl.Marker[]>([]);
  const [ready, setReady] = useState(false);
  const configured = isMapConfigured();

  const setupLayers = useCallback((map: maplibregl.Map) => {
    try {
      if (!map.getSource("roads")) map.addSource("roads", { type: "geojson", data: roadsToGeoJSON([]) });
      if (!map.getSource("flooded")) map.addSource("flooded", { type: "geojson", data: floodedAreas([]) });
      if (!map.getSource("risk-zones")) map.addSource("risk-zones", { type: "geojson", data: riskZones([]) });
      if (!map.getSource("rainfall")) map.addSource("rainfall", { type: "geojson", data: rainfallOverlay([]) });
      if (!map.getSource("water-level")) map.addSource("water-level", { type: "geojson", data: waterLevelPoints([]) });
      if (!map.getSource("route")) map.addSource("route", { type: "geojson", data: { type: "FeatureCollection", features: [] } });

      if (!map.getLayer("rainfall-layer")) {
        map.addLayer({
          id: "rainfall-layer",
          type: "fill",
          source: "rainfall",
          paint: { "fill-color": "#4d7fb8", "fill-opacity": 0.14 },
          layout: { visibility: "none" },
        });
      }

      if (!map.getLayer("risk-zones-layer")) {
        map.addLayer({
          id: "risk-zones-layer",
          type: "fill",
          source: "risk-zones",
          paint: {
            "fill-color": ["match", ["get", "risk"], "severe", RISK_COLOR.severe, "caution", RISK_COLOR.caution, "#999"],
            "fill-opacity": 0.12,
          },
          layout: { visibility: "none" },
        });
      }

      if (!map.getLayer("flooded-layer")) {
        map.addLayer({
          id: "flooded-layer",
          type: "fill",
          source: "flooded",
          paint: { "fill-color": RISK_COLOR.severe, "fill-opacity": 0.28 },
          layout: { visibility: "none" },
        });
      }

      if (!map.getLayer("flooded-outline")) {
        map.addLayer({
          id: "flooded-outline",
          type: "line",
          source: "flooded",
          paint: { "line-color": RISK_COLOR.severe, "line-width": 1.5, "line-opacity": 0.6 },
          layout: { visibility: "none" },
        });
      }

      if (!map.getLayer("route-casing")) {
        map.addLayer({
          id: "route-casing",
          type: "line",
          source: "route",
          paint: { "line-color": "#ffffff", "line-width": 8, "line-opacity": 0.9 },
          layout: { "line-cap": "round", "line-join": "round" },
        });
      }

      if (!map.getLayer("route-line")) {
        map.addLayer({
          id: "route-line",
          type: "line",
          source: "route",
          paint: {
            "line-color": ["match", ["get", "risk"], "severe", RISK_COLOR.severe, "caution", RISK_COLOR.caution, RISK_COLOR.clear],
            "line-width": 5,
            "line-dasharray": ["case", ["==", ["get", "isAlt"], true], ["literal", [2, 1.5]], ["literal", [1, 0]]],
          },
          layout: { "line-cap": "round", "line-join": "round" },
        });
      }

      if (!map.getLayer("roads-casing")) {
        map.addLayer({
          id: "roads-casing",
          type: "line",
          source: "roads",
          paint: { "line-color": "#0d1420", "line-width": 10, "line-opacity": 0 },
          layout: { "line-cap": "round", "line-join": "round" },
        });
      }

      if (!map.getLayer("roads-line")) {
        map.addLayer({
          id: "roads-line",
          type: "line",
          source: "roads",
          paint: {
            "line-color": ["match", ["get", "risk"], "severe", RISK_COLOR.severe, "caution", RISK_COLOR.caution, RISK_COLOR.clear],
            "line-width": ["case", ["==", ["get", "selected"], true], 7, 4.5],
            "line-opacity": ["case", ["==", ["get", "dimmed"], true], 0.18, 0.95],
          },
          layout: { "line-cap": "round", "line-join": "round", visibility: "none" },
        });
      }

      if (!map.getLayer("roads-selected-halo")) {
        map.addLayer({
          id: "roads-selected-halo",
          type: "line",
          source: "roads",
          filter: ["==", ["get", "selected"], true],
          paint: { "line-color": "#0d1420", "line-width": 10, "line-opacity": 0.15, "line-blur": 2 },
          layout: { "line-cap": "round", "line-join": "round", visibility: "none" },
        });
      }

      if (!map.getLayer("water-level-layer")) {
        map.addLayer({
          id: "water-level-layer",
          type: "circle",
          source: "water-level",
          paint: {
            "circle-radius": ["interpolate", ["linear"], ["get", "radius"], 40, 5, 230, 16],
            "circle-color": ["match", ["get", "risk"], "severe", RISK_COLOR.severe, "caution", RISK_COLOR.caution, RISK_COLOR.clear],
            "circle-opacity": 0.35,
            "circle-stroke-width": 1.5,
            "circle-stroke-color": "#ffffff",
          },
          layout: { visibility: "none" },
        });
      }
    } catch (err) {
      console.warn("setupLayers warning:", err);
    }
  }, []);

  // init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current || !configured) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: buildMapStyle(),
      center: [78.9629, 22.5937],
      zoom: 4.2,
      attributionControl: { compact: true },
    });
    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");

    const onLoad = () => {
      setupLayers(map);
      setReady(true);
      map.resize();
    };

    map.on("load", onLoad);
    map.on("style.load", onLoad);

    // Initial resize after mount
    setTimeout(() => {
      map.resize();
    }, 100);

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    map.on("click", "roads-casing", (e: maplibregl.MapLayerMouseEvent) => {
      const feature = e.features?.[0];
      if (feature) {
        onSelectRoad(String(feature.properties?.id));
        e.originalEvent.stopPropagation();
      }
    });
    map.on("mouseenter", "roads-casing", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "roads-casing", () => {
      map.getCanvas().style.cursor = "";
    });
    map.on("click", (e: maplibregl.MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ["roads-casing"] });
      if (features.length === 0) {
        onSelectRoad(null);
      }
      if (onMapClickCoords) {
        onMapClickCoords([Number(e.lngLat.lng.toFixed(5)), Number(e.lngLat.lat.toFixed(5))]);
      }
    });

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configured]);

  // update road data + filter + selection
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const geo = roadsToGeoJSON(roads);
    geo.features.forEach((f) => {
      const risk = f.properties?.risk as RiskLevel;
      const matches = riskMatchesFilter(risk, riskFilter);
      f.properties = {
        ...f.properties,
        dimmed: !matches,
        selected: f.properties?.id === selectedRoadId,
      };
    });
    (map.getSource("roads") as maplibregl.GeoJSONSource | undefined)?.setData(geo);
  }, [roads, riskFilter, selectedRoadId, ready]);

  // derived overlay layers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    (map.getSource("flooded") as maplibregl.GeoJSONSource | undefined)?.setData(floodedAreas(roads));
    (map.getSource("risk-zones") as maplibregl.GeoJSONSource | undefined)?.setData(riskZones(roads));
    (map.getSource("rainfall") as maplibregl.GeoJSONSource | undefined)?.setData(rainfallOverlay(roads));
    (map.getSource("water-level") as maplibregl.GeoJSONSource | undefined)?.setData(waterLevelPoints(roads));
  }, [roads, ready]);

  // route preview + endpoint markers
  const routeEndpointMarkersRef = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const src = map.getSource("route") as maplibregl.GeoJSONSource | undefined;
    if (!src) return;

    // Clear previous endpoint markers
    routeEndpointMarkersRef.current.forEach((m) => m.remove());
    routeEndpointMarkersRef.current = [];

    if (!previewRoutes || previewRoutes.length === 0) {
      src.setData({ type: "FeatureCollection", features: [] });
      return;
    }
    src.setData({
      type: "FeatureCollection",
      features: previewRoutes.map((r, i) => ({
        type: "Feature",
        properties: { risk: r.risk, isAlt: i > 0 },
        geometry: { type: "LineString", coordinates: r.path },
      })),
    });

    // Add origin marker (first point of first route)
    const firstRoute = previewRoutes[0];
    if (firstRoute && firstRoute.path.length >= 2) {
      const originCoords = firstRoute.path[0];
      const destCoords = firstRoute.path[firstRoute.path.length - 1];

      // Origin — teal pulsing circle
      const originEl = document.createElement("div");
      originEl.className = "relative flex items-center justify-center";
      originEl.innerHTML = `
        <span class="locate-pulse absolute inset-0 block" style="--color-channel-500: #1f9a97;"></span>
        <span class="relative block w-4 h-4 rounded-full border-[3px] border-white shadow-lg" style="background: #1f9a97;"></span>
      `;
      const originMarker = new maplibregl.Marker({ element: originEl })
        .setLngLat(originCoords as [number, number])
        .addTo(map);
      routeEndpointMarkersRef.current.push(originMarker);

      // Destination — red flag pin
      const destEl = document.createElement("div");
      destEl.innerHTML = `
        <svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 0C6.3 0 0 6.2 0 13.8C0 24.2 14 36 14 36C14 36 28 24.2 28 13.8C28 6.2 21.7 0 14 0Z" fill="#dc2626"/>
          <circle cx="14" cy="13.5" r="5.5" fill="#fff"/>
          <circle cx="14" cy="13.5" r="2.5" fill="#dc2626"/>
        </svg>`;
      const destMarker = new maplibregl.Marker({ element: destEl, anchor: "bottom" })
        .setLngLat(destCoords as [number, number])
        .addTo(map);
      routeEndpointMarkersRef.current.push(destMarker);
    }
  }, [previewRoutes, ready]);

  // layer visibility toggles — road accessibility layer is always the base layer
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const vis = (on: boolean) => (on ? "visible" : "none");
    map.setLayoutProperty("roads-line", "visibility", vis(activeLayers.has("accessibility")));
    map.setLayoutProperty("roads-selected-halo", "visibility", vis(activeLayers.has("accessibility")));
    map.setLayoutProperty("flooded-layer", "visibility", vis(activeLayers.has("flooded")));
    map.setLayoutProperty("flooded-outline", "visibility", vis(activeLayers.has("flooded")));
    map.setLayoutProperty("water-level-layer", "visibility", vis(activeLayers.has("waterLevel")));
    map.setLayoutProperty("rainfall-layer", "visibility", vis(activeLayers.has("rainfall")));
    map.setLayoutProperty("risk-zones-layer", "visibility", vis(activeLayers.has("riskZones")));
  }, [activeLayers, ready]);

  // fly-to
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || !flyTo) return;
    map.flyTo({ center: flyTo.center, zoom: flyTo.zoom, duration: 1600, essential: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flyTo?.key, ready]);

  // user location marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }
    if (userLocation) {
      const el = document.createElement("div");
      el.className = "relative w-4 h-4";
      el.innerHTML = `<span class="locate-pulse absolute inset-0 block"></span><span class="relative block w-4 h-4 rounded-full bg-channel-500 border-2 border-white shadow-md"></span>`;
      userMarkerRef.current = new maplibregl.Marker({ element: el }).setLngLat(userLocation).addTo(map);
    }
  }, [userLocation, ready]);

  // area marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    if (areaMarkerRef.current) {
      areaMarkerRef.current.remove();
      areaMarkerRef.current = null;
    }
    if (areaMarker) {
      const el = document.createElement("div");
      el.innerHTML = `
        <svg width="30" height="38" viewBox="0 0 30 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 0C6.7 0 0 6.6 0 14.8C0 25.9 15 38 15 38C15 38 30 25.9 30 14.8C30 6.6 23.3 0 15 0Z" fill="#0d1420"/>
          <circle cx="15" cy="14.5" r="6.5" fill="#1f9a97"/>
        </svg>`;
      areaMarkerRef.current = new maplibregl.Marker({ element: el, anchor: "bottom" })
        .setLngLat(areaMarker.coords)
        .addTo(map);
    }
  }, [areaMarker, ready]);

  // citizen hazard markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    // Clear existing hazard markers
    hazardMarkersRef.current.forEach((m) => m.remove());
    hazardMarkersRef.current = [];

    if (!hazards || hazards.length === 0) return;

    hazards.forEach((h) => {
      const el = document.createElement("div");
      el.className = "cursor-pointer group relative transition-transform hover:scale-110";
      const isSevere = h.waterLevel === "Above waist" || h.waterLevel === "Waist-level";
      const isCaution = h.waterLevel === "Knee-level";
      const color = isSevere ? "#dc2626" : isCaution ? "#d97706" : "#059669";
      const bgSoft = isSevere ? "#fef2f2" : isCaution ? "#fffbeb" : "#ecfdf5";

      el.innerHTML = `
        <div style="background: ${color}; box-shadow: 0 0 12px ${color}88;" class="relative flex items-center justify-center w-7 h-7 rounded-full text-white border-2 border-white shadow-lg">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center pointer-events-none z-30">
          <div style="background: #0d1420; color: #fff;" class="px-2.5 py-1.5 rounded-xl shadow-xl text-[11px] whitespace-nowrap font-medium flex items-center gap-1.5">
            <span style="color: ${color}; font-weight: 700;">${h.hazardType}</span> • ${h.waterLevel}
          </div>
          <div style="border-top-color: #0d1420;" class="w-0 h-0 border-x-4 border-x-transparent border-t-4"></div>
        </div>
      `;

      el.addEventListener("click", (ev) => {
        ev.stopPropagation();
        if (onSelectHazard) {
          onSelectHazard(h);
        } else {
          // popup
          new maplibregl.Popup({ offset: 18, closeButton: true, className: "hazard-popup" })
            .setLngLat([h.longitude, h.latitude])
            .setHTML(`
              <div style="padding: 10px; font-family: system-ui, sans-serif; max-width: 240px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                  <span style="font-size: 11px; font-weight: 700; color: ${color}; background: ${bgSoft}; padding: 2px 8px; rounded-radius: 9999px;">${h.hazardType}</span>
                  <span style="font-size: 10px; color: #64748b;">${h.submittedAt}</span>
                </div>
                <h4 style="font-weight: 600; font-size: 13px; color: #0f172a; margin: 0 0 4px 0;">${h.road}</h4>
                <p style="font-size: 11px; color: #334155; margin: 0 0 8px 0; line-height: 1.4;">${h.description}</p>
                <div style="font-size: 10px; color: #0284c7; font-weight: 600;">✓ Verified by ${h.verifiedCount} citizens</div>
              </div>
            `)
            .addTo(map);
        }
      });

      const marker = new maplibregl.Marker({ element: el, anchor: "center" })
        .setLngLat([h.longitude, h.latitude])
        .addTo(map);

      hazardMarkersRef.current.push(marker);
    });
  }, [hazards, ready, onSelectHazard]);

  // active drop-pin marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    if (activePinMarkerRef.current) {
      activePinMarkerRef.current.remove();
      activePinMarkerRef.current = null;
    }

    if (activePinCoords) {
      const el = document.createElement("div");
      el.className = "relative flex items-center justify-center animate-bounce";
      el.innerHTML = `
        <div class="relative flex items-center justify-center w-8 h-8 rounded-full bg-channel-500 text-ink-950 border-2 border-white shadow-xl">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
          </svg>
        </div>
      `;
      activePinMarkerRef.current = new maplibregl.Marker({ element: el, anchor: "bottom" })
        .setLngLat(activePinCoords)
        .addTo(map);
    }
  }, [activePinCoords, ready]);

  if (!configured) {
    return <MapSetupNotice className={className} />;
  }

  return <div ref={containerRef} className={className ?? "w-full h-full"} role="application" aria-label="Interactive flood and road accessibility map" />;
}
