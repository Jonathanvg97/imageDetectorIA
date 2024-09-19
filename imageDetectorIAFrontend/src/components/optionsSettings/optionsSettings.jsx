/* eslint-disable react/prop-types */
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { ModalDeleteUser } from "../modalDeleteUser/modalDeleteUser";

export const OptionsSettings = ({ openSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  //hook
  const { handleDeleteUser, handleOpenModalEditAccount } = useAuth();
  //Funciones
  const handleOpenModalDeleteUser = () => {
    setIsOpen(true);
  };
  //Ui
  return (
    <>
      {!isOpen ? (
        <div
          className={`absolute top-2 right-14 bg-[#212733] rounded-lg p-2 transition-transform duration-500 ease-in-out transform ${
            openSettings
              ? "translate-x-0 opacity-100"
              : "translate-x-40 opacity-0"
          }
        `}
        >
          <div className="flex flex-col text-white font-medium">
            <button
              onClick={handleOpenModalEditAccount}
              className="modal-option transform transition-transform duration-300 ease-in-out hover:cursor-pointer hover:scale-110"
            >
              Actualizar Perfil
            </button>
            <button
              onClick={handleOpenModalDeleteUser}
              className="modal-option transform transition-transform duration-300 ease-in-out hover:cursor-pointer hover:scale-110"
            >
              Eliminar Cuenta
            </button>
          </div>
        </div>
      ) : (
        <ModalDeleteUser
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleConfirm={handleDeleteUser}
        />
      )}
    </>
  );
};
