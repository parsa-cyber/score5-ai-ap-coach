"use client";

import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav";
import { Card, StatCard } from "@/components/Card";
import { ProgressBar } from "@/components/ProgressBar";
import { getAttempts, getProfile } from "@/lib/storage";
import { accuracy, estimatedScore, mistakeBreakdown, unitStats } from "@/lib/score";
import { getCourseInfo } from "@/data/courses";
import type { Attempt, LearnerProfile } from "@/types";

export default function ProgressPage() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  useEffect(() => {
    setAttempts(getAttempts());
    setProfile(getProfile());
  }, []);
  const course = profile?.course || "AP Physics 1: Algebra-Based";
  const courseInfo = getCourseInfo(course);
  const courseAttempts = attempts.filter((a) => !a.course || a.course === course);
  const stats = unitStats(courseAttempts, course);
  const mistakes = mistakeBreakdown(courseAttempts);
  const estimate = estimatedScore(courseAttempts);

  return (
    <main>
      <Nav />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-700">Progress</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Analytics for {courseInfo.shortName}</h1>
        <p className="mt-2 text-slate-600">Tracks accuracy, readiness, unit mastery, and mistake patterns for your selected AP class.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-4">
          <StatCard label="Overall accuracy" value={`${accuracy(courseAttempts)}%`} helper="Selected course" />
          <StatCard label="Readiness" value={`${estimate.readiness}%`} helper={estimate.label} />
          <StatCard label="Estimated score" value={estimate.score} helper="Practice-based" />
          <StatCard label="Attempts" value={courseAttempts.length} helper="Saved locally" />
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <Card>
            <h2 className="text-2xl font-black">Accuracy by unit/topic</h2>
            <div className="mt-6 grid gap-5">
              {stats.map((s) => <ProgressBar key={s.unit} value={s.accuracy} label={`${s.unit} · ${s.attempts} attempts`} />)}
            </div>
          </Card>
          <Card>
            <h2 className="text-2xl font-black">Mistake types</h2>
            {mistakes.length === 0 ? (
              <p className="mt-4 text-slate-600">No missed questions yet. Do a practice set to unlock mistake analytics.</p>
            ) : (
              <div className="mt-6 grid gap-5">
                {mistakes.map((m) => <ProgressBar key={m.type} value={m.percent} label={`${m.type} · ${m.count}`} />)}
              </div>
            )}
          </Card>
        </div>
      </section>
    </main>
  );
}
