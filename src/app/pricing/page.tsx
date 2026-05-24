"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Lock, Zap } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Card } from "@/components/Card";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { FREE_LIMITS } from "@/lib/subscription";
import { useSubscription } from "@/hooks/useSubscription";

export default function PricingPage() {
  const [loading, setLoading] = useState<"pro" | "cram" | "">("");
  const [message, setMessage] = useState("");
  const billing = useSubscription();
  const supabase = getSupabaseBrowserClient();

  async function checkout(type: "pro" | "cram" = "pro") {
    setLoading(type);
    setMessage("");
    try {
      if (!supabase) {
        setMessage("Supabase is not configured. Add your Supabase env variables first.");
        return;
      }

      if (!billing.signedIn && !billing.loading) {
        window.location.href = "/auth?next=/pricing";
        return;
      }

      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Auth session timed out. Please sign in again.")), 8000),
      );
      const { data } = await Promise.race([sessionPromise, timeoutPromise]);
      const token = data.session?.access_token;
      if (!token) {
        setMessage("Create an account or sign in before upgrading.");
        window.location.href = "/auth?next=/pricing";
        return;
      }

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type }),
      });
      const response = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage(response.message || "Stripe checkout failed on the server.");
        return;
      }
      if (response.url) window.location.href = response.url;
      else setMessage(response.message || "Stripe checkout failed.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Stripe checkout failed. Check your environment variables and Stripe Price ID.");
    } finally {
      setLoading("");
    }
  }

  return (
    <main>
      <Nav />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-700">Pricing</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Upgrade for unlimited AP feedback.</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Less than one tutoring session. Score5 Pro unlocks unlimited AP practice, FRQ grading, screenshot solving, mistake review, and cram planning.
        </p>

        <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-slate-500">Current plan</p>
              <p className="text-2xl font-black text-slate-950">{billing.isPro ? "Score5 Pro" : "Free"}</p>
            </div>
            {billing.isPro ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-700">
                <CheckCircle2 size={17} /> Pro active
              </span>
            ) : (
              <Link href="/auth" className="inline-flex rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">
                Sign in before upgrading
              </Link>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <Card>
            <h2 className="text-2xl font-black">Free</h2>
            <p className="mt-2 text-4xl font-black">$0</p>
            <ul className="mt-5 space-y-3 text-slate-600">
              <li>{FREE_LIMITS.practice_answer} practice questions/day</li>
              <li>{FREE_LIMITS.ai_tutor} AI tutor messages/day</li>
              <li>{FREE_LIMITS.frq_grade} FRQ grade/day</li>
              <li>{FREE_LIMITS.screenshot_analyze} screenshot analyses/day</li>
              <li>Basic progress dashboard</li>
            </ul>
          </Card>
          <Card className="border-brand-300 ring-4 ring-brand-50">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-brand-800">
              <Zap size={14} /> Best value
            </div>
            <h2 className="text-2xl font-black">Pro</h2>
            <p className="mt-2 text-4xl font-black">$7.99<span className="text-base font-bold text-slate-500">/mo</span></p>
            <ul className="mt-5 space-y-3 text-slate-600">
              <li>Unlimited practice</li>
              <li>Unlimited AI tutor explanations</li>
              <li>Unlimited FRQ grading</li>
              <li>Unlimited screenshot/image coach</li>
              <li>Full analytics and mistake review</li>
              <li>Predicted score plan and AP cram mode</li>
            </ul>
            <button onClick={() => checkout("pro")} className="mt-6 w-full rounded-full bg-slate-950 px-6 py-3 font-black text-white disabled:opacity-50" disabled={loading !== "" || billing.isPro}>
              {billing.isPro ? "Already Pro" : loading === "pro" ? "Opening Stripe..." : !billing.signedIn && !billing.loading ? "Sign in to start Pro" : "Start Pro"}
            </button>
            {!billing.signedIn && !billing.loading ? <p className="mt-3 text-sm text-slate-500"><Lock className="mr-1 inline" size={14} /> You’ll be asked to sign in first.</p> : null}
            {message ? <p className="mt-3 rounded-2xl bg-amber-50 p-3 text-sm font-bold text-amber-800">{message}</p> : null}
          </Card>
          <Card>
            <h2 className="text-2xl font-black">Cram Pack</h2>
            <p className="mt-2 text-4xl font-black">$14.99</p>
            <ul className="mt-5 space-y-3 text-slate-600">
              <li>7-day emergency AP plan</li>
              <li>One-time purchase for AP exam season</li>
              <li>High-yield review sequence</li>
              <li>Practice-test workflow</li>
              <li>Final weakness report</li>
            </ul>
            <button onClick={() => checkout("cram")} className="mt-6 w-full rounded-full border border-slate-200 px-6 py-3 font-black text-slate-800 disabled:opacity-50" disabled={loading !== ""}>
              {loading === "cram" ? "Opening Stripe..." : !billing.signedIn && !billing.loading ? "Sign in to buy" : "Buy cram pack"}
            </button>
          </Card>
        </div>
      </section>
    </main>
  );
}
