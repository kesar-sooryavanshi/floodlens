import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, ExternalLink, ShieldCheck } from "lucide-react";
import { searchIndiaLocations } from "../services/locationSearch";
import type { IndiaLocation } from "../services/locationSearch";

const LocationSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IndiaLocation[]>([]);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length > 0) {
      setResults(searchIndiaLocations(val, 12));
    } else {
      setResults([]);
    }
  };

  function handleSelect(loc: IndiaLocation) {
    navigate("/live", { state: { query: loc.name } });
  }

  return (
    <div className="location-search p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <span className="text-xs font-semibold text-channel-600 uppercase tracking-wider bg-channel-50 px-3 py-1 rounded-full">
          Pan-India Coverage API
        </span>
        <h2 className="text-3xl font-display text-ink-950 mt-2">National Flood Intelligence Search</h2>
        <p className="text-sm text-ink-600 mt-1">
          Query river basins, municipal districts, and flood-prone corridors across India.
        </p>
      </div>

      <div className="relative mb-6">
        <div className="flex items-center gap-3 bg-white rounded-2xl shadow-panel border border-ink-800/10 px-4 h-14 focus-within:border-channel-500 transition-colors">
          <Search size={20} className="text-ink-400 shrink-0" />
          <input
            type="text"
            placeholder="Search Indian city, flood zone, or river basin (e.g. Yamuna, Patna, Guwahati, Chiplun)..."
            value={query}
            onChange={handleChange}
            className="flex-1 text-sm sm:text-base text-ink-950 placeholder:text-ink-400 outline-none bg-transparent"
          />
        </div>
      </div>

      {results.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-3">
          {results.map((loc) => (
            <div
              key={loc.id}
              onClick={() => handleSelect(loc)}
              className="group cursor-pointer p-4 bg-white rounded-2xl border border-ink-800/10 hover:border-channel-500/60 shadow-sm hover:shadow-panel transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-channel-50 text-channel-800">
                    {loc.riverBasin}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      loc.risk === "severe"
                        ? "bg-red-50 text-red-700"
                        : loc.risk === "caution"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {loc.risk.toUpperCase()}
                  </span>
                </div>
                <h4 className="font-display text-base text-ink-950 group-hover:text-channel-700 transition-colors flex items-center gap-1.5">
                  <MapPin size={15} className="text-channel-600 shrink-0" /> {loc.name}
                </h4>
                <p className="text-xs text-ink-500 mt-1">{loc.region}</p>
                <p className="text-xs text-ink-600 mt-2 line-clamp-2 leading-relaxed">{loc.insight}</p>
              </div>

              <div className="mt-3 pt-3 border-t border-ink-800/5 flex items-center justify-between text-xs text-channel-600 font-semibold">
                <span>View Live Telemetry</span>
                <ExternalLink size={13} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-ink-800/20 text-ink-400 text-xs flex flex-col items-center gap-2">
          <ShieldCheck size={28} className="text-channel-600 opacity-60" />
          <span>Type any city or region to query real-time Pan-India flood intelligence</span>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
