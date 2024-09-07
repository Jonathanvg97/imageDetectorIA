import api from "./config/api/api";
import { getErrorMessageTranslate } from "../components/utils/errors/translateError";
import { getToken } from "../components/utils/getToken";

export const translateText = async (text) => {
  try {
    const token = getToken();

    const response = await api.post(
      `/api/translate-text`,
      {
        text: text,
      },
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
    const status = error.response?.status;
    const errorMessage =
      status === 403
        ? "Unauthorized access. Please login."
        : getErrorMessageTranslate(status);

    console.error("Error in translateText:", errorMessage);

    throw { status, message: errorMessage };
  }
};
