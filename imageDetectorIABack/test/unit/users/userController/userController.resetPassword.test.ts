import { Request, Response } from "express";
import { passwordReset } from "../../../../src/controllers/userController";
import { resetPassword } from "../../../../src/services/userService";
import { jest, describe, it, expect, beforeEach } from "@jest/globals";

// Mock the resetPassword service
jest.mock("../../../../src/services/userService");

describe("passwordReset", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let json: jest.Mock;
  let status: jest.Mock;

  beforeEach(() => {
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json }); // Mock the response
    req = {
      body: {}, // Initialize body as an object
    };
    res = { status }; // Initialize the response object
  });

  it("should return 400 if the password does not meet requirements", async () => {
    req.body.token = "valid-token";
    req.body.newPassword = "short"; // Invalid password

    await passwordReset(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      message:
        "Password must be at least 8 characters long, contain at least one letter, one number, and one special character",
    });
  });

  it("should return 200 if the password is reset successfully", async () => {
    req.body.token = "valid-token";
    req.body.newPassword = "ValidPassword1!"; // Valid password

    (resetPassword as jest.Mock).mockResolvedValue(
      "Password reset successfully"
    ); // Simulate successful reset

    await passwordReset(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({
      message: "Password reset successfully",
    });
  });

  it("should return 400 if there is an error with the resetPassword service", async () => {
    req.body.token = "valid-token";
    req.body.newPassword = "ValidPassword1!"; // Valid password

    (resetPassword as jest.Mock).mockRejectedValue(new Error("Invalid token")); // Simulate error

    await passwordReset(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ error: "Invalid token" });
  });

  it("should return 500 for unexpected errors", async () => {
    req.body.token = "valid-token";
    req.body.newPassword = "ValidPassword1!"; // Valid password

    (resetPassword as jest.Mock).mockRejectedValue(new Error()); // Simulate unexpected error

    await passwordReset(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      error: "Error inesperado al restablecer la contraseña.",
    });
  });
});
