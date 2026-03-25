/**
 * @file Message.jsx (MODIFIED)
 * @description Message bubble component with file attachment rendering.
 *              Displays images inline and files as downloadable chips.
 */

import React from 'react';
import FileChip from './FileChip';
import { isImageFile } from '../utils/fileHelpers';

const Message = ({ message, isUser }) => {
  const images = message.files?.filter((f) => isImageFile({ type: f.type })) || [];
  const nonImages = message.files?.filter((f) => !isImageFile({ type: f.type })) || [];

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        {/* Text content */}
        {message.text && <p className="break-words">{message.text}</p>}

        {/* Image previews */}
        {images.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {images.map((file) => (
              <img
                key={file.id}
                src={file.base64}
                alt={file.name}
                className="max-h-48 max-w-full rounded-lg border border-gray-300"
              />
            ))}
          </div>
        )}

        {/* File chips */}
        {nonImages.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {nonImages.map((file) => (
              <FileChip key={file.id} file={file} isPreview={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
