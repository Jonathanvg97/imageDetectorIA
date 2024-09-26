import { Request, Response } from "express";
import { userCreate } from "../../../../src/controllers/userController";
import { createUser } from "../../../../src/services/userService";

//Mockear server createUSer
jest.mock("../../../../src/services/userService");

describe("userCreate", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let json: jest.Mock;
  let status: jest.Mock;

  beforeEach(() => {
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json }); // Mock de la respuesta
    req = { body: {} }; // Inicializa el objeto de la solicitud
    res = { status }; // Inicializa el objeto de la respuesta
  });

  it("should return 400 if email, password, or name is missing", async () => {
    req.body = { email: "test@example.com", password: "Password123!" }; // Falta el nombre

    await userCreate(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      message: "Email, password, and name are required",
    });
  });

  it("should return 400 if email format is invalid", async () => {
    req.body = {
      email: "invalidEmail",
      name: "Test User",
      password: "Password123!",
    };

    await userCreate(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ message: "Invalid email format" });
  });

  it("should return 400 if password does not meet criteria", async () => {
    req.body = {
      email: "test@example.com",
      name: "Test User",
      password: "short",
    }; // Contraseña demasiado corta

    await userCreate(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      message:
        "Password must be at least 8 characters long, contain at least one letter, one number, and one special character",
    });
  });

  it("should return 201 if user is created successfully", async () => {
    const mockUser = {
      email: "test@example.com",
      name: "Test User",
      picture: "",
      password: "Password123!",
    };

    // Configura el mock para que devuelva el usuario simulado
    (createUser as jest.Mock).mockResolvedValue(mockUser); // Mockea el servicio

    req.body = mockUser; // Establece el cuerpo de la solicitud

    await userCreate(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith(mockUser);
  });

  it("should return 500 on internal server error", async () => {
    // Simulando un error al crear el usuario
    (createUser as jest.Mock).mockRejectedValue(new Error("Database error"));

    req.body = {
      email: "test@example.com",
      name: "Test User",
      password: "Password123!",
    };

    await userCreate(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      message: "Internal Server Error",
      error: "An unexpected error occurred",
    });
  });
});
