import api from "./config/api/api"; // Asegúrate de ajustar la ruta según tu estructura de archivos
import { getErrorMessageImageToText } from "../components/utils/errors/imageErrorToTextUtils";
import { getToken } from "../components/utils/getToken";

export const dogDetectionImage = async (imageURL) => {
  try {
    const token = getToken();
    // Realiza la solicitud POST usando axios
    const response = await api.post(
      "/api/detect-dog",
      {
        imageUrl: imageURL,
      },
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "", // Añadir el token en la cabecera si existe
        },
      }
    );
    // Axios maneja automáticamente el estado HTTP, por lo que no es necesario verificar response.ok
    return response.data; // Axios convierte la respuesta a JSON automáticamente
  } catch (error) {
    // Maneja el error
    const status = error.response?.status;
    const errorMessage =
      status === 403
        ? "Unauthorized access. Please login."
        : getErrorMessageImageToText(status);

    console.error("Error in dogDetectionImage:", errorMessage);
    throw { status, message: errorMessage };
  }
};
