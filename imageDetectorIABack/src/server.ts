import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { envs } from "./config/envs";

export const server = express();

server.use(express.json());
server.use(cookieParser());
server.use(cors({ origin: envs.FRONTEND_BASE_URL }));
server.use(express.urlencoded({ extended: true }));

