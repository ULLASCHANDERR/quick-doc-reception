
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import SpeechInput from "./SpeechInput";
import { findPatientById, analyzeSymptoms, generatePatientReport, PatientData } from "@/services/patientService";
import { ArrowRight, ClipboardCheck, Asterisk, AlertCircle, Loader2, FileText, FileUp } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const QuickCheckIn = ({ onSwitchToFullForm }: { onSwitchToFullForm: () => void }) => {
  const [patientId, setPatientId] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [urgency, setUrgency] = useState("regular");
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Handle patient verification
  const handleVerifyPatient = async () => {
    if (patientId.trim().length < 4) {
      toast.error("Please enter a valid patient ID");
      return;
    }
    
    setIsLoading(true);
    try {
      const patient = await findPatientById(patientId);
      
      if (patient) {
        setPatientData(patient);
        setIsVerified(true);
        toast.success(`Welcome back, ${patient.firstName} ${patient.lastName}!`);
      } else {
        toast.error("Patient ID not found. Please try again or register as a new patient.");
      }
    } catch (error) {
      toast.error("Error verifying patient ID. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (symptoms.trim().length < 10) {
      toast.error("Please describe your symptoms in more detail.");
      return;
    }
    
    setIsLoading(true);
    try {
      // Analyze symptoms with ML model
      const analysis = await analyzeSymptoms(symptoms);
      setAnalysisResults(analysis);
      toast.success("Analysis complete!");
      
      console.log("Check-in successful:", { patientId, symptoms, urgency, analysis });
    } catch (error) {
      toast.error("Error analyzing symptoms. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!patientData || !analysisResults) return;
    
    setIsGeneratingReport(true);
    try {
      const reportUrl = await generatePatientReport(patientData, analysisResults);
      toast.success("Report generated successfully!", {
        description: "Your report is ready for download.",
        action: {
          label: "Download",
          onClick: () => console.log("Downloading report:", reportUrl),
        },
      });
    } catch (error) {
      toast.error("Error generating report. Please try again.");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleSpeechInput = (text: string) => {
    setSymptoms(prev => prev ? `${prev} ${text}` : text);
  };

  const resetForm = () => {
    setPatientId("");
    setSymptoms("");
    setUrgency("regular");
    setIsVerified(false);
    setPatientData(null);
    setAnalysisResults(null);
  };

  return (
    <div className="animate-fade-in">
      {!isVerified ? (
        <div className="space-y-4">
          <div className="flex items-center mb-2 text-primary">
            <Asterisk size={18} className="mr-2" />
            <h2 className="text-xl font-semibold">Quick Check-in</h2>
          </div>
          
          <p className="text-sm text-gray-500 mb-4">
            Enter your patient ID for a quick check-in. Only your symptoms will be required.
            <span className="block mt-2 italic">For demo, try IDs: 1234, 5678, or 9012</span>
          </p>
          
          <div className="flex gap-2">
            <div className="flex-grow">
              <Input
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="Enter your patient ID"
                className="border-medical-blue/20 focus-visible:ring-medical-blue"
              />
            </div>
            <Button 
              onClick={handleVerifyPatient}
              className="bg-secondary hover:bg-secondary/90 gap-2"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight size={16} />}
              Verify
            </Button>
          </div>
          
          <div className="mt-4 text-center">
            <button 
              onClick={onSwitchToFullForm} 
              className="text-sm text-primary hover:underline"
            >
              New patient? Complete full form
            </button>
          </div>
        </div>
      ) : analysisResults ? (
        <div className="space-y-6">
          <div className="flex items-center mb-2 text-primary">
            <FileText size={18} className="mr-2" />
            <h2 className="text-xl font-semibold">Analysis Results</h2>
          </div>
          
          <Card className="border-green-100">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg">Possible Conditions</h3>
                  <ul className="mt-2 space-y-2">
                    {analysisResults.possibleConditions.map((condition: any, index: number) => (
                      <li key={index} className="flex items-center justify-between">
                        <span>{condition.name}</span>
                        <span className="text-sm px-2 py-1 bg-blue-50 rounded-full">
                          {Math.round(condition.probability * 100)}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg">Recommended Actions</h3>
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    {analysisResults.recommendedActions.map((action: string, index: number) => (
                      <li key={index}>{action}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Triage Recommendation:</span>
                    <span className="capitalize px-2 py-1 bg-white rounded-full text-sm">
                      {analysisResults.triageRecommendation}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-medium">Severity:</span>
                    <span className="capitalize px-2 py-1 bg-white rounded-full text-sm">
                      {analysisResults.severity}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={resetForm}
            >
              Start Over
            </Button>
            
            <Button
              onClick={handleGenerateReport}
              className="bg-primary hover:bg-primary/90 gap-2"
              disabled={isGeneratingReport}
            >
              {isGeneratingReport ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileUp size={18} />
              )}
              Generate PDF Report
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center mb-2 text-primary">
              <AlertCircle size={18} className="mr-2" />
              <h2 className="text-xl font-semibold">Tell us why you're here today</h2>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <p className="text-sm">
                <span className="font-medium">Patient:</span> {patientData?.firstName} {patientData?.lastName}
              </p>
              <p className="text-sm">
                <span className="font-medium">ID:</span> {patientData?.id}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="quick-symptoms">Describe your symptoms</Label>
                <SpeechInput onTextReceived={handleSpeechInput} />
              </div>
              <Textarea
                id="quick-symptoms"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Please describe what brought you in today... (You can also use the microphone button to speak)"
                className="min-h-[120px] border-medical-blue/20 focus-visible:ring-medical-blue"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>How urgent is your condition?</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "regular", label: "Regular", color: "bg-green-100 hover:bg-green-200 border-green-300" },
                  { value: "soon", label: "Soon", color: "bg-yellow-100 hover:bg-yellow-200 border-yellow-300" },
                  { value: "urgent", label: "Urgent", color: "bg-red-100 hover:bg-red-200 border-red-300" }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`p-3 rounded border ${option.color} ${
                      urgency === option.value ? "ring-2 ring-offset-1 ring-primary" : ""
                    }`}
                    onClick={() => setUrgency(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button 
              type="button" 
              onClick={resetForm}
              className="text-sm text-gray-500 hover:underline"
            >
              Back
            </button>
            
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90 gap-2"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ClipboardCheck size={18} />
              )}
              Analyze Symptoms
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default QuickCheckIn;
