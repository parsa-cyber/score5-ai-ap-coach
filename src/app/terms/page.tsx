import { Nav } from "@/components/Nav";
import { Card } from "@/components/Card";

export default function TermsPage() {
  return (
    <main>
      <Nav />
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-700">Legal</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Terms of Service</h1>
        <Card className="mt-8 space-y-4 text-slate-700">
          <p><b>Score5 is an independent study tool.</b> Score5 is not affiliated with, endorsed by, or sponsored by College Board.</p>
          <p>Score5 provides AP-style practice, AI explanations, estimated readiness scores, study plans, and feedback tools for academic preparation. These outputs are educational estimates and do not guarantee any AP score, grade, admission outcome, or exam result.</p>
          <p>Users are responsible for using Score5 honestly and following their school, teacher, and exam policies. Do not submit AI-generated or Score5-assisted content as your own where doing so is prohibited.</p>
          <p>Paid features are processed through Stripe. Access to Pro or Cram Pack features depends on successful payment, account status, and service availability.</p>
          <p>Score5 may update features, limits, pricing, and policies as the product improves. Continued use of the service means you accept the current terms.</p>
        </Card>
      </section>
    </main>
  );
}
