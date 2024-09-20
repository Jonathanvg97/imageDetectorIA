import { Request, Response } from "express";
import {
  createUser,
  deleteUser,
  resetPassword,
  updateUser,
} from "../services/userService";
import { User } from "../types/user.types";
import { emailRegex, passwordRegex } from "../utils/regex";
import { uuidRegex } from "../utils/regex/idValidate";
import { UserUpdate } from "../types/updateUserInterface";

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

/**
 * Controller function to handle user delete.
 *
 * @param {Request} req - The request object containing user ID in params.
 * @param {Response} res - The response object to send the result back to the client.
 * @return {Promise<Response>} A promise that resolves to the response object.
 */

export async function userDelete(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { userId } = req.params;
    // Validar el formato del ID
    if (!uuidRegex.test(userId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Verificar si se proporciona un ID en los parámetros
    if (!userId) {
      return res.status(400).json({ message: "ID is required" });
    }

    // Elimina el usuario llamando a deleteUser
    const result = await deleteUser(userId);

    // Verifica si el usuario fue eliminado (si se afectó alguna fila)
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Devuelve un mensaje de éxito
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function userUpdate(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { userId } = req.params;
    const { name, picture } = req.body;

    // Verificar si se proporciona un ID en los parámetros
    if (!userId) {
      return res.status(400).json({ message: "ID is required" });
    }

    // Crear el objeto de actualización solo con los campos proporcionados
    const updateFields: UserUpdate = {};
    if (name) updateFields.name = name;
    if (picture) updateFields.picture = picture;

    // Verificar que al menos un campo de actualización esté presente
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        message: "At least one field (name or picture) is required for update",
      });
    }

    // Actualiza el usuario llamando a updateUser
    const updatedUser = await updateUser(userId, updateFields);

    // Verifica si el usuario fue encontrado y actualizado
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Devuelve un mensaje de éxito
    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser.rows[0],
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export const passwordReset = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  try {
    const message = await resetPassword(token, newPassword);

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long, contain at least one letter, one number, and one special character",
      });
    }
    return res.status(200).json({ message });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    return res
      .status(500)
      .json({ error: "Error inesperado al restablecer la contraseña." });
  }
};
