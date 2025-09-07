import { headers } from "next/headers";
import { redirect } from "next/navigation";

import CheckoutSteps from "@/components/common/checkout-steps";
import { Header } from "@/components/common/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { auth } from "@/lib/auth";

import CartSummary from "../components/cart-summary";
import { formatAddress } from "../helpers/address";
import FinishOrderButton from "./components/finish-order-button";

const ConfirmationPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user.id) redirect("/");

  const cart = await db.query.cartTable.findFirst({
    where: (c, { eq }) => eq(c.userId, session.user.id),
    with: {
      shippingAddress: true,
      items: {
        with: {
          productVariant: { with: { product: true } },
        },
      },
    },
  });

  if (!cart || cart?.items.length === 0) redirect("/");
  const cartTotalInCents = cart.items.reduce(
    (acc, item) => acc + item.productVariant.priceInCents * item.quantity,
    0,
  );
  if (!cart.shippingAddress) redirect("/cart/identification");

  return (
    <>
      <Header />

      {/* Stepper de checkout */}
      <CheckoutSteps current="payment" />

      <main className="mx-auto max-w-6xl px-5 py-6 md:px-4">
        <div className="grid gap-6 md:grid-cols-12">
          {/* Coluna principal */}
          <div className="md:col-span-8">
            <Card className="rounded-2xl border-slate-200">
              <CardHeader>
                <CardTitle>Identificação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Card>
                  <CardContent className="py-4">
                    <p className="text-sm whitespace-pre-line">
                      {formatAddress(cart.shippingAddress)}
                    </p>
                  </CardContent>
                </Card>
                <CardTitle>Metodo de Pagamento</CardTitle>

                <FinishOrderButton />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar resumo */}
          <div className="md:col-span-4">
            <CartSummary
              subtotalInCents={cartTotalInCents}
              totalInCents={cartTotalInCents}
              products={cart.items.map((item) => ({
                id: item.productVariant.id,
                name: item.productVariant.product.name,
                variantName: item.productVariant.name,
                quantity: item.quantity,
                priceInCents: item.productVariant.priceInCents,
                imageUrl: item.productVariant.imageUrl,
              }))}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default ConfirmationPage;
