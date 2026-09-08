import { useId, useState } from "react";
import { Search, MapPin } from "lucide-react";
import { searchIndiaLocations } from "../services/locationSearch";

interface SearchBarProps {
  placeholder?: string;
  onSubmit: (query: string) => void;
  buttonLabel?: string;
  variant?: "landing" | "app";
  autoFocus?: boolean;
}

export default function SearchBar({
  placeholder = "Search Indian city, flood basin, or road...",
  onSubmit,
  buttonLabel,
  variant = "landing",
  autoFocus,
}: SearchBarProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const listId = useId();

  const suggestions = searchIndiaLocations(value, 6);

  function submit(q: string) {
    if (!q.trim()) return;
    onSubmit(q.trim());
    setFocused(false);
  }

  if (variant === "app") {
    return (
      <div className="relative w-full">
        <div className="flex items-center gap-2 bg-white rounded-full shadow-float border border-ink-800/10 px-4 h-11 focus-within:border-channel-500 transition-colors">
          <Search size={17} className="text-ink-400 shrink-0" />
          <input
            value={value}
            autoFocus={autoFocus}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 180)}
            onKeyDown={(e) => e.key === "Enter" && submit(value)}
            placeholder={placeholder}
            aria-label="Search Indian location"
            aria-controls={listId}
            className="flex-1 min-w-0 text-sm text-ink-900 placeholder:text-ink-400 outline-none bg-transparent"
          />
        </div>
        {focused && suggestions.length > 0 && (
          <ul
            id={listId}
            className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-panel border border-ink-800/10 overflow-hidden z-40 max-h-72 overflow-y-auto"
          >
            {suggestions.map((loc) => (
              <li key={loc.id}>
                <button
                  className="w-full text-left px-4 py-2.5 hover:bg-paper-100 flex items-center justify-between gap-3 border-b border-ink-800/5 last:border-b-0"
                  onMouseDown={() => submit(loc.name)}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MapPin size={14} className="text-channel-600 shrink-0" />
                    <div>
                      <span className="text-sm font-medium text-ink-950 block truncate">{loc.name}</span>
                      <span className="text-[11px] text-ink-400">{loc.region}</span>
                    </div>
                  </div>
                  <span className="shrink-0 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-paper-200 text-ink-600">
                    {loc.riverBasin.split(" ")[0]}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-xl">
      <div className="flex items-center gap-2 bg-paper-50 rounded-full shadow-panel px-2 py-2 pl-5 border border-ink-800/5">
        <Search size={18} className="text-ink-400 shrink-0" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          onKeyDown={(e) => e.key === "Enter" && submit(value)}
          placeholder={placeholder}
          aria-label="Search Indian location"
          className="flex-1 min-w-0 bg-transparent text-ink-900 placeholder:text-ink-400 outline-none text-sm sm:text-base py-2"
        />
        <button
          onClick={() => submit(value)}
          className="shrink-0 rounded-full bg-ink-950 hover:bg-ink-900 text-paper-50 text-sm font-semibold px-4 sm:px-5 py-2.5 whitespace-nowrap transition-colors"
        >
          {buttonLabel ?? "Check Risk →"}
        </button>
      </div>
      {focused && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 mt-2 bg-paper-50 rounded-2xl shadow-panel border border-ink-800/10 overflow-hidden z-40 max-h-72 overflow-y-auto">
          {suggestions.map((loc) => (
            <li key={loc.id}>
              <button
                className="w-full text-left px-5 py-3 hover:bg-paper-200 flex items-center justify-between gap-3 border-b border-ink-800/5 last:border-b-0"
                onMouseDown={() => submit(loc.name)}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <MapPin size={15} className="text-channel-600 shrink-0" />
                  <div>
                    <span className="text-ink-950 font-medium block truncate">{loc.name}</span>
                    <span className="text-xs text-ink-400">{loc.region}</span>
                  </div>
                </div>
                <span className="shrink-0 text-xs font-mono px-2 py-0.5 rounded-full bg-paper-300 text-ink-700">
                  {loc.riverBasin}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
