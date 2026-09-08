import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Waves, TrendingUp, TrendingDown, Minus, Route } from "lucide-react";
import TopNav from "../components/TopNav";
import { Footer } from "./Landing";
import { AREAS } from "../data/locations";
import { RISK_META } from "../types";

const TREND_ICON = { Rising: TrendingUp, Falling: TrendingDown, Steady: Minus };

export default function FloodAnalysis() {
  const navigate = useNavigate();
  const [areaId, setAreaId] = useState(AREAS[0].id);
  const area = AREAS.find((a) => a.id === areaId)!;
  const meta = RISK_META[area.risk];
  const TrendIcon = TREND_ICON[area.trend];

  return (
    <div className="bg-paper-100 min-h-screen">
      <div className="bg-ink-950">
        <TopNav />
      </div>

      <section className="bg-ink-950 text-paper-50 pb-14 pt-10">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <h1 className="font-display text-3xl sm:text-4xl mb-3">Flood analysis</h1>
          <p className="text-ink-300 max-w-xl mb-6">
            A plain-language read of current conditions — no sensor jargon, just what it means for
            your trip.
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

      <section className="mx-auto max-w-4xl px-5 sm:px-8 -mt-8 pb-20">
        <div className="rounded-3xl bg-white shadow-panel border border-ink-800/5 p-6 sm:p-10">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs uppercase tracking-wide text-ink-400">{area.region}</p>
            <span
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ background: meta.soft, color: meta.color }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.color }} />
              {meta.short}
            </span>
          </div>
          <h2 className="font-display text-4xl text-ink-950 mb-8">{area.name}</h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <Stat icon={Waves} label="Water level" value={area.waterLevel} />
            <Stat icon={TrendIcon} label="Risk trend" value={area.trend} />
            <Stat icon={Route} label="Affected roads" value={String(area.affectedRoads)} tone="severe" />
            <Stat icon={Route} label="Accessible roads" value={String(area.accessibleRoads)} tone="clear" />
          </div>

          <div className="rounded-2xl bg-channel-100 border border-channel-300/50 p-5 flex gap-3">
            <Sparkles size={18} className="text-channel-700 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-channel-700 mb-1">AI insight</p>
              <p className="text-sm text-ink-800 leading-relaxed">{area.insight}</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/live", { state: { query: area.name } })}
            className="mt-8 w-full sm:w-auto rounded-full bg-ink-950 hover:bg-ink-900 text-paper-50 text-sm font-semibold px-6 py-3 transition-colors"
          >
            View {area.name} on the live map
          </button>
        </div>

        <p className="text-xs text-ink-400 mt-4 text-center">
          Demo data for the Smart India Hackathon — not a live government feed.
        </p>
      </section>

      <Footer />
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  tone?: "clear" | "severe";
}) {
  const color = tone === "clear" ? "var(--color-risk-clear)" : tone === "severe" ? "var(--color-risk-severe)" : "var(--color-ink-700)";
  return (
    <div className="rounded-2xl border border-ink-800/8 p-4">
      <Icon size={15} style={{ color }} className="mb-2" />
      <p className="text-xs text-ink-400 mb-0.5">{label}</p>
      <p className="text-lg font-display text-ink-950">{value}</p>
    </div>
  );
}
