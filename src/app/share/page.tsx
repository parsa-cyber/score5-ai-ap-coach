"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, Share2 } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Card } from "@/components/Card";
import { getDiagnosticResult, getProfile } from "@/lib/storage";
import { getCourseInfo } from "@/data/courses";

export default function SharePage() {
  const [result, setResult] = useState<ReturnType<typeof getDiagnosticResult>>(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => setResult(getDiagnosticResult()), []);
  const profile = getProfile();
  const courseInfo = getCourseInfo(result?.course || profile.course);
  const text = useMemo(() => {
    const score = result ? `${Math.max(1, result.score - 1)}–${result.score}` : "?";
    const weak = result?.weakUnits?.[0] || profile.hardestTopics[0] || "my weakest unit";
    return `I’m currently predicted around a ${score} on ${courseInfo.shortName}. My biggest weak area is ${weak}. Try Score5: ${typeof window !== "undefined" ? window.location.origin : "https://score5-ai-ap-coach.vercel.app"}`;
  }, [result, profile.hardestTopics, courseInfo.shortName]);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main>
      <Nav />
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-700">Shareable results</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Make Score5 spread in group chats.</h1>
        <p className="mt-2 text-slate-600">Students can choose to share a clean diagnostic result. Nothing is public unless they copy/share it.</p>
        <Card className="mt-8 bg-gradient-to-br from-brand-50 to-white">
          <div className="rounded-3xl bg-white p-6 shadow-soft">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-700">Score5 Diagnostic</p>
            <h2 className="mt-2 text-3xl font-black">{courseInfo.shortName} predicted score: {result ? `${Math.max(1, result.score - 1)}–${result.score}` : "Take diagnostic first"}</h2>
            <p className="mt-2 text-slate-600">Readiness: {result ? `${result.readiness}%` : "—"}</p>
            <div className="mt-5 grid gap-3">
              {(result?.weakUnits || profile.hardestTopics).slice(0, 3).map((unit, i) => (
                <div key={unit} className="rounded-2xl bg-slate-50 p-4 font-bold">{i + 1}. {unit}</div>
              ))}
            </div>
          </div>
          <textarea value={text} readOnly rows={4} className="mt-5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6" />
          <button onClick={copy} className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 font-black text-white"><Copy size={16}/>{copied ? "Copied" : "Copy share text"}</button>
          <button onClick={() => navigator.share?.({ text }).catch(() => null)} className="ml-3 mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-3 font-black text-slate-800"><Share2 size={16}/> Native share</button>
        </Card>
      </section>
    </main>
  );
}
