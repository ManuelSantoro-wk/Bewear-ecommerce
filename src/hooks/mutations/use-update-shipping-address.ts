"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateShippingAddress } from "@/actions/update-shipping-address";
import type { UpdateShippingAddressSchema } from "@/actions/update-shipping-address/schema";

export function useUpdateShippingAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["update-shipping-address"],
    mutationFn: (payload: UpdateShippingAddressSchema) =>
      updateShippingAddress(payload),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["user-addresses"] }),
        qc.invalidateQueries({ queryKey: ["cart"] }),
      ]);
    },
  });
}
