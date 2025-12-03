import { z } from "zod";

export const EHortaEnum = z.enum([
  "escolar",
  "comunitaria",
  "institucional",
  "ong",
  "familiar",
]);

const hortaSchema = z.object({
  nome: z
    .string()
    .min(4, "O nome deve ter pelo menos 4 caracteres")
    .max(100, "O nome é muito longo"),

  endereco: z
    .string()
    .min(4, "O endereço deve ter pelo menos 4 caracteres")
    .max(200, "O endereço é muito longo"),

  tipoHorta: EHortaEnum,

  tipoSolo: z
    .string()
    .min(1, "Selecione o tipo de solo")
    .max(100, "Tipo de solo inválido"),

  areaCultivada: z
    .string()
    .transform((val) => parseFloat(val.replace(",", ".")))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "A área cultivada deve ser um número válido e maior que zero",
    }),

  coordenada: z.string().optional().or(z.literal("")),

  gestorId: z.string().uuid(1, "Selecione um gestor"),
  familiaId: z.string().uuid(1, "Selecione uma família"),

  descricao: z.string().optional(),
  observacoes: z.string().optional(),
});

export default hortaSchema;
