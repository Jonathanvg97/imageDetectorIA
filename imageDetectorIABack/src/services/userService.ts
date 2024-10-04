import pool from "../config/bd/bd";
import bcrypt from "bcrypt";
import { User } from "../types/user.types";
import { v4 as uuidv4 } from "uuid";
import { QueryResult } from "pg";
import { UserUpdate } from "../types/updateUserInterface";
import jwt from "jsonwebtoken";
import { envs } from "../config/envs";

/**
 * Creates a new user in the database and returns the newly created user.
 *
 * @param {User} user - The user object containing the email, name, picture, and password.
 * @return {Promise<User>} The newly created user.
 */
export const createUser = async (user: User): Promise<User> => {
  if (!user.password) {
    throw new Error("Password is required");
  }

  if (!user.email) {
    throw new Error("email is required");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(user.password, 10);

  // Generar un nuevo UUID para el usuario
  const userId = uuidv4();

  // Construct the query dynamically based on whether picture is provided
  let query = "INSERT INTO users (id, email, name, password";
  let values = [userId, user.email, user.name, hashedPassword];
  let valuePlaceholders = "$1, $2, $3, $4";

  if (user.picture) {
    query += ", picture";
    values.push(user.picture);
    valuePlaceholders += ", $5";
  }

  query += ") VALUES (" + valuePlaceholders + ") RETURNING *";

  const { rows } = await pool.query(query, values);
  return rows[0];
};

/**
 * Deletes a user from the database based on the provided user ID.
 *
 * @param {string} userId - The ID of the user to be deleted.
 * @return {Promise<{ rowCount: number }>} - A promise that resolves to an object containing the number of rows affected by the deletion.
 */
export const deleteUser = async (
  userId: string
): Promise<{ rowCount: number }> => {
  const result: QueryResult<any> = await pool.query(
    "DELETE FROM users WHERE id = $1",
    [userId]
  );

  // Asegúrate de que rowCount sea un número, si es null, se asigna 0
  return { rowCount: result.rowCount ?? 0 };
};

/**
 * Updates a user in the database with the provided user ID and update fields.
 *
 * @param {string} userId - The ID of the user to update.
 * @param {UserUpdate} updateFields - The fields to update for the user.
 * @return {Promise<QueryResult<any>>} A promise that resolves to the query result containing the updated user.
 * @throws {Error} If no fields are provided to update.
 */
export const updateUser = async (userId: string, updateFields: UserUpdate) => {
  const setClause = [];
  const values = [userId];
  let valueIndex = 2;

  // Construir la cláusula SET dinámica
  if (updateFields.name) {
    setClause.push(`name = $${valueIndex++}`);
    values.push(updateFields.name);
  }

  if (updateFields.picture) {
    setClause.push(`picture = $${valueIndex++}`);
    values.push(updateFields.picture);
  }

  if (setClause.length === 0) {
    throw new Error("No fields to update");
  }

  // Construir la consulta SQL
  const query = `
    UPDATE users
    SET ${setClause.join(", ")}
    WHERE id = $1
    RETURNING *;
  `;

  // Ejecutar la consulta SQL
  const result: QueryResult<any> = await pool.query(query, values);

 // Verificar si alguna fila fue afectada
  if (result.rowCount === 0) {
    return null; // No se encontro el usuario
  }
  return result;
};

/**
 * Resets the password for a user using a JWT token and a new password.
 *
 * @param {string} token - The JWT token used to verify the user's identity.
 * @param {string} newPassword - The new password to set for the user.
 * @return {Promise<string>} A promise that resolves to a success message if the password is successfully reset.
 * @throws {Error} If the token is invalid or the user is not found, or if there is an error resetting the password.
 */
export const resetPassword = async (token: string, newPassword: string) => {
  try {
    // Verifica si el token ya ha sido utilizado
    const tokenResult = await pool.query(
      "SELECT used FROM password_resets WHERE token = $1",
      [token]
    );
    if (tokenResult.rows.length === 0 || tokenResult.rows[0].used) {
      throw new Error("Token inválido o ya ha sido utilizado.");
    }

    // Verifica el token JWT
    const decoded = jwt.verify(token, envs.JWT_SECRET) as { userId: string };

    // Verifica si el usuario existe
    const userResult = await pool.query("SELECT id FROM users WHERE id = $1", [
      decoded.userId,
    ]);
    if (userResult.rows.length === 0) {
      throw new Error("Token inválido o usuario no encontrado.");
    }

    const userId = userResult.rows[0].id;

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualiza la contraseña en la base de datos
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [
      hashedPassword,
      userId,
    ]);

    // Marca el token como utilizado
    await pool.query(
      "UPDATE password_resets SET used = TRUE WHERE token = $1",
      [token]
    );

    return "Contraseña actualizada con éxito.";
  } catch (error) {
    throw error;
  }
};
