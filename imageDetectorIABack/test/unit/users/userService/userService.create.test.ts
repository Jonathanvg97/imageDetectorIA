import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import pool from "../../../../src/config/bd/bd";
import { createUser } from "../../../../src/services/userService";
import { User } from "../../../../src/types/user.types";

jest.mock("bcrypt"); // Mockeamos bcrypt
jest.mock("uuid"); // Mockeamos uuid
jest.mock("../../../../src/config/bd/bd"); // Mockeamos el pool

describe("createUser", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpia los mocks antes de cada prueba
  });

  it("should create a new user with hashed password", async () => {
    // Simulamos el hash de la contraseña con bcrypt
    const mockHashedPassword = "hashedPassword123";
    (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);

    // Simulamos la generación del UUID
    const mockUUID = "123e4567-e89b-12d3-a456-426614174000"; // UUID válido
    (uuidv4 as jest.Mock).mockReturnValue(mockUUID);

    // Mockeamos directamente lo que debería hacer `pool.query`
    const mockQuery = jest.fn().mockResolvedValue({
      rows: [
        {
          id: mockUUID,
          email: "test@test.com",
          name: "Test User",
          password: mockHashedPassword,
        },
      ],
    });

    // Simulamos el pool como dependencia
    (pool.query as jest.Mock) = mockQuery;

    // Simulamos la inyección del pool como dependencia.
    const userInput: User = {
      email: "test@test.com",
      name: "Test User",
      password: "password123",
    };

    const newUser = await createUser(userInput);

    // Verificaciones
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10); // Aseguramos que la contraseña se hasheó
    expect(uuidv4).toHaveBeenCalled(); // Aseguramos que se generó un UUID
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO users"),
      expect.arrayContaining([
        mockUUID,
        "test@test.com",
        "Test User",
        mockHashedPassword,
      ])
    );

    // Verificamos el valor retornado
    expect(newUser).toEqual({
      id: mockUUID,
      email: "test@test.com",
      name: "Test User",
      password: mockHashedPassword,
    });
  });

  it("should throw an error if password is not provided", async () => {
    const userInput: Partial<User> = {
      email: "test@test.com",
      name: "Test User",
    };

    await expect(createUser(userInput as User)).rejects.toThrow(
      "Password is required"
    );
  });

  it("should throw an error if email is not provided", async () => {
    const userInput: Partial<User> = {
      name: "Test User",
      password: "password123",
    };

    await expect(createUser(userInput as User)).rejects.toThrow(
      "email is required"
    );
  });
});
