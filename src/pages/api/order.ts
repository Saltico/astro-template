// src/pages/api/order.ts
// API endpoint for order submission (requires hybrid/SSR mode)
// In static mode, this endpoint won't work — use a third-party service instead

import type { APIRoute } from 'astro';

export const prerender = false; // Force SSR for this endpoint

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { cart, shipping, payment } = body;

    // Validate cart
    if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Cart is empty or invalid' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate shipping
    if (!shipping || !shipping.email || !shipping.address) {
      return new Response(
        JSON.stringify({ success: false, error: 'Shipping information is incomplete' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // TODO: Integrate with your payment provider (Stripe, PayPal, etc.)
    // TODO: Save order to database
    // TODO: Send confirmation email via SMTP (use nodemailer)

    // For demo, just return success
    const orderId = `ORD-${Date.now()}`;

    console.log('Order received:', {
      orderId,
      cart,
      shipping,
      payment: { last4: payment?.last4, name: payment?.name },
    });

    return new Response(
      JSON.stringify({
        success: true,
        orderId,
        message: 'Order placed successfully',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Order submission error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
