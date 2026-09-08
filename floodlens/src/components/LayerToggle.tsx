import { useState } from "react";
import { Layers, ChevronDown } from "lucide-react";
import type { LayerKey } from "./MapView";

const LAYER_LABELS: { key: LayerKey; label: string }[] = [
  { key: "accessibility", label: "Road accessibility" },
  { key: "flooded", label: "Flooded areas" },
  { key: "waterLevel", label: "Water level" },
  { key: "riskZones", label: "Risk zones" },
  { key: "rainfall", label: "Rainfall" },
];

interface LayerToggleProps {
  active: Set<LayerKey>;
  onToggle: (key: LayerKey) => void;
}

export default function LayerToggle({ active, onToggle }: LayerToggleProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="pointer-events-auto relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-panel border border-ink-800/5 px-3.5 py-2.5 text-sm font-medium text-ink-700"
      >
        <Layers size={16} />
        Layers
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full mt-2 left-0 bg-white rounded-2xl shadow-panel border border-ink-800/5 p-2 w-56 z-10">
          {LAYER_LABELS.map((l) => (
            <label
              key={l.key}
              className="flex items-center gap-3 px-2.5 py-2 rounded-xl hover:bg-paper-100 cursor-pointer text-sm text-ink-800"
            >
              <input
                type="checkbox"
                checked={active.has(l.key)}
                onChange={() => onToggle(l.key)}
                className="w-4 h-4 accent-channel-600"
              />
              {l.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
