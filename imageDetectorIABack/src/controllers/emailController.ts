import { Request, Response } from "express";
import { sendPasswordResetEmail } from "../services/emailService";
import jwt from "jsonwebtoken";
import { envs } from "../config/envs";
import pool from "../config/bd/bd";

export const requestPasswordReset = async (req: Request, res: Response) => {
  const { email, simulateError = false } = req.body;

  try {
    // Simular un fallo en la base de datos
    if (simulateError) {
      throw new Error("Simulated database connection error");
    }

    // Verifica si el correo existe en la base de datos
    const userResult = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );
    if (userResult.rows.length === 0) {
      // Si no se encuentra el usuario, responde con un mensaje genérico para evitar filtración de datos
      return res
        .status(200)
        .send("Si el correo existe, se enviará un enlace de recuperación.");
    }

    const userId = userResult.rows[0].id;

    // Genera el token JWT con el ID del usuario y una expiración
    const token = jwt.sign(
      { userId }, // Payload: lo que va en el token (ID del usuario)
      envs.JWT_SECRET,
      { expiresIn: envs.JWT_EXPIRATION }
    );
    // Establece la fecha de expiración para el token
    const expiresAt = new Date();
    expiresAt.setMinutes(
      expiresAt.getMinutes() + parseInt(envs.JWT_EXPIRATION, 10)
    );

    // Guarda el token en la tabla password_resets
    await pool.query(
      "INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [userId, token, expiresAt]
    );

    // Envía el correo con el token de restablecimiento
    await sendPasswordResetEmail(email, token);

    return res
      .status(200)
      .send("Si el correo existe, se enviará un enlace de recuperación.");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error enviando el correo de recuperación");
  }
};
