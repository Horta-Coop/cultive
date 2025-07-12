import express from "express";
import helmet from "helmet";
import path from "path";
import cors from "cors";
import dotenv from "dotenv"

import authRoutes from "./routes/auth.route.js"

const server = express();
const PORT = process.env.PORT || 8080;
dotenv.config()

server.use(cors());
server.use(helmet());

server.use("/api/auth", authRoutes)

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
