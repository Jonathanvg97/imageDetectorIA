import { Request, Response } from "express";
import { detectDogInImage } from "../../../../src/services/dogDetectionService";
import { detectDog } from "../../../../src/controllers/dogDetectionController";
import { jest, describe, it, expect, beforeEach } from "@jest/globals";

// Mock del servicio detectDogInImage
jest.mock("../../../../src/services/dogDetectionService");

describe("detectDog Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    // Crear un mock del request y response
    mockReq = {
      body: {},
    };
    mockRes = {
      status: statusMock,
      json: jsonMock,
    };

    jest.clearAllMocks();
  });

  it("should return 400 if no imageUrl is provided", async () => {
    // Llamada al controlador sin `imageUrl` en el cuerpo
    await detectDog(mockReq as Request, mockRes as Response);

    // Verificaciones
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ error: "Image URL is required" });
  });

  it("should return isDogPresent true if a dog is detected", async () => {
    const mockImageUrl = "https://example.com/dog.jpg";
    mockReq.body = { imageUrl: mockImageUrl };

    // Simular el resultado del servicio
    (detectDogInImage as jest.Mock).mockResolvedValue(true);

    // Llamar al controlador con una imagen válida
    await detectDog(mockReq as Request, mockRes as Response);

    // Verificar la respuesta exitosa
    expect(detectDogInImage).toHaveBeenCalledWith(mockImageUrl);
    expect(mockRes.json).toHaveBeenCalledWith({ isDogPresent: true });
  });

  it("should return isDogPresent false if no dog is detected", async () => {
    const mockImageUrl = "https://example.com/no-dog.jpg";
    mockReq.body = { imageUrl: mockImageUrl };

    // Simular el resultado del servicio (no se detecta perro)
    (detectDogInImage as jest.Mock).mockResolvedValue(false);

    // Llamar al controlador con una imagen válida
    await detectDog(mockReq as Request, mockRes as Response);

    // Verificar que el controlador llama correctamente al servicio y retorna `false`
    expect(detectDogInImage).toHaveBeenCalledWith(mockImageUrl);
    expect(mockRes.json).toHaveBeenCalledWith({ isDogPresent: false });
  });

  it("should return 500 if there is an error during detection", async () => {
    const mockImageUrl = "https://example.com/error.jpg";
    mockReq.body = { imageUrl: mockImageUrl };

    // Simular un error en el servicio
    (detectDogInImage as jest.Mock).mockRejectedValue(
      new Error("Detection error")
    );

    // Llamar al controlador
    await detectDog(mockReq as Request, mockRes as Response);

    // Verificar que se manejó correctamente el error
    expect(detectDogInImage).toHaveBeenCalledWith(mockImageUrl);
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      error: "Error detecting dog in image",
    });
  });
});
