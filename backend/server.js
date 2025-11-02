import express from "express";
import helmet from "helmet";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.config.js";

import authRoutes from "./routes/auth.route.js";
import hortaRoutes from "./routes/horta.route.js";
import userRoutes from "./routes/usuario.route.js";
import plantioRoute from "./routes/plantio.route.js";
import familiaRoutes from "./routes/familia.route.js";
import colheitaRoutes from "./routes/colheita.route.js";

const server = express();
const PORT = process.env.PORT || 5000;
dotenv.config();

server.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://10.10.10.42:5173", // IP da sua máquina na rede
    ],
    credentials: true,
  })
);

server.use(helmet());

server.use(express.json({ limit: "10mb" }));
server.use(cookieParser());

server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
server.use("/api/auth", authRoutes);
server.use("/api/horta", hortaRoutes);
server.use("/api/users", userRoutes);
server.use("/api/plantio", plantioRoute);
server.use("/api/familias", familiaRoutes);
server.use("/api/colheitas", colheitaRoutes);

server.listen(PORT,"0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
