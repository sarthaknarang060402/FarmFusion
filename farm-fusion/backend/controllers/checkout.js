import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create a stripe checkout session
const createCheckoutSession = async (req, res) => {
    try {
        const { cart } = req.body;

        // console.log(cart)
        // Create checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                ...(cart.map((item) => {
                    return {
                        price_data: {
                            currency: "inr",
                            product_data: {
                                name: item.itemId.name,
                            },
                            unit_amount: item.itemId.price * 100,
                        },
                        quantity: item.quantity,
                    }
                }))
            ],
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/checkout?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/checkout/cancel`,
        });

        res.json({ success: true, url: session.url });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Internal server error" });
    }

};

export {
    createCheckoutSession,
}