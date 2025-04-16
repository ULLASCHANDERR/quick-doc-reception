
import React from "react";
import { PlusCircle, Clock } from "lucide-react";

const ClinicHeader = () => {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center">
          <div className="mr-3 bg-primary rounded-full p-2 text-white">
            <PlusCircle size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              QuickDoc
            </h1>
            <p className="text-sm text-gray-500">Medical Center Reception</p>
          </div>
        </div>
        
        <div className="flex items-center mt-4 md:mt-0 gap-2 text-sm text-gray-600 bg-white/50 p-2 px-4 rounded-full shadow-sm border border-gray-100">
          <Clock size={16} className="text-primary" />
          <span>Open Today: 8:00 AM - 6:00 PM</span>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Patient Check-in</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mt-2">
          Welcome to QuickDoc Medical Center. Please fill in your information below to check in for your appointment. Our staff will call your name when it's your turn.
        </p>
      </div>
    </div>
  );
};

export default ClinicHeader;
