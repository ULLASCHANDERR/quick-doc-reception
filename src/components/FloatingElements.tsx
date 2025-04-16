
import React from "react";
import { Stethoscope, Heart, Pill, FirstAid } from "lucide-react";

const FloatingElements = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 text-medical-teal/30 animate-float" style={{ animationDelay: "0s" }}>
        <Heart size={36} />
      </div>
      <div className="absolute bottom-40 left-20 text-medical-blue/20 animate-float" style={{ animationDelay: "1.5s" }}>
        <Stethoscope size={48} />
      </div>
      <div className="absolute top-40 right-20 text-medical-green/20 animate-float" style={{ animationDelay: "1s" }}>
        <FirstAid size={40} />
      </div>
      <div className="absolute bottom-30 right-10 text-accent/20 animate-float" style={{ animationDelay: "2s" }}>
        <Pill size={32} />
      </div>
      
      <div className="absolute -bottom-[400px] -left-[300px] w-[800px] h-[800px] bg-medical-light-blue/30 rounded-full blur-3xl"></div>
      <div className="absolute -top-[300px] -right-[200px] w-[600px] h-[600px] bg-medical-teal/20 rounded-full blur-3xl"></div>
    </div>
  );
};

export default FloatingElements;
