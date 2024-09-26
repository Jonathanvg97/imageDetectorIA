import pool from "../../../../src/config/bd/bd";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { resetPassword } from "../../../../src/services/userService";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../../../../src/config/bd/bd");

describe("resetPassword", () => {
  const token = "mockToken";
  const newPassword = "newPassword123";
  const userId = "123e4567-e89b-12d3-a456-426614174000";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should reset password successfully", async () => {
    // Mock para verificar que el token no ha sido usado
    (pool.query as jest.Mock).mockImplementation((query, params) => {
      if (query.includes("SELECT used FROM password_resets")) {
        return Promise.resolve({
          rows: [{ used: false }],
        });
      }
      if (query.includes("SELECT id FROM users")) {
        return Promise.resolve({
          rows: [{ id: userId }],
        });
      }
      return Promise.resolve({});
    });

    // Mock para verificar el token JWT
    (jwt.verify as jest.Mock).mockReturnValue({ userId });

    // Mock para hash de la nueva contraseña
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");

    // Ejecutar la función
    const result = await resetPassword(token, newPassword);

    // Verificaciones
    expect(pool.query).toHaveBeenCalledWith(
      "UPDATE users SET password = $1 WHERE id = $2",
      ["hashedPassword", userId]
    );
    expect(pool.query).toHaveBeenCalledWith(
      "UPDATE password_resets SET used = TRUE WHERE token = $1",
      [token]
    );
    expect(result).toBe("Contraseña actualizada con éxito.");
  });

  it("should throw an error if the token is already used", async () => {
    // Mock para verificar que el token ya ha sido usado
    (pool.query as jest.Mock).mockImplementation((query, params) => {
      if (query.includes("SELECT used FROM password_resets")) {
        return Promise.resolve({
          rows: [{ used: true }],
        });
      }
      return Promise.resolve({});
    });

    // Ejecutar la función y verificar el error
    await expect(resetPassword(token, newPassword)).rejects.toThrow(
      "Token inválido o ya ha sido utilizado."
    );
  });

  it("should throw an error if the token is invalid", async () => {
    // Mock para verificar que el token no existe
    (pool.query as jest.Mock).mockImplementation((query, params) => {
      if (query.includes("SELECT used FROM password_resets")) {
        return Promise.resolve({ rows: [] });
      }
      return Promise.resolve({});
    });

    // Ejecutar la función y verificar el error
    await expect(resetPassword(token, newPassword)).rejects.toThrow(
      "Token inválido o ya ha sido utilizado."
    );
  });

  it("should throw an error if the user does not exist", async () => {
    // Mock para verificar que el token no ha sido usado
    (pool.query as jest.Mock).mockImplementation((query, params) => {
      if (query.includes("SELECT used FROM password_resets")) {
        return Promise.resolve({
          rows: [{ used: false }],
        });
      }
      if (query.includes("SELECT id FROM users")) {
        return Promise.resolve({
          rows: [], // Usuario no encontrado
        });
      }
      return Promise.resolve({});
    });

    // Mock para verificar el token JWT
    (jwt.verify as jest.Mock).mockReturnValue({ userId });

    // Ejecutar la función y verificar el error
    await expect(resetPassword(token, newPassword)).rejects.toThrow(
      "Token inválido o usuario no encontrado."
    );
  });
});
