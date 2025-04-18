
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

  if (error) throw error;

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

    if (conditionError) throw conditionError;
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
};

// Save check-in data and analyze symptoms
export const saveCheckIn = async (
  patientId: string,
  description: string,
  urgency: string,
  symptoms: string[]
): Promise<{ checkInId: string; analysisResults: AnalysisResult }> => {
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

  if (checkInError) throw checkInError;

  // Get symptom IDs from the symptoms table
  const { data: symptomData, error: symptomError } = await supabase
    .rpc('extract_symptoms', { symptom_text: description })
    .select();

  if (symptomError) throw symptomError;

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

    if (linkError) throw linkError;
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

  if (analysisError) throw analysisError;

  return {
    checkInId: checkIn.id,
    analysisResults: mockAnalysis,
  };
};

// Find patient by ID
export const findPatientById = async (patientId: string): Promise<PatientData | null> => {
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
    if (error.code === "PGRST116") return null; // Record not found
    throw error;
  }

  return {
    id: patient.id,
    firstName: patient.first_name,
    lastName: patient.last_name,
    dateOfBirth: patient.date_of_birth,
    phone: patient.phone,
    email: patient.email,
    existingConditions: patient.patient_conditions?.map(c => c.condition_name) || [],
  };
};
