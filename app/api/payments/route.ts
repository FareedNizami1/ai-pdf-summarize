import { handleCheckoutSessionCompleted, handleSubscriptionDeleted } from "@/lib/payments";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const POST = async (req: NextResponse) => {
    const payload = await req.text();
    
    const sig = req.headers.get("stripe-signature");

    let event;

    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    try {
        event = stripe.webhooks.constructEvent(payload, sig!, endpointSecret);
        

        switch (event.type) {
            case 'checkout.session.completed':
                const sessionId = event.data.object.id;
                console.log('Payment was successful!');
                const session = await stripe.checkout.sessions.retrieve(sessionId, {
                    expand: ['line_items'],
                });

                await handleCheckoutSessionCompleted({ session, stripe });


                break;
            case 'customer.subscription.deleted':
                const subscription = event.data.object;
                const subscriptionId = event.data.object.id;
                console.log('Subscription was deleted!', subscription);
                
                await handleSubscriptionDeleted({ subscriptionId, stripe });
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

    } catch (err) {
        return NextResponse.json(
            { error: 'Failed to trigger webhook', err },
            { status: 400 }
        );
    }

    return NextResponse.json({
        status: 'success', 
        message: "Hello from Stripe API",
     });
}