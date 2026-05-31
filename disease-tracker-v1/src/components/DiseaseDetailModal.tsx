import { useState } from "react";
import { 
  X, 
  HelpCircle, 
  ShieldAlert, 
  Bookmark, 
  Activity, 
  CheckSquare, 
  Heart, 
  Award,
  Sparkles,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  MessageSquare,
  Volume2
} from "lucide-react";
import { Disease, Outbreak } from "../types";

interface DiseaseDetailModalProps {
  disease: Disease;
  onClose: () => void;
  outbreaks: Outbreak[];
  onTriggerAiExplanation: (outbreakId: string, customPrompt: string) => Promise<string>;
}

export default function DiseaseDetailModal({
  disease,
  onClose,
  outbreaks,
  onTriggerAiExplanation
}: DiseaseDetailModalProps) {
  const [showTechnical, setShowTechnical] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  
  // State for optional AI conversational assistant inside detail modal
  const [aiLoading, setAiLoading] = useState(false);
  const [aiCustomQuestion, setAiCustomQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  // Discover any actual active outbreaks in progress for this pathogen
  const relevantOutbreaks = outbreaks.filter(o => o.diseaseId === disease.id && o.active);

  const toggleTask = (task: string) => {
    setCompletedTasks(prev => ({
      ...prev,
      [task]: !prev[task]
    }));
  };

  const handleFetchAiExplanation = async (outbreakId: string) => {
    setAiLoading(true);
    setAiResponse(null);
    try {
      const response = await onTriggerAiExplanation(outbreakId, aiCustomQuestion);
      setAiResponse(response);
    } catch (err) {
      setAiResponse("Oh no! The AI medical library was blocked. Practice washing hands and play outdoors safely!");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      id="disease-detail-dialog"
    >
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-[8px_8px_0px_#1A1A1A] overflow-hidden border-4 border-[#1A1A1A] flex flex-col max-h-[90vh]">
        
        {/* Banner with custom vector aesthetic and exit button */}
        <div className="bg-[#1A1A1A] p-5 md:p-6 text-white text-left relative flex items-center justify-between shrink-0 border-b-4 border-[#1A1A1A]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded border border-[#FF5F1F] bg-black text-amber-300 text-[9px] font-mono tracking-widest uppercase font-black">
                {disease.type} surveillance guide
              </span>
              {disease.vaccinationAvailable && (
                <span className="px-2.5 py-0.5 rounded border border-emerald-400 bg-black text-emerald-300 text-[9px] font-mono uppercase font-black flex items-center gap-1">
                  🛡️ Active Bioshield Ready
                </span>
              )}
            </div>
            <h2 className="text-xl md:text-2xl font-black font-sans tracking-tight uppercase italic">{disease.name}</h2>
          </div>
          <button
            id="close-detail-modal"
            onClick={onClose}
            className="p-2 bg-white text-[#1A1A1A] border-2 border-transparent hover:border-[#1A1A1A] hover:bg-[#FF5F1F] hover:text-white rounded transition duration-150 cursor-pointer shadow-[1.5px_1.5px_0_#1A1A1A]"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* Scrollable Handbook Contents */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#1A1A1A] text-left">
          
          {/* Section 1: What is it? */}
          <div className="space-y-2 bg-[#FAF4EE] p-4 rounded-xl border-2 border-[#1A1A1A] shadow-[2.5px_2.5px_0px_#1A1A1A]">
            <h3 className="text-xs font-mono font-black text-[#FF5F1F] uppercase flex items-center gap-1.5 tracking-wider">
              <HelpCircle className="w-4 h-4" />
              Surveillance Definition
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-[#1A1A1A] font-sans font-bold">
              {disease.whatIsIt}
            </p>
          </div>

          {/* Section 2: How does it spread? */}
          <div className="space-y-2 border-l-4 border-dashed border-[#FF5F1F] pl-4">
            <h3 className="text-xs font-mono font-black text-[#FF5F1F] uppercase flex items-center gap-1.5 tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              Pathogen Transmission Loop
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-slate-700 font-semibold font-sans">
              {disease.howItSpreads}
            </p>
          </div>

          {/* Section 3: Symptoms layout - Kid Friendly list with beautiful icons */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-black text-[#FF5F1F] uppercase flex items-center gap-1.5 tracking-wider">
              <Activity className="w-4 h-4 text-rose-500" />
              Diagnostic Identifiers (Symptom Checklist)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {disease.symptoms10YL.map((sym, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-xl border-2 border-[#1A1A1A] bg-white shadow-[3px_3px_0px_#1A1A1A] space-y-2 hover:translate-y-[-1px] transition-all"
                >
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-rose-100 border border-[#1A1A1A] rounded text-rose-600 font-black text-xs leading-none">
                      ⚠️
                    </span>
                    <h4 className="font-extrabold text-xs text-[#1A1A1A] uppercase tracking-tight">{sym.name}</h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-normal font-semibold font-sans">{sym.descriptor}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Stay Safe Today Checklist */}
          <div className="space-y-3 p-5 bg-emerald-50 border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] rounded-xl text-left">
            <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
              <h3 className="text-xs font-mono font-black text-emerald-950 uppercase flex items-center gap-1.5 tracking-wider">
                <Bookmark className="w-4 h-4 text-emerald-700" />
                Active Biodefense Recommendations
              </h3>
              <span className="text-[9px] bg-[#1A1A1A] border border-[#1A1A1A] text-white font-mono font-black px-2 py-0.5 rounded uppercase tracking-wider">Certified action protocols</span>
            </div>
            
            <ul className="space-y-2.5">
              {disease.staySafe10YL.map((action, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 font-bold">
                  <span className="mt-0.5 text-emerald-700 font-black shrink-0">✔</span>
                  <span className="font-sans">{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 5: Benefits Section - Why Care? */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Left: Is there a vaccine? */}
            <div className="p-4 rounded-xl border-2 border-[#1A1A1A] bg-[#FAF4EE] shadow-[3px_3px_0px_#1A1A1A] space-y-2 text-left">
              <h3 className="text-xs font-mono font-black text-[#1A1A1A] uppercase tracking-wider">
                💉 Recommended Vaccine Target
              </h3>
              <p className="text-xs text-slate-700 font-semibold font-sans leading-relaxed">
                {disease.isThereVaccine10YL}
              </p>
            </div>

            {/* Right: Benefits section */}
            <div className="p-4 rounded-xl border-2 border-[#1A1A1A] bg-emerald-50 shadow-[3px_3px_0px_#1A1A1A] space-y-2 text-left">
              <h3 className="text-xs font-mono font-black text-emerald-900 uppercase flex items-center gap-1 tracking-wider">
                <Heart className="w-3.5 h-3.5 text-emerald-700" /> Epidemiological Outcome Goal
              </h3>
              <p className="text-xs text-emerald-950 font-bold font-sans leading-relaxed italic">
                "{disease.whyCare10YL}"
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {disease.benefitsOfPrevention.slice(0, 3).map((b, idx) => (
                  <span key={idx} className="bg-white text-emerald-800 border border-[#1A1A1A] text-[9px] font-mono font-black px-2 py-0.5 rounded shadow-[1px_1px_0_#1A1A1A]">
                    {b}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Section 6: Actionable public-health CTA framework */}
          <div className="p-5 bg-white border-2 border-dashed border-[#1A1A1A] rounded-xl space-y-4">
            <div>
              <h3 className="text-sm font-black text-[#1A1A1A] uppercase flex items-center gap-1.5 tracking-tight italic">
                <CheckSquare className="w-5 h-5 text-[#FF5F1F]" />
                Guard Duty Assignment (Defeat Germs!)
              </h3>
              <p className="text-xs text-slate-500 font-semibold">Tackle and complete these safety triggers to claim your public health guardian badge!</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {disease.whatToDoNow10YL.map((task, i) => {
                const isDone = !!completedTasks[task];
                return (
                  <button
                    key={i}
                    onClick={() => toggleTask(task)}
                    className={`p-3 rounded-lg border-2 border-[#1A1A1A] text-left flex items-start gap-2.5 transition duration-100 shadow-[2px_2px_0px_#1A1A1A] cursor-pointer ${
                      isDone 
                        ? "bg-emerald-100 text-emerald-950" 
                        : "bg-white hover:bg-slate-50 text-[#1A1A1A]"
                    }`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded-sm border-2 border-[#1A1A1A] shrink-0 flex items-center justify-center text-[10px] ${
                      isDone ? "bg-emerald-600 text-white font-black" : "bg-white"
                    }`}>
                      {isDone && "✔"}
                    </div>
                    <span className="text-xs leading-tight font-extrabold pb-0.5">{task}</span>
                  </button>
                );
              })}
            </div>

            {Object.keys(completedTasks).filter(k => completedTasks[k]).length === disease.whatToDoNow10YL.length && (
              <div className="flex items-center gap-2 text-emerald-950 bg-emerald-100 border-2 border-[#1A1A1A] p-3 rounded-lg text-xs font-black shadow-[3px_3px_0px_#1A1A1A] animate-pulse">
                <Award className="w-5 h-5 text-emerald-600 shrink-0" />
                Congratulations! You earned the "{disease.name.split(" (")[0]} Surveillance Medal"! Let elders know you are now a licensed health protector!
              </div>
            )}
          </div>

          {/* --- SMART CONVERSATIONAL AI SUB-DRAWER --- */}
          {relevantOutbreaks.length > 0 && (
            <div className="bg-[#1A1A1A] text-white border-2 border-[#1A1A1A] p-5 rounded-xl shadow-[4px_4px_0_#1A1A1A] space-y-4 text-left">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-[#FF5F1F] animate-pulse" />
                  <h4 className="font-black text-sm uppercase tracking-wide">Conversational Outbreak Intelligence</h4>
                </div>
                <span className="text-[9px] font-mono bg-[#FF5F1F] border border-[#1A1A1A] text-white font-black px-2.5 py-0.5 rounded uppercase tracking-wider">active nodes online</span>
              </div>
              
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                Active clinical field reports exist for {disease.name}. Ask Gemini to analyze locations or simplify specific transmission indexes.
              </p>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {relevantOutbreaks.map(ob => (
                    <button
                      key={ob.id}
                      onClick={() => handleFetchAiExplanation(ob.id)}
                      disabled={aiLoading}
                      className="px-3 py-2 bg-white text-[#1A1A1A] hover:bg-[#FF5F1F] hover:text-white hover:border-[#1A1A1A] border-2 border-white rounded font-mono font-black uppercase text-[10px] tracking-wide transition duration-150 flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      field report: {ob.country} ({ob.cases} cases)
                    </button>
                  ))}
                </div>

                <div className="flex gap-2 font-mono">
                  <input
                    type="text"
                    value={aiCustomQuestion}
                    onChange={(e) => setAiCustomQuestion(e.target.value)}
                    placeholder="Ask specific guidelines (e.g., 'What precautions are best there?')"
                    className="flex-1 px-3 py-2 text-xs text-[#1A1A1A] bg-white border-2 border-transparent focus:border-[#FF5F1F] rounded focus:outline-none font-sans font-semibold"
                  />
                </div>

                {aiLoading && (
                  <div className="p-3 bg-zinc-900 border border-zinc-805 text-xs text-slate-400 rounded flex items-center gap-2 italic font-mono font-bold">
                    <Sparkles className="w-4 h-4 text-[#FF5F1F] animate-spin" />
                    Consulting medical journals and mapping target demographics (10-year age bracket)...
                  </div>
                )}

                {aiResponse && (
                  <div className="p-4 bg-black border-2 border-[#FF5F1F] text-xs text-slate-100 rounded leading-relaxed font-sans whitespace-pre-wrap font-semibold max-h-[180px] overflow-y-auto">
                    {aiResponse}
                  </div>
                )}
              </div>
            </div>
          )}


          {/* --- SCIENTIST drawer: for clinicians and older researchers --- */}
          <div className="border-t-2 border-dashed border-[#1A1A1A] pt-4">
            <button
              onClick={() => setShowTechnical(!showTechnical)}
              className="flex items-center gap-1.5 font-mono text-[10px] font-black uppercase tracking-wide text-slate-500 hover:text-[#FF5F1F] transition cursor-pointer"
            >
              {showTechnical ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {showTechnical ? "Minimize Clinical Surveillance Data" : "View Epidemiological Surveliance Profile (For Researchers)"}
            </button>

            {showTechnical && (
              <div id="technical-panel" className="mt-4 p-5 bg-[#1F1F1F] text-slate-350 rounded border-2 border-[#1A1A1A] font-mono text-[11px] space-y-4 shadow-inner leading-relaxed text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[#FF5F1F] text-[9px] block font-black tracking-widest uppercase">Pathogen Classification</span>
                    <span className="text-slate-100 text-xs font-black uppercase text-white">{disease.type}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[#FF5F1F] text-[9px] block font-black tracking-widest uppercase">Discovered Isolation Record</span>
                    <span className="text-slate-100 text-xs font-semibold text-white">{disease.firstDiscovered}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[#FF5F1F] text-[9px] block font-black tracking-widest uppercase">Clinician Treatment Protocols</span>
                    <ul className="list-disc pl-4 text-slate-200 font-semibold font-sans text-xs space-y-0.5">
                      {disease.treatmentMethods.map((m, idx) => (
                        <li key={idx}>{m}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[#FF5F1F] text-[9px] block font-black tracking-widest uppercase">Primary Risk Target Groups</span>
                    <ul className="list-disc pl-4 text-slate-200 font-semibold font-sans text-xs space-y-0.5">
                      {disease.riskGroups.map((g, idx) => (
                        <li key={idx}>{g}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-1 border-t border-slate-800/80 pt-3">
                  <span className="text-[#FF5F1F] text-[9px] block font-black tracking-widest uppercase">Historic Outbreak Indexes</span>
                  <span className="text-slate-200 text-xs block font-sans font-semibold leading-relaxed">{disease.historicalOutbreaks}</span>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
