
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { startSpeechRecognition, stopSpeechRecognition } from "@/utils/speechRecognition";
import { toast } from "sonner";

interface SpeechInputProps {
  onTextReceived: (text: string) => void;
  disabled?: boolean;
}

const SpeechInput: React.FC<SpeechInputProps> = ({ onTextReceived, disabled = false }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  const toggleListening = () => {
    if (disabled) return;
    
    if (isListening) {
      stopSpeechRecognition(recognition);
      setIsListening(false);
      setRecognition(null);
    } else {
      const recognitionInstance = startSpeechRecognition(
        (text) => {
          onTextReceived(text);
          setIsListening(false);
          setRecognition(null);
          toast.success("Speech captured successfully!");
        },
        (error) => {
          toast.error(error);
          setIsListening(false);
          setRecognition(null);
        }
      );
      
      if (recognitionInstance) {
        setIsListening(true);
        setRecognition(recognitionInstance);
        toast.info("Listening... Speak now.");
      }
    }
  };

  return (
    <Button
      type="button"
      onClick={toggleListening}
      variant="outline"
      size="icon"
      className={`${isListening ? "bg-red-100 text-red-600" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      disabled={disabled}
      title={isListening ? "Stop listening" : "Speak to enter text"}
    >
      {isListening ? <MicOff size={18} /> : <Mic size={18} />}
    </Button>
  );
};

export default SpeechInput;
