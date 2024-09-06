import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { getClientIp } from "../utils/clientIp"; // Utiliza una función para obtener la IP

const prisma = new PrismaClient();

export const consumptionLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Obtener la IP del cliente
  const clientIp = getClientIp(req);

  if (!clientIp) {
    return res.status(400).json({ error: "Unable to identify the client." });
  }

  // Convertir la IP de loopback a IPv4 si es necesario
  const normalizedIp = clientIp === "::1" ? "127.0.0.1" : clientIp;

  try {
    // Verificar si ya existe un registro de consumo para la IP
    const consumption = await prisma.consumption.findUnique({
      where: { clientIp: normalizedIp },
    });

    // Si el cliente ha alcanzado el límite, denegar el acceso
    if (consumption && consumption.count >= 4) {
      return res.status(403).json({
        error:
          "You have exceeded the allowed number of requests. Please log in.",
      });
    }

    // Crear o actualizar el registro de consumo
    if (!consumption) {
      await prisma.consumption.create({
        data: { clientIp: normalizedIp, count: 1 },
      });
    } else {
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
