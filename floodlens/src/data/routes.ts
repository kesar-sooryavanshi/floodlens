import type { RouteOption } from "../types";

export interface RoutePreset {
  from: string;
  to: string;
  options: RouteOption[];
}

export const ROUTE_PRESETS: RoutePreset[] = [
  {
    from: "Meerut",
    to: "Modipuram",
    options: [
      {
        id: "recommended",
        label: "Recommended Route",
        distanceKm: 12.4,
        durationMin: 24,
        risk: "clear",
        affectedRoads: 0,
        path: [
          [77.706, 28.984],
          [77.69, 28.998],
          [77.674, 29.012],
          [77.656, 29.026],
        ],
      },
      {
        id: "alternative",
        label: "Alternative Route",
        distanceKm: 14.1,
        durationMin: 29,
        risk: "caution",
        affectedRoads: 1,
        path: [
          [77.706, 28.984],
          [77.716, 28.998],
          [77.712, 29.014],
          [77.694, 29.026],
          [77.656, 29.026],
        ],
      },
    ],
  },
  {
    from: "Meerut",
    to: "Delhi",
    options: [
      {
        id: "recommended",
        label: "Recommended Route",
        distanceKm: 68.2,
        durationMin: 82,
        risk: "caution",
        affectedRoads: 1,
        path: [
          [77.706, 28.984],
          [77.6, 28.9],
          [77.4, 28.75],
          [77.209, 28.6139],
        ],
      },
      {
        id: "alternative",
        label: "Alternative Route",
        distanceKm: 74.5,
        durationMin: 95,
        risk: "severe",
        affectedRoads: 3,
        path: [
          [77.706, 28.984],
          [77.55, 28.85],
          [77.35, 28.7],
          [77.209, 28.6139],
        ],
      },
    ],
  },
];

export function findRoutePreset(from: string, to: string): RoutePreset {
  const match = ROUTE_PRESETS.find(
    (p) =>
      p.from.toLowerCase() === from.trim().toLowerCase() &&
      p.to.toLowerCase() === to.trim().toLowerCase()
  );
  if (match) return match;
  // Generic fallback so any pair of names still produces a believable demo result
  return {
    from,
    to,
    options: [
      {
        id: "recommended",
        label: "Recommended Route",
        distanceKm: 9.6,
        durationMin: 19,
        risk: "clear",
        affectedRoads: 0,
        path: ROUTE_PRESETS[0].options[0].path,
      },
      {
        id: "alternative",
        label: "Alternative Route",
        distanceKm: 11.3,
        durationMin: 23,
        risk: "caution",
        affectedRoads: 1,
        path: ROUTE_PRESETS[0].options[1].path,
      },
    ],
  };
}
