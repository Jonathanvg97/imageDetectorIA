import { Request, Response, NextFunction } from "express";
import pool from "../config/bd/bd";
import { getClientIp } from "../utils/clientIp";

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
    const result = await pool.query(
      "SELECT * FROM consumption WHERE clientIp = $1",
      [normalizedIp]
    );
    const consumption = result.rows[0];

    if (!consumption) {
      await pool.query(
        "INSERT INTO consumption (clientIp, count) VALUES ($1, $2)",
        [normalizedIp, 1]
      );
      return next(); // Continuar si es la primera petición
    }

    // Marcar en el request si el límite ha sido alcanzado
    req.isConsumptionLimitReached = consumption.count >= 4;

    // Actualizar el conteo de peticiones
    if (!req.isConsumptionLimitReached) {
      await pool.query(
        "UPDATE consumption SET count = count + 1 WHERE clientIp = $1",
        [normalizedIp]
      );
    }

    next();
  } catch (error) {
    console.error("Error in consumptionLimiter middleware:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
