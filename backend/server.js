import express from "express";
import helmet from "helmet";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.config.js';

import authRoutes from "./routes/auth.route.js";
import hortaRoutes from "./routes/horta.route.js";
import userRoutes from "./routes/usuario.route.js";


const server = express();
const PORT = process.env.PORT || 8080;
dotenv.config();

server.use(cors());
server.use(helmet());
server.use(express.json());
server.use(cookieParser());

server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
server.use("/api/auth", authRoutes);
server.use("/api/horta", hortaRoutes)
server.use("/api/users", userRoutes)

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
