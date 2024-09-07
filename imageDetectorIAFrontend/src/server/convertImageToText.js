// src/services/imageService.js
import { getErrorMessageImageToText } from "../components/utils/errors/imageErrorToTextUtils";
import { getToken } from "../components/utils/getToken";
import api from "./config/api/api";

export const convertImageToText = async (imageURL) => {
  try {
    // Obtener el token del sessionStorage si está disponible
    const token = getToken();
    const response = await api.post(
      `/api/convert-image-to-text`,
      { imageURL },
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "", // Añadir el token en la cabecera si existe
        },
      }
    );
    // La respuesta ya está en formato JSON
    return response.data;
  } catch (error) {
    // Manejo del error
    const errorMessage =
      error.response && error.response.status === 403
        ? "Unauthorized access. Please login."
        : getErrorMessageImageToText(error.response?.status);

    console.error("Error in convertImageToText:", errorMessage);
    throw { status: error.response?.status, message: errorMessage };
  }
};
