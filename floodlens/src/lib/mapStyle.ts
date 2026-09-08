import type { StyleSpecification } from "maplibre-gl";

/**
 * FloodLens ships with zero paid map dependencies.
 *
 * Default: OpenStreetMap's standard raster tiles (openstreetmap.org), which are
 * free and require no API key. This is fine for a hackathon demo, but OSM's
 * tile policy is not meant for production traffic — swap in a free-tier
 * provider key (MapTiler, Stadia, Maptiler Cloud, etc.) by setting
 * VITE_MAP_TILE_URL / VITE_MAP_TILE_ATTRIBUTION in a .env file, and this
 * builder will pick it up automatically without any code changes.
 */

const DEFAULT_TILE_URL =
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const DEFAULT_ATTRIBUTION =
  '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors';

export function isMapConfigured(): boolean {
  // OSM raster tiles need no key, so the map is always "configured" out of the
  // box. This function exists so a custom provider can be required instead —
  // set VITE_MAP_REQUIRES_KEY=true and VITE_MAP_TILE_URL to enforce it.
  const requiresKey = import.meta.env.VITE_MAP_REQUIRES_KEY === "true";
  if (!requiresKey) return true;
  return Boolean(import.meta.env.VITE_MAP_TILE_URL);
}

export function buildMapStyle(): StyleSpecification {
  const tileUrl = import.meta.env.VITE_MAP_TILE_URL || DEFAULT_TILE_URL;
  const attribution =
    import.meta.env.VITE_MAP_TILE_ATTRIBUTION || DEFAULT_ATTRIBUTION;

  return {
    version: 8,
    glyphs: "https://fonts.openmaptiles.org/{fontstack}/{range}.pbf",
    sources: {
      "osm-tiles": {
        type: "raster",
        tiles: [tileUrl],
        tileSize: 256,
        attribution,
        maxzoom: 19,
      },
    },
    layers: [
      {
        id: "background",
        type: "background",
        paint: { "background-color": "#dfe6df" },
      },
      {
        id: "osm-tiles-layer",
        type: "raster",
        source: "osm-tiles",
        paint: {
          "raster-saturation": -0.35,
          "raster-contrast": 0.05,
          "raster-brightness-min": 0.15,
        },
      },
    ],
  };
}
