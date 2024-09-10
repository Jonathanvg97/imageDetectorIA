import { server } from "./server";
import { envs } from "./config/envs";
import {
  authRoutes,
  dogDetectionRoutes,
  huggingFaceRoutes,
  huggingTranslateRoutes,
} from "./routes";
import { connectionToDB } from "./config/bd/bd";

// Llamar a la función para probar la conexión a la base de datos
connectionToDB()
  .then(() => {
    // Una vez que la conexión esté establecida, inicia el servidor
    const { PORT } = envs;

    server.use("/api", huggingFaceRoutes);
    server.use("/api", huggingTranslateRoutes);
    server.use("/api", dogDetectionRoutes);

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
