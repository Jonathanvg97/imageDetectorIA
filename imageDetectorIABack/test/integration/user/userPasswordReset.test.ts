import request from "supertest";
import express from "express";
import { resetPassword } from "../../../src/services/userService";
import { passwordReset } from "../../../src/controllers/userController";

jest.mock("../../../src/services/userService");

// Crear una aplicación de Express
const app = express();
app.use(express.json()); // Para analizar cuerpos JSON

app.post("/api/user/reset-password", (req, res) => {
  passwordReset(req, res); // Llamar al controlador
});

describe("POST /api/user/reset-password", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpiar los mocks antes de cada prueba
  });

  it("should reset the password successfully", async () => {
    const validToken = "valid-token"; // Simulación de un token válido
    const newPassword = "NewP@ssw0rd!"; // Nueva contraseña válida

    // Simular la respuesta de la función resetPassword
    const message = "Password has been reset successfully";
    (resetPassword as jest.Mock).mockResolvedValue(message);

    // Petición POST simulada para restablecer la contraseña
    const response = await request(app)
      .post("/api/user/reset-password")
      .send({
        token: validToken,
        newPassword,
      })
      .expect(200);

    // Verificar la respuesta
    expect(response.body).toEqual({ message });
    expect(resetPassword).toHaveBeenCalledTimes(1);
    expect(resetPassword).toHaveBeenCalledWith(validToken, newPassword);
  });

  it("should return 400 if the password does not meet criteria", async () => {
    const validToken = "valid-token"; // Simulación de un token válido
    const newPassword = "short"; // Nueva contraseña inválida

    // Petición POST simulada para restablecer la contraseña
    const response = await request(app)
      .post("/api/user/reset-password")
      .send({
        token: validToken,
        newPassword,
      })
      .expect(400);

    // Verificar la respuesta
    expect(response.body).toEqual({
      message:
        "Password must be at least 8 characters long, contain at least one letter, one number, and one special character",
    });
    expect(resetPassword).toHaveBeenCalledTimes(0); // Asegurarse de que resetPassword no fue llamado
  });

  it("should return 400 if the token is invalid", async () => {
    const invalidToken = "invalid-token"; // Simulación de un token inválido
    const newPassword = "NewP@ssw0rd!"; // Nueva contraseña válida

    // Simular un error de token inválido en resetPassword
    (resetPassword as jest.Mock).mockRejectedValue(new Error("Invalid token"));

    // Petición POST simulada para restablecer la contraseña
    const response = await request(app)
      .post("/api/user/reset-password")
      .send({
        token: invalidToken,
        newPassword,
      })
      .expect(400);

    // Verificar la respuesta
    expect(response.body).toEqual({ error: "Invalid token" });
    expect(resetPassword).toHaveBeenCalledTimes(1);
    expect(resetPassword).toHaveBeenCalledWith(invalidToken, newPassword);
  });

  it("should return 500 on unexpected errors", async () => {
    const validToken = "valid-token"; // Simulación de un token válido
    const newPassword = "NewP@ssw0rd!"; // Nueva contraseña válida

    // Simular un error inesperado en resetPassword
    (resetPassword as jest.Mock).mockRejectedValue(
      new Error("Unexpected error")
    );

    // Petición POST simulada para restablecer la contraseña
    const response = await request(app)
      .post("/api/user/reset-password")
      .send({
        token: validToken,
        newPassword,
      })
      .expect(500);

    // Verificar la respuesta
    expect(response.body).toEqual({
      error: "Error inesperado al restablecer la contraseña.",
    });
    expect(resetPassword).toHaveBeenCalledTimes(1);
    expect(resetPassword).toHaveBeenCalledWith(validToken, newPassword);
  });
});
