import express from "express";
import { translateTextController } from "../controllers/huggingTranslateController";
import { consumptionLimiter } from "../middleware/consumptionLimiter";
import { authenticationMiddleware } from "../middleware/authenticationMiddleware";

const router = express.Router();

// Ruta para traducir texto con el middleware de limitación
router.post(
  "/translate-text",
  consumptionLimiter,
  authenticationMiddleware,
  translateTextController
);

export default router;
