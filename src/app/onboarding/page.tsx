"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Nav } from "@/components/Nav";
import { Card } from "@/components/Card";
import { saveProfile, getProfile } from "@/lib/storage";
import { apCourses, topicOptionsForCourse } from "@/data/courses";
import type { Course } from "@/types";

export default function OnboardingPage() {
  const router = useRouter();
  const current = getProfile();
  const [name, setName] = useState(current.name);
  const [course, setCourse] = useState<Course>(current.course);
  const [targetScore, setTargetScore] = useState(current.targetScore);
  const [examDate, setExamDate] = useState(current.examDate);
  const [minutesPerDay, setMinutesPerDay] = useState(current.minutesPerDay);
  const [hardestTopics, setHardestTopics] = useState<string[]>(current.hardestTopics);
  const topicOptions = useMemo(() => topicOptionsForCourse(course), [course]);

  function handleCourseChange(nextCourse: Course) {
    setCourse(nextCourse);
    setHardestTopics(topicOptionsForCourse(nextCourse).slice(0, 3));
  }

  function toggleTopic(topic: string) {
    setHardestTopics((prev) => prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]);
  }

  function submit() {
    saveProfile({ name, course, targetScore, examDate, minutesPerDay, hardestTopics, onboarded: true });
    router.push("/diagnostic");
  }

  return (
    <main>
      <Nav />
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Card>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-700">Setup</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Build your AP study profile</h1>
          <p className="mt-3 text-slate-600">Pick any AP subject. Score5 will adapt the tutor, practice mode, FRQ grader, screenshot coach, and dashboard to that class.</p>

          <div className="mt-8 grid gap-5">
            <label className="grid gap-2 font-semibold">Name
              <input value={name} onChange={(e) => setName(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500" />
            </label>
            <label className="grid gap-2 font-semibold">AP course
              <select value={course} onChange={(e) => handleCourseChange(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500">
                {apCourses.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </label>
            <div className="grid gap-5 sm:grid-cols-3">
              <label className="grid gap-2 font-semibold">Target score
                <select value={targetScore} onChange={(e) => setTargetScore(Number(e.target.value))} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500">
                  {[3, 4, 5].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <label className="grid gap-2 font-semibold">Exam date
                <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500" />
              </label>
              <label className="grid gap-2 font-semibold">Minutes/day
                <input type="number" min={10} max={180} value={minutesPerDay} onChange={(e) => setMinutesPerDay(Number(e.target.value))} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500" />
              </label>
            </div>
            <div>
              <p className="font-semibold">Hardest topics for {course}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {topicOptions.map((topic) => (
                  <button key={topic} type="button" onClick={() => toggleTopic(topic)} className={`rounded-full border px-4 py-2 text-sm font-bold ${hardestTopics.includes(topic) ? "border-brand-500 bg-brand-600 text-white" : "border-slate-200 bg-white text-slate-700"}`}>
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button onClick={submit} className="mt-8 w-full rounded-full bg-slate-950 px-6 py-4 font-black text-white hover:bg-brand-700">Continue to diagnostic</button>
        </Card>
      </section>
    </main>
  );
}
