import Link from "next/link";
import { BarChart3, ClipboardList, GraduationCap, Users } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Card } from "@/components/Card";

export default function TeacherPage() {
  const features = [
    [Users, "Class roster", "Invite students and see who completed diagnostics and practice."],
    [BarChart3, "Weakness reports", "Find class-wide weak units before tests or AP review sessions."],
    [ClipboardList, "Assignments", "Assign targeted MCQ/FRQ sets by course, unit, and skill."],
  ] as const;
  return (
    <main>
      <Nav />
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-700">Teacher mode</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">A future classroom plan for Score5.</h1>
        <p className="mt-2 max-w-3xl text-slate-600">Student growth is the priority now, but a teacher plan creates a stronger long-term SaaS path: class dashboards, assignments, and weakness reports.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {features.map(([Icon, title, copy]) => <Card key={title}><Icon className="text-brand-600"/><h2 className="mt-4 text-xl font-black">{title}</h2><p className="mt-2 text-slate-600">{copy}</p></Card>)}
        </div>
        <Card className="mt-5 bg-slate-950 text-white">
          <GraduationCap /><h2 className="mt-3 text-2xl font-black">Suggested teacher price</h2><p className="mt-2 text-slate-300">$99/year per class after the student product proves traction. Don’t sell to schools first; sell to students first.</p><Link href="/contact" className="mt-4 inline-flex rounded-full bg-white px-5 py-3 font-black text-slate-950">Join teacher waitlist</Link>
        </Card>
      </section>
    </main>
  );
}
