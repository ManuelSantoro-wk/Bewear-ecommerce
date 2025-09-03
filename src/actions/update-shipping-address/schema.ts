// src/actions/update-shipping-address/schema.ts
import { cpf } from "cpf-cnpj-validator";
import { z } from "zod";

// helpers
const isValidPhone = (v: string) => /^\d{9}$/.test(v || "");
const isValidCodigoPostal = (v: string) => /^\d{4}-\d{3}$/.test(v || "");

export const updateShippingAddressSchema = z.object({
  id: z.string().min(1, "ID inválido"),
  email: z.string().email("E-mail inválido"),
  fullName: z.string().min(1, "Nome completo é obrigatório"),
  nif: z
    .string()
    .min(9, "NIF inválido")
    .max(9, "NIF deve ter exatamente 9 dígitos")
    .regex(/^\d{9}$/, "NIF deve conter apenas números"),
  phone: z.string().regex(/^\d{9}$/, "Telemóvel inválido (ex: 999999999)"),
  zipCode: z
    .string()
    .refine(
      (v) => isValidCodigoPostal(v),
      "Código Postal inválido (ex: 0000-000)",
    ),
  address: z.string().min(1, "Morada é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Localidade é obrigatória"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(1, "Distrito é obrigatório"),
});

export type UpdateShippingAddressSchema = z.infer<
  typeof updateShippingAddressSchema
>;
