import { desc } from "drizzle-orm";

import BrandCarousel from "@/components/common/brand-carousel";
import CategorySelector from "@/components/common/category-selector";
import { Header } from "@/components/common/header";
import HeroBanner from "@/components/common/hero-banner";
import ProductList from "@/components/common/product-list";
import PromoGrid from "@/components/common/promo-grid";
import { db } from "@/db";
import { productTable } from "@/db/schema";

const Home = async () => {
  const products = await db.query.productTable.findMany({
    with: { variants: true },
  });
  const newlyCreatedProducts = await db.query.productTable.findMany({
    orderBy: [desc(productTable.createdAt)],
    with: { variants: true },
  });
  const categories = await db.query.categoryTable.findMany({});

  return (
    <>
      <Header />

      <main className="mx-auto max-w-6xl space-y-8 px-0 pb-10 md:px-4">
        <HeroBanner />

        <BrandCarousel />

        <ProductList
          products={products}
          title="Mais vendidos"
          seeAllHref="/products?sort=best"
        />

        <section className="px-5">
          <CategorySelector categories={categories} />
        </section>

        <ProductList
          products={newlyCreatedProducts}
          title="Novos produtos"
          seeAllHref="/products?sort=new"
        />

        <PromoGrid />
      </main>
    </>
  );
};

export default Home;
