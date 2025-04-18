
// Global declarations for TypeScript

interface Window {
  SpeechRecognition?: new () => SpeechRecognition;
  webkitSpeechRecognition?: new () => SpeechRecognition;
}

// Extending existing types
declare namespace React {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // Allow for custom data attributes
    [dataAttribute: `data-${string}`]: any;
  }
}
