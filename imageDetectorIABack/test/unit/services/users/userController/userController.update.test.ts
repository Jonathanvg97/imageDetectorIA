import { Request, Response } from "express";
import { userUpdate } from "../../../../../src/controllers/userController";
import { updateUser } from "../../../../../src/services/userService";

// Mock the updateUser service
jest.mock("../../../../../src/services/userService");

describe("userUpdate", () => {
  let req: {
    params: { userId?: string };
    body: { name?: string; picture?: string };
  };
  let res: Partial<Response>;
  let json: jest.Mock;
  let status: jest.Mock;

  beforeEach(() => {
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json }); // Mock the response
    req = {
      params: {}, // Initialize params as an empty object
      body: {}, // Initialize body as an object
    };
    res = { status }; // Initialize the response object
  });

  it("should return 400 if ID is missing", async () => {
    req.params.userId = ""; // Simulate missing userId
    await userUpdate(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ message: "ID is required" });
  });

  it("should return 400 if no fields are provided for update", async () => {
    req.params.userId = "123e4567-e89b-12d3-a456-426614174000"; // Valid userId
    // No name or picture provided

    await userUpdate(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      message: "At least one field (name or picture) is required for update",
    });
  });

  it("should return 404 if user is not found", async () => {
    req.params.userId = "123e4567-e89b-12d3-a456-426614174000"; // Valid userId
    req.body.name = "Updated Name"; // Provide a field for update

    (updateUser as jest.Mock).mockResolvedValue(null); // Simulate user not found

    await userUpdate(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should return 200 if user is updated successfully", async () => {
    req.params.userId = "123e4567-e89b-12d3-a456-426614174000"; // Valid userId
    req.body.name = "Updated Name"; // Provide a field for update

    const mockUpdatedUser = {
      rows: [{ id: req.params.userId, name: req.body.name }],
    };

    (updateUser as jest.Mock).mockResolvedValue(mockUpdatedUser); // Simulate successful update

    await userUpdate(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({
      message: "User updated successfully",
      user: mockUpdatedUser.rows[0],
    });
  });

  it("should return 500 on internal server error", async () => {
    req.params.userId = "123e4567-e89b-12d3-a456-426614174000"; // Valid userId
    req.body.name = "Updated Name"; // Provide a field for update

    (updateUser as jest.Mock).mockRejectedValue(new Error("Database error")); // Simulate error

    await userUpdate(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ message: "Internal Server Error" });
  });
});
