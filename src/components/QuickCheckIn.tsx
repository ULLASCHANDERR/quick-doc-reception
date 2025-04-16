
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowRight, ClipboardCheck, Asterisk, AlertCircle } from "lucide-react";

const QuickCheckIn = ({ onSwitchToFullForm }: { onSwitchToFullForm: () => void }) => {
  const [patientId, setPatientId] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [urgency, setUrgency] = useState("regular");
  const [isVerified, setIsVerified] = useState(false);

  // In a real app, this would verify against your database
  const handleVerifyPatient = () => {
    if (patientId.trim().length >= 4) {
      setIsVerified(true);
      // Demo patient name - in a real app, this would come from your database
      toast.success(`Welcome back, ${patientId === "1234" ? "John Smith" : "Patient #" + patientId}!`);
    } else {
      toast.error("Please enter a valid patient ID");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Quick check-in:", { patientId, symptoms, urgency });
    toast.success("Check-in successful! We'll call your name shortly.");
    
    // Reset form
    setPatientId("");
    setSymptoms("");
    setUrgency("regular");
    setIsVerified(false);
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
            <span className="block mt-2 italic">For demo, try ID: 1234</span>
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
            >
              Verify <ArrowRight size={16} />
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
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center mb-2 text-primary">
              <AlertCircle size={18} className="mr-2" />
              <h2 className="text-xl font-semibold">Tell us why you're here today</h2>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quick-symptoms">Describe your symptoms</Label>
              <Textarea
                id="quick-symptoms"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Please describe what brought you in today..."
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
              onClick={() => setIsVerified(false)}
              className="text-sm text-gray-500 hover:underline"
            >
              Back
            </button>
            
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90 gap-2"
              size="lg"
            >
              <ClipboardCheck size={18} />
              Complete Quick Check-in
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default QuickCheckIn;
