import TopNav from "../components/TopNav";
import { Footer } from "./Landing";
import VideoProcessor from "../components/VideoProcessor";

export default function VideoStreamPage() {
  return (
    <div className="bg-paper-100 min-h-screen flex flex-col">
      <div className="bg-ink-950">
        <TopNav />
      </div>

      <section className="bg-ink-950 text-paper-50 pb-12 pt-10 border-b border-ink-800/40">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider px-3 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
              Live Edge Processing
            </span>
            <span className="text-xs text-ink-400">• Traffic Cam & Recon Streams</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl tracking-tight">Continuous Video Stream Processing</h1>
          <p className="text-ink-300 max-w-2xl text-sm sm:text-base mt-2 leading-relaxed">
            Neural computer vision processes real-time camera streams to detect water segmentation boundaries, estimate water depths, and alert routing networks before road closures escalate.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 sm:px-8 -mt-6 pb-20 flex-1 w-full">
        <div className="bg-ink-950 rounded-3xl p-6 sm:p-8 shadow-2xl border border-ink-800/80">
          <VideoProcessor />
        </div>
      </section>

      <Footer />
    </div>
  );
}
