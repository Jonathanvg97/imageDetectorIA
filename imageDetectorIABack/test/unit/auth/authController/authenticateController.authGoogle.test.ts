import { Request, Response } from "express";
import { verifyGoogleToken } from "../../../../src/services/authGoogleService";
import pool from "../../../../src/config/bd/bd";
import { googleLogin } from "../../../../src/controllers/authGoogleController";
import { jest, describe, it, expect, beforeEach } from "@jest/globals";


// Mock de las dependencias
jest.mock("../../../../src/services/authGoogleService");
jest.mock("../../../../src/config/bd/bd");

describe("Auth Controller - googleLogin", () => {
  const mockRequest = (token: string) =>
    ({
      body: { token },
    } as Request);

  const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
  };

  const mockPayload = {
    email: "test@example.com",
    name: "Test User",
    picture: "http://example.com/picture.jpg",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Ejemplo de test ajustado
  it("should log in an existing user", async () => {
    const req = mockRequest("valid_token");
    const res = mockResponse();

    (verifyGoogleToken as jest.Mock).mockResolvedValue(mockPayload); // Asegúrate de que mockPayload tiene los valores esperados
    (pool.query as jest.Mock).mockResolvedValueOnce({
      rows: [
        {
          id: "existing-user-id",
          email: "test@example.com",
          name: "Test User",
          picture: "http://example.com/picture.jpg",
        },
      ],
    });

    await googleLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Login successful",
      user: {
        id: "existing-user-id",
        email: "test@example.com",
        name: "Test User", // Este valor debe coincidir
        picture: "http://example.com/picture.jpg", // Este valor debe coincidir
      },
      token: "valid_token",
    });
  });

  it("should create a new user if not exists", async () => {
    const req = mockRequest("valid_token");
    const res = mockResponse();

    // Mock para el payload de Google
    (verifyGoogleToken as jest.Mock).mockResolvedValue(mockPayload);

    // Simular que no existe el usuario en la base de datos
    (pool.query as jest.Mock)
      .mockResolvedValueOnce({ rows: [] }) // Simular que no se encontró usuario
      .mockResolvedValueOnce({
        // Simular la creación del nuevo usuario
        rows: [
          {
            id: "new-user-id",
            email: "test@example.com",
            name: "Test User",
            picture: "http://example.com/picture.jpg",
          },
        ],
      });

    await googleLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Login successful",
      user: {
        id: "new-user-id",
        email: "test@example.com",
        name: "Test User",
        picture: "http://example.com/picture.jpg",
      },
      token: "valid_token",
    });
  });

  it("should return 401 if token is invalid", async () => {
    const req = mockRequest("invalid_token");
    const res = mockResponse();

    (verifyGoogleToken as jest.Mock).mockResolvedValue(null); // Simulando un token inválido

    await googleLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid Google token" });
  });

  it("should return 500 if an error occurs during login", async () => {
    const req = mockRequest("valid_token");
    const res = mockResponse();

    (verifyGoogleToken as jest.Mock).mockResolvedValue(mockPayload);
    (pool.query as jest.Mock).mockRejectedValue(new Error("DB Error"));

    await googleLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });
});
