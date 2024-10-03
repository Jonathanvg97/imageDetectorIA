import { HfInference } from "@huggingface/inference";
import { detectDogInImage } from "../../../../src/services/dogDetectionService";
import { jest, describe, it, expect, beforeEach } from "@jest/globals";

// Mock de HfInference y fetch
jest.mock("@huggingface/inference");

const mockFetch = (global.fetch = jest.fn() as jest.MockedFunction<
  typeof fetch
>);

describe("detectDogInImage", () => {
  const mockImageUrl = "https://example.com/dog.jpg";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return true when a dog is detected in the image", async () => {
    // Mock del resultado de la clasificación con etiquetas que contienen palabras clave de perros
    const mockClassificationResult = [
      { label: "Golden Retriever" },
      { label: "Cat" },
      { label: "Beagle" },
    ];

    // Simular la respuesta de Hugging Face
    HfInference.prototype.imageClassification = jest
      .fn()
      .mockResolvedValue(mockClassificationResult);

    // Simular el fetch de la imagen
    mockFetch.mockResolvedValue({
      blob: jest.fn().mockResolvedValue(new Blob()),
    } as unknown as Response);

    const result = await detectDogInImage(mockImageUrl);

    expect(result).toBe(true); // Debe detectar un perro
    expect(HfInference.prototype.imageClassification).toHaveBeenCalled();
  });

  it("should return false when no dog is detected in the image", async () => {
    // Mock del resultado de la clasificación sin etiquetas de perros
    const mockClassificationResult = [
      { label: "Car" },
      { label: "Chair" },
      { label: "Tree" },
    ];

    // Simular la respuesta de Hugging Face
    HfInference.prototype.imageClassification = jest
      .fn()
      .mockResolvedValue(mockClassificationResult);

    // Simular el fetch de la imagen
    mockFetch.mockResolvedValue({
      blob: jest.fn().mockResolvedValue(new Blob()),
    } as unknown as Response);

    const result = await detectDogInImage(mockImageUrl);

    expect(result).toBe(false); // No debe detectar un perro
    expect(HfInference.prototype.imageClassification).toHaveBeenCalled();
  });

  it("should throw an error if there is a problem during inference", async () => {
    // Simular un error en la clasificación
    HfInference.prototype.imageClassification = jest
      .fn()
      .mockRejectedValue(new Error("Inference error"));

    // Simular el fetch de la imagen
    mockFetch.mockResolvedValue({
      blob: jest.fn().mockResolvedValue(new Blob()),
    } as unknown as Response);

    await expect(detectDogInImage(mockImageUrl)).rejects.toThrow(
      "Failed to detect dog in image"
    );

    expect(HfInference.prototype.imageClassification).toHaveBeenCalled();
  });
});
