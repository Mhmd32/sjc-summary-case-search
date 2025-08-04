import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// TypeScript declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface VoiceSearchProps {
  onSearchUpdate: (searchTerm: string) => void;
  isListening?: boolean;
  onListeningChange?: (listening: boolean) => void;
}

const VoiceSearch: React.FC<VoiceSearchProps> = ({
  onSearchUpdate,
  isListening = false,
  onListeningChange
}) => {
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'ar-SA'; // Arabic support

      recognitionInstance.onstart = () => {
        onListeningChange?.(true);
      };

      recognitionInstance.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        
        if (event.results[current].isFinal) {
          onSearchUpdate(transcript);
          toast({
            title: "Voice search captured",
            description: `Searching for: "${transcript}"`,
          });
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        onListeningChange?.(false);
        toast({
          title: "Voice search error",
          description: "Please try again or use text search",
          variant: "destructive",
        });
      };

      recognitionInstance.onend = () => {
        onListeningChange?.(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [onSearchUpdate, onListeningChange, toast]);

  const startListening = () => {
    if (recognition && !isListening) {
      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        toast({
          title: "Voice search unavailable",
          description: "Please use text search instead",
          variant: "destructive",
        });
      }
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <Button
      variant={isListening ? "destructive" : "accent"}
      size="icon"
      onClick={isListening ? stopListening : startListening}
      className={`transition-all duration-300 ${
        isListening ? 'animate-pulse-gentle' : ''
      }`}
      title={isListening ? "Stop voice search" : "Start voice search"}
    >
      {isListening ? (
        <MicOff className="h-5 w-5" />
      ) : (
        <Mic className="h-5 w-5" />
      )}
    </Button>
  );
};

export default VoiceSearch;