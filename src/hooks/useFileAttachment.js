/**
 * @file useFileAttachment.js
 * @description Custom hook for managing file attachments — handles file selection,
 *              validation, base64 conversion, and state management.
 */

import { useState, useCallback } from 'react';
import { validateFile, fileToBase64 } from '../utils/fileHelpers';

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Hook for managing file attachments
 * @returns {Object} { files, addFile, removeFile, clearFiles, error }
 */
export const useFileAttachment = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);

  /**
   * Handle file selection from input
   * Validates, converts to base64, and adds to state
   */
  const addFile = useCallback(async (newFiles) => {
    setError(null);

    try {
      // Check if adding new files would exceed limit
      if (files.length + newFiles.length > MAX_FILES) {
        setError(`Maximum ${MAX_FILES} files allowed per message`);
        return;
      }

      // Validate and convert each file
      const processedFiles = [];
      for (const file of newFiles) {
        const validation = validateFile(file, MAX_FILE_SIZE);

        if (!validation.isValid) {
          setError(validation.error);
          return;
        }

        // Convert to base64
        const base64 = await fileToBase64(file);
        processedFiles.push({
          id: `${Date.now()}-${Math.random()}`, // Unique ID for removal
          name: file.name,
          size: file.size,
          type: file.type,
          base64, // Full data URL (base64 encoded)
        });
      }

      setFiles((prev) => [...prev, ...processedFiles]);
    } catch (err) {
      setError(`Error processing file: ${err.message}`);
    }
  }, [files.length]);

  /**
   * Remove a single file by ID
   */
  const removeFile = useCallback((fileId) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    setError(null);
  }, []);

  /**
   * Clear all selected files
   */
  const clearFiles = useCallback(() => {
    setFiles([]);
    setError(null);
  }, []);

  return {
    files,
    addFile,
    removeFile,
    clearFiles,
    error,
  };
};
