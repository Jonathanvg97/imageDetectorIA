// src/controllers/authController.ts
import { Request, Response } from "express";
import { verifyGoogleToken } from "../services/authGoogleService";
import pool from "../config/bd/bd";
import { v4 as uuidv4 } from "uuid";

export const googleLogin = async (req: Request, res: Response) => {
  const { token } = req.body;

  const payload = await verifyGoogleToken(token);

  if (!payload) {
    return res.status(401).json({ error: "Invalid Google token" });
  }

  try {
    // Verifica si el usuario ya existe
    const {
      rows: [existingUser],
    } = await pool.query("SELECT * FROM users WHERE email = $1", [
      payload.email,
    ]);

    let user = existingUser; // Cambiar a `let` para permitir la reasignación

    // Generar un nuevo UUID para el usuario que se loguea con google
    const userId = uuidv4();

    if (!user) {
      // Si el usuario no existe, créalo
      const result = await pool.query(
        "INSERT INTO users (id, email, name, picture) VALUES ($1, $2, $3, $4) RETURNING *",
        [userId, payload.email, payload.name || "", payload.picture || ""]
      );

      user = result.rows[0];
    }

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name || "", // Proporcionar un valor predeterminado si es undefined
        picture: user.picture || "", // Proporcionar un valor predeterminado si es undefined
      },
      token, // Devolver el token recibido o generado
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
