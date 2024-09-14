import axios from "axios";

// Obtiene la URL de la API desde las variables de entorno
const API_URL = import.meta.env.VITE_API_URL;

export const authUser = async ({ email, password }) => {
  try {
    // Envia la solicitud POST con el email y password en el cuerpo
    const response = await axios.post(`${API_URL}/api/login`, {
      email,
      password,
    });

    // Retorna los datos recibidos de la API
    return response.data;
  } catch (error) {
    // Manejo de errores más detallado
    if (error.response) {
      // Si el servidor respondió con un código de estado que no es 2xx
      console.error("Error en la respuesta del servidor:", error.response.data);
      throw new Error(
        error.response.data.message || "Error en la autenticación"
      );
    } else if (error.request) {
      console.error("No se recibió respuesta del servidor:", error.request);
      throw new Error("No se pudo conectar con el servidor");
    } else {
      // Si hubo otro tipo de error
      console.error("Error al configurar la solicitud:", error.message);
      throw new Error("Error inesperado en la autenticación");
    }
  }
};
