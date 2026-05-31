import { useState } from "react";
import { 
  Shield, 
  Search, 
  HelpCircle, 
  Award, 
  CheckCircle, 
  ThumbsUp, 
  Zap, 
  AlertCircle,
  FileText
} from "lucide-react";
import { VaccineDetails } from "../types";

interface VaccinationCenterViewProps {
  vaccines: VaccineDetails[];
}

export default function VaccinationCenterView({ vaccines }: VaccinationCenterViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVaccine, setSelectedVaccine] = useState<VaccineDetails | null>(vaccines[0] || null);

  // Kid friendly vaccine arena quiz variables
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<boolean | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const quizQuestions = [
    {
      txt: "Do vaccines contain tiny, weakened or puzzle-like pieces of a bug to help your white blood cell guards practice defending you?",
      ans: true,
      explain: "Correct! Think of it like target practice. It gives your immune cells a map of the bad bug, without actually making you sick!"
    },
    {
      txt: "If you get a vaccine poke, does it mean you are automatically invulnerable and should eat dirty sweets off the floor?",
      ans: false,
      explain: "Amazing! Even with a strong medical shield, you still need to wash your hands with soap bubbles so other dirty stomach bacteria stay far away."
    },
    {
      txt: "Should you stay calm and breathe deep like a giant mountain when a friendly nurse gives you a quick shield injection?",
      ans: true,
      explain: "Superb! If you relax your arm muscles, the poke goes super fast and feels like a tiny mosquito prick that disappears in a second!"
    }
  ];

  const handleAnswer = (option: boolean) => {
    setSelectedOption(option);
    setHasAnswered(true);
    if (option === quizQuestions[quizIndex].ans) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    setHasAnswered(false);
    setSelectedOption(null);
    if (quizIndex + 1 < quizQuestions.length) {
      setQuizIndex(quizIndex + 1);
    } else {
      setShowQuizResult(true);
    }
  };

  const handleResetQuiz = () => {
    setQuizIndex(0);
    setQuizScore(0);
    setShowQuizResult(false);
    setHasAnswered(false);
    setSelectedOption(null);
  };

  const filteredVaccines = vaccines.filter(v => 
    v.diseaseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.vaccineName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6" id="vaccination-arena">
      
      {/* Intro section */}
      <div>
        <h1 className="text-2xl font-black tracking-tighter text-[#1A1A1A] font-sans flex items-center gap-2 uppercase italic">
          <Shield className="w-6 h-6 text-[#FF5F1F]" />
          Vaccination Shield Center
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500">
          Study medical immunization guides, dosage requirements, and earn your Immunization Hero Badges!
        </p>
      </div>

      {/* Grid: Vaccine deck details & Sandbox quiz */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Interactive Vaccines List & Detail panel */}
        <div className="lg:col-span-2 art-card p-5 bg-white space-y-4 text-left">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                id="search-vaccines"
                type="text"
                placeholder="Search vaccine shields..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="art-input w-full pl-9 pr-3 py-2.5 text-xs font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* List */}
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {filteredVaccines.map(v => {
                const isSelected = selectedVaccine?.diseaseId === v.diseaseId;
                return (
                  <button
                    key={v.diseaseId}
                    onClick={() => setSelectedVaccine(v)}
                    className={`w-full p-3.5 rounded-lg border-2 text-left transition cursor-pointer ${
                      isSelected
                        ? "bg-[#FF5F1F] border-[#1A1A1A] text-white shadow-[2px_2px_0px_#1A1A1A]"
                        : "bg-white hover:bg-[#FAF4EE] border-[#1A1A1A] text-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]"
                    }`}
                  >
                    <p className={`text-[9px] font-mono tracking-wider font-extrabold uppercase ${isSelected ? "text-white/80" : "text-slate-500"}`}>{v.vaccineName.split(" (")[0]}</p>
                    <h3 className="font-extrabold text-sm tracking-tight">{v.diseaseName}</h3>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-dashed border-[#1A1A1A]/20">
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded border border-[#1A1A1A]/40 font-bold ${isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"}`}>
                        💉 Doses: {v.doses > 0 ? v.doses : "None"}
                      </span>
                      <span className={`text-[10px] font-mono font-black uppercase ${isSelected ? "text-white" : "text-[#FF5F1F]"}`}>{v.available ? "Shield Ready" : "Priority Research"}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Details panel */}
            <div className="p-4 bg-[#FAF4EE] border-2 border-[#1A1A1A] rounded-xl flex flex-col justify-between shadow-[3px_3px_0px_#1A1A1A] text-[#1A1A1A]">
              {selectedVaccine ? (
                <div className="space-y-3.5" id="vaccine-detail-panel">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-[#FF5F1F] font-black uppercase tracking-widest">Scientific Beacon Badge</span>
                    <h3 className="font-black text-base text-[#1A1A1A] tracking-tight">{selectedVaccine.vaccineName}</h3>
                    <p className="text-xs text-slate-600 font-bold leading-normal font-sans">Effective target for {selectedVaccine.diseaseName}</p>
                  </div>

                  <div className="space-y-2 text-[11px] font-mono text-[#1A1A1A] leading-relaxed font-bold">
                    <div className="flex justify-between border-b border-[#1A1A1A]/10 pb-1.5">
                      <span className="text-slate-500">WHO Standard Recs:</span>
                      <span className="font-extrabold text-right pl-3">{selectedVaccine.whoRecommendation.split(" as ")[0]}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#1A1A1A]/10 pb-1.5">
                      <span className="text-slate-500">Age Target:</span>
                      <span className="font-extrabold text-right pl-3">{selectedVaccine.ageRecommendation}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#1A1A1A]/10 pb-1.5">
                      <span className="text-slate-500">Boosters Req:</span>
                      <span className="font-extrabold text-right pl-3">{selectedVaccine.boosterRequirements}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#1A1A1A]/10 pb-1.5">
                      <span className="text-slate-500">Shield Efficiency:</span>
                      <span className="text-emerald-700 font-black text-right pl-3 underline decoration-2 decoration-[#FF5F1F]">{selectedVaccine.effectiveness}</span>
                    </div>
                  </div>

                  <div className="space-y-1 bg-white p-2.5 rounded-lg border-2 border-[#1A1A1A]">
                    <span className="text-[9px] font-mono text-slate-500 block font-black uppercase tracking-wider">Unwanted reactions (*expected*)</span>
                    <p className="text-[10px] text-slate-700 leading-tight font-bold">
                      {selectedVaccine.sideEffects.length > 0 ? selectedVaccine.sideEffects.join(", ") : "No adverse secondary reactions registered."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-slate-400">
                  <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2 animate-pulse" />
                  <p className="text-xs font-mono font-bold uppercase">Select a vaccine card from list to examine clinical parameters.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Pediatric Immune shield arena game */}
        <div className="bg-[#1A1A1A] text-white border-4 border-[#1A1A1A] rounded-2xl p-5 shadow-[6px_6px_0px_#1A1A1A] flex flex-col justify-between text-left relative overflow-hidden">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-dashed border-[#FF5F1F]/40 pb-3">
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
                <h2 className="font-sans font-black text-sm tracking-wider uppercase">Immune Shield Arena</h2>
              </div>
              <span className="text-[9px] font-mono text-[#FF5F1F] font-black">STRIKE TEAM 01</span>
            </div>

            {!showQuizResult ? (
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-slate-400 font-black block uppercase tracking-widest">
                  Question {quizIndex + 1} of {quizQuestions.length}
                </span>

                <p className="text-xs sm:text-sm font-bold tracking-tight text-slate-200 leading-normal">
                  {quizQuestions[quizIndex].txt}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    disabled={hasAnswered}
                    onClick={() => handleAnswer(true)}
                    className={`py-2.5 px-3 rounded-lg text-xs font-black transition flex items-center justify-center gap-1.5 border-2 cursor-pointer ${
                      hasAnswered && quizQuestions[quizIndex].ans === true
                        ? "bg-emerald-600 border-white text-white shadow-[2px_2px_0px_white]"
                        : selectedOption === true
                        ? "bg-rose-900/40 border-rose-500 text-rose-300"
                        : "bg-slate-800 hover:bg-slate-700/80 border-[#1A1A1A] text-slate-100 shadow-[2px_2px_0px_#FF5F1F]"
                    }`}
                  >
                    👍 YES, CHIEF
                  </button>
                  <button
                    disabled={hasAnswered}
                    onClick={() => handleAnswer(false)}
                    className={`py-2.5 px-3 rounded-lg text-xs font-black transition flex items-center justify-center gap-1.5 border-2 cursor-pointer ${
                      hasAnswered && quizQuestions[quizIndex].ans === false
                        ? "bg-emerald-600 border-white text-white shadow-[2px_2px_0px_white]"
                        : selectedOption === false
                        ? "bg-rose-900/40 border-rose-500 text-rose-300"
                        : "bg-slate-800 hover:bg-slate-700/80 border-[#1A1A1A] text-slate-100 shadow-[2px_2px_0px_#FF5F1F]"
                    }`}
                  >
                    👎 NO, CHIEF
                  </button>
                </div>

                {hasAnswered && (
                  <div className="p-3 bg-zinc-900 rounded-lg border-2 border-[#1A1A1A] text-xs space-y-2 relative shadow-[3px_3px_0px_#FF5F1F]">
                    <div className="font-bold text-xs flex items-center gap-1 text-slate-200">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      {selectedOption === quizQuestions[quizIndex].ans ? "Super Scientist!" : "Health Database Update:"}
                    </div>
                    <p className="text-[11px] text-slate-350 leading-normal font-sans font-semibold">{quizQuestions[quizIndex].explain}</p>
                    <button
                      onClick={handleNextQuiz}
                      className="mt-1 w-full py-2 bg-[#FF5F1F] text-white text-xs font-black rounded border border-[#1A1A1A] hover:bg-[#ff7137] shadow-[2px_2px_0px_#1A1A1A] transition uppercase tracking-wider font-mono cursor-pointer"
                    >
                      Continue Quest ➔
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <Award className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
                <div className="space-y-1">
                  <h3 className="font-black text-lg uppercase tracking-tight">Quest Complete!</h3>
                  <p className="text-xs font-mono text-[#FF5F1F] font-bold">Telemetric validation: {quizScore} / {quizQuestions.length} passes</p>
                </div>
                
                {quizScore === quizQuestions.length ? (
                  <div className="p-3 bg-emerald-500/10 border-2 border-emerald-500 text-emerald-300 text-xs rounded-lg font-bold font-sans pr-2 leading-relaxed">
                    🌟 <strong>Perfect Score!</strong> You've successfully unlocked the prestigious <strong>Immunization Hero Certification</strong>. Ready for field deployments!
                  </div>
                ) : (
                  <div className="p-3 bg-slate-900 border-2 border-slate-750 text-xs rounded-lg font-medium text-slate-300">
                    Slight divergence detected. Let's practice bio-hygiene protocol and repeat anytime.
                  </div>
                )}

                <button
                  onClick={handleResetQuiz}
                  className="w-full py-2 bg-[#FF5F1F] hover:bg-[#ff7137] text-white text-xs font-mono font-black uppercase tracking-wider rounded border-2 border-[#1A1A1A] shadow-[2.5px_2.5px_0px_white] transition cursor-pointer"
                >
                  Repeat Training Arena
                </button>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-zinc-800 mt-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-slate-500 shrink-0" />
              <p className="text-[10px] text-slate-400 leading-normal font-bold">
                Vaccines protect communities by establishing herd immunity thresholds, rendering viruses unable to propagate.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
