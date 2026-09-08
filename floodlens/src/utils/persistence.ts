import { openDB } from "idb";
import type { DBSchema, IDBPDatabase } from "idb";
import type { WaterLevel, RiskLevel } from "../types";

export interface CitizenHazard {
  id: string;
  latitude: number;
  longitude: number;
  location: string;
  road: string;
  hazardType: string;
  waterLevel: WaterLevel;
  description: string;
  submittedAt: string;
  verifiedCount: number;
  status: "active" | "cleared" | "investigating";
  photoUrl?: string;
}

export interface RoadOverride {
  roadId: string;
  isClosed: boolean;
  forcedRisk?: RiskLevel;
  forcedWaterLevel?: WaterLevel;
  reason?: string;
  updatedAt: string;
}

interface FloodLensDB extends DBSchema {
  hazards: {
    key: string;
    value: CitizenHazard;
    indexes: { "by-date": string };
  };
  roadOverrides: {
    key: string;
    value: RoadOverride;
  };
}

const DB_NAME = "floodlens_v2_db";
const DB_VERSION = 1;
const STORAGE_EVENT = "floodlens_storage_updated";

const INITIAL_HAZARDS: CitizenHazard[] = [
  {
    id: "hz-delhi-1",
    latitude: 28.665,
    longitude: 77.231,
    location: "Kashmere Gate, Delhi",
    road: "Ring Road (Yamuna Bypass)",
    hazardType: "Flooded Roadway",
    waterLevel: "Waist-level",
    description: "Yamuna overflow reached ring road near ISBT underpass. Low sedans trapped.",
    submittedAt: "10 mins ago",
    verifiedCount: 14,
    status: "active",
  },
  {
    id: "hz-meerut-1",
    latitude: 28.988,
    longitude: 77.712,
    location: "Meerut",
    road: "Garh Road (Near Medical College)",
    hazardType: "Submerged Underpass",
    waterLevel: "Knee-level",
    description: "Waterlogging under railway flyover. Heavy vehicles only.",
    submittedAt: "25 mins ago",
    verifiedCount: 8,
    status: "active",
  },
  {
    id: "hz-mumbai-1",
    latitude: 19.018,
    longitude: 72.843,
    location: "Dadar / Hindmata, Mumbai",
    road: "Dr. B.A. Road",
    hazardType: "Flooded Roadway",
    waterLevel: "Above waist",
    description: "High tide combined with intense rain caused severe inundation near flyover.",
    submittedAt: "3 mins ago",
    verifiedCount: 22,
    status: "active",
  },
  {
    id: "hz-patna-1",
    latitude: 25.618,
    longitude: 85.141,
    location: "Gandhi Maidan, Patna",
    road: "Ashok Rajpath",
    hazardType: "River Overflow",
    waterLevel: "Knee-level",
    description: "Ganga backflow into drainage line. Traffic diverted to Fraser Road.",
    submittedAt: "1 hour ago",
    verifiedCount: 6,
    status: "active",
  },
];

const INITIAL_OVERRIDES: Record<string, RoadOverride> = {
  "garh-road": {
    roadId: "garh-road",
    isClosed: true,
    forcedRisk: "severe",
    forcedWaterLevel: "Waist-level",
    reason: "Emergency barrier placed by traffic police",
    updatedAt: "30 mins ago",
  },
};

let dbPromise: Promise<IDBPDatabase<FloodLensDB>> | null = null;

function notifyListeners() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT));
  }
}

async function getDB(): Promise<IDBPDatabase<FloodLensDB> | null> {
  if (typeof window === "undefined" || !window.indexedDB) return null;
  if (!dbPromise) {
    dbPromise = openDB<FloodLensDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("hazards")) {
          const hazardStore = db.createObjectStore("hazards", { keyPath: "id" });
          hazardStore.createIndex("by-date", "submittedAt");
        }
        if (!db.objectStoreNames.contains("roadOverrides")) {
          db.createObjectStore("roadOverrides", { keyPath: "roadId" });
        }
      },
    }).catch((err) => {
      console.warn("IndexedDB failed, fallback to localStorage:", err);
      return null as any;
    });
  }
  return dbPromise;
}

// LocalStorage helpers as fallback
function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // quota exceeded or private mode
  }
}

// Initialize seed data if empty
export async function initializeStorage(): Promise<void> {
  const db = await getDB();
  if (db) {
    const existing = await db.getAll("hazards");
    if (existing.length === 0) {
      const tx = db.transaction(["hazards", "roadOverrides"], "readwrite");
      for (const h of INITIAL_HAZARDS) {
        await tx.objectStore("hazards").put(h);
      }
      for (const ov of Object.values(INITIAL_OVERRIDES)) {
        await tx.objectStore("roadOverrides").put(ov);
      }
      await tx.done;
    }
  } else {
    if (!localStorage.getItem("floodlens_hazards")) {
      setLocal("floodlens_hazards", INITIAL_HAZARDS);
    }
    if (!localStorage.getItem("floodlens_overrides")) {
      setLocal("floodlens_overrides", INITIAL_OVERRIDES);
    }
  }
}

export async function loadHazards(): Promise<CitizenHazard[]> {
  const db = await getDB();
  if (db) {
    try {
      const all = await db.getAll("hazards");
      if (all.length > 0) return all;
    } catch {
      // fallback
    }
  }
  return getLocal<CitizenHazard[]>("floodlens_hazards", INITIAL_HAZARDS);
}

export async function saveHazard(hazard: Omit<CitizenHazard, "id" | "submittedAt" | "verifiedCount" | "status"> & Partial<CitizenHazard>): Promise<CitizenHazard> {
  const newHazard: CitizenHazard = {
    id: hazard.id || `hz-${Date.now()}`,
    latitude: hazard.latitude,
    longitude: hazard.longitude,
    location: hazard.location || "Reported Coordinate",
    road: hazard.road || "Local Road",
    hazardType: hazard.hazardType || "Flooded Roadway",
    waterLevel: hazard.waterLevel || "Knee-level",
    description: hazard.description || "",
    submittedAt: "Just now",
    verifiedCount: hazard.verifiedCount ?? 1,
    status: hazard.status || "active",
    photoUrl: hazard.photoUrl,
  };

  const db = await getDB();
  if (db) {
    try {
      await db.put("hazards", newHazard);
    } catch {
      // fallback
    }
  }
  // also sync to localStorage for instant resilience
  const current = getLocal<CitizenHazard[]>("floodlens_hazards", INITIAL_HAZARDS);
  const updated = [newHazard, ...current.filter((h) => h.id !== newHazard.id)];
  setLocal("floodlens_hazards", updated);

  notifyListeners();
  return newHazard;
}

export async function verifyHazard(id: string): Promise<void> {
  const hazards = await loadHazards();
  const target = hazards.find((h) => h.id === id);
  if (!target) return;
  target.verifiedCount += 1;

  const db = await getDB();
  if (db) {
    try {
      await db.put("hazards", target);
    } catch {
      // fallback
    }
  }
  setLocal("floodlens_hazards", hazards);
  notifyListeners();
}

export async function loadRoadOverrides(): Promise<Record<string, RoadOverride>> {
  const db = await getDB();
  if (db) {
    try {
      const list = await db.getAll("roadOverrides");
      const map: Record<string, RoadOverride> = {};
      list.forEach((ov) => {
        map[ov.roadId] = ov;
      });
      if (Object.keys(map).length > 0) return map;
    } catch {
      // fallback
    }
  }
  return getLocal<Record<string, RoadOverride>>("floodlens_overrides", INITIAL_OVERRIDES);
}

export async function saveRoadOverride(override: RoadOverride): Promise<void> {
  const db = await getDB();
  if (db) {
    try {
      await db.put("roadOverrides", override);
    } catch {
      // fallback
    }
  }
  const current = getLocal<Record<string, RoadOverride>>("floodlens_overrides", INITIAL_OVERRIDES);
  current[override.roadId] = override;
  setLocal("floodlens_overrides", current);

  notifyListeners();
}

export async function deleteRoadOverride(roadId: string): Promise<void> {
  const db = await getDB();
  if (db) {
    try {
      await db.delete("roadOverrides", roadId);
    } catch {
      // fallback
    }
  }
  const current = getLocal<Record<string, RoadOverride>>("floodlens_overrides", INITIAL_OVERRIDES);
  delete current[roadId];
  setLocal("floodlens_overrides", current);

  notifyListeners();
}

export async function resetStorageToDefaults(): Promise<void> {
  const db = await getDB();
  if (db) {
    try {
      await db.clear("hazards");
      await db.clear("roadOverrides");
    } catch {
      // fallback
    }
  }
  setLocal("floodlens_hazards", INITIAL_HAZARDS);
  setLocal("floodlens_overrides", INITIAL_OVERRIDES);
  await initializeStorage();
  notifyListeners();
}

export function subscribeToStorage(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(STORAGE_EVENT, callback);
  return () => {
    window.removeEventListener(STORAGE_EVENT, callback);
  };
}
