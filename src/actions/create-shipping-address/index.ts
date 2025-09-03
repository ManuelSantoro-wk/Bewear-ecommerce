"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import {
  CreateShippingAddressSchema,
  createShippingAddressSchema,
} from "./schema";

// Helpers de normalização
const onlyDigits = (s: string) => s.replace(/\D/g, "");

const maskCodigoPostal = (digits: string) => {
  // espera "0000000" e devolve "0000-000"
  if (digits.length !== 7) return digits;
  return `${digits.slice(0, 4)}-${digits.slice(4)}`;
};

export const createShippingAddress = async (
  data: CreateShippingAddressSchema,
) => {
  // validações de formato/coerência (Zod + cpf-cnpj-validator)
  const parsed = createShippingAddressSchema.parse(data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Normalizações para persistência
  const zipDigits = onlyDigits(parsed.zipCode);
  const nifDigits = onlyDigits(parsed.nif);
  const phoneFormatted = parsed.phone; // já no formato 999999999
  const zipMasked = maskCodigoPostal(zipDigits); // persistimos "0000-000"

  const [shippingAddress] = await db
    .insert(shippingAddressTable)
    .values({
      userId: session.user.id,
      recipientName: parsed.fullName.trim(),
      street: parsed.address,
      number: parsed.number,
      complement: parsed.complement || null,
      city: parsed.city,
      state: parsed.state,
      neighborhood: parsed.neighborhood,
      zipCode: zipMasked, // salva com máscara
      country: "Portugal",
      phone: phoneFormatted, // mantém formatação amigável
      email: parsed.email,
      cpfOrCnpj: nifDigits, // salva NIF só com dígitos
    })
    .returning();

  revalidatePath("/cart/identification");

  return shippingAddress;
};
