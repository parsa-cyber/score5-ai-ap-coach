import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function parseStripeSignature(header: string) {
  return Object.fromEntries(header.split(",").map((part) => {
    const [key, value] = part.split("=");
    return [key, value];
  }));
}

async function hmacSHA256(secret: string, payload: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Array.from(new Uint8Array(signature)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

async function updateUserPlan(args: {
  userId: string;
  email?: string | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  plan: "free" | "pro";
  status: string;
  currentPeriodEnd?: string | null;
}) {
  const supabase = adminClient();
  if (!supabase) throw new Error("Missing Supabase admin config. Add SUPABASE_SERVICE_ROLE_KEY in Vercel.");

  await supabase.from("profiles").upsert({
    id: args.userId,
    email: args.email || null,
    plan: args.plan,
    subscription_status: args.status,
    stripe_customer_id: args.stripeCustomerId || null,
    stripe_subscription_id: args.stripeSubscriptionId || null,
    current_period_end: args.currentPeriodEnd || null,
  });

  await supabase.from("subscriptions").upsert({
    user_id: args.userId,
    stripe_customer_id: args.stripeCustomerId || null,
    stripe_subscription_id: args.stripeSubscriptionId || null,
    plan: args.plan,
    active: args.plan === "pro" && ["active", "trialing"].includes(args.status),
    status: args.status,
    current_period_end: args.currentPeriodEnd || null,
  }, { onConflict: "stripe_subscription_id" });
}

function periodEndFromUnix(value: unknown) {
  return typeof value === "number" ? new Date(value * 1000).toISOString() : null;
}

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ received: false, error: "STRIPE_WEBHOOK_SECRET is missing" }, { status: 400 });
  }

  const signatureHeader = req.headers.get("stripe-signature");
  const body = await req.text();

  if (!signatureHeader) {
    return NextResponse.json({ received: false, error: "Missing Stripe signature" }, { status: 400 });
  }

  const signature = parseStripeSignature(signatureHeader);
  const timestamp = signature.t;
  const expected = signature.v1;

  if (!timestamp || !expected) {
    return NextResponse.json({ received: false, error: "Invalid Stripe signature header" }, { status: 400 });
  }

  const computed = await hmacSHA256(webhookSecret, `${timestamp}.${body}`);
  if (computed !== expected) {
    return NextResponse.json({ received: false, error: "Webhook signature verification failed" }, { status: 400 });
  }

  const event = JSON.parse(body);
  const object = event.data?.object || {};

  try {
    if (event.type === "checkout.session.completed") {
      const userId = object.metadata?.user_id || object.client_reference_id;
      const plan = object.metadata?.plan === "cram" ? "free" : "pro";
      if (userId && plan === "pro") {
        await updateUserPlan({
          userId,
          email: object.customer_details?.email || object.customer_email || object.metadata?.email || null,
          stripeCustomerId: typeof object.customer === "string" ? object.customer : null,
          stripeSubscriptionId: typeof object.subscription === "string" ? object.subscription : null,
          plan: "pro",
          status: "active",
          currentPeriodEnd: null,
        });
      }
    }

    if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
      const userId = object.metadata?.user_id;
      if (userId) {
        const active = ["active", "trialing"].includes(object.status);
        await updateUserPlan({
          userId,
          email: object.metadata?.email || null,
          stripeCustomerId: typeof object.customer === "string" ? object.customer : null,
          stripeSubscriptionId: object.id,
          plan: active ? "pro" : "free",
          status: object.status || "incomplete",
          currentPeriodEnd: periodEndFromUnix(object.current_period_end),
        });
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const userId = object.metadata?.user_id;
      if (userId) {
        await updateUserPlan({
          userId,
          email: object.metadata?.email || null,
          stripeCustomerId: typeof object.customer === "string" ? object.customer : null,
          stripeSubscriptionId: object.id,
          plan: "free",
          status: object.status || "canceled",
          currentPeriodEnd: periodEndFromUnix(object.current_period_end),
        });
      }
    }
  } catch (error) {
    return NextResponse.json({ received: false, error: error instanceof Error ? error.message : "Webhook update failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true, type: event.type });
}
