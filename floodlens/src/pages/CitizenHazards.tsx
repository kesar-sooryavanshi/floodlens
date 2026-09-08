import { useState, useEffect } from "react";
import { Plus, MapPin, CheckCircle2, ShieldAlert, RefreshCw } from "lucide-react";
import TopNav from "../components/TopNav";
import { Footer } from "./Landing";
import MapView from "../components/MapView";
import ReportModal from "../components/ReportModal";
import { loadHazards, loadRoadOverrides, saveRoadOverride, deleteRoadOverride, verifyHazard, resetStorageToDefaults, subscribeToStorage } from "../utils/persistence";
import type { CitizenHazard, RoadOverride } from "../utils/persistence";
import { AREAS } from "../data/locations";
import { roadsForArea } from "../data/roads";

export default function CitizenHazards() {
  const [hazards, setHazards] = useState<CitizenHazard[]>([]);
  const [overrides, setOverrides] = useState<Record<string, RoadOverride>>({});
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [activePinCoords, setActivePinCoords] = useState<[number, number] | null>(null);
  const [selectedAreaId, setSelectedAreaId] = useState(AREAS[0].id);
  const [selectedHazard, setSelectedHazard] = useState<CitizenHazard | null>(null);
  const [filterType, setFilterType] = useState<string>("all");

  const area = AREAS.find((a) => a.id === selectedAreaId) || AREAS[0];
  const roads = roadsForArea(selectedAreaId, overrides);

  useEffect(() => {
    async function refresh() {
      const [hz, ov] = await Promise.all([loadHazards(), loadRoadOverrides()]);
      setHazards(hz);
      setOverrides(ov);
    }
    refresh();
    return subscribeToStorage(() => refresh());
  }, []);

  function handleMapClick(coords: [number, number]) {
    setActivePinCoords(coords);
    setReportModalOpen(true);
  }

  async function handleVerify(id: string) {
    await verifyHazard(id);
  }

  async function handleToggleRoadClosure(roadId: string, currentlyClosed: boolean) {
    if (currentlyClosed) {
      await deleteRoadOverride(roadId);
    } else {
      await saveRoadOverride({
        roadId,
        isClosed: true,
        forcedRisk: "severe",
        forcedWaterLevel: "Above waist",
        reason: "Citizen-requested emergency closure",
        updatedAt: "Just now",
      });
    }
  }

  async function handleResetDemo() {
    if (confirm("Reset citizen hazards and road overrides back to factory demo defaults?")) {
      await resetStorageToDefaults();
    }
  }

  const filteredHazards = hazards.filter((h) => {
    if (filterType === "all") return true;
    if (filterType === "severe") return h.waterLevel === "Above waist" || h.waterLevel === "Waist-level";
    if (filterType === "caution") return h.waterLevel === "Knee-level";
    return true;
  });

  return (
    <div className="bg-paper-100 min-h-screen flex flex-col">
      <div className="bg-ink-950">
        <TopNav />
      </div>

      {/* Hero */}
      <section className="bg-ink-950 text-paper-50 pb-14 pt-10 border-b border-ink-800/40">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider px-3 py-0.5 rounded-full bg-channel-500/20 text-channel-400 border border-channel-500/30">
                  Decentralized Resilience
                </span>
                <span className="text-xs text-ink-400">• Persistent Offline Database</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl tracking-tight">Citizen Hazard Network & Overrides</h1>
              <p className="text-ink-300 max-w-2xl text-sm sm:text-base mt-2 leading-relaxed">
                Click anywhere on the interactive map to drop an exact hazard pin, or manage manual road overrides for emergency response.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setActivePinCoords([area.center[0] + 0.005, area.center[1] + 0.004]);
                  setReportModalOpen(true);
                }}
                className="flex items-center gap-2 rounded-full bg-channel-500 hover:bg-channel-400 text-ink-950 text-sm font-semibold px-5 py-3 transition-colors shadow-sm"
              >
                <Plus size={17} /> Drop Pin to Report
              </button>
              <button
                onClick={handleResetDemo}
                title="Reset local storage to initial presets"
                className="flex items-center gap-1.5 rounded-full bg-ink-900 hover:bg-ink-800 text-ink-300 hover:text-paper-50 text-xs px-3.5 py-3 border border-ink-800 transition-colors"
              >
                <RefreshCw size={14} /> Reset
              </button>
            </div>
          </div>

          {/* Area filter tabs */}
          <div className="flex flex-wrap gap-2 mt-6">
            {AREAS.slice(0, 7).map((a) => (
              <button
                key={a.id}
                onClick={() => setSelectedAreaId(a.id)}
                className={`text-xs font-medium px-4 py-2 rounded-full transition-colors ${
                  a.id === selectedAreaId ? "bg-channel-500 text-ink-950 font-semibold" : "bg-ink-900 text-ink-300 hover:text-paper-50"
                }`}
              >
                {a.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 -mt-8 pb-20 flex-1 w-full">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
          {/* Left: Map View with Click to Drop Pin */}
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl overflow-hidden shadow-panel border border-ink-800/10 h-[480px] relative">
              <MapView
                className="w-full h-full"
                roads={roads}
                flyTo={{ center: area.center, zoom: area.zoom, key: selectedAreaId.length }}
                riskFilter="all"
                activeLayers={new Set(["accessibility"])}
                selectedRoadId={null}
                onSelectRoad={() => {}}
                userLocation={null}
                hazards={hazards}
                activePinCoords={activePinCoords}
                onMapClickCoords={handleMapClick}
                onSelectHazard={setSelectedHazard}
              />

              {/* Click prompt overlay */}
              <div className="absolute top-3 left-3 right-3 sm:right-auto bg-ink-950/90 backdrop-blur-md text-paper-50 px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 border border-ink-700/60 pointer-events-none shadow-lg">
                <MapPin size={15} className="text-channel-400 shrink-0 animate-bounce" />
                <span><strong>Click map directly</strong> to drop an exact flood hazard pin</span>
              </div>
            </div>

            {/* Selected Hazard Card */}
            {selectedHazard && (
              <div className="bg-white rounded-2xl p-4 border border-channel-500/30 shadow-panel flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700">
                      {selectedHazard.hazardType}
                    </span>
                    <span className="text-xs text-ink-400 font-medium">{selectedHazard.submittedAt}</span>
                  </div>
                  <h4 className="font-display text-base text-ink-950">{selectedHazard.road}, {selectedHazard.location}</h4>
                  <p className="text-xs text-ink-600 mt-1">{selectedHazard.description}</p>
                </div>
                <button
                  onClick={() => handleVerify(selectedHazard.id)}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-channel-50 hover:bg-channel-100 text-channel-800 rounded-full text-xs font-semibold transition-colors"
                >
                  <CheckCircle2 size={13} /> Verify ({selectedHazard.verifiedCount})
                </button>
              </div>
            )}
          </div>

          {/* Right: Hazard Stream & Road Override Control */}
          <div className="flex flex-col gap-5">
            {/* Citizen Hazards Feed */}
            <div className="bg-white rounded-2xl border border-ink-800/10 p-5 shadow-panel flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base text-ink-950">Active Hazard Reports ({filteredHazards.length})</h3>
                  <p className="text-xs text-ink-400">Synchronized via IndexedDB client store</p>
                </div>
                <div className="flex items-center gap-1 bg-paper-100 rounded-full p-1 text-xs">
                  <button
                    onClick={() => setFilterType("all")}
                    className={`px-2.5 py-1 rounded-full ${filterType === "all" ? "bg-white font-semibold shadow-xs text-ink-950" : "text-ink-500"}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterType("severe")}
                    className={`px-2.5 py-1 rounded-full ${filterType === "severe" ? "bg-white font-semibold shadow-xs text-red-700" : "text-ink-500"}`}
                  >
                    High Risk
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 max-h-64 overflow-y-auto pr-1">
                {filteredHazards.map((h) => (
                  <div
                    key={h.id}
                    onClick={() => setSelectedHazard(h)}
                    className="cursor-pointer p-3 rounded-xl border border-ink-800/8 hover:border-channel-500/50 hover:bg-paper-50 transition-all flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        <h4 className="text-xs font-semibold text-ink-950 truncate">{h.road}</h4>
                        <span className="text-[10px] text-ink-400">• {h.location}</span>
                      </div>
                      <p className="text-[11px] text-ink-600 line-clamp-2">{h.description}</p>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        {h.waterLevel}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVerify(h.id);
                        }}
                        className="text-[10px] text-channel-700 font-semibold hover:underline"
                      >
                        ✓ {h.verifiedCount} votes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Road Override Panel */}
            <div className="bg-white rounded-2xl border border-ink-800/10 p-5 shadow-panel flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={18} className="text-amber-600" />
                  <h3 className="font-display text-base text-ink-950">Manual Road Overrides</h3>
                </div>
                <span className="text-xs text-ink-400 font-mono">EMERGENCY DISPATCH</span>
              </div>
              <p className="text-xs text-ink-500">
                Override monitored roads to force closures or open emergency bypasses in the routing engine.
              </p>

              <div className="flex flex-col gap-2 mt-1">
                {roads.slice(0, 4).map((r) => {
                  const isClosed = overrides[r.id]?.isClosed;
                  return (
                    <div key={r.id} className="p-3 bg-paper-100 rounded-xl flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-ink-950 truncate">{r.name}</h4>
                        <span className="text-[10px] text-ink-500">{isClosed ? "FORCE CLOSED BY AUTHORITY" : r.accessibility}</span>
                      </div>
                      <button
                        onClick={() => handleToggleRoadClosure(r.id, Boolean(isClosed))}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                          isClosed
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-ink-900 text-paper-50 hover:bg-ink-800"
                        }`}
                      >
                        {isClosed ? "Remove Barrier" : "Place Barrier"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Report Modal */}
      <ReportModal
        open={reportModalOpen}
        onClose={() => {
          setReportModalOpen(false);
          setActivePinCoords(null);
        }}
        defaultLocation={area.name}
        initialCoords={activePinCoords || undefined}
      />

      <Footer />
    </div>
  );
}
