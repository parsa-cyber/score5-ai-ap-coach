"use client";

import { useEffect, useState } from "react";
import { Mail, Save } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Card } from "@/components/Card";
import { apCourses } from "@/data/courses";
import { getProfile, getReminderSettings, saveReminderSettings } from "@/lib/storage";

export default function RemindersPage() {
  const profile = getProfile();
  const [settings, setSettings] = useState({ enabled: false, email: "", course: profile.course, examDate: profile.examDate, frequency: "weekly" as "daily" | "weekly" | "off" });
  const [saved, setSaved] = useState(false);
  useEffect(() => setSettings(getReminderSettings()), []);
  function save() {
    saveReminderSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }
  return (
    <main>
      <Nav />
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-700">Email reminders</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Bring users back before their AP exam.</h1>
        <p className="mt-2 text-slate-600">This MVP stores reminder preferences. To send real emails, connect this later to Resend, Supabase Edge Functions, or a scheduled backend job.</p>
        <Card className="mt-8">
          <div className="flex items-center gap-3"><Mail className="text-brand-600"/><h2 className="text-2xl font-black">Reminder settings</h2></div>
          <label className="mt-5 flex items-center gap-3 font-bold"><input type="checkbox" checked={settings.enabled} onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}/> Enable reminders</label>
          <label className="mt-4 grid gap-2 font-bold">Email
            <input value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} placeholder="student@example.com" className="rounded-2xl border border-slate-200 px-4 py-3" />
          </label>
          <label className="mt-4 grid gap-2 font-bold">Course
            <select value={settings.course} onChange={(e) => setSettings({ ...settings, course: e.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3">
              {apCourses.map((c) => <option key={c.name}>{c.name}</option>)}
            </select>
          </label>
          <label className="mt-4 grid gap-2 font-bold">Exam date
            <input type="date" value={settings.examDate} onChange={(e) => setSettings({ ...settings, examDate: e.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3" />
          </label>
          <label className="mt-4 grid gap-2 font-bold">Frequency
            <select value={settings.frequency} onChange={(e) => setSettings({ ...settings, frequency: e.target.value as "daily" | "weekly" | "off" })} className="rounded-2xl border border-slate-200 px-4 py-3">
              <option value="weekly">Weekly</option><option value="daily">Daily near exam</option><option value="off">Off</option>
            </select>
          </label>
          <button onClick={save} className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 font-black text-white"><Save size={16}/>{saved ? "Saved" : "Save reminders"}</button>
          <div className="mt-5 rounded-2xl bg-brand-50 p-4 text-sm text-brand-900"><b>Example email:</b> Your AP exam is coming up. Today’s plan: fix your weakest topic, do 8 MCQs, and grade 1 FRQ.</div>
        </Card>
      </section>
    </main>
  );
}
