import { CloseIcon } from "../../../assets/icons/closeIcon";

/* eslint-disable react/prop-types */
export const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#1a1f29] bg-opacity-85 z-50">
      <div className="bg-[#f6ffff] p-6 rounded-lg shadow-lg w-96 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
        {children}
      </div>
    </div>
  );
};
