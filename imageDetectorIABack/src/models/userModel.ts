import pool from "../config/bd/bd";

/**
 * Checks if an email exists in the users table.
 *
 * @param {string} email - The email to check.
 * @return {Promise<boolean>} A promise that resolves to true if the email exists, false otherwise.
 */
export const emailExists = async (email: string): Promise<boolean> => {
  const query = "SELECT COUNT(*) FROM users WHERE email = $1";
  const { rows } = await pool.query(query, [email]);
  return parseInt(rows[0].count, 10) > 0;
};
