import { Request, Response } from "express";
import { userDelete } from "../../../../src/controllers/userController";
import { deleteUser } from "../../../../src/services/userService";
import { jest, describe, it, expect, beforeEach } from "@jest/globals";

// Mock the deleteUser service
jest.mock("../../../../src/services/userService");

describe("userDelete", () => {
  let req: { params: { userId?: string } }; // Explicitly define params
  let res: Partial<Response>;
  let json: jest.Mock;
  let status: jest.Mock;

  beforeEach(() => {
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json }); // Mock the response
    req = {
      params: { userId: "" }, // Initialize params with a default value
    };
    res = { status }; // Initialize the response object
  });

  it("should return 400 if ID format is invalid", async () => {
    req.params.userId = "invalid-id"; // Invalid ID

    await userDelete(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ message: "Invalid ID format" });
  });

  it("should return 400 if ID is missing", async () => {
    delete req.params.userId; // Delete the userId property

    await userDelete(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ message: "ID is required" });
  });

  it("should return 404 if user is not found", async () => {
    (deleteUser as jest.Mock).mockResolvedValue({ rowCount: 0 });

    req.params.userId = "123e4567-e89b-12d3-a456-426614174000"; // Valid ID for the test

    await userDelete(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should return 200 if user is deleted successfully", async () => {
    (deleteUser as jest.Mock).mockResolvedValue({ rowCount: 1 });

    req.params.userId = "123e4567-e89b-12d3-a456-426614174000"; // Valid ID for the test

    await userDelete(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ message: "User deleted successfully" });
  });

  it("should return 500 on internal server error", async () => {
    (deleteUser as jest.Mock).mockRejectedValue(new Error("Database error"));

    req.params.userId = "123e4567-e89b-12d3-a456-426614174000"; // Valid ID for the test

    await userDelete(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ message: "Internal Server Error" });
  });
});
