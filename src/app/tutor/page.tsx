"use client";

import { useEffect, useMemo, useState } from "react";
import { Nav } from "@/components/Nav";
import { Card } from "@/components/Card";
import { apCourses, getCourseInfo } from "@/data/courses";
import { getProfile, saveProfile, getRemainingDailyUsage, incrementDailyUsage } from "@/lib/storage";
import type { Course } from "@/types";
import { useSubscription } from "@/hooks/useSubscription";
import { FREE_LIMITS } from "@/lib/subscription";
import Link from "next/link";

type Message = { role: "user" | "assistant"; text: string };

export default function TutorPage() {
  const [course, setCourse] = useState<Course>("AP Physics 1: Algebra-Based");
  const courseInfo = useMemo(() => getCourseInfo(course), [course]);
  const starters = useMemo(() => [
    `Teach me ${courseInfo.units[0]} from scratch.`,
    `Give me a high-yield ${courseInfo.shortName} cram plan.`,
    `Quiz me on ${courseInfo.units[1] || courseInfo.units[0]}.`,
    `How do I write a stronger ${courseInfo.frqLabel}?`,
  ], [courseInfo]);

  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Ask me any AP course question. Pick a course first and I’ll answer like an exam-specific tutor, not a generic chatbot." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const billing = useSubscription();
  const remainingTutor = billing.isPro ? Infinity : getRemainingDailyUsage("ai_tutor", FREE_LIMITS.ai_tutor);

  useEffect(() => {
    const profile = getProfile();
    setCourse(profile.course);
  }, []);

  function changeCourse(nextCourse: Course) {
    const profile = getProfile();
    saveProfile({ ...profile, course: nextCourse });
    setCourse(nextCourse);
    const nextInfo = getCourseInfo(nextCourse);
    setMessages([{ role: "assistant", text: `Switched to ${nextInfo.name}. Ask me about ${nextInfo.units.slice(0, 3).join(", ")}, practice strategy, or FRQ/essay scoring.` }]);
  }

  async function send(text = input) {
    if (!text.trim()) return;
    if (!billing.isPro && remainingTutor <= 0) {
      setMessages((m) => [...m, { role: "assistant", text: "You hit the free AI Tutor limit for today. Upgrade to Pro for unlimited AP tutoring." }]);
      return;
    }
    const next = [...messages, { role: "user" as const, text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course, messages: next }),
      });
      const data = await res.json();
      incrementDailyUsage("ai_tutor");
      setMessages([...next, { role: "assistant", text: data.answer || "No answer returned." }]);
    } catch {
      setMessages([...next, { role: "assistant", text: "The tutor endpoint failed. Check your API key or try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <Nav />
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-700">AI Tutor</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Controlled AP tutor for every AP class</h1>
        <p className="mt-2 text-slate-600">Select a course and Score5 changes its examples, rubric language, question style, and study strategy.</p>
        <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">
          {billing.isPro ? "Pro active: unlimited tutor messages." : `Free plan: ${remainingTutor} AI tutor message${remainingTutor === 1 ? "" : "s"} left today.`} {!billing.isPro ? <Link href="/pricing" className="ml-2 text-brand-700 underline">Upgrade</Link> : null}
        </div>

        <Card className="mt-8">
          <label className="mb-5 grid gap-2 font-bold">Course
            <select value={course} onChange={(e) => changeCourse(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3">
              {apCourses.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          </label>
          <div className="mb-5 flex flex-wrap gap-2">
            {starters.map((s) => <button key={s} onClick={() => send(s)} className="rounded-full bg-brand-50 px-4 py-2 text-sm font-bold text-brand-800">{s}</button>)}
          </div>
          <div className="grid max-h-[480px] gap-4 overflow-auto rounded-2xl bg-slate-50 p-4">
            {messages.map((m, i) => (
              <div key={i} className={`max-w-[85%] rounded-2xl p-4 leading-7 ${m.role === "user" ? "ml-auto bg-brand-600 text-white" : "bg-white text-slate-800"}`}>{m.text}</div>
            ))}
            {loading ? <div className="w-fit rounded-2xl bg-white p-4 text-slate-600">Thinking...</div> : null}
          </div>
          <div className="mt-4 flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" ? send() : null} placeholder={`Ask about ${courseInfo.shortName}...`} className="min-w-0 flex-1 rounded-full border border-slate-200 px-5 py-3 outline-none focus:border-brand-500" />
            <button onClick={() => send()} className="rounded-full bg-slate-950 px-6 py-3 font-black text-white">Send</button>
          </div>
        </Card>
      </section>
    </main>
  );
}
