import { useAuth } from "../../hooks/useAuth";

export const OptionsSettings = () => {
  //hook
  const { handleDeleteUser, handleOpenModalEditAccount } = useAuth();

  //Ui
  return (
    <div className="bg-[#212733] rounded-lg p-2">
      <div className="flex flex-col text-white font-medium">
        <button
          onClick={handleOpenModalEditAccount}
          className="modal-option transform transition-transform duration-300 ease-in-out hover:cursor-pointer hover:scale-110"
        >
          Editar Perfil
        </button>
        <button
          onClick={handleDeleteUser}
          className="modal-option transform transition-transform duration-300 ease-in-out hover:cursor-pointer hover:scale-110"
        >
          Eliminar Cuenta
        </button>
      </div>
    </div>
  );
};
