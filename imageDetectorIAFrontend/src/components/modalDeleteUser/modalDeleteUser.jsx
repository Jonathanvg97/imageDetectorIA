/* eslint-disable react/prop-types */
import { Modal } from "../utils/modal/modal";

export const ModalDeleteUser = ({ isOpen, setIsOpen, handleConfirm }) => {
  //Functions
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <h2 className="text-xl font-bold mb-4">Delete Account</h2>
        <p className="text-gray-700 mb-6">
          Are you sure about deleting your account?
        </p>

        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-[#212733fa] rounded text-white hover:bg-[#212733ab]  transition"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            onClick={handleConfirm}
          >
            Delete
          </button>
        </div>
      </Modal>
    </>
  );
};
