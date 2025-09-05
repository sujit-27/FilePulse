import React from 'react';
import { FileText, Lock } from 'lucide-react';

const RecentFiles = ({ files }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="font-semibold text-lg mb-4">Recent Files (5)</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 uppercase border-b">
              <th className="py-2 pr-4 text-left">Name</th>
              <th className="py-2 pr-4 text-left">Size</th>
              <th className="py-2 pr-4 text-left">Uploaded By</th>
              <th className="py-2 pr-4 text-left">Modified</th>
              <th className="py-2 pr-4 text-left">Sharing</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, idx) => (
              <tr key={file?.id || `placeholder-${idx}`} className="border-b last:border-0">
                <td className="py-3 pr-4 flex items-center gap-2">
                  <FileText size={16} className="text-purple-500" />
                  <span className="truncate max-w-[150px]">{file.name}</span>
                </td>
                <td className="py-2 pr-4">{file ? (file.size / 1024).toFixed(1) + ' KB' : '--'}</td>
                <td className="py-2 pr-4">{file ? 'You' : '--'}</td>
                <td className="py-2 pr-4">{file ? new Date(file.modifiedAt || file.updatedAt || file.uploadedAt).toLocaleDateString() : '--'}</td>
                <td className="py-2 pr-4 flex items-center gap-1">
                  <Lock size={14} />
                  Private
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default RecentFiles;
