import { Nav } from "@/components/Nav";
import { Card } from "@/components/Card";

export default function RefundPage() {
  return (
    <main>
      <Nav />
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-700">Billing</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Refund Policy</h1>
        <Card className="mt-8 space-y-4 text-slate-700">
          <p>Monthly Pro subscriptions can be canceled through the billing portal when available. Cancellation prevents future renewals but does not automatically refund the current billing period.</p>
          <p>If you were charged by mistake, could not access paid features after payment, or experienced a major billing issue, contact support with your account email and payment date for review.</p>
          <p>Cram Pack purchases are one-time digital purchases. Refunds may be reviewed case-by-case when access fails or a duplicate purchase occurs.</p>
          <p>Stripe processes payments and may separately display payment status, receipts, and card-brand rules.</p>
        </Card>
      </section>
    </main>
  );
}
