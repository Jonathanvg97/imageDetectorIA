// src/controllers/userController.ts
import { Request, Response } from "express";
import { sendPasswordResetEmail } from "../services/emailService";

export const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body;

  // Aquí puedes agregar la lógica para generar un token de recuperación de contraseña
  const token = "some-generated-token"; // Lógica para generar el token

  try {
    await sendPasswordResetEmail(email, token);
    res.status(200).send("Correo de recuperación enviado");
  } catch (error) {
    res.status(500).send("Error enviando el correo de recuperación");
  }
};
