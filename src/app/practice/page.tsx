"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Nav } from "@/components/Nav";
import { Card } from "@/components/Card";
import { QuestionCard } from "@/components/QuestionCard";
import { recommendedQuestions } from "@/lib/score";
import { getAttempts, getProfile, saveProfile } from "@/lib/storage";
import { apCourses, getCourseInfo, unitsForCourse } from "@/data/courses";
import type { Attempt, Course, Question } from "@/types";

type Mode = "quick" | "weakness" | "mistakes" | "unit";

function PracticeContent() {
  const params = useSearchParams();
  const initialMode = (params.get("mode") as Mode) || "quick";
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [mode, setMode] = useState<Mode>(initialMode);
  const [course, setCourse] = useState<Course>("AP Physics 1: Algebra-Based");
  const units = useMemo(() => unitsForCourse(course), [course]);
  const [unit, setUnit] = useState(
    unitsForCourse("AP Physics 1: Algebra-Based")[0],
  );
  const [queue, setQueue] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");

  useEffect(() => {
    const profile = getProfile();
    setAttempts(getAttempts());
    setCourse(profile.course);
    setUnit(unitsForCourse(profile.course)[0]);
  }, []);

  useEffect(() => {
    if (!units.includes(unit)) setUnit(units[0]);
  }, [units, unit]);

  const available = useMemo(
    () =>
      recommendedQuestions(
        attempts,
        mode === "unit" ? "quick" : mode,
        mode === "unit" ? unit : undefined,
        course,
      ),
    [attempts, mode, unit, course],
  );
  const courseInfo = getCourseInfo(course);

  function changeCourse(nextCourse: Course) {
    const profile = getProfile();
    saveProfile({
      ...profile,
      course: nextCourse,
      hardestTopics: unitsForCourse(nextCourse).slice(0, 3),
    });
    setCourse(nextCourse);
    setUnit(unitsForCourse(nextCourse)[0]);
    setQueue([]);
  }

  async function start() {
    setGenerating(true);
    setGenerationError("");
    try {
      const res = await fetch("/api/practice-set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course,
          mode,
          unit: mode === "unit" ? unit : undefined,
          count: 5,
          recentQuestionIds: attempts
            .filter((a) => a.course === course)
            .slice(-20)
            .map((a) => a.questionId),
        }),
      });
      const data = await res.json();
      const nextQuestions =
        Array.isArray(data.questions) && data.questions.length
          ? data.questions
          : available;
      const uniqueByPrompt = Array.from(
        new Map(nextQuestions.map((q: Question) => [q.prompt, q])).values(),
      ) as Question[];
      setQueue(uniqueByPrompt.length ? uniqueByPrompt : available);
      setCurrentIndex(0);
    } catch {
      setGenerationError(
        "AI question generation failed, so Score5 loaded the built-in practice set instead.",
      );
      setQueue(available);
      setCurrentIndex(0);
    } finally {
      setGenerating(false);
    }
  }

  function next() {
    setAttempts(getAttempts());
    setCurrentIndex((i) => i + 1);
  }

  const current = queue[currentIndex];

  return (
    <main>
      <Nav />
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-700">
            Practice
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
            AP-style practice engine
          </h1>
          <p className="mt-2 text-slate-600">
            Choose any AP class. Score5 now builds a fresh set of actual
            AP-style MCQs instead of repeating generic study-strategy prompts.
          </p>
        </div>

        {!current ? (
          <Card className="mt-8">
            <label className="mb-5 grid gap-2 font-bold">
              Course
              <select
                value={course}
                onChange={(e) => changeCourse(e.target.value)}
                className="rounded-2xl border border-slate-200 px-4 py-3"
              >
                {apCourses.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="mb-5 rounded-2xl bg-brand-50 p-4 text-sm text-brand-900">
              <span className="font-black">{courseInfo.shortName}</span> ·
              Practice focuses on {courseInfo.skills.slice(0, 3).join(", ")}.
            </div>

            <div className="grid gap-3 sm:grid-cols-4">
              {[
                ["quick", "Quick practice"],
                ["weakness", "Weakness mode"],
                ["unit", "Unit practice"],
                ["mistakes", "Mistake review"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setMode(value as Mode)}
                  className={`rounded-2xl border px-4 py-4 text-left font-black ${mode === value ? "border-brand-500 bg-brand-50 text-brand-800" : "border-slate-200 bg-white text-slate-800"}`}
                >
                  {label}
                </button>
              ))}
            </div>
            {mode === "unit" ? (
              <label className="mt-5 grid gap-2 font-bold">
                Choose unit/topic
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="rounded-2xl border border-slate-200 px-4 py-3"
                >
                  {units.map((u) => (
                    <option key={u}>{u}</option>
                  ))}
                </select>
              </label>
            ) : null}
            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <p className="font-bold">
                Set preview: 5 fresh question{available.length === 1 ? "" : "s"}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Mode:{" "}
                {mode === "mistakes" && available.length === 0
                  ? "No missed questions yet. Do quick practice first."
                  : mode}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Questions are generated/refreshed for the selected AP course and
                unit so the set does not repeat the same prompt.
              </p>
            </div>
            {generationError ? (
              <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-800">
                {generationError}
              </div>
            ) : null}
            <button
              onClick={start}
              disabled={generating || available.length === 0}
              className="mt-6 rounded-full bg-slate-950 px-6 py-3 font-black text-white disabled:opacity-40"
            >
              {generating ? "Building fresh MCQs..." : "Start set"}
            </button>
          </Card>
        ) : (
          <div className="mt-8">
            <div className="mb-4 flex justify-between text-sm font-bold text-slate-500">
              <span>
                Question {currentIndex + 1} of {queue.length}
              </span>
              <button onClick={() => setQueue([])} className="text-brand-700">
                Exit set
              </button>
            </div>
            <QuestionCard
              key={current.id}
              question={current}
              onAnswered={next}
            />
          </div>
        )}
      </section>
    </main>
  );
}

export default function PracticePage() {
  return (
    <Suspense
      fallback={
        <main>
          <Nav />
          <section className="mx-auto max-w-5xl px-4 py-10">
            Loading practice...
          </section>
        </main>
      }
    >
      <PracticeContent />
    </Suspense>
  );
}
