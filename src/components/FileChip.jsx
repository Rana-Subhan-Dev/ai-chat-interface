/**
 * @file FileChip.jsx
 * @description Single file chip — displays file icon, name, and remove button.
 *              Renders inside message bubbles or preview bar.
 */

import React from 'react';
import { getFileIcon, formatFileSize, isImageFile } from '../utils/fileHelpers';

const FileChip = ({ file, onRemove, isPreview = false }) => {
  const icon = getFileIcon(file.name);
  const isImage = isImageFile({ type: file.type });

  // For preview bar — show remove button
  if (isPreview) {
    return (
      <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200 text-sm">
        <span className="text-lg">{icon}</span>
        <div className="flex-1 min-w-0">
          <p className="truncate font-medium text-gray-800">{file.name}</p>
          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
        </div>
        <button
          onClick={() => onRemove(file.id)}
          className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
          type="button"
          title="Remove file"
        >
          ✕
        </button>
      </div>
    );
  }

  // For message bubble — no remove button, compact
  return (
    <a
      href={file.base64}
      download={file.name}
      className="inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-xs font-medium text-gray-700 transition-colors cursor-pointer"
      title={`${file.name} (${formatFileSize(file.size)})`}
    >
      <span>{icon}</span>
      <span className="max-w-xs truncate">{file.name}</span>
    </a>
  );
};

export default FileChip;
