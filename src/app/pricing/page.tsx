"use client";

import { useState } from "react";
import { Nav } from "@/components/Nav";
import { Card } from "@/components/Card";

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function checkout() {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setMessage(data.message || "Stripe is not configured yet.");
    } catch {
      setMessage("Stripe checkout failed. Check your environment variables.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <Nav />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-700">Pricing</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Freemium now, cram-pack upside later.</h1>
        <p className="mt-2 text-slate-600">Launch with a simple free plan and one Pro subscription.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <Card>
            <h2 className="text-2xl font-black">Free</h2>
            <p className="mt-2 text-4xl font-black">$0</p>
            <ul className="mt-5 space-y-3 text-slate-600">
              <li>Diagnostic quiz</li>
              <li>10 questions/day</li>
              <li>Basic explanations</li>
              <li>Basic progress</li>
            </ul>
          </Card>
          <Card className="border-brand-300 ring-4 ring-brand-50">
            <h2 className="text-2xl font-black">Pro</h2>
            <p className="mt-2 text-4xl font-black">$7.99<span className="text-base font-bold text-slate-500">/mo</span></p>
            <ul className="mt-5 space-y-3 text-slate-600">
              <li>Unlimited practice</li>
              <li>AI tutor explanations</li>
              <li>FRQ grading</li>
              <li>Full analytics</li>
              <li>Mistake review</li>
            </ul>
            <button onClick={checkout} className="mt-6 w-full rounded-full bg-slate-950 px-6 py-3 font-black text-white">{loading ? "Opening Stripe..." : "Start Pro"}</button>
            {message ? <p className="mt-3 text-sm text-slate-500">{message}</p> : null}
          </Card>
          <Card>
            <h2 className="text-2xl font-black">Cram Pack</h2>
            <p className="mt-2 text-4xl font-black">$14.99</p>
            <ul className="mt-5 space-y-3 text-slate-600">
              <li>7-day plan</li>
              <li>High-yield review</li>
              <li>Practice test</li>
              <li>5 FRQ grades</li>
            </ul>
          </Card>
        </div>
      </section>
    </main>
  );
}
