"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteShippingAddress } from "@/actions/delete-shipping-address";

export function useDeleteShippingAddress() {
  return useMutation({
    mutationFn: async (id: string) => {
      return await deleteShippingAddress({ id });
    },
    onSuccess: () => {
      toast.success("Morada eliminada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao eliminar morada.");
    },
  });
}
