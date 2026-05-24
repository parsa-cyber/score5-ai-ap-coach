import Link from "next/link";
import { ArrowRight, BarChart3, BrainCircuit, Camera, CheckCircle2, ClipboardCheck, Flame, Gift, GraduationCap, Lock, Mail, NotebookTabs, Share2, Star, Target, Trophy, type LucideIcon } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Card } from "@/components/Card";

const features: Array<[LucideIcon, string, string]> = [
  [Target, "Predicted AP score", "Take a short diagnostic and get a score range, readiness percentage, weak units, and next steps."],
  [ClipboardCheck, "Rubric FRQ grading", "Paste an FRQ, SAQ, DBQ, LEQ, essay, or science response and get point-by-point feedback."],
  [NotebookTabs, "Mistake notebook", "Every missed question becomes a review card with the concept missed and a recovery action."],
  [Camera, "Screenshot coach", "Upload or capture AP problems, graphs, diagrams, or written work and get targeted help."],
  [Flame, "Cram mode", "Generate 1-day, 3-day, 7-day, 14-day, or 30-day exam plans based on target score and weak units."],
  [Gift, "Referral rewards", "Give students a reason to share Score5 with friends and unlock Pro reward days."],
];

const funnel = [
  "Take a 5-minute diagnostic",
  "Get your predicted AP score",
  "See weak units and mistake patterns",
  "Practice targeted AP-style questions",
  "Upgrade for unlimited FRQ grading, screenshots, and cram plans",
];

export default function Home() {
  return (
    <main>
      <Nav />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-24">
        <div className="flex flex-col justify-center">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-brand-100 bg-white px-4 py-2 text-sm font-bold text-brand-700 shadow-sm">
            <Flame size={16} /> Built for every AP class
          </div>
          <h1 className="text-5xl font-black tracking-tight text-slate-950 sm:text-6xl">
            Find your weak AP topics and turn them into a 5-ready plan.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Score5 is an AI AP study coach with predicted score ranges, AP-style practice, FRQ rubric feedback, screenshot help, cram plans, and mistake review built around how students actually prepare.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/diagnostic" className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-4 font-bold text-white transition hover:bg-brand-700">
              Take free score diagnostic <ArrowRight size={18} />
            </Link>
            <Link href="/frq" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-4 font-bold text-slate-900 transition hover:border-brand-300 hover:bg-brand-50">
              Try FRQ grader
            </Link>
            <Link href="/screenshots" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-4 font-bold text-slate-900 transition hover:border-brand-300 hover:bg-brand-50">
              <Camera size={18} /> Screenshot coach
            </Link>
          </div>
          <div className="mt-5 flex items-center gap-2 text-sm font-bold text-brand-700">
            {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={16} fill="currentColor" />)}
            <span>5-star early student reviews</span>
          </div>
          <p className="mt-3 text-sm text-slate-500">Not affiliated with or endorsed by College Board.</p>
        </div>

        <Card className="relative overflow-hidden p-0">
          <div className="border-b border-slate-100 bg-slate-950 p-6 text-white">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-200">Score5 conversion loop</p>
            <h2 className="mt-2 text-3xl font-black">Free diagnostic → Pro upgrade</h2>
            <p className="mt-2 text-slate-300">Designed around the study flow students actually need before AP exams.</p>
          </div>
          <div className="space-y-4 p-6">
            {funnel.map((label, i) => (
              <div key={label} className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-50 font-black text-brand-700">{i + 1}</span>
                <span className="font-semibold text-slate-700">{label}</span>
                {i < 3 ? <CheckCircle2 className="ml-auto text-slate-300" /> : <Lock className="ml-auto text-slate-300" />}
              </div>
            ))}
            <div className="rounded-2xl bg-brand-50 p-4">
              <p className="text-sm font-bold text-brand-900">Paid hook: “Would this FRQ get the point?”</p>
              <p className="mt-1 text-sm text-brand-800">Unlimited rubric feedback, screenshots, and cram plans are the clearest Pro value.</p>
            </div>
          </div>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {features.map(([Icon, title, copy]) => (
            <Card key={title} className="p-5">
              <Icon className="text-brand-600" />
              <h3 className="mt-4 text-lg font-black text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <Card className="grid gap-6 bg-slate-950 text-white md:grid-cols-[1fr_.9fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-200">Built to grow</p>
            <h2 className="mt-2 text-3xl font-black">Shareable diagnostics, referrals, and reminders keep students coming back.</h2>
            <p className="mt-3 text-slate-300">Score5 helps students stay consistent with shareable score cards, referral rewards, reminders, and classroom-ready study tools.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/share" className="rounded-2xl bg-white/10 p-4 font-black text-white hover:bg-white/15"><Share2 className="mb-2" /> Share result</Link>
            <Link href="/referrals" className="rounded-2xl bg-white/10 p-4 font-black text-white hover:bg-white/15"><Gift className="mb-2" /> Referrals</Link>
            <Link href="/reminders" className="rounded-2xl bg-white/10 p-4 font-black text-white hover:bg-white/15"><Mail className="mb-2" /> Reminders</Link>
            <Link href="/teacher" className="rounded-2xl bg-white/10 p-4 font-black text-white hover:bg-white/15"><Trophy className="mb-2" /> Teacher mode</Link>
          </div>
        </Card>
      </section>
    </main>
  );
}
