import { MapPinOff } from "lucide-react";

export default function MapSetupNotice({ className }: { className?: string }) {
  return (
    <div className={`${className ?? "w-full h-full"} flex items-center justify-center bg-ink-900 text-paper-100 p-8`}>
      <div className="max-w-sm text-center">
        <MapPinOff className="mx-auto mb-4 text-channel-400" size={32} strokeWidth={1.6} />
        <h3 className="font-display text-xl mb-2">Map tiles aren't configured</h3>
        <p className="text-sm text-ink-300 leading-relaxed">
          FloodLens needs a map tile source to draw the live map. Set{" "}
          <code className="font-mono text-xs bg-ink-800 px-1.5 py-0.5 rounded">VITE_MAP_TILE_URL</code> in your
          environment, or remove <code className="font-mono text-xs bg-ink-800 px-1.5 py-0.5 rounded">VITE_MAP_REQUIRES_KEY</code>{" "}
          to fall back to free OpenStreetMap tiles.
        </p>
      </div>
    </div>
  );
}
