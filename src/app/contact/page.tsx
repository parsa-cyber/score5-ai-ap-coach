import { Mail } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Card } from "@/components/Card";

export default function ContactPage() {
  return <main><Nav/><section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8"><p className="text-sm font-black uppercase tracking-[0.2em] text-brand-700">Contact</p><h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Contact Score5</h1><Card className="mt-8"><Mail className="text-brand-600"/><p className="mt-3 text-slate-600">For support, refunds, school inquiries, bug reports, or partnership questions, email the Score5 team from the email connected to your account.</p><p className="mt-4 rounded-2xl bg-slate-50 p-4 font-mono text-sm">support@score5.app</p><p className="mt-3 text-sm text-slate-500">Replace this with your real support email/domain before launching paid traffic.</p></Card></section></main>;
}
