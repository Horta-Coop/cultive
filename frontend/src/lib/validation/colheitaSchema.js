import { z } from "zod";

export const EUnidadeMedida = z.enum(["kg", "maços", "unidades, m²"]);
export const EDestinoColheita = z.enum(["consumo", "doação", "venda"]);

const colheitaSchema = z.object({
  plantioId: z.string().nonempty("Selecione um plantio"),
  
  cultura: z
    .string()
    .min(2, "A cultura deve ter pelo menos 2 caracteres")
    .max(100, "A cultura é muito longa")
    .optional()
    .or(z.literal("")),

  dataColheita: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Data de colheita inválida",
  }),

  quantidadeColhida: z
    .string()
    .transform((val) => parseFloat(val.replace(",", ".")))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Quantidade colhida deve ser um número válido",
    }),

  unidadeMedida: EUnidadeMedida.refine((val) => !!val, {
    message: "Selecione a unidade de medida",
  }),

  destinoColheita: EDestinoColheita.refine((val) => !!val, {
    message: "Selecione o destino da colheita",
  }),

  observacoes: z.string().optional(),
});

export default colheitaSchema;
