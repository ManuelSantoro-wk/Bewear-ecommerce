"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { addProductToCart } from "@/actions/add-cart-product";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

interface RepeatOrderButtonProps {
  items: {
    productVariantId: string;
    quantity: number;
  }[];
}

export default function RepeatOrderButton({ items }: RepeatOrderButtonProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["repeatOrder", ...items.map((i) => i.productVariantId)],
    mutationFn: async () => {
      for (const item of items) {
        await addProductToCart({
          productVariantId: item.productVariantId,
          quantity: item.quantity,
        });
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Itens do pedido adicionados ao carrinho!");
    },
    onError: () => {
      toast.error("Não foi possível repetir o pedido. Tente novamente.");
    },
  });

  const handleClick = () => {
    if (!session?.user?.id) {
      toast.info("Faça login para repetir o pedido.");
      router.push("/authentication");
      return;
    }
    mutate();
  };

  return (
    <Button
      className="w-full cursor-pointer"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Repetir pedido
    </Button>
  );
}
