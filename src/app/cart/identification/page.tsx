import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import CheckoutSteps from "@/components/common/checkout-steps";
import { Header } from "@/components/common/header";
import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import CartSummary from "../components/cart-summary";
import Addresses from "./components/addresses";

const IdentificationPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user.id) redirect("/");

  const cart = await db.query.cartTable.findFirst({
    where: (c, { eq }) => eq(c.userId, session.user.id),
    with: {
      shippingAddress: true,
      items: {
        with: { productVariant: { with: { product: true } } },
      },
    },
  });
  if (!cart || cart?.items.length === 0) redirect("/");

  const shippingAddresses = await db.query.shippingAddressTable.findMany({
    where: eq(shippingAddressTable.userId, session.user.id),
  });

  const cartTotalInCents = cart.items.reduce(
    (acc, item) => acc + item.productVariant.priceInCents * item.quantity,
    0,
  );

  return (
    <>
      <Header />

      {/* Stepper de checkout */}
      <CheckoutSteps current="identification" />

      <main className="mx-auto max-w-6xl px-5 py-6 md:px-4">
        <div className="grid gap-6 md:grid-cols-12">
          {/* Coluna principal */}
          <div className="md:col-span-8">
            <Addresses
              shippingAddresses={shippingAddresses}
              defaultShippingAddressId={cart.shippingAddress?.id || null}
            />
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

export default IdentificationPage;
