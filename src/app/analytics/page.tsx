import { BarChart3, MousePointerClick, TrendingUp, Users } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Card } from "@/components/Card";

export default function AnalyticsPage() {
  const metrics = ["Visitors", "Signups", "Diagnostic starts", "Diagnostic completions", "Pro clicks", "Stripe checkout sessions", "Paid conversions", "AI cost per user"];
  return (
    <main><Nav/><section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-700">Growth analytics</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Stop guessing. Track the funnel.</h1>
      <p className="mt-2 text-slate-600">Use this page as your analytics checklist. Vercel Analytics, Google Analytics, PostHog, or Plausible can be connected later.</p>
      <div className="mt-8 grid gap-5 md:grid-cols-3"><Card><Users className="text-brand-600"/><h2 className="mt-3 text-xl font-black">Acquisition</h2><p className="text-slate-600">Where users come from.</p></Card><Card><MousePointerClick className="text-brand-600"/><h2 className="mt-3 text-xl font-black">Activation</h2><p className="text-slate-600">Who finishes diagnostics.</p></Card><Card><TrendingUp className="text-brand-600"/><h2 className="mt-3 text-xl font-black">Revenue</h2><p className="text-slate-600">Who clicks Pro and pays.</p></Card></div>
      <Card className="mt-5"><BarChart3 className="text-brand-600"/><h2 className="mt-3 text-2xl font-black">Events to track</h2><div className="mt-4 grid gap-3 md:grid-cols-2">{metrics.map((m)=><div key={m} className="rounded-2xl bg-slate-50 p-4 font-bold">{m}</div>)}</div></Card>
    </section></main>
  );
}
