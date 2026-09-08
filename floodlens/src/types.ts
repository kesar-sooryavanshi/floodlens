export type RiskLevel = "clear" | "caution" | "severe";

export type WaterLevel = "None" | "Ankle-level" | "Knee-level" | "Waist-level" | "Above waist";

export type RiskTrend = "Rising" | "Falling" | "Steady";

export interface RoadFeature {
  id: string;
  name: string;
  areaId: string;
  risk: RiskLevel;
  accessibility: string;
  waterLevel: WaterLevel;
  trend: RiskTrend;
  lastUpdated: string;
  coordinates: [number, number][];
}

export interface AreaSummary {
  id: string;
  name: string;
  region: string;
  center: [number, number];
  zoom: number;
  risk: RiskLevel;
  waterLevel: WaterLevel;
  trend: RiskTrend;
  affectedRoads: number;
  accessibleRoads: number;
  insight: string;
}

export interface RouteOption {
  id: string;
  label: string;
  distanceKm: number;
  durationMin: number;
  risk: RiskLevel;
  affectedRoads: number;
  path: [number, number][];
}

export interface FloodReport {
  id: string;
  location: string;
  road: string;
  condition: string;
  waterLevel: WaterLevel;
  description?: string;
  submittedAt: string;
}

export const RISK_META: Record<RiskLevel, { label: string; short: string; color: string; soft: string; icon: "circle" }> = {
  clear: { label: "Accessible", short: "Low risk", color: "var(--color-risk-clear)", soft: "var(--color-risk-clear-soft)", icon: "circle" },
  caution: { label: "Risk — travel with caution", short: "Moderate risk", color: "var(--color-risk-caution)", soft: "var(--color-risk-caution-soft)", icon: "circle" },
  severe: { label: "Inaccessible / avoid", short: "High risk", color: "var(--color-risk-severe)", soft: "var(--color-risk-severe-soft)", icon: "circle" },
};
