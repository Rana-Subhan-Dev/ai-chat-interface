/**
 * @file fileHelpers.js
 * @description Utility functions for file handling — icons, sizes, type detection.
 *              Used across file attachment components.
 */

/**
 * Get the appropriate icon for a file type
 * @param {string} fileName - The name of the file
 * @returns {string} Icon name for UI rendering
 */
export const getFileIcon = (fileName) => {
  const extension = fileName.split('.').pop().toLowerCase();

  const iconMap = {
    pdf: '📄',
    txt: '📝',
    doc: '📘',
    docx: '📘',
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    gif: '🖼️',
    webp: '🖼️',
  };

  return iconMap[extension] || '📎';
};

/**
 * Check if a file is an image based on MIME type or extension
 * @param {File} file - The file object
 * @returns {boolean} True if file is an image
 */
export const isImageFile = (file) => {
  return file.type.startsWith('image/');
};

/**
 * Format file size in human-readable format (bytes → KB, MB, GB)
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size string
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Validate a file against constraints
 * @param {File} file - The file to validate
 * @param {number} maxSizeBytes - Max allowed file size in bytes (default: 10MB)
 * @param {Array<string>} allowedTypes - Allowed MIME types or extensions
 * @returns {Object} { isValid: boolean, error?: string }
 */
export const validateFile = (
  file,
  maxSizeBytes = 10 * 1024 * 1024, // 10MB default
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
) => {
  // Check file size
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `File is too large. Max size: ${formatFileSize(maxSizeBytes)}`,
    };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type not supported. Allowed: Images, PDF, TXT, DOC`,
    };
  }

  return { isValid: true };
};

/**
 * Convert a File to base64 string
 * @param {File} file - The file to convert
 * @returns {Promise<string>} Base64 encoded file data
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
