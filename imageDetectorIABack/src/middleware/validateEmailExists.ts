// src/middleware/validateEmailExists.ts
import { Request, Response, NextFunction } from "express";
import { emailExists } from "../models/userModel";

/**
 * Middleware to check if the email already exists in the database.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @return {Promise<void>} Calls the next middleware or responds with an error.
 */
export const validateEmailExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: "Email not provided" });
    return;
  }

  if (await emailExists(email)) {
    res
      .status(400)
      .json({ message: "Email is already registered in ImageDetectorIA" });
    return;
  }

  next();
};
