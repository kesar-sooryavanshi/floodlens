import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { AlertCircle, Plus, MapPin } from "lucide-react";
import MapView, { type RiskFilterValue, type LayerKey } from "../components/MapView";
import AppBar from "../components/AppBar";
import RiskFilters from "../components/RiskFilters";
import LayerToggle from "../components/LayerToggle";
import Legend from "../components/Legend";
import RoadDetailPanel from "../components/RoadDetailPanel";
import ReportModal from "../components/ReportModal";
import OfflineIndicator from "../components/OfflineIndicator";
import { AREAS, findArea } from "../data/locations";
import { roadsForArea } from "../data/roads";
import type { RoadFeature } from "../types";
import { RISK_META } from "../types";
import { loadHazards, loadRoadOverrides, subscribeToStorage } from "../utils/persistence";
import type { CitizenHazard, RoadOverride } from "../utils/persistence";

export default function LiveIntelligence() {
  const routerLocation = useLocation();
  const initialQuery = (routerLocation.state as { query?: string } | null)?.query;
  const initialArea = (initialQuery && findArea(initialQuery)) || AREAS[0];

  const [area, setArea] = useState(initialArea);
  const [flyKey, setFlyKey] = useState(0);
  const [riskFilter, setRiskFilter] = useState<RiskFilterValue>("all");
  const [activeLayers, setActiveLayers] = useState<Set<LayerKey>>(
    new Set(["accessibility", "flooded"])
  );
  const [selectedRoadId, setSelectedRoadId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportRoad, setReportRoad] = useState<RoadFeature | null>(null);
  const [activePinCoords, setActivePinCoords] = useState<[number, number] | null>(null);

  // Persistent storage state
  const [hazards, setHazards] = useState<CitizenHazard[]>([]);
  const [overrides, setOverrides] = useState<Record<string, RoadOverride>>({});

  useEffect(() => {
    async function loadData() {
      const [hz, ov] = await Promise.all([loadHazards(), loadRoadOverrides()]);
      setHazards(hz);
      setOverrides(ov);
    }
    loadData();
    return subscribeToStorage(() => loadData());
  }, []);

  const roads = useMemo(() => roadsForArea(area.id, overrides), [area, overrides]);
  const selectedRoad = roads.find((r) => r.id === selectedRoadId) ?? null;
  const visibleCount = useMemo(() => {
    if (riskFilter === "all") return roads.length;
    const map = { accessible: "clear", atRisk: "caution", inaccessible: "severe" } as const;
    return roads.filter((r) => r.risk === map[riskFilter]).length;
  }, [roads, riskFilter]);

  useEffect(() => {
    setFlyKey((k) => k + 1);
  }, [area]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4200);
    return () => clearTimeout(t);
  }, [toast]);

  function handleSearch(query: string) {
    const found = findArea(query);
    if (found) {
      setArea(found);
      setSelectedRoadId(null);
      setUserLocation(null);
    } else {
      setToast(`Searching for "${query}" across India... showing nearest region.`);
    }
  }

  function handleLocate() {
    if (!("geolocation" in navigator)) {
      setToast("Location isn't available on this device. Search for your city instead.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.longitude, pos.coords.latitude];
        setUserLocation(coords);
        setLocating(false);
        setFlyKey((k) => k + 1);
      },
      () => {
        setLocating(false);
        setToast("Location access was denied. You can still search for your city or locality above.");
      },
      { timeout: 8000 }
    );
  }

  function handleMapClickCoords(coords: [number, number]) {
    setActivePinCoords(coords);
    setReportRoad(null);
    setReportOpen(true);
  }

  function toggleLayer(key: LayerKey) {
    setActiveLayers((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  const flyTarget = userLocation
    ? { center: userLocation, zoom: 14, key: flyKey }
    : { center: area.center, zoom: area.zoom, key: flyKey };

  return (
    <div className="h-screen min-h-screen h-dvh w-full flex flex-col bg-paper-100 overflow-hidden relative">
      <AppBar onSearch={handleSearch} onLocate={handleLocate} locating={locating} />

      <div className="relative flex-1 min-h-0 w-full h-full">
        <MapView
          className="absolute inset-0 w-full h-full"
          roads={roads}
          flyTo={flyTarget}
          riskFilter={riskFilter}
          activeLayers={activeLayers}
          selectedRoadId={selectedRoadId}
          onSelectRoad={setSelectedRoadId}
          userLocation={userLocation}
          areaMarker={{ coords: area.center, name: area.name }}
          hazards={hazards}
          activePinCoords={activePinCoords}
          onMapClickCoords={handleMapClickCoords}
        />

        {/* Floating controls */}
        <div className="pointer-events-none absolute top-3 left-3 right-3 flex flex-col gap-2 z-20 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <RiskFilters value={riskFilter} onChange={setRiskFilter} resultCount={visibleCount} />
            <LayerToggle active={activeLayers} onToggle={toggleLayer} />
            <button
              onClick={() => {
                setActivePinCoords([area.center[0] + 0.003, area.center[1] + 0.003]);
                setReportOpen(true);
              }}
              className="pointer-events-auto flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-channel-500 hover:bg-channel-400 text-ink-950 text-xs font-semibold shadow-md transition-colors"
            >
              <Plus size={14} /> Report Hazard Pin
            </button>
          </div>
          <div className="hidden sm:block">
            <Legend />
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-3 left-3 sm:hidden z-20">
          <Legend />
        </div>

        {/* Map Pin Guide Notice */}
        <div className="pointer-events-none absolute top-16 left-3 z-20 hidden md:block">
          <div className="bg-ink-950/80 backdrop-blur-md text-paper-50 px-3 py-1.5 rounded-full text-[11px] flex items-center gap-2 border border-ink-700/60 shadow-md">
            <MapPin size={13} className="text-channel-400 animate-pulse" />
            <span>Click map to report hazard pin • {hazards.length} citizen reports active</span>
          </div>
        </div>

        {/* Area quick summary (shown when nothing selected) */}
        {!selectedRoad && (
          <div className="pointer-events-none absolute bottom-3 right-3 hidden lg:block z-20">
            <div className="pointer-events-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-panel border border-ink-800/5 px-5 py-4 max-w-xs">
              <p className="text-xs text-ink-400 mb-1">{area.region}</p>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: RISK_META[area.risk].color }}
                />
                <h4 className="font-display text-lg text-ink-950">{area.name}</h4>
              </div>
              <p className="text-sm text-ink-600 leading-snug">{area.insight}</p>
            </div>
          </div>
        )}

        {toast && (
          <div className="pointer-events-none absolute inset-x-3 bottom-20 sm:bottom-3 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-30 flex justify-center">
            <div className="pointer-events-auto flex items-start gap-2 bg-ink-950 text-paper-50 text-sm rounded-2xl shadow-panel px-4 py-3 max-w-md">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-channel-400" />
              <span>{toast}</span>
            </div>
          </div>
        )}

        <RoadDetailPanel
          road={selectedRoad}
          onClose={() => setSelectedRoadId(null)}
          onFindAlternative={() => {
            setToast("Alternative routes are on the Safe Routes page — open it from the menu.");
          }}
          onReport={(road) => {
            setReportRoad(road);
            setActivePinCoords(road.coordinates[0] || null);
            setReportOpen(true);
          }}
        />
      </div>

      <ReportModal
        open={reportOpen}
        onClose={() => {
          setReportOpen(false);
          setActivePinCoords(null);
        }}
        defaultLocation={area.name}
        defaultRoad={reportRoad?.name}
        initialCoords={activePinCoords || undefined}
      />

      <OfflineIndicator />
    </div>
  );
}
