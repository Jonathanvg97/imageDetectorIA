import { detectDogInImage } from "../services/dogDetectionService";
import { Response, Request } from "express";

/**
 * Controlador para manejar la detección de perros en una imagen.
 * @param {Request} req - La solicitud HTTP.
 * @param {Response} res - La respuesta HTTP.
 * @returns {Promise<{ isDogPresent: boolean }>} - Retorna un objeto con la información sobre la detección de perros.
 */
export async function detectDog(
  req: Request,
  res: Response
): Promise<{ isDogPresent: boolean } | void> {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    res.status(400).json({ error: "Image URL is required" });
    return;
  }

  try {
    const isDogPresent = await detectDogInImage(imageUrl);
    res.json({ isDogPresent });
    return { isDogPresent }; // Devolviendo el resultado
  } catch (error) {
    console.error("Error detecting dog in image:", error);
    res.status(500).json({ error: "Error detecting dog in image" });
    return;
  }
}
