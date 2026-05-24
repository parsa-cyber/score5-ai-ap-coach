"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, Gift, Users } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Card, StatCard } from "@/components/Card";
import { addReferralInvite, getReferralState } from "@/lib/storage";

export default function ReferralsPage() {
  const [state, setState] = useState({ code: "", invites: 0, proRewardDays: 0 });
  const [copied, setCopied] = useState(false);
  useEffect(() => setState(getReferralState()), []);
  const link = useMemo(() => typeof window === "undefined" ? "" : `${window.location.origin}/?ref=${state.code}`, [state.code]);
  async function copy() {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }
  return (
    <main>
      <Nav />
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-700">Referral rewards</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Turn users into growth.</h1>
        <p className="mt-2 text-slate-600">Invite friends. Reward sharing. This is built for school group chats, Discords, and AP season word-of-mouth.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <StatCard label="Invites" value={state.invites} helper="tracked locally for MVP" />
          <StatCard label="Reward" value={`${state.proRewardDays} days`} helper="Pro reward unlocked" />
          <StatCard label="Next milestone" value={state.invites < 3 ? 3 : 10} helper="invites" />
        </div>
        <Card className="mt-5">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-100 text-brand-700"><Gift /></span>
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-black">Your referral link</h2>
              <p className="mt-2 break-all rounded-2xl bg-slate-50 p-4 font-mono text-sm text-slate-700">{link || "Loading..."}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button onClick={copy} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 font-black text-white"><Copy size={16}/>{copied ? "Copied" : "Copy link"}</button>
                <button onClick={() => setState(addReferralInvite())} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-3 font-black text-slate-800"><Users size={16}/> Simulate invite</button>
              </div>
            </div>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4"><b>Invite 3 friends</b><p className="text-sm text-slate-600">Unlock 7 days of Pro.</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><b>Invite 10 friends</b><p className="text-sm text-slate-600">Unlock 1 month of Pro.</p></div>
          </div>
        </Card>
      </section>
    </main>
  );
}
