"use client";

import { useEffect, useMemo, useState } from "react";
import { Nav } from "@/components/Nav";
import { Card } from "@/components/Card";
import { frqPrompts } from "@/data/questions";
import { apCourses, buildCourseFRQPrompt, getCourseInfo, unitsForCourse } from "@/data/courses";
import { getProfile, saveProfile } from "@/lib/storage";
import type { Course } from "@/types";

export default function FRQPage() {
  const [course, setCourse] = useState<Course>("AP Physics 1: Algebra-Based");
  const units = useMemo(() => unitsForCourse(course), [course]);
  const [unit, setUnit] = useState(unitsForCourse("AP Physics 1: Algebra-Based")[0]);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const profile = getProfile();
    setCourse(profile.course);
    setUnit(unitsForCourse(profile.course)[0]);
  }, []);

  useEffect(() => {
    if (!units.includes(unit)) setUnit(units[0]);
  }, [units, unit]);

  const courseInfo = getCourseInfo(course);
  const physicsPrompts = frqPrompts.filter((p) => p.course === course);
  const prompt = physicsPrompts.find((p) => p.unit === unit) || (course === "AP Physics 1: Algebra-Based" ? physicsPrompts[0] : buildCourseFRQPrompt(course, unit));

  function changeCourse(nextCourse: Course) {
    const profile = getProfile();
    saveProfile({ ...profile, course: nextCourse });
    setCourse(nextCourse);
    setUnit(unitsForCourse(nextCourse)[0]);
    setFeedback("");
    setAnswer("");
  }

  async function grade() {
    setLoading(true);
    setFeedback("");
    try {
      const res = await fetch("/api/frq-grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, answer }),
      });
      const data = await res.json();
      setFeedback(data.feedback || "No feedback returned.");
    } catch {
      setFeedback("The FRQ endpoint failed. Check your API key or try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <Nav />
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-700">FRQ Grader</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Rubric-style grading for every AP class</h1>
        <p className="mt-2 text-slate-600">Paste a response and get estimated points, missing pieces, and a rewrite target. It adapts to {courseInfo.shortName}.</p>

        <div className="mt-8 grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
          <Card>
            <label className="grid gap-2 font-bold">Course
              <select value={course} onChange={(e) => changeCourse(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3">
                {apCourses.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </label>
            <label className="mt-5 grid gap-2 font-bold">Unit / skill
              <select value={unit} onChange={(e) => setUnit(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3">
                {units.map((u) => <option key={u}>{u}</option>)}
              </select>
            </label>
            <div className="mt-5 rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-bold text-brand-700">{prompt.points} points · {prompt.unit}</p>
              <h2 className="mt-2 text-xl font-black">{prompt.prompt}</h2>
            </div>
            <div className="mt-5">
              <h3 className="font-black">Rubric targets</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                {prompt.rubric.map((r) => <li key={r}>{r}</li>)}
              </ul>
            </div>
          </Card>

          <Card>
            <label className="grid gap-2 font-bold">Your response
              <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={10} placeholder="Type your AP response here..." className="rounded-2xl border border-slate-200 px-4 py-3 leading-7 outline-none focus:border-brand-500" />
            </label>
            <button onClick={grade} disabled={answer.trim().length < 20 || loading} className="mt-5 rounded-full bg-slate-950 px-6 py-3 font-black text-white disabled:opacity-40">
              {loading ? "Grading..." : "Grade my response"}
            </button>
            {feedback ? (
              <div className="mt-5 whitespace-pre-wrap rounded-2xl bg-brand-50 p-5 text-sm leading-7 text-slate-800">{feedback}</div>
            ) : null}
          </Card>
        </div>
      </section>
    </main>
  );
}
