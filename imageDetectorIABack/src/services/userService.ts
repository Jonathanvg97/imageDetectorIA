import pool from "../config/bd/bd";
import bcrypt from "bcrypt";
import { User } from "../types/user.types";
import { v4 as uuidv4 } from "uuid";
import { QueryResult } from "pg";

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
