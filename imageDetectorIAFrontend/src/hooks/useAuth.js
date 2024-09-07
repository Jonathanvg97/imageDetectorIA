import { toast } from "react-toastify";
import { useImageStore } from "../stores/useImageStore";
export const useAuth = () => {
  //Zustand
  const { setCloseModalGoogle } = useImageStore();

  //Función para iniciar sesión con Google
  const handleLoginSuccess = (response) => {
    //Guarda las credenciales en el localStorage
    if (response?.credential) {
      sessionStorage.setItem("googleToken", response.credential);
      toast.success("Login successful");
      setCloseModalGoogle(true);
    }
  };

  const handleLoginError = () => {
    toast.error("Login Failed, please try again");
  };

  return {
    handleLoginSuccess,
    handleLoginError,
  };
};
