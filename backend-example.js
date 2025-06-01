// This is an EXAMPLE of what your backend needs to look like
// You can implement this with Express.js, Next.js API routes, or serverless functions

const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(
  cors({
    origin: ["http://localhost:5173", "https://your-domain.com"],
    credentials: true,
  }),
);
app.use(express.json());

// Create Checkout Session
app.post("/api/stripe/create-checkout-session", async (req, res) => {
  try {
    const { priceId, userId, userEmail, successUrl, cancelUrl, planName } =
      req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: userEmail,
      metadata: {
        userId,
        planName,
      },
      subscription_data: {
        metadata: {
          userId,
          planName,
        },
      },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: error.message });
  }
});

// Create Customer Portal Session
app.post("/api/stripe/create-portal-session", async (req, res) => {
  try {
    const { customerId, returnUrl } = req.body;

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating portal session:", error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook to handle subscription events
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      console.log(`Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        // Update user subscription in your database
        await handleSuccessfulPayment(session);
        break;

      case "customer.subscription.updated":
        const subscription = event.data.object;
        // Update subscription status in your database
        await handleSubscriptionUpdate(subscription);
        break;

      case "customer.subscription.deleted":
        const canceledSubscription = event.data.object;
        // Handle subscription cancellation
        await handleSubscriptionCancellation(canceledSubscription);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  },
);

// Helper functions (you'll need to implement these)
async function handleSuccessfulPayment(session) {
  const { userId, planName } = session.metadata;

  // Update user's subscription in your database
  // This connects to your user management system
  console.log(`User ${userId} subscribed to ${planName} plan`);

  // Example: Update user profile with new plan
  // await UserService.changePlan(userId, planName);
}

async function handleSubscriptionUpdate(subscription) {
  // Handle subscription changes (upgrades, downgrades, etc.)
  console.log("Subscription updated:", subscription.id);
}

async function handleSubscriptionCancellation(subscription) {
  // Handle subscription cancellation
  console.log("Subscription canceled:", subscription.id);
}

// Get subscription status
app.get("/api/stripe/subscription-status/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      limit: 1,
    });

    res.json(subscriptions.data[0] || null);
  } catch (error) {
    console.error("Error fetching subscription:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});

module.exports = app;
