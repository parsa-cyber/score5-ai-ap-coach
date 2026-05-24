import { Nav } from "@/components/Nav";
import { Card } from "@/components/Card";

export default function PrivacyPage() {
  return (
    <main>
      <Nav />
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-700">Legal</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Privacy Policy</h1>
        <Card className="mt-8 space-y-4 text-slate-700">
          <p>Score5 may collect account information, selected AP courses, practice attempts, diagnostic results, usage counts, subscription status, and user-submitted academic content so the app can provide tutoring, progress tracking, and paid access.</p>
          <p>Authentication is handled through Supabase. Payments are handled through Stripe. AI-powered features may send user-submitted academic prompts, images, or responses to the configured AI provider for processing.</p>
          <p>Do not upload private personal documents, sensitive information, passwords, financial information, or content that does not belong to you. Screenshot analysis is intended for academic material only.</p>
          <p>Score5 uses reasonable third-party services to operate the app, but no online service can guarantee perfect availability or security.</p>
          <p>For account or data questions, use the contact page linked in the app.</p>
        </Card>
      </section>
    </main>
  );
}
