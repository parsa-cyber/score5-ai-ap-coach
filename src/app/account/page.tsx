"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { LogOut, Mail, ShieldCheck, UserRound } from "lucide-react";
import { Nav } from "@/components/Nav";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

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
