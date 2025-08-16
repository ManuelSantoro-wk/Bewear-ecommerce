export const formatCentsToEUR = (cents: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
};
