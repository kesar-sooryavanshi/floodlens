import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import LiveIntelligence from "./pages/LiveIntelligence";
import RoadAccessibility from "./pages/RoadAccessibility";
import FloodAnalysis from "./pages/FloodAnalysis";
import SafeRoutes from "./pages/SafeRoutes";
import VideoStreamPage from "./pages/VideoStreamPage";
import CitizenHazards from "./pages/CitizenHazards";
import LocationSearch from "./components/LocationSearch";
import About from "./pages/About";
import OfflineIndicator from "./components/OfflineIndicator";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/live" element={<LiveIntelligence />} />
        <Route path="/roads" element={<RoadAccessibility />} />
        <Route path="/flood-analysis" element={<FloodAnalysis />} />
        <Route path="/routes" element={<SafeRoutes />} />
        <Route path="/video" element={<VideoStreamPage />} />
        <Route path="/hazards" element={<CitizenHazards />} />
        <Route path="/report" element={<CitizenHazards />} />
        <Route path="/search" element={<LocationSearch />} />
        <Route path="/how-it-works" element={<Landing />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <OfflineIndicator />
    </BrowserRouter>
  );
}
