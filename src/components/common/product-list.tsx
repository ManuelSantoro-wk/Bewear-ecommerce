"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

import ProductItem from "@/components/common/product-item";
import { productTable, productVariantTable } from "@/db/schema";

import { Button } from "../ui/button";

interface ProductListProps {
  title: string;
  products: (typeof productTable.$inferSelect & {
    variants: (typeof productVariantTable.$inferSelect)[];
  })[];
  seeAllHref?: string;
}

const ProductList = ({
  title,
  products,
  seeAllHref = "/products",
}: ProductListProps) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const scrollBy = (delta: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-5">
        <h3 className="font-semibold">{title}</h3>

        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="rounded-full px-3"
          >
            <Link href={seeAllHref}>Ver todos</Link>
          </Button>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => scrollBy(-320)}
              aria-label="Scroll para a esquerda"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => scrollBy(320)}
              aria-label="Scroll para a direita"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex w-full gap-4 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductList;
