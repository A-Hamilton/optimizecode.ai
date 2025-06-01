const express = require("express");
const Stripe = require("stripe");
const { body, validationResult } = require("express-validator");
const { userService } = require("../config/firebase");
const { asyncHandler } = require("../middleware/errorHandler");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe Price IDs - Update these with your actual Stripe price IDs
const PRICE_IDS = {
  pro: {
    monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || "price_pro_monthly",
    yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID || "price_pro_yearly",
  },
  unleashed: {
    monthly:
      process.env.STRIPE_UNLEASHED_MONTHLY_PRICE_ID ||
      "price_unleashed_monthly",
    yearly:
      process.env.STRIPE_UNLEASHED_YEARLY_PRICE_ID || "price_unleashed_yearly",
  },
};

// Create Stripe Checkout Session
router.post(
  "/create-checkout-session",
  [
    body("priceId").notEmpty().withMessage("Price ID is required"),
    body("userId").notEmpty().withMessage("User ID is required"),
    body("userEmail").isEmail().withMessage("Valid email is required"),
    body("successUrl").isURL().withMessage("Valid success URL is required"),
    body("cancelUrl").isURL().withMessage("Valid cancel URL is required"),
    body("planName")
      .isIn(["pro", "unleashed"])
      .withMessage("Valid plan name is required"),
    body("billingCycle")
      .isIn(["monthly", "yearly"])
      .withMessage("Valid billing cycle is required"),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Invalid input data",
        details: errors.array(),
      });
    }

    const {
      priceId,
      userId,
      userEmail,
      successUrl,
      cancelUrl,
      planName,
      billingCycle,
    } = req.body;

    try {
      // Check if user exists in our system
      const userResult = await userService.getUserProfile(userId);
      if (!userResult.success) {
        return res.status(404).json({
          error: "User Not Found",
          message: "User profile not found",
        });
      }

      // Create Stripe checkout session
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
        client_reference_id: userId,
        metadata: {
          userId,
          planName,
          billingCycle,
          source: "optimizecode-ai",
        },
        subscription_data: {
          metadata: {
            userId,
            planName,
            billingCycle,
          },
        },
        allow_promotion_codes: true,
        billing_address_collection: "required",
        payment_method_configuration: undefined, // Use default
        invoice_creation: {
          enabled: true,
        },
      });

      res.json({
        sessionId: session.id,
        url: session.url,
        checkoutUrl: session.url,
      });
    } catch (error) {
      console.error("Stripe checkout session creation error:", error);
      res.status(500).json({
        error: "Checkout Failed",
        message: error.message || "Unable to create checkout session",
      });
    }
  }),
);

// Create Customer Portal Session
router.post(
  "/create-portal-session",
  authenticateToken,
  [body("returnUrl").isURL().withMessage("Valid return URL is required")],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Invalid input data",
        details: errors.array(),
      });
    }

    const { returnUrl } = req.body;
    const userId = req.user.uid;

    try {
      // Get user profile to find Stripe customer ID
      const userResult = await userService.getUserProfile(userId);
      if (!userResult.success) {
        return res.status(404).json({
          error: "User Not Found",
          message: "User profile not found",
        });
      }

      const stripeCustomerId = userResult.profile.stripeCustomerId;

      if (!stripeCustomerId) {
        return res.status(400).json({
          error: "No Subscription",
          message: "No active subscription found. Please subscribe first.",
        });
      }

      // Create portal session
      const session = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: returnUrl,
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error("Customer portal session creation error:", error);
      res.status(500).json({
        error: "Portal Access Failed",
        message: error.message || "Unable to access customer portal",
      });
    }
  }),
);

// Get subscription status
router.get(
  "/subscription-status/:userId",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const requestingUserId = req.user.uid;

    // Users can only check their own subscription status
    if (userId !== requestingUserId) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You can only access your own subscription information",
      });
    }

    try {
      const userResult = await userService.getUserProfile(userId);
      if (!userResult.success) {
        return res.status(404).json({
          error: "User Not Found",
          message: "User profile not found",
        });
      }

      const stripeCustomerId = userResult.profile.stripeCustomerId;

      if (!stripeCustomerId) {
        return res.json({
          subscription: null,
          status: "no_subscription",
        });
      }

      // Get active subscriptions for customer
      const subscriptions = await stripe.subscriptions.list({
        customer: stripeCustomerId,
        status: "all",
        limit: 10,
      });

      const activeSubscription = subscriptions.data.find((sub) =>
        ["active", "trialing", "past_due"].includes(sub.status),
      );

      res.json({
        subscription: activeSubscription,
        status: activeSubscription
          ? activeSubscription.status
          : "no_subscription",
        subscriptions: subscriptions.data,
      });
    } catch (error) {
      console.error("Subscription status check error:", error);
      res.status(500).json({
        error: "Status Check Failed",
        message: error.message || "Unable to check subscription status",
      });
    }
  }),
);

// Cancel subscription
router.post(
  "/cancel-subscription",
  authenticateToken,
  [
    body("subscriptionId")
      .notEmpty()
      .withMessage("Subscription ID is required"),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Invalid input data",
        details: errors.array(),
      });
    }

    const { subscriptionId } = req.body;
    const userId = req.user.uid;

    try {
      // Verify user owns this subscription
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      const userResult = await userService.getUserProfile(userId);
      if (
        !userResult.success ||
        userResult.profile.stripeCustomerId !== subscription.customer
      ) {
        return res.status(403).json({
          error: "Forbidden",
          message: "You can only cancel your own subscriptions",
        });
      }

      // Cancel at period end instead of immediately
      const updatedSubscription = await stripe.subscriptions.update(
        subscriptionId,
        {
          cancel_at_period_end: true,
        },
      );

      // Update user profile
      await userService.updateUserProfile(userId, {
        "subscription.cancelAtPeriodEnd": true,
        "subscription.canceledAt": new Date().toISOString(),
      });

      res.json({
        message:
          "Subscription will be canceled at the end of the current billing period",
        subscription: updatedSubscription,
        cancelAt: new Date(
          updatedSubscription.current_period_end * 1000,
        ).toISOString(),
      });
    } catch (error) {
      console.error("Subscription cancellation error:", error);
      res.status(500).json({
        error: "Cancellation Failed",
        message: error.message || "Unable to cancel subscription",
      });
    }
  }),
);

// Stripe Webhook Handler
router.post(
  "/webhook",
  asyncHandler(async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log("Received Stripe webhook:", event.type);

    // Handle the event
    try {
      switch (event.type) {
        case "checkout.session.completed":
          await handleCheckoutCompleted(event.data.object);
          break;

        case "customer.subscription.created":
          await handleSubscriptionCreated(event.data.object);
          break;

        case "customer.subscription.updated":
          await handleSubscriptionUpdated(event.data.object);
          break;

        case "customer.subscription.deleted":
          await handleSubscriptionDeleted(event.data.object);
          break;

        case "invoice.payment_succeeded":
          await handlePaymentSucceeded(event.data.object);
          break;

        case "invoice.payment_failed":
          await handlePaymentFailed(event.data.object);
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error(`Error handling webhook ${event.type}:`, error);
      return res.status(500).json({ error: "Webhook handling failed" });
    }

    res.json({ received: true });
  }),
);

// Webhook handler functions
async function handleCheckoutCompleted(session) {
  const userId = session.client_reference_id || session.metadata?.userId;
  const planName = session.metadata?.planName;

  console.log(`Checkout completed for user ${userId}, plan: ${planName}`);

  if (userId && planName) {
    // Update user subscription in database
    const planLimits = {
      pro: {
        optimizationsPerDay: 300,
        maxFileUploads: 50,
        maxPasteCharacters: 100000,
        maxFileSize: 10,
      },
      unleashed: {
        optimizationsPerDay: -1,
        maxFileUploads: -1,
        maxPasteCharacters: -1,
        maxFileSize: 100,
      },
    };

    await userService.updateUserProfile(userId, {
      "subscription.plan": planName,
      "subscription.status": "active",
      "subscription.startDate": new Date().toISOString(),
      "subscription.stripeSessionId": session.id,
      stripeCustomerId: session.customer,
      limits: planLimits[planName] || planLimits.pro,
    });
  }
}

async function handleSubscriptionCreated(subscription) {
  console.log("Subscription created:", subscription.id);
  // Additional logic for subscription creation
}

async function handleSubscriptionUpdated(subscription) {
  console.log("Subscription updated:", subscription.id);

  // Find user by customer ID
  const customerId = subscription.customer;
  // You'd need to implement a way to find user by Stripe customer ID
  // This could involve querying your database
}

async function handleSubscriptionDeleted(subscription) {
  console.log("Subscription deleted:", subscription.id);

  // Downgrade user to free plan
  const customerId = subscription.customer;
  // Find and update user to free plan
}

async function handlePaymentSucceeded(invoice) {
  console.log("Payment succeeded:", invoice.id);
  // Handle successful payment
}

async function handlePaymentFailed(invoice) {
  console.log("Payment failed:", invoice.id);
  // Handle failed payment - maybe send notification
}

module.exports = router;
