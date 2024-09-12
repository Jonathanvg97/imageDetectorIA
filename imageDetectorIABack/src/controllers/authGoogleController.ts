// src/controllers/authController.ts
import { Request, Response } from "express";
import { verifyGoogleToken } from "../services/authGoogleService";
import pool from "../config/bd/bd";

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

    if (!user) {
      // Si el usuario no existe, créalo
      const result = await pool.query(
        "INSERT INTO users (email, name, picture) VALUES ($1, $2, $3) RETURNING *",
        [payload.email, payload.name || "", payload.picture || ""]
      );

      user = result.rows[0];
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
  }
};
