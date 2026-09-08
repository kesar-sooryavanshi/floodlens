import type { AreaSummary } from "../types";
import { PAN_INDIA_LOCATIONS, toAreaSummary } from "../services/locationSearch";

export const BASE_AREAS: AreaSummary[] = [
  {
    id: "meerut",
    name: "Meerut",
    region: "Uttar Pradesh, India",
    center: [77.7064, 28.9845],
    zoom: 12.5,
    risk: "caution",
    waterLevel: "Knee-level",
    trend: "Rising",
    affectedRoads: 3,
    accessibleRoads: 7,
    insight:
      "Flood conditions are increasing in the northern region. Three roads may require attention.",
  },
  {
    id: "delhi",
    name: "Delhi",
    region: "Delhi, India",
    center: [77.209, 28.6139],
    zoom: 11.5,
    risk: "severe",
    waterLevel: "Waist-level",
    trend: "Rising",
    affectedRoads: 5,
    accessibleRoads: 9,
    insight:
      "Yamuna-adjacent roads are seeing a sharp rise in water level. Avoid low-lying underpasses this evening.",
  },
  {
    id: "mumbai",
    name: "Mumbai",
    region: "Maharashtra, India",
    center: [72.8777, 19.076],
    zoom: 11.5,
    risk: "severe",
    waterLevel: "Above waist",
    trend: "Rising",
    affectedRoads: 6,
    accessibleRoads: 8,
    insight:
      "Heavy monsoon inflow near low-lying stations. Several arterial roads are inaccessible at high tide.",
  },
  {
    id: "patna",
    name: "Patna",
    region: "Bihar, India",
    center: [85.1376, 25.5941],
    zoom: 12,
    risk: "severe",
    waterLevel: "Waist-level",
    trend: "Rising",
    affectedRoads: 5,
    accessibleRoads: 8,
    insight:
      "Ganga river swell causing low-lying drainage reflux across Rajendra Nagar.",
  },
  {
    id: "guwahati",
    name: "Guwahati",
    region: "Assam, India",
    center: [91.7362, 26.1445],
    zoom: 12,
    risk: "severe",
    waterLevel: "Above waist",
    trend: "Rising",
    affectedRoads: 6,
    accessibleRoads: 5,
    insight:
      "Bharalu river overflow flooding Anil Nagar and Tarun Nagar.",
  },
  {
    id: "newyork",
    name: "New York",
    region: "New York, USA",
    center: [-74.006, 40.7128],
    zoom: 11.5,
    risk: "clear",
    waterLevel: "None",
    trend: "Steady",
    affectedRoads: 0,
    accessibleRoads: 12,
    insight: "No active flood advisories. All monitored roads are clear.",
  },
  {
    id: "london",
    name: "London",
    region: "England, UK",
    center: [-0.1276, 51.5072],
    zoom: 11.5,
    risk: "caution",
    waterLevel: "Ankle-level",
    trend: "Falling",
    affectedRoads: 2,
    accessibleRoads: 10,
    insight:
      "Surface water is receding after this morning's rainfall. Two riverside roads remain cautious.",
  },
];

// Combine base areas with all pan-India locations
const panIndiaSummaries = PAN_INDIA_LOCATIONS
  .filter((loc) => !BASE_AREAS.some((b) => b.id === loc.id))
  .map(toAreaSummary);

export const AREAS: AreaSummary[] = [...BASE_AREAS, ...panIndiaSummaries];

export function findArea(query: string): AreaSummary | undefined {
  const q = query.trim().toLowerCase();
  if (!q) return undefined;

  // Direct match
  const direct = AREAS.find(
    (a) =>
      a.name.toLowerCase() === q ||
      a.id.toLowerCase() === q
  );
  if (direct) return direct;

  // Substring match
  return AREAS.find(
    (a) =>
      a.name.toLowerCase().includes(q) ||
      a.region.toLowerCase().includes(q) ||
      a.id.includes(q)
  );
}
