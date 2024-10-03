// app.ts
import { server } from "./server";
import { envs } from "./config/envs";
import morgan from "morgan";
import {
  authRoutes,
  dogDetectionRoutes,
  huggingFaceRoutes,
  huggingTranslateRoutes,
  userRoutes,
} from "./routes";
import { checkDatabaseConnection } from "./config/bd/bd";

// Configura Morgan para registrar todas las solicitudes en la consola
server.use(morgan("combined")); // Usa el formato 'combined' para un registro detallado

const startServer = async () => {
  try {
    await checkDatabaseConnection();
    const { PORT } = envs;

    server.use("/api", huggingFaceRoutes);
    server.use("/api", huggingTranslateRoutes);
    server.use("/api", dogDetectionRoutes);
    server.use("/api", userRoutes);
    server.use("/auth", authRoutes);

    server.get("/", (req, res) => {
      res.send("Hola desde el servidor");
    });

    return server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

// Exporta el servidor para las pruebas sin iniciarlo
export { server, startServer };

// iniciar el servidor directamente cuando se ejecute el archivo:
if (require.main === module) {
  startServer();
}
