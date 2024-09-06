import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { getClientIp } from "../utils/clientIp";

const prisma = new PrismaClient();

export const consumptionLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Obtener la IP del cliente
    const clientIp = getClientIp(req);
    if (!clientIp) {
      return res.status(400).json({ error: "Unable to identify the client." });
    }

    // Convertir la IP de loopback a IPv4 si es necesario
    const normalizedIp = clientIp === "::1" ? "127.0.0.1" : clientIp;

    // Verificar si ya existe un registro de consumo para la IP
    const consumption = await prisma.consumption.findUnique({
      where: { clientIp: normalizedIp },
    });

    if (!consumption) {
      await prisma.consumption.create({
        data: { clientIp: normalizedIp, count: 1 },
      });
      return next(); // Continuar si es la primera petición
    }

    // Marcar en el request si el límite ha sido alcanzado
    req.isConsumptionLimitReached = consumption.count >= 4;

    // Actualizar el conteo de peticiones
    // Si el límite no ha sido alcanzado, actualizar el conteo de peticiones
    if (!req.isConsumptionLimitReached) {
      await prisma.consumption.update({
        where: { clientIp: normalizedIp },
        data: { count: consumption.count + 1 },
      });
    }

    next();
  } catch (error) {
    console.error("Error in consumptionLimiter middleware:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
