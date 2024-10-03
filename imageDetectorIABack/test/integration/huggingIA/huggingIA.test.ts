import request from "supertest";
import express from "express";
import { envs } from "../../../src/config/envs";
import { convertImageToText } from "../../../src/controllers/huggingFaceController";
import { imageToText } from "../../../src/services/huggingFaceService";
import { jest, describe, it, expect } from "@jest/globals";


jest.mock("../../../src/services/huggingFaceService");

// Crear una aplicación de Express
const app = express();
app.use(express.json()); // Para analizar cuerpos JSON

// Definir la ruta para la conversión de imagen a texto
app.post("/api/convert-image-to-text", (req, res) => {
  convertImageToText(req, res); // Llamar al controlador
});

describe("POST /api/convert-image-to-text", () => {
  it("should convert image to text and return the result", async () => {
    (imageToText as jest.Mock).mockResolvedValue(
      "This is an image description."
    );
    const imageURL =
      "https://www.slantmagazine.com/wp-content/uploads/2002/10/transporter.jpg";
    const response = await request(app)
      .post("/api/convert-image-to-text")
      .send({ imageURL, model: envs.MODEL_HUGGING_FACE });

    expect(response.status).toBe(200); // Verifica el código de estado
    expect(response.body).toHaveProperty(
      "generated_text",
      "This is an image description."
    );
  });

  it("should return 400 if imageURL and model are missing", async () => {
    const response = await request(app)
      .post("/api/convert-image-to-text")
      .send({}); // Enviar cuerpo vacío

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "imageURL and model are required"
    );
  });

  it("should return 500 if an error occurs in the service", async () => {
    (imageToText as jest.Mock).mockRejectedValue(new Error("Service Error"));

    // Simular un error en el servicio
    const imageURL =
      "https://www.slantmagazine.com/wp-content/uploads/2002/10/transporter.jpg";
    const response = await request(app)
      .post("/api/convert-image-to-text")
      .send({ imageURL, model: "modelo-erroneo" });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty(
      "error",
      "An error occurred while processing the image"
    );
  });
});
