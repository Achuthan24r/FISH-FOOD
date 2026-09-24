/**
 * Web Speech API Voice Recognition Service for multilingual input (English and Tamil).
 * Enables voice-to-text for farmers with low digital literacy.
 */

// Declare Web Speech API types for browser compatibility
interface SpeechRecognitionEvent extends Event {
  results: {
    length: number;
    item?: (index: number) => any;
    [index: number]: {
      length: number;
      [index: number]: {
        transcript: string;
      };
      isFinal?: boolean;
    };
  };
}

export class VoiceRecognitionService {
  private recognition: any = null;
  private isListening = false;

  constructor() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
    }
  }

  public isSupported(): boolean {
    return Boolean(
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    );
  }

  public startListening(
    lang: 'en' | 'ta',
    onResult: (transcript: string) => void,
    onError?: (error: string) => void,
    onEnd?: () => void
  ) {
    if (!this.recognition) {
      if (onError) onError('Speech recognition not supported in this browser.');
      return;
    }

    try {
      this.recognition.lang = lang === 'ta' ? 'ta-IN' : 'en-IN';
      this.isListening = true;

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        let fullTranscript = '';
        for (let i = 0; i < event.results.length; ++i) {
          fullTranscript += event.results[i][0].transcript + ' ';
        }
        onResult(fullTranscript.trim());
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (onError) onError(event.error);
        this.isListening = false;
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      this.recognition.start();
    } catch (err: any) {
      console.warn('Error starting speech recognition:', err);
      if (onError) onError(err.message || 'Error starting speech');
      this.isListening = false;
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

export const speechService = new VoiceRecognitionService();
