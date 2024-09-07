// src/controllers/authController.ts
import { Request, Response } from "express";
import { verifyGoogleToken } from "../services/authService";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const googleLogin = async (req: Request, res: Response) => {
  const { token } = req.body;

  const payload = await verifyGoogleToken(token);

  if (!payload) {
    return res.status(401).json({ error: "Invalid Google token" });
  }

  try {
    // Verifica si el usuario ya existe
    let user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      // Si el usuario no existe, créalo
      user = await prisma.user.create({
        data: {
          email: payload.email,
          name: payload.name || "", // Proporcionar un valor predeterminado si es undefined
          picture: payload.picture || "", // Proporcionar un valor predeterminado si es undefined
        },
      });
    }

    return res.status(200).json({
      message: "Login successful",
      user: {
        email: user.email,
        name: user.name || "", // Proporcionar un valor predeterminado si es undefined
        picture: user.picture || "", // Proporcionar un valor predeterminado si es undefined
      },
      token, // Devolver el token recibido o generado
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
};
