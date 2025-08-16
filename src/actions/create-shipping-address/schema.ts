import { z } from "zod";

// Padrões PT
const PT_PHONE_RGX = /^\d{9}$/; // 999999999
const PT_ZIP_RGX = /^\d{4}-\d{3}$/; // 0000-000

export const createShippingAddressSchema = z.object({
  email: z.string().email("E-mail inválido"),
  fullName: z.string().trim().min(1, "Nome completo é obrigatório"),
  nif: z
    .string()
    .min(9, "NIF inválido")
    .max(9, "NIF deve ter exatamente 9 dígitos")
    .regex(/^\d{9}$/, "NIF deve conter apenas números"),
  phone: z.string().regex(PT_PHONE_RGX, "Telemóvel inválido (ex: 999999999)"),
  zipCode: z
    .string()
    .regex(PT_ZIP_RGX, "Código Postal inválido (ex: 0000-000)")
    .transform((v) => v.trim()),
  address: z.string().min(1, "Morada é obrigatória"),
  number: z
    .string()
    .min(1, "Número é obrigatório")
    .transform((v) => v.trim()),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Localidade é obrigatória"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(1, "Distrito é obrigatório"),
});

export type CreateShippingAddressSchema = z.infer<
  typeof createShippingAddressSchema
>;
