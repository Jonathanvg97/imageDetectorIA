import { convertImageToText } from "../../../../src/controllers/huggingFaceController";
import { Request, Response } from "express";
import { imageToText } from "../../../../src/services/huggingFaceService";
import { jest, describe, it, expect, beforeEach } from "@jest/globals";

jest.mock("../../../../src/services/huggingFaceService"); // Mock the service

describe("convertImageToText", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let json: jest.Mock;

  beforeEach(() => {
    json = jest.fn();
    res = {
      status: jest.fn().mockReturnValue({ json }),
    };
    req = {
      body: {
        imageURL: "http://example.com/image.jpg",
        model: "your-model-name",
      },
    };
  });

  it("should return 400 if imageURL or model is missing", async () => {
    req.body = {}; // No data provided

    await convertImageToText(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      error: "imageURL and model are required",
    });
  });

  it("should convert image to text successfully", async () => {
    // Mock exitoso
    (imageToText as jest.Mock).mockResolvedValue(
      "This is a generated text ok."
    );

    // Llama al controlador
    await convertImageToText(req as Request, res as Response);

    // Asegúrate de que la función haya sido llamada
    expect(imageToText).toHaveBeenCalled(); // Verifica que se llamó
    expect(imageToText).toHaveBeenCalledWith(
      "http://example.com/image.jpg",
      "your-model-name"
    );

    // Verifica la respuesta
    expect(res.status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({
      generated_text: "This is a generated text ok.",
    });
  });

  it("should handle errors and return 500", async () => {
    const imageURL = "http://example.com/image.jpg";
    const model = "your-model-name";

    req.body = { imageURL, model };
    (imageToText as jest.Mock).mockRejectedValue(new Error("API error")); // Mock an error

    await convertImageToText(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      error: "An error occurred while processing the image",
    });
  });
});
