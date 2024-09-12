// src/controllers/authController.ts
import { Request, Response } from "express";
import { authenticateUser } from "../services/authService";
import { AuthLoginInterface } from "../types/authLoginInterface";

export const userLogin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password }: AuthLoginInterface = req.body;

    // Verifica que los datos requeridos estén presentes
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Autenticar al usuario
    const { user, token } = await authenticateUser({ email, password });

    // Devuelve una respuesta con el usuario autenticado
    return res.status(200).json({ user, token });
  } catch (error) {
    console.error("Login error:", error);

    // Manejo de errores específicos de autenticación
    return res.status(401).json({
      message: "Credentials invalid", // Mensaje específico para errores de autenticación
    });
  }
};
