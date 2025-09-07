"use client";

import { AlertCircle, ShoppingBasketIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { formatCentsToEUR } from "@/helpers/money";
import { useCart } from "@/hooks/queries/use-cart";

import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import CartItem from "./cart-item";

/** Skeleton para carregamento inicial */
function CartSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="h-16 w-16 animate-pulse rounded-xl bg-slate-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

export const Cart = () => {
  const { data: cart, isLoading } = useCart();
  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  const [open, setOpen] = useState(false);

  const totalCount = cart?.items?.reduce((acc, i) => acc + i.quantity, 0) ?? 0;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Abrir carrinho"
          className="relative cursor-pointer"
        >
          <ShoppingBasketIcon />
          {totalCount > 0 && (
            <span className="bg-primary absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-semibold text-white">
              {totalCount > 9 ? "9+" : totalCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Carrinho</SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex h-full flex-col px-5 pb-5">
          <div className="flex h-full max-h-[555px] flex-col overflow-hidden">
            <ScrollArea className="h-full">
              <div className="flex h-full flex-col gap-8">
                {isLoading ? (
                  <CartSkeleton />
                ) : isEmpty ? (
                  <div className="flex h-full flex-col items-center justify-center gap-4">
                    <Alert variant="destructive" className="w-full">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Carrinho vazio</AlertTitle>
                      <AlertDescription>
                        Ups! Ainda não adicionou produtos ao carrinho.
                      </AlertDescription>
                    </Alert>

                    <Button
                      asChild
                      className="rounded-full"
                      onClick={() => setOpen(false)}
                    >
                      <Link href="/">Continuar a comprar</Link>
                    </Button>
                  </div>
                ) : (
                  cart.items.map((item) => (
                    <CartItem
                      key={item.id}
                      id={item.id}
                      productVariantId={item.productVariant.id}
                      productName={item.productVariant.product.name}
                      productVariantName={item.productVariant.name}
                      productVariantImageUrl={item.productVariant.imageUrl}
                      productVariantPriceInCents={
                        item.productVariant.priceInCents
                      }
                      quantity={item.quantity}
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {!isLoading && !isEmpty && (
            <div className="mt-4 flex flex-col gap-4">
              <Separator />

              <div className="flex items-center justify-between text-xs font-medium">
                <p>Subtotal</p>
                <p>{formatCentsToEUR(cart?.totalPriceInCents ?? 0)}</p>
              </div>

              <Separator />

              <div className="flex items-center justify-between text-xs font-medium">
                <p>Entrega</p>
                <p>GRÁTIS</p>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Total</p>
                <p className="text-base font-extrabold">
                  {formatCentsToEUR(cart?.totalPriceInCents ?? 0)}
                </p>
              </div>

              <Button
                className="mt-2 rounded-full"
                asChild
                onClick={() => setOpen(false)}
              >
                <Link href="/cart/identification">Finalizar a compra</Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
