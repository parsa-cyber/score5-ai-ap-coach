import { NextResponse } from "next/server";

export async function POST() {
  const secret = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRO_PRICE_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (!secret || !priceId) {
    return NextResponse.json({ message: "Stripe is not configured yet. Add STRIPE_SECRET_KEY and STRIPE_PRO_PRICE_ID." }, { status: 200 });
  }

  const body = new URLSearchParams({
    mode: "subscription",
    "line_items[0][price]": priceId,
    "line_items[0][quantity]": "1",
    success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/pricing`,
    allow_promotion_codes: "true",
  });

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json({ message: data.error?.message || "Stripe checkout failed." }, { status: 400 });
  }

  return NextResponse.json({ url: data.url });
}
