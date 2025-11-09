import { z } from "zod";

const plantioSchema = z.object({
  cultura: z
    .string()
    .min(4, "A cultura deve ter pelo menos 2 caracteres")
    .max(100, "A cultura é muito longa"),
  tipoPlantacao: z.string().min(1, "Selecione o tipo de plantio"),
  dataInicio: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Data de início inválida",
    }),
  previsaoColheita: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Data de previsão de colheita inválida",
    }),
  quantidadePlantada: z
    .number({ invalid_type_error: "Quantidade plantada deve ser um número" })
    .positive("A quantidade deve ser maior que zero"),
  unidadeMedida: z.enum(["kg", "unidades", "m²"]).optional(),
  hortaId: z.string().min(1, "Selecione uma horta"),
  observacoes: z.string().optional(),
});

export default plantioSchema;
