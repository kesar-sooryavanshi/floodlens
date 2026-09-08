import { useState, useEffect } from "react";
import { Wifi, WifiOff, Database, Zap, X, ShieldCheck } from "lucide-react";
import { saveHazard, loadHazards, loadRoadOverrides } from "../utils/persistence";

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [simulatedOffline, setSimulatedOffline] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [hazardCount, setHazardCount] = useState(0);
  const [overrideCount, setOverrideCount] = useState(0);
  const [injectedToast, setInjectedToast] = useState<string | null>(null);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    async function checkCounts() {
      const [hz, ov] = await Promise.all([loadHazards(), loadRoadOverrides()]);
      setHazardCount(hz.length);
      setOverrideCount(Object.keys(ov).length);
    }
    checkCounts();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  async function handleSimulateFlashFlood() {
    await saveHazard({
      latitude: 28.995,
      longitude: 77.72,
      location: "Meerut North Arterial",
      road: "Roorkee Road Crossing",
      hazardType: "Flash Flood Surge (Demo Simulation)",
      waterLevel: "Above waist",
      description: "Sudden cloudburst overflow. Canal embankment breach simulated for emergency routing test.",
      verifiedCount: 18,
      status: "active",
    });
    setInjectedToast("Flash flood event injected into offline database! Check live map.");
    setTimeout(() => setInjectedToast(null), 4000);
    setHazardCount((c) => c + 1);
  }

  const effectiveOnline = isOnline && !simulatedOffline;

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2 font-sans">
      {injectedToast && (
        <div className="bg-amber-600 text-white text-xs px-3.5 py-2 rounded-xl shadow-lg animate-bounce">
          {injectedToast}
        </div>
      )}

      {/* Expandable Demo Resilience Drawer */}
      {openDrawer && (
        <div className="bg-ink-950 text-paper-50 rounded-2xl p-4 shadow-2xl border border-ink-800 w-80 mb-2 flex flex-col gap-3 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-ink-800">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-channel-400" />
              <span className="font-display text-sm font-semibold">Offline Demo Resilience</span>
            </div>
            <button
              onClick={() => setOpenDrawer(false)}
              className="text-ink-400 hover:text-paper-50"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex flex-col gap-2 text-xs">
            <div className="flex justify-between text-ink-300">
              <span>Network State:</span>
              <span className={effectiveOnline ? "text-emerald-400 font-semibold" : "text-amber-400 font-semibold"}>
                {effectiveOnline ? "Connected to Cloud" : "Offline Air-Gapped Mode"}
              </span>
            </div>
            <div className="flex justify-between text-ink-300">
              <span>Local Storage Engine:</span>
              <span className="text-channel-400 font-mono">IndexedDB Active</span>
            </div>
            <div className="flex justify-between text-ink-300">
              <span>Hazards in Cache:</span>
              <span className="font-mono text-paper-50">{hazardCount} items</span>
            </div>
            <div className="flex justify-between text-ink-300">
              <span>Road Overrides:</span>
              <span className="font-mono text-paper-50">{overrideCount} active</span>
            </div>
          </div>

          <div className="pt-2 border-t border-ink-800 flex flex-col gap-2">
            <button
              onClick={handleSimulateFlashFlood}
              className="w-full py-2 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Zap size={14} /> Inject Flash Flood Simulation
            </button>

            <button
              onClick={() => setSimulatedOffline(!simulatedOffline)}
              className="w-full py-1.5 px-3 bg-ink-900 hover:bg-ink-800 text-ink-300 rounded-xl text-xs font-medium border border-ink-800 transition-colors"
            >
              {simulatedOffline ? "Restore Online Sync" : "Simulate Air-Gapped Offline Mode"}
            </button>
          </div>
        </div>
      )}

      {/* Status Pill Toggle */}
      <button
        onClick={() => setOpenDrawer(!openDrawer)}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium shadow-panel border transition-all ${
          effectiveOnline
            ? "bg-white/95 backdrop-blur-md text-ink-800 border-ink-800/10 hover:border-channel-500"
            : "bg-amber-500 text-ink-950 border-amber-600 font-semibold shadow-amber-500/20"
        }`}
      >
        {effectiveOnline ? (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Wifi size={13} className="text-emerald-600" />
            <span>Live Cloud & Tile Sync</span>
          </>
        ) : (
          <>
            <WifiOff size={13} className="text-ink-950" />
            <span>Offline Resilient Mode</span>
          </>
        )}
        <Database size={12} className="opacity-60 ml-0.5" />
      </button>
    </div>
  );
}
