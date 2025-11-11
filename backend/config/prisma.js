import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  const prisma = new PrismaClient({
    log: ["error"],
  });

  // Listener para reconectar se a conexão cair
  prisma.$on("error", async (e) => {
    console.error("[PRISMA] Erro detectado:", e);

    if (
      e.code === "P1017" ||
      e.message?.includes("Connection reset") ||
      e.message?.includes("closed the connection")
    ) {
      console.warn("[PRISMA] Conexão perdida. Tentando reconectar...");
      try {
        await prisma.$disconnect();
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await prisma.$connect();
        console.log("[PRISMA] Reconectado com sucesso!");
      } catch (err) {
        console.error("[PRISMA] Falha ao reconectar:", err);
      }
    }
  });

  // Extensão que remove senhaHash de forma segura
  return prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ args, query }) {
          if (args?.showPassword === true) {
            const { showPassword, ...restArgs } = args;
            return await query(restArgs);
          }

          const result = await query(args);

          // Remove senhaHash recursivamente
          const clean = (data) => {
            if (!data) return data;
            if (Array.isArray(data)) return data.map(clean);
            if (typeof data === "object" && data !== null) {
              const { senhaHash, ...rest } = data;
              for (const key in rest) rest[key] = clean(rest[key]);
              return rest;
            }
            return data;
          };

          return clean(result);
        },
      },
    },
  });
};

// Evita múltiplas instâncias em hot reload
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
