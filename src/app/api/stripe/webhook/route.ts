import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Stripe from "stripe";

import { db } from "@/db";
import { orderTable, shippingAddressTable } from "@/db/schema";

export const POST = async (request: Request) => {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("❌ Stripe keys não configuradas");
    return NextResponse.error();
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    console.error("❌ Stripe signature ausente");
    return NextResponse.error();
  }

  const rawBody = await request.text();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16" as Stripe.LatestApiVersion,
  });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("❌ Falha na verificação da assinatura:", err.message);
      return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }
    return new NextResponse("Webhook Error: Unknown error", { status: 400 });
  }

  console.log("💡 Webhook recebido:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Obter orderId do metadata
    const orderId = session.metadata?.orderId ?? "desconhecido";

    // Atualizar status do pedido
    if (orderId !== "desconhecido") {
      await db
        .update(orderTable)
        .set({ status: "paid" })
        .where(eq(orderTable.id, orderId));
      console.log(`✅ Order ${orderId} marcada como paga`);
    }

    // Buscar endereço completo da order
    let shippingAddressText = "Não informado";
    if (orderId !== "desconhecido") {
      const orderWithAddress = await db.query.orderTable.findFirst({
        where: eq(orderTable.id, orderId),
        with: { shippingAddress: true },
      });

      if (orderWithAddress?.shippingAddress) {
        const addr = orderWithAddress.shippingAddress;
        shippingAddressText = `
Nome: ${addr.recipientName}
Rua: ${addr.street}, Nº ${addr.number}${addr.complement ? `, ${addr.complement}` : ""}
Freguesia: ${addr.neighborhood}
Cidade/Distrito: ${addr.city} / ${addr.state}
Código Postal: ${addr.zipCode}
País: ${addr.country}
Telefone: ${addr.phone}
NIF: ${addr.cpfOrCnpj}
Email: ${addr.email}
        `.trim();
      }
    }

    // Listar itens do pedido
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    const itemsList = lineItems.data
      .map(
        (item) =>
          `- ${item.quantity}x ${item.description} (${(
            item.amount_total / 100
          ).toFixed(2)} ${item.currency.toUpperCase()})`,
      )
      .join("\n");

    // Obter e-mail do cliente
    let customerEmail = session.customer_details?.email;
    if (!customerEmail && session.customer) {
      const customer = await stripe.customers.retrieve(
        session.customer as string,
      );
      customerEmail = (customer as Stripe.Customer).email ?? "Não informado";
    }

    // Enviar e-mail para o vendedor
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: `"Minha Loja" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_SELLER,
          subject: "📦 Nova Encomenda Recebida",
          text: `Um pedido foi concluído! 

Cliente: ${customerEmail}
Valor total: ${((session.amount_total ?? 0) / 100).toFixed(2)} ${
            session.currency?.toUpperCase() ?? ""
          }
ID da encomenda: ${orderId}

Endereço de envio:
${shippingAddressText}

Itens:
${itemsList}
`,
        });

        console.log("📧 Email enviado com sucesso para o vendedor");
      } catch (mailErr) {
        console.error("❌ Erro ao enviar email:", mailErr);
        if (mailErr instanceof Error) console.error(mailErr.stack);
      }
    }
  }

  return NextResponse.json({ received: true });
};
