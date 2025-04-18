
import { savePatient, findPatientById, saveCheckIn, PatientData, AnalysisResult } from "./supabaseService";
export { savePatient, findPatientById };

// Re-export the types from supabaseService
export type { PatientData, AnalysisResult };

// Simulate ML model analysis of symptoms
export const analyzeSymptoms = async (symptoms: string): Promise<AnalysisResult> => {
  // In a real application, this would call an ML model API
  const mockAnalysis: AnalysisResult = {
    specialty: "general_medicine",
    possibleConditions: [
      { name: "Common Cold", probability: 0.75 },
      { name: "Seasonal Allergies", probability: 0.65 },
      { name: "Viral Infection", probability: 0.45 },
    ],
    recommendedActions: [
      "Rest and hydration",
      "Over-the-counter pain relievers",
      "Follow-up if symptoms persist beyond 7 days"
    ],
    severity: "mild",
    triageRecommendation: "standard"
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAnalysis);
    }, 1000);
  });
};

// Simulate generating a PDF report
export const generatePatientReport = async (patientData: PatientData, analysisResults: AnalysisResult): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`patient-report-${patientData.id}.pdf`);
    }, 800);
  });
};
