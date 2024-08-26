// controllers/dogDetectionController.js

import { detectDogInImage } from "../services/dogDetectionService.js";

/**
 * Controlador para manejar la detección de perros en una imagen.
 * @param {Request} req - La solicitud HTTP.
 * @param {Response} res - La respuesta HTTP.
 */
export async function detectDog(req, res) {
    const { imageUrl } = req.body;

    if (!imageUrl) {
        return res.status(400).json({ error: "Image URL is required" });
    }

    try {
        const isDogPresent = await detectDogInImage(imageUrl);
        res.json({ isDogPresent });
    } catch (error) {
        res.status(500).json({ error: "Error detecting dog in image" });
    }
}
