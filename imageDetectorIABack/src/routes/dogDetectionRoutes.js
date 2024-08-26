// routes/dogDetectionRoutes.js
import { Router } from "express";
import { detectDog } from "../controllers/dogDetectionController.js";

const router = Router();

//ruta para la detección de perros
router.post("/detect-dog", detectDog);

export default router;
