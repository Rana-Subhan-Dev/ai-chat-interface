/**
 * @file FilePreviewBar.jsx
 * @description Preview bar shown above chat input — displays selected files as chips.
 *              Shows file previews and allows removal before sending.
 */

import React from 'react';
import FileChip from './FileChip';
import { isImageFile } from '../utils/fileHelpers';

const FilePreviewBar = ({ files, onRemove, error }) => {
  if (files.length === 0 && !error) {
    return null;
  }

  // Separate images and non-images
  const images = files.filter((f) => isImageFile({ type: f.type }));
  const nonImages = files.filter((f) => !isImageFile({ type: f.type }));

  return (
    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
      {/* Error message */}
      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          ⚠️ {error}
        </div>
      )}

      {/* Image previews as thumbnails */}
      {images.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-3">
            {images.map((file) => (
              <div key={file.id} className="relative group">
                <img
                  src={file.base64}
                  alt={file.name}
                  className="h-20 w-20 object-cover rounded-lg border border-gray-300"
                />
                <button
                  onClick={() => onRemove(file.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  type="button"
                  title="Remove image"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Non-image files as chips */}
      {nonImages.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {nonImages.map((file) => (
            <FileChip key={file.id} file={file} onRemove={onRemove} isPreview />
          ))}
        </div>
      )}
    </div>
  );
};

export default FilePreviewBar;
