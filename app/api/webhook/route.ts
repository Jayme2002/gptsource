import {prisma} from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (error: any) {
        console.error("Error verifying webhook signature:", error.message);
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    console.log("Received event type:", event.type);

    if (event.type === "checkout.session.completed") {
        console.log("Processing checkout.session.completed");
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        if (!session?.metadata?.userId) {
            console.error("User id is missing from session metadata");
            return new NextResponse("User id is required", { status: 400 });
        }

        try {
            const result = await prisma.userSubscription.upsert({
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
            console.log("UserSubscription upserted:", result);
        } catch (error) {
            console.error("Error upserting userSubscription:", error);
            return new NextResponse("Error updating user subscription", { status: 500 });
        }
    }

    if (event.type === "invoice.payment_succeeded") {
        console.log("Processing invoice.payment_succeeded");
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        try {
            const result = await prisma.userSubscription.update({
                where: {
                    stripeSubscriptionId: subscription.id,
                },
                data: {
                    stripePriceId: subscription.items.data[0].price.id,
                    stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
                },
            });
            console.log("UserSubscription updated:", result);
        } catch (error) {
            console.error("Error updating userSubscription:", error);
            return new NextResponse("Error updating user subscription", { status: 500 });
        }
    }

    console.log("Webhook processed successfully");
    return new NextResponse(null, { status: 200 });
}
