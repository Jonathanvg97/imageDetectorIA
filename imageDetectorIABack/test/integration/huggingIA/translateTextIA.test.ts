import request from "supertest";
import express from "express";
import { translateTextController } from "../../../src/controllers/huggingTranslateController";
import { translateText } from "../../../src/services/huggingTranslateService";

jest.mock("../../../src/services/huggingTranslateService");

// Crear una aplicación de Express
const app = express();
app.use(express.json()); // Para analizar cuerpos JSON

// Definir la ruta para la traducción de texto
app.post("/api/translate-text", (req, res) => {
  translateTextController(req, res); // Llamar al controlador
});

describe("POST /api/translate-text", () => {
  it("should translate text and return the result", async () => {
    // Simular el servicio devolviendo un objeto con `generated_text`
    (translateText as jest.Mock).mockResolvedValue({
      generated_text: "This is a translated text.",
    });

    const text = "This is a text to be translated.";
    const languageTranslate = 1;

    const response = await request(app)
      .post("/api/translate-text")
      .send({ text, languageTranslate });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "generated_text",
      "This is a translated text."
    );
  });

  it("should return 400 if text and languageTranslate are missing", async () => {
    const response = await request(app).post("/api/translate-text").send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "text is required or language is required"
    );
  });

  it("should return 500 if an error occurs in the service", async () => {
    (translateText as jest.Mock).mockRejectedValue(new Error("Service Error"));

    const text = "This is a text to be translated.";
    const languageTranslate = 1;

    const response = await request(app)
      .post("/api/translate-text")
      .send({ text, languageTranslate });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty(
      "error",
      "An error occurred while processing the text"
    );
  });
});
