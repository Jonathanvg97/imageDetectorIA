import { Request, Response } from "express";
import { authenticateUser } from "../../../../src/services/authService";
import { userLogin } from "../../../../src/controllers/authController";

jest.mock("../../../../src/services/authService"); // Mockea el servicio

describe("userLogin - Unit Test", () => {
  const mockRequest = (body = {}) =>
    ({
      body,
    } as Request);

  const mockResponse = () => {
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    return res as Response;
  };

  it("should return user and token on successful login", async () => {
    const req = mockRequest({
      email: "test@example.com",
      password: "plainPassword",
    });

    const res = mockResponse();

    const mockUser = {
      id: 1,
      email: "test@example.com",
      name: "Test User",
      picture: "http://example.com/picture.jpg",
    };

    // Simula la respuesta del servicio authenticateUser
    (authenticateUser as jest.Mock).mockResolvedValueOnce({
      user: mockUser,
      token: "mockToken",
    });

    await userLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      user: mockUser,
      token: "mockToken",
    });

    // Verifica que authenticateUser fue llamado con los datos correctos
    expect(authenticateUser).toHaveBeenCalledWith({
      email: req.body.email,
      password: req.body.password,
    });
  });

  it("should return 400 if email or password is missing", async () => {
    const req = mockRequest({ email: "test@example.com" }); // Falta la contraseña
    const res = mockResponse();

    await userLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Email and password are required",
    });
  });

  it("should return 401 if credentials are invalid", async () => {
    const req = mockRequest({
      email: "test@example.com",
      password: "plainPassword",
    });
    const res = mockResponse();

    // Simula un error en authenticateUser
    (authenticateUser as jest.Mock).mockRejectedValueOnce(
      new Error("Invalid email or password")
    );

    await userLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Credentials invalid",
    });
  });
});
