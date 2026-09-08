import { useState, useEffect, useMemo } from "react";
import {
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Navigation,
  MapPin,
  RefreshCw,
  Zap,
  CornerDownRight,
  MoveRight,
  ArrowUpRight,
  CircleDot,
  Flag,
  ChevronRight,
  ChevronDown,
  Clock,
  Ruler,
  Droplets,
} from "lucide-react";
import TopNav from "../components/TopNav";
import { Footer } from "./Landing";
import MapView from "../components/MapView";
import RouteResultCard from "../components/RouteResultCard";
import {
  computeDynamicSafeRoutes,
  resolveLocationCoords,
} from "../utils/routingEngine";
import type { NavigationStep } from "../utils/routingEngine";
import {
  loadHazards,
  loadRoadOverrides,
  subscribeToStorage,
} from "../utils/persistence";
import type { CitizenHazard, RoadOverride } from "../utils/persistence";
import { roadsForArea } from "../data/roads";
import { searchIndiaLocations } from "../services/locationSearch";

const POPULAR_CORRIDORS = [
  { from: "Meerut City", to: "Modipuram Bypass" },
  { from: "Delhi ISBT Kashmere Gate", to: "Mayur Vihar" },
  { from: "Mumbai Dadar TT", to: "Bandra Kurla Complex" },
  { from: "Patna Gandhi Maidan", to: "Digha Ghat" },
];

const STEP_ICON_MAP: Record<
  NavigationStep["action"],
  React.ComponentType<{ size?: number; className?: string }>
> = {
  depart: CircleDot,
  "turn-right": CornerDownRight,
  "turn-left": CornerDownRight,
  straight: MoveRight,
  bypass: ArrowUpRight,
  arrive: Flag,
};

export default function SafeRoutes() {
  const [from, setFrom] = useState("Meerut City");
  const [to, setTo] = useState("Modipuram Bypass");
  const [hazards, setHazards] = useState<CitizenHazard[]>([]);
  const [overrides, setOverrides] = useState<Record<string, RoadOverride>>({});
  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [toSuggestions, setToSuggestions] = useState<string[]>([]);
  const [calculating, setCalculating] = useState(false);
  const [activeRouteIndex, setActiveRouteIndex] = useState(0);
  const [stepsExpanded, setStepsExpanded] = useState(true);
  const [activeStepId, setActiveStepId] = useState<string | null>(null);

  // Load persistent storage
  useEffect(() => {
    async function loadData() {
      const [hz, ov] = await Promise.all([loadHazards(), loadRoadOverrides()]);
      setHazards(hz);
      setOverrides(ov);
    }
    loadData();
    return subscribeToStorage(() => {
      loadData();
    });
  }, []);

  // Compute dynamic routes
  const routingResult = useMemo(() => {
    const origin = resolveLocationCoords(from, [77.7064, 28.9845]);
    const destination = resolveLocationCoords(to, [77.728, 29.045]);
    const roads = roadsForArea("meerut", overrides);

    return computeDynamicSafeRoutes(
      origin.coords,
      destination.coords,
      origin.name,
      destination.name,
      hazards,
      overrides,
      roads
    );
  }, [from, to, hazards, overrides]);

  function handleSwap() {
    const temp = from;
    setFrom(to);
    setTo(temp);
  }

  function handleSelectCorridor(cFrom: string, cTo: string) {
    setCalculating(true);
    setFrom(cFrom);
    setTo(cTo);
    setActiveRouteIndex(0);
    setTimeout(() => setCalculating(false), 300);
  }

  function handleRecalculate() {
    setCalculating(true);
    setActiveRouteIndex(0);
    setTimeout(() => setCalculating(false), 200);
  }

  // Calculate center between origin & destination
  const center: [number, number] = [
    (routingResult.origin.coords[0] + routingResult.destination.coords[0]) / 2,
    (routingResult.origin.coords[1] + routingResult.destination.coords[1]) / 2,
  ];

  const activeRoute = routingResult.options[activeRouteIndex];

  return (
    <div className="bg-paper-100 min-h-screen">
      <div className="bg-ink-950">
        <TopNav />
      </div>

      <section className="bg-ink-950 text-paper-50 pb-14 pt-10 border-b border-ink-800/40">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <h1 className="font-display text-3xl sm:text-4xl tracking-tight">
              Dynamic Safe Routes
            </h1>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-channel-500/20 text-channel-400 border border-channel-500/30 flex items-center gap-1.5">
              <Zap size={13} /> Live Hazard Avoidance Active
            </span>
          </div>
          <p className="text-ink-300 max-w-2xl text-sm sm:text-base leading-relaxed">
            Our dynamic routing engine evaluates live citizen hazard reports,
            road closures, and water levels to calculate elevated, flood-free
            corridors.
          </p>

          {/* Quick Corridors */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-xs text-ink-400 font-medium">
              Popular corridors:
            </span>
            {POPULAR_CORRIDORS.map((c, i) => (
              <button
                key={i}
                onClick={() => handleSelectCorridor(c.from, c.to)}
                className="text-xs bg-ink-900/80 hover:bg-ink-800 text-ink-300 hover:text-paper-50 px-3 py-1.5 rounded-full border border-ink-800 transition-colors"
              >
                {c.from.split(" ")[0]} → {c.to.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 sm:px-8 -mt-8 pb-20">
        {/* Route Search Bar */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="rounded-2xl bg-white shadow-panel border border-ink-800/10 p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 relative z-30"
        >
          {/* From input */}
          <div className="relative flex-1">
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-ink-800/15 focus-within:border-channel-500 bg-white">
              <MapPin size={17} className="text-channel-600 shrink-0" />
              <input
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  const matches = searchIndiaLocations(e.target.value, 4);
                  setFromSuggestions(matches.map((m) => m.name));
                }}
                onBlur={() => setTimeout(() => setFromSuggestions([]), 180)}
                placeholder="Origin / Start location in India"
                aria-label="Start location"
                className="w-full text-sm text-ink-950 placeholder:text-ink-400 outline-none"
              />
            </div>
            {fromSuggestions.length > 0 && (
              <ul className="absolute left-0 right-0 mt-1.5 bg-white rounded-xl shadow-panel border border-ink-800/10 overflow-hidden z-40">
                {fromSuggestions.map((name) => (
                  <li key={name}>
                    <button
                      type="button"
                      onMouseDown={() => {
                        setFrom(name);
                        setFromSuggestions([]);
                      }}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-paper-100 text-ink-900"
                    >
                      {name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="button"
            onClick={handleSwap}
            title="Swap Origin and Destination"
            className="self-center p-2 rounded-full hover:bg-paper-100 text-ink-400 hover:text-ink-900 transition-colors"
          >
            <ArrowRight size={18} className="rotate-90 sm:rotate-0" />
          </button>

          {/* To input */}
          <div className="relative flex-1">
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-ink-800/15 focus-within:border-channel-500 bg-white">
              <Navigation size={17} className="text-channel-600 shrink-0" />
              <input
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  const matches = searchIndiaLocations(e.target.value, 4);
                  setToSuggestions(matches.map((m) => m.name));
                }}
                onBlur={() => setTimeout(() => setToSuggestions([]), 180)}
                placeholder="Destination in India"
                aria-label="Destination"
                className="w-full text-sm text-ink-950 placeholder:text-ink-400 outline-none"
              />
            </div>
            {toSuggestions.length > 0 && (
              <ul className="absolute left-0 right-0 mt-1.5 bg-white rounded-xl shadow-panel border border-ink-800/10 overflow-hidden z-40">
                {toSuggestions.map((name) => (
                  <li key={name}>
                    <button
                      type="button"
                      onMouseDown={() => {
                        setTo(name);
                        setToSuggestions([]);
                      }}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-paper-100 text-ink-900"
                    >
                      {name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="button"
            onClick={handleRecalculate}
            className="shrink-0 rounded-full bg-channel-500 hover:bg-channel-400 text-ink-950 text-sm font-semibold px-6 py-3 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw
              size={15}
              className={calculating ? "animate-spin" : ""}
            />
            <span>Recalculate</span>
          </button>
        </form>

        {/* Route Overview Strip — Google Maps style summary */}
        <div className="mb-6 grid sm:grid-cols-2 gap-4">
          {routingResult.options.map((opt, i) => (
            <button
              key={opt.id}
              onClick={() => setActiveRouteIndex(i)}
              className={`text-left rounded-2xl border p-4 transition-all ${
                activeRouteIndex === i
                  ? "border-channel-500 bg-white ring-2 ring-channel-500/30 shadow-panel"
                  : "border-ink-800/10 bg-white/70 hover:bg-white hover:border-ink-800/20"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-display text-base text-ink-950 flex items-center gap-2">
                  {i === 0 && (
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-channel-600 bg-channel-100 px-2 py-0.5 rounded-full">
                      Best
                    </span>
                  )}
                  {opt.label}
                </h4>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
                  style={{
                    background:
                      opt.risk === "clear"
                        ? "var(--color-risk-clear-soft)"
                        : opt.risk === "caution"
                        ? "var(--color-risk-caution-soft)"
                        : "var(--color-risk-severe-soft)",
                    color:
                      opt.risk === "clear"
                        ? "var(--color-risk-clear)"
                        : opt.risk === "caution"
                        ? "var(--color-risk-caution)"
                        : "var(--color-risk-severe)",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background:
                        opt.risk === "clear"
                          ? "var(--color-risk-clear)"
                          : opt.risk === "caution"
                          ? "var(--color-risk-caution)"
                          : "var(--color-risk-severe)",
                    }}
                  />
                  {opt.risk === "clear"
                    ? "Safe"
                    : opt.risk === "caution"
                    ? "Caution"
                    : "Risky"}
                </span>
              </div>
              <div className="flex items-baseline gap-5">
                <div className="flex items-center gap-1.5 text-ink-600">
                  <Ruler size={14} />
                  <span className="text-xl font-display text-ink-950">
                    {opt.distanceKm}
                  </span>
                  <span className="text-xs">km</span>
                </div>
                <div className="flex items-center gap-1.5 text-ink-600">
                  <Clock size={14} />
                  <span className="text-xl font-display text-ink-950">
                    {opt.durationMin}
                  </span>
                  <span className="text-xs">min</span>
                </div>
                {opt.affectedRoads > 0 && (
                  <div className="flex items-center gap-1 text-xs text-risk-caution ml-auto">
                    <Droplets size={13} />
                    {opt.affectedRoads} flooded
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Hazard Avoidance Summary Banner */}
        <div className="mb-6 rounded-2xl bg-white border border-channel-500/30 p-4 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-channel-50 text-channel-600 flex items-center justify-center shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 className="font-display text-sm font-semibold text-ink-950">
                Engine Status: Dynamic Avoidance Active
              </h4>
              <p className="text-xs text-ink-600 mt-0.5">
                {routingResult.summary}
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-ink-500 shrink-0">
            <span>{hazards.length} Active Hazard Pins Monitored</span>
          </div>
        </div>

        {/* Interactive Map + Turn-by-Turn Panel */}
        <div className="grid lg:grid-cols-[1fr_340px] gap-4 mb-6">
          {/* Map */}
          <div className="rounded-2xl overflow-hidden shadow-panel border border-ink-800/10 h-[380px] lg:h-[520px] relative">
            <MapView
              className="w-full h-full"
              roads={[]}
              flyTo={{ center, zoom: 12, key: from.length + to.length }}
              riskFilter="all"
              activeLayers={new Set(["accessibility"])}
              selectedRoadId={null}
              onSelectRoad={() => {}}
              userLocation={null}
              previewRoutes={routingResult.options}
              hazards={hazards}
            />

            {/* Map Legend Pill */}
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md rounded-xl shadow-md px-3 py-2 border border-ink-800/10 text-[11px] flex items-center gap-3 pointer-events-none">
              <span className="flex items-center gap-1.5 font-medium text-emerald-700">
                <span className="w-3 h-1 bg-emerald-600 rounded-full" /> Safe
                Route (Solid)
              </span>
              <span className="flex items-center gap-1.5 font-medium text-amber-700">
                <span className="w-3 h-1 bg-amber-500 border-dashed rounded-full" />{" "}
                Inundated Corridor (Dashed)
              </span>
              <span className="flex items-center gap-1.5 font-medium text-red-700">
                <span className="w-2 h-2 bg-red-600 rounded-full" /> Hazard Pin
              </span>
            </div>

            {/* Origin / Destination labels on map */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <div className="bg-ink-950/90 backdrop-blur-sm text-paper-50 px-3 py-1.5 rounded-full text-[11px] font-medium flex items-center gap-1.5 shadow-md">
                <CircleDot
                  size={12}
                  className="text-channel-400 shrink-0"
                />{" "}
                {routingResult.origin.name}
              </div>
              <div className="bg-ink-950/90 backdrop-blur-sm text-paper-50 px-3 py-1.5 rounded-full text-[11px] font-medium flex items-center gap-1.5 shadow-md">
                <Flag size={12} className="text-red-400 shrink-0" />{" "}
                {routingResult.destination.name}
              </div>
            </div>
          </div>

          {/* Turn-by-Turn Directions Panel — Google Maps style */}
          <div className="rounded-2xl bg-white shadow-panel border border-ink-800/10 flex flex-col overflow-hidden">
            {/* Panel Header */}
            <div className="px-4 py-3 bg-ink-950 text-paper-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation size={16} className="text-channel-400" />
                <h3 className="font-display text-sm font-semibold">
                  Directions
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs text-ink-300">
                <span>{activeRoute?.distanceKm} km</span>
                <span className="text-ink-600">•</span>
                <span>{activeRoute?.durationMin} min</span>
              </div>
            </div>

            {/* Origin / Destination Summary */}
            <div className="px-4 py-3 border-b border-ink-800/10 bg-paper-100/60">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-0.5 pt-0.5">
                  <div className="w-3 h-3 rounded-full bg-channel-500 border-2 border-white shadow-sm" />
                  <div className="w-px h-6 bg-ink-800/20" />
                  <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-ink-950 truncate">
                    {routingResult.origin.name}
                  </p>
                  <div className="my-1.5 h-px bg-ink-800/8" />
                  <p className="text-xs font-medium text-ink-950 truncate">
                    {routingResult.destination.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Steps Toggle */}
            <button
              onClick={() => setStepsExpanded(!stepsExpanded)}
              className="px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-ink-600 hover:bg-paper-100 transition-colors border-b border-ink-800/5"
            >
              <span>
                {routingResult.steps.length} Navigation Steps via{" "}
                {activeRoute?.label?.split(" (")[0]}
              </span>
              {stepsExpanded ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </button>

            {/* Step-by-Step List */}
            {stepsExpanded && (
              <div className="flex-1 overflow-y-auto max-h-[380px]">
                {routingResult.steps.map((step, i) => {
                  const StepIcon = STEP_ICON_MAP[step.action] || MoveRight;
                  const isActive = activeStepId === step.id;
                  const isTurnLeft = step.action === "turn-left";

                  return (
                    <button
                      key={step.id}
                      onClick={() =>
                        setActiveStepId(isActive ? null : step.id)
                      }
                      className={`w-full text-left px-4 py-3 flex items-start gap-3 border-b border-ink-800/5 transition-colors ${
                        isActive
                          ? "bg-channel-100/50 border-l-2 border-l-channel-500"
                          : "hover:bg-paper-100"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          step.action === "depart"
                            ? "bg-channel-500 text-paper-50"
                            : step.action === "arrive"
                            ? "bg-red-500 text-white"
                            : step.action === "bypass"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-ink-950/5 text-ink-600"
                        }`}
                      >
                        <StepIcon
                          size={16}
                          className={isTurnLeft ? "-scale-x-100" : ""}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-ink-950 font-medium leading-snug">
                          {step.instruction}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-[11px] text-ink-500">
                          <span className="font-mono">{step.roadName}</span>
                          <span className="text-ink-300">•</span>
                          <span>{step.distanceKm} km</span>
                          <span className="text-ink-300">•</span>
                          <span>{step.durationMin} min</span>
                        </div>
                        {step.waterNote && (
                          <div className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full w-fit">
                            <AlertTriangle size={10} />
                            {step.waterNote}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-ink-400 font-mono shrink-0 mt-1">
                        {i + 1}/{routingResult.steps.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Panel Footer */}
            <div className="px-4 py-3 bg-paper-100/60 border-t border-ink-800/10 text-center">
              <p className="text-[10px] text-ink-400">
                Route generated by FloodLens AI • Avoids{" "}
                {routingResult.hazardsAvoided.length} inundated corridor
                {routingResult.hazardsAvoided.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Hazard Comparison Matrix */}
        {routingResult.hazardsAvoided.length > 0 && (
          <div className="mt-6 bg-white rounded-2xl border border-ink-800/10 p-5 shadow-panel">
            <h3 className="font-display text-base text-ink-950 mb-3 flex items-center gap-2">
              <AlertTriangle size={17} className="text-amber-500" /> Detour
              Breakdown & Prevented Flood Encounters
            </h3>
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              {routingResult.hazardsAvoided.map((h) => (
                <div
                  key={h.id}
                  className="bg-paper-100 rounded-xl p-3 border border-ink-800/5 flex items-start gap-2.5"
                >
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1" />
                  <div>
                    <span className="font-semibold text-ink-900">
                      {h.hazardType}
                    </span>{" "}
                    on{" "}
                    <strong className="text-ink-950">{h.road}</strong>
                    <p className="text-ink-500 mt-0.5">
                      {h.description} ({h.waterLevel})
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
