import type { AreaSummary, RoadFeature } from "../types";

export interface IndiaLocation {
  id: string;
  name: string;
  state: string;
  region: string;
  center: [number, number]; // [lng, lat]
  zoom: number;
  risk: "clear" | "caution" | "severe";
  waterLevel: "None" | "Ankle-level" | "Knee-level" | "Waist-level" | "Above waist";
  riverBasin: string;
  floodHistory: string;
  insight: string;
}

export const PAN_INDIA_LOCATIONS: IndiaLocation[] = [
  {
    id: "delhi",
    name: "Delhi NCR",
    state: "Delhi",
    region: "National Capital Region, India",
    center: [77.209, 28.6139],
    zoom: 11.5,
    risk: "severe",
    waterLevel: "Waist-level",
    riverBasin: "Yamuna Basin",
    floodHistory: "Heavy Yamuna overflow affecting Kashmere Gate, Ring Road, and Mayur Vihar",
    insight: "Yamuna water levels above danger mark (205.8m). Key underpasses inundated.",
  },
  {
    id: "meerut",
    name: "Meerut",
    state: "Uttar Pradesh",
    region: "Uttar Pradesh, India",
    center: [77.7064, 28.9845],
    zoom: 12.5,
    risk: "caution",
    waterLevel: "Knee-level",
    riverBasin: "Hindon / Kali Basin",
    floodHistory: "Seasonal waterlogging in low-lying underpasses along Garh and Hapur Road",
    insight: "Moderate waterlogging on Garh Road underpass. Bypass routes remain clear.",
  },
  {
    id: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    region: "Maharashtra, India",
    center: [72.8777, 19.076],
    zoom: 11.5,
    risk: "severe",
    waterLevel: "Above waist",
    riverBasin: "Mithi River & Coastal",
    floodHistory: "Chronic tidal inundation at Hindmata, Milan Subway, Kurla, and King's Circle",
    insight: "High tide warning (4.5m) synchronized with intense cloudburst. Avoid subways.",
  },
  {
    id: "patna",
    name: "Patna",
    state: "Bihar",
    region: "Bihar, India",
    center: [85.1376, 25.5941],
    zoom: 12,
    risk: "severe",
    waterLevel: "Waist-level",
    riverBasin: "Ganga / Son Basin",
    floodHistory: "Recurrent Ganga swell leading to low-lying drainage reflux across Rajendra Nagar",
    insight: "Ganga flowing 1.2m above danger level at Digha Ghat. Ashok Rajpath congested.",
  },
  {
    id: "guwahati",
    name: "Guwahati",
    state: "Assam",
    region: "Assam, India",
    center: [91.7362, 26.1445],
    zoom: 12,
    risk: "severe",
    waterLevel: "Above waist",
    riverBasin: "Brahmaputra Basin",
    floodHistory: "Flash floods from Meghalaya hills inundating GS Road and Zoo Road",
    insight: "Bharalu river overflow flooding Anil Nagar and Tarun Nagar. Boat rescues active.",
  },
  {
    id: "chennai",
    name: "Chennai",
    state: "Tamil Nadu",
    region: "Tamil Nadu, India",
    center: [80.2707, 13.0827],
    zoom: 11.5,
    risk: "caution",
    waterLevel: "Knee-level",
    riverBasin: "Adyar & Cooum Basins",
    floodHistory: "Northeast monsoon inundation along Velachery, Mudichur, and Tambaram",
    insight: "Velachery Main Road experiencing knee-level pooling. Chembarambakkam outflow normal.",
  },
  {
    id: "bengaluru",
    name: "Bengaluru",
    state: "Karnataka",
    region: "Karnataka, India",
    center: [77.5946, 12.9716],
    zoom: 11.5,
    risk: "caution",
    waterLevel: "Ankle-level",
    riverBasin: "Vrishabhavathi Basin",
    floodHistory: "Urban lake breaches causing arterial blockage on Outer Ring Road (ORR) and Bellandur",
    insight: "Slow traffic near Bellandur EcoSpace due to stormwater runoff. Sarjapur clear.",
  },
  {
    id: "kolkata",
    name: "Kolkata",
    state: "West Bengal",
    region: "West Bengal, India",
    center: [88.3639, 22.5726],
    zoom: 11.5,
    risk: "caution",
    waterLevel: "Knee-level",
    riverBasin: "Hooghly River",
    floodHistory: "Cyclonic surge and drainage stagnation in Central Avenue, Behala, and Park Circus",
    insight: "Water stagnation reported around Thanthania Kalibari. Lock gates opened at low tide.",
  },
  {
    id: "hyderabad",
    name: "Hyderabad",
    state: "Telangana",
    region: "Telangana, India",
    center: [78.4867, 17.385],
    zoom: 11.5,
    risk: "clear",
    waterLevel: "None",
    riverBasin: "Musi River Basin",
    floodHistory: "Historic 2020 cloudburst flooding Ramanthapur and Begumpet nala",
    insight: "Musi river channels normal. All city flyovers and arterial roads clear.",
  },
  {
    id: "surat",
    name: "Surat",
    state: "Gujarat",
    region: "Gujarat, India",
    center: [72.8311, 21.1702],
    zoom: 12,
    risk: "caution",
    waterLevel: "Ankle-level",
    riverBasin: "Tapi River Basin",
    floodHistory: "Ukai Dam discharge leading to Causeway submersion",
    insight: "Ukai dam outflow at 150,000 cusecs. Weir-cum-causeway closed for light vehicles.",
  },
  {
    id: "srinagar",
    name: "Srinagar",
    state: "Jammu & Kashmir",
    region: "Jammu & Kashmir, India",
    center: [74.7973, 34.0837],
    zoom: 12,
    risk: "caution",
    waterLevel: "Ankle-level",
    riverBasin: "Jhelum River Basin",
    floodHistory: "Jhelum breach threat in Rajbagh and Lal Chowk during spring snowmelt",
    insight: "Jhelum gauge at Ram Munshi Bagh below alert mark (16 ft). Bund roads monitored.",
  },
  {
    id: "varanasi",
    name: "Varanasi",
    state: "Uttar Pradesh",
    region: "Uttar Pradesh, India",
    center: [82.9739, 25.3176],
    zoom: 12.5,
    risk: "severe",
    waterLevel: "Waist-level",
    riverBasin: "Ganga / Varuna Basin",
    floodHistory: "Submerged ghat stairs and Varuna corridor inundation in low-lying localities",
    insight: "Ghats completely submerged. Aarti shifted to rooftop platforms. Varuna bridge restricted.",
  },
  {
    id: "kochi",
    name: "Kochi",
    state: "Kerala",
    region: "Kerala, India",
    center: [76.2673, 9.9312],
    zoom: 12,
    risk: "caution",
    waterLevel: "Knee-level",
    riverBasin: "Periyar Basin & Backwaters",
    floodHistory: "Periyar floodgate releases impacting Aluva, Eloor, and Kalamassery",
    insight: "Aluva Shiva temple courtyard submerged by Periyar rise. Airport dyke walls secure.",
  },
  {
    id: "haridwar",
    name: "Haridwar",
    state: "Uttarakhand",
    region: "Uttarakhand, India",
    center: [78.1642, 29.9457],
    zoom: 12.5,
    risk: "caution",
    waterLevel: "Ankle-level",
    riverBasin: "Upper Ganga Basin",
    floodHistory: "Upstream dam discharges leading to high current near Har Ki Pauri and Bairag Camp",
    insight: "Ganga discharge at Bhimgoda barrage 180,000 cusecs. Ghat warnings sounded.",
  },
  {
    id: "cuttack",
    name: "Cuttack",
    state: "Odisha",
    region: "Odisha, India",
    center: [85.8828, 20.4625],
    zoom: 12,
    risk: "severe",
    waterLevel: "Waist-level",
    riverBasin: "Mahanadi & Kathajodi",
    floodHistory: "Deltaic confluence overflow during Hirakud gate release",
    insight: "Kathajodi embankment seepage monitored. Ring road low zones waterlogged.",
  },
  {
    id: "pune",
    name: "Pune",
    state: "Maharashtra",
    region: "Maharashtra, India",
    center: [73.8567, 18.5204],
    zoom: 12,
    risk: "caution",
    waterLevel: "Ankle-level",
    riverBasin: "Mutha / Mula Basin",
    floodHistory: "Khadakwasla dam discharge inundating Baba Bhide bridge and Sinhagad Road",
    insight: "Khadakwasla release steady at 12,000 cusecs. Riverside road traffic diverted.",
  },
  {
    id: "ahmedabad",
    name: "Ahmedabad",
    state: "Gujarat",
    region: "Gujarat, India",
    center: [72.5714, 23.0225],
    zoom: 12,
    risk: "clear",
    waterLevel: "None",
    riverBasin: "Sabarmati Basin",
    floodHistory: "Dharoi dam surplus causing Sabarmati Riverfront lower promenade closure",
    insight: "Sabarmati Riverfront lower walkway open. Inflow from Dharoi well managed.",
  },
  {
    id: "lucknow",
    name: "Lucknow",
    state: "Uttar Pradesh",
    region: "Uttar Pradesh, India",
    center: [80.9462, 26.8467],
    zoom: 12,
    risk: "clear",
    waterLevel: "None",
    riverBasin: "Gomti Basin",
    floodHistory: "Gomti river swelling into riverfront parks and low-lying slums",
    insight: "Gomti barrage gates regulated. Shaheed Path and Gomti Nagar roads fully clear.",
  },
  {
    id: "chiplun",
    name: "Chiplun",
    state: "Maharashtra",
    region: "Konkan, Maharashtra, India",
    center: [73.518, 17.532],
    zoom: 13,
    risk: "severe",
    waterLevel: "Above waist",
    riverBasin: "Vashishti River",
    floodHistory: "Catastrophic cloudburst flooding Mumbai-Goa highway and central market",
    insight: "Vashishti river overflowing Mumbai-Goa NH-66. Town center inundated.",
  },
];

export function searchIndiaLocations(query: string, limit = 8): IndiaLocation[] {
  const q = query.trim().toLowerCase();
  if (!q) return PAN_INDIA_LOCATIONS.slice(0, limit);

  return PAN_INDIA_LOCATIONS.filter((loc) => {
    return (
      loc.name.toLowerCase().includes(q) ||
      loc.state.toLowerCase().includes(q) ||
      loc.region.toLowerCase().includes(q) ||
      loc.riverBasin.toLowerCase().includes(q)
    );
  }).slice(0, limit);
}

export function getLocationById(id: string): IndiaLocation | undefined {
  return PAN_INDIA_LOCATIONS.find((loc) => loc.id === id || loc.name.toLowerCase() === id.toLowerCase());
}

/**
 * Reverse geocode any lat/lng coordinate in India to the nearest known locality
 */
export function reverseGeocodeIndia(lat: number, lng: number): { name: string; region: string; distanceKm: number } {
  let closest = PAN_INDIA_LOCATIONS[0];
  let minDistance = Number.MAX_VALUE;

  for (const loc of PAN_INDIA_LOCATIONS) {
    const dLat = loc.center[1] - lat;
    const dLng = loc.center[0] - lng;
    const dist = Math.hypot(dLat, dLng) * 111; // approximate km
    if (dist < minDistance) {
      minDistance = dist;
      closest = loc;
    }
  }

  if (minDistance < 25) {
    return {
      name: `${closest.name} Vicinity`,
      region: closest.region,
      distanceKm: Math.round(minDistance * 10) / 10,
    };
  }

  return {
    name: `India (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E)`,
    region: closest.state ? `${closest.state}, India` : "India",
    distanceKm: Math.round(minDistance * 10) / 10,
  };
}

/**
 * Convert an IndiaLocation to AreaSummary compatible with FloodLens map views
 */
export function toAreaSummary(loc: IndiaLocation): AreaSummary {
  return {
    id: loc.id,
    name: loc.name,
    region: loc.region,
    center: loc.center,
    zoom: loc.zoom,
    risk: loc.risk,
    waterLevel: loc.waterLevel,
    trend: loc.risk === "severe" ? "Rising" : loc.risk === "caution" ? "Steady" : "Falling",
    affectedRoads: loc.risk === "severe" ? 5 : loc.risk === "caution" ? 2 : 0,
    accessibleRoads: loc.risk === "severe" ? 6 : 9,
    insight: loc.insight,
  };
}

/**
 * Generate synthetic road features for any searched city to guarantee full interactive demo
 */
export function generateLocalRoadsForLocation(loc: IndiaLocation): RoadFeature[] {
  const [lng, lat] = loc.center;
  const delta = 0.015;

  return [
    {
      id: `${loc.id}-arterial-1`,
      name: `${loc.name} Main Expressway`,
      areaId: loc.id,
      risk: loc.risk === "severe" ? "caution" : "clear",
      accessibility: loc.risk === "severe" ? "Elevated corridor passable" : "Accessible",
      waterLevel: loc.risk === "severe" ? "Ankle-level" : "None",
      trend: "Steady",
      lastUpdated: "Just now",
      coordinates: [
        [lng - delta * 1.5, lat - delta * 0.8],
        [lng - delta * 0.5, lat - delta * 0.2],
        [lng + delta * 0.5, lat + delta * 0.4],
        [lng + delta * 1.5, lat + delta * 1.0],
      ],
    },
    {
      id: `${loc.id}-river-road`,
      name: `${loc.riverBasin} Embankment Road`,
      areaId: loc.id,
      risk: loc.risk === "clear" ? "clear" : "severe",
      accessibility: loc.risk === "clear" ? "Accessible" : "Submerged — Closed to light vehicles",
      waterLevel: loc.waterLevel,
      trend: "Rising",
      lastUpdated: "4 mins ago",
      coordinates: [
        [lng - delta * 1.2, lat + delta * 0.8],
        [lng - delta * 0.2, lat + delta * 0.5],
        [lng + delta * 0.8, lat + delta * 0.1],
        [lng + delta * 1.6, lat - delta * 0.3],
      ],
    },
    {
      id: `${loc.id}-bypass`,
      name: `${loc.name} Outer Ring Bypass`,
      areaId: loc.id,
      risk: "clear",
      accessibility: "Accessible — Recommended Detour",
      waterLevel: "None",
      trend: "Steady",
      lastUpdated: "8 mins ago",
      coordinates: [
        [lng - delta * 1.8, lat - delta * 1.2],
        [lng - delta * 0.2, lat - delta * 1.4],
        [lng + delta * 1.4, lat - delta * 0.9],
        [lng + delta * 1.9, lat + delta * 0.3],
      ],
    },
  ];
}
