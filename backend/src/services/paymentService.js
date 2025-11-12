import Stripe from 'stripe';

let stripeClient;

const getStripe = () => {
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20'
    });
  }
  return stripeClient;
};

export const createPaymentIntent = async ({ amount, currency = 'cop', metadata }) => {
  const stripe = getStripe();
  const intent = await stripe.paymentIntents.create({
    amount,
    currency,
    metadata,
    automatic_payment_methods: { enabled: true }
  });
  return intent;
};

export const retrievePaymentIntent = async (paymentIntentId) => {
  const stripe = getStripe();
  return stripe.paymentIntents.retrieve(paymentIntentId);
};
