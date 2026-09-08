# FloodLens

Hyperlocal flood & road accessibility intelligence — a Smart India Hackathon frontend.

FloodLens shows people flood risk and road accessibility before they travel, on a real,
interactive world map — not a static illustration.

## Stack

- React + TypeScript + Vite
- Tailwind CSS v4
- Framer Motion, Lucide React
- **MapLibre GL JS** with free OpenStreetMap raster tiles (no paid API key required)
- Turf.js for the mock flood-zone / risk-zone / rainfall geometry
- React Router

Everything is frontend-only. There is no backend and no real ML model — road status, water
levels, and routes are realistic mock data (see `src/data/`), clearly labelled as demo data in
the UI.

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL. The map works out of the box using OpenStreetMap's public tiles.

To build for production:

```bash
npm run build
npm run preview
```

## Using a different map tile provider

OSM's public tile server is fine for a demo but isn't meant for production traffic. To point
FloodLens at a different free-tier provider (MapTiler, Stadia Maps, etc.), copy `.env.example`
to `.env` and set:

```
VITE_MAP_TILE_URL=https://your-provider.example/{z}/{x}/{y}.png?key=YOUR_KEY
VITE_MAP_TILE_ATTRIBUTION=© Your Provider
```

No code changes are required — `src/lib/mapStyle.ts` picks these up automatically. If you want
the app to refuse to render a fake/placeholder map when no provider is configured, set
`VITE_MAP_REQUIRES_KEY=true` as well; FloodLens will show a clear setup message instead of
silently falling back.

## Project structure

```
src/
  components/   Reusable UI: MapView (the core map), search, panels, modals
  data/         Mock cities, roads, and route presets
  lib/          Map style builder + GeoJSON/turf helpers for overlay layers
  pages/        Landing, Live Intelligence (main app), Road Accessibility,
                Flood Analysis, Safe Routes, About
  types.ts      Shared domain types (RoadFeature, AreaSummary, RouteOption...)
```

## Pages

- **/** — Landing page with a live embedded map preview
- **/live** — Live Intelligence: the full-screen map application (search, filters, layers,
  road details, safe-route hand-off, flood reporting)
- **/roads** — Road accessibility list + map, filterable by risk
- **/flood-analysis** — Plain-language flood summary per city
- **/routes** — Safe Routes: recommended vs. alternative route comparison
- **/about** — Product story

## Notes for judges

- Road names, coordinates, water levels, and risk trends are mock data mapped to realistic
  coordinates around Meerut, Delhi, Mumbai, New York, and London — clearly labelled as demo
  data wherever it's shown.
- The map is a genuine MapLibre GL instance: it zooms, pans, and searches like a real
  navigation product, from world view down to a specific road.
