/**
 * @file ChatInput.jsx (MODIFIED)
 * @description Chat input component with file attachment support.
 *              Integrates FileAttachmentBtn and FilePreviewBar.
 */

import React, { useState } from 'react';
import FileAttachmentBtn from './FileAttachmentBtn';
import FilePreviewBar from './FilePreviewBar';
import { useFileAttachment } from '../hooks/useFileAttachment';

const ChatInput = ({ onSendMessage, isLoading = false }) => {
  const [message, setMessage] = useState('');
  const { files, addFile, removeFile, clearFiles, error } = useFileAttachment();

  const handleSendMessage = () => {
    if (!message.trim() && files.length === 0) return;

    // Send message with attached files
    onSendMessage({
      text: message.trim(),
      files: files, // Array of { id, name, size, type, base64 }
    });

    // Clear input and files
    setMessage('');
    clearFiles();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="border-t border-gray-300 bg-white">
      {/* File preview bar */}
      <FilePreviewBar files={files} onRemove={removeFile} error={error} />

      {/* Input area */}
      <div className="p-4 flex gap-3">
        {/* File attachment button */}
        <FileAttachmentBtn onFileSelect={addFile} />

        {/* Text input */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Shift+Enter for new line)"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none max-h-24"
          rows="2"
          disabled={isLoading}
        />

        {/* Send button */}
        <button
          onClick={handleSendMessage}
          disabled={isLoading || (!message.trim() && files.length === 0)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          type="button"
          title="Send message"
        >
          {isLoading ? '...' : '➤'}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
