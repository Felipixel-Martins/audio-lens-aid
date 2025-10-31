import { useCallback } from "react";

export const useAudioFeedback = () => {
  const speak = useCallback((text: string, options?: { rate?: number; pitch?: number }) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = options?.rate || 1.0;
    utterance.pitch = options?.pitch || 1.0;
    window.speechSynthesis.speak(utterance);
  }, []);

  const playSound = useCallback((frequency: number, duration: number) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  }, []);

  const success = useCallback(() => {
    playSound(800, 0.15);
  }, [playSound]);

  const error = useCallback(() => {
    playSound(200, 0.3);
  }, [playSound]);

  const click = useCallback(() => {
    playSound(600, 0.1);
  }, [playSound]);

  return {
    speak,
    playSound,
    success,
    error,
    click
  };
};
