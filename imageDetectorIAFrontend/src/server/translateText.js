import api from "./config/api/api";
import { getErrorMessageTranslate } from "../components/utils/errors/translateError";

export const translateText = async (text) => {
  try {
    const response = await api.post(`/api/translate-text`, {
      text: text,
    });
    // La respuesta ya está en formato JSON
    return response.data;
  } catch (error) {
    // Manejo del error
    const status = error.response?.status;
    const errorMessage =
      status === 403
        ? "Unauthorized access. Please login."
        : getErrorMessageTranslate(status);

    console.error("Error in translateText:", errorMessage);

    throw { status, message: errorMessage };
  }
};
