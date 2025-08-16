// src/app/category/[slug]/page.tsx
import { notFound } from "next/navigation";

import { Header } from "@/components/common/header";
import ProductItem from "@/components/common/product-item";
import { db } from "@/db";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { slug } = await params;

  const category = await db.query.categoryTable.findFirst({
    where: (categoryTable, { eq }) => eq(categoryTable.slug, slug),
  });

  if (!category) return notFound();

  const products = await db.query.productTable.findMany({
    where: (productTable, { eq }) => eq(productTable.categoryId, category.id),
    with: { variants: true },
  });

  return (
    <>
      <Header />

      <main className="mx-auto max-w-6xl px-5 py-6 md:px-4">
        {/* Cabeçalho da categoria */}
        <div className="mb-4 flex flex-col gap-1 md:mb-6 md:flex-row md:items-end md:justify-between">
          <h2 className="text-xl font-semibold md:text-2xl">{category.name}</h2>
          <p className="text-sm text-slate-500">
            {products.length} {products.length === 1 ? "item" : "itens"}
          </p>
        </div>

        {/* Estado vazio */}
        {products.length === 0 ? (
          <div className="rounded-2xl border bg-white p-8 text-center text-slate-600">
            Não encontramos produtos nesta categoria.
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
    </>
  );
};

export default CategoryPage;
