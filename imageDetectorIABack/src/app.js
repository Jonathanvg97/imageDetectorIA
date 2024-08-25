import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import huggingFaceRoutes from "./routes/huggingFaceRoutes.js";
import huggingTranslateRoutes from "./routes/huggingTranslateRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Configurar CORS para permitir solicitudes de dominios específicos
const corsOptions = {
    origin: '*', // Permite todas las solicitudes de cualquier origen
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization"
};

app.use(cors(corsOptions));
app.use(bodyParser.json()); // Middleware para parsear JSON

// Usar las rutas de Hugging Face
app.use('/api', huggingFaceRoutes);
app.use('/api', huggingTranslateRoutes);

// Ruta para la raíz del servidor
app.get('/', (req, res) => {
    res.send('Hola desde el servidor');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
