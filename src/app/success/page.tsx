import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Card } from "@/components/Card";

export default function SuccessPage() {
  return (
    <main>
      <Nav />
      <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <Card>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-green-700">Payment success</p>
          <h1 className="mt-2 text-3xl font-black">You are on Score5 Pro.</h1>
          <p className="mt-3 text-slate-600">In production, this page should read subscription status from Supabase after Stripe webhook confirmation.</p>
          <Link href="/dashboard" className="mt-6 inline-flex rounded-full bg-slate-950 px-6 py-3 font-black text-white">Go to dashboard</Link>
        </Card>
      </section>
    </main>
  );
}
