
import React from "react";
import { useToast } from "@/components/ui/use-toast";
import PatientInfoForm from "@/components/PatientInfoForm";
import ClinicHeader from "@/components/ClinicHeader";
import FloatingElements from "@/components/FloatingElements";

const Index = () => {
  return (
    <div className="min-h-screen relative medical-gradient">
      <FloatingElements />
      
      <div className="container mx-auto px-4 py-10 relative z-10">
        <ClinicHeader />
        
        <div className="form-card max-w-4xl mx-auto">
          <PatientInfoForm />
        </div>
        
        <footer className="mt-10 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} QuickDoc Medical Center • Privacy Policy</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
