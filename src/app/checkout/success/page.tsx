"use client";

import Image from "next/image";
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

const CheckoutSuccessPage = () => {
  return (
    <>
      <Header />

      {/* Mantemos o Dialog sempre aberto nesta página dedicada */}
      <Dialog open onOpenChange={() => {}}>
        <DialogContent className="rounded-2xl text-center sm:max-w-md md:max-w-lg">
          <Image
            src="/illustration.svg"
            alt="Success"
            width={300}
            height={300}
            sizes="(max-width: 640px) 240px, 300px"
            className="mx-auto h-auto w-[240px] sm:w-[300px]"
            priority
          />

          <DialogTitle className="mt-3 text-xl md:mt-4 md:text-2xl">
            Pedido efetuado!
          </DialogTitle>

          <DialogDescription className="mx-auto mt-1 max-w-sm text-sm font-medium text-slate-600 md:text-base">
            Seu pedido foi efetuado com sucesso. Você pode acompanhar o status
            na seção de “Meus Pedidos”.
          </DialogDescription>

          <DialogFooter className="mt-4 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:justify-center">
            <Button className="rounded-full" size="lg" asChild>
              <Link href="/my-orders">Ver meus pedidos</Link>
            </Button>

            <Button
              className="rounded-full"
              variant="outline"
              size="lg"
              asChild
            >
              <Link href="/">Voltar para a loja</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CheckoutSuccessPage;
