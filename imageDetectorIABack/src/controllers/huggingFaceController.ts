import { Request, Response } from "express";
import { envs } from "../config/envs";
import { imageToText } from "../services/huggingFaceService";

/**
 * Controlador para manejar la solicitud de conversión de imagen a texto.
 * @param {Request} req - Objeto de solicitud Express.
 * @param {Response} res - Objeto de respuesta Express.
 * @returns {Promise<Response>} - Promesa que representa la respuesta HTTP.
 */
export async function convertImageToText(
  req: Request,
  res: Response
): Promise<Response> {
  const imageURL: string = req.body.imageURL;
  const model: string = req.body.model || envs.MODEL_HUGGING_FACE;
  
  if (!imageURL || !model) {
    return res.status(400).json({ error: "imageURL and model are required" });
  }
  try {
  
  // Usar el servicio para obtener el texto de la imagen
    const result = await imageToText(imageURL, model);

    

    // Enviar la respuesta
    return res.status(200).json({ generated_text: result }); // Wrap result in an object
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while processing the image" });
  }
}
