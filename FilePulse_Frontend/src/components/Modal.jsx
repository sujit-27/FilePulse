import React from 'react';

const Modal = ({
  isOpen,
  onClose,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  size = "sm",
  confirmationButtonClass = "bg-purple-600 hover:bg-purple-700 text-white",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-opacity-100 transition-all">
      <div
        className={`bg-white rounded-xl shadow-lg p-6 w-full ${size === "sm" ? "max-w-md" : ""}`}
      >
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
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded font-medium ${confirmationButtonClass} cursor-pointer`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
