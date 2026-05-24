import Link from "next/link";
import { ArrowRight, BarChart3, BrainCircuit, Camera, CheckCircle2, ClipboardCheck, Flame, GraduationCap, Star, Target, type LucideIcon } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Card } from "@/components/Card";

const features: Array<[LucideIcon, string, string]> = [
  [GraduationCap, "Every AP class", "Choose from 42 AP subjects and get course-specific practice, tutoring, FRQ feedback, and study plans."],
  [Target, "Diagnostic first", "Find weak units before wasting hours studying randomly."],
  [BrainCircuit, "AI tutor", "Get AP-level explanations that focus on exam reasoning, not generic homework help."],
  [Camera, "Gesture screenshots", "Use upload, screen capture, phone camera, or an open-palm countdown photo to analyze AP work."],
  [ClipboardCheck, "FRQ grader", "Paste your response and get a point-by-point rubric breakdown."],
  [BarChart3, "Progress analytics", "Track accuracy by unit, mistake type, readiness, and score range."],
];

export default function Home() {
  return (
    <main>
      <Nav />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-24">
        <div className="flex flex-col justify-center">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-brand-100 bg-white px-4 py-2 text-sm font-bold text-brand-700 shadow-sm">
            <Flame size={16} /> Now built for all AP classes
          </div>
          <h1 className="text-5xl font-black tracking-tight text-slate-950 sm:text-6xl">
            Get AP-ready with a personal AI study coach.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Score5 diagnoses weak topics, gives AP-style practice, explains mistakes simply, grades FRQs with rubric logic, analyzes screenshots, and builds a daily study plan aimed at a 5.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/diagnostic" className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-4 font-bold text-white transition hover:bg-brand-700">
              Start free diagnostic <ArrowRight size={18} />
            </Link>
            <Link href="/courses" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-4 font-bold text-slate-900 transition hover:border-brand-300 hover:bg-brand-50">
              View all AP courses
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
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-200">Today’s mission</p>
            <h2 className="mt-2 text-3xl font-black">Course-specific recovery set</h2>
            <p className="mt-2 text-slate-300">Pick AP Chem, APUSH, AP Lang, AP Calc, AP Physics, or any AP subject. Score5 adapts.</p>
          </div>
          <div className="space-y-4 p-6">
            {[
              ["8", "Weak-topic practice questions"],
              ["4", "Rubric-targeted review prompts"],
              ["1", "FRQ / essay rewrite"],
              ["3", "Mistakes to redo"]
            ].map(([num, label]) => (
              <div key={label} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-50 font-black text-brand-700">{num}</span>
                  <span className="font-semibold text-slate-700">{label}</span>
                </div>
                <CheckCircle2 className="text-slate-300" />
              </div>
            ))}
            <div className="rounded-2xl bg-brand-50 p-4">
              <p className="text-sm font-bold text-brand-900">Estimated score: 4</p>
              <p className="mt-1 text-sm text-brand-800">To reach a 5, fix your highest-priority weak units first.</p>
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
    </main>
  );
}
