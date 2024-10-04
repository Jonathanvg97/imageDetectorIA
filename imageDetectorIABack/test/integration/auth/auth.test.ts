import request from "supertest";
import express from "express";
import { userLogin } from "../../../src/controllers/authController";
import { authenticateUser } from "../../../src/services/authService";

jest.mock("../../../src/services/authService");

// Crear una aplicación de Express
const app = express();
app.use(express.json()); // Para analizar cuerpos JSON

app.post("/api/login", (req, res) => {
  userLogin(req, res); // Llamar al controlador
});

describe("POST /api/login", () => {
  it("should authenticate a user successfully", async () => {
    const validEmail = "test@example.com";
    const validPassword = "ValidP@ssw0rd";
    const mockUser = { id: 1, email: validEmail, name: "Test User" };
    const mockToken = "mockedToken";

    // Simular la respuesta de la función authenticateUser
    (authenticateUser as jest.Mock).mockResolvedValue({
      user: mockUser,
      token: mockToken,
    });

    // Petición POST simulada para autenticar al usuario
    const response = await request(app)
      .post("/api/login")
      .send({
        email: validEmail,
        password: validPassword,
      })
      .expect(200);

    // Verificar la respuesta
    expect(response.body).toEqual({ user: mockUser, token: mockToken });
    expect(authenticateUser).toHaveBeenCalledTimes(1);
    expect(authenticateUser).toHaveBeenCalledWith({
      email: validEmail,
      password: validPassword,
    });
  });

  it("should return 400 if email or password is missing", async () => {
    // Petición POST simulada sin email
    const responseMissingEmail = await request(app)
      .post("/api/login")
      .send({
        password: "ValidP@ssw0rd",
      })
      .expect(400);

    // Verificar la respuesta
    expect(responseMissingEmail.body).toEqual({
      message: "Email and password are required",
    });

    // Petición POST simulada sin password
    const responseMissingPassword = await request(app)
      .post("/api/login")
      .send({
        email: "test@example.com",
      })
      .expect(400);

    // Verificar la respuesta
    expect(responseMissingPassword.body).toEqual({
      message: "Email and password are required",
    });
  });

  it("should return 401 for invalid credentials", async () => {
    const invalidEmail = "wrong@example.com";
    const invalidPassword = "WrongPassword";

    // Simular un error de credenciales inválidas
    (authenticateUser as jest.Mock).mockRejectedValue(
      new Error("Invalid credentials")
    );

    // Petición POST simulada para autenticar al usuario
    const response = await request(app)
      .post("/api/login")
      .send({
        email: invalidEmail,
        password: invalidPassword,
      })
      .expect(401);

    // Verificar la respuesta
    expect(response.body).toEqual({ message: "Credentials invalid" });
    expect(authenticateUser).toHaveBeenCalledWith({
      email: invalidEmail,
      password: invalidPassword,
    });
  });
});
