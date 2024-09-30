import request from "supertest";
import express from "express";
import { requestPasswordReset } from "../../../src/controllers/emailController";
import { sendPasswordResetEmail } from "../../../src/services/emailService";
import pool from "../../../src/config/bd/bd"; // Mocks para la BD
import jwt from "jsonwebtoken";

// Mockear los servicios necesarios
jest.mock("../../../src/services/emailService");
jest.mock("../../../src/config/bd/bd");
jest.mock("jsonwebtoken");

// Configurar la aplicación de Express
const app = express();
app.use(express.json()); // Analizar cuerpos JSON
app.post("/api/password-reset", requestPasswordReset); // Ruta para la prueba

describe("POST /api/password-reset", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpia todos los mocks antes de cada prueba
  });

  it("should send a password reset email if the user exists", async () => {
    // Simular que el usuario existe en la base de datos
    (pool.query as jest.Mock).mockResolvedValue({
      rows: [{ id: 1 }],
    });

    // Simular la generación del token JWT
    (jwt.sign as jest.Mock).mockReturnValue("mocked-jwt-token");

    // Mockear la función para enviar el correo
    (sendPasswordResetEmail as jest.Mock).mockResolvedValue({});

    // Hacer la solicitud de restablecimiento de contraseña
    const response = await request(app)
      .post("/api/password-reset")
      .send({ email: "testuser@example.com" });

    // Verificar que la respuesta sea exitosa
    expect(response.status).toBe(200);
    expect(response.text).toBe(
      "Si el correo existe, se enviará un enlace de recuperación."
    );

    // Verificar que se haya llamado a la función de envío de correo con los datos correctos
    expect(sendPasswordResetEmail).toHaveBeenCalledWith(
      "testuser@example.com",
      "mocked-jwt-token"
    );

    // Verificar que el token se haya generado con los argumentos correctos
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: 1 },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );
  });

  it("should return the same message if the email does not exist", async () => {
    // Simular que el usuario no existe en la base de datos
    (pool.query as jest.Mock).mockResolvedValue({
      rows: [],
    });

    // Hacer la solicitud con un correo inexistente
    const response = await request(app)
      .post("/api/password-reset")
      .send({ email: "nonexistent@example.com" });

    // Verificar que la respuesta sea la misma (para evitar filtración de datos)
    expect(response.status).toBe(200);
    expect(response.text).toBe(
      "Si el correo existe, se enviará un enlace de recuperación."
    );

    // Verificar que no se haya llamado a la función de envío de correo
    expect(sendPasswordResetEmail).not.toHaveBeenCalled();
  });

  it("should handle server errors gracefully", async () => {
    // Simular un error en la base de datos
    (pool.query as jest.Mock).mockRejectedValue(
      new Error("Service Error in DB")
    );

    // Hacer la solicitud de restablecimiento de contraseña
    const response = await request(app)
      .post("/api/password-reset")
      .send({ email: "testuser@example.com" });

    // Verificar que la respuesta sea un error 500
    expect(response.status).toBe(500);
    expect(response.text).toBe("Error enviando el correo de recuperación");
  });
});
