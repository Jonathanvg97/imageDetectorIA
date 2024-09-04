// routes/dogDetectionRoutes.ts
import { Router } from "express";
import { detectDog } from "../controllers/dogDetectionController";

const router = Router();

//ruta para la detección de perros
router.post("/detect-dog", detectDog);

export default router;
