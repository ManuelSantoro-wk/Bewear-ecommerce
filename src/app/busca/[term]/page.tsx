// src/app/busca/[term]/page.tsx
import { sql } from "drizzle-orm";
import { notFound } from "next/navigation";

import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import ProductItem from "@/components/common/product-item";
import { db } from "@/db";
import { productTable } from "@/db/schema";

export default async function SearchPage({
  params,
}: {
  params: Promise<{ term: string }>;
}) {
  const { term: raw } = await params;
  const term = decodeURIComponent(raw ?? "").trim();
  if (!term) notFound();

  const pattern = `%${term}%`;

  const products = await db.query.productTable.findMany({
    where: sql`LOWER(${productTable.name}) LIKE LOWER(${pattern})`,
    with: { variants: true },
  });

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-5 py-6 md:px-4">
        <div className="mb-4">
          <h1 className="text-lg font-semibold md:text-2xl">
            Resultados para “{term}”
          </h1>
          <p className="text-sm text-slate-500">
            {products.length} {products.length === 1 ? "item" : "itens"}{" "}
            encontrado{products.length === 1 ? "" : "s"}.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {products.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
