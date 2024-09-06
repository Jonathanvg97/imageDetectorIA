import { Request } from "express";

export const getClientIp = (req: Request): string | null => {
  const xForwardedFor = req.headers['x-forwarded-for'] as string;
  if (xForwardedFor) {
    // En x-forwarded-for puede haber múltiples IPs; tomamos la primera
    return xForwardedFor.split(',')[0].trim();
  }

  // Si no hay x-forwarded-for, usamos la IP del socket
  return req.socket.remoteAddress || null;
};
