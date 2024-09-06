import { Request, Response, NextFunction } from "express";
import { verifyGoogleToken } from "../services/authService";
import { User } from "../types/user.types";

export const authenticationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.split(" ")[1] : undefined;

  if (req.isConsumptionLimitReached && !token) {
    return res.status(403).json({
      error: "You have exceeded the allowed number of requests. Please log in.",
    });
  }

  if (token) {
    try {
      const user: User | null = await verifyGoogleToken(token);
      if (!user) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }
      req.user = user;
    } catch (error) {
      console.error("Error during token verification:", error);
      return res.status(401).json({ error: "Token verification error" });
    }
  }

  next();
};
