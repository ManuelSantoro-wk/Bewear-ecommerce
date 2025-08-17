import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/db";
import { orderTable } from "@/db/schema";

export const POST = async (request: Request) => {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.error();
  }
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.error();
  }
  const text = await request.text();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      text,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("❌ Erro ao construir evento do Stripe:", err);
    return NextResponse.error();
  }

  if (event.type === "checkout.session.completed") {
    console.log("Checkout session completed");
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (!orderId) {
      console.error("❌ orderId não encontrado na session.metadata");
      return NextResponse.error();
    }

    console.log("Conectando ao banco para atualizar pedido:", orderId);

    try {
      await db
        .update(orderTable)
        .set({ status: "paid" })
        .where(eq(orderTable.id, orderId));
      console.log("✅ Pedido atualizado:", orderId);
    } catch (err) {
      console.error("❌ Erro ao atualizar pedido no banco:", err);
    }
  }

  return NextResponse.json({ received: true });
};
