
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type PatientData = {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone: string;
  email: string | null;
  existingConditions: string[];
};

export type SymptomData = {
  id: string;
  name: string;
};

export type AnalysisResult = {
  specialty: Database["public"]["Enums"]["doctor_specialty"];
  possibleConditions: { name: string; probability: number }[];
  recommendedActions: string[];
  severity: string;
  triageRecommendation: string;
  doctorNotes?: string;
};

// Save patient data to Supabase
export const savePatient = async (patientData: Omit<PatientData, "id">): Promise<PatientData> => {
  console.log("Saving patient data:", patientData);

  try {
    const { data: patient, error } = await supabase
      .from("patients")
      .insert({
        first_name: patientData.firstName,
        last_name: patientData.lastName,
        date_of_birth: patientData.dateOfBirth,
        phone: patientData.phone,
        email: patientData.email,
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving patient:", error);
      throw error;
    }

    console.log("Patient saved successfully:", patient);

    // Save existing conditions
    if (patientData.existingConditions.length > 0) {
      const { error: conditionError } = await supabase
        .from("patient_conditions")
        .insert(
          patientData.existingConditions.map(condition => ({
            patient_id: patient.id,
            condition_name: condition,
          }))
        );

      if (conditionError) {
        console.error("Error saving conditions:", conditionError);
        throw conditionError;
      }
    }

    return {
      id: patient.id,
      firstName: patient.first_name,
      lastName: patient.last_name,
      dateOfBirth: patient.date_of_birth,
      phone: patient.phone,
      email: patient.email,
      existingConditions: patientData.existingConditions,
    };
  } catch (error) {
    console.error("Failed to save patient:", error);
    throw error;
  }
};

// Save check-in data and analyze symptoms
export const saveCheckIn = async (
  patientId: string,
  description: string,
  urgency: string,
  symptoms: string[]
): Promise<{ checkInId: string; analysisResults: AnalysisResult }> => {
  console.log("Creating check-in for patient:", patientId);
  console.log("Symptoms:", description);
  console.log("Urgency:", urgency);

  try {
    // Create check-in
    const { data: checkIn, error: checkInError } = await supabase
      .from("check_ins")
      .insert({
        patient_id: patientId,
        description,
        urgency,
      })
      .select()
      .single();

    if (checkInError) {
      console.error("Error creating check-in:", checkInError);
      throw checkInError;
    }

    console.log("Check-in created:", checkIn);

    // Get symptom IDs from the symptoms table
    const { data: symptomData, error: symptomError } = await supabase
      .rpc('extract_symptoms', { symptom_text: description })
      .select();

    if (symptomError) {
      console.error("Error extracting symptoms:", symptomError);
      throw symptomError;
    }

    console.log("Extracted symptoms:", symptomData);

    // Link symptoms to check-in
    if (symptomData.length > 0) {
      const { error: linkError } = await supabase
        .from("check_in_symptoms")
        .insert(
          symptomData.map((symptom: { symptom_id: string }) => ({
            check_in_id: checkIn.id,
            symptom_id: symptom.symptom_id,
          }))
        );

      if (linkError) {
        console.error("Error linking symptoms:", linkError);
        throw linkError;
      }
    }

    // Mock analysis for now - in a real app this would call an AI model
    const mockAnalysis: AnalysisResult = {
      specialty: "general_medicine",
      possibleConditions: [
        { name: "Common Cold", probability: 0.75 },
        { name: "Seasonal Allergies", probability: 0.65 },
      ],
      recommendedActions: [
        "Rest and hydration",
        "Over-the-counter pain relievers",
      ],
      severity: "mild",
      triageRecommendation: "standard",
    };

    // Save analysis results
    const { data: analysis, error: analysisError } = await supabase
      .from("analysis_results")
      .insert({
        check_in_id: checkIn.id,
        specialty: mockAnalysis.specialty,
        possible_conditions: mockAnalysis.possibleConditions,
        recommended_actions: mockAnalysis.recommendedActions,
        severity: mockAnalysis.severity,
        triage_recommendation: mockAnalysis.triageRecommendation,
      })
      .select()
      .single();

    if (analysisError) {
      console.error("Error saving analysis:", analysisError);
      throw analysisError;
    }

    console.log("Analysis saved:", analysis);

    return {
      checkInId: checkIn.id,
      analysisResults: mockAnalysis,
    };
  } catch (error) {
    console.error("Failed to process check-in:", error);
    throw error;
  }
};

// Find patient by ID
export const findPatientById = async (patientId: string): Promise<PatientData | null> => {
  console.log("Finding patient by ID:", patientId);

  try {
    // For demo purposes, support some test IDs
    if (patientId === "1234" || patientId === "5678" || patientId === "9012") {
      return {
        id: patientId,
        firstName: patientId === "1234" ? "John" : patientId === "5678" ? "Jane" : "Alex",
        lastName: patientId === "1234" ? "Doe" : patientId === "5678" ? "Smith" : "Johnson",
        dateOfBirth: "1990-01-01",
        phone: "555-123-4567",
        email: `patient${patientId}@example.com`,
        existingConditions: patientId === "1234" ? ["Hypertension"] : patientId === "5678" ? ["Diabetes"] : ["Asthma"],
      };
    }

    const { data: patient, error } = await supabase
      .from("patients")
      .select(`
        *,
        patient_conditions (
          condition_name
        )
      `)
      .eq("id", patientId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        console.log("Patient not found");
        return null; // Record not found
      }
      console.error("Error finding patient:", error);
      throw error;
    }

    console.log("Patient found:", patient);

    return {
      id: patient.id,
      firstName: patient.first_name,
      lastName: patient.last_name,
      dateOfBirth: patient.date_of_birth,
      phone: patient.phone,
      email: patient.email,
      existingConditions: patient.patient_conditions?.map((c: any) => c.condition_name) || [],
    };
  } catch (error) {
    console.error("Failed to find patient:", error);
    throw error;
  }
};
