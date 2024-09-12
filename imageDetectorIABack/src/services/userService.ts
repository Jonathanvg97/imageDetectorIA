import pool from "../config/bd/bd";
import bcrypt from "bcrypt";
import { User } from "../types/user.types";

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
  //Hash the password
  const hashedPassword = await bcrypt.hash(user.password, 10);

  // Construct the query dynamically based on whether picture is provided
  let query = "INSERT INTO users (email, name, password";
  let values = [user.email, user.name, hashedPassword];
  let valuePlaceholders = "$1, $2, $3";

  if (user.picture) {
    query += ", picture";
    values.push(user.picture);
    valuePlaceholders += ", $4";
  }

  query += ") VALUES (" + valuePlaceholders + ") RETURNING *";

  const { rows } = await pool.query(query, values);
  return rows[0];
};
