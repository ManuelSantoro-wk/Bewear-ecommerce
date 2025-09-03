"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { addProductToCart } from "@/actions/add-cart-product";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

/**
 * Buy Now:
 * - Se não autenticado: redireciona para /authentication
 * - Se autenticado: adiciona ao carrinho e segue para identificação (/cart/identification)
 */
interface BuyNowButtonProps {
  productVariantId: string;
  quantity: number;
}

const BuyNowButton = ({ productVariantId, quantity }: BuyNowButtonProps) => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["buyNow", productVariantId, quantity],
    mutationFn: () =>
      addProductToCart({
        productVariantId,
        quantity,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
      router.push("/cart/identification");
    },
    onError: () => {
      toast.error("Não foi possível continuar. Tente novamente.");
    },
  });

  const handleClick = () => {
    if (!session?.user?.id) {
      toast.info("Faça login para finalizar sua compra.");
      router.push("/authentication");
      return;
    }
    mutate();
  };

  return (
    <Button
      className="cursor-pointer rounded-full"
      size="lg"
      variant="default"
      disabled={isPending}
      onClick={handleClick}
    >
      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Comprar agora
    </Button>
  );
};

export default BuyNowButton;
