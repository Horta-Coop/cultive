import express from "express";
import helmet from "helmet";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import hortaRoutes from "./routes/horta.route.js";
import prisma from "./utils/prisma.js";

const server = express();
const PORT = process.env.PORT || 8080;
dotenv.config();

server.use(cors());
server.use(helmet());
server.use(express.json());
server.use(cookieParser());

server.use("/api/auth", authRoutes);
server.use("/api/horta", hortaRoutes)

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
