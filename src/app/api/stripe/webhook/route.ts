import { NextResponse } from "next/server";

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
  // Production TODO: update Supabase subscriptions table here.
  return NextResponse.json({ received: true, type: event.type });
}
