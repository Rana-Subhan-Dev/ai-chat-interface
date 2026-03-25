/**
 * @file ChatInput.jsx
 * @description Chat input component with text input, voice input, and file attachment.
 *              Integrates Web Speech API, file handling, and message submission.
 * @props {Function} onSendMessage - Callback when user sends a message
 * @props {Array} messages - Current messages (for context, optional)
 */

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import VoiceInput from './VoiceInput';
import FileAttachmentBtn from './FileAttachmentBtn';
import FilePreviewBar from './FilePreviewBar';
import useVoiceInput from '../hooks/useVoiceInput';
import useFileAttachment from '../hooks/useFileAttachment';

const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const {
    isListening,
    transcript,
    error: voiceError,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: isVoiceSupported,
  } = useVoiceInput();

  const {
    files,
    error: fileError,
    addFiles,
    removeFile,
    resetFiles,
  } = useFileAttachment();

  // Auto-fill message when voice transcript is ready
  React.useEffect(() => {
    if (transcript && !isListening) {
      setMessage((prev) => prev + transcript);
      resetTranscript();
    }
  }, [transcript, isListening, resetTranscript]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    // Don't send empty messages
    if (!message.trim() && files.length === 0) {
      return;
    }

    // Create message object with text and files
    const messageData = {
      text: message.trim(),
      files: files,
      timestamp: new Date().toISOString(),
    };

    onSendMessage(messageData);

    // Reset state
    setMessage('');
    resetFiles();
  };

  const handleKeyDown = (e) => {
    // Send message on Enter (but not Shift+Enter for multiline)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="w-full border-t border-gray-200 bg-white p-4">
      {/* Error messages */}
      {voiceError && (
        <div className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          🎙️ {voiceError}
        </div>
      )}
      {fileError && (
        <div className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          📎 {fileError}
        </div>
      )}

      {/* File preview bar */}
      {files.length > 0 && (
        <FilePreviewBar files={files} onRemoveFile={removeFile} />
      )}

      {/* Input area */}
      <form onSubmit={handleSendMessage} className="flex items-end gap-2">
        {/* Voice input button */}
        <VoiceInput
          transcript={transcript}
          isListening={isListening}
          isSupported={isVoiceSupported}
          onStartListening={startListening}
          onStopListening={stopListening}
        />

        {/* File attachment button */}
        <FileAttachmentBtn onFilesSelected={addFiles} />

        {/* Text input */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... or use voice input"
          className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          rows="3"
        />

        {/* Send button */}
        <button
          type="submit"
          disabled={!message.trim() && files.length === 0}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500 text-white transition-colors hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          title="Send message (Enter)"
        >
          <Send size={20} />
        </button>
      </form>

      {/* Helper text */}
      <div className="mt-2 text-xs text-gray-500">
        💡 Press Enter to send, Shift+Enter for new line. Use voice or attach files.
      </div>
    </div>
  );
};

export default ChatInput;