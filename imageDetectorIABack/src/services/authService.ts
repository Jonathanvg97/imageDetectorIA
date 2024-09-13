// src/services/authService.ts
import bcrypt from "bcrypt";
import { User } from "../types/user.types";
import pool from "../config/bd/bd";
import { AuthLoginInterface } from "../types/authLoginInterface";
import jwt from "jsonwebtoken";
import { envs } from "../config/envs";

export const authenticateUser = async (
  authLoginData: AuthLoginInterface
): Promise<{ user: User; token: string }> => {
  try {
    // Buscar el usuario en la base de datos
    const query = `
      SELECT email, password, name, picture 
      FROM users 
      WHERE email = $1
    `;
    const { rows } = await pool.query(query, [authLoginData.email]);

    if (rows.length === 0) {
      throw new Error("Invalid email or password");
    }

    const user = rows[0];

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(
      authLoginData.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Generar el token JWT
    const token = jwt.sign(
      {
        email: user.email,
        name: user.name,
        picture: user.picture,
      }, // Payload del token
      envs.JWT_SECRET, // Clave secreta para firmar el token
      { expiresIn: envs.JWT_EXPIRATION } // Opciones del token
    );

    // Si las credenciales son correctas, retornar el usuario con todos los campos necesarios
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
      token,
    };
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
};
