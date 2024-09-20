// src/services/authService.ts
import { OAuth2Client } from "google-auth-library";
import { envs } from "../config/envs";
import { User } from "../types/user.types";

const client = new OAuth2Client(envs.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (
  token: string
): Promise<User | null> => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: envs.GOOGLE_CLIENT_ID, // Especifica el ID de cliente de Google
    });
    const payload = ticket.getPayload();
    if (!payload) {
      return null;
    }
    return {
      id: 0,
      email: payload.email || "",
      name: payload.name || "",
      picture: payload.picture || "",
    };
  } catch (error) {
    console.error("Error verifying Google token", error);
    return null;
  }
};
