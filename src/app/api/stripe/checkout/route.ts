import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const proPriceId = process.env.STRIPE_PRO_PRICE_ID;
  const cramPriceId = process.env.STRIPE_CRAM_PRICE_ID;
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!secret || !proPriceId) {
    return NextResponse.json(
      { message: "Stripe is not configured yet. Add STRIPE_SECRET_KEY and STRIPE_PRO_PRICE_ID in Vercel." },
      { status: 400 },
    );
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { message: "Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY." },
      { status: 400 },
    );
  }

  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) {
    return NextResponse.json({ message: "Sign in before upgrading to Pro." }, { status: 401 });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data, error } = await supabase.auth.getUser(token);
  const user = data.user;

  if (error || !user) {
    return NextResponse.json({ message: "Your login session expired. Sign in again before upgrading." }, { status: 401 });
  }

  let checkoutType: "pro" | "cram" = "pro";
  try {
    const parsed = await req.json();
    if (parsed?.type === "cram") checkoutType = "cram";
  } catch {
    checkoutType = "pro";
  }

  const mode = checkoutType === "pro" ? "subscription" : "payment";
  const priceId = checkoutType === "pro" ? proPriceId : cramPriceId || proPriceId;

  const body = new URLSearchParams({
    mode,
    "line_items[0][price]": priceId,
    "line_items[0][quantity]": "1",
    success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/pricing`,
    allow_promotion_codes: "true",
    client_reference_id: user.id,
    customer_email: user.email || "",
    "metadata[user_id]": user.id,
    "metadata[email]": user.email || "",
    "metadata[plan]": checkoutType,
  });

  if (mode === "subscription") {
    body.set("subscription_data[metadata][user_id]", user.id);
    body.set("subscription_data[metadata][email]", user.email || "");
    body.set("subscription_data[metadata][plan]", "pro");
  }

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const stripeData = await res.json();
  if (!res.ok) {
    return NextResponse.json({ message: stripeData.error?.message || "Stripe checkout failed." }, { status: 400 });
  }

  return NextResponse.json({ url: stripeData.url });
}
