import { supabase } from "@/integrations/supabase/client";
import { savePatient, findPatientById, saveCheckIn, PatientData, AnalysisResult } from "./supabaseService";
export { savePatient, findPatientById };

// Re-export the types from supabaseService
export type { PatientData, AnalysisResult };

// Simulate generating a PDF report and uploading to Supabase storage
export const generatePatientReport = async (patientData: PatientData, analysisResults: AnalysisResult): Promise<string> => {
  console.log("Generating PDF for patient:", patientData);
  console.log("With analysis results:", analysisResults);
  
  // Create a basic PDF-like content (in a real app, you'd use a PDF generation library)
  const reportContent = `
Patient Report for ${patientData.firstName} ${patientData.lastName}

Patient Details:
ID: ${patientData.id}
Date of Birth: ${patientData.dateOfBirth}
Phone: ${patientData.phone}
Email: ${patientData.email}

Analysis Results:
Specialty: ${analysisResults.specialty}
Possible Conditions:
${analysisResults.possibleConditions.map(condition => 
  `- ${condition.name} (${Math.round(condition.probability * 100)}%)`
).join('\n')}

Recommended Actions:
${analysisResults.recommendedActions.map(action => `- ${action}`).join('\n')}

Severity: ${analysisResults.severity}
Triage Recommendation: ${analysisResults.triageRecommendation}
`;

  // Convert text to Blob
  const reportBlob = new Blob([reportContent], { type: 'text/plain' });
  
  // Generate a unique filename
  const reportName = `patient-report-${patientData.id}-${Date.now()}.txt`;

  try {
    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('patient-documents')
      .upload(reportName, reportBlob, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error("Error uploading report:", error);
      throw error;
    }

    console.log("PDF report uploaded successfully:", data);
    
    // Return the path of the uploaded file
    return reportName;
  } catch (error) {
    console.error("Failed to generate and upload patient report:", error);
    throw error;
  }
};

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

  console.log("Analyzing symptoms:", symptoms);
  console.log("Analysis result:", mockAnalysis);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAnalysis);
    }, 1000);
  });
};
