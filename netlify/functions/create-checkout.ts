import type { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { errorResponse, jsonResponse, readJson } from './_http';
import { requireAuth } from './_auth0';

interface CheckoutRequest {
  serviceId: string;
  serviceName: string;
  totalAmount: number;
  selectedAddOns: { name: string; price: number }[];
  isSubscription?: boolean;
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return jsonResponse(200, {}, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, content-type',
      });
    }

    if (event.httpMethod !== 'POST') {
      return errorResponse(405, 'Method not allowed');
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return errorResponse(500, 'Stripe is not configured');
    }

    // Get authenticated user
    const claims = await requireAuth(event);
    const userEmail = claims.email as string | undefined;
    const userId = claims.sub;

    if (!userEmail) {
      return errorResponse(400, 'User email not found');
    }

    const body = await readJson<CheckoutRequest>(event);
    const { serviceId, serviceName, totalAmount, selectedAddOns, isSubscription } = body;

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    let customerId: string;

    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const newCustomer = await stripe.customers.create({
        email: userEmail,
        metadata: { auth0_user_id: userId },
      });
      customerId = newCustomer.id;
    }

    // Build line items description
    const addOnsDescription = selectedAddOns.length > 0 
      ? ` + ${selectedAddOns.map(a => a.name).join(', ')}`
      : '';

    const origin = event.headers?.['origin'] || event.headers?.['Origin'] || 'https://dobeu.net';

    if (isSubscription) {
      // Monthly retainer - create subscription
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: serviceName,
                description: `Monthly retainer service${addOnsDescription}`,
              },
              unit_amount: Math.round(totalAmount * 100),
              recurring: { interval: 'month' },
            },
            quantity: 1,
          },
        ],
        success_url: `${origin}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/shop?canceled=true`,
        metadata: {
          service_id: serviceId,
          user_id: userId,
          selected_add_ons: JSON.stringify(selectedAddOns),
        },
      });

      return jsonResponse(200, { url: session.url });
    } else {
      // One-time payment
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: serviceName,
                description: `Project-based service${addOnsDescription}`,
              },
              unit_amount: Math.round(totalAmount * 100),
            },
            quantity: 1,
          },
        ],
        success_url: `${origin}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/shop?canceled=true`,
        metadata: {
          service_id: serviceId,
          user_id: userId,
          selected_add_ons: JSON.stringify(selectedAddOns),
        },
      });

      return jsonResponse(200, { url: session.url });
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    return errorResponse(400, errorMessage);
  }
};

