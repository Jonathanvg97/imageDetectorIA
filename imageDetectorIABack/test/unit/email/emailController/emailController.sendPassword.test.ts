import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import pool from "../../../../src/config/bd/bd";
import { requestPasswordReset } from "../../../../src/controllers/emailController";
import { sendPasswordResetEmail } from "../../../../src/services/emailService";
import { envs } from "../../../../src/config/envs";
import {
  jest,
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "@jest/globals";

// Mock external dependencies
jest.mock("../../../../src/config/bd/bd");
jest.mock("jsonwebtoken");
jest.mock("../../../../src/services/emailService");

describe("requestPasswordReset - Unit Test", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let status: jest.Mock;
  let send: jest.Mock;

  beforeEach(() => {
    req = { body: { email: "test@example.com" } };
    send = jest.fn(); // Mock the send function
    status = jest.fn().mockReturnValue({ send }); // Mock status to return send
    res = { status }; // Mock res to include status
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it("should return 200 and a generic message if the email does not exist", async () => {
    // Mock the database query to return no results
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

    await requestPasswordReset(req as Request, res as Response);

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT id FROM users WHERE email = $1",
      ["test@example.com"]
    );
    expect(status).toHaveBeenCalledWith(200);
    expect(send).toHaveBeenCalledWith(
      "Si el correo existe, se enviará un enlace de recuperación."
    );
  });

  it("should generate a JWT token and insert it into the database if the email exists", async () => {
    // Mock the database query to return a user
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: 1 }] });

    // Mock JWT generation
    (jwt.sign as jest.Mock).mockReturnValue("mockToken");

    // Mock email sending
    (sendPasswordResetEmail as jest.Mock).mockResolvedValueOnce(null);

    await requestPasswordReset(req as Request, res as Response);

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT id FROM users WHERE email = $1",
      ["test@example.com"]
    );
    expect(jwt.sign).toHaveBeenCalledWith({ userId: 1 }, envs.JWT_SECRET, {
      expiresIn: envs.JWT_EXPIRATION,
    });
    expect(pool.query).toHaveBeenCalledWith(
      "INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [1, "mockToken", expect.any(Date)]
    );
    expect(sendPasswordResetEmail).toHaveBeenCalledWith(
      "test@example.com",
      "mockToken"
    );
    expect(status).toHaveBeenCalledWith(200);
    expect(send).toHaveBeenCalledWith(
      "Si el correo existe, se enviará un enlace de recuperación."
    );
  });

  it("should return 500 if there is an error", async () => {
    // Mock the database query to throw an error
    (pool.query as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );

    await requestPasswordReset(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(500);
    expect(send).toHaveBeenCalledWith(
      "Error enviando el correo de recuperación"
    );
  });
});
