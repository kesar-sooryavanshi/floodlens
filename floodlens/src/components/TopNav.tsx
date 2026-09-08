import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Droplets, Plus } from "lucide-react";
import ReportModal from "./ReportModal";

const LINKS = [
  { to: "/live", label: "Live Map" },
  { to: "/roads", label: "Road Accessibility" },
  { to: "/routes", label: "Safe Routes" },
  { to: "/video", label: "Video Stream AI" },
  { to: "/hazards", label: "Citizen Hazards" },
  { to: "/flood-analysis", label: "Flood Analysis" },
  { to: "/about", label: "About" },
];

export default function TopNav() {
  const [open, setOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-ink-800/60 bg-ink-950/90 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-paper-50" onClick={() => setOpen(false)}>
            <span className="grid place-items-center w-8 h-8 rounded-lg bg-channel-600 text-paper-50">
              <Droplets size={16} strokeWidth={2.2} />
            </span>
            <span className="font-display text-lg tracking-tight">FloodLens</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-5">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-xs font-medium text-ink-300 hover:text-paper-50 transition-colors whitespace-nowrap"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => setReportModalOpen(true)}
              className="flex items-center gap-1.5 rounded-full border border-channel-500/40 text-channel-400 hover:bg-channel-500/10 text-xs font-semibold px-3.5 py-2 transition-colors"
            >
              <Plus size={14} /> Report Hazard
            </button>
            <button
              onClick={() => navigate("/live")}
              className="rounded-full bg-channel-500 hover:bg-channel-400 text-ink-950 text-xs font-semibold px-4 py-2 transition-colors"
            >
              Open Live Map
            </button>
          </div>

          <button
            className="lg:hidden text-paper-50 p-2 -mr-2"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden border-t border-ink-800/60 bg-ink-950 px-5 py-4 flex flex-col gap-3">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-ink-300 text-sm py-1 hover:text-paper-50"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setOpen(false);
                  setReportModalOpen(true);
                }}
                className="rounded-full border border-channel-500/40 text-channel-400 text-sm font-semibold px-5 py-2.5"
              >
                + Report Hazard
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/live");
                }}
                className="rounded-full bg-channel-500 text-ink-950 text-sm font-semibold px-5 py-2.5"
              >
                Open Live Map
              </button>
            </div>
          </div>
        )}
      </header>

      <ReportModal open={reportModalOpen} onClose={() => setReportModalOpen(false)} />
    </>
  );
}
