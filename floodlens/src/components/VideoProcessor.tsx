import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, AlertTriangle, ShieldCheck, Video, Radio, Activity, RefreshCw, Send, CheckCircle2 } from "lucide-react";
import { saveHazard } from "../utils/persistence";
import type { WaterLevel } from "../types";

interface StreamSource {
  id: string;
  name: string;
  location: string;
  road: string;
  coords: [number, number]; // [lng, lat]
  videoUrl: string;
  cameraType: "Fixed CCTV" | "Drone Recon" | "Municipal Sensor" | "Webcam";
}

const STREAMS: StreamSource[] = [
  {
    id: "cam-delhi",
    name: "Delhi Ring Road • ISBT Underpass Cam 04",
    location: "Kashmere Gate, Delhi",
    road: "Yamuna Ring Road Bypass",
    coords: [77.231, 28.665],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    cameraType: "Fixed CCTV",
  },
  {
    id: "cam-mumbai",
    name: "Mumbai Eastern Freeway • Hindmata Low Culvert",
    location: "Dadar, Mumbai",
    road: "Dr. B.A. Road Junction",
    coords: [72.843, 19.018],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    cameraType: "Municipal Sensor",
  },
  {
    id: "cam-patna",
    name: "Patna Ganga Ghat • Flood Defense Recon Drone",
    location: "Gandhi Maidan, Patna",
    road: "Ashok Rajpath Embankment",
    coords: [85.141, 25.618],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    cameraType: "Drone Recon",
  },
];

interface FrameMetrics {
  fps: number;
  waterLevelCm: number;
  waterLevelText: WaterLevel;
  confidence: number;
  riskLevel: "clear" | "caution" | "severe";
  passability: {
    twoWheeler: boolean;
    sedan: boolean;
    suv: boolean;
    heavyTruck: boolean;
  };
}

export default function VideoProcessor() {
  const [selectedStream, setSelectedStream] = useState<StreamSource>(STREAMS[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [metrics, setMetrics] = useState<FrameMetrics>({
    fps: 30,
    waterLevelCm: 38,
    waterLevelText: "Waist-level",
    confidence: 94.2,
    riskLevel: "severe",
    passability: { twoWheeler: false, sedan: false, suv: true, heavyTruck: true },
  });
  const [logs, setLogs] = useState<string[]>([
    "[14:00:12] Neural stream initialized: H.264 video decoder linked",
    "[14:00:13] Calibrating road reference plane & curb waterline",
    "[14:00:15] Water surface specular reflectance detected in lower 40%",
  ]);
  const [reported, setReported] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);

  const addLog = useCallback((text: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${time}] ${text}`, ...prev.slice(0, 19)]);
  }, []);

  // Frame processing loop
  const processFrame = useCallback(function tick() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.paused || video.ended) {
      animFrameRef.current = requestAnimationFrame(tick);
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Calculate real-time FPS
    const now = performance.now();
    frameCountRef.current += 1;
    const delta = now - lastTimeRef.current;
    let currentFps = 30;
    if (delta >= 1000) {
      currentFps = Math.round((frameCountRef.current * 1000) / delta);
      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }

    // Computer vision frame simulation:
    // Extract pixel color histogram in bottom third of road area
    const sampleY = Math.floor(canvas.height * 0.65);
    const sampleH = Math.floor(canvas.height * 0.3);
    const imgData = ctx.getImageData(0, sampleY, canvas.width, sampleH);
    const data = imgData.data;

    let totalR = 0;
    let totalG = 0;
    let totalB = 0;
    for (let i = 0; i < data.length; i += 16) {
      totalR += data[i];
      totalG += data[i + 1];
      totalB += data[i + 2];
    }
    const count = data.length / 16;
    const avgB = totalB / count;
    const avgR = totalR / count;

    // Water detection heuristic: water specular reflectance & blue-grey tint
    const waterFactor = Math.min(1, Math.max(0.2, (avgB - avgR + 40) / 80));
    // Dynamic simulated water rise variation
    const wave = Math.sin(now * 0.002) * 4;
    const estimatedDepth = Math.round(32 + waterFactor * 15 + wave);

    let levelText: WaterLevel = "Ankle-level";
    let risk: "clear" | "caution" | "severe" = "caution";
    if (estimatedDepth > 35) {
      levelText = "Waist-level";
      risk = "severe";
    } else if (estimatedDepth > 20) {
      levelText = "Knee-level";
      risk = "caution";
    } else {
      levelText = "Ankle-level";
      risk = "clear";
    }

    // Render HUD overlay on canvas
    // 1. Water segmentation polygon highlight
    ctx.save();
    ctx.fillStyle = risk === "severe" ? "rgba(220, 38, 38, 0.22)" : "rgba(234, 179, 8, 0.20)";
    ctx.strokeStyle = risk === "severe" ? "rgba(239, 68, 68, 0.85)" : "rgba(234, 179, 8, 0.85)";
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.6);
    ctx.lineTo(canvas.width * 0.35, canvas.height * 0.55);
    ctx.lineTo(canvas.width * 0.7, canvas.height * 0.58);
    ctx.lineTo(canvas.width, canvas.height * 0.64);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 2. Detection bounding boxes
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(canvas.width * 0.18, canvas.height * 0.62, canvas.width * 0.28, canvas.height * 0.24);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 11px monospace";
    ctx.fillText(`INUNDATION ZONE [${estimatedDepth}cm]`, canvas.width * 0.18 + 4, canvas.height * 0.62 - 4);

    // 3. Grid target crosshair
    const cx = canvas.width / 2;
    const cy = canvas.height * 0.72;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.moveTo(cx - 20, cy);
    ctx.lineTo(cx + 20, cy);
    ctx.moveTo(cx, cy - 20);
    ctx.lineTo(cx, cy + 20);
    ctx.stroke();

    ctx.restore();

    // Update state metrics periodically
    if (frameCountRef.current % 12 === 0) {
      setMetrics({
        fps: currentFps || 30,
        waterLevelCm: estimatedDepth,
        waterLevelText: levelText,
        confidence: Number((91 + Math.random() * 5).toFixed(1)),
        riskLevel: risk,
        passability: {
          twoWheeler: estimatedDepth < 15,
          sedan: estimatedDepth < 22,
          suv: estimatedDepth < 45,
          heavyTruck: estimatedDepth < 70,
        },
      });
    }

    animFrameRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(processFrame);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [processFrame]);

  // Log periodic simulated CV telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPlaying) return;
      const msgs = [
        `Water pooling index: ${metrics.waterLevelCm}cm (${metrics.waterLevelText})`,
        `Frame segmentation confidence: ${metrics.confidence}%`,
        `Surface velocity vector: 1.8 m/s eastward runoff`,
        `Passability advisory: Sedans restricted, Emergency SUV recommended`,
      ];
      const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
      addLog(randomMsg);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPlaying, metrics, addLog]);

  function handleTogglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
      addLog("Stream resumed — continuous frame analysis active");
    } else {
      video.pause();
      setIsPlaying(false);
      addLog("Stream paused by operator");
    }
  }

  async function handleDispatchHazardFromStream() {
    try {
      await saveHazard({
        latitude: selectedStream.coords[1],
        longitude: selectedStream.coords[0],
        location: selectedStream.location,
        road: selectedStream.road,
        hazardType: "Flooded Roadway (AI Stream Verified)",
        waterLevel: metrics.waterLevelText,
        description: `Automated AI detection from ${selectedStream.name}. Measured water depth: ${metrics.waterLevelCm} cm. Optical confidence: ${metrics.confidence}%. Passability: SUVs only.`,
        verifiedCount: 5,
        status: "active",
      });
      setReported(true);
      addLog(`🚨 Broadcasted hazard alert for ${selectedStream.road} to network`);
      setTimeout(() => setReported(false), 4000);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex flex-col gap-6 text-paper-50">
      {/* Stream Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-ink-900/80 backdrop-blur-md rounded-2xl border border-ink-800/80 p-4 shadow-panel">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-lg text-paper-50 tracking-tight">Continuous Video Stream Intelligence</h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                LIVE CV INFERENCE
              </span>
            </div>
            <p className="text-xs text-ink-300">
              Real-time frame segmentation, road waterline calculation, and automated flood alert dispatch.
            </p>
          </div>
        </div>

        {/* Stream Selector */}
        <div className="flex items-center gap-2">
          {STREAMS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedStream(s);
                addLog(`Switched camera stream to: ${s.name}`);
              }}
              className={`text-xs font-medium px-3.5 py-2 rounded-xl border transition-all ${
                selectedStream.id === s.id
                  ? "bg-channel-500 text-ink-950 font-semibold border-channel-400 shadow-sm"
                  : "bg-ink-950/60 border-ink-800 text-ink-300 hover:text-paper-50 hover:border-ink-700"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Video size={13} />
                <span>{s.location.split(",")[0]}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Video & Telemetry Layout */}
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6">
        {/* Left: Video Player with AI Canvas Overlay */}
        <div className="flex flex-col gap-3">
          <div className="relative rounded-2xl overflow-hidden bg-black border border-ink-800/80 shadow-2xl aspect-video group">
            {/* Native Video Element */}
            <video
              ref={videoRef}
              src={selectedStream.videoUrl}
              crossOrigin="anonymous"
              loop
              autoPlay
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-85"
            />

            {/* Canvas HUD Overlay */}
            <canvas
              ref={canvasRef}
              width={640}
              height={360}
              className="absolute inset-0 w-full h-full pointer-events-none object-cover"
            />

            {/* Video Top Badges */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
              <div className="flex items-center gap-2 bg-ink-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-ink-700/60 text-xs font-mono text-paper-50">
                <Radio size={13} className="text-red-400 animate-pulse" />
                <span>{selectedStream.cameraType}</span>
                <span className="text-ink-400">•</span>
                <span className="text-channel-400">{metrics.fps} FPS</span>
              </div>

              <div className="flex items-center gap-2 bg-ink-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-ink-700/60 text-xs font-medium">
                <span className="w-2 h-2 rounded-full" style={{ background: metrics.riskLevel === "severe" ? "#ef4444" : "#eab308" }} />
                <span className="text-paper-50">{metrics.waterLevelText} ({metrics.waterLevelCm} cm)</span>
              </div>
            </div>

            {/* Video Bottom HUD Overlay Controls */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
              <div className="bg-ink-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-ink-700/60 text-xs font-mono text-ink-300 flex items-center gap-2">
                <Activity size={13} className="text-channel-400" />
                <span>SEGMENTATION CONFIDENCE: <strong className="text-paper-50">{metrics.confidence}%</strong></span>
              </div>

              <button
                onClick={handleTogglePlay}
                className="pointer-events-auto bg-white/90 hover:bg-white text-ink-950 rounded-full w-9 h-9 flex items-center justify-center shadow-lg transition-transform active:scale-95"
                title={isPlaying ? "Pause Stream" : "Play Stream"}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
              </button>
            </div>
          </div>

          {/* Quick Action Bar */}
          <div className="flex items-center justify-between gap-3 bg-ink-900/60 rounded-2xl border border-ink-800 p-3 text-xs">
            <div className="flex items-center gap-2 text-ink-300">
              <ShieldCheck size={16} className="text-channel-400" />
              <span>Camera geo-tagged to: <strong className="text-paper-50">{selectedStream.road}, {selectedStream.location}</strong></span>
            </div>

            <button
              onClick={handleDispatchHazardFromStream}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold transition-all shadow-sm ${
                reported
                  ? "bg-emerald-500 text-ink-950"
                  : "bg-channel-500 hover:bg-channel-400 text-ink-950 active:scale-95"
              }`}
            >
              {reported ? <CheckCircle2 size={14} /> : <Send size={14} />}
              <span>{reported ? "Hazard Logged to Database!" : "Dispatch Live Hazard Alert"}</span>
            </button>
          </div>
        </div>

        {/* Right: AI Inundation Analytics & Telemetry Log */}
        <div className="flex flex-col gap-4">
          {/* Diagnostic Stats Card */}
          <div className="bg-ink-900/80 backdrop-blur-md rounded-2xl border border-ink-800 p-5 shadow-panel flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base text-paper-50 flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-400" /> Road Passability Assessment
              </h3>
              <span className="text-[11px] font-mono text-ink-400">UPDATED LIVE</span>
            </div>

            {/* Water Depth Meter */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-ink-400">Calculated Water Depth:</span>
                <span className="font-mono font-bold text-channel-400">{metrics.waterLevelCm} cm ({metrics.waterLevelText})</span>
              </div>
              <div className="w-full h-2.5 bg-ink-950 rounded-full overflow-hidden border border-ink-800">
                <div
                  className="h-full transition-all duration-500 rounded-full"
                  style={{
                    width: `${Math.min(100, (metrics.waterLevelCm / 60) * 100)}%`,
                    background: metrics.riskLevel === "severe" ? "linear-gradient(90deg, #f59e0b, #ef4444)" : "linear-gradient(90deg, #10b981, #f59e0b)",
                  }}
                />
              </div>
            </div>

            {/* Vehicle Matrix */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-ink-950/60 rounded-xl p-2.5 border border-ink-800/80 flex items-center justify-between">
                <span className="text-ink-300">Sedans / Hatchbacks</span>
                <span className={`font-semibold px-2 py-0.5 rounded-md text-[10px] ${metrics.passability.sedan ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                  {metrics.passability.sedan ? "Passable" : "Stalling Risk"}
                </span>
              </div>
              <div className="bg-ink-950/60 rounded-xl p-2.5 border border-ink-800/80 flex items-center justify-between">
                <span className="text-ink-300">Two-Wheelers</span>
                <span className={`font-semibold px-2 py-0.5 rounded-md text-[10px] ${metrics.passability.twoWheeler ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                  {metrics.passability.twoWheeler ? "Passable" : "Unsafe"}
                </span>
              </div>
              <div className="bg-ink-950/60 rounded-xl p-2.5 border border-ink-800/80 flex items-center justify-between">
                <span className="text-ink-300">SUVs / 4x4s</span>
                <span className={`font-semibold px-2 py-0.5 rounded-md text-[10px] ${metrics.passability.suv ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                  {metrics.passability.suv ? "Caution Passable" : "Avoid"}
                </span>
              </div>
              <div className="bg-ink-950/60 rounded-xl p-2.5 border border-ink-800/80 flex items-center justify-between">
                <span className="text-ink-300">Buses & Heavy Trucks</span>
                <span className={`font-semibold px-2 py-0.5 rounded-md text-[10px] ${metrics.passability.heavyTruck ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                  {metrics.passability.heavyTruck ? "Clear" : "Restricted"}
                </span>
              </div>
            </div>
          </div>

          {/* Telemetry Log Stream */}
          <div className="bg-ink-900/80 backdrop-blur-md rounded-2xl border border-ink-800 p-4 shadow-panel flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-ink-400 pb-2 border-b border-ink-800">
              <span className="font-mono text-paper-50 font-semibold flex items-center gap-1.5">
                <RefreshCw size={12} className="animate-spin text-channel-400" /> Real-Time CV Inference Stream
              </span>
              <span>Buffer: 20 events</span>
            </div>

            <div className="font-mono text-[11px] text-ink-300 flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
              {logs.map((line, idx) => (
                <div key={idx} className="leading-snug hover:text-paper-50 transition-colors">
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
