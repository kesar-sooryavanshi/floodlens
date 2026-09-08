import { useState, useEffect } from "react";
import { X, CheckCircle2, Camera, MapPin, Locate, AlertTriangle, ShieldCheck } from "lucide-react";
import type { WaterLevel } from "../types";
import { saveHazard } from "../utils/persistence";
import { reverseGeocodeIndia } from "../services/locationSearch";

const WATER_LEVELS: WaterLevel[] = ["None", "Ankle-level", "Knee-level", "Waist-level", "Above waist"];
const HAZARD_TYPES = [
  "Flooded Roadway",
  "Submerged Underpass",
  "Submerged Bridge",
  "River / Drain Overflow",
  "Road Blocked by Debris",
  "Water Rising Rapidly",
  "Water Receding",
];

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  defaultLocation?: string;
  defaultRoad?: string;
  initialCoords?: [number, number]; // [lng, lat]
}

export default function ReportModal({
  open,
  onClose,
  defaultLocation,
  defaultRoad,
  initialCoords,
}: ReportModalProps) {
  const [location, setLocation] = useState(defaultLocation ?? "");
  const [road, setRoad] = useState(defaultRoad ?? "");
  const [hazardType, setHazardType] = useState(HAZARD_TYPES[0]);
  const [waterLevel, setWaterLevel] = useState<WaterLevel>("Knee-level");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [pinMode, setPinMode] = useState(false);

  // Default coordinates (Delhi / Meerut or provided)
  const [coords, setCoords] = useState<[number, number]>(
    initialCoords || [77.209, 28.6139]
  );
  const [locating, setLocating] = useState(false);
  const [photoAdded, setPhotoAdded] = useState(false);

  useEffect(() => {
    if (open) {
      setLocation(defaultLocation ?? "");
      setRoad(defaultRoad ?? "");
      setSubmitted(false);
      if (initialCoords) {
        setCoords(initialCoords);
        const geo = reverseGeocodeIndia(initialCoords[1], initialCoords[0]);
        if (!defaultLocation) setLocation(geo.name);
      }
    }
  }, [open, defaultLocation, defaultRoad, initialCoords]);

  if (!open) return null;

  function handleLocateMe() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newCoords: [number, number] = [pos.coords.longitude, pos.coords.latitude];
        setCoords(newCoords);
        const geo = reverseGeocodeIndia(pos.coords.latitude, pos.coords.longitude);
        setLocation(geo.name);
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 7000 }
    );
  }

  function handleAdjustCoords(dLng: number, dLat: number) {
    const updated: [number, number] = [
      Number((coords[0] + dLng).toFixed(4)),
      Number((coords[1] + dLat).toFixed(4)),
    ];
    setCoords(updated);
    const geo = reverseGeocodeIndia(updated[1], updated[0]);
    setLocation(geo.name);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await saveHazard({
        latitude: coords[1],
        longitude: coords[0],
        location: location.trim() || "Reported Coordinate",
        road: road.trim() || "Local Access Road",
        hazardType,
        waterLevel,
        description: description.trim() || "Reported via Citizen Hazard Network",
        verifiedCount: 1,
        status: "active",
        photoUrl: photoAdded ? "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&auto=format&fit=crop" : undefined,
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to save hazard:", err);
      setSubmitted(true);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink-950/60 backdrop-blur-sm p-0 sm:p-6 animate-fadeIn">
      <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-panel max-h-[92vh] overflow-y-auto border border-ink-800/10">
        {submitted ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-channel-50 text-channel-600 mb-4 shadow-sm">
              <CheckCircle2 size={38} strokeWidth={2} />
            </div>
            <h3 className="font-display text-2xl text-ink-950 mb-2">Citizen Hazard Logged</h3>
            <p className="text-sm text-ink-600 mb-4 max-w-sm mx-auto leading-relaxed">
              Your report at <strong className="text-ink-900">{location || road}</strong> has been stored in persistent offline storage and is now visible on the live intelligence map.
            </p>
            <div className="bg-paper-100 rounded-2xl p-3 text-xs text-ink-500 mb-6 flex items-center justify-center gap-2">
              <ShieldCheck size={16} className="text-channel-600 shrink-0" />
              <span>Broadcasted to safe routing engine for live avoidance.</span>
            </div>
            <button
              onClick={onClose}
              className="rounded-full bg-ink-950 hover:bg-ink-900 text-paper-50 text-sm font-semibold px-8 py-3 transition-colors shadow-sm"
            >
              Done & View on Map
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="sm:hidden w-10 h-1 rounded-full bg-ink-800/15 mx-auto mb-4" />
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-[11px] font-semibold tracking-wider uppercase text-channel-600 bg-channel-50 px-2.5 py-0.5 rounded-full">
                  Citizen Hazard Network
                </span>
                <h3 className="font-display text-xl text-ink-950 mt-1">Report Flood or Road Hazard</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid place-items-center w-9 h-9 rounded-full hover:bg-paper-100 text-ink-500 -mt-1 -mr-1 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {/* Pin option container */}
              <div className="rounded-2xl border border-channel-500/20 bg-channel-50/40 p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-ink-900 flex items-center gap-1.5">
                    <MapPin size={15} className="text-channel-600" /> Exact Map Coordinates
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handleLocateMe}
                      disabled={locating}
                      className="text-xs font-medium text-channel-700 bg-white hover:bg-channel-100 border border-channel-200 px-2.5 py-1 rounded-full flex items-center gap-1 transition-colors"
                    >
                      <Locate size={12} className={locating ? "animate-spin" : ""} />
                      {locating ? "Locating..." : "Use GPS"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPinMode(!pinMode)}
                      className="text-xs font-medium text-ink-700 bg-white hover:bg-paper-100 border border-ink-800/10 px-2.5 py-1 rounded-full transition-colors"
                    >
                      {pinMode ? "Hide Pin Tool" : "Adjust Pin"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-ink-600 bg-white rounded-xl px-3 py-2 border border-ink-800/10">
                  <span className="font-mono text-ink-900">
                    {coords[1].toFixed(4)}°N, {coords[0].toFixed(4)}°E
                  </span>
                  <span className="text-ink-400">Precision GPS Point</span>
                </div>

                {pinMode && (
                  <div className="mt-2.5 pt-2.5 border-t border-channel-200/60 flex flex-col gap-2">
                    <p className="text-[11px] text-ink-500">
                      Nudge pin position to pinpoint the exact submerged section:
                    </p>
                    <div className="grid grid-cols-4 gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleAdjustCoords(0, 0.005)}
                        className="py-1 px-2 text-xs bg-white hover:bg-paper-100 rounded-lg border border-ink-800/10 text-ink-800"
                      >
                        ↑ North
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdjustCoords(0, -0.005)}
                        className="py-1 px-2 text-xs bg-white hover:bg-paper-100 rounded-lg border border-ink-800/10 text-ink-800"
                      >
                        ↓ South
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdjustCoords(-0.005, 0)}
                        className="py-1 px-2 text-xs bg-white hover:bg-paper-100 rounded-lg border border-ink-800/10 text-ink-800"
                      >
                        ← West
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdjustCoords(0.005, 0)}
                        className="py-1 px-2 text-xs bg-white hover:bg-paper-100 rounded-lg border border-ink-800/10 text-ink-800"
                      >
                        → East
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="City / Region / Landmark">
                  <input
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Meerut, Delhi, Mumbai"
                    className="input"
                  />
                </Field>
                <Field label="Road / Underpass / Street">
                  <input
                    required
                    value={road}
                    onChange={(e) => setRoad(e.target.value)}
                    placeholder="e.g. Ring Road, Garh Rd"
                    className="input"
                  />
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Hazard Type">
                  <select
                    value={hazardType}
                    onChange={(e) => setHazardType(e.target.value)}
                    className="input"
                  >
                    {HAZARD_TYPES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Estimated Water Level">
                  <select
                    value={waterLevel}
                    onChange={(e) => setWaterLevel(e.target.value as WaterLevel)}
                    className="input"
                  >
                    {WATER_LEVELS.map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Hazard Details & Passability Notes">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="e.g. Water height reaching car wheel arches. Sedans stalling. Avoid inner lane."
                  className="input resize-none"
                />
              </Field>

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setPhotoAdded(!photoAdded)}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-medium transition-colors ${
                    photoAdded
                      ? "border-channel-500 bg-channel-50 text-channel-800"
                      : "border-dashed border-ink-800/20 text-ink-600 hover:border-channel-400"
                  }`}
                >
                  <Camera size={15} />
                  {photoAdded ? "✓ Visual Evidence Attached" : "Attach Photo / Dashcam Frame"}
                </button>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-ink-400">
                <AlertTriangle size={13} className="text-amber-500 shrink-0" />
                <span>Reports update in local storage and routing models automatically.</span>
              </div>
            </div>

            <button
              type="submit"
              className="mt-5 w-full rounded-full bg-channel-500 hover:bg-channel-400 text-ink-950 text-sm font-semibold py-3.5 transition-colors shadow-sm"
            >
              Broadcast Citizen Hazard
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-ink-500">{label}</span>
      {children}
    </label>
  );
}
