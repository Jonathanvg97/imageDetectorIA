import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { envs } from "./config/envs";

export const server = express();

server.use(express.json());
server.use(cookieParser());
server.use(cors({ origin: "*" }));

server.use((req, res, next) => {
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});
// server.use(cors({ origin: envs.FRONTEND_BASE_URL }));
server.use(express.urlencoded({ extended: true }));
