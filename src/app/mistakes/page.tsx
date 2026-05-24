"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, NotebookTabs, RotateCcw } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Card, StatCard } from "@/components/Card";
import { getMistakeAttempts, getProfile, saveAttempts, getAttempts } from "@/lib/storage";
import { getCourseInfo } from "@/data/courses";
import type { Attempt } from "@/types";

export default function MistakesPage() {
  const [mistakes, setMistakes] = useState<Attempt[]>([]);
  const profile = getProfile();
  const courseInfo = getCourseInfo(profile.course);
  useEffect(() => setMistakes(getMistakeAttempts(profile.course)), [profile.course]);
  const byType = useMemo(() => mistakes.reduce<Record<string, number>>((acc, m) => ({ ...acc, [m.mistakeType]: (acc[m.mistakeType] || 0) + 1 }), {}), [mistakes]);

  function markMastered(questionId: string) {
    const all = getAttempts().map((a) => a.questionId === questionId ? { ...a, correct: true } : a);
    saveAttempts(all);
    setMistakes(getMistakeAttempts(profile.course));
  }

  return (
    <main>
      <Nav />
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-700">Mistake Notebook</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Turn wrong answers into recovery sets.</h1>
        <p className="mt-2 text-slate-600">Every missed question becomes a review card with the unit, mistake type, and next action.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <StatCard label="Open mistakes" value={mistakes.length} helper={courseInfo.shortName} />
          <StatCard label="Top mistake type" value={Object.entries(byType).sort((a,b)=>b[1]-a[1])[0]?.[0] || "None"} helper="pattern to fix" />
          <StatCard label="Recovery mode" value="Ready" helper="redo until mastered" />
        </div>
        <div className="mt-5 grid gap-4">
          {mistakes.length === 0 ? (
            <Card><NotebookTabs className="text-brand-600"/><h2 className="mt-3 text-2xl font-black">No missed questions yet</h2><p className="mt-2 text-slate-600">Do a practice set and your missed questions will appear here.</p><Link href="/practice" className="mt-4 inline-flex rounded-full bg-slate-950 px-5 py-3 font-black text-white">Start practice</Link></Card>
          ) : mistakes.map((m) => (
            <Card key={`${m.questionId}-${m.createdAt}`}>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-black text-brand-700">{m.unit} · {m.topic}</p>
                  <h2 className="mt-1 text-xl font-black">{m.mistakeType}</h2>
                  <p className="mt-2 text-sm text-slate-600">Wrong answer: <b>{m.selectedAnswer}</b>. Review this concept and redo a similar question.</p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/practice?mode=mistakes`} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 font-black"><RotateCcw size={16}/> Redo</Link>
                  <button onClick={() => markMastered(m.questionId)} className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-4 py-2 font-black text-white"><CheckCircle2 size={16}/> Mastered</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
