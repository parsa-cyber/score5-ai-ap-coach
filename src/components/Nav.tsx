import Link from "next/link";
import { BrainCircuit } from "lucide-react";

const links = [
  ["Courses", "/courses"],
  ["Dashboard", "/dashboard"],
  ["Practice", "/practice"],
  ["AI Tutor", "/tutor"],
  ["FRQ Grader", "/frq"],
  ["Screenshots", "/screenshots"],
  ["Reviews", "/reviews"],
  ["Progress", "/progress"],
  ["Pricing", "/pricing"],
  ["Account", "/account"],
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-black tracking-tight text-slate-950">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-brand-600 text-white shadow-soft"><BrainCircuit size={19} /></span>
          <span>Score5</span>
        </Link>
        <nav className="hidden items-center gap-4 text-sm font-medium text-slate-600 lg:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="transition hover:text-brand-700">{label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/auth" className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 sm:inline-flex">
            Sign in
          </Link>
          <Link href="/diagnostic" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">
            Start diagnostic
          </Link>
        </div>
      </div>
    </header>
  );
}
