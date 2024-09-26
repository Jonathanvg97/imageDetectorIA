import { envs } from "../../../../../src/config/envs";
import { verifyGoogleToken } from "../../../../../src/services/authGoogleService";

// Crea un mock de la clase OAuth2Client
jest.mock("google-auth-library", () => {
  const mockVerifyIdToken = jest.fn(); // Simula el método verifyIdToken
  return {
    OAuth2Client: jest.fn().mockImplementation(() => ({
      verifyIdToken: mockVerifyIdToken,
    })),
    mockVerifyIdToken,
  };
});
describe("verifyGoogleToken - Unit Test", () => {
  const mockToken = "valid_token";
  const mockPayload = {
    email: "test@example.com",
    name: "Test User",
    picture: "http://example.com/picture.jpg",
  };

  const { mockVerifyIdToken } = require("google-auth-library");

  beforeEach(() => {
    jest.clearAllMocks(); // Limpia los mocks antes de cada prueba
  });

  it("should return user data on successful token verification", async () => {
    // Simula que verifyIdToken devuelve un ticket con un payload válido
    mockVerifyIdToken.mockResolvedValueOnce({
      getPayload: jest.fn().mockReturnValueOnce(mockPayload), // Simula el método getPayload
    });

    const user = await verifyGoogleToken(mockToken);

    // Comprueba que el usuario devuelto sea el esperado
    expect(user).toEqual({
      id: "0", // ID simulado
      email: "test@example.com",
      name: "Test User",
      picture: "http://example.com/picture.jpg",
    });

    // Verifica que verifyIdToken fue llamado con los argumentos correctos
    expect(mockVerifyIdToken).toHaveBeenCalledWith({
      idToken: mockToken,
      audience: envs.GOOGLE_CLIENT_ID,
    });
  });

  it("should return null if no payload is returned", async () => {
    // Simula que verifyIdToken devuelve un ticket con un payload nulo
    mockVerifyIdToken.mockResolvedValueOnce({
      getPayload: jest.fn().mockReturnValueOnce(null), // Simula un payload nulo
    });

    const user = await verifyGoogleToken(mockToken);

    // Comprueba que el usuario devuelto sea null
    expect(user).toBeNull();
  });

  it("should return null if an error occurs during token verification", async () => {
    // Simula que verifyIdToken lanza un error
    mockVerifyIdToken.mockRejectedValueOnce(new Error("Verification failed"));

    const user = await verifyGoogleToken(mockToken);

    // Comprueba que el usuario devuelto sea null
    expect(user).toBeNull();

    // Verifica que se haya llamado a console.error
    expect(console.error).toHaveBeenCalledWith(
      "Error verifying Google token",
      expect.any(Error)
    );
  });
});

// Mock para console.error
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});
