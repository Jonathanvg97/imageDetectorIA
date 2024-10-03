import request from "supertest";
import express from "express";
import { updateUser } from "../../../src/services/userService";
import { userUpdate } from "../../../src/controllers/userController";
import { jest, describe, it, expect } from "@jest/globals";

jest.mock("../../../src/services/userService");

// Crear una aplicación de Express
const app = express();
app.use(express.json()); // Para analizar cuerpos JSON

app.post("/api/user/:userId", (req, res) => {
  userUpdate(req, res); // Llamar al controlador
});

describe("POST /api/user/:userId", () => {
  it("should update a user successfully", async () => {
    const validUUID = "123e4567-e89b-12d3-a456-426614174000"; // A valid UUID

    // Mock de la respuesta de la base de datos
    const mockUser = {
      rows: [
        {
          id: validUUID,
          email: "test@example.com",
          name: "Test User Updated",
          picture: "https://test.com/picture.jpg",
        },
      ],
    };

    (updateUser as jest.Mock).mockResolvedValue(mockUser);

    // Petición POST simulada para actualizar un usuario
    const response = await request(app)
      .post(`/api/user/${validUUID}`)
      .send({
        id: validUUID,
        name: "Test User Updated",
        picture: "https://test.com/picture.jpg",
      })
      .expect(200);

    // Verificar la respuesta
    expect(response.body).toEqual({
      message: "User updated successfully",
      user: mockUser.rows[0],
    });
    expect(updateUser).toHaveBeenCalledTimes(1);
    expect(updateUser).toHaveBeenCalledWith(validUUID, {
      name: "Test User Updated",
      picture: "https://test.com/picture.jpg",
    });
  });

  it("should return 400 if name or picture is missing", async () => {
    const validUUID = "123e4567-e89b-12d3-a456-426614174000"; // A valid UUID

    const response = await request(app)
      .post(`/api/user/${validUUID}`)
      .send({
        id: validUUID,
      })
      .expect(400);

    expect(response.body).toHaveProperty(
      "message",
      "At least one field (name or picture) is required for update"
    );
  });

  it("should return 400 if userId is invalid", async () => {
    const response = await request(app)
      .post("/api/user/invalid-uuid")
      .expect(400);

    expect(response.body).toHaveProperty("message", "Invalid ID format");
  });

  it("should return 404 if userId is not found", async () => {
    const validUUID = "123e4567-e89b-12d3-a456-426614174000"; // A valid UUID

    // Simular que `updateUser` devuelve null cuando no se encuentra el usuario
    (updateUser as jest.Mock).mockResolvedValueOnce(null);

    // Petición POST simulada para actualizar un usuario
    const response = await request(app)
      .post(`/api/user/${validUUID}`)
      .send({
        name: "Test User Updated",
        picture: "https://test.com/picture.jpg",
      })
      .expect(404);

    // Verificar la respuesta
    expect(response.body).toEqual({
      message: "User not found",
    });
  });

  it("should return 500 if an error occurs in the service", async () => {
    const validUUID = "123e4567-e89b-12d3-a456-426614174000"; // A valid UUID

    // Simular un error en el servicio
    (updateUser as jest.Mock).mockRejectedValue(new Error("Service Error"));

    // Petición POST simulada para actualizar un usuario
    const response = await request(app)
      .post(`/api/user/${validUUID}`)
      .send({
        name: "Test User Updated",
        picture: "https://test.com/picture.jpg",
      })
      .expect(500);

    // Verificar la respuesta
    expect(response.body.message).toBe("Internal Server Error");
  });
});
