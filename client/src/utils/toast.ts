import { toast } from 'sonner';

// Speak message using Web Speech API
function speak(message: string) {
  // Cancel any ongoing speech to avoid overlap
  if (speechSynthesis.speaking || speechSynthesis.pending) {
    speechSynthesis.cancel();
  }

  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = 'en-US';
  speechSynthesis.speak(utterance);
}

// Unified toast + speech
export const toastWithVoice = {
  success: (msg: string, options = {}) => {
    speak(msg);
    toast.success(msg, options);
  },
  error: (msg: string, options = {}) => {
    speak(msg);
    toast.error(msg, options);
  },
  info: (msg: string, options = {}) => {
    speak(msg);
    toast(msg, options);
  },
};
