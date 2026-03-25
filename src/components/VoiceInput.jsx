/**
 * @file VoiceInput.jsx
 * @description Voice input button component using Web Speech API.
 *              Renders mic button with recording state, pulse animation, and tooltips.
 *              Integrates with ChatInput to auto-fill transcript.
 * @props {Object} { transcript, isListening, isSupported, onStartListening, onStopListening, onTranscriptSet }
 */

import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { getVoiceSupportMessage } from '../utils/voiceHelpers';
import './VoiceInput.css';

const VoiceInput = ({
  transcript,
  isListening,
  isSupported,
  onStartListening,
  onStopListening,
}) => {
  const handleClick = () => {
    if (isListening) {
      onStopListening();
    } else {
      onStartListening();
    }
  };

  const tooltipMessage = getVoiceSupportMessage();

  return (
    <button
      onClick={handleClick}
      disabled={!isSupported}
      className={`voice-input-btn ${isListening ? 'recording' : ''}`}
      title={isListening ? 'Stop recording' : 'Start voice input'}
      aria-label={isListening ? 'Stop recording' : 'Start voice input'}
    >
      {isListening ? (
        <MicOff className="voice-input-icon" size={20} />
      ) : (
        <Mic className="voice-input-icon" size={20} />
      )}
      {!isSupported && (
        <div className="voice-input-tooltip">{tooltipMessage}</div>
      )}
    </button>
  );
};

export default VoiceInput;