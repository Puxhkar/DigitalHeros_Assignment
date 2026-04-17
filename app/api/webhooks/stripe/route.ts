import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-11-20.acacia' });
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Stripe webhook error:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = await createAdminClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan as 'monthly' | 'yearly';

      if (!userId) break;

      await supabase.from('profiles').update({
        subscription_status: 'active',
        subscription_plan: plan,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: session.subscription as string,
      }).eq('id', userId);

      // Record transaction
      await supabase.from('transactions').insert({
        user_id: userId,
        type: 'subscription',
        amount: (session.amount_total ?? 0) / 100,
        currency: session.currency ?? 'gbp',
        stripe_payment_intent_id: session.payment_intent as string,
        status: 'completed',
        metadata: { plan, session_id: session.id },
      });

      break;
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      const customer = sub.customer as string;

      await supabase.from('profiles').update({
        subscription_status: sub.status === 'active' ? 'active' : sub.status === 'trialing' ? 'trialing' : 'inactive',
        subscription_current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
      }).eq('stripe_customer_id', customer);

      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      const customer = sub.customer as string;

      await supabase.from('profiles').update({
        subscription_status: 'cancelled',
        stripe_subscription_id: null,
      }).eq('stripe_customer_id', customer);

      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const customer = invoice.customer as string;

      await supabase.from('profiles').update({
        subscription_status: 'inactive',
      }).eq('stripe_customer_id', customer);

      break;
    }

    default:
      console.log(`Unhandled event: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
