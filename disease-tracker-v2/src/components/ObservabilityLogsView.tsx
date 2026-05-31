import { useState } from "react";
import { 
  Database, 
  RefreshCw, 
  Terminal, 
  Cpu, 
  CheckCircle2, 
  Activity, 
  HelpCircle,
  FileText,
  AlertOctagon,
  Award
} from "lucide-react";
import { DataSource, EtlLog } from "../types";

interface ObservabilityLogsViewProps {
  sources: DataSource[];
  logs: EtlLog[];
  onTriggerEtl: () => Promise<void>;
  etlLoading: boolean;
}

export default function ObservabilityLogsView({
  sources,
  logs,
  onTriggerEtl,
  etlLoading
}: ObservabilityLogsViewProps) {
  const [logFilter, setLogFilter] = useState<string>("All");

  const filteredLogs = logs.filter(log => {
    if (logFilter === "All") return true;
    return log.stage === logFilter;
  });

  return (
    <div className="space-y-6" id="observability-viewport">
      
      {/* Intro section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-[#1A1A1A] font-sans flex items-center gap-2 uppercase italic">
            <Database className="w-6 h-6 text-[#FF5F1F]" />
            Pipeline Hub & Diagnostic Telemetry
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500">
            Source reliability scores, real-time scraping controllers, and ETL stage diagnostic logs.
          </p>
        </div>

        <button
          id="btn-observability-sync"
          onClick={onTriggerEtl}
          disabled={etlLoading}
          className={`art-btn-orange px-5 py-2.5 text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-[2.5px_2.5px_0px_#1A1A1A] cursor-pointer ${
            etlLoading ? "opacity-55 cursor-not-allowed shadow-[0px_0px]" : ""
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${etlLoading ? "animate-spin text-white" : ""}`} />
          {etlLoading ? "Extracting & Validating..." : "Execute Full ETL Pipeline"}
        </button>
      </div>

      {/* Trust scoreboard & diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left column: Source Trust Rating board */}
        <div className="lg:col-span-3 art-card p-5 bg-white space-y-4">
          <div className="border-b-2 border-dashed border-[#1A1A1A] pb-2">
            <h2 className="text-xs font-mono font-black text-[#FF5F1F] uppercase tracking-widest">Source Trust Scores & Robots.txt Compliance</h2>
          </div>

          <div className="space-y-3">
            {sources.map(src => {
              let scoreColor = "text-emerald-600";
              if (src.reliabilityScore < 85) scoreColor = "text-amber-600";
              
              return (
                <div 
                  key={src.id}
                  id={`source-score-${src.id}`}
                  className="p-4 rounded-lg border-2 border-[#1A1A1A] bg-[#FAF4EE] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left shadow-[2.5px_2.5px_0px_#1A1A1A]"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm text-[#1A1A1A] uppercase tracking-tight">{src.name}</span>
                      <span className="text-[9px] font-mono font-black bg-white text-[#FF5F1F] border border-[#1A1A1A] px-2 py-0.5 rounded shadow-[1px_1px_0_#1A1A1A]">
                        {src.type}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono italic font-bold">surveillance URL: {src.url}</p>
                    <p className="text-[10px] text-[#1A1A1A] font-mono font-bold uppercase mt-0.5">⚡ Node Status: <span className="text-emerald-700 underline font-black">{src.status}</span></p>
                  </div>

                  <div className="flex gap-4 items-center shrink-0">
                    <div className="text-center bg-white p-2 rounded border-2 border-[#1A1A1A] min-w-[75px] shadow-[1.5px_1.5px_0_#1A1A1A]">
                      <span className="text-[9px] font-mono text-slate-500 block uppercase font-black leading-none mb-1">Reliability</span>
                      <span className={`text-base font-mono font-black ${scoreColor}`}>{src.reliabilityScore}%</span>
                    </div>

                    <div className="text-center bg-white p-2 rounded border-2 border-[#1A1A1A] min-w-[75px] shadow-[1.5px_1.5px_0_#1A1A1A]">
                      <span className="text-[9px] font-mono text-slate-500 block uppercase font-black leading-none mb-1">Inherent</span>
                      <span className="text-base font-mono font-black text-[#FF5F1F]">{src.completenessScore}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Diagnostics & Speed dials */}
        <div className="bg-[#1A1A1A] text-white border-4 border-[#1A1A1A] rounded-2xl p-5 shadow-[6px_6px_0px_#1A1A1A] space-y-4 text-left">
          <div className="border-b-2 border-dashed border-[#FF5F1F]/45 pb-2 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#FF5F1F]" />
            <h2 className="font-sans font-black text-sm uppercase tracking-wide">System Observability</h2>
          </div>

          <div className="space-y-4 font-mono text-xs font-bold">
            <div className="p-3 bg-zinc-900 rounded border-2 border-[#1A1A1A] space-y-2 text-white">
              <div className="flex justify-between items-center text-[9px] uppercase font-black tracking-widest text-[#FF5F1F]">
                <span>Telemetry Ward</span>
                <span className="text-emerald-400 animate-pulse">● online</span>
              </div>
              <p className="text-xs">Uptime: 24h 51m</p>
              <p className="text-[11px] text-slate-400 leading-normal font-semibold">Active containment segments: 9 quarantine vectors active.</p>
            </div>

            {/* Simulated diagnostic metrics */}
            <div className="space-y-3 font-sans">
              <span className="text-[9px] font-mono uppercase font-black text-slate-400 tracking-widest block">robots exclusion audit</span>
              <div className="p-3 bg-zinc-900 border-2 border-[#1A1A1A] text-[10px] text-slate-300 rounded space-y-2 leading-tight font-sans font-semibold">
                <p>🚫 <strong className="text-white">Compliance:</strong> Strict exclusion check loops are run on World Health organization & CDC archives.</p>
                <p>⏱️ <strong className="text-white">Rate Limits:</strong> Safe 300ms pause handles are enforced during heavy payload scraping requests.</p>
              </div>
            </div>

            <div className="bg-[#FAF4EE] border-2 border-[#1A1A1A] text-[#1A1A1A] p-3 rounded flex items-start gap-1.5 font-sans shadow-[2px_2px_0px_#FF5F1F]">
              <Activity className="w-4 h-4 text-[#FF5F1F] shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-700 font-bold leading-normal">
                Prometheus scrapers are active on <code>/api/health</code> tracking server memory bounds.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* ETL Audit Log reader */}
      <div className="art-card p-5 bg-white text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-dashed border-[#1A1A1A] pb-3 mb-4 gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-[#1A1A1A] font-sans flex items-center gap-2 uppercase tracking-tight italic">
              <Terminal className="w-5 h-5 text-[#FF5F1F]" />
              ETL Audit Terminal & Logs
            </h2>
            <p className="text-xs font-semibold text-slate-500">Chronological pipeline progress records and data classifications</p>
          </div>

          {/* Filtering buttons */}
          <div className="flex gap-1.5 bg-white p-1 rounded-xl border-2 border-[#1A1A1A] text-xs self-start sm:self-auto font-mono overflow-x-auto shadow-[2px_2px_0px_#1A1A1A]">
            {["All", "Discovery", "Validation", "Scraping", "ETL Pipeline", "Warning Engine"].map(st => (
              <button
                key={st}
                onClick={() => setLogFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tight transition cursor-pointer ${
                  logFilter === st 
                    ? "bg-[#FF5F1F] text-white border border-[#1A1A1A] shadow-[1.5px_1.5px_0_#1A1A1A]" 
                    : "text-[#1A1A1A] hover:text-[#FF5F1F]"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Raw Log terminal window */}
        <div className="h-64 bg-zinc-950 text-slate-300 font-mono text-xs rounded border-4 border-[#1A1A1A] p-4 overflow-y-auto space-y-2 shadow-inner custom-scrollbar">
          {filteredLogs.map(log => {
            let badge = "text-indigo-400";
            if (log.stage === "Validation") badge = "text-teal-400";
            if (log.stage === "Warning Engine") badge = "text-amber-400";
            if (log.stage === "Scraping") badge = "text-rose-400";

            let lvlColor = "text-slate-500";
            if (log.level === "WARNING") lvlColor = "text-amber-500 font-bold";
            if (log.level === "ERROR") lvlColor = "text-rose-500 font-bold animate-pulse";

            return (
              <div key={log.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/5 pb-1.5 hover:bg-white/5 transition-colors gap-2">
                <div className="flex items-start sm:items-center gap-2 flex-wrap">
                  <span className="text-slate-500 text-[10px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  <span className={`text-[10px] uppercase font-bold ${badge}`}>[{log.stage}]</span>
                  <span className={lvlColor}>[{log.level}]</span>
                  <span className="text-slate-200 font-semibold">{log.message}</span>
                </div>
              </div>
            );
          })}

          {filteredLogs.length === 0 && (
            <div className="py-16 text-center text-slate-500 font-mono font-bold uppercase">
              ~ No logs found in selected classification segment ~
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
