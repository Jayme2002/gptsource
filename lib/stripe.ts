import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
    apiVersion: "2024-06-20",
    httpClient: Stripe.createFetchHttpClient(), // Use fetch-based HTTP client
    typescript: true,
});
