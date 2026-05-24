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
          <h1 className="mt-2 text-3xl font-black">Welcome to Score5 Pro.</h1>
          <p className="mt-3 text-slate-600">
            Stripe is confirming your subscription. If Pro does not show instantly, wait a few seconds and refresh your account page after the webhook runs.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/account" className="inline-flex rounded-full bg-slate-950 px-6 py-3 font-black text-white">Check account</Link>
            <Link href="/practice" className="inline-flex rounded-full border border-slate-200 px-6 py-3 font-black text-slate-800">Start practicing</Link>
          </div>
        </Card>
      </section>
    </main>
  );
}
