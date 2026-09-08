import type { RoadFeature } from "../types";

export const ROADS: RoadFeature[] = [
  // ---- Meerut ----
  {
    id: "meerut-bypass",
    name: "Meerut Bypass Road",
    areaId: "meerut",
    risk: "caution",
    accessibility: "Accessible with caution",
    waterLevel: "Ankle-level",
    trend: "Rising",
    lastUpdated: "Just now",
    coordinates: [
      [77.672, 28.958],
      [77.69, 28.965],
      [77.712, 28.972],
      [77.734, 28.978],
    ],
  },
  {
    id: "garh-road",
    name: "Garh Road",
    areaId: "meerut",
    risk: "severe",
    accessibility: "Inaccessible — avoid",
    waterLevel: "Waist-level",
    trend: "Rising",
    lastUpdated: "6 min ago",
    coordinates: [
      [77.706, 29.0],
      [77.708, 28.99],
      [77.71, 28.978],
      [77.712, 28.966],
    ],
  },
  {
    id: "hapur-road",
    name: "Hapur Road",
    areaId: "meerut",
    risk: "severe",
    accessibility: "Inaccessible — avoid",
    waterLevel: "Above waist",
    trend: "Rising",
    lastUpdated: "12 min ago",
    coordinates: [
      [77.714, 28.984],
      [77.73, 28.975],
      [77.748, 28.964],
      [77.765, 28.953],
    ],
  },
  {
    id: "delhi-road-meerut",
    name: "Delhi Road",
    areaId: "meerut",
    risk: "clear",
    accessibility: "Accessible",
    waterLevel: "None",
    trend: "Steady",
    lastUpdated: "20 min ago",
    coordinates: [
      [77.678, 28.966],
      [77.667, 28.952],
      [77.652, 28.936],
      [77.638, 28.918],
    ],
  },
  {
    id: "baghpat-road",
    name: "Baghpat Road",
    areaId: "meerut",
    risk: "clear",
    accessibility: "Accessible",
    waterLevel: "None",
    trend: "Steady",
    lastUpdated: "25 min ago",
    coordinates: [
      [77.696, 28.99],
      [77.68, 28.998],
      [77.662, 29.008],
      [77.644, 29.018],
    ],
  },
  {
    id: "roorkee-road",
    name: "Roorkee Road",
    areaId: "meerut",
    risk: "caution",
    accessibility: "Accessible with caution",
    waterLevel: "Ankle-level",
    trend: "Rising",
    lastUpdated: "9 min ago",
    coordinates: [
      [77.71, 29.0],
      [77.716, 29.014],
      [77.722, 29.028],
      [77.728, 29.042],
    ],
  },
  {
    id: "mall-road",
    name: "Mall Road",
    areaId: "meerut",
    risk: "clear",
    accessibility: "Accessible",
    waterLevel: "None",
    trend: "Steady",
    lastUpdated: "30 min ago",
    coordinates: [
      [77.7, 28.99],
      [77.702, 28.978],
      [77.704, 28.966],
    ],
  },
  {
    id: "shastri-nagar",
    name: "Shastri Nagar Road",
    areaId: "meerut",
    risk: "clear",
    accessibility: "Accessible",
    waterLevel: "None",
    trend: "Steady",
    lastUpdated: "18 min ago",
    coordinates: [
      [77.686, 28.972],
      [77.694, 28.978],
      [77.702, 28.984],
    ],
  },
  {
    id: "kankarkhera-road",
    name: "Kankarkhera Road",
    areaId: "meerut",
    risk: "clear",
    accessibility: "Accessible",
    waterLevel: "None",
    trend: "Falling",
    lastUpdated: "40 min ago",
    coordinates: [
      [77.726, 28.99],
      [77.734, 28.998],
      [77.742, 29.006],
    ],
  },
  {
    id: "modipuram-link",
    name: "Modipuram Link Road",
    areaId: "meerut",
    risk: "caution",
    accessibility: "Accessible with caution",
    waterLevel: "Ankle-level",
    trend: "Steady",
    lastUpdated: "14 min ago",
    coordinates: [
      [77.65, 29.03],
      [77.664, 29.02],
      [77.678, 29.008],
      [77.692, 28.998],
    ],
  },

  // ---- Delhi ----
  {
    id: "ring-road-delhi",
    name: "Ring Road",
    areaId: "delhi",
    risk: "severe",
    accessibility: "Inaccessible — avoid",
    waterLevel: "Waist-level",
    trend: "Rising",
    lastUpdated: "4 min ago",
    coordinates: [
      [77.19, 28.6],
      [77.205, 28.615],
      [77.22, 28.63],
      [77.235, 28.645],
    ],
  },
  {
    id: "yamuna-bank-marg",
    name: "Yamuna Bank Marg",
    areaId: "delhi",
    risk: "severe",
    accessibility: "Inaccessible — avoid",
    waterLevel: "Above waist",
    trend: "Rising",
    lastUpdated: "2 min ago",
    coordinates: [
      [77.245, 28.6],
      [77.25, 28.615],
      [77.255, 28.63],
    ],
  },
  {
    id: "ito-underpass",
    name: "ITO Underpass",
    areaId: "delhi",
    risk: "severe",
    accessibility: "Inaccessible — avoid",
    waterLevel: "Above waist",
    trend: "Rising",
    lastUpdated: "5 min ago",
    coordinates: [
      [77.243, 28.628],
      [77.238, 28.632],
    ],
  },
  {
    id: "mathura-road",
    name: "Mathura Road",
    areaId: "delhi",
    risk: "caution",
    accessibility: "Accessible with caution",
    waterLevel: "Ankle-level",
    trend: "Rising",
    lastUpdated: "10 min ago",
    coordinates: [
      [77.235, 28.59],
      [77.242, 28.605],
      [77.248, 28.618],
    ],
  },
  {
    id: "outer-ring-road",
    name: "Outer Ring Road",
    areaId: "delhi",
    risk: "clear",
    accessibility: "Accessible",
    waterLevel: "None",
    trend: "Steady",
    lastUpdated: "22 min ago",
    coordinates: [
      [77.16, 28.58],
      [77.18, 28.6],
      [77.2, 28.62],
    ],
  },
  {
    id: "nh9-delhi",
    name: "NH-9",
    areaId: "delhi",
    risk: "caution",
    accessibility: "Accessible with caution",
    waterLevel: "Ankle-level",
    trend: "Steady",
    lastUpdated: "16 min ago",
    coordinates: [
      [77.26, 28.63],
      [77.28, 28.645],
      [77.3, 28.658],
    ],
  },
  {
    id: "aurobindo-marg",
    name: "Aurobindo Marg",
    areaId: "delhi",
    risk: "clear",
    accessibility: "Accessible",
    waterLevel: "None",
    trend: "Steady",
    lastUpdated: "31 min ago",
    coordinates: [
      [77.2, 28.56],
      [77.21, 28.575],
      [77.215, 28.59],
    ],
  },
  {
    id: "vikas-marg",
    name: "Vikas Marg",
    areaId: "delhi",
    risk: "clear",
    accessibility: "Accessible",
    waterLevel: "None",
    trend: "Falling",
    lastUpdated: "27 min ago",
    coordinates: [
      [77.26, 28.63],
      [77.275, 28.638],
      [77.29, 28.646],
    ],
  },

  // ---- Mumbai ----
  {
    id: "sion-road",
    name: "Sion Causeway",
    areaId: "mumbai",
    risk: "severe",
    accessibility: "Inaccessible — avoid",
    waterLevel: "Above waist",
    trend: "Rising",
    lastUpdated: "3 min ago",
    coordinates: [
      [72.86, 19.04],
      [72.865, 19.05],
      [72.87, 19.06],
    ],
  },
  {
    id: "hindmata",
    name: "Hindmata Road",
    areaId: "mumbai",
    risk: "severe",
    accessibility: "Inaccessible — avoid",
    waterLevel: "Waist-level",
    trend: "Rising",
    lastUpdated: "7 min ago",
    coordinates: [
      [72.835, 19.017],
      [72.84, 19.022],
    ],
  },
  {
    id: "western-express",
    name: "Western Express Highway",
    areaId: "mumbai",
    risk: "caution",
    accessibility: "Accessible with caution",
    waterLevel: "Ankle-level",
    trend: "Steady",
    lastUpdated: "11 min ago",
    coordinates: [
      [72.85, 19.08],
      [72.86, 19.1],
      [72.87, 19.12],
    ],
  },
  {
    id: "eastern-express",
    name: "Eastern Express Highway",
    areaId: "mumbai",
    risk: "clear",
    accessibility: "Accessible",
    waterLevel: "None",
    trend: "Steady",
    lastUpdated: "24 min ago",
    coordinates: [
      [72.88, 19.08],
      [72.89, 19.1],
      [72.9, 19.12],
    ],
  },
  {
    id: "marine-drive",
    name: "Marine Drive",
    areaId: "mumbai",
    risk: "caution",
    accessibility: "Accessible with caution",
    waterLevel: "Ankle-level",
    trend: "Rising",
    lastUpdated: "8 min ago",
    coordinates: [
      [72.822, 18.944],
      [72.818, 18.933],
      [72.814, 18.923],
    ],
  },
  {
    id: "andheri-link-road",
    name: "Andheri-Kurla Road",
    areaId: "mumbai",
    risk: "clear",
    accessibility: "Accessible",
    waterLevel: "None",
    trend: "Falling",
    lastUpdated: "35 min ago",
    coordinates: [
      [72.85, 19.11],
      [72.865, 19.108],
      [72.88, 19.106],
    ],
  },

  // ---- New York ----
  {
    id: "fdr-drive",
    name: "FDR Drive",
    areaId: "newyork",
    risk: "clear",
    accessibility: "Accessible",
    waterLevel: "None",
    trend: "Steady",
    lastUpdated: "40 min ago",
    coordinates: [
      [-73.975, 40.71],
      [-73.972, 40.73],
      [-73.968, 40.75],
    ],
  },
  {
    id: "broadway-ny",
    name: "Broadway",
    areaId: "newyork",
    risk: "clear",
    accessibility: "Accessible",
    waterLevel: "None",
    trend: "Steady",
    lastUpdated: "40 min ago",
    coordinates: [
      [-73.99, 40.72],
      [-73.985, 40.74],
      [-73.98, 40.76],
    ],
  },
  {
    id: "west-side-highway",
    name: "West Side Highway",
    areaId: "newyork",
    risk: "clear",
    accessibility: "Accessible",
    waterLevel: "None",
    trend: "Steady",
    lastUpdated: "40 min ago",
    coordinates: [
      [-74.01, 40.71],
      [-74.005, 40.73],
      [-74.0, 40.75],
    ],
  },

  // ---- London ----
  {
    id: "embankment",
    name: "Victoria Embankment",
    areaId: "london",
    risk: "caution",
    accessibility: "Accessible with caution",
    waterLevel: "Ankle-level",
    trend: "Falling",
    lastUpdated: "15 min ago",
    coordinates: [
      [-0.12, 51.507],
      [-0.11, 51.508],
      [-0.1, 51.509],
    ],
  },
  {
    id: "the-strand",
    name: "The Strand",
    areaId: "london",
    risk: "clear",
    accessibility: "Accessible",
    waterLevel: "None",
    trend: "Steady",
    lastUpdated: "38 min ago",
    coordinates: [
      [-0.122, 51.511],
      [-0.113, 51.512],
      [-0.105, 51.513],
    ],
  },
  {
    id: "millbank",
    name: "Millbank",
    areaId: "london",
    risk: "caution",
    accessibility: "Accessible with caution",
    waterLevel: "Ankle-level",
    trend: "Falling",
    lastUpdated: "19 min ago",
    coordinates: [
      [-0.126, 51.494],
      [-0.124, 51.5],
      [-0.122, 51.506],
    ],
  },
];

import { getLocationById, generateLocalRoadsForLocation } from "../services/locationSearch";
import type { RoadOverride } from "../utils/persistence";

export function roadsForArea(areaId: string, overrides?: Record<string, RoadOverride>): RoadFeature[] {
  let roads = ROADS.filter((r) => r.areaId === areaId);

  // If area is a Pan-India location not in static ROADS, generate dynamic corridor roads
  if (roads.length === 0) {
    const loc = getLocationById(areaId);
    if (loc) {
      roads = generateLocalRoadsForLocation(loc);
    }
  }

  // Apply overrides if available
  if (overrides) {
    roads = roads.map((road) => {
      const ov = overrides[road.id];
      if (!ov) return road;
      return {
        ...road,
        risk: ov.isClosed ? "severe" : ov.forcedRisk || road.risk,
        accessibility: ov.isClosed ? `Closed — ${ov.reason || "Authority barrier"}` : road.accessibility,
        waterLevel: ov.forcedWaterLevel || road.waterLevel,
        lastUpdated: `Override active (${ov.updatedAt})`,
      };
    });
  }

  return roads;
}

