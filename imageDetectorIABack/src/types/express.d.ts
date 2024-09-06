import { User } from "./user.types"; // Asegúrate de que la ruta sea correcta

declare global {
  namespace Express {
    interface Request {
      isConsumptionLimitReached?: boolean;
      user?: User; // Agrega el tipo de usuario al objeto Request
    }
  }
}
