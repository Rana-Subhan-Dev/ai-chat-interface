/**
 * @file useVoiceInput.js
 * @description Custom hook for Web Speech API integration.
 *              Handles voice recording, transcription, and error states.
 *              Uses window.SpeechRecognition (native browser API).
 * @returns {Object} { isListening, transcript, error, startListening, stopListening, resetTranscript, isSupported }
 */

import { useState, useEffect, useRef } from 'react';

const useVoiceInput = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Keep recording until user stops
    recognition.interimResults = false; // Only get final results (cleaner UX)
    recognition.lang = 'en-US'; // English only

    // Handle successful transcription
    recognition.onresult = (event) => {
      let finalTranscript = '';

      // Collect all results
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        }
      }

      if (finalTranscript) {
        setTranscript((prev) => prev + finalTranscript);
        setError(''); // Clear any previous errors
      }
    };

    // Handle errors
    recognition.onerror = (event) => {
      let errorMessage = 'Speech recognition error';

      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please try again.';
          break;
        case 'network':
          errorMessage = 'Network error. Check your connection.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Check browser permissions.';
          break;
        case 'audio-capture':
          errorMessage = 'No microphone found. Check your device.';
          break;
        default:
          errorMessage = `Error: ${event.error}`;
      }

      setError(errorMessage);
      setIsListening(false);
    };

    // Handle stop
    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (!recognitionRef.current || !isSupported) return;

    setError('');
    setTranscript(''); // Reset transcript for new recording
    setIsListening(true);

    try {
      recognitionRef.current.start();
    } catch (err) {
      // Ignore "already started" errors
      console.error('Voice input error:', err);
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;

    try {
      recognitionRef.current.stop();
    } catch (err) {
      console.error('Error stopping recognition:', err);
    }

    setIsListening(false);
  };

  const resetTranscript = () => {
    setTranscript('');
    setError('');
  };

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
  };
};

export default useVoiceInput;