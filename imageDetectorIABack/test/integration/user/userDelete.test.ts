import request from "supertest";
import express from "express";
import { deleteUser } from "../../../src/services/userService";
import { userDelete } from "../../../src/controllers/userController";

jest.mock("../../../src/services/userService");

// Crear una aplicación de Express
const app = express();
app.use(express.json()); // Para analizar cuerpos JSON

app.delete("/api/user/:userId", (req, res) => {
  userDelete(req, res); // Llamar al controlador
});

describe("DELETE /api/user/:userId", () => {
  it("should delete a user successfully", async () => {
    const validUUID = "123e4567-e89b-12d3-a456-426614174000"; // A valid UUID

    const mockUser = {
      id: validUUID,
      email: "test@example.com",
      name: "Test User",
      password: "hashedPassword",
      picture: "https://test.com/picture.jpg",
    };

    // Simular que deleteUser devuelve un usuario borrado
    (deleteUser as jest.Mock).mockResolvedValue(mockUser);

    // Petición DELETE simulada para borrar un usuario
    const response = await request(app)
      .delete(`/api/user/${validUUID}`)
      .expect(200);

    // Verificar la respuesta
    expect(response.body).toHaveProperty(
      "message",
      "User deleted successfully"
    );

    // Verificar que el servicio fue llamado correctamente
    expect(deleteUser).toHaveBeenCalledTimes(1);
  });

  it("should return 400 if userId is invalid", async () => {
    const response = await request(app)
      .delete("/api/user/invalid-uuid")
      .expect(400);

    expect(response.body).toHaveProperty("message", "Invalid ID format");
  });

  it("should return 404 if user not found", async () => {
    const validUUID = "123e4567-e89b-12d3-a456-426614174000";

    // Simular que deleteUser devuelve un usuario no encontrado
    (deleteUser as jest.Mock).mockResolvedValue({ rowCount: 0 });

    const response = await request(app)
      .delete(`/api/user/${validUUID}`)
      .expect(404);

    expect(response.body).toHaveProperty("message", "User not found");
  });

  it("should return 500 if an error occurs in the service", async () => {
    (deleteUser as jest.Mock).mockRejectedValue(new Error("Service Error"));

    const validUUID = "123e4567-e89b-12d3-a456-426614174000";

    const response = await request(app)
      .delete(`/api/user/${validUUID}`)
      .expect(500);

    expect(response.body).toHaveProperty("message", "Internal Server Error");
  });
});
