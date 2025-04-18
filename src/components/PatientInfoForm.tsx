
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { savePatient, analyzeSymptoms, generatePatientReport } from "@/services/patientService";
import { ClipboardCheck, Clock, User, Phone, FileText, MessageSquare, AlertCircle, Loader2, FileUp } from "lucide-react";
import SpeechInput from "./SpeechInput";
import { Card, CardContent } from "./ui/card";

const PatientInfoForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    symptoms: "",
    urgency: "regular",
    appointmentType: "",
    existingConditions: [] as string[],
  });
  const [activeField, setActiveField] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [patientId, setPatientId] = useState("");

  const commonConditions = [
    { id: "diabetes", label: "Diabetes" },
    { id: "hypertension", label: "Hypertension" },
    { id: "asthma", label: "Asthma" },
    { id: "arthritis", label: "Arthritis" },
    { id: "allergies", label: "Allergies" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleUrgencyChange = (value: string) => {
    setFormData({ ...formData, urgency: value });
  };

  const handleCheckboxChange = (checked: boolean, id: string) => {
    setFormData({
      ...formData,
      existingConditions: checked
        ? [...formData.existingConditions, id]
        : formData.existingConditions.filter((item) => item !== id),
    });
  };

  const handleSpeechInput = (text: string) => {
    if (activeField === "symptoms") {
      setFormData({
        ...formData,
        symptoms: formData.symptoms ? `${formData.symptoms} ${text}` : text,
      });
    } else if (activeField === "firstName") {
      setFormData({ ...formData, firstName: text });
    } else if (activeField === "lastName") {
      setFormData({ ...formData, lastName: text });
    } else if (activeField === "phone") {
      setFormData({ ...formData, phone: text.replace(/[^0-9]/g, "") });
    } else if (activeField === "email") {
      setFormData({ ...formData, email: text.replace(/\s/g, "").toLowerCase() });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.dateOfBirth || !formData.symptoms || !formData.appointmentType) {
      toast.error("Please fill all required fields.");
      return;
    }
    
    setIsLoading(true);
    try {
      // Save patient data
      const savedPatient = await savePatient({
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        phone: formData.phone,
        email: formData.email,
        existingConditions: formData.existingConditions,
      });
      
      setPatientId(savedPatient.id);
      
      // Analyze symptoms
      const analysis = await analyzeSymptoms(formData.symptoms);
      setAnalysisResults(analysis);
      
      setIsSubmitted(true);
      toast.success("Registration successful! Your information has been received.");
      
      console.log("Form submitted:", { ...formData, id: savedPatient.id, analysis });
    } catch (error) {
      toast.error("Error processing your registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    try {
      const reportUrl = await generatePatientReport({
        id: patientId,
        ...formData
      }, analysisResults);
      
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

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      dateOfBirth: "",
      symptoms: "",
      urgency: "regular",
      appointmentType: "",
      existingConditions: [],
    });
    setIsSubmitted(false);
    setAnalysisResults(null);
    setPatientId("");
  };

  if (isSubmitted && analysisResults) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center mb-2 text-primary">
          <FileText size={18} className="mr-2" />
          <h2 className="text-xl font-semibold">Analysis Results</h2>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-lg mb-4">
          <p className="text-sm">
            <span className="font-medium">Patient:</span> {formData.firstName} {formData.lastName}
          </p>
          <p className="text-sm">
            <span className="font-medium">ID:</span> {patientId} (Keep this ID for future visits)
          </p>
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
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center mb-2 text-primary">
        <User size={18} className="mr-2" /> 
        <h2 className="text-xl font-semibold">New Patient Registration</h2>
      </div>
      
      <p className="text-sm text-gray-500 mb-6 bg-blue-50 p-3 rounded-lg border border-blue-100">
        Welcome! Please fill out this form to register as a new patient. Fields marked with an asterisk (*) are required.
        <span className="block mt-2">You can use the microphone button next to each field to enter information by voice.</span>
      </p>
      
      <div className="form-section">
        <div className="flex items-center mb-2 text-primary">
          <User size={18} className="mr-2" /> 
          <h2 className="text-lg font-semibold">Personal Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="firstName">First Name*</Label>
              <SpeechInput 
                onTextReceived={handleSpeechInput} 
                disabled={activeField !== "firstName"} 
              />
            </div>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              onFocus={() => setActiveField("firstName")}
              required
              className="border-medical-blue/20 focus-visible:ring-medical-blue"
              placeholder="Enter your first name"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="lastName">Last Name*</Label>
              <SpeechInput 
                onTextReceived={handleSpeechInput} 
                disabled={activeField !== "lastName"} 
              />
            </div>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              onFocus={() => setActiveField("lastName")}
              required
              className="border-medical-blue/20 focus-visible:ring-medical-blue"
              placeholder="Enter your last name"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="phone">Phone Number*</Label>
              <SpeechInput 
                onTextReceived={handleSpeechInput} 
                disabled={activeField !== "phone"} 
              />
            </div>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-3 text-gray-400" />
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                onFocus={() => setActiveField("phone")}
                required
                className="pl-9 border-medical-blue/20 focus-visible:ring-medical-blue"
                placeholder="(000) 000-0000"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="email">Email</Label>
              <SpeechInput 
                onTextReceived={handleSpeechInput} 
                disabled={activeField !== "email"} 
              />
            </div>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              onFocus={() => setActiveField("email")}
              className="border-medical-blue/20 focus-visible:ring-medical-blue"
              placeholder="your.email@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth*</Label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              onFocus={() => setActiveField("")}
              required
              className="border-medical-blue/20 focus-visible:ring-medical-blue"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="flex items-center mb-2 text-primary">
          <FileText size={18} className="mr-2" />
          <h2 className="text-lg font-semibold">Appointment Details</h2>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="appointmentType">Appointment Type*</Label>
            <Select 
              onValueChange={(value) => handleSelectChange(value, "appointmentType")}
              value={formData.appointmentType}
              required
            >
              <SelectTrigger className="border-medical-blue/20 focus:ring-medical-blue">
                <SelectValue placeholder="Select appointment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Checkup</SelectItem>
                <SelectItem value="followUp">Follow-up Appointment</SelectItem>
                <SelectItem value="specialist">Specialist Consultation</SelectItem>
                <SelectItem value="emergency">Urgent Care</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center mb-2">
              <Clock size={18} className="mr-2 text-primary" />
              <Label>Urgency Level*</Label>
            </div>
            
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
                    formData.urgency === option.value ? "ring-2 ring-offset-1 ring-primary" : ""
                  }`}
                  onClick={() => handleUrgencyChange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="form-section">
        <div className="flex items-center mb-2 text-primary">
          <MessageSquare size={18} className="mr-2" />
          <h2 className="text-lg font-semibold">Symptoms & Health Information</h2>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="symptoms">Describe Your Symptoms*</Label>
              <SpeechInput 
                onTextReceived={handleSpeechInput} 
                disabled={activeField !== "symptoms"} 
              />
            </div>
            <Textarea
              id="symptoms"
              name="symptoms"
              value={formData.symptoms}
              onChange={handleInputChange}
              onFocus={() => setActiveField("symptoms")}
              required
              placeholder="Please describe what brought you in today... (You can also use the microphone button to speak)"
              className="min-h-[120px] border-medical-blue/20 focus-visible:ring-medical-blue"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-start gap-2">
              <AlertCircle size={16} className="text-primary mt-0.5" />
              <span>Do you have any of these conditions?</span>
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {commonConditions.map((condition) => (
                <div key={condition.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={condition.id} 
                    checked={formData.existingConditions.includes(condition.id)}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange(checked as boolean, condition.id)
                    }
                  />
                  <label
                    htmlFor={condition.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {condition.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="form-section flex justify-end">
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
          Complete Registration
        </Button>
      </div>
    </form>
  );
};

export default PatientInfoForm;
