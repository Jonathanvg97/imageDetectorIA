import { HfInference } from "@huggingface/inference";
import { config } from 'dotenv';

config();
// Crear una instancia del cliente de Hugging Face
const hf = new HfInference(process.env.TOKEN_HUGGING_FACE || "");

/**
 * Función para convertir imagen a texto usando Hugging Face.
 * @param {string} imageURL - URL de la imagen a procesar.
 * @param {string} model - Nombre del modelo a usar.
 * @returns {Promise<object>} - Resultado de la API.
 */
export async function imageToText(imageURL, model, token) {

    // Descargar la imagen
    const response = await fetch(imageURL);
    const blob = await response.blob();

    // Llamar a la API de Hugging Face
    const result = await hf.imageToText({
        data: blob,
        model,
    });

    return result;
}
