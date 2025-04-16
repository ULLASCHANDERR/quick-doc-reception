
import React, { useState } from "react";
import PatientInfoForm from "@/components/PatientInfoForm";
import ClinicHeader from "@/components/ClinicHeader";
import FloatingElements from "@/components/FloatingElements";
import QuickCheckIn from "@/components/QuickCheckIn";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shuffle, UserPlus } from "lucide-react";

const Index = () => {
  const [activeForm, setActiveForm] = useState<"quick" | "full">("quick");

  return (
    <div className="min-h-screen relative medical-gradient">
      <FloatingElements />
      
      <div className="container mx-auto px-4 py-10 relative z-10">
        <ClinicHeader />
        
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-medical-teal/10">
            <Tabs 
              value={activeForm}
              onValueChange={(value) => setActiveForm(value as "quick" | "full")}
              className="w-full max-w-md mx-auto"
            >
              <TabsList className="grid grid-cols-2 mb-2 w-full">
                <TabsTrigger value="quick" className="flex items-center gap-2">
                  <Shuffle size={16} />
                  <span>Quick Check-in</span>
                </TabsTrigger>
                <TabsTrigger value="full" className="flex items-center gap-2">
                  <UserPlus size={16} />
                  <span>New Patient</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="quick">
                <QuickCheckIn onSwitchToFullForm={() => setActiveForm("full")} />
              </TabsContent>
              
              <TabsContent value="full">
                <PatientInfoForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <footer className="mt-10 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} QuickDoc Medical Center • Privacy Policy</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
