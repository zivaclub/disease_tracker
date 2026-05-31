import React, { useState } from "react";
import { X, Globe, Landmark, AlertTriangle } from "lucide-react";
import { Disease } from "../types";

interface ReportOutbreakModalProps {
  diseases: Disease[];
  onClose: () => void;
  onSubmit: (params: {
    diseaseId: string;
    country: string;
    region: string;
    city: string;
    cases: number;
    deaths: number;
    recovered: number;
    latitude: number;
    longitude: number;
    riskLevel: "Low" | "Medium" | "High" | "Critical";
  }) => Promise<void>;
}

export default function ReportOutbreakModal({
  diseases,
  onClose,
  onSubmit
}: ReportOutbreakModalProps) {
  const [diseaseId, setDiseaseId] = useState(diseases[0]?.id || "");
  const [country, setCountry] = useState("Brazil");
  const [region, setRegion] = useState("Sao Paulo");
  const [city, setCity] = useState("Urban Core");
  const [cases, setCases] = useState(120);
  const [deaths, setDeaths] = useState(2);
  const [recovered, setRecovered] = useState(100);
  
  // Lat/Long mapping defaults
  const [latitude, setLatitude] = useState(-23.5505);
  const [longitude, setLongitude] = useState(-46.6333);
  
  const [riskLevel, setRiskLevel] = useState<"Low" | "Medium" | "High" | "Critical">("High");
  const [submitting, setSubmitting] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        diseaseId,
        country,
        region,
        city,
        cases,
        deaths,
        recovered,
        latitude,
        longitude,
        riskLevel
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-[8px_8px_0px_#1A1A1A] overflow-hidden border-4 border-[#1A1A1A] flex flex-col text-[#1A1A1A]">
        
        {/* Banner */}
        <div className="bg-[#1A1A1A] text-white p-5 text-left flex items-center justify-between border-b-4 border-[#1A1A1A]">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#FF5F1F] animate-pulse" />
            <h2 className="font-black font-sans text-xs sm:text-sm uppercase tracking-wider">Report Outbreak Station</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 px-2.5 bg-white text-[#1A1A1A] hover:bg-[#FF5F1F] hover:text-white rounded border-2 border-transparent hover:border-[#1A1A1A] font-mono font-black text-xs transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Inputs */}
        <form onSubmit={handleFormSubmit} className="p-5 overflow-y-auto space-y-4 text-left text-xs sm:text-sm font-sans max-h-[85vh]">
          
          <div className="space-y-1">
            <label className="text-[9px] uppercase font-mono text-[#1A1A1A] font-black block tracking-wider">Assessed Pathogen Type</label>
            <select
              value={diseaseId}
              onChange={(e) => setDiseaseId(e.target.value)}
              className="w-full text-xs p-2.5 bg-white border-2 border-[#1A1A1A] rounded-lg font-bold focus:outline-none focus:border-[#FF5F1F]"
            >
              {diseases.map(d => (
                <option key={d.id} value={d.id} className="font-semibold text-slate-800">{d.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-mono text-[#1A1A1A] font-black block tracking-wider">Country Name</label>
              <input
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full text-xs p-2 bg-white border-2 border-[#1A1A1A] rounded-lg focus:outline-none font-bold text-[#1A1A1A]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase font-mono text-[#1A1A1A] font-black block tracking-wider">Region/State</label>
              <input
                type="text"
                required
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full text-xs p-2 bg-white border-2 border-[#1A1A1A] rounded-lg focus:outline-none font-bold text-[#1A1A1A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-mono text-[#1A1A1A] font-black block tracking-wider">Active Cases</label>
              <input
                type="number"
                required
                min="0"
                value={cases}
                onChange={(e) => setCases(Number(e.target.value))}
                className="w-full text-xs p-2 bg-white border-2 border-[#1A1A1A] rounded-lg focus:outline-none font-mono font-black"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase font-mono text-[#1A1A1A] font-black block tracking-wider">Deaths Registered</label>
              <input
                type="number"
                required
                min="0"
                value={deaths}
                onChange={(e) => setDeaths(Number(e.target.value))}
                className="w-full text-xs p-2 bg-white border-2 border-[#1A1A1A] rounded-lg focus:outline-none font-mono font-black text-rose-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase font-mono text-[#1A1A1A] font-black block tracking-wider">Recovered Citizens</label>
              <input
                type="number"
                required
                min="0"
                value={recovered}
                onChange={(e) => setRecovered(Number(e.target.value))}
                className="w-full text-xs p-2 bg-white border-2 border-[#1A1A1A] rounded-lg focus:outline-none font-mono font-black text-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pb-2 border-b-2 border-dashed border-[#1A1A1A]">
            <div className="space-y-1 text-left">
              <label className="text-[9px] uppercase font-mono text-[#1A1A1A] font-black block tracking-wider">Latitude Coordinate</label>
              <input
                type="number"
                step="any"
                required
                value={latitude}
                onChange={(e) => setLatitude(Number(e.target.value))}
                className="w-full text-xs p-2 bg-white border-2 border-[#1A1A1A] rounded-lg focus:outline-none font-mono font-bold"
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="text-[9px] uppercase font-mono text-[#1A1A1A] font-black block tracking-wider">Longitude Coordinate</label>
              <input
                type="number"
                step="any"
                required
                value={longitude}
                onChange={(e) => setLongitude(Number(e.target.value))}
                className="w-full text-xs p-2 bg-white border-2 border-[#1A1A1A] rounded-lg focus:outline-none font-mono font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] uppercase font-mono text-[#1A1A1A] font-black block tracking-wider">Assessed Warning Level</label>
            <div className="grid grid-cols-4 gap-2">
              {(["Low", "Medium", "High", "Critical"] as const).map(lvl => {
                const isActive = riskLevel === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setRiskLevel(lvl)}
                    className={`py-2 border-2 border-[#1A1A1A] text-[10px] font-mono font-black uppercase select-none transition text-center cursor-pointer ${
                      isActive
                        ? lvl === "Critical" 
                          ? "bg-rose-600 text-white shadow-[2px_2px_0px_#1A1A1A]"
                          : lvl === "High"
                            ? "bg-[#FF5F1F] text-white shadow-[2px_2px_0px_#1A1A1A]"
                            : lvl === "Medium"
                              ? "bg-amber-400 text-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]"
                              : "bg-emerald-500 text-white shadow-[2px_2px_0px_#1A1A1A]"
                        : "bg-white text-[#1A1A1A] hover:bg-slate-50 shadow-none hover:shadow-[1px_1px_0px_#1A1A1A]"
                    }`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full py-3 bg-[#FF5F1F] border-4 border-[#1A1A1A] hover:bg-[#ff723b] text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-[4px_4px_0_#1A1A1A] hover:shadow-[2px_2px_0_#1A1A1A] hover:translate-y-[2px] cursor-pointer transition duration-100"
          >
            {submitting ? "Publishing to Central Database..." : "Publish Surveillance Record"}
          </button>

        </form>

      </div>
    </div>
  );
}
