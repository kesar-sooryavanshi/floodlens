import { useNavigate } from "react-router-dom";
import { Satellite, Layers, Users } from "lucide-react";
import TopNav from "../components/TopNav";
import { Footer } from "./Landing";

const PILLARS = [
  {
    icon: Satellite,
    title: "Sensing in the background",
    body: "Satellite segmentation, road-condition models, and rainfall forecasts do the technical work. None of it surfaces to the person using the map.",
  },
  {
    icon: Layers,
    title: "One question, answered plainly",
    body: "Every screen exists to answer one thing: can I get where I'm going, and if not, what's the next best road?",
  },
  {
    icon: Users,
    title: "Built with the people on the ground",
    body: "Community reports fill the gaps between sensor readings, so conditions update faster than any single feed could manage alone.",
  },
];

export default function About() {
  const navigate = useNavigate();
  return (
    <div className="bg-ink-950 text-paper-50 min-h-screen">
      <TopNav />

      <section className="mx-auto max-w-3xl px-5 sm:px-8 pt-16 pb-20">
        <h1 className="font-display text-4xl sm:text-5xl mb-6 leading-tight">
          FloodLens turns flood intelligence into a travel decision.
        </h1>
        <p className="text-ink-300 text-lg leading-relaxed mb-14 max-w-xl">
          Built for Smart India Hackathon, FloodLens is a hyperlocal flood and road accessibility
          tool. It takes the kind of information usually locked inside GIS dashboards and satellite
          models, and puts it in front of the person who actually needs it before they leave the
          house.
        </p>

        <div className="flex flex-col gap-10 mb-16">
          {PILLARS.map((p) => (
            <div key={p.title} className="flex gap-4">
              <span className="shrink-0 grid place-items-center w-11 h-11 rounded-2xl bg-ink-900 border border-ink-800/60">
                <p.icon size={19} className="text-channel-400" strokeWidth={1.8} />
              </span>
              <div>
                <h3 className="font-display text-xl mb-1.5">{p.title}</h3>
                <p className="text-ink-300 leading-relaxed">{p.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-ink-900 border border-ink-800/60 p-6 mb-14">
          <h3 className="font-display text-lg mb-2">A note on this demo</h3>
          <p className="text-sm text-ink-300 leading-relaxed">
            The map, roads, and flood readings you see here are illustrative mock data prepared for
            a hackathon demonstration — not a live feed from any government agency. The interface,
            interactions, and information architecture reflect how a production version would work.
          </p>
        </div>

        <button
          onClick={() => navigate("/live")}
          className="rounded-full bg-channel-500 hover:bg-channel-400 text-ink-950 text-sm font-semibold px-6 py-3 transition-colors"
        >
          Open Live Map
        </button>
      </section>

      <Footer />
    </div>
  );
}
