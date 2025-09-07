import Image from "next/image";
import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCentsToEUR } from "@/helpers/money";

interface CartSummaryProps {
  subtotalInCents: number;
  totalInCents: number;
  products: Array<{
    id: string;
    name: string;
    variantName: string;
    quantity: number;
    priceInCents: number;
    imageUrl: string;
  }>;
}

/** Sidebar responsiva do carrinho/checkout */
const CartSummary = ({
  subtotalInCents,
  totalInCents,
  products,
}: CartSummaryProps) => {
  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base md:text-lg">Resumo</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Totais */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm">Subtotal</p>
            <p className="text-sm font-medium text-slate-600">
              {formatCentsToEUR(subtotalInCents)}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm">Entrega</p>
            <p className="text-sm font-medium text-slate-600">GRÁTIS</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Total</p>
            <p className="text-base font-extrabold">
              {formatCentsToEUR(totalInCents)}
            </p>
          </div>
        </div>

        <div className="py-3">
          <Separator />
        </div>

        {/* Produtos (lista) */}
        <div className="space-y-3">
          {products.map((product) => (
            <div
              className="flex items-center justify-between gap-3"
              key={product.id}
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative h-14 w-14 overflow-hidden rounded-lg md:h-16 md:w-16">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {product.name}
                  </p>
                  <p className="truncate text-xs font-medium text-slate-500">
                    {product.variantName} • Qtd: {product.quantity}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-bold">
                  {formatCentsToEUR(product.priceInCents)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CartSummary;
