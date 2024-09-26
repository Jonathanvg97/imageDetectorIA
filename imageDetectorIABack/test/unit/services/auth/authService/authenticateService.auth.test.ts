import { authenticateUser } from "./../../../../../src/services/authService";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../../../../../src/config/bd/bd";
import { envs } from "../../../../../src/config/envs";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../../../../../src/config/bd/bd");

describe("authenticateUser - Unit Test", () => {
  const mockUser = {
    id: 1,
    email: "test@example.com",
    password: "$2b$10$hashedPassword", // Suponiendo que este es el hash de la contraseña
    name: "Test User",
    picture: "http://example.com/picture.jpg",
  };

  const authLoginData = {
    email: "test@example.com",
    password: "plainPassword",
  };

  it("should authenticate user and return user and token", async () => {
    // Simula el resultado de la consulta a la base de datos
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockUser] });

    // Simula el resultado de bcrypt.compare
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

    // Simula la generación del token JWT
    (jwt.sign as jest.Mock).mockReturnValueOnce("mockToken");

    const result = await authenticateUser(authLoginData);

    // Verifica que el resultado sea el esperado
    expect(result).toEqual({
      user: {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        picture: mockUser.picture,
      },
      token: "mockToken",
    });

    // Verifica que se haya llamado a la base de datos con el email correcto
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("SELECT id, email, password, name, picture"),
      [authLoginData.email]
    );

    // Verifica que bcrypt.compare fue llamado con la contraseña correcta
    expect(bcrypt.compare).toHaveBeenCalledWith(
      authLoginData.password,
      mockUser.password
    );

    // Verifica que se generó el token JWT con los datos del usuario
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        picture: mockUser.picture,
      },
      envs.JWT_SECRET,
      { expiresIn: envs.JWT_EXPIRATION }
    );
  });

  it("should throw an error if the user is not found", async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

    await expect(authenticateUser(authLoginData)).rejects.toThrow(
      "Invalid email or password"
    );
  });

  it("should throw an error if the password is invalid", async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockUser] });
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

    await expect(authenticateUser(authLoginData)).rejects.toThrow(
      "Invalid email or password"
    );
  });
});
