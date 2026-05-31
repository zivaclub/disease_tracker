import { useState } from "react";
import { Search, Bug, HelpCircle, ArrowRight, Activity, Eye, Compass } from "lucide-react";
import { Disease } from "../types";

interface DiseaseExplorerViewProps {
  diseases: Disease[];
  onSelectDisease: (disease: Disease) => void;
}

export default function DiseaseExplorerView({ diseases, onSelectDisease }: DiseaseExplorerViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const categories = ["All", "Virus", "Bacteria", "Parasite"];

  const filteredDiseases = diseases.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.symptomsList.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          d.whatIsIt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeFilter === "All" || d.type === activeFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6" id="explorer-container">
      {/* Search Header banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-[#1A1A1A] font-sans flex items-center gap-2 uppercase italic">
            <Compass className="w-6 h-6 text-[#FF5F1F]" />
            Pathogen Handbook & Directory
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500">
            Meet the microscopic organisms that live in our environments. Educate yourself to trigger medical shields!
          </p>
        </div>

        {/* Categories toggler */}
        <div className="flex items-center gap-1.5 p-1 bg-white border-2 border-[#1A1A1A] rounded-xl max-w-max self-start md:self-auto shadow-[2px_2px_0px_#1A1A1A]">
          {categories.map(cat => (
            <button
              key={cat}
              id={`filter-cat-${cat.toLowerCase()}`}
              onClick={() => setActiveFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-wide uppercase transition cursor-pointer ${
                activeFilter === cat 
                  ? "bg-[#FF5F1F] text-white border border-[#1A1A1A] shadow-[1.5px_1.5px_0px_#1A1A1A]" 
                  : "text-[#1A1A1A] hover:text-[#FF5F1F]"
              }`}
            >
              {cat === "All" ? "All Organisms" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Modern Search bar widget */}
      <div className="relative">
        <Search className="absolute left-4 top-4 w-4 h-4 text-slate-500" />
        <input
          id="disease-search"
          type="text"
          placeholder="Search by sickness name, symptom keywords, or simple descriptions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="art-input w-full pl-11 pr-4 py-3.5 text-sm placeholder-slate-400 font-bold"
        />
      </div>

      {/* Grid List representation */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDiseases.map((disease, idx) => {
          let badgeColor = "bg-rose-100 text-rose-800 border-2 border-rose-400";
          if (disease.type === "Bacteria") badgeColor = "bg-amber-100 text-amber-800 border-2 border-amber-400";
          if (disease.type === "Parasite") badgeColor = "bg-teal-100 text-teal-800 border-2 border-teal-400";

          // Alternate rotational tilt for organic, artsy physical feel
          const rotationalClass = idx % 2 === 0 ? "hover:rotate-[0.4deg] rotate-[-0.2deg]" : "hover:rotate-[-0.4deg] rotate-[0.2deg]";

          return (
            <div
              key={disease.id}
              id={`disease-card-${disease.id}`}
              onClick={() => onSelectDisease(disease)}
              className={`art-card group p-5 bg-white flex flex-col justify-between transition-all duration-200 cursor-pointer ${rotationalClass}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  {/* Micro organism category badge */}
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold tracking-wide font-mono uppercase ${badgeColor}`}>
                    {disease.type}
                  </span>
                  <span className="text-[11px] font-mono text-[#1A1A1A] font-bold flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-[#FF5F1F]" />
                    Mortality: <span className="underline decoration-[#FF5F1F] decoration-2">{disease.mortalityRate}</span>
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-[#1A1A1A] leading-snug group-hover:text-[#FF5F1F] tracking-tight transition duration-150">
                    {disease.name}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono uppercase italic font-bold">
                    Discovered: {disease.firstDiscovered}
                  </p>
                </div>

                {/* description */}
                <p className="text-xs text-slate-700 font-medium leading-relaxed line-clamp-3">
                  {disease.whatIsIt}
                </p>

                {/* Quick signs tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {disease.symptomsList.slice(0, 3).map((sym, idx) => (
                    <span key={idx} className="bg-[#FAF4EE] border border-[#1A1A1A] text-[9px] text-[#1A1A1A] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-tight shadow-[1px_1px_0px_#1A1A1A]">
                      ⚠️ {sym}
                    </span>
                  ))}
                  {disease.symptomsList.length > 3 && (
                    <span className="bg-slate-100 border border-slate-300 text-[9px] text-slate-500 px-1.5 py-0.5 rounded font-mono tracking-tight">
                      +{disease.symptomsList.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="border-t-2 border-dashed border-[#1A1A1A] mt-5 pt-3 flex items-center justify-between text-xs font-bold text-[#1A1A1A]">
                <span className="text-[9px] text-slate-400 font-mono uppercase flex items-center gap-1 font-bold">
                  <HelpCircle className="w-3.5 h-3.5 text-[#FF5F1F]" /> Click to read
                </span>
                <span className="text-[#FF5F1F] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Check Shield <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}

        {filteredDiseases.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] rounded-2xl space-y-3">
            <Bug className="w-10 h-10 mx-auto text-slate-400 stroke-1 animate-bounce" />
            <p className="text-lg text-[#1A1A1A] font-extrabold uppercase tracking-tight">No matching pathogens detected</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
              Please double check spelling or search for common indicators like "fever", "cough", or "sickness".
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
