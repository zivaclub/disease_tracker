import { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  MapPin, 
  AlertCircle, 
  Users, 
  Activity, 
  Heart, 
  Settings, 
  Search,
  ChevronRight,
  TrendingUp,
  Map
} from "lucide-react";
import { Outbreak } from "../types";

interface OutbreakMapViewProps {
  outbreaks: Outbreak[];
  onOpenReportForm: () => void;
}

export default function OutbreakMapView({ outbreaks, onOpenReportForm }: OutbreakMapViewProps) {
  const [selectedOb, setSelectedOb] = useState<Outbreak | null>(outbreaks[0] || null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Timeline Playback Widget State
  const [currentMonthIdx, setCurrentMonthIdx] = useState(2); // Starts at latest (May 2026)
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const months = [
    { label: "Jan 2026", limitDate: "2026-02-01" },
    { label: "Mar 2026", limitDate: "2026-04-01" },
    { label: "May 2026", limitDate: "2026-06-01" }
  ];

  // Filter Outbreaks according to timeline selected month and search input
  const activeTimelineOutbreaks = outbreaks.filter(ob => {
    const currentLimit = months[currentMonthIdx].limitDate;
    
    // Check if detected prior to or inside this limit date
    const matchesTimeline = ob.firstDetected <= currentLimit;
    
    const matchesSearch = ob.country.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ob.diseaseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ob.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTimeline && matchesSearch;
  });

  // Timeline Play Loop
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentMonthIdx(prev => (prev + 1) % months.length);
      }, 2000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  // SVG Coordinates Translator to Map Coordinates (Simulating mercator projection values)
  // Maps Lat/Long into an elegant responsive 800x400 map canvas
  const getMapCoordinates = (lat: number, lng: number) => {
    // Basic mercator-style mapping for display purposes
    const x = ((lng + 180) * 800) / 360;
    const y = (((-lat + 90) * 400) / 180) + 20; // Slight offset adaptation
    return { x: Math.min(780, Math.max(20, x)), y: Math.min(380, Math.max(20, y)) };
  };

  const handleSelectPointFromMap = (ob: Outbreak) => {
    setSelectedOb(ob);
  };

  return (
    <div className="space-y-6" id="map-radar-viewport">
      
      {/* Header and Add Alert controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-[#1A1A1A] font-sans flex items-center gap-2 uppercase italic">
            <Map className="w-6 h-6 text-[#FF5F1F]" />
            Outbreak Radar & Surveillance Grid
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500">
            Real-time visual map tracking active quarantine boundaries and local cases.
          </p>
        </div>

        <button
          id="btn-report-outbreak"
          onClick={onOpenReportForm}
          className="art-btn-orange px-5 py-2.5 text-xs font-bold shadow-[3px_3px_0px_#1A1A1A] self-start sm:self-auto cursor-pointer"
        >
          ➕ Report Local Spot Outbreak
        </button>
      </div>

      {/* Main Grid: Map canvas & Sidebar detail */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* SVG World Map + Timeline controls */}
        <div className="lg:col-span-3 bg-slate-900 border-4 border-[#1A1A1A] rounded-2xl p-5 text-white flex flex-col justify-between relative shadow-[6px_6px_0px_#1A1A1A] min-h-[440px]">
          
          <div className="flex items-center justify-between mb-4 z-10">
            {/* Search filter map inside */}
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-400" />
              <input
                id="search-map"
                type="text"
                placeholder="Search map country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 text-xs border-2 border-[#1A1A1A] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5F1F]"
              />
            </div>
            
            <div className="text-[10px] bg-slate-950 border-2 border-[#1A1A1A] px-3 py-1.5 rounded-lg font-mono text-slate-300 font-bold">
              ⚡ RADAR INDEX: <span className="text-[#FF5F1F] font-black">{activeTimelineOutbreaks.length} ACTIVE CLUSTERS</span>
            </div>
          </div>

          {/* SVG Map representing Earth outlines */}
          <div className="w-full h-[280px] bg-slate-950/90 rounded-xl relative border-2 border-[#1A1A1A] overflow-hidden">
            {/* Simple geographic backdrop lines for aesthetic depth */}
            <svg 
              viewBox="0 0 800 400" 
              className="w-full h-full stroke-slate-800/20 font-sans fill-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Lat/Long Gridlines */}
              <line x1="100" y1="0" x2="100" y2="400" />
              <line x1="200" y1="0" x2="200" y2="400" />
              <line x1="300" y1="0" x2="300" y2="400" />
              <line x1="400" y1="0" x2="400" y2="400" />
              <line x1="500" y1="0" x2="500" y2="400" />
              <line x1="600" y1="0" x2="600" y2="400" />
              <line x1="700" y1="0" x2="700" y2="400" />
              <line x1="0" y1="100" x2="800" y2="100" />
              <line x1="0" y1="200" x2="800" y2="200" strokeDasharray="3" /> {/* Equator */}
              <line x1="0" y1="300" x2="800" y2="300" />

              {/* Simulated Continental Bounds (Very basic low-res geometric representations to look high-tech/clean) */}
              {/* North America */}
              <path d="M 120 80 L 160 50 L 220 70 L 260 120 L 180 180 L 140 160 Z" fill="#252423" opacity="0.8" stroke="#1A1A1A" strokeWidth="2" />
              {/* South America */}
              <path d="M 230 190 L 270 210 L 300 240 L 260 360 L 220 340 L 210 240 Z" fill="#252423" opacity="0.8" stroke="#1A1A1A" strokeWidth="2" />
              {/* Eurasia */}
              <path d="M 380 40 L 520 30 L 720 50 L 760 120 L 640 180 L 580 150 L 500 160 L 400 130 Z" fill="#252423" opacity="0.8" stroke="#1A1A1A" strokeWidth="2" />
              {/* Africa */}
              <path d="M 390 150 L 480 140 L 510 190 L 460 320 L 410 240 L 370 190 Z" fill="#252423" opacity="0.8" stroke="#1A1A1A" strokeWidth="2" />
              {/* Australia */}
              <path d="M 680 260 L 750 250 L 760 300 L 700 320 Z" fill="#252423" opacity="0.8" stroke="#1A1A1A" strokeWidth="2" />

              {/* Equator Text Indicator */}
              <text x="710" y="195" fill="#475569" fontSize="10" fontFamily="monospace">Equator 0°</text>

              {/* Active Outbreaks Hotspots Layer */}
              {activeTimelineOutbreaks.map((ob, idx) => {
                const { x, y } = getMapCoordinates(ob.latitude, ob.longitude);
                
                // Risk color mapping
                let markerBg = "#f43f5e"; // Critical/High
                let strokeColor = "#ffffff";
                if (ob.riskLevel === "Medium") {
                  markerBg = "#f59e0b";
                } else if (ob.riskLevel === "Low") {
                  markerBg = "#10b981";
                }

                const isSelected = selectedOb?.id === ob.id;

                return (
                  <g 
                    key={idx} 
                    className="cursor-pointer group"
                    onClick={() => handleSelectPointFromMap(ob)}
                  >
                    {/* Ring Pulse for alerts */}
                    <circle 
                      cx={x} 
                      cy={y} 
                      r={isSelected ? "16" : "9"} 
                      fill={markerBg} 
                      opacity={isSelected ? "0.4" : "0.25"}
                      className={ob.riskLevel === "Critical" ? "animate-pulse" : ""}
                    />
                    {/* Solid Center */}
                    <circle 
                      cx={x} 
                      cy={y} 
                      r={isSelected ? "8" : "5.5"} 
                      fill={markerBg} 
                      stroke={strokeColor} 
                      strokeWidth="2"
                    />
                    {/* Hover text flag */}
                    <text 
                      x={x + 12} 
                      y={y + 4} 
                      fill="#ffffff" 
                      fontSize="9" 
                      fontWeight="black" 
                      fontFamily="monospace"
                      className="hidden group-hover:block pointer-events-none bg-slate-950"
                    >
                      {ob.country} ({ob.diseaseId.toUpperCase()})
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Custom child instructions overlay */}
            <div className="absolute bottom-4 left-4 p-2.5 bg-slate-950/90 rounded-lg border-2 border-[#1A1A1A] text-[9.5px] text-slate-300 max-w-xs font-mono font-bold">
              🔵 <span className="text-[#FF5F1F]">RADAR TIP:</span> Click/tap any colored beacon dot on the grid system to display telemetry containment vectors in the side ledger.
            </div>
          </div>

          {/* Timeline Playback Dashboard Area */}
          <div className="border-t-2 border-dashed border-[#1A1A1A] pt-4 flex flex-col sm:flex-row items-center gap-4 z-10 bg-slate-900 mt-4">
            <div className="flex items-center gap-2">
              <button
                id="btn-timeline-play"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-3 bg-[#FF5F1F] hover:bg-[#ff7137] border-2 border-[#1A1A1A] rounded-full text-white transition focus:outline-none cursor-pointer shadow-[2px_2px_0px_#1A1A1A]"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
              </button>
              
              <div>
                <span className="text-xs font-black font-sans uppercase block leading-none text-white tracking-widest">Surveillance Playback Loop</span>
                <span className="text-[9px] font-mono font-bold text-[#FF5F1F] uppercase mt-0.5 tracking-wider block">Spatiotemporal Progression</span>
              </div>
            </div>

            {/* Timeline Progress row buttons */}
            <div className="flex-1 w-full grid grid-cols-3 gap-2">
              {months.map((m, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentMonthIdx(idx);
                    setIsPlaying(false);
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-black font-mono transition text-center border-2 cursor-pointer ${
                    currentMonthIdx === idx 
                      ? "bg-[#FF5F1F] text-white border-[#1A1A1A] shadow-[2px_2px_0px_white]" 
                      : "bg-slate-950 text-slate-400 border-[#1A1A1A] hover:bg-slate-850 hover:text-white"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Sidebar displaying details of selected point */}
        <div className="art-card p-5 text-left flex flex-col justify-between bg-white relative">
          
          <div className="space-y-4">
            <div className="border-b-2 border-[#1A1A1A] pb-3">
              <h2 className="text-xs font-mono font-black text-[#FF5F1F] uppercase flex items-center gap-1">
                <MapPin className="w-4 h-4 text-[#FF5F1F]" /> ZONE INTELLIGENCE
              </h2>
              <p className="text-[10px] text-slate-500 font-mono font-bold uppercase mt-0.5">Active field telemetry</p>
            </div>

            {selectedOb ? (
              <div id="ob-detail-sidebar" className="space-y-4">
                <div className="space-y-1 bg-[#FAF4EE] p-3 rounded-lg border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
                  <span className="text-[9px] uppercase font-mono font-black text-[#FF5F1F]">Surveillance Node</span>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base text-[#1A1A1A] tracking-tight uppercase italic">{selectedOb.diseaseName}</span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg space-y-2 border-2 border-[#1A1A1A] font-mono text-xs font-bold shadow-[2px_2px_0px_#1A1A1A]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Region/Country:</span>
                    <span className="text-[#1A1A1A]">{selectedOb.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Isolation Ward:</span>
                    <span className="text-[#1A1A1A]">{selectedOb.city}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Threat Priority:</span>
                    <span className={`font-black uppercase text-[10px] px-2 py-0.5 rounded border-2 border-[#1A1A1A] ${
                      selectedOb.riskLevel === "Critical" ? "bg-rose-100 text-rose-800 border-rose-650" :
                      selectedOb.riskLevel === "High" ? "bg-amber-100 text-amber-800 border-amber-650" :
                      "bg-emerald-100 text-emerald-800 border-emerald-650"
                    }`}>{selectedOb.riskLevel}</span>
                  </div>
                </div>

                {/* Patient tallies widget */}
                <div className="space-y-2 pt-2">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-[#1A1A1A] font-bold block">SURVEILLANCE BIOMETRICS</span>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <div className="bg-rose-50 p-2.5 rounded-lg border-2 border-[#1A1A1A] flex items-center justify-between shadow-[2px_2px_0px_#1A1A1A]">
                      <span className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5 uppercase">
                        <Users className="w-3.5 h-3.5 text-rose-600" /> Active Sick:
                      </span>
                      <span className="font-mono text-sm font-black text-rose-700">{selectedOb.cases.toLocaleString()}</span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-lg border-2 border-[#1A1A1A] flex items-center justify-between shadow-[2px_2px_0px_#1A1A1A]">
                      <span className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5 uppercase">
                        <AlertCircle className="w-3.5 h-3.5 text-slate-500" /> Fatalities:
                      </span>
                      <span className="font-mono text-sm font-black text-slate-700">{selectedOb.deaths.toLocaleString()}</span>
                    </div>

                    <div className="bg-emerald-50 p-2.5 rounded-lg border-2 border-[#1A1A1A] flex items-center justify-between shadow-[2px_2px_0px_#1A1A1A]">
                      <span className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5 uppercase">
                        <Heart className="w-3.5 h-3.5 text-emerald-600" /> Recovered:
                      </span>
                      <span className="font-mono text-sm font-black text-emerald-700">{selectedOb.recovered.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="text-[9px] text-slate-400 font-mono font-bold leading-tight uppercase pt-1">
                  🗒️ FIRST FLAG: {selectedOb.firstDetected} / LAST SYNC: {selectedOb.lastUpdated}.
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-xl border-2 border-dashed border-[#1A1A1A]">
                <MapPin className="w-8 h-8 mx-auto stroke-1 text-slate-400 animate-pulse" />
                <p className="text-xs font-bold mt-2 uppercase">Tap radar beacon beacon on timeline vector</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t-2 border-dashed border-[#1A1A1A] space-y-2 mt-4">
            <div className="bg-[#FAF4EE] p-3 rounded-lg border border-[#1A1A1A] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#FF5F1F] shrink-0" />
              <div className="text-[10px] text-slate-600 leading-normal font-sans font-bold">
                Spatiotemporal loops indicate periodic micro outbreak movements standard from winter peaks down into humid summer spans.
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
