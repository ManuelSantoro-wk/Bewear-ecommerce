"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import AddToCartButton from "./add-to-cart-button";
import BuyNowButton from "./buy-now-button";

interface ProductActionsProps {
  productVariantId: string;
}

const ProductActions = ({ productVariantId }: ProductActionsProps) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 text-sm font-medium">Quantidade</h3>
        <div className="flex w-[120px] items-center justify-between rounded-xl border">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Diminuir"
          >
            <MinusIcon />
          </Button>
          <p className="w-8 text-center text-sm font-semibold">{quantity}</p>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="Aumentar"
          >
            <PlusIcon />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <AddToCartButton
          productVariantId={productVariantId}
          quantity={quantity}
        />
        <BuyNowButton productVariantId={productVariantId} quantity={quantity} />
      </div>
    </div>
  );
};

export default ProductActions;
