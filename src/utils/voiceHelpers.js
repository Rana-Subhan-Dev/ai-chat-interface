/**
 * @file voiceHelpers.js
 * @description Utility functions for voice input feature.
 *              Checks browser support, formats error messages, manages permissions.
 */

/**
 * Check if browser supports Web Speech API
 * @returns {boolean} true if supported, false otherwise
 */
export const isSpeechRecognitionSupported = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  return !!SpeechRecognition;
};

/**
 * Get browser name for error messages
 * @returns {string} Browser name (Chrome, Firefox, Safari, Edge, Unknown)
 */
export const getBrowserName = () => {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Edge')) return 'Edge';
  return 'your browser';
};

/**
 * Get support status message for unsupported browsers
 * @returns {string} Support message with browser info
 */
export const getVoiceSupportMessage = () => {
  const browserName = getBrowserName();
  if (browserName === 'Firefox') {
    return 'Voice input has limited support in Firefox. Use Chrome, Edge, or Safari.';
  }
  return `Voice input is not supported in ${browserName}. Use Chrome, Edge, or Safari.`;
};

/**
 * Request microphone permissions (used for explicit permission checks)
 * @returns {Promise<boolean>} true if permission granted, false otherwise
 */
export const requestMicrophonePermission = async () => {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    return true;
  } catch (error) {
    console.error('Microphone permission denied:', error);
    return false;
  }
};

/**
 * Trim and format transcript
 * @param {string} text - Raw transcript text
 * @returns {string} Trimmed transcript
 */
export const formatTranscript = (text) => {
  return text.trim();
};