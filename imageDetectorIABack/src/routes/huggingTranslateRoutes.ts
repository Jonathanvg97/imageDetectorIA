import expres from "express";
import { translateTextController } from "../controllers/huggingTranslateController";

const router = expres.Router();

// Ruta para traducir texto
router.post("/translate-text", translateTextController);

export default router;
