import { toast } from "react-toastify";
import { useImageStore } from "../stores/useImageStore";
import { verifyGoogleToken } from "../server/authGoogle";
export const useAuth = () => {
  //Zustand
  const { setCloseModalGoogle } = useImageStore();

  //Función para iniciar sesión con Google
  const handleLoginSuccess = async (response) => {
    try {
      // Verifica el token de Google
      const result = await verifyGoogleToken(response.credential);

      // Verifica el contenido de result
      if (result && result.user && result.user.name) {
        // Guarda los datos del usuario en sessionStorage
        sessionStorage.setItem("user", JSON.stringify(result.user));

        // Guarda el token en sessionStorage
        sessionStorage.setItem("token", result.token);

        // Muestra un mensaje de éxito
        toast.success(
          `Login successful, welcome to Image Detector IA, ${result.user.name}`,
          {
            onClose: () => {
              window.location.reload();
            },
          }
        );

        // Cierra el modal de login
        setCloseModalGoogle(true);
      } else {
        // Maneja el caso en el que la verificación falla
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      // Maneja errores inesperados
      console.error("Error in handleLoginSuccess:", error);
      toast.error("An error occurred during login. Please try again.");
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
