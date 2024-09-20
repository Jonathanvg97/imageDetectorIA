import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const updateUser = async (userId, name, picture) => {
  try {
    // Construir el cuerpo de la solicitud solo con los campos presentes
    const payload = {};
    if (name) payload.name = name;
    if (picture) payload.picture = picture;

    const response = await axios.post(`${API_URL}/api/user/${userId}`, payload);

    // Devuelve los datos de la respuesta si la solicitud es exitosa
    return response.data;
  } catch (error) {
    if (error.response) {
      // Manejo de errores del servidor
      const errorMessage =
        error.response.data?.message ||
        "Failed to update user. Please try again.";
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
