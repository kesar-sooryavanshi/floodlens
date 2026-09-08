import type { Feature, FeatureCollection, LineString, Point } from "geojson";
import type { RoadFeature } from "../types";

export function roadsToGeoJSON(roads: RoadFeature[]): FeatureCollection<LineString> {
  return {
    type: "FeatureCollection",
    features: roads.map(
      (road): Feature<LineString> => ({
        type: "Feature",
        id: road.id,
        properties: {
          id: road.id,
          name: road.name,
          risk: road.risk,
        },
        geometry: {
          type: "LineString",
          coordinates: road.coordinates,
        },
      })
    ),
  };
}

export function pointFeature(
  id: string,
  coords: [number, number],
  properties: Record<string, unknown> = {}
): Feature<Point> {
  return {
    type: "Feature",
    id,
    properties: { id, ...properties },
    geometry: { type: "Point", coordinates: coords },
  };
}

export function pointsToGeoJSON(
  points: { id: string; coords: [number, number]; properties?: Record<string, unknown> }[]
): FeatureCollection<Point> {
  return {
    type: "FeatureCollection",
    features: points.map((p) => pointFeature(p.id, p.coords, p.properties)),
  };
}
