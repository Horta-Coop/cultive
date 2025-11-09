import { PrismaClient } from "@prisma/client";

const prismaBase = new PrismaClient();

const prisma = prismaBase.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        if (args?.showPassword === true) {
          const { showPassword, ...restArgs } = args;
          return await query(restArgs);
        }

        const result = await query(args);

        const removeSenha = (data) => {
          if (!data) return data;
          if (Array.isArray(data)) return data.map(removeSenha);
          if (typeof data === "object" && data !== null) {
            const { senhaHash, ...rest } = data;
            for (const key in rest) rest[key] = removeSenha(rest[key]);
            return rest;
          }
          return data;
        };

        return removeSenha(result);
      },
    },
  },
});

export default prisma;
