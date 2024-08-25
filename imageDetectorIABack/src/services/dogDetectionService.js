// services/dogDetectionService.js
import { HfInference } from "@huggingface/inference";
import { config } from "dotenv";
import { dogKeywords } from '../utils/dogs.js';

config();

// Crear una instancia del cliente de Hugging Face
const hf = new HfInference(process.env.TOKEN_HUGGING_FACE_DETECTOR || "");

/**
 * Función para detectar un perro en una imagen usando Hugging Face.
 * @param {string} imageUrl - URL de la imagen a procesar.
 * @returns {Promise<boolean>} - True si se detecta un perro, false en caso contrario.
 */
export async function detectDogInImage(imageUrl) {
    try {
        // Clasificación de la imagen
        const result = await hf.imageClassification({
            data: await (await fetch(imageUrl)).blob(),
            model: process.env.MODEL_IMAGE_CLASSIFICATION,
        });

        // Buscar si alguna de las etiquetas coincide con la lista de palabras clave
        const isDogPresent = result.some(item =>
            dogKeywords.some(keyword => item.label.toLowerCase().includes(keyword))
        );

        return isDogPresent;
    } catch (error) {
        console.error("Error during inference:", error);
        throw new Error("Failed to detect dog in image");
    }
}
