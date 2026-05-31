import { Shield, Heart, Award, Sparkles, BookOpen, Smile, UserCheck } from "lucide-react";

export default function AboutView() {
  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto" id="about-handbook-viewport">
      
      {/* Visual Title */}
      <div className="space-y-2">
        <h1 className="text-2xl font-black tracking-tighter text-[#1A1A1A] font-sans flex items-center gap-2 uppercase italic">
          <BookOpen className="w-6 h-6 text-[#FF5F1F]" />
          The Little Explorer's Biosafety Book
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500">
          Learn how brave medical heroes, clever researchers, and data trackers protect our neighborhoods.
        </p>
      </div>

      {/* Chapters grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
        
        {/* Card 1: What is an Outbreak? */}
        <div className="art-card p-6 bg-white space-y-3 shadow-[4px_4px_0_#1A1A1A] transition hover:translate-y-[-2px]">
          <div className="w-10 h-10 rounded-full bg-rose-100 border-2 border-[#1A1A1A] flex items-center justify-center text-rose-600 font-black font-mono shadow-[2px_2px_0_#1A1A1A]">
            01
          </div>
          <h2 className="text-lg font-black text-[#1A1A1A] font-sans uppercase tracking-tight">
            What is an "Outbreak"?
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-700 font-sans font-semibold">
            Sometimes, tiny microscopic pathogens (like viruses or sneaky bacteria) jump between people in 
            the same neighborhood. When more people than usual catch the exact same bug, we call it an <strong className="text-[#FF5F1F]">outbreak</strong>! 
            Doctors and data trackers fly in to build warning signs and stop them from traveling to other cities.
          </p>
        </div>

        {/* Card 2: Why Soap is a Superhero Shield! */}
        <div className="art-card p-6 bg-white space-y-3 shadow-[4px_4px_0_#1A1A1A] transition hover:translate-y-[-2px]">
          <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-[#1A1A1A] flex items-center justify-center text-emerald-700 font-black font-mono shadow-[2px_2px_0_#1A1A1A]">
            02
          </div>
          <h2 className="text-lg font-black text-[#1A1A1A] font-sans uppercase tracking-tight">
            Soap is a Superhero Shield!
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-700 font-semibold">
            Soap is magic! Microscopic viruses have a greasy outer jacket that handles their defense. When you mix warm water and 
            scrub soap bubbles on your fingers, the soap molecules grab the virus's greasy jacket and pull it apart like puzzle pieces! 
            Then, the water washes the zapped bugs safely down the drain. This represents the ultimate hand shield!
          </p>
        </div>

        {/* Card 3: Vaccine Pioneer Jonas Salk */}
        <div className="art-card p-6 bg-white space-y-3 shadow-[4px_4px_0_#1A1A1A] transition hover:translate-y-[-2px]">
          <div className="w-10 h-10 rounded-full bg-amber-100 border-2 border-[#1A1A1A] flex items-center justify-center text-amber-700 font-black font-mono shadow-[2px_2px_0_#1A1A1A]">
            03
          </div>
          <h2 className="text-lg font-black text-[#1A1A1A] font-sans uppercase tracking-tight">
            The Free Vaccine: Jonas Salk
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-700 font-semibold">
            Many years ago, a bad bug called Polio was hurting kids' leg muscles, making it hard to walk. A brave 
            scientist hero named <strong className="text-[#FF5F1F]">Jonas Salk</strong> invented the first Polio vaccine shield in his lab! 
            Instead of selling it to make millions of dollars, he gave the formula away <strong className="text-emerald-700">completely free</strong> so that 
            every child globally could stay safe. Because of him, Polio is almost entirely gone!
          </p>
        </div>

        {/* Card 4: How we Track pathogens */}
        <div className="art-card p-6 bg-white space-y-3 shadow-[4px_4px_0_#1A1A1A] transition hover:translate-y-[-2px]">
          <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-[#1A1A1A] flex items-center justify-center text-indigo-700 font-black font-mono shadow-[2px_2px_0_#1A1A1A]">
            04
          </div>
          <h2 className="text-lg font-black text-[#1A1A1A] font-sans uppercase tracking-tight">
            How do we spot outbreaks?
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-700 font-semibold">
            Schools, hospitals, and clinics report to global headquarters like the <strong>World Health Organization (WHO)</strong> 
            when they see unusual sickness. Our platform acts as a digital telescope! It fetches those reports, validates 
            their integrity scores, and draws heat radar maps so clinics know exactly when to raise defense shields!
          </p>
        </div>

      </div>

      {/* Hero Certificate Callout */}
      <div className="bg-[#FAF4EE] border-4 border-[#1A1A1A] text-[#1A1A1A] p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-[5.5px_5.5px_0px_#1A1A1A] rounded-xl relative overflow-hidden">
        <Award className="w-16 h-16 text-[#FF5F1F] shrink-0 animate-bounce" />
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-lg font-sans font-black text-[#1A1A1A] uppercase tracking-tight italic">You are now a certified health guardian!</h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-bold">
            Congratulations! By reading this book and reviewing outbreak maps, you have completed the fundamental 
            surveillance training. Remember: keeping toys cleaned, drinking boiled pure water, and reminding friends about soap 
            makes you a real life hero protecting your community!
          </p>
        </div>
      </div>
    </div>
  );
}
