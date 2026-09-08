import * as turf from "@turf/turf";
import type { FeatureCollection, Polygon, Point } from "geojson";
import type { RoadFeature, RiskLevel } from "../types";

const WATER_LEVEL_RADIUS: Record<string, number> = {
  None: 0,
  "Ankle-level": 60,
  "Knee-level": 110,
  "Waist-level": 170,
  "Above waist": 230,
};

function midpoint(coords: [number, number][]): [number, number] {
  const mid = coords[Math.floor(coords.length / 2)];
  return mid;
}

/** Circular "flooded area" polygons around roads at severe risk. */
export function floodedAreas(roads: RoadFeature[]): FeatureCollection<Polygon> {
  const severe = roads.filter((r) => r.risk === "severe");
  return turf.featureCollection(
    severe.map((r) =>
      turf.circle(midpoint(r.coordinates), 0.35, {
        units: "kilometers",
        properties: { roadId: r.id, name: r.name },
      })
    )
  ) as FeatureCollection<Polygon>;
}

/** Broader risk-zone polygons around every at-risk road, colored by risk level. */
export function riskZones(roads: RoadFeature[]): FeatureCollection<Polygon> {
  const atRisk = roads.filter((r) => r.risk !== "clear");
  return turf.featureCollection(
    atRisk.map((r) =>
      turf.circle(midpoint(r.coordinates), r.risk === "severe" ? 0.6 : 0.4, {
        units: "kilometers",
        properties: { roadId: r.id, risk: r.risk as RiskLevel },
      })
    )
  ) as FeatureCollection<Polygon>;
}

/** One soft rainfall overlay spanning the visible cluster of roads. */
export function rainfallOverlay(roads: RoadFeature[]): FeatureCollection<Polygon> {
  if (roads.length === 0) return turf.featureCollection([]) as FeatureCollection<Polygon>;
  const points = turf.featureCollection(
    roads.flatMap((r) => r.coordinates.map((c) => turf.point(c)))
  );
  const hull = turf.convex(points) ?? turf.circle(midpoint(roads[0].coordinates), 3, { units: "kilometers" });
  const buffered = turf.buffer(hull, 1.2, { units: "kilometers" }) as GeoJSON.Feature<Polygon>;
  return turf.featureCollection([buffered]) as FeatureCollection<Polygon>;
}

/** Point markers at road midpoints sized by reported water level. */
export function waterLevelPoints(roads: RoadFeature[]): FeatureCollection<Point> {
  const withWater = roads.filter((r) => r.waterLevel !== "None");
  return turf.featureCollection(
    withWater.map((r) =>
      turf.point(midpoint(r.coordinates), {
        roadId: r.id,
        name: r.name,
        level: r.waterLevel,
        radius: WATER_LEVEL_RADIUS[r.waterLevel] ?? 40,
        risk: r.risk,
      })
    )
  ) as FeatureCollection<Point>;
}
