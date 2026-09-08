import { useNavigate } from "react-router-dom";
import { Search, Route, ShieldCheck, MapPin } from "lucide-react";
import TopNav from "../components/TopNav";
import SearchBar from "../components/SearchBar";
import MapView from "../components/MapView";
import { AREAS } from "../data/locations";
import { roadsForArea } from "../data/roads";
import { RISK_META } from "../types";

const STEPS = [
  {
    icon: Search,
    title: "Search where you're headed",
    body: "Type a city, locality, or a specific road. FloodLens finds it on the live map instantly.",
  },
  {
    icon: MapPin,
    title: "See risk and accessibility",
    body: "Roads are marked accessible, risky, or inaccessible — in plain language, not sensor jargon.",
  },
  {
    icon: Route,
    title: "Choose a safer route",
    body: "Compare a recommended route against an alternative before you leave, not after you're stuck.",
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const meerut = AREAS[0];
  const heroRoads = roadsForArea(meerut.id);

  function goToLive(query?: string) {
    navigate("/live", { state: { query } });
  }

  return (
    <div className="bg-ink-950 text-paper-50">
      <TopNav />

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-5 sm:px-8 pt-14 pb-16 sm:pt-20 sm:pb-24 grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-center">
        <div>
          <h1 className="font-display text-[2.6rem] leading-[1.05] sm:text-6xl sm:leading-[1.03] text-paper-50 mb-5">
            Know the water.
            <br />
            Choose the road.
          </h1>
          <p className="text-ink-300 text-base sm:text-lg max-w-md mb-8 leading-relaxed">
            Check flood conditions, understand road accessibility, and make better travel
            decisions with FloodLens.
          </p>

          <div className="flex flex-col gap-3 mb-6">
            <SearchBar onSubmit={(q) => goToLive(q)} />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => goToLive()}
              className="rounded-full bg-channel-500 hover:bg-channel-400 text-ink-950 text-sm sm:text-base font-semibold px-6 py-3 transition-colors"
            >
              Open Live Map
            </button>
            <a
              href="#how-it-works"
              className="text-sm sm:text-base text-ink-300 hover:text-paper-50 font-medium transition-colors"
            >
              How It Works
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-3 rounded-[2rem] bg-channel-900/40 blur-2xl" aria-hidden />
          <div className="relative rounded-[1.75rem] overflow-hidden border border-ink-700/60 shadow-panel h-[320px] sm:h-[400px]">
            <MapView
              className="w-full h-full"
              roads={heroRoads}
              flyTo={{ center: meerut.center, zoom: 12.2, key: 1 }}
              riskFilter="all"
              activeLayers={new Set(["accessibility"])}
              selectedRoadId={null}
              onSelectRoad={() => goToLive(meerut.name)}
              userLocation={null}
              areaMarker={{ coords: meerut.center, name: meerut.name }}
            />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <span className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium text-ink-700 shadow-float">
                {meerut.name} · live preview
              </span>
              <span
                className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-semibold shadow-float"
                style={{ color: RISK_META[meerut.risk].color }}
              >
                {RISK_META[meerut.risk].short}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-paper-100 text-ink-950 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="font-display text-3xl sm:text-4xl mb-3">How FloodLens works</h2>
          <p className="text-ink-500 max-w-lg mb-12">
            Three steps between wondering about a route and knowing what to do.
          </p>
          <div className="grid sm:grid-cols-3 gap-8 sm:gap-6">
            {STEPS.map((step, i) => (
              <div key={step.title} className="relative pl-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="grid place-items-center w-10 h-10 rounded-full bg-ink-950 text-paper-50 shrink-0">
                    <step.icon size={17} strokeWidth={2} />
                  </span>
                  <span className="text-sm font-mono text-ink-400">{`0${i + 1}`}</span>
                </div>
                <h3 className="font-display text-xl mb-2">{step.title}</h3>
                <p className="text-ink-500 text-sm leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live snapshot strip */}
      <section className="bg-ink-950 py-16 sm:py-20 border-t border-ink-800/60">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl sm:text-3xl text-paper-50">Right now, across cities</h2>
            <button onClick={() => goToLive()} className="hidden sm:block text-sm text-channel-400 hover:text-channel-300 font-medium">
              View full map →
            </button>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {AREAS.slice(0, 3).map((a) => {
              const meta = RISK_META[a.risk];
              return (
                <button
                  key={a.id}
                  onClick={() => goToLive(a.name)}
                  className="text-left rounded-2xl border border-ink-800/60 hover:border-channel-500/60 bg-ink-900/60 p-5 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-lg text-paper-50">{a.name}</h3>
                    <span
                      className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: meta.soft, color: meta.color }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.color }} />
                      {meta.short}
                    </span>
                  </div>
                  <p className="text-sm text-ink-300 leading-relaxed">{a.insight}</p>
                  <div className="mt-4 flex gap-4 text-xs text-ink-400">
                    <span>{a.affectedRoads} affected</span>
                    <span>{a.accessibleRoads} accessible</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-channel-700 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 text-center">
          <ShieldCheck className="mx-auto mb-4 text-paper-50" size={32} strokeWidth={1.6} />
          <h2 className="font-display text-3xl sm:text-4xl text-paper-50 mb-4">
            Travel with the water in view.
          </h2>
          <p className="text-channel-100 mb-8 max-w-lg mx-auto">
            FloodLens is free to use and built for the moments when a wrong turn costs more than time.
          </p>
          <button
            onClick={() => goToLive()}
            className="rounded-full bg-paper-50 hover:bg-white text-ink-950 text-base font-semibold px-7 py-3.5 transition-colors"
          >
            Open Live Map
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink-950 border-t border-ink-800/60 py-10">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-ink-400">
        <p>Built for Smart India Hackathon · Demo data, not a live government feed.</p>
        <div className="flex gap-6">
          <a href="/about" className="hover:text-paper-50 transition-colors">About</a>
          <a href="/live" className="hover:text-paper-50 transition-colors">Live Map</a>
        </div>
      </div>
    </footer>
  );
}
