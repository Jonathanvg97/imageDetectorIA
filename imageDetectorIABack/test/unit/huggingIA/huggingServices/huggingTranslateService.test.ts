import { HfInference } from "@huggingface/inference";
import { translateText } from "../../../../src/services/huggingTranslateService";
import { envs } from "../../../../src/config/envs";
import { jest, describe, it, expect, beforeEach } from "@jest/globals";

// Mock the entire "@huggingface/inference" module
jest.mock("@huggingface/inference");

describe("translateText Service", () => {
  let mockTranslation: jest.Mock;

  beforeEach(() => {
    // Mock HfInference class and its method 'translation'
    mockTranslation = jest.fn();
    (HfInference as jest.Mock).mockImplementation(() => ({
      translation: mockTranslation,
    }));

    jest.clearAllMocks();
  });

  it("should translate from English to Spanish correctly", async () => {
    // Simulate API response
    mockTranslation.mockResolvedValue([{ translation_text: "Hola mundo" }]);

    const result = await translateText("Hello world", 1);

    // Verify the translation is correct
    expect(mockTranslation).toHaveBeenCalledWith({
      model: envs.MODEL_HUGGING_TRANSLATE,
      inputs: "Hello world",
      parameters: {
        src_lang: "en",
        tgt_lang: "es",
      },
    });
    expect(result).toBe("Hola mundo");
  });

  it("should translate from Spanish to English correctly", async () => {
    mockTranslation.mockResolvedValue([{ translation_text: "Hello world" }]);

    const result = await translateText("Hola mundo", 2);

    expect(mockTranslation).toHaveBeenCalledWith({
      model: envs.MODEL_HUGGING_TRANSLATE_EN,
      inputs: "Hola mundo",
      parameters: {
        src_lang: "es",
        tgt_lang: "en",
      },
    });
    expect(result).toBe("Hello world");
  });

  it("should throw an error if the translation model is not defined", async () => {
    const envsBackup = { ...envs };
    envs.MODEL_HUGGING_TRANSLATE = undefined;

    await expect(translateText("Hello world", 1)).rejects.toThrow(
      "Model not defined for translation."
    );

    envs.MODEL_HUGGING_TRANSLATE = envsBackup.MODEL_HUGGING_TRANSLATE;
  });

  it("should handle non-array results from Hugging Face", async () => {
    mockTranslation.mockResolvedValue({
      translation_text: "Hello world",
    });

    const result = await translateText("Hola mundo", 2);

    expect(result).toBe("Hello world");
  });

  it("should handle errors from Hugging Face API", async () => {
    mockTranslation.mockRejectedValue(new Error("API error"));

    await expect(translateText("Hello world", 1)).rejects.toThrow("API error");

    expect(mockTranslation).toHaveBeenCalledWith({
      model: envs.MODEL_HUGGING_TRANSLATE,
      inputs: "Hello world",
      parameters: {
        src_lang: "en",
        tgt_lang: "es",
      },
    });
  });
});
