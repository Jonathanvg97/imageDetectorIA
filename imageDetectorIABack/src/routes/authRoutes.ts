// src/routes/authRoutes.ts
import { Router } from "express";
import { googleLogin } from "../controllers/authController";

const router = Router();

router.post("/google-login", googleLogin);

export default router;
