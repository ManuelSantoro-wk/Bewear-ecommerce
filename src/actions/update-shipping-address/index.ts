"use server";

import { and, eq } from "drizzle-orm"; // <<-- IMPORTANTE
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import {
  UpdateShippingAddressSchema,
  updateShippingAddressSchema,
} from "./schema";

// utils
const onlyDigits = (s: string) => s.replace(/\D/g, "");
const maskCodigoPostal = (digits: string) =>
  digits.length === 7 ? `${digits.slice(0, 4)}-${digits.slice(4)}` : digits;

export const updateShippingAddress = async (
  data: UpdateShippingAddressSchema,
) => {
  const parsed = updateShippingAddressSchema.parse(data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");

  // Sanitização
  const zipDigits = onlyDigits(parsed.zipCode);
  const nifDigits = onlyDigits(parsed.nif);
  const zipMasked = maskCodigoPostal(zipDigits);

  // Atualiza garantindo propriedade do recurso na própria WHERE
  const result = await db
    .update(shippingAddressTable)
    .set({
      recipientName: parsed.fullName.trim(),
      street: parsed.address,
      number: parsed.number,
      complement: parsed.complement || null,
      city: parsed.city,
      state: parsed.state,
      neighborhood: parsed.neighborhood,
      zipCode: zipMasked,
      phone: parsed.phone,
      email: parsed.email,
      cpfOrCnpj: nifDigits,
      country: "Portugal",
    })
    .where(
      and(
        eq(shippingAddressTable.id, parsed.id),
        eq(shippingAddressTable.userId, session.user.id),
      ),
    )
    .returning({ id: shippingAddressTable.id });

  if (result.length === 0) {
    // nada atualizado => id não pertence ao usuário ou não existe
    throw new Error("Morada não encontrada");
  }

  revalidatePath("/cart/identification");
  return { ok: true };
};
