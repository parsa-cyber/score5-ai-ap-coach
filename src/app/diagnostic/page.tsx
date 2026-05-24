"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Lock, Share2 } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Card, StatCard } from "@/components/Card";
import { getDiagnosticQuestions } from "@/data/questions";
import { buildStarterQuestion, getCourseInfo, unitsForCourse } from "@/data/courses";
import { addAttempt, getProfile, saveDiagnosticResult } from "@/lib/storage";
import { estimatedScore, weakestUnits } from "@/lib/score";
import type { Attempt, Question } from "@/types";

function diagnosticForCourse(course: string): Question[] {
  const physicsDiagnostic = getDiagnosticQuestions();
  if (course === "AP Physics 1: Algebra-Based") return physicsDiagnostic;
  return unitsForCourse(course).slice(0, 6).map((unit) => buildStarterQuestion(course, unit));
}

export default function DiagnosticPage() {
  const profile = getProfile();
  const courseInfo = getCourseInfo(profile.course);
  const diagnosticQuestions = useMemo(() => diagnosticForCourse(profile.course), [profile.course]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [sessionAttempts, setSessionAttempts] = useState<Attempt[]>([]);
  const done = index >= diagnosticQuestions.length;
  const current = diagnosticQuestions[index];

  function submit() {
    if (!current || !selected) return;
    const attempt: Attempt = {
      questionId: current.id,
      selectedAnswer: selected,
      correct: selected === current.correctAnswer,
      unit: current.unit,
      topic: current.topic,
      mistakeType: current.mistakeType,
      createdAt: new Date().toISOString(),
      timeSpentSeconds: 55,
      course: current.course,
    };
    addAttempt(attempt);
    setSessionAttempts((prev) => [attempt, ...prev]);
    setSelected("");
    setIndex((i) => i + 1);
  }

  if (done) {
    const estimate = estimatedScore(sessionAttempts);
    const weak = weakestUnits(sessionAttempts, 3, profile.course);
    saveDiagnosticResult({ course: profile.course, score: estimate.score, readiness: estimate.readiness, weakUnits: weak, createdAt: new Date().toISOString() });
    return (
      <main>
        <Nav />
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-700">Diagnostic complete</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Your {courseInfo.shortName} predicted score range</h1>
            <p className="mt-2 text-slate-600">This is based on your Score5 diagnostic, not a guaranteed AP result.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <StatCard label="Estimated AP score" value={`${Math.max(1, estimate.score - 1)}–${estimate.score}`} helper="Current score range" />
            <StatCard label="Readiness" value={`${estimate.readiness}%`} helper={estimate.label} />
            <StatCard label="Target" value={profile.targetScore} helper={`${profile.minutesPerDay} min/day`} />
          </div>
          <Card className="mt-5">
            <h2 className="text-2xl font-black">To reach a 5, focus here first</h2>
            <div className="mt-4 grid gap-3">
              {weak.map((unit, i) => (
                <div key={unit} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                  <span className="font-bold">{i + 1}. {unit}</span>
                  <span className="text-sm font-bold text-brand-700">high ROI</span>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-black"><Lock className="mr-1 inline" size={15} /> Pro unlock: full 14-day plan</p>
              <p className="mt-1">Your free report shows the weak units. Score5 Pro unlocks the full daily schedule, unlimited FRQ grading, screenshot solver, and mistake recovery sets.</p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard" className="rounded-full bg-slate-950 px-5 py-3 text-center font-bold text-white">Go to dashboard</Link>
              <Link href="/practice?mode=weakness" className="rounded-full border border-slate-300 bg-white px-5 py-3 text-center font-bold text-slate-900">Practice weak topics</Link>
              <Link href="/share" className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-5 py-3 text-center font-bold text-brand-800"><Share2 size={16} /> Share result</Link>
            </div>
          </Card>
        </section>
      </main>
    );
  }

  return (
    <main>
      <Nav />
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between text-sm font-bold text-slate-500">
          <span>{courseInfo.shortName} diagnostic · Question {index + 1} of {diagnosticQuestions.length}</span>
          <span>{Math.round(((index) / diagnosticQuestions.length) * 100)}% done</span>
        </div>
        <Card>
          <p className="text-sm font-bold text-brand-700">{current.unit} · {current.topic}</p>
          <h1 className="mt-3 text-2xl font-black leading-snug text-slate-950">{current.prompt}</h1>
          <div className="mt-6 grid gap-3">
            {current.choices.map((choice) => (
              <button key={choice} onClick={() => setSelected(choice)} className={`rounded-2xl border px-4 py-3 text-left transition ${selected === choice ? "border-brand-500 bg-brand-50" : "border-slate-200 hover:border-brand-300"}`}>
                {choice}
              </button>
            ))}
          </div>
          <button onClick={submit} disabled={!selected} className="mt-6 rounded-full bg-slate-950 px-6 py-3 font-black text-white disabled:opacity-40">Submit</button>
        </Card>
      </section>
    </main>
  );
}
