import { Copy } from "lucide-react";
import React from "react";

const LinkShareModal = ({ isOpen, onClose, link, title = "Share File" }) => {
  const [isCopied, setIsCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1200);
    } catch (err) {
      setIsCopied(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl px-1"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="mb-4">
          <p className="text-gray-700 mb-2">
            Share this link with others to give them access to this file:
          </p>
          <div className="flex items-center gap-2 bg-white border border-purple-300 rounded-md px-3 py-2">
            <input
              type="text"
              value={link}
              readOnly
              className="w-full font-mono text-sm bg-transparent outline-none"
              style={{ color: '#692ee6' }}
            />
            <button
              onClick={handleCopy}
              className="p-2 rounded hover:bg-purple-50 active:bg-purple-100"
              title="Copy link"
            >
              <Copy size={20} title="Copy Link" className="cursor-pointer hover:text-green-500"/>
            </button>
            {isCopied && (
              <span className="ml-1 text-xs text-green-500">Copied!</span>
            )}
          </div>
          <p className="text-gray-500 mt-2 text-xs">
            Anyone with this link can access this file.
          </p>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded font-medium bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkShareModal;
