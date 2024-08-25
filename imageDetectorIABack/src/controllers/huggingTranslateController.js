import { translateText } from "../services/huggingTranslateService.js";
import { config } from "dotenv";

config();

/**
 * Controlador para manejar la solicitud de traducción de texto.
 * @param {object} req - Objeto de solicitud Express.
 * @param {object} res - Objeto de respuesta Express.
 */
export async function translateTextController(req, res) {
    try {
        const text = req.body.text;
        const languageTranslate = req.body.languageTranslate || 1;

        if (!text || !languageTranslate) {
            return res
                .status(400)
                .json({ error: "text is required or language is required" });
        }

        // Usar el servicio para traducir el texto
        const result = await translateText(text, languageTranslate);

        // Enviar la respuesta
        res.json(result);
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "An error occurred while processing the text" });
        return res.status();
    }
}
