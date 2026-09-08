import { AlertTriangle } from "lucide-react";
import type { RouteOption } from "../types";
import { RISK_META } from "../types";

export default function RouteResultCard({ route, primary }: { route: RouteOption; primary?: boolean }) {
  const meta = RISK_META[route.risk];
  return (
    <div
      className={`rounded-2xl border p-5 flex flex-col gap-3 ${
        primary ? "border-channel-400 bg-channel-100/40" : "border-ink-800/10 bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <h4 className="font-display text-lg text-ink-950">{route.label}</h4>
        <span
          className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ background: meta.soft, color: meta.color }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.color }} />
          {meta.short}
        </span>
      </div>

      <div className="flex items-baseline gap-4">
        <div>
          <span className="text-2xl font-display text-ink-950">{route.distanceKm}</span>
          <span className="text-sm text-ink-500"> km</span>
        </div>
        <div>
          <span className="text-2xl font-display text-ink-950">{route.durationMin}</span>
          <span className="text-sm text-ink-500"> min</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-sm text-ink-600">
        {route.affectedRoads > 0 ? (
          <>
            <AlertTriangle size={14} className="text-risk-caution" />
            {route.affectedRoads} affected road{route.affectedRoads === 1 ? "" : "s"} on this route
          </>
        ) : (
          "No affected roads on this route"
        )}
      </div>
    </div>
  );
}
