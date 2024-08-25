import express from 'express';
import { convertImageToText } from '../controllers/huggingFaceController.js';

const router = express.Router();

// Ruta para convertir imagen a texto
router.post('/convert-image-to-text', convertImageToText);

export default router;
