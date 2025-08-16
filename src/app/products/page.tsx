// src/app/products/page.tsx
import { and, desc, eq, ne, sql } from "drizzle-orm";

import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import ProductItem from "@/components/common/product-item";
import { db } from "@/db";
import { productTable } from "@/db/schema";

type SearchParams = {
  q?: string;
  sort?: "best" | "new";
  category?: string; // categoryId para listar “iguais”
  excludeProductId?: string; // opcional: excluir um produto específico
};

interface ProductsPageProps {
  searchParams?: Promise<SearchParams>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const { q, sort, category, excludeProductId } = (await searchParams) ?? {};

  // Constrói condições tipadas
  const conditions: (ReturnType<typeof eq> | ReturnType<typeof ne>)[] = [];

  if (q && q.trim().length > 0) {
    const pattern = `%${q.trim()}%`;
    // Mantém compatível com múltiplos dialetos:
    conditions.push(sql`LOWER(${productTable.name}) LIKE LOWER(${pattern})`);
  }

  if (category) {
    conditions.push(eq(productTable.categoryId, category));
  }

  if (excludeProductId) {
    conditions.push(ne(productTable.id, excludeProductId));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  // Ordenação
  const orderBy =
    sort === "new"
      ? [desc(productTable.createdAt)]
      : // OBS: Quando tiver um campo de “mais vendidos”, troque aqui.
        undefined;

  const products = await db.query.productTable.findMany({
    where,
    with: { variants: true },
    orderBy,
  });

  const title =
    category && !q
      ? "Produtos relacionados"
      : q
        ? `Resultados para “${q.trim()}”`
        : "Todos os Produtos";

  return (
    <>
      <Header />

      <main className="mx-auto max-w-6xl px-5 py-6 md:px-4">
        <div className="mb-4 flex flex-col gap-1 md:mb-6 md:flex-row md:items-end md:justify-between">
          <h1 className="text-xl font-semibold md:text-2xl">{title}</h1>

          <p className="text-sm text-slate-500">
            {products.length} {products.length === 1 ? "item" : "itens"}
            {sort === "best" ? " • mais vendidos" : ""}
            {sort === "new" ? " • novos" : ""}
            {category ? " • relacionados" : ""}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl border bg-white p-8 text-center text-slate-600">
            {q
              ? "Nenhum produto encontrado para sua busca."
              : "Nenhum produto encontrado."}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6 xl:grid-cols-5">
            {products.map((product) => (
              <ProductItem
                key={product.id}
                product={product}
                textContainerClassName="max-w-full"
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
