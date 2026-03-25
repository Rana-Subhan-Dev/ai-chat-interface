/**
 * @file FileAttachmentBtn.jsx
 * @description Paperclip button that opens file picker.
 *              Accepts images, PDFs, text files, and documents.
 *              Calls parent's addFile callback with selected files.
 */

import React, { useRef } from 'react';

const FileAttachmentBtn = ({ onFileSelect }) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      onFileSelect(selectedFiles);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-lg hover:bg-gray-100"
        title="Attach file"
        type="button"
      >
        📎
      </button>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileChange}
        accept="image/*,.pdf,.txt,.doc,.docx"
      />
    </>
  );
};

export default FileAttachmentBtn;
