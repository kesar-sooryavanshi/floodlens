import { Link } from "react-router-dom";
import { Droplets, Locate, Bell, User } from "lucide-react";
import SearchBar from "./SearchBar";

interface AppBarProps {
  onSearch: (query: string) => void;
  onLocate: () => void;
  locating: boolean;
}

export default function AppBar({ onSearch, onLocate, locating }: AppBarProps) {
  return (
    <div className="pointer-events-auto flex items-center gap-2 sm:gap-3 px-3 sm:px-4 h-16 bg-paper-50/95 backdrop-blur-sm border-b border-ink-800/10 shadow-panel z-30 relative">
      <Link to="/" className="hidden sm:flex items-center gap-2 shrink-0">
        <span className="grid place-items-center w-8 h-8 rounded-lg bg-ink-950 text-paper-50">
          <Droplets size={16} strokeWidth={2.2} />
        </span>
        <span className="font-display text-base text-ink-950">FloodLens</span>
      </Link>

      <div className="flex-1 min-w-0 max-w-xl">
        <SearchBar variant="app" onSubmit={onSearch} placeholder="Search city, locality, or road..." />
      </div>

      <button
        onClick={onLocate}
        aria-label="Use my location"
        className="shrink-0 grid place-items-center w-11 h-11 rounded-full border border-ink-800/10 bg-white text-ink-700 hover:text-channel-600 hover:border-channel-300 transition-colors"
      >
        <Locate size={18} className={locating ? "animate-pulse text-channel-600" : ""} />
      </button>
      <button
        aria-label="Notifications"
        className="hidden sm:grid shrink-0 place-items-center w-11 h-11 rounded-full border border-ink-800/10 bg-white text-ink-700 hover:text-channel-600 hover:border-channel-300 transition-colors"
      >
        <Bell size={18} />
      </button>
      <button
        aria-label="Account"
        className="hidden sm:grid shrink-0 place-items-center w-11 h-11 rounded-full bg-ink-950 text-paper-50"
      >
        <User size={17} />
      </button>
    </div>
  );
}
