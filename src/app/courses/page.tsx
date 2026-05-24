"use client";

import Link from "next/link";
import { BookOpen, CheckCircle2 } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Card } from "@/components/Card";
import { apCourses, courseCategories } from "@/data/courses";
import { getProfile, saveProfile } from "@/lib/storage";

export default function CoursesPage() {
  function selectCourse(course: string) {
    const profile = getProfile();
    saveProfile({ ...profile, course, hardestTopics: apCourses.find((c) => c.name === course)?.units.slice(0, 3) || [] });
  }

  return (
    <main>
      <Nav />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-700">Course library</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Every AP class in one coach</h1>
            <p className="mt-3 max-w-3xl text-slate-600">Score5 now supports all College Board AP subjects, including Arts, English, Social Sciences, STEM, World Languages, Capstone, and Career Kickstart courses.</p>
          </div>
          <Link href="/onboarding" className="rounded-full bg-slate-950 px-6 py-3 text-center font-black text-white hover:bg-brand-700">Set my course</Link>
        </div>

        <div className="mt-8 grid gap-6">
          {courseCategories.map((category) => {
            const courses = apCourses.filter((course) => course.category === category);
            return (
              <Card key={category}>
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-50 text-brand-700"><BookOpen size={18} /></span>
                  <div>
                    <h2 className="text-2xl font-black text-slate-950">{category}</h2>
                    <p className="text-sm text-slate-500">{courses.length} AP subject{courses.length === 1 ? "" : "s"}</p>
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {courses.map((course) => (
                    <div key={course.name} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-black text-slate-950">{course.name}</h3>
                        <CheckCircle2 className="shrink-0 text-brand-600" size={18} />
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">Units include {course.units.slice(0, 3).join(", ")}.</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {course.skills.slice(0, 2).map((skill) => <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{skill}</span>)}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Link onClick={() => selectCourse(course.name)} href="/practice" className="rounded-full bg-brand-600 px-4 py-2 text-sm font-bold text-white">Practice</Link>
                        <Link onClick={() => selectCourse(course.name)} href="/tutor" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700">Tutor</Link>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
}
