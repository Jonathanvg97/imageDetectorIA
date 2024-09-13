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

// Llamar a la función para probar la conexión a la base de datos
checkDatabaseConnection()
  .then(() => {
    // Una vez que la conexión esté establecida, inicia el servidor
    const { PORT } = envs;

    server.use("/api", huggingFaceRoutes);
    server.use("/api", huggingTranslateRoutes);
    server.use("/api", dogDetectionRoutes);
    server.use("/api", userRoutes);
    server.use("/auth", authRoutes);

    server.get("/", (req, res) => {
      res.send("Hola desde el servidor");
    });

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1); // Salir del proceso si hay un error
  });
