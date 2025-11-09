import { z } from "zod";

const colheitaSchema = z.object({
  plantioId: z.string().min(1, "Selecione um plantio"),
  cultura: z
    .string()
    .min(2, "A cultura deve ter pelo menos 2 caracteres")
    .max(100, "A cultura é muito longa")
    .optional(),
  dataColheita: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Data de colheita inválida",
  }),
  quantidadeColhida: z
    .string()
    .transform((val) => parseFloat(val.replace(",", ".")))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Quantidade colhida deve ser um número válido",
    }),
  unidadeMedida: z
    .string()
    .refine((val) => ["kg", "maços", "unidades"].includes(val), {
      message: "Selecione uma unidade de medida válida",
    }),
  destinoColheita: z
    .string()
    .refine((val) => ["Consumo", "Doação", "Venda"].includes(val), {
      message: "Selecione um destino válido",
    }),
  observacoes: z.string().optional(),
});

export default colheitaSchema;
