"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [message, setMessage] = useState("Finishing sign-in...");

  useEffect(() => {
    async function finish() {
      const next = searchParams.get("next") || "/dashboard";
      const code = searchParams.get("code");

      if (!supabase) {
        setMessage("Supabase is not configured. Add your Supabase URL and anon key to .env.local.");
        return;
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setMessage(error.message);
          return;
        }
      }

      router.replace(next);
      router.refresh();
    }

    finish();
  }, [router, searchParams, supabase]);

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-soft">
        <Loader2 className="mx-auto mb-4 animate-spin text-brand-700" size={32} />
        <h1 className="text-2xl font-black text-slate-950">Score5</h1>
        <p className="mt-2 max-w-sm text-slate-600">{message}</p>
      </div>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<main className="grid min-h-screen place-items-center bg-slate-50 text-slate-600">Finishing sign-in...</main>}>
      <AuthCallbackContent />
    </Suspense>
  );
}
