import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${API_URL}/api/user/${userId}`, {
      params: {
        userId: userId,
      },
    });

    // Devuelve los datos de la respuesta si la solicitud es exitosa
    return response.data;
  } catch (error) {
    if (error.response) {
      // Manejo de errores del servidor
      const errorMessage =
        error.response.data?.message ||
        "Failed to delete user. Please try again.";

      // Lanza un error con el mensaje específico
      throw new Error(errorMessage);
    } else if (error.request) {
      // El servidor no respondió
      console.error("No response from server:", error.request);
      throw new Error("No response from server. Please check your network.");
    } else {
      // Otro tipo de error
      console.error("Error setting up request:", error.message);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
};
