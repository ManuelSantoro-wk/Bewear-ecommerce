"use client";

import { XCircle } from "lucide-react";
import Link from "next/link";

import { Header } from "@/components/common/header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

const CheckoutCancelPage = () => {
  return (
    <>
      <Header />

      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="text-center sm:max-w-md">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-50">
            <XCircle className="h-12 w-12 text-red-600" aria-hidden="true" />
          </div>

          <DialogTitle className="mt-4 text-xl md:text-2xl">
            Pagamento cancelado
          </DialogTitle>
          <DialogDescription className="mx-auto mt-1 max-w-sm font-medium text-slate-600">
            O pagamento foi cancelado. Você pode revisar seus itens na sacola ou
            tentar pagar novamente.
          </DialogDescription>

          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button className="rounded-full" size="lg" asChild>
              <Link href="/">Tente novamente</Link>
            </Button>
            <Button
              className="rounded-full"
              variant="outline"
              size="lg"
              asChild
            >
              <Link href="/cart/identification">Voltar para a sacola</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CheckoutCancelPage;
