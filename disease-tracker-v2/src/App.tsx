import { useState, useEffect } from "react";
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  Globe, 
  Database, 
  BookOpen, 
  Compass, 
  Settings, 
  Bell, 
  Menu, 
  X,
  FileText,
  Heart,
  Moon,
  Sun,
  Newspaper,
  RefreshCw,
} from "lucide-react";

// Subcomponents
import DashboardView from "./components/DashboardView";
import DiseaseExplorerView from "./components/DiseaseExplorerView";
import DiseaseDetailModal from "./components/DiseaseDetailModal";
import OutbreakMapView from "./components/OutbreakMapView";
import VaccinationCenterView from "./components/VaccinationCenterView";
import AlertsView from "./components/AlertsView";
import ObservabilityLogsView from "./components/ObservabilityLogsView";
import AboutView from "./components/AboutView";
import NewsView from "./components/NewsView";
import ReportOutbreakModal from "./components/ReportOutbreakModal";

// Types
import { Disease, VaccineDetails, Outbreak, DiseaseAlert, DataSource, NewsArticle, EtlLog } from "./types";

export default function App() {
  // Navigation Tabs state
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core Data models state
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [vaccines, setVaccines] = useState<VaccineDetails[]>([]);
  const [outbreaks, setOutbreaks] = useState<Outbreak[]>([]);
  const [alerts, setAlerts] = useState<DiseaseAlert[]>([]);
  const [sources, setSources] = useState<DataSource[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [logs, setLogs] = useState<EtlLog[]>([]);

  // Open overlays state
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);

  // Operations states
  const [loading, setLoading] = useState(true);
  const [etlLoading, setEtlLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkMode") === "true" ||
        window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });
  const [appNotification, setAppNotification] = useState<{ text: string; type: "success" | "info" } | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  // Fetch all tables from the FastAPI backend on startup
  const apiBase = import.meta.env.VITE_API_URL || "";
  const fetchAllData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [disRes, vacRes, outRes, altRes, srcRes, newsRes, logsRes] = await Promise.all([
        fetch(`${apiBase}/api/diseases`),
        fetch(`${apiBase}/api/vaccines`),
        fetch(`${apiBase}/api/outbreaks`),
        fetch(`${apiBase}/api/alerts`),
        fetch(`${apiBase}/api/sources`),
        fetch(`${apiBase}/api/news`),
        fetch(`${apiBase}/api/etl-logs`)
      ]);

      const [disData, vacData, outData, altData, srcData, newsData, logsData] = await Promise.all([
        disRes.json(),
        vacRes.json(),
        outRes.json(),
        altRes.json(),
        srcRes.json(),
        newsRes.json(),
        logsRes.json()
      ]);

      setDiseases(disData);
      setVaccines(vacData);
      setOutbreaks(outData);
      setAlerts(altData);
      setSources(srcData);
      setNews(newsData);
      setLogs(logsData);
    } catch (err) {
      console.error("Failed to fetch epidemic tracking details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Trigger automated ETL pipeline & crawling task
  const handleTriggerEtl = async () => {
    setEtlLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/etl/run`, { method: "POST" });
      const data = await res.json();
      await fetchAllData(true); // Silent reload
      showToast(`ETL Monitoring run succeeded! Classify and updated ${data.activeOutbreaksCount} nodes.`, "success");
    } catch (err) {
      showToast("Scraper run failed. Please check server connection.", "info");
    } finally {
      setEtlLoading(false);
    }
  };

  // Submit reported case spot
  const handlePublishOutbreak = async (params: any) => {
    try {
      const res = await fetch(`${apiBase}/api/outbreaks/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params)
      });
      if (res.ok) {
        await fetchAllData(true);
        showToast(`Successfully reported active spot outbreak in ${params.country}!`, "success");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Resolve/Archive advisory warning
  const handleResolveAlert = async (id: string) => {
    try {
      const res = await fetch(`${apiBase}/api/alerts/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
        showToast("Advisory warning successfully archived.", "success");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Trigger live AI Explanations via backend Gemini
  const handleFetchAiOverview = async (outbreakId: string, customPrompt: string): Promise<string> => {
    const res = await fetch(`${apiBase}/api/ai/explain-outbreak`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ outbreakId, customPrompt })
    });
    const data = await res.json();
    return data.summary;
  };

  // Elegant floating notification helper
  const showToast = (text: string, type: "success" | "info") => {
    setAppNotification({ text, type });
    setTimeout(() => {
      setAppNotification(null);
    }, 4000);
  };

  const activeCriticalAlerts = alerts.filter(a => a.level === "Critical" && !a.isRead);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF4EE] flex flex-col items-center justify-center p-6 space-y-4 relative">
        <div className="absolute inset-0 art-bg-dotted opacity-[0.04] pointer-events-none" />
        <div className="p-4 bg-white border-2 border-[#1A1A1A] rounded-2xl shadow-[6px_6px_0px_#1A1A1A] flex flex-col items-center gap-4 max-w-xs text-center z-10">
          <RefreshCw className="w-10 h-10 text-[#FF5F1F] animate-spin" />
          <div className="space-y-1">
            <p className="text-base font-extrabold text-[#1A1A1A] tracking-tight">LOADING OUTBREAK RADAR</p>
            <p className="text-xs font-mono text-slate-500">Retrieving intelligence indicators and telemetry records...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF4EE] dark:bg-slate-950 flex flex-col relative overflow-x-hidden">
      {/* Absolute background dots patterns */}
      <div className="absolute inset-0 art-bg-dotted opacity-[0.035] pointer-events-none z-0" />
      
      {/* Floating Alert Toast widget */}
      {appNotification && (
        <div className="fixed top-6 right-6 z-50 animate-bounce">
          <div className="px-4 py-3 bg-white border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] rounded-xl flex items-center gap-2.5 text-xs font-bold text-[#1A1A1A]">
            <span className="text-[#FF5F1F]">{appNotification.type === "success" ? "⚡" : "⚠️"}</span>
            <span>{appNotification.text}</span>
          </div>
        </div>
      )}

      {/* Primary header dashboard frame */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b-4 border-[#1A1A1A] dark:border-slate-600 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-[#FF5F1F] text-white rounded-xl border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A]">
              <Shield className="w-5 h-5 text-white" />
            </span>
            <div className="text-left">
              <h1 className="font-black text-xl sm:text-2xl text-[#1A1A1A] tracking-tighter uppercase italic leading-none">
                HealthGuard<span className="text-[#FF5F1F]">.ai</span>
              </h1>
              <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest leading-none mt-1">EPIDEMIC SURVEILLANCE DIRECTORY</p>
            </div>
          </div>

          {/* Desktop Tab links menu */}
          <nav className="hidden lg:flex items-center gap-1.5 font-sans">
            {[
              { id: "dashboard", label: "Dashboard", icon: <Activity className="w-3.5 h-3.5" /> },
              { id: "explorer", label: "Handbook", icon: <BookOpen className="w-3.5 h-3.5" /> },
              { id: "map", label: "Outbreak Radar", icon: <Globe className="w-3.5 h-3.5" /> },
              { id: "vaccines", label: "Vaccine Shields", icon: <Shield className="w-3.5 h-3.5" /> },
              { id: "alerts", label: "Warning Board", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
              { id: "news", label: "News", icon: <Newspaper className="w-3.5 h-3.5" /> },
              { id: "observability", label: "Pipeline Logs", icon: <Database className="w-3.5 h-3.5" /> },
              { id: "about", label: "Intro Guide", icon: <Compass className="w-3.5 h-3.5" /> }
            ].map(tab => (
              <button
                key={tab.id}
                id={`tab-link-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all border-2 cursor-pointer ${
                  activeTab === tab.id 
                    ? "bg-[#FF5F1F] text-white border-[#1A1A1A] shadow-[2.5px_2.5px_0px_#1A1A1A] translate-y-[-1px]" 
                    : "bg-white text-[#1A1A1A] border-transparent hover:border-[#1A1A1A] hover:bg-[#FAF4EE]"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Action alerts and mobile menus */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg border-2 border-[#1A1A1A] dark:border-slate-500 bg-white dark:bg-slate-800 text-[#1A1A1A] dark:text-white shadow-[2px_2px_0px_#1A1A1A] dark:shadow-none"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            {/* Alarm notifications buzzer */}
            <button
              id="bell-notifications"
              onClick={() => setActiveTab("alerts")}
              className={`p-2 rounded-lg border-2 relative transition cursor-pointer ${
                activeCriticalAlerts.length > 0 
                  ? "bg-rose-500 border-[#1A1A1A] text-white shadow-[2px_2px_0px_#1A1A1A] animate-pulse" 
                  : "bg-white border-[#1A1A1A] text-[#1A1A1A] hover:bg-slate-50 shadow-[2px_2px_0px_#1A1A1A]"
              }`}
            >
              <Bell className="w-4 h-4" />
              {activeCriticalAlerts.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#FF5F1F] text-white text-[8px] font-extrabold px-1.5 py-0.2 rounded border-2 border-[#1A1A1A]">
                  {activeCriticalAlerts.length}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#1A1A1A] border-2 border-[#1A1A1A] rounded-lg bg-white shadow-[2px_2px_0px_#1A1A1A]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t-2 border-[#1A1A1A] p-4 space-y-2 max-w-full">
            {[
              { id: "dashboard", label: "Dashboard" },
              { id: "explorer", label: "Handbook" },
              { id: "map", label: "Outbreak Radar" },
              { id: "vaccines", label: "Vaccine Shields" },
              { id: "alerts", label: "Warning Board" },
              { id: "news", label: "News" },
              { id: "observability", label: "Pipeline Logs" },
              { id: "about", label: "Intro Guide" }
            ].map(tab => (
              <button
                key={tab.id}
                id={`mobile-tab-link-${tab.id}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full py-2.5 px-4 rounded-lg text-left text-xs font-bold border-2 transition-all ${
                  activeTab === tab.id 
                    ? "bg-[#FF5F1F] text-white border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]" 
                    : "bg-white text-[#1A1A1A] border-transparent hover:border-[#1A1A1A]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main content body frame viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {activeTab === "dashboard" && (
          <DashboardView
            outbreaks={outbreaks}
            alerts={alerts}
            diseases={diseases}
            onTriggerEtl={handleTriggerEtl}
            etlLoading={etlLoading}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === "explorer" && (
          <DiseaseExplorerView
            diseases={diseases}
            onSelectDisease={(disease) => setSelectedDisease(disease)}
          />
        )}

        {activeTab === "map" && (
          <OutbreakMapView
            outbreaks={outbreaks}
            onOpenReportForm={() => setShowReportForm(true)}
          />
        )}

        {activeTab === "vaccines" && (
          <VaccinationCenterView
            vaccines={vaccines}
          />
        )}

        {activeTab === "alerts" && (
          <AlertsView
            alerts={alerts}
            onResolveAlert={handleResolveAlert}
          />
        )}

        {activeTab === "news" && (
          <NewsView news={news} />
        )}

        {activeTab === "observability" && (
          <ObservabilityLogsView
            sources={sources}
            logs={logs}
            onTriggerEtl={handleTriggerEtl}
            etlLoading={etlLoading}
          />
        )}

        {activeTab === "about" && (
          <AboutView />
        )}

      </main>

      {/* Modal - Disease Details handbook */}
      {selectedDisease && (
        <DiseaseDetailModal
          disease={selectedDisease}
          onClose={() => setSelectedDisease(null)}
          outbreaks={outbreaks}
          onTriggerAiExplanation={handleFetchAiOverview}
        />
      )}

      {/* Modal - Report local Outbreak entry */}
      {showReportForm && (
        <ReportOutbreakModal
          diseases={diseases}
          onClose={() => setShowReportForm(false)}
          onSubmit={handlePublishOutbreak}
        />
      )}

      {/* Footer bar */}
      <footer className="bg-white border-t-4 border-[#1A1A1A] py-8 text-center text-xs text-[#1A1A1A] mt-16 shrink-0 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="flex items-center gap-2 font-bold">
            <span className="p-1.5 bg-[#FF5F1F] rounded-md border border-[#1A1A1A] inline-block shadow-[1px_1px_0_#1A1A1A]">
              <Heart className="w-3.5 h-3.5 text-white fill-white shrink-0" />
            </span>
            Empowering public health intelligence worldwide. Stay Safe, Stay Informed!
          </p>
          <div className="flex flex-wrap gap-2.5 font-mono text-[9px] text-slate-500 font-bold justify-center">
            <span className="px-2 py-0.5 bg-[#FAF4EE] border-2 border-[#1A1A1A] rounded">surveillance: ACTIVE</span>
            <span className="px-2 py-0.5 bg-[#FAF4EE] border-2 border-[#1A1A1A] rounded">feed: CDC / WHO API</span>
            <span className="px-2 py-0.5 bg-[#FAF4EE] border-2 border-[#1A1A1A] rounded">preset: 10YL</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
