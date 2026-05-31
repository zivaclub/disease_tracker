import { useState } from "react";
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  Globe, 
  Play, 
  RefreshCw, 
  Sparkles, 
  TrendingUp, 
  Heart, 
  UserCheck 
} from "lucide-react";
import { Outbreak, DiseaseAlert, Disease } from "../types";

interface DashboardViewProps {
  outbreaks: Outbreak[];
  alerts: DiseaseAlert[];
  diseases: Disease[];
  onTriggerEtl: () => Promise<void>;
  etlLoading: boolean;
  onNavigateToTab: (tab: string) => void;
}

export default function DashboardView({
  outbreaks,
  alerts,
  diseases,
  onTriggerEtl,
  etlLoading,
  onNavigateToTab
}: DashboardViewProps) {
  const [metricHovered, setMetricHovered] = useState<string | null>(null);

  // Calculate Metrics
  const activeOutbreaks = outbreaks.filter(o => o.active);
  const totalCases = activeOutbreaks.reduce((acc, curr) => acc + curr.cases, 0);
  const totalDeaths = activeOutbreaks.reduce((acc, curr) => acc + curr.deaths, 0);
  const totalRecoveries = activeOutbreaks.reduce((acc, curr) => acc + curr.recovered, 0);
  
  const affectedCountries = Array.from(new Set(activeOutbreaks.map(o => o.country)));
  const criticalAlertsCount = alerts.filter(a => a.level === "Critical" && !a.isRead).length;
  const vaccinesAvailable = diseases.filter(d => d.vaccinationAvailable).length;

  // Group outbreaks by disease for the distribution graph
  const diseaseBreakdown = diseases.map(dis => {
    const disOutbreaks = activeOutbreaks.filter(o => o.diseaseId === dis.id);
    const cases = disOutbreaks.reduce((acc, curr) => acc + curr.cases, 0);
    return {
      name: dis.name.split(" (")[0],
      cases,
      type: dis.type,
      color: dis.type === "Virus" ? "bg-rose-500" : dis.type === "Bacteria" ? "bg-amber-500" : "bg-teal-500"
    };
  }).filter(d => d.cases > 0).sort((a, b) => b.cases - a.cases);

  const maxCases = Math.max(...diseaseBreakdown.map(d => d.cases), 1);

  return (
    <div className="space-y-6" id="dashboard-container">
      {/* Welcome Banner */}
      <div className="bg-[#FF5F1F] text-white border-4 border-[#1A1A1A] rounded-3xl p-6 shadow-[6px_6px_0px_#1A1A1A] relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="absolute inset-0 bg-[radial-gradient(#1A1A1A_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white border border-[#1A1A1A] px-3 py-1 rounded text-[10px] font-mono font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5F1F] fill-[#FF5F1F]" />
            Epidemiology Central Hub
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold font-sans tracking-tighter leading-none text-white uppercase italic">
            Let's safeguard our world from bugs!
          </h1>
          <p className="text-sm md:text-base font-medium text-white/95 max-w-xl">
            Pathogens are microscopic, but we can map them, study their symptoms, 
            and learn standard defense shields like bubbles of soap and vaccinations!
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              id="btn-explore-diseases"
              onClick={() => onNavigateToTab("explorer")}
              className="px-5 py-2.5 bg-white text-[#1A1A1A] border-2 border-[#1A1A1A] rounded-xl text-xs font-black tracking-wider uppercase transition shadow-[3px_3px_0px_#1A1A1A] hover:bg-[#FAF4EE] hover:translate-y-[-1px] cursor-pointer"
            >
              Meet the Diseases
            </button>
            <button
              id="btn-view-map"
              onClick={() => onNavigateToTab("map")}
              className="px-5 py-2.5 bg-[#1A1A1A] text-white border-2 border-[#1A1A1A] rounded-xl text-xs font-black tracking-wider uppercase transition shadow-[3px_3px_0px_rgba(255,255,255,0.2)] hover:bg-[#2A2A2A] hover:translate-y-[-1px] cursor-pointer"
            >
              Interactive Radar Map
            </button>
          </div>
        </div>

        {/* Big elegant icon badge */}
        <div className="hidden md:block p-4 bg-white border-4 border-[#1A1A1A] rounded-2xl rotate-3 shadow-[4px_4px_0_#1A1A1A] shrink-0">
          <Shield className="w-12 h-12 text-[#FF5F1F] stroke-[2.5]" />
        </div>
      </div>

      {/* Primary Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div
          id="metric-cases"
          onMouseEnter={() => setMetricHovered("cases")}
          onMouseLeave={() => setMetricHovered(null)}
          className={`art-card p-5 bg-white relative overflow-hidden group ${metricHovered === "cases" ? "translate-y-[-2px] !shadow-[6px_6px_0px_#1A1A1A]" : ""}`}
        >
          <div className="flex items-center justify-between mb-3 border-b-2 border-dashed border-[#1A1A1A] pb-2">
            <span className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">Active Sick Cases</span>
            <div className="p-1.5 bg-rose-500 text-white rounded border border-[#1A1A1A]">
              <Activity className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div className="space-y-1 pt-1">
            <h3 className="text-4xl font-extrabold tracking-tighter text-[#1A1A1A] font-sans">
              {totalCases.toLocaleString()}
            </h3>
            <p className="text-[10px] font-mono text-rose-600 font-bold flex items-center gap-1 uppercase">
              ● Live transmission data
            </p>
          </div>
        </div>

        {/* Metric 2 */}
        <div
          id="metric-countries"
          onMouseEnter={() => setMetricHovered("countries")}
          onMouseLeave={() => setMetricHovered(null)}
          className={`art-card p-5 bg-white relative overflow-hidden group ${metricHovered === "countries" ? "translate-y-[-2px] !shadow-[6px_6px_0px_#1A1A1A]" : ""}`}
        >
          <div className="flex items-center justify-between mb-3 border-b-2 border-dashed border-[#1A1A1A] pb-2">
            <span className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">Affected Regions</span>
            <div className="p-1.5 bg-[#FF5F1F] text-white rounded border border-[#1A1A1A]">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1 pt-1">
            <h3 className="text-4xl font-extrabold tracking-tighter text-[#1A1A1A] font-sans">
              {affectedCountries.length}
            </h3>
            <p className="text-[10px] font-mono text-slate-500 font-bold uppercase">
              Global surveillance nodes
            </p>
          </div>
        </div>

        {/* Metric 3 */}
        <div
          id="metric-shields"
          onMouseEnter={() => setMetricHovered("shields")}
          onMouseLeave={() => setMetricHovered(null)}
          className={`art-card p-5 bg-white relative overflow-hidden group ${metricHovered === "shields" ? "translate-y-[-2px] !shadow-[6px_6px_0px_#1A1A1A]" : ""}`}
        >
          <div className="flex items-center justify-between mb-3 border-b-2 border-dashed border-[#1A1A1A] pb-2">
            <span className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">Vaccine Barriers</span>
            <div className="p-1.5 bg-emerald-500 text-white rounded border border-[#1A1A1A]">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1 pt-1">
            <h3 className="text-4xl font-extrabold tracking-tighter text-[#1A1A1A] font-sans">
              {vaccinesAvailable} / {diseases.length}
            </h3>
            <p className="text-[10px] font-mono text-emerald-600 font-bold uppercase">
              With medical shields
            </p>
          </div>
        </div>

        {/* Metric 4 */}
        <div
          id="metric-alerts"
          onMouseEnter={() => setMetricHovered("alerts")}
          onMouseLeave={() => setMetricHovered(null)}
          className={`art-card p-5 bg-white relative overflow-hidden group ${metricHovered === "alerts" ? "translate-y-[-2px] !shadow-[6px_6px_0px_#1A1A1A]" : ""}`}
        >
          <div className="flex items-center justify-between mb-3 border-b-2 border-dashed border-[#1A1A1A] pb-2">
            <span className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">Critical Warnings</span>
            <div className={`p-1.5 rounded border border-[#1A1A1A] ${criticalAlertsCount > 0 ? "bg-amber-500 text-white animate-bounce" : "bg-slate-200 text-slate-600"}`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1 pt-1">
            <h3 className="text-4xl font-extrabold tracking-tighter text-[#1A1A1A] font-sans">
              {criticalAlertsCount}
            </h3>
            <p className="text-[10px] font-mono text-amber-600 font-bold uppercase">
              Emergency containments
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Disease Stats Chart & Live Warnings Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Disease Cases distribution (Tall Chart) */}
        <div className="lg:col-span-2 art-card p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[#1A1A1A] pb-3 gap-2">
            <div>
              <h2 className="text-xl font-extrabold text-[#1A1A1A] font-sans flex items-center gap-2 uppercase tracking-tight">
                <Shield className="w-5 h-5 text-[#FF5F1F]" />
                GLOBAL OUTBREAKS BREAKDOWN
              </h2>
              <p className="text-xs text-slate-500 font-medium">Total registered cases sorted by pathogen type</p>
            </div>
            <div className="flex items-center gap-2.5 text-[9px] font-mono text-[#1A1A1A] font-bold">
              <span className="px-1.5 py-0.2 bg-rose-500 border border-[#1A1A1A] text-white rounded">VIRUS</span>
              <span className="px-1.5 py-0.2 bg-amber-500 border border-[#1A1A1A] text-white rounded">BACTERIA</span>
              <span className="px-1.5 py-0.2 bg-teal-500 border border-[#1A1A1A] text-white rounded">PARASITE</span>
            </div>
          </div>

          <div className="space-y-4 pt-1">
            {diseaseBreakdown.map((item, idx) => {
              const percentage = (item.cases / maxCases) * 100;
              return (
                <div key={idx} className="space-y-1.5" id={`chart-row-${item.name.toLowerCase()}`}>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#1A1A1A] flex items-center gap-2">
                      <span className="font-mono text-[9px] px-1 bg-[#FAF4EE] border border-[#1A1A1A] rounded">0{idx + 1}</span>
                      {item.name}
                    </span>
                    <span className="font-mono font-extrabold text-[#1A1A1A] bg-[#FAF4EE] border border-[#1A1A1A] px-2.5 py-0.5 rounded-full shadow-[1px_1px_0px_#1A1A1A]">
                      {item.cases.toLocaleString()} cases
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-4 border-2 border-[#1A1A1A] rounded p-[1px] overflow-hidden">
                    <div 
                      className={`h-full rounded-sm transition-all duration-1000 border-r border-[#1A1A1A] ${item.color}`}
                      style={{ width: `${Math.max(3, percentage)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}

            {diseaseBreakdown.length === 0 && (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Globe className="w-8 h-8 mx-auto stroke-1" />
                <p className="text-sm">No active disease cases loaded. Run the ETL pipeline to sync nodes.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Operations & Warnings */}
        <div className="art-card p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b-2 border-[#1A1A1A] pb-3">
              <h2 className="text-xl font-extrabold text-[#1A1A1A] font-sans flex items-center gap-2 uppercase tracking-tight">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                SURVEILLANCE RADAR
              </h2>
              <p className="text-xs text-slate-500 font-medium">Threat vectors recorded from health bulletins</p>
            </div>

            <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
              {alerts.slice(0, 3).map((item, idx) => (
                <div 
                  key={idx} 
                  id={`alert-card-${item.id}`}
                  className={`p-3 rounded-xl border-2 border-[#1A1A1A] flex items-start gap-3 transition-colors ${
                    item.level === "Critical" 
                      ? "bg-rose-50 text-rose-950" 
                      : item.level === "High" 
                      ? "bg-amber-50 text-amber-950" 
                      : "bg-slate-50 text-slate-800"
                  }`}
                >
                  <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${item.level === "Critical" ? "text-rose-500" : "text-amber-500"}`} />
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-xs">{item.diseaseName}</span>
                      <span className={`text-[8px] font-mono font-extrabold uppercase px-1.5 py-0.2 rounded border ${
                        item.level === "Critical" ? "bg-rose-200 border-rose-400 text-rose-800" : "bg-amber-100 border-amber-400 text-amber-800"
                      }`}>{item.level}</span>
                    </div>
                    <p className="text-[10px] leading-tight text-slate-600 font-medium">{item.message}</p>
                  </div>
                </div>
              ))}

              {alerts.length === 0 && (
                <div className="py-8 text-center text-slate-400">
                  <UserCheck className="w-8 h-8 text-slate-200 mx-auto mb-1" />
                  <p className="text-xs font-mono">Surveillance quiet. All systems clear.</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t-2 border-dashed border-[#1A1A1A] space-y-3 mt-4">
            <div className="bg-orange-50 p-3 rounded-lg border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
              <span className="text-[9px] font-mono font-bold text-[#FF5F1F] uppercase block mb-1">Ethical Scraping Protocol</span>
              <p className="text-[10px] text-slate-700 font-medium leading-tight">
                Our scrapper system pulls WHO feeds & CDCs, verifying reliability indices under strict robots guidelines.
              </p>
            </div>
            <button
              id="btn-run-etl"
              onClick={onTriggerEtl}
              disabled={etlLoading}
              className={`w-full art-btn-orange py-3 px-4 text-xs font-bold flex items-center justify-center gap-2 ${
                etlLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${etlLoading ? "animate-spin" : ""}`} />
              {etlLoading ? "EXECUTING SCRAPING & ETL..." : "SYNC LIVE OUTBREAKS NOW"}
            </button>
          </div>
        </div>
      </div>

      {/* Stay Safe Today CTA Framework */}
      <div className="bg-white border-4 border-[#1A1A1A] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[6px_6px_0px_#1A1A1A] relative overflow-hidden" id="stay-safe-banner">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5F1F]/5 rounded-full pointer-events-none"></div>
        <div className="space-y-3 max-w-xl text-center md:text-left relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 border-2 border-emerald-600 text-emerald-800 px-3 py-1 rounded text-xs font-mono font-bold">
            <Heart className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
            STAY SAFE TODAY
          </div>
          <h2 className="text-2xl font-extrabold font-sans text-[#1A1A1A] uppercase italic">
            BE A PUBLIC SURVEILLANCE PROTECTOR!
          </h2>
          <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
            You don't need clean scalpels to save active lives! Simple public sanitation like generating 
            soapy water bubbles, coughing inside elbows, and tracking immunizations shields the entire neighborhood block!
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full md:w-auto shrink-0 relative z-10">
          <button 
            id="cta-handwash"
            onClick={() => onNavigateToTab("vaccines")}
            className="p-4 bg-white hover:bg-slate-50 border-2 border-[#1A1A1A] rounded-2xl text-center shadow-[3px_3px_0px_#1A1A1A] hover:translate-y-[-1px] transition cursor-pointer group"
          >
            <Shield className="w-6 h-6 text-[#FF5F1F] mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="block text-xs font-black text-[#1A1A1A] uppercase tracking-tight">Active Shields</span>
            <span className="text-[9px] text-slate-500 font-mono font-bold uppercase leading-none block mt-1">Doses Guide</span>
          </button>
          <button 
            id="cta-risk-predictor"
            onClick={() => onNavigateToTab("alerts")}
            className="p-4 bg-white hover:bg-[#FAF4EE] border-2 border-[#1A1A1A] rounded-2xl text-center shadow-[3px_3px_0px_#1A1A1A] hover:translate-y-[-1px] transition cursor-pointer group"
          >
            <Sparkles className="w-6 h-6 text-emerald-600 mx-auto mb-2 group-hover:scale-110 transition-transform animate-bounce" />
            <span className="block text-xs font-black text-[#1A1A1A] uppercase tracking-tight">AI Warning list</span>
            <span className="text-[9px] text-slate-500 font-mono font-bold uppercase leading-none block mt-1">Live AI Alerts</span>
          </button>
        </div>
      </div>
    </div>
  );
}
