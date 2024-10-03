import { HfInference } from "@huggingface/inference";
import { imageToText } from "../../../../src/services/huggingFaceService";
import { jest, describe, it, expect, beforeEach } from "@jest/globals";

jest.mock("@huggingface/inference");

describe("imageToText", () => {
  let mockImageToText: jest.Mock;

  beforeEach(() => {
    // Reset any previous mocks
    jest.clearAllMocks();

    // Mock the HfInference class and its imageToText method
    mockImageToText = jest.fn();
    (HfInference as jest.Mock).mockImplementation(() => ({
      imageToText: mockImageToText,
    }));

    // Mock the fetch function
    global.fetch = jest.fn();
  });

  it("should convert an image to text correctly", async () => {
    // Set up the mocked fetch response
    const imageURL = "http://example.com/image.jpg";
    const model = "your-model-name";

    (fetch as jest.Mock).mockResolvedValue({
      blob: jest.fn().mockResolvedValue(new Blob(["image data"])),
    });

    // Simulate API response for image to text conversion
    mockImageToText.mockResolvedValue({
      generated_text: "This is an image description.",
    });

    const result = await imageToText(imageURL, model);

    // Verify that fetch was called with the correct image URL
    expect(fetch).toHaveBeenCalledWith(imageURL);

    // Verify that the imageToText method was called with the correct parameters
    expect(mockImageToText).toHaveBeenCalledWith({
      data: expect.any(Blob), // Expect a Blob object
      model,
    });

    // Verify the returned result
    expect(result).toBe("This is an image description.");
  });

  it("should throw an error if fetch fails", async () => {
    const imageURL = "http://example.com/image.jpg";
    const model = "your-model-name";

    // Mock fetch to reject
    (fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    await expect(imageToText(imageURL, model)).rejects.toThrow("Network error");
  });

  it("should throw an error if imageToText fails", async () => {
    const imageURL = "http://example.com/image.jpg";
    const model = "your-model-name";

    // Mock the fetch response
    (fetch as jest.Mock).mockResolvedValue({
      blob: jest.fn().mockResolvedValue(new Blob(["image data"])),
    });

    // Mock imageToText to reject
    mockImageToText.mockRejectedValue(new Error("API error"));

    await expect(imageToText(imageURL, model)).rejects.toThrow("API error");
  });
});
