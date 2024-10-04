import request from "supertest";
import express from "express";
import { googleLogin } from "../../../src/controllers/authGoogleController";
import { verifyGoogleToken } from "../../../src/services/authGoogleService";
import { v4 as uuidv4 } from "uuid";

jest.mock("../../../src/services/authGoogleService");
jest.mock("uuid"); // Mock the UUID generation

// Crear una aplicación de Express
const app = express();
app.use(express.json()); // Para analizar cuerpos JSON

app.post("/api/google-login", (req, res) => {
  googleLogin(req, res); // Llamar al controlador
});

describe("POST /api/google-login", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should log in an existing user successfully", async () => {
    const mockToken = "validGoogleToken";
    const mockPayload = {
      email: "test@example.com",
      name: "Test User",
      picture: "test-pic.jpg",
    };

    const mockUserId = "5412b369-b629-4601-af21-e81ef9325f9e"; // Example UUID
    const mockUser = {
      id: mockUserId,
      email: "test@example.com",
      name: "Test User",
      picture: "test-pic.jpg",
    };

    // Mockear la verificación del token de Google
    (verifyGoogleToken as jest.Mock).mockResolvedValue(mockPayload);

    // Mock UUID generation
    (uuidv4 as jest.Mock).mockReturnValue(mockUserId);

    const response = await request(app)
      .post("/api/google-login")
      .send({ token: mockToken })
      .expect(200);

    expect(response.body).toEqual({
      message: "Login successful",
      user: mockUser,
      token: mockToken,
    });
  });
});
