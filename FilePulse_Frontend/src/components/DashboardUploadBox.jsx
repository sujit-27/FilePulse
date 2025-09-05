import React from 'react';
import { Upload, X } from 'lucide-react';

const DashboardUploadBox = ({
  files,
  onFileChange,
  onRemoveFile,
  onUpload,
  uploading,
  remainingUploads,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-4">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-lg flex items-center gap-2">
          <Upload size={20} className="text-blue-500" />
          Upload Files
        </span>
        <span className="text-xs text-gray-500">{remainingUploads} of 5 files remaining</span>
      </div>

      <label
        htmlFor="upload-input"
        className={`flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-md cursor-pointer transition hover:bg-blue-50 ${remainingUploads === 0 ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <Upload size={34} className="text-blue-300 mb-1" />
        <span className="font-medium text-base text-blue-700 mb-1">Drag and drop files here</span>
        <span className="text-gray-400 text-sm">or click to browse</span>
        <input
          id="upload-input"
          type="file"
          multiple
          className="hidden"
          onChange={onFileChange}
          disabled={remainingUploads === 0}
        />
      </label>

      {files.length > 0 && (
        <div className="mt-4">
          <ul className="space-y-2">
            {files.map((file, idx) => (
              <li key={idx} className="flex items-center justify-between gap-2 px-2 py-1 bg-blue-50 rounded text-sm">
                <span className="truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => onRemoveFile(idx)}
                  className="text-gray-500 hover:text-red-500"
                  title="Remove"
                >
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={onUpload}
        disabled={uploading || files.length === 0 || remainingUploads === 0}
        className={`mt-4 w-full py-2 rounded-lg font-semibold shadow transition-colors duration-100 ${
          uploading || files.length === 0 || remainingUploads === 0
            ? 'bg-blue-200 text-white cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
        }`}
      >
        {uploading ? 'Uploading...' : 'Upload Files'}
      </button>
    </div>
  );
};

export default DashboardUploadBox;
