import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Header } from "@/components/common/header";
import { db } from "@/db";
import { orderTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import Orders from "./component/orders";

const MyOrdersPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    redirect("/login");
  }

  const orders = await db.query.orderTable.findMany({
    where: eq(orderTable.userId, session.user.id),
    with: {
      items: {
        with: {
          productVariant: { with: { product: true } },
        },
      },
    },
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  });

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />

      {/* Desktop container mais largo */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-4 md:px-5">
        <Orders
          orders={orders.map((order) => ({
            createdAt: order.createdAt,
            id: order.id,
            totalPriceInCents: order.totalPriceInCents,
            status: order.status,
            items: order.items.map((item) => ({
              id: item.id,
              productVariantId: item.productVariantId, // 🔥 agora incluímos o ID do variant
              imageUrl: item.productVariant.imageUrl,
              productName: item.productVariant.product.name,
              productVariantName: item.productVariant.name,
              quantity: item.quantity,
              priceInCents: item.productVariant.priceInCents,
              createdAt: item.createdAt,
            })),
          }))}
        />
      </main>
    </div>
  );
};

export default MyOrdersPage;
