"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, CheckCircle2, Flame, Lock } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Card } from "@/components/Card";
import { apCourses, getCourseInfo, unitsForCourse } from "@/data/courses";
import { getProfile, saveProfile } from "@/lib/storage";
import { useSubscription } from "@/hooks/useSubscription";
import type { Course } from "@/types";

const durations = ["1-day", "3-day", "7-day", "14-day", "30-day"];

function buildPlan(course: Course, duration: string, minutes: number, target: number, weakUnits: string[]) {
  const units = weakUnits.length ? weakUnits : unitsForCourse(course).slice(0, 3);
  const days = Number(duration.split("-")[0]) || 7;
  return Array.from({ length: Math.min(days, 14) }, (_, i) => ({
    day: i + 1,
    title: i === 0 ? "Diagnostic cleanup" : i === days - 1 ? "Final mixed review" : `${units[i % units.length]} recovery`,
    tasks: [
      `${Math.max(8, Math.round(minutes * 0.35))} min high-yield review`,
      `${Math.max(5, Math.round(minutes * 0.25))} AP-style MCQs`,
      i % 2 === 0 ? "1 rubric-style FRQ/SAQ/essay response" : "Redo 3 mistake notebook cards",
      target === 5 ? "Write one score-earning explanation sentence" : "Review one common mistake pattern",
    ],
  }));
}

export default function CramPage() {
  const profile = getProfile();
  const [course, setCourse] = useState<Course>(profile.course);
  const [duration, setDuration] = useState("7-day");
  const [minutes, setMinutes] = useState(profile.minutesPerDay);
  const [target, setTarget] = useState(profile.targetScore);
  const [weakText, setWeakText] = useState(profile.hardestTopics.join(", "));
  const billing = useSubscription();
  const courseInfo = getCourseInfo(course);
  const weakUnits = useMemo(() => weakText.split(",").map((x) => x.trim()).filter(Boolean), [weakText]);
  const plan = useMemo(() => buildPlan(course, duration, minutes, target, weakUnits), [course, duration, minutes, target, weakUnits]);

  function save() {
    saveProfile({ ...profile, course, minutesPerDay: minutes, targetScore: target, hardestTopics: weakUnits });
  }

  return (
    <main>
      <Nav />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-700">AP Exam Cram Mode</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Build a panic-proof AP cram plan.</h1>
        <p className="mt-2 max-w-3xl text-slate-600">Students can generate 1-day, 3-day, 7-day, 14-day, or 30-day plans. This is the one-time Cram Pack value prop.</p>
        <div className="mt-8 grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
          <Card>
            <label className="grid gap-2 font-bold">Course
              <select value={course} onChange={(e) => setCourse(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3">
                {apCourses.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </label>
            <label className="mt-4 grid gap-2 font-bold">Plan length
              <select value={duration} onChange={(e) => setDuration(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3">
                {durations.map((d) => <option key={d}>{d}</option>)}
              </select>
            </label>
            <label className="mt-4 grid gap-2 font-bold">Minutes per day
              <input type="number" value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} className="rounded-2xl border border-slate-200 px-4 py-3" />
            </label>
            <label className="mt-4 grid gap-2 font-bold">Target score
              <select value={target} onChange={(e) => setTarget(Number(e.target.value))} className="rounded-2xl border border-slate-200 px-4 py-3">
                {[3,4,5].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <label className="mt-4 grid gap-2 font-bold">Weak units/topics
              <textarea value={weakText} onChange={(e) => setWeakText(e.target.value)} rows={4} className="rounded-2xl border border-slate-200 px-4 py-3" />
            </label>
            <button onClick={save} className="mt-5 w-full rounded-full bg-slate-950 px-5 py-3 font-black text-white">Save plan inputs</button>
            {!billing.isPro ? <Link href="/pricing" className="mt-3 flex items-center justify-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-5 py-3 font-black text-brand-800"><Lock size={16}/> Unlock full Cram Pack</Link> : null}
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-100 text-orange-700"><Flame /></span>
              <div>
                <h2 className="text-2xl font-black">{duration} {courseInfo.shortName} plan</h2>
                <p className="text-sm text-slate-500">Generated from target score {target}, {minutes} min/day, and weak topics.</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4">
              {plan.map((day) => (
                <div key={day.day} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 font-black"><CalendarDays size={17}/> Day {day.day}: {day.title}</div>
                  <ul className="mt-3 grid gap-2 text-sm text-slate-600">
                    {day.tasks.map((task) => <li key={task} className="flex gap-2"><CheckCircle2 className="mt-0.5 text-brand-600" size={16}/>{task}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
