"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, GraduationCap, Loader2, Mail, ShieldCheck } from "lucide-react";
import { Nav } from "@/components/Nav";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const authConfigured = Boolean(supabase);

  async function sendCode() {
    setError("");
    setStatus("");

    if (!supabase) {
      setError("Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.");
      return;
    }

    if (!email.includes("@")) {
      setError("Enter a real email address first.");
      return;
    }

    setLoading(true);
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${getBaseUrl()}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    setLoading(false);

    if (otpError) {
      setError(otpError.message);
      return;
    }

    setStep("code");
    setStatus("Verification code sent. Check your email, then enter the 6-digit code here.");
  }

  async function verifyCode() {
    setError("");
    setStatus("");

    if (!supabase) {
      setError("Supabase is not configured yet.");
      return;
    }

    const cleaned = code.replace(/\s/g, "");
    if (cleaned.length < 6) {
      setError("Enter the full verification code from your email.");
      return;
    }

    setLoading(true);
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: cleaned,
      type: "email",
    });
    setLoading(false);

    if (verifyError) {
      setError(verifyError.message);
      return;
    }

    setStatus("Account verified. Redirecting...");
    router.push(next);
    router.refresh();
  }

  async function signInWithGoogle() {
    setError("");
    if (!supabase) {
      setError("Supabase is not configured yet. Add your Supabase URL and anon key first.");
      return;
    }

    const { error: googleError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${getBaseUrl()}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    if (googleError) setError(googleError.message);
  }

  return (
    <main>
      <Nav />
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
        <div className="space-y-6">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-brand-700">Score5 Accounts</p>
          <h1 className="max-w-2xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Sign up with an email code or Google.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-slate-600">
            Students can create a real account, verify their email, and keep their AP progress tied to their profile once Supabase is connected.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              [Mail, "Email code", "No password needed"],
              [ShieldCheck, "Verified users", "Code must match email"],
              [GraduationCap, "Student profile", "Ready for saved progress"],
            ].map(([Icon, title, text]) => (
              <div key={String(title)} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
                <Icon className="mb-3 text-brand-700" size={22} />
                <p className="font-bold text-slate-950">{String(title)}</p>
                <p className="text-sm text-slate-500">{String(text)}</p>
              </div>
            ))}
          </div>
          {!authConfigured && (
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
              <strong>Setup needed:</strong> add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code>.env.local</code>. The page is built, but real email/Google auth needs your Supabase project keys.
            </div>
          )}
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-brand-700">Create or sign in</p>
              <h2 className="text-2xl font-black text-slate-950">Student account</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">Secure auth</span>
          </div>

          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={loading || !authConfigured}
            className="mb-5 flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-800 transition hover:border-brand-300 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-slate-950 text-sm font-black text-white">G</span>
            Continue with Google
          </button>

          <div className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            or use email code
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">Email</span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={loading || step === "code"}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-950 outline-none ring-brand-200 transition focus:border-brand-400 focus:ring-4 disabled:bg-slate-50"
              />
            </label>

            {step === "code" && (
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">Verification code</span>
                <input
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  inputMode="numeric"
                  placeholder="123456"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-950 outline-none ring-brand-200 transition focus:border-brand-400 focus:ring-4"
                />
              </label>
            )}

            {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
            {status && <div className="flex items-start gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"><CheckCircle2 size={18} />{status}</div>}

            {step === "email" ? (
              <button
                type="button"
                onClick={sendCode}
                disabled={loading || !authConfigured}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 font-black text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Mail size={18} />}
                Send verification code
              </button>
            ) : (
              <button
                type="button"
                onClick={verifyCode}
                disabled={loading || !authConfigured}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 px-5 py-4 font-black text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={18} />}
                Verify and continue
              </button>
            )}

            {step === "code" && (
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setCode("");
                  setStatus("");
                }}
                className="w-full rounded-2xl px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50"
              >
                Use a different email
              </button>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already verified? Use the same email or Google account and Score5 will sign you in. <Link href="/account" className="font-bold text-brand-700">View account</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<main className="grid min-h-screen place-items-center bg-slate-50 text-slate-600">Loading Score5 auth...</main>}>
      <AuthPageContent />
    </Suspense>
  );
}
