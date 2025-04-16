
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
import { ClipboardCheck, Clock, User, Phone, FileText, MessageSquare, AlertCircle } from "lucide-react";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    toast.success("Check-in successful! We'll call your name shortly.", {
      description: "Your information has been received.",
    });
    
    // Reset form
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
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="form-section">
        <div className="flex items-center mb-2 text-primary">
          <User size={18} className="mr-2" /> 
          <h2 className="text-xl font-semibold">Personal Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className="border-medical-blue/20 focus-visible:ring-medical-blue"
              placeholder="Enter your first name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className="border-medical-blue/20 focus-visible:ring-medical-blue"
              placeholder="Enter your last name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-3 text-gray-400" />
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="pl-9 border-medical-blue/20 focus-visible:ring-medical-blue"
                placeholder="(000) 000-0000"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="border-medical-blue/20 focus-visible:ring-medical-blue"
              placeholder="your.email@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="border-medical-blue/20 focus-visible:ring-medical-blue"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="flex items-center mb-2 text-primary">
          <FileText size={18} className="mr-2" />
          <h2 className="text-xl font-semibold">Appointment Details</h2>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="appointmentType">Appointment Type</Label>
            <Select 
              onValueChange={(value) => handleSelectChange(value, "appointmentType")}
              value={formData.appointmentType}
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
              <Label>Urgency Level</Label>
            </div>
            <RadioGroup 
              defaultValue="regular" 
              value={formData.urgency}
              onValueChange={handleUrgencyChange}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="regular" id="regular" />
                <Label htmlFor="regular" className="font-normal">Regular (Non-urgent)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="soon" id="soon" />
                <Label htmlFor="soon" className="font-normal">Need to be seen soon</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="urgent" id="urgent" />
                <Label htmlFor="urgent" className="font-normal">Urgent (Severe symptoms)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
      
      <div className="form-section">
        <div className="flex items-center mb-2 text-primary">
          <MessageSquare size={18} className="mr-2" />
          <h2 className="text-xl font-semibold">Symptoms & Health Information</h2>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="symptoms">Describe Your Symptoms</Label>
            <Textarea
              id="symptoms"
              name="symptoms"
              value={formData.symptoms}
              onChange={handleInputChange}
              placeholder="Please describe what brought you in today..."
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
        >
          <ClipboardCheck size={18} />
          Complete Check-in
        </Button>
      </div>
    </form>
  );
};

export default PatientInfoForm;
