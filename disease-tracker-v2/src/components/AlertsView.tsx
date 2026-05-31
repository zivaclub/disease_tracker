import React, { useState } from "react";
import { 
  AlertTriangle, 
  Sparkles, 
  ShieldCheck, 
  Trash2, 
  User, 
  Globe, 
  MapPin, 
  Compass, 
  CheckCircle,
  HelpCircle
} from "lucide-react";
import { DiseaseAlert } from "../types";

interface AlertsViewProps {
  alerts: DiseaseAlert[];
  onResolveAlert: (id: string) => Promise<void>;
}

export default function AlertsView({ alerts, onResolveAlert }: AlertsViewProps) {
  const [activeSeverity, setActiveSeverity] = useState<string>("All");

  // AI Risk Predictor state
  const [targetCountry, setTargetCountry] = useState("India");
  const [userAge, setUserAge] = useState("10");
  const [playgroundHabits, setPlaygroundHabits] = useState("I play soccer on mud and sometimes forget to wash hands before biscuit breaks.");
  
  const [predictLoading, setPredictLoading] = useState(false);
  const [riskScorecard, setRiskScorecard] = useState<{
    riskLevel: "Low" | "Medium" | "High";
    explanation: string;
    actionSteps: string[];
  } | null>(null);

  const handlePredictLocalRisk = async (e: React.FormEvent) => {
    e.preventDefault();
    setPredictLoading(true);
    setRiskScorecard(null);

    try {
      const res = await fetch("/api/ai/predict-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: targetCountry,
          age: Number(userAge),
          habits: playgroundHabits
        })
      });
      const data = await res.json();
      setRiskScorecard(data);
    } catch (err) {
      // Offline fallback
      setRiskScorecard({
        riskLevel: "Low",
        explanation: `Unable to query AI. Our standard baseline report suggests that ${targetCountry} playgrounds have moderate safety. Soap remains your best shield!`,
        actionSteps: [
          "Wash fingers with soapy bubble clouds before eating cookies.",
          "Keep mosquito meshes closed in your bedroom.",
          "Cough superheroes style inside folded elbows!"
        ]
      });
    } finally {
      setPredictLoading(false);
    }
  };

  const filteredAlerts = alerts.filter(a => {
    if (activeSeverity === "All") return true;
    return a.level === activeSeverity;
  });

  return (
    <div className="space-y-6" id="alerts-surveillance-hub">
      
      {/* Intro header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-[#1A1A1A] font-sans flex items-center gap-2 uppercase italic">
            <AlertTriangle className="w-6 h-6 text-[#FF5F1F] animate-pulse" />
            Advisories & Early Threat Board
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500">
            Real-time algorithmic threats and live health advisory monitoring.
          </p>
        </div>

        {/* Severity togglers */}
        <div className="flex gap-1.5 p-1 bg-white border-2 border-[#1A1A1A] rounded-xl justify-start shadow-[2px_2px_0px_#1A1A1A]">
          {["All", "Critical", "High", "Medium"].map(lvl => (
            <button
              key={lvl}
              onClick={() => setActiveSeverity(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-black select-none uppercase tracking-wide transition cursor-pointer ${
                activeSeverity === lvl 
                  ? "bg-[#FF5F1F] text-white border border-[#1A1A1A] shadow-[1.5px_1.5px_0px_#1A1A1A]" 
                  : "text-[#1A1A1A] hover:text-[#FF5F1F]"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Alerts logs list & Sandbox AI predictor */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left: Interactive Alerts registry */}
        <div className="lg:col-span-3 art-card p-5 bg-white space-y-4">
          <div className="border-b-2 border-dashed border-[#1A1A1A] pb-2">
            <h2 className="text-xs font-mono font-black text-[#FF5F1F] uppercase tracking-widest">Active Alerts Directory</h2>
          </div>

          <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map(alert => {
                let cardStyle = "bg-rose-50 border-2 border-[#1A1A1A] shadow-[3.5px_3.5px_0px_#1A1A1A] text-rose-950";
                let badgeStyle = "bg-rose-200 text-rose-900 border-2 border-rose-500";
                
                if (alert.level === "High") {
                  cardStyle = "bg-amber-50 border-2 border-[#1A1A1A] shadow-[3.5px_3.5px_0px_#1A1A1A] text-amber-950";
                  badgeStyle = "bg-amber-200 text-amber-900 border-2 border-amber-500";
                } else if (alert.level === "Medium") {
                  cardStyle = "bg-[#FAF4EE] border-2 border-[#1A1A1A] shadow-[3.5px_3.5px_0px_#1A1A1A] text-slate-900";
                  badgeStyle = "bg-orange-100 text-[#FF5F1F] border-2 border-[#FF5F1F]";
                }

                return (
                  <div 
                    key={alert.id}
                    id={`advisory-card-${alert.id}`}
                    className={`p-4 rounded-xl ${cardStyle} transition flex flex-col justify-between gap-3 relative overflow-hidden`}
                  >
                    <div className="space-y-1.5 text-left">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[8.5px] font-mono font-black tracking-widest uppercase px-2 py-0.5 rounded ${badgeStyle}`}>
                          ⚠️ {alert.level} RISK (Score: {alert.riskScore})
                        </span>
                        <span className="text-[10px] text-[#1A1A1A] font-mono font-bold flex items-center gap-1 uppercase">
                          <Globe className="w-3.5 h-3.5 text-[#FF5F1F]" /> TARGET: {alert.country}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-sm tracking-tight text-[#1A1A1A] uppercase">{alert.title}</h3>
                      <p className="text-xs text-slate-700 leading-relaxed font-sans font-medium">{alert.message}</p>
                    </div>

                    <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono font-bold border-t border-dashed border-[#1A1A1A]/30 pt-2.5 bg-transparent">
                      <span>FILED: {new Date(alert.date).toLocaleDateString()}</span>
                      <button
                        onClick={() => onResolveAlert(alert.id)}
                        className="px-2.5 py-1.5 bg-white hover:bg-[#FF5F1F] hover:text-white text-[#1A1A1A] border-2 border-[#1A1A1A] font-mono font-black uppercase text-[10px] rounded shadow-[1.5px_1.5px_0px_#1A1A1A] transition flex items-center gap-1 cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" /> Archive Advisory
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-20 text-center text-[#1A1A1A] space-y-2 border-2 border-dashed border-slate-350 rounded-xl">
                <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto animate-bounce" />
                <p className="text-base font-extrabold uppercase tracking-tight">No active warning signals registered!</p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto font-medium">
                  All active global pathogen channels are operating under safe standard benchmarks. Safe skies!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Area: SMART AI RISK PREDICTOR SANDBOX */}
        <div className="lg:col-span-2 bg-[#1A1A1A] text-white border-4 border-[#1A1A1A] rounded-2xl p-5 shadow-[6px_6px_0px_#1A1A1A] flex flex-col justify-between text-left space-y-4">
          
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 border-b-2 border-dashed border-[#FF5F1F]/40 pb-3">
              <Sparkles className="w-5 h-5 text-[#FF5F1F] animate-pulse shrink-0" />
              <div>
                <h3 className="font-sans font-black text-sm uppercase tracking-wider">AI Biosafety Analyzer</h3>
                <span className="text-[9px] font-mono text-slate-400 font-extrabold tracking-widest block uppercase mt-0.5">Gemini 3.5 Active Channel</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              Input field variables to simulate local playground pathogen contact indexes. We will compile a targeted safety guidelines board!
            </p>

            <form onSubmit={handlePredictLocalRisk} className="space-y-3 font-mono">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-400 uppercase font-black tracking-widest block">your country</label>
                  <div className="relative">
                    <Globe className="absolute left-2.5 top-3 w-3.5 h-3.5 text-slate-400" />
                    <input
                      id="ai-country"
                      type="text"
                      required
                      value={targetCountry}
                      onChange={(e) => setTargetCountry(e.target.value)}
                      placeholder="e.g. Brazil"
                      className="w-full text-xs font-bold text-[#1A1A1A] bg-white border-2 border-transparent rounded-lg pl-8 pr-2 py-2 focus:outline-none focus:border-[#FF5F1F] transition"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-400 uppercase font-black tracking-widest block">your age</label>
                  <div className="relative">
                    <User className="absolute left-2.5 top-3 w-3.5 h-3.5 text-slate-400" />
                    <input
                      id="ai-age"
                      type="number"
                      required
                      min="1"
                      max="110"
                      value={userAge}
                      onChange={(e) => setUserAge(e.target.value)}
                      placeholder="e.g. 10"
                      className="w-full text-xs font-bold text-[#1A1A1A] bg-white border-2 border-transparent rounded-lg pl-8 pr-2 py-2 focus:outline-none focus:border-[#FF5F1F] transition"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono text-slate-400 uppercase font-black tracking-widest block">your health habits description</label>
                <textarea
                  id="ai-habits"
                  rows={2}
                  value={playgroundHabits}
                  onChange={(e) => setPlaygroundHabits(e.target.value)}
                  placeholder="Tell us what games you play and if you wash hands..."
                  className="w-full text-xs font-bold text-[#1A1A1A] bg-white border-2 border-transparent rounded-lg p-2.5 focus:outline-none focus:border-[#FF5F1F] transition font-sans"
                />
              </div>

              <button
                id="btn-ai-predict"
                type="submit"
                disabled={predictLoading}
                className={`w-full py-2.5 bg-[#FF5F1F] hover:bg-[#ff7137] text-white text-xs font-mono font-black uppercase tracking-wider rounded border-2 border-[#1A1A1A] shadow-[2.5px_2.5px_0px_white] transition cursor-pointer uppercase ${
                  predictLoading ? "bg-slate-700 text-slate-400 cursor-not-allowed opacity-55 shadow-[0px_0px]" : ""
                }`}
              >
                <Sparkles className="w-4 h-4 text-white inline shrink-0" /> {predictLoading ? "SCANNING HEALTH MAPS..." : "CALCULATE DEFENSE SHIELDS"}
              </button>
            </form>

            {/* Risk Scorecard Result */}
            {riskScorecard && (
              <div className="bg-black p-4 rounded-xl border-2 border-[#FF5F1F] space-y-3 font-sans shadow-[4px_4px_0px_#1A1A1A] animate-fade-in" id="ai-risk-card-result">
                <div className="flex items-center justify-between border-b border-[#FF5F1F]/20 pb-2">
                  <span className="text-[9px] font-mono text-slate-400 font-extrabold tracking-widest">PREDICTIVE SCORE:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase border-2 border-[#1A1A1A] ${
                    riskScorecard.riskLevel === "Low" ? "bg-emerald-500 text-white" :
                    riskScorecard.riskLevel === "Medium" ? "bg-amber-500 text-[#1A1A1A]" :
                    "bg-rose-500 text-white"
                  }`}>
                    {riskScorecard.riskLevel} Risk Level
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-slate-200 leading-normal font-bold font-sans">{riskScorecard.explanation}</p>
                </div>

                <div className="space-y-1.5 border-t border-dashed border-[#FF5F1F]/20 pt-2.5 text-left">
                  <span className="text-[9px] font-mono text-slate-400 block font-black uppercase tracking-widest">TARGETED BIOPROTECTION PROTOCOLS:</span>
                  <ul className="space-y-1.5">
                    {riskScorecard.actionSteps.map((step, idx) => (
                      <li key={idx} className="text-xs text-indigo-100 flex items-start gap-1 font-bold">
                        <span className="text-[#FF5F1F]">✔</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-zinc-800 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-slate-600 shrink-0" />
            <p className="text-[10px] text-slate-400 leading-tight font-bold font-mono">
              AI indices are educational health instructions referencing standardized CDC paradigms.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
