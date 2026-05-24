"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav";
import { Card, StatCard } from "@/components/Card";
import { ProgressBar } from "@/components/ProgressBar";
import { getAttempts, getProfile, getStreak } from "@/lib/storage";
import { accuracy, buildTodayMission, estimatedScore, strongestUnit, unitStats, weakestUnits } from "@/lib/score";
import { getCourseInfo } from "@/data/courses";
import type { Attempt, LearnerProfile } from "@/types";

export default function DashboardPage() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setAttempts(getAttempts());
    setProfile(getProfile());
    setStreak(getStreak());
  }, []);

  const course = profile?.course || "AP Physics 1: Algebra-Based";
  const courseInfo = getCourseInfo(course);
  const courseAttempts = attempts.filter((a) => !a.course || a.course === course);
  const estimate = estimatedScore(courseAttempts);
  const mission = buildTodayMission(courseAttempts, course);
  const weak = weakestUnits(courseAttempts, 3, course);
  const stats = unitStats(courseAttempts, course);

  return (
    <main>
      <Nav />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-700">Dashboard</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Welcome back{profile?.name ? `, ${profile.name}` : ""}</h1>
            <p className="mt-2 text-slate-600">Current course: <span className="font-bold text-slate-900">{courseInfo.name}</span>. Current estimate is based on practice data, not a guaranteed exam result.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/courses" className="rounded-full border border-slate-300 bg-white px-6 py-3 text-center font-black text-slate-900 hover:border-brand-300">Switch course</Link>
            <Link href="/practice" className="rounded-full bg-slate-950 px-6 py-3 text-center font-black text-white hover:bg-brand-700">Continue practice</Link>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          <StatCard label="Estimated AP Score" value={estimate.score} helper={estimate.label} />
          <StatCard label="Exam readiness" value={`${estimate.readiness}%`} helper="Updates after practice" />
          <StatCard label="Daily streak" value={streak} helper="days" />
          <StatCard label="Questions done" value={courseAttempts.length} helper={`${accuracy(courseAttempts)}% accuracy`} />
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[.95fr_1.05fr]">
          <Card>
            <h2 className="text-2xl font-black">Today’s mission</h2>
            <p className="mt-2 text-slate-600">Designed from your weakest {courseInfo.shortName} topics and recent mistakes.</p>
            <div className="mt-5 grid gap-3">
              {mission.map((item, i) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-600 font-black text-white">{i + 1}</span>
                  <span className="font-bold text-slate-800">{item}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-2xl font-black">Weakness snapshot</h2>
            <div className="mt-5 grid gap-3">
              {weak.map((unit, index) => (
                <div key={unit} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex justify-between font-bold"><span>{index + 1}. {unit}</span><span>Priority</span></div>
                  <p className="mt-2 text-sm text-slate-500">Recommended: start a weakness recovery set.</p>
                </div>
              ))}
            </div>
            <Link href="/practice?mode=weakness" className="mt-5 inline-flex rounded-full bg-brand-600 px-5 py-3 font-bold text-white">Practice weakest topics</Link>
          </Card>
        </div>

        <Card className="mt-5">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-black">Unit mastery</h2>
              <p className="mt-1 text-slate-600">Strongest topic: {strongestUnit(courseAttempts, course)}</p>
            </div>
            <Link href="/progress" className="font-bold text-brand-700">View full analytics →</Link>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {stats.map((s) => (
              <ProgressBar key={s.unit} value={s.accuracy} label={`${s.unit}${s.attempts === 0 ? " · no attempts yet" : ` · ${s.attempts} attempts`}`} />
            ))}
          </div>
        </Card>
      </section>
    </main>
  );
}
