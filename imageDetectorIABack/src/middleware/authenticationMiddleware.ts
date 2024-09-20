import { Request, Response, NextFunction } from "express";
import { verifyGoogleToken } from "../services/authGoogleService";
import { User } from "../types/user.types";
import jwt, { JwtPayload } from "jsonwebtoken";
import { envs } from "../config/envs";

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

  // Si no se ha alcanzado el límite de peticiones, continuar sin verificar el token
  if (!token) {
    return next(); // Permitir continuar si no es necesario el token
  }

  if (token) {
    try {
      // Verificación del token JWT generado por la aplicación
      const decodedJwt = jwt.verify(token, envs.JWT_SECRET as string);

      // Verificar que el token decodificado tiene la forma esperada de un usuario
      if (typeof decodedJwt === "object" && (decodedJwt as JwtPayload).email) {
        // Asumimos que 'email' es parte de la carga útil del JWT y que esto representa a un 'User'
        req.user = {
          email: (decodedJwt as JwtPayload).email,
          name: (decodedJwt as JwtPayload).name || "",
          picture: (decodedJwt as JwtPayload).picture || "",
        } as User;

        return next(); // Continuar con el siguiente middleware o controlador
      }
    } catch (jwtError) {
      console.error("Error during JWT verification:", jwtError);

      try {
        // Si la verificación JWT falla, intenta verificar como token de Google
        const user: User | null = await verifyGoogleToken(token);
        if (!user) {
          return res.status(401).json({ error: "Invalid or expired token" });
        }
        // Si el token de Google es válido, almacenar el usuario en la request
        req.user = user;
      } catch (googleError) {
        console.error("Error during Google token verification:", googleError);
        return res.status(401).json({ error: "Invalid or expired token" });
      }
    }
  } else {
    return res.status(401).json({ error: "Authorization token is required" });
  }

  next();
};
