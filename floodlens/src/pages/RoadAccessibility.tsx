import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "../components/TopNav";
import { Footer } from "./Landing";
import MapView, { type RiskFilterValue } from "../components/MapView";
import { AREAS } from "../data/locations";
import { roadsForArea } from "../data/roads";
import { RISK_META } from "../types";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const FILTERS: { value: RiskFilterValue; label: string }[] = [
  { value: "all", label: "All roads" },
  { value: "accessible", label: "Accessible" },
  { value: "atRisk", label: "At risk" },
  { value: "inaccessible", label: "Inaccessible" },
];

const TREND_ICON = { Rising: TrendingUp, Falling: TrendingDown, Steady: Minus };

export default function RoadAccessibility() {
  const navigate = useNavigate();
  const [areaId, setAreaId] = useState(AREAS[0].id);
  const [filter, setFilter] = useState<RiskFilterValue>("all");
  const area = AREAS.find((a) => a.id === areaId)!;
  const roads = useMemo(() => roadsForArea(areaId), [areaId]);

  const filtered = roads.filter((r) => {
    if (filter === "all") return true;
    if (filter === "accessible") return r.risk === "clear";
    if (filter === "atRisk") return r.risk === "caution";
    return r.risk === "severe";
  });

  return (
    <div className="bg-paper-100 min-h-screen">
      <div className="bg-ink-950">
        <TopNav />
      </div>

      <section className="bg-ink-950 text-paper-50 pb-14 pt-10">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h1 className="font-display text-3xl sm:text-4xl mb-3">Road accessibility</h1>
          <p className="text-ink-300 max-w-xl mb-6">
            Every monitored road is scored in plain language — accessible, risky, or to be avoided —
            so you don't need to read water-level sensors to understand it.
          </p>
          <div className="flex flex-wrap gap-2">
            {AREAS.map((a) => (
              <button
                key={a.id}
                onClick={() => setAreaId(a.id)}
                className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${
                  a.id === areaId ? "bg-channel-500 text-ink-950" : "bg-ink-900 text-ink-300 hover:text-paper-50"
                }`}
              >
                {a.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 sm:px-8 -mt-8 pb-20">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6">
          <div className="rounded-2xl overflow-hidden shadow-panel border border-ink-800/5 h-[340px] lg:h-auto lg:min-h-[480px]">
            <MapView
              className="w-full h-full"
              roads={filtered}
              flyTo={{ center: area.center, zoom: area.zoom, key: areaId.length }}
              riskFilter="all"
              activeLayers={new Set(["accessibility"])}
              selectedRoadId={null}
              onSelectRoad={() => navigate("/live", { state: { query: area.name } })}
              userLocation={null}
              areaMarker={{ coords: area.center, name: area.name }}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4 overflow-x-auto">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`shrink-0 text-sm font-medium px-3.5 py-2 rounded-full border transition-colors ${
                    filter === f.value
                      ? "bg-ink-950 text-paper-50 border-ink-950"
                      : "border-ink-800/15 text-ink-600 hover:border-ink-800/30"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 max-h-[520px] overflow-y-auto pr-1">
              {filtered.map((road) => {
                const meta = RISK_META[road.risk];
                const TrendIcon = TREND_ICON[road.trend];
                return (
                  <div
                    key={road.id}
                    className="rounded-2xl border border-ink-800/8 bg-white p-4 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <h3 className="font-medium text-ink-950 truncate">{road.name}</h3>
                      <p className="text-xs text-ink-500 mt-0.5">{road.accessibility}</p>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      <span
                        className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: meta.soft, color: meta.color }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.color }} />
                        {meta.short}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-ink-400">
                        <TrendIcon size={11} /> {road.trend}
                      </span>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <p className="text-sm text-ink-400 py-8 text-center">No roads match this filter right now.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
