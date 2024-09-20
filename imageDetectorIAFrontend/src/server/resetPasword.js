import axios from "axios";

// URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

export const resetPassword = async (body = {}) => {
  try {
    // Realizar la solicitud POST a la API para el reseteo de contraseña
    const response = await axios.post(`${API_URL}/api/reset-password`, {
      newPassword: body.newPassword,
      token: body.token,
    });

    // Devolver los datos de la respuesta en caso de éxito
    return response.data;
  } catch (error) {
    // Manejo de errores: si hay una respuesta de error del servidor
    if (error.response) {
      console.error("Error in the server response:", error.response.data);
      throw new Error(
        error.response.data.message ||
          "Error in the server response. Please try again."
      );
    } else {
      // Otro tipo de errores (error en la red, etc.)
      console.error("Error in the request:", error.message);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
};
