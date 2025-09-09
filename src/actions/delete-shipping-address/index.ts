"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";

export async function deleteShippingAddress({ id }: { id: string }) {
  await db.delete(shippingAddressTable).where(eq(shippingAddressTable.id, id));
  return { success: true };
}
