import request from "supertest";
import express from "express";
import { detectDog } from "../../../src/controllers/dogDetectionController";
import { detectDogInImage } from "../../../src/services/dogDetectionService";
import { jest, describe, it, expect } from "@jest/globals";

jest.mock("../../../src/services/dogDetectionService");

// Crear una aplicación de Express
const app = express();
app.use(express.json()); // Para analizar cuerpos JSON

// Definir la ruta para la detección de perros
app.post("/api/detect-dog", (req, res) => {
  detectDog(req, res); // Llamar al controlador
});

describe("POST /api/detect-dog", () => {
  it("should detect dog in image and return the result equal to true", async () => {
    // Simular la respuesta del servicio mockeada
    (detectDogInImage as jest.Mock).mockResolvedValue(true);

    const imageDogUrl =
      "https://c.files.bbci.co.uk/48DD/production/_107435681_perro1.jpg";

    const response = await request(app)
      .post("/api/detect-dog")
      .send({ imageUrl: imageDogUrl });

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty("isDogPresent", true);
  });

  it("should detect dog in image and return the result equal to false when there is no dog", async () => {
    // Simular la respuesta del servicio mockeada
    (detectDogInImage as jest.Mock).mockResolvedValue(false);

    const imageCatUrl =
      "https://c.files.bbci.co.uk/48DD/production/_107435681_cat.jpg";

    const response = await request(app)
      .post("/api/detect-dog")
      .send({ imageUrl: imageCatUrl });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("isDogPresent", false);
  });

  it("should return 400 if imageUrl is missing", async () => {
    const response = await request(app).post("/api/detect-dog").send({}); // No enviar imageUrl

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Image URL is required");
  });

  it("should return 500 if the service throws an error", async () => {
    (detectDogInImage as jest.Mock).mockRejectedValue(
      new Error("Service Error")
    );

    const imageDogUrl =
      "https://c.files.bbci.co.uk/48DD/production/_107435681_perro1.jpg";

    const response = await request(app)
      .post("/api/detect-dog")
      .send({ imageUrl: imageDogUrl });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty(
      "error",
      "Error detecting dog in image"
    );
  });
});
