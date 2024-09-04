import { translateText } from "../services/huggingTranslateService";
import { Request, Response } from "express";
/**
 * Controlador para manejar la solicitud de traducción de texto.
 * @param {object} req - Objeto de solicitud Express.
 * @param {object} res - Objeto de respuesta Express.
 * @returns {Promise<Response>} - Promesa que representa la respuesta HTTP.
 */
export async function translateTextController(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const text: string = req.body.text;
    const languageTranslate: number = req.body.languageTranslate || 1;

    if (!text || !languageTranslate) {
      return res
        .status(400)
        .json({ error: "text is required or language is required" });
    }

    // Usar el servicio para traducir el texto
    const result = await translateText(text, languageTranslate);

    // Enviar la respuesta
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while processing the text" });
  }
}
