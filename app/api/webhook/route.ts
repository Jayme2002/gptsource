import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "edge";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = req.headers.get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = await stripe.webhooks.constructEventAsync(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (error: any) {
        console.error("Error verifying webhook signature:", error.message);
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        if (!session?.metadata?.userId) {
            return new NextResponse("User id is required", { status: 400 });
        }

        await prisma.userSubscription.upsert({
            where: { userId: session.metadata.userId },
            update: {
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: subscription.customer as string,
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
            create: {
                userId: session.metadata.userId,
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: subscription.customer as string,
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
        });
    }

    if (event.type === "invoice.payment_succeeded") {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        await prisma.userSubscription.update({
            where: {
                stripeSubscriptionId: subscription.id,
            },
            data: {
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
        });
    }

    return new NextResponse(null, { status: 200 });
}
