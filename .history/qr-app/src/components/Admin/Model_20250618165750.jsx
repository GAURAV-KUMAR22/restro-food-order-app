// components/ui/Modal.jsx
import React from "react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  width = "w-[600px]",
  height = "h-[500px]",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-40">
      <div
        className={`relative bg-white rounded-lg shadow-lg p-6 ${width} ${height}`}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          &times;
        </button>
        {title && (
          <h2 className="text-xl font-semibold text-center mb-4 text-gray-700">
            {title}
          </h2>
        )}
        <div className="overflow-y-auto max-h-[90%]">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
