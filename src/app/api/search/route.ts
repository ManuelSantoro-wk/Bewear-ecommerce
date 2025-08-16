import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { productTable } from "@/db/schema";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  // Compatível: lower(name) LIKE lower('%q%')
  const pattern = `%${q}%`;

  // Busca produtos cujo nome bate com o termo (limite 8)
  const rows = await db.query.productTable.findMany({
    where: sql`LOWER(${productTable.name}) LIKE LOWER(${pattern})`,
    with: {
      variants: {
        limit: 1,
        orderBy: (t, { asc }) => [asc(t.priceInCents)],
      },
    },
    limit: 8,
  });

  const data = rows.map((p) => ({
    id: p.id,
    name: p.name,
    imageUrl: p.variants?.[0]?.imageUrl ?? null,
  }));

  return NextResponse.json(data);
}
