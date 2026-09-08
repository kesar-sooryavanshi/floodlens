const ITEMS = [
  { color: "var(--color-risk-clear)", emoji: "🟢", label: "Accessible" },
  { color: "var(--color-risk-caution)", emoji: "🟡", label: "Risk" },
  { color: "var(--color-risk-severe)", emoji: "🔴", label: "Inaccessible" },
];

export default function Legend() {
  return (
    <div className="pointer-events-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-panel border border-ink-800/5 px-3.5 py-2.5 flex items-center gap-4">
      {ITEMS.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-ink-700">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block"
            style={{ background: item.color }}
            aria-hidden
          />
          {item.label}
        </div>
      ))}
    </div>
  );
}
