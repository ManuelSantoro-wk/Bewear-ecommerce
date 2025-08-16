"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { addProductToCart } from "@/actions/add-cart-product";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

interface AddToCartButtonProps {
  productVariantId: string;
  quantity: number;
  onSuccess?: () => void;
}

const AddToCartButton = ({
  productVariantId,
  quantity,
  onSuccess,
}: AddToCartButtonProps) => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["addProductToCart", productVariantId, quantity],
    mutationFn: () =>
      addProductToCart({
        productVariantId,
        quantity,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
      onSuccess?.();
      toast.success("Produto adicionado!");
    },
    onError: () => {
      toast.error("Não foi possível adicionar ao carrinho. Tente novamente.");
    },
  });

  const handleClick = () => {
    if (!session?.user?.id) {
      toast.info("Faça login para adicionar os itens .");
      router.push("/authentication");
      return;
    }
    mutate();
  };

  return (
    <Button
      className="cursor-pointer rounded-full"
      size="lg"
      variant="outline"
      disabled={isPending}
      onClick={handleClick}
    >
      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Adicionar
    </Button>
  );
};

export default AddToCartButton;
