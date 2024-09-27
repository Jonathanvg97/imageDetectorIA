import * as dotenv from "dotenv";

// Carga el archivo .env correcto dependiendo del entorno
const envFile =
  process.env.NODE_ENV === "development"
    ? ".env.development"
    : process.env.NODE_ENV === "test"
    ? ".env.test"
    : ".env";
dotenv.config({ path: envFile });

export const envs = {
  TOKEN_HUGGING_FACE: process.env.TOKEN_HUGGING_FACE,
  TOKEN_HUGGING_FACE_DETECTOR: process.env.TOKEN_HUGGING_FACE_DETECTOR,
  MODEL_HUGGING_FACE: process.env.MODEL_HUGGING_FACE,
  MODEL_HUGGING_TRANSLATE: process.env.MODEL_HUGGING_TRANSLATE,
  MODEL_HUGGING_TRANSLATE_EN: process.env.MODEL_HUGGING_TRANSLATE_EN,
  MODEL_IMAGE_CLASSIFICATION: process.env.MODEL_IMAGE_CLASSIFICATION,
  FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL,
  PORT: process.env.PORT,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || "1h",
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
};
