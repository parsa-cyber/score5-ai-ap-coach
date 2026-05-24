"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Crown, LogOut, Mail, ShieldCheck, UserRound } from "lucide-react";
import { Nav } from "@/components/Nav";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useSubscription } from "@/hooks/useSubscription";

type AccountUser = {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
};

export default function AccountPage() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [user, setUser] = useState<AccountUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [billingLoading, setBillingLoading] = useState(false);
  const billing = useSubscription();

  useEffect(() => {
    async function loadUser() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      const { data } = await supabase.auth.getUser();
      setUser((data.user as AccountUser | null) ?? null);
      setLoading(false);
    }

    loadUser();
  }, [supabase]);


  async function openBillingPortal() {
    if (!supabase) return;
    setBillingLoading(true);
    setMessage("");
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        setMessage("Sign in first.");
        return;
      }
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await res.json();
      if (payload.url) window.location.href = payload.url;
      else setMessage(payload.message || "Could not open billing portal.");
    } catch {
      setMessage("Could not open billing portal.");
    } finally {
      setBillingLoading(false);
    }
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setMessage("Signed out.");
  }

  const displayName = typeof user?.user_metadata?.full_name === "string" ? user.user_metadata.full_name : "Score5 student";

  return (
    <main>
      <Nav />
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
          <div className="mb-8 flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-3xl bg-brand-100 text-brand-700">
              <UserRound size={28} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-brand-700">Account</p>
              <h1 className="text-3xl font-black text-slate-950">Your Score5 profile</h1>
            </div>
          </div>

          {!supabase && (
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
              Supabase is not configured yet. Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code>.env.local</code> to enable real accounts.
            </div>
          )}

          {loading && <p className="text-slate-600">Loading account...</p>}

          {!loading && !user && supabase && (
            <div className="rounded-3xl bg-slate-50 p-6">
              <h2 className="text-xl font-black text-slate-950">You are not signed in yet.</h2>
              <p className="mt-2 text-slate-600">Create an account with an email verification code or Google.</p>
              <Link href="/auth" className="mt-5 inline-flex rounded-2xl bg-slate-950 px-5 py-3 font-black text-white hover:bg-brand-700">
                Sign in or create account
              </Link>
            </div>
          )}

          {!loading && user && (
            <div className="space-y-5">
              <div className="rounded-3xl bg-slate-50 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-slate-500">Signed in as</p>
                    <h2 className="text-2xl font-black text-slate-950">{displayName}</h2>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">
                    <ShieldCheck size={17} /> Verified session
                  </span>
                </div>
                <div className="mt-5 flex items-center gap-3 rounded-2xl bg-white p-4 text-slate-700">
                  <Mail size={18} className="text-brand-700" />
                  {user.email || "No email returned"}
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-slate-500">Membership</p>
                    <h3 className="text-2xl font-black text-slate-950">{billing.isPro ? "Score5 Pro" : "Free plan"}</h3>
                    <p className="mt-1 text-sm text-slate-600">{billing.isPro ? "Unlimited AI tutor, FRQ grading, screenshot coach, and practice." : "Upgrade to unlock unlimited AI tutoring, FRQ grading, screenshot analysis, and practice."}</p>
                  </div>
                  <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black ${billing.isPro ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>
                    <Crown size={17} /> {billing.isPro ? "Pro active" : "Free"}
                  </span>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {billing.isPro ? (
                    <button onClick={openBillingPortal} disabled={billingLoading} className="rounded-2xl bg-slate-950 px-5 py-3 font-black text-white disabled:opacity-50">
                      {billingLoading ? "Opening..." : "Manage billing"}
                    </button>
                  ) : (
                    <Link href="/pricing" className="rounded-2xl bg-slate-950 px-5 py-3 font-black text-white">Upgrade to Pro</Link>
                  )}
                </div>
              </div>

              <button
                onClick={signOut}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 font-bold text-slate-700 hover:bg-slate-50"
              >
                <LogOut size={18} /> Sign out
              </button>
            </div>
          )}

          {message && <p className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 font-semibold text-emerald-700">{message}</p>}
        </div>
      </section>
    </main>
  );
}
