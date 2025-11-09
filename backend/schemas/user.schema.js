import z from "zod";

export const usuarioSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres").optional(),
  username: z
    .string()
    .min(3, "O nome de usuário deve ter pelo menos 3 caracteres")
    .optional(),
  email: z.string().email("E-mail inválido").optional(),
  telefone: z
    .string()
    .regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, "Telefone inválido")
    .optional()
    .nullable(),
  endereco: z
    .string()
    .min(5, "Endereço muito curto")
    .max(255, "Endereço muito longo")
    .optional()
    .nullable(),
  familiaId: z.string().uuid("ID de família inválido").optional().nullable(),
  pictureUrl: z.string().url("URL inválida").optional().nullable(),
  role: z.enum(["admin", "gestor", "cultivador", "voluntario"]).optional(),
  onBoarding: z.boolean().optional(),
});
