import { toast } from "react-toastify";
import { useImageStore } from "../stores/useImageStore";
import { verifyGoogleToken } from "../server/authGoogle";
import { authUser } from "../server/authUser";
import { createUser } from "../server/createUser";
export const useAuth = () => {
  //Zustand
  const {
    setCloseModalGoogle,
    setLoadingAuth,
    setModalUserCreate,
    setModalUserLogin,
    setUser,
  } = useImageStore();

  //Función para iniciar sesión con Google
  const handleLoginSuccessWithGoogle = async (response) => {
    setLoadingAuth(true);
    try {
      // Verifica el token de Google
      const result = await verifyGoogleToken(response.credential);

      // Verifica el contenido de result
      if (result && result.user && result.user.name) {
        setUser(result.user);
        // Guarda los datos del usuario en sessionStorage
        sessionStorage.setItem("user", JSON.stringify(result.user));

        // Guarda el token en sessionStorage
        sessionStorage.setItem("token", result.token);

        // Muestra un mensaje de éxito
        toast.success(
          `Login successful, welcome to Image Detector IA, ${result.user.name}`
        );

        setLoadingAuth(false);

        // Cierra el modal de login
        setCloseModalGoogle(true);
      } else {
        // Maneja el caso en el que la verificación falla
        toast.error("Login failed. Please try again.");
        setLoadingAuth(false);
      }
    } catch (error) {
      // Maneja errores inesperados
      console.error("Error in handleLoginSuccess:", error);
      toast.error("An error occurred during login. Please try again.");
    } finally {
      setLoadingAuth(false);
    }
  };

  //Función para iniciar sesión sin Google
  const handleLoginSuccessWithoutGoogle = async ({ email, password }) => {
    setLoadingAuth(true);

    try {
      // Verifica que los datos requeridos estén presentes
      if (!email || !password) {
        toast.error("Email and password are required");
        return;
      }

      // Autenticar al usuario
      const result = await authUser({ email, password });

      // Verifica el contenido de result
      if (result?.user?.name) {
        setUser(result.user);
        // Guarda los datos del usuario y el token en sessionStorage
        sessionStorage.setItem("user", JSON.stringify(result.user));
        sessionStorage.setItem("token", result.token);

        // Muestra un mensaje de éxito
        toast.success(
          `Login successful, welcome to Image Detector IA, ${result.user.name}`
        );

        setLoadingAuth(false);
      } else {
        // Si la autenticación falla
        toast.error("Login failed. Please try again.");
        setLoadingAuth(false);
      }
    } catch (error) {
      // Maneja errores inesperados
      console.error("Error in handleLoginSuccess:", error);
      toast.error("Credentials invalid. Please try again.");
    } finally {
      // Asegura que el estado de carga se actualice en cualquier caso
      setLoadingAuth(false);
    }
  };

  //función para abrir el modal de creación de cuenta
  const handleOpenModalCreateAccount = () => {
    setModalUserLogin(false);
    setModalUserCreate(true);
  };

  //función para cerrar el modal de creación de cuenta
  const handleCloseModalCreateAccount = () => {
    setModalUserCreate(false);
    setModalUserLogin(true);
  };

  const handleLoginError = () => {
    toast.error("Login Failed, please try again");
  };

  // Function to create user
  const handleUserCreate = async ({ email, name, picture, password }) => {
    setLoadingAuth(true);
    try {
      if (!name || !email || !password) {
        toast.error("Name, email, and password are required");
        return;
      }

      const result = await createUser({ email, name, picture, password });

      if (result) {
        toast.success("User created successfully");
        handleCloseModalCreateAccount();
        setModalUserLogin(true);
      } else {
        toast.error("User creation failed. Please try again.");
      }
    } catch (error) {
      console.error("Error in userCreate:", error.message);

      if (error.message.includes("Email is already registered")) {
        toast.error(
          "The email is already registered. Please use a different email."
        );
      } else if (error.message.includes("Invalid email format")) {
        toast.error("The email format is invalid. Please check and try again.");
      } else if (error.message.includes("Password must be at least")) {
        toast.error(
          "The password does not meet the required criteria. Please check and try again."
        );
      } else {
        toast.error(
          "An error occurred during user creation. Please try again."
        );
      }
    } finally {
      setLoadingAuth(false);
    }
  };

  return {
    handleLoginSuccessWithGoogle,
    handleLoginError,
    handleLoginSuccessWithoutGoogle,
    handleOpenModalCreateAccount,
    handleCloseModalCreateAccount,
    handleUserCreate,
  };
};
