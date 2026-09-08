import { X, TrendingUp, TrendingDown, Minus, Waves, Navigation2, Flag, Clock } from "lucide-react";
import type { RoadFeature } from "../types";
import { RISK_META } from "../types";

interface RoadDetailPanelProps {
  road: RoadFeature | null;
  onClose: () => void;
  onFindAlternative: (road: RoadFeature) => void;
  onReport: (road: RoadFeature) => void;
}

const TREND_ICON = { Rising: TrendingUp, Falling: TrendingDown, Steady: Minus };

export default function RoadDetailPanel({ road, onClose, onFindAlternative, onReport }: RoadDetailPanelProps) {
  const open = Boolean(road);
  const TrendIcon = road ? TREND_ICON[road.trend] : Minus;
  const meta = road ? RISK_META[road.risk] : null;

  return (
    <div
      className={`fixed z-40 bg-white shadow-panel transition-transform duration-300 ease-out
        inset-x-0 bottom-0 rounded-t-3xl max-h-[75vh] overflow-y-auto
        sm:inset-x-auto sm:right-0 sm:top-16 sm:bottom-0 sm:w-[380px] sm:rounded-t-none sm:rounded-l-3xl sm:max-h-none
        ${open ? "translate-y-0 sm:translate-x-0" : "translate-y-full sm:translate-y-0 sm:translate-x-full"}
      `}
      role="dialog"
      aria-hidden={!open}
      aria-label="Road details"
    >
      {road && meta && (
        <div className="p-5 sm:p-6">
          <div className="sm:hidden w-10 h-1 rounded-full bg-ink-800/15 mx-auto mb-4" />
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-400 mb-1">Road name</p>
              <h3 className="font-display text-xl text-ink-950 leading-snug">{road.name}</h3>
            </div>
            <button
              onClick={onClose}
              aria-label="Close road details"
              className="shrink-0 grid place-items-center w-9 h-9 rounded-full hover:bg-paper-100 text-ink-500"
            >
              <X size={18} />
            </button>
          </div>

          <div
            className="flex items-center gap-2 rounded-2xl px-4 py-3 mb-4"
            style={{ background: meta.soft }}
          >
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: meta.color }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: meta.color }}>
                {meta.short}
              </p>
              <p className="text-xs text-ink-600">{road.accessibility}</p>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-3 mb-5">
            <div className="rounded-xl border border-ink-800/8 p-3">
              <dt className="flex items-center gap-1.5 text-xs text-ink-400 mb-1">
                <Waves size={13} /> Water level
              </dt>
              <dd className="text-sm font-medium text-ink-900">{road.waterLevel}</dd>
            </div>
            <div className="rounded-xl border border-ink-800/8 p-3">
              <dt className="flex items-center gap-1.5 text-xs text-ink-400 mb-1">
                <TrendIcon size={13} /> Risk trend
              </dt>
              <dd className="text-sm font-medium text-ink-900">{road.trend}</dd>
            </div>
            <div className="rounded-xl border border-ink-800/8 p-3 col-span-2">
              <dt className="flex items-center gap-1.5 text-xs text-ink-400 mb-1">
                <Clock size={13} /> Last updated
              </dt>
              <dd className="text-sm font-medium text-ink-900">{road.lastUpdated}</dd>
            </div>
          </dl>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => onFindAlternative(road)}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-ink-950 hover:bg-ink-900 text-paper-50 text-sm font-semibold py-3 transition-colors"
            >
              <Navigation2 size={15} /> Find alternative
            </button>
            <button
              onClick={() => onReport(road)}
              className="w-full flex items-center justify-center gap-2 rounded-full border border-ink-800/15 hover:border-channel-400 hover:text-channel-600 text-ink-700 text-sm font-semibold py-3 transition-colors"
            >
              <Flag size={15} /> Report flood
            </button>
          </div>

          <p className="mt-4 text-[11px] text-ink-400 leading-relaxed">
            Demo data for the Smart India Hackathon. Values are illustrative, not live government readings.
          </p>
        </div>
      )}
    </div>
  );
}
