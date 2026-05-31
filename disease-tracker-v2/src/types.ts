/**
 * Global TypeScript Interface definitions for Disease Outbreak Tracker.
 */

export interface KidsFriendlySymptom {
  name: string;
  icon: string;
  descriptor: string;
}

export interface Disease {
  id: string;
  name: string;
  type: "Virus" | "Bacteria" | "Fungus" | "Parasite";
  firstDiscovered: string;
  transmissionMethods: string[];
  symptomsList: string[];
  riskGroups: string[];
  treatmentMethods: string[];
  vaccinationAvailable: boolean;
  mortalityRate: string;
  historicalOutbreaks: string;

  // 10YL Presentation Keys
  whatIsIt: string;
  howItSpreads: string;
  symptoms10YL: KidsFriendlySymptom[];
  staySafe10YL: string[];
  isThereVaccine10YL: string;
  whyCare10YL: string;
  whatToDoNow10YL: string[];
  benefitsOfPrevention: string[];
}

export interface VaccineDetails {
  diseaseId: string;
  diseaseName: string;
  vaccineName: string;
  available: boolean;
  doses: number;
  ageRecommendation: string;
  boosterRequirements: string;
  effectiveness: string;
  sideEffects: string[];
  whoRecommendation: string;
  countryAvailability: string;
}

export interface Outbreak {
  id: string;
  diseaseId: string;
  diseaseName: string;
  country: string;
  region: string;
  city: string;
  cases: number;
  deaths: number;
  recovered: number;
  latitude: number;
  longitude: number;
  active: boolean;
  firstDetected: string;
  lastUpdated: string;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
}

export interface DiseaseAlert {
  id: string;
  diseaseId: string;
  diseaseName: string;
  country: string;
  title: string;
  message: string;
  riskScore: number; // 0 to 100
  level: "Low" | "Medium" | "High" | "Critical";
  date: string;
  isRead: boolean;
}

export interface DataSource {
  id: string;
  name: string;
  type: "API" | "RSS" | "Web Scraping" | "Dataset";
  url: string;
  reliabilityScore: number; // 0-100
  updateFrequency: string;
  completenessScore: number; // 0-100
  active: boolean;
  status: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  summary: string;
  sentiment: string;
  url: string;
  date: string;
  trustScore: number;
}

export interface EtlLog {
  id: string;
  timestamp: string;
  stage: "Discovery" | "Validation" | "Scraping" | "ETL Pipeline" | "Warning Engine";
  level: "INFO" | "WARNING" | "ERROR";
  message: string;
}
