import express from "express";
import { convertImageToText } from "../controllers/huggingFaceController";
import { consumptionLimiter } from "../middleware/consumptionLimiter";
import { authenticationMiddleware } from "../middleware/authenticationMiddleware";

const router = express.Router();

// Ruta para convertir imagen a texto
router.post(
  "/convert-image-to-text",
  consumptionLimiter, // Verifica el límite de peticiones
  authenticationMiddleware, // Verifica la autenticación si se ha excedido el límite
  convertImageToText // Controlador para convertir imagen a texto
);

export default router;
