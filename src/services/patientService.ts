
// This is a mock service that would be replaced with actual API calls to Supabase

// Sample patient data
const mockPatientDatabase = [
  {
    id: "1234",
    firstName: "John",
    lastName: "Smith",
    dateOfBirth: "1985-06-15",
    phone: "(555) 123-4567",
    email: "john.smith@example.com",
    existingConditions: ["diabetes", "hypertension"],
  },
  {
    id: "5678",
    firstName: "Sarah",
    lastName: "Johnson",
    dateOfBirth: "1990-03-22",
    phone: "(555) 987-6543",
    email: "sarah.j@example.com",
    existingConditions: ["asthma"],
  },
  {
    id: "9012",
    firstName: "Michael",
    lastName: "Williams",
    dateOfBirth: "1975-11-08",
    phone: "(555) 456-7890",
    email: "mwilliams@example.com",
    existingConditions: ["arthritis"],
  },
];

export interface PatientData {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  existingConditions: string[];
}

// Simulates looking up a patient by ID
export const findPatientById = (patientId: string): PatientData | null => {
  const patient = mockPatientDatabase.find((p) => p.id === patientId);
  
  // Simulate API delay
  return new Promise<PatientData | null>((resolve) => {
    setTimeout(() => {
      resolve(patient || null);
    }, 500);
  });
};

// Simulates saving a patient (would save to Supabase in a real implementation)
export const savePatient = async (patientData: Omit<PatientData, "id">): Promise<PatientData> => {
  // Generate a random ID
  const newId = Math.floor(Math.random() * 9000) + 1000;
  
  const newPatient = {
    id: newId.toString(),
    ...patientData,
  };
  
  // Simulate API delay
  return new Promise<PatientData>((resolve) => {
    setTimeout(() => {
      resolve(newPatient);
    }, 500);
  });
};

// Simulate ML model analysis of symptoms
export const analyzeSymptoms = async (symptoms: string): Promise<any> => {
  // In a real application, this would call an ML model API
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock response from ML model
      resolve({
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
      });
    }, 1000);
  });
};

// Simulate generating a PDF report (in real app, would generate actual PDF)
export const generatePatientReport = async (patientData: PatientData, analysisResults: any): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this would return a PDF file URL or blob
      resolve(`patient-report-${patientData.id}.pdf`);
    }, 800);
  });
};
