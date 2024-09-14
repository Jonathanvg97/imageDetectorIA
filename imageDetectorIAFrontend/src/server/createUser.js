import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const createUser = async ({ email, name, picture, password }) => {
  try {
    const response = await axios.post(`${API_URL}/api/create-user`, {
      email,
      name,
      picture,
      password,
    });

    // Devuelve los datos de la respuesta si la solicitud es exitosa
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Server Error:", error.response.data);
      throw new Error(
        error.response.data?.message ||
          "Failed to create user. Please try again."
      );
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
