import { Request, Response } from "express";
import { createUser } from "../services/userService";
import { User } from "../types/user.types";
import { emailRegex, passwordRegex } from "../utils/regex";

/**
 * Creates a new user in the database based on the data provided in the request body.
 *
 * @param {Request} req - The request object containing the user data.
 * @param {Response} res - The response object to send the result back to the client.
 * @return {Promise<Response>} A promise that resolves to the response object with the result of the user creation.
 */
export async function userCreate(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { email, name, picture, password } = req.body;

    // Validar los datos requeridos
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Email, password, and name are required" });
    }

    // Validar el formato del email y la contraseña usando regex
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long, contain at least one letter, one number, and one special character",
      });
    }

    const newUser: User = { email, name, picture, password };

    // Crear el usuario en la base de datos
    const result = await createUser(newUser);

    return res.status(201).json(result); // Responde con el código 201 (creado)
  } catch (error) {
    console.error("Error creating user:", error);

    // Manejo de errores específicos de la base de datos o validaciones
    return res.status(500).json({
      message: "Internal Server Error",
      error: "An unexpected error occurred",
    });
  }
}
