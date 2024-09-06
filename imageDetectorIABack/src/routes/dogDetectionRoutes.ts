// routes/dogDetectionRoutes.ts
import { Router } from "express";
import { detectDog } from "../controllers/dogDetectionController";
import { consumptionLimiter } from "../middleware/consumptionLimiter";
import { authenticationMiddleware } from "../middleware/authenticationMiddleware";

const router = Router();

//ruta para la detección de perros
router.post(
  "/detect-dog",
  consumptionLimiter,
  authenticationMiddleware,
  detectDog
);

export default router;
