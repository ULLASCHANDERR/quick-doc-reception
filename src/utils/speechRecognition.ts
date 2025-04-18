
// Speech recognition utility for converting speech to text

export const startSpeechRecognition = (
  onResult: (text: string) => void,
  onError: (error: string) => void
) => {
  // Check if browser supports speech recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    onError("Speech recognition is not supported in this browser.");
    return null;
  }
  
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };
  
  recognition.onerror = (event) => {
    onError(`Error occurred in recognition: ${event.error}`);
  };
  
  recognition.start();
  
  return recognition;
};

export const stopSpeechRecognition = (recognition: any) => {
  if (recognition) {
    recognition.stop();
  }
};
