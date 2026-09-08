import type { RiskFilterValue } from "./MapView";

const OPTIONS: { value: RiskFilterValue; label: string; dot?: string }[] = [
  { value: "all", label: "All roads" },
  { value: "accessible", label: "Accessible", dot: "var(--color-risk-clear)" },
  { value: "atRisk", label: "At risk", dot: "var(--color-risk-caution)" },
  { value: "inaccessible", label: "Inaccessible", dot: "var(--color-risk-severe)" },
];

interface RiskFiltersProps {
  value: RiskFilterValue;
  onChange: (v: RiskFilterValue) => void;
  resultCount: number;
}

export default function RiskFilters({ value, onChange, resultCount }: RiskFiltersProps) {
  return (
    <div className="pointer-events-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-panel border border-ink-800/5 p-1.5 flex items-center gap-1 overflow-x-auto max-w-full">
      {OPTIONS.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`shrink-0 flex items-center gap-1.5 text-xs sm:text-sm font-medium px-3 py-2 rounded-xl transition-colors ${
              active ? "bg-ink-950 text-paper-50" : "text-ink-600 hover:bg-paper-100"
            }`}
          >
            {opt.dot && (
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: active ? "currentColor" : opt.dot }}
              />
            )}
            {opt.label}
          </button>
        );
      })}
      <span className="hidden sm:inline text-xs text-ink-400 pl-2 pr-1 shrink-0 border-l border-ink-800/10 ml-1">
        {resultCount} road{resultCount === 1 ? "" : "s"}
      </span>
    </div>
  );
}
