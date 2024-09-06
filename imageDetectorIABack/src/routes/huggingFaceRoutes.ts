import express from 'express';
import { convertImageToText } from '../controllers/huggingFaceController';
import { consumptionLimiter } from '../middleware/consumptionLimiter';

const router = express.Router();

// Ruta para convertir imagen a texto
router.post('/convert-image-to-text', consumptionLimiter, convertImageToText);

export default router;
