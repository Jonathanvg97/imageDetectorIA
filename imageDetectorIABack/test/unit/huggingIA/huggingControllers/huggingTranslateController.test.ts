import { Request, Response } from "express";
import { translateText } from "../../../../src/services/huggingTranslateService";
import { translateTextController } from "../../../../src/controllers/huggingTranslateController";

// Mock the translateText service
jest.mock("../../../../src/services/huggingTranslateService");

describe("translateTextController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let json: jest.Mock;

  beforeEach(() => {
    // Set up mock request and response objects
    json = jest.fn();
    res = {
      status: jest.fn().mockReturnThis(),
      json: json,
    };
    jest.clearAllMocks();
  });

  it("should return 400 if text or languageTranslate is missing", async () => {
    req = {
      body: {}, // No text or languageTranslate provided
    };

    await translateTextController(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      error: "text is required or language is required",
    });
  });

  it("should return 200 with translated text when translation is successful", async () => {
    req = {
      body: { text: "Hello world", languageTranslate: 1 },
    };

    (translateText as jest.Mock).mockResolvedValue("Hola mundo");

    await translateTextController(req as Request, res as Response);

    expect(res.status).not.toHaveBeenCalledWith(400);
    expect(res.status).not.toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith("Hola mundo");
    expect(translateText).toHaveBeenCalledWith("Hello world", 1);
  });

  it("should return 500 if an error occurs in the translation service", async () => {
    req = {
      body: { text: "Hello world", languageTranslate: 1 },
    };

    (translateText as jest.Mock).mockRejectedValue(
      new Error("Translation error")
    );

    await translateTextController(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      error: "An error occurred while processing the text",
    });
  });
});
