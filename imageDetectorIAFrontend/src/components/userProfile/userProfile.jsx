import { googleLogout } from "@react-oauth/google";
import { useState } from "react";
import { toast } from "react-toastify";
import { LogoutIcon } from "../../assets/icons/logoutIcon";
import { LoaderSignUp } from "../utils/loader/loadersLogin/loaderSignUp";
import { useImageStore } from "../../stores/useImageStore";
import { useLocation } from "react-router-dom";

export const UserProfile = () => {
  //Zustand
  const { loadingOAuth, setLoadingOAuth, user, setUser, reset } =
    useImageStore();
  // Estado local para manejar el perfil del usuario
  const [openProfile, setOpenProfile] = useState(false);

  // Funciones
  const handleLogout = () => {
    setLoadingOAuth(true);
    try {
      googleLogout(); // Cierra la sesión de Google
      sessionStorage.removeItem("user"); // Elimina el usuario guardado
      sessionStorage.removeItem("token"); // Elimina el token guardado
      setUser(null); // Limpia el estado del usuario
      // Mostrar el mensaje de éxito y recargar la página después
      toast.success(
        "Logout successful, thank you for using Image Detector IA."
      );
      reset();
      setLoadingOAuth(false);
    } catch (error) {
      toast.error(error);
    } finally {
      setLoadingOAuth(false);
    }
  };

  // Obtener la ubicación actual
  const location = useLocation();
  const path = location.pathname;

  const handleOpenProfile = () => {
    setOpenProfile(!openProfile);
  };

  // UI
  return (
    <>
      {!loadingOAuth ? (
        <div>
          {user && path !== "/detect-dog" && (
            <div
              className={`UserProfile p-2 transition-all duration-500 ease-in-out ${
                openProfile ? "-translate-x-1 " : "translate-x-1"
              }`}
            >
              <div className="flex items-center p-2 w-fit h-16 bg-[#303947] rounded-md shadow-lg border border-white">
                {/* Sección de foto de perfil */}
                <section className="flex justify-center items-center w-14 h-14 mr-2 rounded-full shadow-md bg-gradient-to-r from-[#F9C97C] to-[#A2E9C1] hover:from-[#C9A9E9] hover:to-[#7EE7FC] hover:cursor-pointer hover:scale-110 duration-300">
                  {!user.picture ? (
                    <button
                      onClick={handleOpenProfile}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <svg viewBox="0 0 15 15" className="w-7 fill-gray-700">
                        <path d="M7.5 0.875C5.49797 0.875 3.875 2.49797 3.875 4.5C3.875 6.15288 4.98124 7.54738 6.49373 7.98351C5.2997 8.12901 4.27557 8.55134 3.50407 9.31167C2.52216 10.2794 2.02502 11.72 2.02502 13.5999C2.02502 13.8623 2.23769 14.0749 2.50002 14.0749C2.76236 14.0749 2.97502 13.8623 2.97502 13.5999C2.97502 11.8799 3.42786 10.7206 4.17091 9.9883C4.91536 9.25463 6.02674 8.87499 7.49995 8.87499C8.97317 8.87499 10.0846 9.25463 10.8291 9.98831C11.5721 10.7206 12.025 11.8799 12.025 13.5999C12.025 13.8623 12.2376 14.0749 12.5 14.0749C12.7623 14.075 12.975 13.8623 12.975 13.6C12.975 11.72 12.4778 10.2794 11.4959 9.31166C10.7244 8.55135 9.70025 8.12903 8.50625 7.98352C10.0187 7.5474 11.125 6.15289 11.125 4.5C11.125 2.49797 9.50203 0.875 7.5 0.875ZM4.825 4.5C4.825 3.02264 6.02264 1.825 7.5 1.825C8.97736 1.825 10.175 3.02264 10.175 4.5C10.175 5.97736 8.97736 7.175 7.5 7.175C6.02264 7.175 4.825 5.97736 4.825 4.5Z"></path>
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={handleOpenProfile}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <img
                        src={user.picture}
                        alt="profile"
                        className="rounded-full"
                      />
                    </button>
                  )}
                </section>

                {/* Sección de información de perfil */}
                {!openProfile && (
                  <section className="block border-l border-gray-300 m-3">
                    <div className="pl-3">
                      <h3 className="text-white font-semibold text-sm">
                        {user.email}
                      </h3>
                      <h3 className="bg-clip-text text-transparent bg-gradient-to-l from-[#6d9ace] to-[#4bb621] text-lg font-bold whitespace-nowrap">
                        {user.name}
                      </h3>
                    </div>
                  </section>
                )}

                {/* Sección de cerrar sesión */}
                <section className="flex items-center justify-center  shadow-md hover:cursor-pointer hover:scale-110 duration-300">
                  <button
                    onClick={handleLogout}
                    className="text-white"
                    title="Logout"
                  >
                    <LogoutIcon />
                  </button>
                </section>
              </div>
            </div>
          )}
        </div>
      ) : (
        <LoaderSignUp message="Logging out ..." />
      )}
    </>
  );
};
