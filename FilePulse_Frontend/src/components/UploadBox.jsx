import React, { useRef } from 'react';
import { Upload as UploadIcon } from 'lucide-react';

const UploadBox = ({
  files,
  onFileChange,
  onRemoveFile,
  onUpload, 
  remainingCredits,
  isUploadDisabled
}) => {
  const inputRef = useRef();

  const handleDragOver = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length) {
      const event = { target: { files: droppedFiles } };
      onFileChange(event);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex justify-between px-2">
        <span className="font-medium text-blue-700 flex items-center gap-1">
          <UploadIcon size={16} /> Upload Files
        </span>
        <span className="text-right text-sm text-gray-500 font-semibold">
          {remainingCredits} credits remaining
        </span>
      </div>
      <div
        className="mt-3 border-2 border-dashed border-gray-300 rounded-xl bg-[#fcf9fe] py-12 flex flex-col items-center justify-center relative min-h-[180px] transition hover:border-blue-400 cursor-pointer"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
      >
        <div className="flex flex-col items-center justify-center">
          <UploadIcon className="text-blue-700 mb-2" size={32} />
          <div className="font-medium text-gray-900 mb-1">
            Drag and drop files here
          </div>
          <div className="text-gray-500 text-sm">
            or click to browse ({remainingCredits} credits remaining)
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={onFileChange}
        />
      </div>
      {files.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 text-md font-bold text-gray-700">
            Selected Files({files.length})
          </div>
          <ul className="space-y-2">
            {files.map((file, idx) => (
              <li key={idx} className="flex items-center justify-between bg-white rounded px-3 py-1 border border-gray-200 shadow-sm">
                <span className="truncate max-w-[200px]">{file.name}</span>
                <button
                  type="button"
                  className="px-2 text-red-700 hover:text-red-900 font-semibold cursor-pointer"
                  onClick={() => onRemoveFile(idx)}
                  aria-label="Remove file"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex justify-end mt-6">
        <button
          type="button"
          className={`px-4 py-2 bg-blue-700 text-white rounded font-semibold shadow-sm transition ${
            isUploadDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-800 cursor-pointer"
          }`}
          disabled={isUploadDisabled}
          onClick={onUpload}
        >
          Upload ({files.length})
        </button>
      </div>
    </div>
  );
};

export default UploadBox;
