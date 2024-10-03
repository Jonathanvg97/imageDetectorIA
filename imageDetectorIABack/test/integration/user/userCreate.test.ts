import request from "supertest";
import express from "express";
import { createUser } from "../../../src/services/userService";
import { userCreate } from "../../../src/controllers/userController";
import { jest, describe, it, expect } from "@jest/globals";


jest.mock("../../../src/services/userService");

// Crear una aplicación de Express
const app = express();
app.use(express.json()); // Para analizar cuerpos JSON

app.post("/api/create-user", (req, res) => {
  userCreate(req, res); // Llamar al controlador
});

describe("POST /api/create-user", () => {
  it("should create a new user successfully", async () => {
    // Mock de la respuesta de la base de datos
    const mockUser = {
      id: "12345",
      email: "test@example.com",
      name: "Test User",
      password: "hashedPassword",
      picture: "https://test.com/picture.jpg",
    };

    (createUser as jest.Mock).mockResolvedValue(mockUser);

    // Petición POST simulada para crear un usuario
    const response = await request(app)
      .post("/api/create-user")
      .send({
        email: "test@example.com",
        name: "Test User",
        password: "StrongPass@123",
        picture: "https://test.com/picture.jpg",
      })
      .expect(201);

    // Verificar la respuesta
    expect(response.body).toEqual(mockUser);
    expect(createUser).toHaveBeenCalledTimes(1);
    expect(createUser).toHaveBeenCalledWith({
      email: "test@example.com",
      name: "Test User",
      password: "StrongPass@123",
      picture: "https://test.com/picture.jpg",
    });
  });

  it("should return 400 if email is invalid", async () => {
    const response = await request(app)
      .post("/api/create-user")
      .send({
        email: "invalid-email",
        name: "Test User",
        password: "StrongPass@123",
      })
      .expect(400);

    expect(response.body.message).toBe("Invalid email format");
  });

  it("should return 400 if password does not meet the requirements", async () => {
    const response = await request(app)
      .post("/api/create-user")
      .send({
        email: "test@example.com",
        name: "Test User",
        password: "weakpass",
      })
      .expect(400);

    expect(response.body.message).toContain(
      "Password must be at least 8 characters long, contain at least one letter, one number, and one special character"
    );
  });

  it("should return 500 if there is an internal server error", async () => {
    // Mock para simular un error del servicio
    (createUser as jest.Mock).mockRejectedValue(new Error("Service Error"));

    const response = await request(app)
      .post("/api/create-user")
      .send({
        email: "test@example.com",
        name: "Test User",
        password: "StrongPass@123",
      })
      .expect(500);

    expect(response.body.message).toBe("Internal Server Error");
    expect(response.body.error).toBe("An unexpected error occurred");
  });
});
