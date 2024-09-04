import { server } from "./server";
import { envs } from "./config/envs";
import {
  dogDetectionRoutes,
  huggingFaceRoutes,
  huggingTranslateRoutes,
} from "./routes";

// // // Usar las rutas de Hugging Face
server.use("/api", huggingFaceRoutes);
server.use("/api", huggingTranslateRoutes);
server.use("/api", dogDetectionRoutes);

// // Ruta para la raíz del servidor
server.get("/", (req, res) => {
  res.send("Hola desde el servidor");
});

const { PORT } = envs;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
