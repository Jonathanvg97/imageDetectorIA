// routes/dogDetectionRoutes.ts
import { Router } from "express";
import { detectDog } from "../controllers/dogDetectionController";
import { consumptionLimiter } from "../middleware/consumptionLimiter";

const router = Router();

//ruta para la detección de perros
router.post("/detect-dog", consumptionLimiter, detectDog);

export default router;
