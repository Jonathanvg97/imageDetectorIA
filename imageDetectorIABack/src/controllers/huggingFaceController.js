import { imageToText } from '../services/huggingFaceService.js';
import { config } from 'dotenv';

config();

/**
 * Controlador para manejar la solicitud de conversión de imagen a texto.
 * @param {object} req - Objeto de solicitud Express.
 * @param {object} res - Objeto de respuesta Express.
 */
export async function convertImageToText(req, res) {
    try {
        const imageURL = req.body.imageURL;
        const model = req.body.model || process.env.MODEL_HUGGING_FACE;

        if (!imageURL || !model) {
            return res.status(400).json({ error: "imageURLrequired or model is required" });
        }

        // Usar el servicio para obtener el texto de la imagen
        const result = await imageToText(imageURL, model);

        // Enviar la respuesta
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while processing the image" });
    }
}
