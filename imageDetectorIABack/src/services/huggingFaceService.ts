import { HfInference } from "@huggingface/inference";
import { envs } from "../config/envs";

// Crear una instancia del cliente de Hugging Face
const hf = new HfInference(envs.TOKEN_HUGGING_FACE || "");

/**
 * Función para convertir imagen a texto usando Hugging Face.
 * @param {string} imageURL - URL de la imagen a procesar.
 * @param {string} model - Nombre del modelo a usar.
 * @returns {Promise<string>} - Resultado de la API.
 */
export const imageToText = async (
  imageURL: string,
  model: string
): Promise<string> => {
  // Descargar la imagen
  const response = await fetch(imageURL);
  const blob = await response.blob();

  // Llamar a la API de Hugging Face
  const result = await hf.imageToText({
    data: blob,
    model,
  });

  return result.generated_text;
};
