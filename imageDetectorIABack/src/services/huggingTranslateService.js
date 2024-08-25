import { HfInference } from "@huggingface/inference";
import { config } from "dotenv";

config();
// Crear una instancia del cliente de Hugging Face
const hf = new HfInference(process.env.TOKEN_HUGGING_FACE || "");

/**
 * Función para traducir texto usando Hugging Face.
 * @param {string} text - Texto a traducir.
 * @param {string} model - Nombre del modelo a usar.
 * @returns {Promise<object>} - Resultado de la API.
 */
export async function translateText(text, languageTranslate) {
    // Configurar los parámetros de traducción según el idioma seleccionado
    const parameters = languageTranslate === 1
        ? { "src_lang": "en", "tgt_lang": "es" }
        : { "src_lang": "es", "tgt_lang": "en" };

    const modelUsed = (languageTranslate === 1
        ? process.env.MODEL_HUGGING_TRANSLATE // Modelo para inglés a español
        : process.env.MODEL_HUGGING_TRANSLATE_EN); // Modelo para español a inglés   

    // Llamar a la API de Hugging Face
    const result = await hf.translation({
        model: modelUsed,
        inputs: text,
        parameters: parameters,
    });

    return result;
}
