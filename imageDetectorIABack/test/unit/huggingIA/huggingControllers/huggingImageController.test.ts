import { convertImageToText } from "../../../../src/controllers/huggingFaceController";
import { Request, Response } from "express";
import { imageToText } from "../../../../src/services/huggingFaceService";

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
      body: {},
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
    const imageURL = "http://example.com/image.jpg";
    const model = "your-model-name";
    const expectedResult = { generated_text: "This is the extracted text." };

    req.body = { imageURL, model };
    (imageToText as jest.Mock).mockResolvedValue(expectedResult); // Mock successful response

    await convertImageToText(req as Request, res as Response);

    expect(imageToText).toHaveBeenCalledWith(imageURL, model);
    expect(res.status).toHaveBeenCalledWith(200); // Expect status to be 200
    expect(json).toHaveBeenCalledWith(expectedResult);
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
