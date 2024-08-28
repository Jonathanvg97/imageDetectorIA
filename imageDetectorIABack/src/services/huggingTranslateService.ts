import { HfInference } from "@huggingface/inference";
import { envs } from "../config/envs";

// Crear una instancia del cliente de Hugging Face
const hf = new HfInference(envs.TOKEN_HUGGING_FACE || "");

/**
 * Tipo para los parámetros de traducción.
 */
interface TranslationParameters {
  src_lang: string;
  tgt_lang: string;
}

/**
 * Función para traducir texto usando Hugging Face.
 * @param {string} text - Texto a traducir.
 * @param {number} languageTranslate - Idioma de traducción.
 * @returns {Promise<string>} - Resultado de la API.
 */
export async function translateText(
  text: string,
  languageTranslate: number
): Promise<string> {
  // Configurar los parámetros de traducción según el idioma seleccionado
  const parameters: TranslationParameters = {
    src_lang: languageTranslate === 1 ? "en" : "es",
    tgt_lang: languageTranslate === 1 ? "es" : "en",
  };

  const modelUsed: string | undefined =
    languageTranslate === 1
      ? envs.MODEL_HUGGING_TRANSLATE // Modelo para inglés a español
      : envs.MODEL_HUGGING_TRANSLATE_EN; // Modelo para español a inglés

  if (!modelUsed) {
    throw new Error("Model not defined for translation.");
  }
  // Llamar a la API de Hugging Face
  const result = await hf.translation({
    model: modelUsed,
    inputs: text,
    parameters: parameters,
  });

  return result.translation_text;
}
